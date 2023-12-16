<template>
  <v-container class="config-logos white--text" ma-0 pa-0 fluid color="white">
    <v-row class="text-center align-center justify-center">
      <v-col cols="6">
        <v-card max-width="400" class="justify-center text-center mx-auto pa-3">
          <v-card-title class="subtitle-1">
            <template v-if="logoImage">
              Збережене лого
            </template>
            <template v-else>
              <template v-if="nextFile">
                Вибране лого (ще не збережене)
              </template>
              <template v-else>
                Лого не вибрано
              </template>
            </template>
          </v-card-title>

          <v-img v-if="nextLogoTemporary" class="my-2" :src="nextLogoTemporary" contain />
          <v-img v-else-if="logoImage" class="my-2" :src="logoImage" contain />
          <v-file-input accept="image/*" v-model="nextFile" label="Виберіть файл" :prepend-icon="null"
            prepend-inner-icon="mdi-paperclip" outlined :show-size="1000" hide-details 
          />
          <v-select class="mt-2" v-model="selectedCompetitionType" :items="sportTypes"
            label="Вид змаганнь" hide-details
          />
          <v-select class="mt-2" v-model="selectedDirection" :items="logoDirectionItems"
            label="Розміщення логотипу" hide-details 
          />
          <v-select class="mt-2" v-model="selectedGender" :items="genderItems"
            label="Стать" hide-details
          />
        
          <v-btn 
            :disabled="!nextFile || !selectedCompetitionType || !selectedGender || !selectedDirection"
            color="light-green" block class="mt-2"
            @click="saveNextLogo"
          >
            Зберегти
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-alert
        v-model="showAlert"
        ref="alertDialog"
        :type="alertType"
        dismissible
        class="alert-message"
    >
      {{ alertMessage }}
    </v-alert>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      logoDirectionItems: [
        {
          value: 'LEFT', text: 'Зліва'
        },
        {
          value: 'RIGHT', text: 'Зправа'
        },
      ],
      genderItems: [
        {
          value: 'MAN', text: 'Чоловіки'
        },
        {
          value: 'WOMAN', text: 'Жінки'
        },
      ],
      logos: [],
      logoImage: null,
      nextFile: null,

      availableSportTypes: [],
      selectedDirection: 'LEFT',
      selectedGender: null,
      selectedCompetitionType: null,

      alertType: 'error',
      showAlert: false,
      alertMessage: '',
    }
  },
  computed: {
    currentLogo() {
      const [direction, selectedCompetitionType] = [this.selectedDirection, this.selectedCompetitionType];
      return this.logos.find(({ fileDirection, competition }) => fileDirection === direction && selectedCompetitionType === competition) || null;
    },
    competitionId() {
      return this.$route.params.id;
    },
    nextLogoTemporary() {
      const nextFile = this.nextFile;
      if (nextFile) {
        return URL.createObjectURL(nextFile);
      }
      return null;
    },
    sportTypes() {
      return this.availableSportTypes.map((sportType) => ({
          value: sportType,
          text: this.$t(`const.${sportType}`)
      }));
    },
  },
  watch: {
    currentLogo: {
      handler(currentLogo) {
        if (currentLogo?.reference) {
          this.retrieveFileReference(currentLogo.reference)
        } else {
          this.logoImage = null;
        }
      }
    },
  },
  mounted() {
    this.parseFiles();
  },
  methods: {
    async parseFiles() {
      const {data} = await this.axios.get(`private/files/competition/${this.competitionId}`);
      this.logos = data; // @TODO data.files
      this.availableSportTypes = ["ASSAULT_LADDER", "DUELING", "HUNDRED_METER"] // @TODO data.competitionTypes
    },
    async retrieveFileReference(reference) {
      const data = await this.axios.get(`private/files/${reference}`);
      this.logoImage = data.config ? data.config?.baseURL + data.config?.url : null;
      this.nextFile = null;
    },
    async saveNextLogo() {
      const file = this.nextFile;
      if (!file) return console.error('no file selected')
      var formData = new FormData();
      formData.append("file", file);
      return this.axios
        .post(`private/files/competition/${this.competitionId}?fileDirection=${this.selectedDirection}&gender=${this.selectedGender}&competition=${this.selectedCompetitionType}`, 
            formData, {headers: {'Content-Type': 'multipart/form-data'}}
        )
        .then(() => this.parseFiles())
        .catch((error) => this.showError(error))
    },
    showError(error) {
        this.alertMessage = error.response && error.response.data.description ? error.response.data.description : error.message;
        this.showAlert = true;
    }
  }
}
</script>
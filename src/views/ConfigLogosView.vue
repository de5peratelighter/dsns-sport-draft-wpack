<template>
  <v-container class="config-logos white--text" ma-0 pa-0 fluid color="white">
    <v-row class="text-center align-center justify-center">
      <v-col cols="6">
        <v-card max-width="800" class="justify-center text-center mx-auto pa-3">
          <v-card-title class="text-center subtitle-1">
              Логотипи
          </v-card-title>
          <template>
            <v-row class="flex-container">
              <v-col cols="6">
                <v-file-input class="smaller-input" accept="image/*" v-model="nextFileLeft" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details @change="saveNextLogo('LEFT')" />
                <p class="text-caption">(Верхній логотип з ліва)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="nextFileRight.file" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details @change="saveNextLogo('RIGHT')" />
                <p class="text-caption">(Верхній логотип з права)</p>
                <v-file-input accept="image/*" v-model="nextFileMan" label="Виберіть файл" :prepend-icon="null"
                  prepend-inner-icon="mdi-paperclip" outlined :show-size="1000" hide-details />
                <p class="text-caption">(Стать чоловіча)</p>
                <v-file-input accept="image/*" v-model="nextFileWoman" label="Виберіть файл" :prepend-icon="null"
                  prepend-inner-icon="mdi-paperclip" outlined :show-size="1000" hide-details />
                <p class="text-caption">(Стать жіноча)</p>
              </v-col>
              <v-col cols="6">
                <v-file-input accept="image/*" v-model="nextFileRight" label="Виберіть файл" :prepend-icon="null"
                  prepend-inner-icon="mdi-paperclip" outlined :show-size="1000" hide-details />
                <p class="text-caption">(Штурмова драбина)</p>
                <v-file-input accept="image/*" v-model="nextFileRight" label="Виберіть файл" :prepend-icon="null"
                  prepend-inner-icon="mdi-paperclip" outlined :show-size="1000" hide-details />
                <p class="text-caption">(100-метрова смуга)</p>
                <v-file-input accept="image/*" v-model="nextFileRight" label="Виберіть файл" :prepend-icon="null"
                  prepend-inner-icon="mdi-paperclip" outlined :show-size="1000" hide-details />
                <p class="text-caption">(Двоєборство)</p>
                <v-file-input accept="image/*" v-model="nextFileRight" label="Виберіть файл" :prepend-icon="null"
                  prepend-inner-icon="mdi-paperclip" outlined :show-size="1000" hide-details />
                <p class="text-caption">(Пожежна естафета)</p>
                <v-file-input accept="image/*" v-model="nextFileRight" label="Виберіть файл" :prepend-icon="null"
                  prepend-inner-icon="mdi-paperclip" outlined :show-size="1000" hide-details />
                <p class="text-caption">(Бойове розгортання)</p>
                <v-file-input accept="image/*" v-model="nextFileRight" label="Виберіть файл" :prepend-icon="null"
                  prepend-inner-icon="mdi-paperclip" outlined :show-size="1000" hide-details />
                <p class="text-caption">(Висувна драбина)</p>
              </v-col>
            </v-row>
          </template>
          <!-- <v-btn :disabled="!nextFile || !selectedCompetitionType || !selectedGender || !selectedDirection"
            color="light-green" block class="mt-2" @click="saveNextLogo">
            Зберегти
          </v-btn> -->
        </v-card>
      </v-col>
    </v-row>
    <v-alert v-model="showAlert" ref="alertDialog" :type="alertType" dismissible class="alert-message">
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
      nextFileLeft: {
        file: null,
        fileDirection: 'LEFT',
      },
      nextFileRight: {
        file: null,
        fileDirection: 'RIGHT',
      },
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
      const { data } = await this.axios.get(`private/files/competition/${this.competitionId}`);
      this.logos = data; // @TODO data.files
      this.availableSportTypes = ["ASSAULT_LADDER", "DUELING", "HUNDRED_METER"] // @TODO data.competitionTypes
    },
    async retrieveFileReference(reference) {
      const data = await this.axios.get(`private/files/${reference}`);
      this.logoImage = data.config ? data.config?.baseURL + data.config?.url : null;
      this.nextFile = null;
    },
    async saveNextLogo(fileDirection, gender, competitionType) {
      const fileData = this.nextFileLeft.fileDirection === fileDirection ? this.nextFileLeft : this.nextFileRight;
      const file = fileData.file;

      if (!file) {
        console.error('No file selected');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileDirection', fileDirection);
      formData.append('gender', gender);
      formData.append('competitionType', competitionType);

      try {
        await this.axios.post(`/api/v1/private/files/competition/${this.competitionId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.parseFiles();
      } catch (error) {
        this.showError(error);
      }
    },
    },
    showError(error) {
      this.alertMessage = error.response && error.response.data.description ? error.response.data.description : error.message;
      this.showAlert = true;
    }
  }
</script>

<style>
.text-center {
  justify-content: center;
}
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.text-caption {
  color: #777;
  margin-top: 5px;
}
</style>
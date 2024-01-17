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
                  <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.LEFT" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('LEFT')" />
                <p class="text-caption">(Верхній логотип з ліва)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.RIGHT" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('RIGHT')" />
                <p class="text-caption">(Верхній логотип з права)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.MAN" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('MAN')" />
                <p class="text-caption">(Стать чоловіча)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.WOMAN" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('WOMAN')" />
                <p class="text-caption">(Стать жіноча)</p>
              </v-col>
              <v-col cols="6">
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.ASSAULT_LADDER" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('ASSAULT_LADDER')" />
                <p class="text-caption">(Штурмова драбина)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.HUNDRED_METTER" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('HUNDRED_METTER')" />
                <p class="text-caption">(100-метрова смуга)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.DUELLING" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('DUELLING')" />
                <p class="text-caption">(Двоєборство)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.RELAY" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('RELAY')" />
                <p class="text-caption">(Пожежна естафета)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.COMBAT_DEPLOYMENT" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('COMBAT_DEPLOYMENT')" />
                <p class="text-caption">(Бойове розгортання)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.RETRACTABLE_LADDER" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('RETRACTABLE_LADDER')" />
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
      logos: [],
      logoFiles: {
        LEFT: null,
        RIGHT: null,
        MAN: null,
        WOMAN: null,
        ASSAULT_LADDER: null,
        HUNDRED_METTER: null,
        DUELLING: null,
        RELAY: null,
        COMBAT_DEPLOYMENT: null,
        RETRACTABLE_LADDER: null,
      },
      logoImage: null,
      nextFile: null,
      selectedDirection: 'LEFT',
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
    async saveNextLogo(direction) {
      const file = this.logoFiles[direction];
      if (!file) return console.error('Файл не вибраний для напрямку', direction);

      const formData = new FormData();
      formData.append('file', file);

      try {
        await this.axios.post(`private/files/competition/${this.competitionId}?fileDirection=${direction}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await this.parseFiles();
      } catch (error) {
        this.showError(error);
      }
    },
    showError(error) {
      this.alertMessage = error.response && error.response.data.description ? error.response.data.description : error.message;
      this.showAlert = true;
    }
  }
}
</script>
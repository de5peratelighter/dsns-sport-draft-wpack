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
                <img v-if="logoImage.LEFT" :src="logoImage.LEFT" alt="LEFT Logo" class="logo-image" height="40">
                <p class="text-caption">(Верхній логотип з ліва)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.RIGHT" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('RIGHT')" />
                <img v-if="logoImage.RIGHT" :src="logoImage.RIGHT" alt="RIGHT Logo" class="logo-image" height="40">
                <p class="text-caption">(Верхній логотип з права)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.MAN" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('MAN')" />
                <img v-if="logoImage.MAN" :src="logoImage.MAN" alt="MAN Logo" class="logo-image" height="40">
                <p class="text-caption">(Стать чоловіча)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.WOMAN" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('WOMAN')" />
                <img v-if="logoImage.WOMAN" :src="logoImage.WOMAN" alt="WOMAN Logo" class="logo-image" height="40">
                <p class="text-caption">(Стать жіноча)</p>
              </v-col>
              <v-col cols="6">
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.ASSAULT_LADDER"
                  label="Виберіть файл" :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('ASSAULT_LADDER')" />
                  <img v-if="logoImage.ASSAULT_LADDER" :src="logoImage.ASSAULT_LADDER" alt="ASSAULT LADDER Logo" class="logo-image" height="40">
                <p class="text-caption">(Штурмова драбина)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.HUNDRED_METER"
                  label="Виберіть файл" :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('HUNDRED_METER')" />
                  <img v-if="logoImage.HUNDRED_METER" :src="logoImage.HUNDRED_METER" alt="HUNDRED METER Logo" class="logo-image" height="40">
                <p class="text-caption">(100-метрова смуга)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.DUELING" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('DUELING')" />
                  <img v-if="logoImage.DUELING" :src="logoImage.DUELING" alt="DUELING Logo" class="logo-image" height="40">
                <p class="text-caption">(Двоєборство)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.RELAY" label="Виберіть файл"
                  :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('RELAY')" />
                  <img v-if="logoImage.RELAY" :src="logoImage.RELAY" alt="RELAY Logo" class="logo-image" height="40">
                <p class="text-caption">(Пожежна естафета)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.COMBAT_DEPLOYMENT"
                  label="Виберіть файл" :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('COMBAT_DEPLOYMENT')" />
                  <img v-if="logoImage.COMBAT_DEPLOYMENT" :src="logoImage.COMBAT_DEPLOYMENT" alt="RELAY Logo" class="logo-image" height="40">
                <p class="text-caption">(Бойове розгортання)</p>
                <v-file-input class="smaller-input" accept="image/*" v-model="logoFiles.RETRACTABLE_LADDER"
                  label="Виберіть файл" :prepend-icon="null" prepend-inner-icon="mdi-paperclip" outlined hide-details
                  @change="saveNextLogo('RETRACTABLE_LADDER')" />
                  <img v-if="logoImage.RETRACTABLE_LADDER" :src="logoImage.RETRACTABLE_LADDER" alt="RELAY Logo" class="logo-image" height="40">
                <p class="text-caption">(Висувна драбина)</p>
              </v-col>
            </v-row>
          </template>
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
        HUNDRED_METER: null,
        DUELING: null,
        RELAY: null,
        COMBAT_DEPLOYMENT: null,
        RETRACTABLE_LADDER: null,
      },
      logoImage: {
        LEFT: null,
        RIGHT: null,
        MAN: null,
        WOMAN: null,
        ASSAULT_LADDER: null,
        HUNDRED_METER: null,
        DUELING: null,
        RELAY: null,
        COMBAT_DEPLOYMENT: null,
        RETRACTABLE_LADDER: null,
      },
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
      this.logos = data;
      this.loadLogoImages(); 
    },
    async retrieveFileReference(reference) {
      const data = await this.axios.get(`private/files/${reference}`);
      return data.config ? data.config.baseURL + data.config.url : null;
    },
    async loadLogoImages() {
      for (const logo of this.logos) {
        const image = await this.retrieveFileReference(logo.reference);
        this.$set(this.logoImage, logo.fileDirection, image);
      }
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
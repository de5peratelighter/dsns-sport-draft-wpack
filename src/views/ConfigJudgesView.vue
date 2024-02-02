<template>
  <v-container class="config-judges white--text" ma-0 pa-0 fluid>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular :size="100" color="white" indeterminate></v-progress-circular>
    </div>
    <template v-else>
      <v-data-table :headers="mainConfigurationHeaders" :items="coreJudges" item-key="judgeType" dense disable-sort
        disable-pagination hide-default-footer>
        <template v-slot:[`item.${translationKey}`]="{ item }">
          {{ judgeTranslations.coreJudgesTypes[item.judgeType] }}
        </template>
        <template v-slot:[`item.${nameKey}`]="{ item }">
          <v-select v-model="item[nameKey]" :items="participantCategoryItems" item-text="categoryName"
            item-value="qualificationId" hide-details></v-select>
        </template>
        <template v-slot:[`item.${initialsKey}`]="{ item }">
          <v-text-field v-model="item[initialsKey]" hide-details></v-text-field>
        </template>
      </v-data-table>
      <v-spacer class="my-3" />
      <v-data-table :headers="seniorConfigurationHeaders" :items="competitionJudges" dense disable-sort disable-pagination
        hide-default-footer>
        <template v-slot:[`item.${translationKey}`]="{ item }">
          {{ judgeTranslations.competitionJudgesTypes[item.judgeType] }}
        </template>
        <template v-slot:[`item.${nameKey}`]="{ item }">
          <v-select v-model="item[nameKey]" :items="participantCategoryItems" item-text="categoryName"
            item-value="qualificationId" hide-details></v-select>
        </template>
        <template v-slot:[`item.${initialsKey}`]="{ item }">
          <v-text-field v-model="item[initialsKey]" hide-details></v-text-field>
        </template>
        <template v-slot:[`item.${nameKey}_senior`]="{ item }">
          <v-text-field v-model="item[nameKey + '_senior']" label="Ім'я та прізвище старшого судді"
            hide-details></v-text-field>
        </template>
      </v-data-table>
      <v-spacer class="my-3" />
      <v-data-table :headers="assistantConfigurationHeaders" :items="competitionAssistJudges" dense disable-sort
        disable-pagination hide-default-footer>
        <template v-slot:[`item.${translationKey}`]="{ item }">
          {{ judgeTranslations.competitionAssistJudgesTypes[item.judgeType] }}
        </template>
        <template v-slot:[`item.${nameKey}`]="{ item }">
          <v-select v-model="item[nameKey]" :items="participantCategoryItems" item-text="categoryName"
            item-value="qualificationId" hide-details></v-select>
        </template>
        <template v-slot:[`item.${initialsKey}`]="{ item }">
          <v-text-field v-model="item[initialsKey]" hide-details></v-text-field>
        </template>
      </v-data-table>

      <div class="mt-3 d-flex justify-space-between">
        <v-btn color="light-green white--text" @click="saveJudges">
          Зберегти
        </v-btn>
        <v-btn color="white" @click="$router.push({ name: 'editCompetition', params: { id: $route.params.id } })">
          Скасувати
        </v-btn>
      </div>
    </template>
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" multi-line>
      <v-row class="text-center justify-center align-center">
        <h4 class="text-center mb-0 ml-2" v-if="snackbarError">Помилка! {{ snackbarError }}</h4>
        <h4 class="text-center mb-0 ml-2" v-else>{{ 'Зміни збережені !' }}</h4>
        <v-btn class="ml-2" text @click="resetSnackbar()">
          Закрити
        </v-btn>
      </v-row>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      nameKey: 'judgeSportTitle',
      initialsKey: 'initials',
      translationKey: 'description',
      isLoading: true,

      coreJudges: [],
      competitionJudges: [],
      competitionAssistJudges: [],
      showSnackbar: false,
      snackbarColor: 'primary',
      snackbarError: '',
      participantCategoryItems: [
        { categoryName: 'cуддя міжнародної категорії', qualificationId: 'IC' },
        { categoryName: 'cуддя національної категорії', qualificationId: 'NC' },
        { categoryName: 'cуддя I категорії', qualificationId: 'ICAT' },
        { categoryName: 'cуддя II категорії', categoryId: 'IICAT' },
      ],
    }
  },
  computed: {
    competitionId() {
      return this.$route.params.id;
    },
    mainConfigurationHeaders() {
      return [
        { text: '', value: this.translationKey, width: '20%' },
        { text: 'Суддівська кваліфікація', value: this.nameKey, width: '45%' },
        { text: 'Призвіще, ініціали', value: this.initialsKey, width: '35%' },
      ]
    },
    seniorConfigurationHeaders() {
      return [
        { text: 'Старший суддя', value: this.translationKey, width: '20%' },
        { text: 'Суддівська кваліфікація', value: this.nameKey, width: '45%' },
        { text: 'Призвіще, ініціали', value: this.initialsKey, width: '35%' },
      ]
    },
    assistantConfigurationHeaders() {
      return [
        { text: 'Заступник старшого судді', value: this.translationKey, width: '20%' },
        { text: 'Суддівська кваліфікація', value: this.nameKey, width: '45%' },
        { text: 'Призвіще, ініціали', value: this.initialsKey, width: '35%' },
      ]
    },
    judgeTranslations() {
      const coreJudgesTypes = {
        MAIN: 'Головний суддя змаганнь',
        MAIN_SECRETARY: 'Головний секретар змаганнь',
        INSPECTOR: 'Суддя-інспектор змаганнь',
        STARTER: 'Основний стартер',
        ASSISTANCE_STARTER: 'Помічник стартера'
      };
      const competitionJudgesTypes = {
        JUDGE_ASSAULT_LADDER: 'Штурмова драбина',
        JUDGE_HUNDRED_METER: '100 метро а смуга',
        JUDGE_DUELING: 'Двоборство',
        JUDGE_RETRACTABLE_LADDER: 'Висувна драбина',
        JUDGE_RELAY: 'Пожежна естафета',
        JUDGE_COMBAT_DEPLOYMENT: 'Бойове розгортання'
      };
      const competitionAssistJudgesTypes = {
        ASSISTANCE_ASSAULT_LADDER: 'Штурмова драбина',
        ASSISTANCE_HUNDRED_METER: '100 метрова смуга',
        ASSISTANCE_DUELING: 'Двоборство',
        ASSISTANCE_RETRACTABLE_LADDER: 'Висувна драбина',
        ASSISTANCE_RELAY: 'Пожежна естафета',
        ASSISTANCE_COMBAT_DEPLOYMENT: 'Бойове розгортання'
      };
      return {
        coreJudgesTypes,
        competitionJudgesTypes,
        competitionAssistJudgesTypes
      }
    }
  },
  async mounted() {
    try {
      await this.getCompetitionReferences();
      await this.fetchJudgesConfigurations();
    } catch (error) {
      this.isLoading = false;
    }
  },
  methods: {
    assignJudgedConfig(configJudges = []) {
      const judgesTypes = this.judgeTranslations;
      const competitionReferences = this.competitionReferences.map(({ sportType }) => sportType);
      const coreJudges = Object.keys(judgesTypes.coreJudgesTypes).map((judgeType) => {
        const foundConfig = configJudges.find((judge) => judgeType === judge.judgeType);
        if (foundConfig) return foundConfig;
        return {
          judgeType,
          initials: '',
          judgeSportTitle: '',
        }
      });
      const competitionJudges = Object.keys(judgesTypes.competitionJudgesTypes)
        .filter((judgeType) => competitionReferences.some(v => judgeType.indexOf(v) > -1))
        .map((judgeType) => {
          const foundConfig = configJudges.find((judge) => judgeType === judge.judgeType);
          if (foundConfig) return foundConfig;
          return {
            judgeType,
            initials: '',
            judgeSportTitle: '',
          }
        });
      const competitionAssistJudges = Object.keys(judgesTypes.competitionAssistJudgesTypes)
        .filter((judgeType) => competitionReferences.some(v => judgeType.indexOf(v) > -1))
        .map((judgeType) => {
          const foundConfig = configJudges.find((judge) => judgeType === judge.judgeType);
          if (foundConfig) return foundConfig;
          return {
            judgeType,
            initials: '',
            judgeSportTitle: '',
          }
        });
      this.coreJudges = coreJudges;
      this.competitionJudges = competitionJudges;
      this.competitionAssistJudges = competitionAssistJudges;
    },
    async fetchJudgesConfigurations() {
      this.isLoading = true;
      return this.axios.get(`private/competitions/${this.competitionId}/judge/all`)
        .then(({ data = [] }) => {
          this.isLoading = false;
          this.assignJudgedConfig(data);
        })
    },
    async getCompetitionReferences() {
      return this.axios.get(`private/competitions/${this.competitionId}/type`)
        .then(({ data }) => this.competitionReferences = data);
    },
    resetSnackbar() {
      this.showSnackbar = false;
      this.snackbarError = '';
      this.snackbarColor = 'primary';
    },
    async saveJudges() {
      const judges = [...this.coreJudges, ...this.competitionJudges, ...this.competitionAssistJudges]
      const patchJudges = judges.filter(({ reference }) => reference);
      const postJudges = judges.filter(({ reference }) => !reference)
      try {
        if (postJudges.length) await this.axios.post(`private/competitions/${this.competitionId}/judge/all`, [...postJudges])
        if (patchJudges.length) await this.axios.patch(`private/competitions/${this.competitionId}/judge/all`, [...patchJudges])
        this.snackbarError = '';
        this.snackbarColor = 'success';
        this.showSnackbar = true;
        await this.fetchJudgesConfigurations();
      } catch (error) {
        this.snackbarError = 'TODO PARSE MESSAGE';
        this.snackbarColor = 'error';
        this.showSnackbar = true;
      }
    }
  }
}
</script>
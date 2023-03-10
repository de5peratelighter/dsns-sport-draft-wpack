<template>
  <v-container class="config-judges white--text" ma-0 pa-0 fluid>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular
        :size="100"
        color="white"
        indeterminate
      ></v-progress-circular>
    </div>
    <template v-else>
    <v-data-table
      :headers="mainConfigurationHeaders"
      :items="coreJudges"
      item-key="judgeType"
      dense
      disable-sort
      disable-pagination
      hide-default-footer	
    >
      <template v-slot:[`item.${translationKey}`]="{ item }">
       {{ judgeTranslations.coreJudgesTypes[item.judgeType] }}
      </template>
      <template v-slot:[`item.${nameKey}`]="{ item }">
        <v-text-field v-model="item[nameKey]" hide-details></v-text-field>
      </template>
      <template v-slot:[`item.${initialsKey}`]="{ item }">
        <v-text-field v-model="item[initialsKey]" hide-details></v-text-field>
      </template>
    </v-data-table>
    <v-spacer class="my-3" />
    <v-data-table
      :headers="seniorConfigurationHeaders"
      :items="competitionJudges"
      dense
      disable-sort
      disable-pagination
      hide-default-footer	
    >
      <template v-slot:[`item.${translationKey}`]="{ item }">
       {{ judgeTranslations.competitionJudgesTypes[item.judgeType] }}
      </template>
      <template v-slot:[`item.${nameKey}`]="{ item }">
        <v-text-field v-model="item[nameKey]" hide-details></v-text-field>
      </template>
      <template v-slot:[`item.${initialsKey}`]="{ item }">
        <v-text-field v-model="item[initialsKey]" hide-details></v-text-field>
      </template>
    </v-data-table>
    <v-spacer class="my-3" />
    <v-data-table
      :headers="assistantConfigurationHeaders"
      :items="competitionAssistJudges"
      dense
      disable-sort
      disable-pagination
      hide-default-footer	
    >
      <template v-slot:[`item.${translationKey}`]="{ item }">
       {{ judgeTranslations.competitionAssistJudgesTypes[item.judgeType] }}
      </template>
      <template v-slot:[`item.${nameKey}`]="{ item }">
        <v-text-field v-model="item[nameKey]" hide-details></v-text-field>
      </template>
      <template v-slot:[`item.${initialsKey}`]="{ item }">
        <v-text-field v-model="item[initialsKey]" hide-details></v-text-field>
      </template>
    </v-data-table>

    <div class="mt-3 d-flex justify-space-between">
      <v-btn color="light-green white--text"
        @click="saveJudges">
        ????????????????
      </v-btn>
      <v-btn color="white" @click="$router.push({ name: 'editCompetition', params: { id: $route.params.id}})">
        ??????????????????
      </v-btn>
    </div>
    </template>
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      multi-line
    >
      <v-row class="text-center justify-center align-center">
        <h4 class="text-center mb-0 ml-2" v-if="snackbarError">??????????????! {{  snackbarError  }}</h4>
        <h4 class="text-center mb-0 ml-2" v-else>{{ '?????????? ?????????????????? !' }}</h4>
        <v-btn
          class="ml-2"
          text
          @click="resetSnackbar()"
        >
          ??????????????
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
    }
  },
  computed: {
    competitionId() {
      return this.$route.params.id;
    },
    mainConfigurationHeaders() {
      return [
        { text: '', value: this.translationKey, width: '20%' },
        { text: '?????????????????? ????????????', value: this.nameKey, width: '45%' },
        { text: '????????????????, ????????????????', value: this.initialsKey, width: '35%' },
      ]
    },
    seniorConfigurationHeaders() {
      return [
        { text: '?????????????? ?????????? ?? ????????', value: this.translationKey, width: '20%' },
        { text: '?????????????????? ????????????', value: this.nameKey, width: '45%' },
        { text: '????????????????, ????????????????', value: this.initialsKey, width: '35%' },
      ]
    },
    assistantConfigurationHeaders() {
      return [
        { text: '?????????????????? ?????????? ?? ????????', value: this.translationKey, width: '20%' },
        { text: '?????????????????? ????????????', value: this.nameKey, width: '45%' },
        { text: '????????????????, ????????????????', value: this.initialsKey, width: '35%' },
      ]
    },
    judgeTranslations() {
      const coreJudgesTypes = {
        MAIN: '???????????????? ?????????? ????????????????', 
        MAIN_SECRETARY: '???????????????? ???????????????? ????????????????',
        INSPECTOR: '?????????? ?????????????????? ????????????????', 
        STARTER: '??????????????',
        ASSISTANCE_STARTER: '?????????????? ????????.'
      };
      const competitionJudgesTypes = {
        JUDGE_ASSAULT_LADDER: '???????????????? ??????????????', 
        JUDGE_HUNDRED_METER: '100 ?????????????? ????????????',
        JUDGE_DUELING: '????????????????????',
        JUDGE_RETRACTABLE_LADDER: '?????????????? ??????????????',
        JUDGE_RELAY: '?????????????? ????????????????',
        JUDGE_COMBAT_DEPLOYMENT: '???????????? ??????????????????????'
      };
      const competitionAssistJudgesTypes = {
        ASSISTANCE_ASSAULT_LADDER: '???????????????? ??????????????', 
        ASSISTANCE_HUNDRED_METER: '100 ?????????????? ????????????',
        ASSISTANCE_DUELING: '????????????????????',
        ASSISTANCE_RETRACTABLE_LADDER: '?????????????? ??????????????',
        ASSISTANCE_RELAY: '?????????????? ????????????????',
        ASSISTANCE_COMBAT_DEPLOYMENT: '???????????? ??????????????????????'
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
    } catch(error) {
      this.isLoading = false;
    }
  },
  methods: {
    assignJudgedConfig(configJudges = []) {
      const judgesTypes = this.judgeTranslations;
      const competitionReferences = this.competitionReferences.map(({sportType}) => sportType);
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
        this.snackbarColor ='success';
        this.showSnackbar = true;
        await this.fetchJudgesConfigurations();
      } catch (error) {
        this.snackbarError = 'TODO PARSE MESSAGE';
        this.snackbarColor ='error';
        this.showSnackbar = true;
      }
    }
  }
}
</script>
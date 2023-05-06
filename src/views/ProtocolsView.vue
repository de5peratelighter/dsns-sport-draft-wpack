<template>
  <v-container class="protocols-view white--text" ma-0 pa-0 fluid>
    <div v-if="isPageLoading" class="text-center">
      <v-progress-circular
        :size="100"
        color="white"
        indeterminate
      ></v-progress-circular>
    </div>
    <template v-else>
    <v-row v-if="activeCompetitionStatus === 'INACTIVE'" class="text-center justify-center mt-3">
      <div class="d-flex" style="flex-direction: column">
        <h4 class="text-center mb-4">{{ activeCompetitionType ? `Стартовий протокол: ${competitionTranslations[activeCompetitionType.sportType]}` : '' }}</h4>
        <v-btn 
          color="light-green white--text"
          @click="startCompetition"
        >
          Розпочати змагання
        </v-btn>
      </div>
    </v-row>
    <v-row v-else>
      <template v-if="activeCompetitionType">
        <v-col cols="7" class="pr-0">
          <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-2 white--text">
            <h4 class="text-center">{{ activeCompetitionType ? `${competitionTranslations[activeCompetitionType.sportType]}` : '' }}</h4>
            <v-stepper v-model="stepper" non-linear style="position: sticky; top: 0; z-index: 1">
              <v-stepper-header>
                <v-stepper-step
                  editable
                  :color="activeCompetitionStatus === 'ACTIVE' ? 'primary' : 'success'"
                  :edit-icon="activeCompetitionStatus === 'ACTIVE' ? '$edit' : '$complete'"
                  :complete="activeCompetitionStatus === 'FINAL' || activeCompetitionStatus === 'HALF_FINAL'"
                  step="1"
                  @click="getRaceData('ACTIVE')"
                >
                  Стартовий протокол
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                  :editable="availableHalfFinal"
                  :color="activeCompetitionStatus === 'HALF_FINAL' ? 'primary' : 'success'"
                  :edit-icon="activeCompetitionStatus === 'HALF_FINAL' ? '$edit' : '$complete'"
                  :complete="activeCompetitionStatus === 'FINAL'"
                  step="2"
                  @click="getRaceData('HALF_FINAL')"
                >
                  Пів-фінал
                  <v-btn 
                    v-if="activeCompetitionStatus === 'ACTIVE'"
                    small
                    color="light-green white--text"
                    :disabled="!availableHalfFinal"
                    @click.stop.prevent="startHalfFinal"
                  >
                    Старт
                  </v-btn>
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                  step="3"
                  :editable="availableFinal"
                  :color="activeCompetitionStatus === 'FINAL' ? 'primary' : 'success'"
                  @click="getRaceData('FINAL')"
                >
                  Фінал
                  <v-btn 
                    v-if="activeCompetitionStatus === 'HALF_FINAL'"
                    small
                    color="light-green white--text"
                    :disabled="!availableFinal"
                    @click.stop.prevent="startFinal"
                  >
                    Старт
                  </v-btn>
                </v-stepper-step>
              </v-stepper-header>
            </v-stepper>
            <v-data-table
              :headers="participantHeaders"
              :items="participants"
              :loading="isLoading"
              disable-pagination
              disable-sort
              hide-default-footer
            >
              <template #item="{ item }">
                <tr>
                  <template v-if="stepper == 1">
                    <td>
                      {{ item.trackNumber }}
                    </td>
                    <td>
                      {{ item.roadNumber }}
                    </td>
                  </template>
                  <template v-if="stepper == 2">
                    <td>
                      {{ item.halfFinalTrackNumber }}
                    </td>
                    <td>
                      {{ item.halfFinalRoadNumber }}
                    </td>
                  </template>
                  <template v-if="stepper == 3">
                    <td>
                      {{ item.finalTrackNumber }}
                    </td>
                    <td>
                      {{ item.finalRoadNumber }}
                    </td>
                  </template>
                  <td>
                    {{ item.participantNumber }}
                  </td>
                  <td>
                    {{ item.participantCategory }}
                  </td>
                  <td>
                    {{ item.participantFullName }}
                  </td>
                  <td>
                    {{ item.participantBirthday }}
                  </td>
                  <td>
                    {{ item.participantTeamName }}
                  </td>
                  <template v-if="stepper == 1">
                    <td>
                      <v-text-field
                        :value="item.firstResult"
                        :success="!!item.firstResult"
                        :rules="[isNumeric]"
                        outlined
                        dense
                        hide-details
                        class="no-border"
                        @focus="firstResult = item.firstResult"
                        @input="firstResult = $event"
                        @change="saveResults(item, 'firstResult')"
                      />
                    </td>
                    <td>
                      <v-text-field
                        :value="item.secondResult"
                        :success="!!item.secondResult"
                        :rules="[isNumeric]"
                        outlined
                        dense
                        hide-details
                        class="no-border"
                        @focus="secondResult = item.secondResult"
                        @input="secondResult = $event"
                        @change="saveResults(item, 'secondResult')"
                      />
                    </td>
                    <td>
                      {{ item.bestResult }}
                    </td>
                  </template>
                  <template v-if="stepper == 2">
                    <td>
                      <v-text-field
                        :value="item.halfFinalResult"
                        :success="!!item.halfFinalResult"
                        :rules="[isNumeric]"
                        outlined
                        dense
                        hide-details
                        class="no-border"
                        @focus="halfFinalResult = item.halfFinalResult"
                        @input="halfFinalResult = $event"
                        @change="saveResults(item, 'halfFinalResult')"
                      />
                    </td>
                  </template>
                  <template v-if="stepper == 3">
                    <td>
                      <v-text-field
                        v-if="activeCompetitionStatus === 'FINAL'"
                        :value="item.finalResult"
                        :success="!!item.finalResult"
                        :rules="[isNumeric]"
                        outlined
                        dense
                        hide-details
                        class="no-border"
                        @focus="finalResult = item.finalResult"
                        @input="finalResult = $event"
                        @change="saveResults(item, 'finalResult')"
                      />
                      <template v-else>
                        {{ item.finalResult }}
                      </template>
                    </td>
                  </template>
                </tr>
              </template>

              <template #no-data>
                No data
              </template>
              <template #footer>
              </template>
              </v-data-table>
            </v-sheet>
          </v-col>
          <v-col cols="5">
            <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-2 white--text" style="position: sticky; top: 5px;">
              <h4 class="text-center">Кращі результати</h4>
              <v-data-table
                :headers="bestResultsHeaders"
                :items="bestParticipants"
                disable-pagination
                disable-sort
                hide-default-footer
              >
                <template #item="{ item, index }">
                  <tr>
                    <td>
                      {{ index + 1 }}
                    </td>
                    <td>
                      {{ item.participantFullName }}
                    </td>
                    <td>
                      {{ item.participantTeamName }}
                    </td>
                    <td>
                      {{ item.bestResult }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
              <v-row class="mt-1">
                <v-col cols="6">
                  <h4 class="text-center text-no-wrap">Командна першість по виду
                     <v-icon dark @click="fetchteamResultsByType">mdi-refresh</v-icon>
                  </h4>
                  <v-data-table
                    :headers="teamResultsByTypeHeaders"
                    :items="teamResultsByType"
                    disable-pagination
                    disable-sort
                    hide-default-footer
                  >
                    <template #item="{ item, index }">
                      <tr>
                        <td>
                          {{ index + 1}}
                        </td>
                        <td>
                          {{ item.teamName }}
                        </td>
                        <td>
                          {{ item.result }}
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="6">
                  <h4 class="text-center text-no-wrap">Загальнокомандна першість
                     <v-icon dark @click="fetchteamResultsOverall">mdi-refresh</v-icon>
                  </h4>
                  <v-data-table
                    :headers="teamResultsOverallHeaders"
                    :items="teamResultsOverall"
                    disable-pagination
                    disable-sort
                    hide-default-footer
                  >
                    <template #item="{ item, index }">
                      <tr>
                        <td>
                          {{ index + 1}}
                        </td>
                        <td>
                          {{ item.teamName }}
                        </td>
                        <td>
                          {{ item.result }}
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </template>
      </v-row>
      </template>
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
      competitionReferences: [], // has to be fetched so we know what SPORT_TYPE we're actually dealing with (id is taken from route)
      isPageLoading: false,
      isLoading: false,
      firstResult: 0,
      secondResult: 0,
      halfFinalResult: 0,
      finalResult: 0,
      isNumeric: v => !isNaN(v) || 'Лише числа',
      participants: [],
      bestParticipants: [],
      teamResultsOverall: [],
      teamResultsByType: [],
      bestResultsHeaders: [
        { text: '', value: 'index', width: '10%' },
        { text: 'Спортсмен', value: 'participantFullName', width: '35%' },
        { text: 'Команда', value: 'participantTeamName', width: '35%' },
        { text: 'Час, сек', value: 'bestResult', width: '20%' },
      ],
      teamResultsByTypeHeaders: [
        { text: '', value: 'index', width: '10%' },
        { text: 'Команда', value: 'teamName', width: '45%' },
        { text: 'Час с', value: 'result', width: '45%' },
      ],
      teamResultsOverallHeaders: [
        { text: '', value: 'index', width: '10%' },
        { text: 'Команда', value: 'teamName', width: '45%' },
        { text: 'Сума', value: 'result', width: '45%' },
      ],
      availableHalfFinal: false,
      availableFinal: false,
      stepper: 1,
      
      alertType: 'error',
      showAlert: false,
      alertMessage: '',
    }
  },
  computed: {
    competitionId() {
      return this.$route.params.id;
    },
    competitionType() {
      return this.$route.params.type;
    },
    activeCompetitionType() {
      const competitionType = this.competitionType;
      return this.competitionReferences.find(({reference}) => reference === competitionType);
    },
    activeCompetitionStatus() {
      return this.activeCompetitionType && this.activeCompetitionType.status;
    },
    competitionTranslations() {
      return {
        ASSAULT_LADDER: 'Штурмова драбина', 
        HUNDRED_METER: '100 метрова полоса',
        DUELING: 'Двоборство',
        RETRACTABLE_LADDER: 'Висувна драбина',
        RELAY: 'Пожежна естафета',
        COMBAT_DEPLOYMENT: 'Бойове розгортання'
      }
    },
    participantHeaders() {
      const status = this.stepper;
      const headers = [];
      if (status == 1) {
        headers.push(
          { text: '№ забігу', value: 'roadNumber' },
          { text: '№ доріжки', value: 'trackNumber'},
        )
      }
      if (status == 2) {
        headers.push(
          { text: '№ забігу', value: 'halfFinalRoadNumber' },
          { text: '№ доріжки', value: 'halfFinalTrackNumber' },
        )
      }
      if (status == 3) {
        headers.push(
          { text: '№ забігу', value: 'finalRoadNumber' },
          { text: '№ доріжки', value: 'finalTrackNumber' },
        )
      }

      headers.push(
        { text: '№ учасника', value: 'participantNumber'  },
        { text: 'Категорія учасника', value: 'participantCategory' },
        { text: 'Імя та призвіще', value: 'participantFullName'},
        { text: 'Рік народження', value: 'participantBirthday'},
        { text: 'Команда', value: 'participantTeamName'}
      )

      if (status == 1) {
        headers.push(
          { text: 'Перша спроба', value: 'firstResult' },
          { text: 'Друга спроба', value: 'secondResult'},
          { text: 'Кращий', value: 'bestResult' }
        )
      }
      if (status == 2) {
        headers.push(
          { text: 'Результат пів-фіналу', value: 'halfFinalResult' }
        )
      }
      if (status == 3) {
        headers.push(
          { text: 'Результат фіналу', value: 'finalResult'}
        )
      }
      return headers;
    }
  },
  async mounted() {
    await this.getCompetitionReferences();
  },
  methods: {
    async startCompetition() {
      let activeCompetitionType = this.activeCompetitionType;
      if (!activeCompetitionType.reference) return Promise.reject('Competition doesnt exist');

      const foundIndex = this.competitionReferences.findIndex(({ reference }) => reference === activeCompetitionType.reference)
      return this.axios.post(`private/competition-types/${activeCompetitionType.reference}/start-competition-type`)
        .then(() => {
          if (foundIndex >= 0) {
            this.$set(this.competitionReferences, foundIndex, { ...activeCompetitionType, status: 'ACTIVE' });
            this.getRaceData();
          }
        })
        .catch((error) => this.showError(error))
    },
    startHalfFinal() {
      let activeCompetitionType = this.activeCompetitionType;
      if (!activeCompetitionType.reference) return Promise.reject('Competition doesnt exist');

      const foundIndex = this.competitionReferences.findIndex(({ reference }) => reference === activeCompetitionType.reference)
      return this.axios.post(`private/competition-types/${activeCompetitionType.reference}/start-half-final`)
        .then(({ data }) => {
          if (foundIndex >= 0) {
            this.$set(this.competitionReferences, foundIndex, { ...activeCompetitionType, status: 'HALF_FINAL' });
            this.participants = data;
            this.stepper = 2;
            Promise.all([this.getBestResults(), this.fetchteamResultsByType(), this.fetchteamResultsOverall()])
          }
        })
        .catch((error) => this.showError(error))
    },
    startFinal() {
      let activeCompetitionType = this.activeCompetitionType;
      if (!activeCompetitionType.reference) return Promise.reject('Competition doesnt exist');

      const foundIndex = this.competitionReferences.findIndex(({ reference }) => reference === activeCompetitionType.reference)
      return this.axios.post(`private/competition-types/${activeCompetitionType.reference}/start-final`)
        .then(({ data }) => {
          if (foundIndex >= 0) {
            this.$set(this.competitionReferences, foundIndex, { ...activeCompetitionType, status: 'FINAL' });
            this.participants = data;
            this.stepper = 3;
            Promise.all([this.getBestResults(), this.fetchteamResultsByType(), this.fetchteamResultsOverall()])
          }
        })
        .catch((error) => this.showError(error))
    },
    async getBestResults() {
      return this.axios.get(`private/competition-types/${this.competitionType}/best-race-results`)
        .then(({ data }) => {
          this.availableHalfFinal = data.availableHalfFinal;
          this.availableFinal = data.availableFinal;
          this.bestParticipants = data.bestResultList;
        })
    },
    async getCompetitionReferences() {
      this.isPageLoading = true;
      return this.axios.get(`private/competitions/${this.competitionId}/type`)
          .then(({ data }) => {
            this.competitionReferences = data;
            this.isPageLoading = false;
            if (this.activeCompetitionType && this.activeCompetitionStatus !== 'INACTIVE') this.getRaceData();
          })
          .catch(() => {
            this.isPageLoading = false;
          });
    },
    async getRaceData(status = this.activeCompetitionStatus) {
      this.isLoading = true;
      let stepper = 0;
      let request = null;
      try {
        if (status === 'ACTIVE') {
          stepper = 1;
          request = await this.axios.get(`private/competition-types/${this.competitionType}/start-race-list`);
        } else if (status === 'HALF_FINAL') {
          stepper = 2;
          request = await this.axios.get(`private/competition-types/${this.competitionType}/half-final-race-results`);
        } else if (status === 'FINAL') {
          stepper = 3;
          request = await this.axios.get(`private/competition-types/${this.competitionType}/final-race-results`);
        }
        if (!request) return;
          this.isLoading = false;
          this.stepper = stepper;
          this.participants = request.data;
          if (request.data.length) {
            return Promise.all([this.getBestResults(), this.fetchteamResultsByType(), this.fetchteamResultsOverall()])
          }
      } catch(error) {
        this.isLoading = false;
      }
    },
    async fetchteamResultsByType () {
      return this.axios.post(`private/teams/competition-types/${this.competitionType}/generate-race-result`)
        .then(({ data }) => {
          this.teamResultsByType = data;
        })
    },
    async fetchteamResultsOverall () {
      return this.axios.post(`private/teams/competitions/${this.competitionId}/generate-team-results`)
        .then(({ data }) => {
          this.teamResultsOverall = data;
        })
    },
    async saveResults(participant, key) {
      const raceReference = participant.raceReference;
      if (!raceReference) return Promise.reject('Incorrect raceReference for saving');
      const result = this[key].trim();
      // prevent empty values
      if (!result) return;
      // prevent saving the same values
      if (Number(participant[key]) === Number(result)) return;

      const foundIndex = this.participants.findIndex(({ participantReference }) => participantReference === participant.participantReference)
      const reqData = {
        participantReference: participant.participantReference,
        [key]: result,
      };
      return this.axios.patch(`private/competition-types/races/${raceReference}/save-results`, reqData)
        .then(({data = {}}) => {
          // directly saving new properties (since most of other properties returned are null)
          this.$set(this.participants, foundIndex, {
            ...participant, 
            firstResult: data.firstResult,
            secondResult: data.secondResult,
            bestResult: data.bestResult,
            finalResult: data.finalResult,
            halfFinalResult: data.halfFinalResult,
            finalResult: data.finalResult
           });
           // refetch best results
           this.getBestResults();
        })
    },
    showError(error) {
      this.alertMessage = error.response && error.response.data.description ? error.response.data.description : error.message;
      this.showAlert = true;
    }
  }
}
</script>

<style lang="scss">
  table .v-input__slot {
    padding: 5px!important;
  }
  .alert-message {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }
</style>
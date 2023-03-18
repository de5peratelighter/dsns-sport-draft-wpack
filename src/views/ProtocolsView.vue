<template>
  <v-container class="protocols-view white--text" ma-0 pa-0 fluid>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular
        :size="100"
        color="white"
        indeterminate
      ></v-progress-circular>
    </div>
    <template v-else>
    <v-row v-if="activeCompetitionType && activeCompetitionType.status === 'INACTIVE'" class="text-center justify-center mt-3">
      <v-btn 
        color="light-green white--text"
        @click="startCompetition(activeCompetitionType)"
      >
        Розпочати змагання
      </v-btn>
    </v-row>
    <v-row v-else>
      <template v-if="activeCompetitionType">
        <v-col cols="7">
          <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-2 white--text">
            <h4 class="text-center">{{ activeCompetitionType ? `Стартовий протокол: ${competitionTranslations[activeCompetitionType.sportType]}` : '' }}</h4>
            <v-data-table
              :headers="participantHeaders"
              :items="participants"
              disable-pagination
              disable-sort
              hide-default-footer
            >
              <template #item="{ item }">
                <tr>
                  <td>
                    {{ item.roadNumber }}
                  </td>
                  <td>
                    {{ item.trackNumber }}
                  </td>
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
                  <td>
                    <v-edit-dialog
                      large
                      @open="firstResult = item.firstResult"
                      @save="saveResults(item, 'firstResult')"
                    >
                      <div>{{ item.firstResult }}</div>
                      <template #input>
                          <div class="mt-4 text-h6">
                              Перший результат, секунди
                          </div>
                          <v-text-field
                              :value="firstResult"
                              label="Результат"
                              :rules="[isNumeric]"
                              single-line
                              counter
                              autofocus
                              @input="firstResult = $event"
                          ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </td>
                  <td>
                    <v-edit-dialog
                      large
                      @open="secondResult = item.secondResult"
                      @save="saveResults(item, 'secondResult')"
                    >
                      <div>{{ item.secondResult }}</div>
                      <template #input>
                          <div class="mt-4 text-h6">
                              Другий результат, секунди
                          </div>
                          <v-text-field
                              :value="secondResult"
                              label="Результат"
                              :rules="[isNumeric]"
                              single-line
                              counter
                              autofocus
                              @input="secondResult = $event"
                          ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </td>
                  <td>
                    {{ item.bestResult }}
                  </td>
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
                      {{ index }}
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
                  <h4 class="text-center">Командна першість по виду
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
                          {{ index }}
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
                  <h4 class="text-center">Загальнокомандна першість
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
                          {{ index }}
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
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      competitionReferences: [], // has to be fetched so we know what SPORT_TYPE we're actually dealing with (id is taken from route)
      isLoading: false,
      firstResult: 0,
      secondResult: 0,
      isNumeric: v => !isNaN(v) || 'Лише числа',
      participants: [],
      bestParticipants: [],
      teamResultsOverall: [],
      teamResultsByType: [],
      participantHeaders: [
        { text: '№ забігу', value: 'roadNumber', width: '7.5%' },
        { text: '№ доріжки', value: 'trackNumber', width: '7.5%' },
        { text: '№ учасника', value: 'participantNumber' , width: '7.5%' },
        { text: 'Категорія учасника', value: 'participantCategory' , width: '7.5%' },
        { text: 'Імя та призвіще', value: 'participantFullName', width: '15%' },
        { text: 'Рік народження', value: 'participantBirthday', width: '10%' },
        { text: 'Команда', value: 'participantTeamName', width: '10%' },
        { text: 'Перша спроба', value: 'firstResult', width: '10%' },
        { text: 'Друга спроба', value: 'secondResult', width: '10%' },
        { text: 'Кращий', value: 'bestResult', width: '10%' },
      ],
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
      ]
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
  },
  async mounted() {
    await this.getCompetitionReferences();
  },
  methods: {
    async startCompetition(tab) {
      const foundIndex = this.competitionReferences.findIndex(({ reference }) => reference === tab.reference)
      if (!tab.reference) return Promise.reject('Competition doesnt exist');
      return this.axios.post(`private/competition-types/${tab.reference}/start-competition-type`)
        .then(() => {
          if (foundIndex >= 0) {
            this.$set(this.competitionReferences, foundIndex, { ...this.activeCompetitionType, status: 'ACTIVE' });
            this.getStartRace();
          }
        })
    },
    async getBestResults() {
      return this.axios.get(`private/competition-types/${this.competitionType}/best-race-results`)
        .then(({ data }) => {
          this.bestParticipants = data.bestResultList;
        })
    },
    async getCompetitionReferences() {
      return this.axios.get(`private/competitions/${this.competitionId}/type`)
          .then(({ data }) => {
            this.competitionReferences = data;
            if (this.activeCompetitionType && this.activeCompetitionType.status === 'ACTIVE') this.getStartRace();
          });
    },
    async getStartRace() {
      this.isLoading = true;
      return this.axios.get(`private/competition-types/${this.competitionType}/race-results`)
        .then(({data}) => {
          this.isLoading = false;
          this.participants = data;
          if (data.length) {
            return Promise.all([this.getBestResults(), this.fetchteamResultsByType(), this.fetchteamResultsOverall()])
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
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
      if (!result) return;
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
            finalResult: data.finalResult
           });
           // refetch best results
           this.getBestResults();
        })
    }
  }
}
</script>
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
    <h3 class="text-center mb-3">{{ activeCompetitionType ? `Стартовий протокол: ${competitionTranslations[activeCompetitionType.sportType]}` : '' }}</h3>
    <v-row>
      <template v-if="activeCompetitionType">
        <v-col cols="7">
          <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-2 white--text">
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
                    {{ item.trackNumber }}
                  </td>
                  <td>
                    {{ item.roadNumber }}
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
      isLoading: true,
      firstResult: 0,
      secondResult: 0,
      isNumeric: v => !isNaN(v) || 'Лише числа',
      participants: [],
      bestParticipants: [],
      participantHeaders: [
        { text: '№ доріжки', value: 'trackNumber', width: '7.5%' },
        { text: '№ забігу', value: 'roadNumber', width: '7.5%' },
        { text: '№ учасника', value: 'participantNumber' , width: '7.5%' },
        { text: 'Категорія учасника', value: 'participantCategory' , width: '7.5%' },
        { text: 'Призвіще та імя', value: 'participantFullName', width: '15%' },
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
    await this.getStartRace();
    await this.getRaceResults();
  },
  methods: {
    async getRaceResults() {
      return this.axios.get(`private/competition-types/${this.competitionType}/best-race-results`)
        .then(({ data }) => {
          this.bestParticipants = data;
        })
    },
    async getCompetitionReferences() {
      return this.axios.get(`private/competitions/${this.competitionId}/type`)
          .then(({ data }) => {
            this.competitionReferences = data;
          });
    },
    async getStartRace() {
      this.isLoading = true;
      return this.axios.get(`private/competition-types/${this.competitionType}/start-race-list`)
        .then(({data}) => {
          this.participants = data;
        })
        .finally(() => {
          this.isLoading = false;
        });
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
           this.getRaceResults();
        })
    }
  }
}
</script>
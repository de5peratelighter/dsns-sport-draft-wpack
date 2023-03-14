<template>
  <v-container class="protocols-view white--text" ma-0 pa-0 fluid>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular
        :size="100"
        color="white"
        indeterminate
      ></v-progress-circular>
    </div>
    <v-row v-else>
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
                    <div>{{ item.teamName }}</div>
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
                    <div>{{ item.teamName }}</div>
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
      </v-row>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      isLoading: true,
      firstResult: 0,
      secondResult: 0,
      isNumeric: v => !isNaN(v) || 'Лише числа',
      participants: [{
        "participantBirthday": "2023-03-14",
        "participantTeamName": "string",
        "participantCategory": "III_TEEN",
        "participantFullName": "string",
        "trackNumber": 0,
        "roadNumber": 0,
        "firstResult": 0,
        "secondResult": 0,
        "bestResult": 0,
        "halfFinalResult": 0,
        "isHalfFinalWinner": true,
        "finalResult": 0,
        "isFinalWinner": true,
        "participantReference": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "raceReference": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }],
      participantHeaders: [
          { text: '№ забігу', value: 'roadNumber', width: '7.5%' },
          { text: '№ доріжки', value: 'trackNumber', width: '7.5%' },
          { text: '№ учасника', value: 'participantNumber' , width: '7.5%' },
          { text: 'Категорія учасника', value: 'participantCategory' , width: '7.5%' },
          { text: 'Призвіще та імя', value: 'participantFullName', width: '15%' },
          { text: 'Рік народження', value: 'participantBirthday', width: '10%' },
          { text: 'Команда', value: 'participantTeamName', width: '10%' },
          { text: 'Перша спроба', value: 'firstResult', width: '10%' },
          { text: 'Друга спроба', value: 'secondResult', width: '10%' },
          { text: 'Кращий', value: 'bestResult', width: '10%' },
      ],
    }
  },
  computed: {
    competitionId() {
      return this.$route.params.id;
    },
    competitionType() {
      return this.$route.params.type;
    }
  },
  async mounted() {
    await this.getStartRace();
  },
  methods: {
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
      const reqData = {
        participantReference: participant.participantReference,
        [key]: result,
      };
      return this.axios.patch(`private/races/${raceReference}/save-results`, reqData)
    }
  }
}
</script>
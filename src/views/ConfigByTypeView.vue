<template>
  <v-container class="config-by-type white--text" ma-0 pa-0 fluid>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular :size="100" color="white" indeterminate></v-progress-circular>
    </div>
    <div v-else class="text-center">
      <v-tabs v-model="tab" background-color="cyan" grow dark>
        <v-tab v-for="item in competitionReferences" :key="item.reference">
          {{ competitionTranslations[item.sportType] }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" style="background-color: transparent">
        <v-tab-item v-for="tab in competitionReferences" :key="tab.reference">
          <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3 white--text">
            <h3> {{ competitionTranslations[tab.sportType] }} </h3>
            <v-row>
              <v-col cols="6" class="py-0">
                <v-text-field v-model="tab.countRoad" :rules="[isNumeric]" label="Кількість бігових доріжок" dark />
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field v-model="tab.weather" label="Погода" dark />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="py-0">
                <v-text-field v-model="tab.participantsPerTeam" :rules="[isNumeric]"
                  label="Кількість спортсменів що приймають участь" dark />
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field v-model="tab.participantsForTeamResult" :rules="[isNumeric]"
                  label="Кількість спортсменів що йдуть в командний залік" dark />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-select dark v-model="tab.startProtocolRule" :items="startProtocolTranslations" item-text="text"
                  item-key="key" item-value="key" label="Правило формування стартового протоколу"></v-select>
              </v-col>
              <v-row v-if="showCheckboxes(tab.sportType)">
                <v-checkbox v-model="tab.skipHalfFinal" label="Пропустити півфінал" dark
                  style="margin: 30px 30px 0px 20px"></v-checkbox>
                <v-checkbox v-model="tab.skipFinals" label="Пропустити фінал" dark style="margin-top: 30px"></v-checkbox>
              </v-row>

              <v-col v-if="tab.startProtocolRule === 'BLOCK_LOT'" cols="6">
                <v-text-field v-model="tab.blockOrder" label="Порядрок блоків та кількість команд в блоці" dark />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="py-0">
                <v-text-field v-model="tab.roadCover" label="Покриття бігової доріжки" dark />
              </v-col>
              <v-col cols="6" class="py-0">
                <v-select dark v-model="tab.stopwatchType" :items="stopwatchTypeTranslations" item-text="text"
                  item-key="key" item-value="key" label="Вид хронометражу"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col cols="6">
                    <div class="d-flex">
                      <v-menu :ref="`startDateMenu-${tab.reference}`" v-model="startDateMenu[tab.reference]"
                        :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto"
                        :return-value.sync="tab.startDate">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="tab.startDate" label="Дата початку змаганнь" prepend-icon="mdi-calendar"
                            readonly v-bind="attrs" v-on="on" dark hide-details></v-text-field>
                        </template>
                        <v-date-picker v-model="tab.startDate"
                          :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                          elevation="0" @change="saveTimeOrDate(tab.reference, $event, 'startDateMenu')" />
                      </v-menu>
                      <v-menu :ref="`startTimeMenu-${tab.reference}`" v-model="startTimeMenu[tab.reference]"
                        :close-on-content-click="false" :nudge-right="40" :return-value.sync="tab.startTime"
                        transition="scale-transition" offset-y max-width="290px" min-width="290px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="tab.startTime" label="Точний час початку змаганнь"
                            prepend-icon="mdi-clock-time-four-outline" readonly dark v-bind="attrs"
                            v-on="on"></v-text-field>
                        </template>
                        <v-time-picker v-model="tab.startTime" full-width format="24hr"
                          @change="saveTimeOrDate(tab.reference, $event, 'startTimeMenu')" />
                      </v-menu>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="d-flex">
                      <v-menu :ref="`endDateMenu-${tab.reference}`" v-model="endDateMenu[tab.reference]"
                        :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto"
                        :return-value.sync="tab.endDate">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="tab.endDate" label="Дата закінчення змаганнь" prepend-icon="mdi-calendar"
                            readonly v-bind="attrs" v-on="on" dark hide-details></v-text-field>
                        </template>
                        <v-date-picker v-model="tab.endDate"
                          :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                          elevation="0" @change="saveTimeOrDate(tab.reference, $event, 'endDateMenu')"></v-date-picker>
                      </v-menu>
                      <v-menu :ref="`endTimeMenu-${tab.reference}`" v-model="endTimeMenu[tab.reference]"
                        :close-on-content-click="false" :nudge-right="40" :return-value.sync="tab.endTime"
                        transition="scale-transition" offset-y max-width="290px" min-width="290px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="tab.endTime" label="Точний час закінчення змаганнь"
                            prepend-icon="mdi-clock-time-four-outline" readonly dark v-bind="attrs"
                            v-on="on"></v-text-field>
                        </template>
                        <v-time-picker v-model="tab.endTime" full-width format="24hr"
                          @change="saveTimeOrDate(tab.reference, $event, 'endTimeMenu')" />
                      </v-menu>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <div class="mt-5 d-flex justify-space-between">
              <v-btn color="light-green white--text mr-2" @click="saveConfigurationByType(tab)">
                Зберегти
              </v-btn>
              <v-btn v-if="tab.status === 'ACTIVE'" color="primary white--text" @click="goToResults(tab)">
                Результати змагання
              </v-btn>
            </div>
          </v-sheet>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <v-alert v-model="showAlert" ref="alertDialog" :type="alertType" dismissible class="alert-message">
      {{ alertMessage }}
    </v-alert>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      isNumeric: v => !isNaN(v),
      competitionReferences: [],
      tab: null,
      isLoading: true,
      startDateMenu: {},
      startTimeMenu: {},
      endDateMenu: {},
      endTimeMenu: {},
      skipHalfFinal: false,
      skipFinals: false,

      alertType: 'error',
      showAlert: false,
      alertMessage: '',
    }
  },
  computed: {
    competitionId() {
      return this.$route.params.id;
    },
    competitionTranslations() {
      return {
        ASSAULT_LADDER: 'Штурмова драбина',
        HUNDRED_METER: '100 метрова смуга',
        DUELING: 'Двоборство',
        RETRACTABLE_LADDER: 'Висувна драбина',
        RELAY: 'Пожежна естафета',
        COMBAT_DEPLOYMENT: 'Бойове розгортання'
      }
    },
    startProtocolTranslations() {
      return [
        { key: 'LOT', text: 'Згідно з жеребом' },
        { key: 'BLOCK_LOT', text: 'Згідно з жеребом поблочно' }
      ]
    },
    stopwatchTypeTranslations() {
      return [
        { key: 'MANUAL', text: 'Ручний' },
        { key: 'AUTO', text: 'Електронний' }
      ]
    },
    showCheckboxes() {
      return (sportType) => {
        const allowedTypes = ['ASSAULT_LADDER', 'HUNDRED_METER'];
        return allowedTypes.includes(sportType);
      };
    },

  },
  mounted() {
    this.getCompetitionReferences();
  },
  methods: {
    saveStartDate(reference, date) {
      const ref = this.$refs[`startDateMenu-${reference}`];
      // since we have multiple table and thus references
      if (ref && ref[0]) ref[0].save(date);
    },
    saveStartTime(reference, time) {
      const ref = this.$refs[`startTimeMenu-${reference}`];
      // since we have multiple table and thus references
      if (ref && ref[0]) ref[0].save(time);
    },
    saveEndDate(reference, date) {
      const ref = this.$refs[`endDateMenu-${reference}`];
      // since we have multiple table and thus references
      if (ref && ref[0]) ref[0].save(date);
    },
    saveTimeOrDate(reference, dateOrTime, key) {
      const ref = this.$refs[`${key}-${reference}`];
      // since we have multiple table and thus references
      if (ref && ref[0]) ref[0].save(dateOrTime);
    },
    async getCompetitionReferences() {
      this.isLoading = true;
      return this.axios.get(`private/competitions/${this.competitionId}/type`)
        .then(({ data }) => {
          this.competitionReferences = data;
          this.assignDateReferences(data);
        })
        .finally(() => {
          this.isLoading = false;
        })
    },
    async saveConfigurationByType(tab) {
      const copy = JSON.parse(JSON.stringify(tab));
      if (!copy) return;
      const reference = copy.reference;
      delete copy.reference;

      if (copy.sportType === 'ASSAULT_LADDER') {
        copy.customParameterForAssaultLadder = true;
      } else if (copy.sportType === 'HUNDRED_METER') {
        copy.customParameterForHundredMeter = true;
      }

      return this.axios.patch(`private/competition-types/${reference}`, copy)
        .then(() => {
          this.alertType = 'success';
          this.alertMessage = 'Зміни успішно збережені!';
          this.showAlert = true;
        })
        .catch((err) => this.showError(err));
    },
    startCompetition(tab) {
      const foundIndex = this.competitionReferences.findIndex(({ reference }) => reference === tab.reference)
      if (!tab.reference) return Promise.reject('Competition doesnt exist');

      const payload = {
        skipHalfFinal: this.skipHalfFinal,
        skipFinals: this.skipFinals,
      };

      return this.axios.post(`private/competition-types/${tab.reference}/start-competition-type`, payload)
        .then(({ data }) => {
          if (foundIndex >= 0) {
            this.$set(this.competitionReferences, foundIndex, data);
          }
        })
    },
    assignDateReferences(references) {
      const startDateRefs = {};
      const startTimeRefs = {};
      const endDateRefs = {};
      const endTimeRefs = {};
      references.forEach(({ reference }) => {
        startDateRefs[reference] = false
        startTimeRefs[reference] = false
        endDateRefs[reference] = false
        endTimeRefs[reference] = false
      });
      this.startDateMenu = startDateRefs;
      this.startTimeMenu = startTimeRefs;
      this.endDateMenu = endDateRefs;
      this.endTimeMenu = endTimeRefs;
    },
    goToResults(tab) {
      const reference = tab.reference;
      if (!reference) return Promise.reject('Incorrect result page data')
      return this.$router.push({ name: 'protocols', params: { id: this.competitionId, type: reference } })
    },
    showError(error) {
      this.alertType = 'error';
      this.alertMessage = error.response && error.response.data.description ? error.response.data.description : error.message;
      this.showAlert = true;
    }
  }
}
</script>

<style lang="scss">
.alert-message {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}
</style>
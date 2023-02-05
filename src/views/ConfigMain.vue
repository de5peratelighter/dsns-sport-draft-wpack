<template>
  <v-container class="config-main white--text" ma-0 pa-0 fluid color="white">
    <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3">
    <v-row class="mt-0">
      <v-col cols="6" class="pt-0">
        <v-textarea
          dark
          label="Організація"
          :value="organizer"
          hide-details
        ></v-textarea>
      </v-col>
      <v-col cols="6" class="pt-0">
        <v-textarea
          dark
          label="Назва змаганнь"
          :value="name"
          hide-details
        ></v-textarea>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="6">
        <div class="d-flex">
        <v-menu
          ref="dateMenu"
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
          :return-value.sync="date"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              dark
              hide-details
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
            @change="save"
            elevation="0"
          ></v-date-picker>
        </v-menu>

        <v-menu
          ref="timeMenu"
          v-model="timeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="time"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time"
              label="Time"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
              dark
              hide-details
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="timeMenu"
            v-model="time"
            full-width
            format="24hr"
            @click:minute="$refs.timeMenu.save(time)"
          ></v-time-picker>
      </v-menu>
    </div>
      </v-col>
      <v-col cols="6">
        <v-combobox
          v-model="location"
          :items="['Lviv', 'Kyiv']"
          dense
          filled
          dark
          label="Місце проведення"
          hide-details
        ></v-combobox>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="6">
        <v-combobox
          v-model="selectedCompetitions"
          :items="competitionItems"
          outlined
          chips
          clearable
          label="Види змаганнь"
          multiple
          item-text="name"
          item-value="id"
          dark
          hide-details
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              color="white"
              text-color="grey darken-2"
              @click="select"
              @click:close="unselectCompetition(item.id)"
            >
              <strong>{{ item.name }}</strong>
            </v-chip>
          </template>
        </v-combobox>
      </v-col>

      <v-col cols="6">
        <v-combobox
          v-model="selectedParalelCompetitions"
          :items="paralelCompetitionItems"
          outlined
          chips
          clearable
          label="Паралельні змагання"
          multiple
          item-text="name"
          item-value="id"
          dark
          hide-details
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              color="white"
              text-color="grey darken-2"
              @click="select"
              @click:close="unselectParalelCompetition(item.id)"
            >
              <strong>{{ item.name }}</strong>
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="6">
        <v-combobox
          v-model="selectedGender"
          :items="genderItems"
          outlined
          chips
          clearable
          label="Вікова категорія"
          item-text="name"
          item-value="id"
          dark
          hide-details
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              color="white"
              text-color="grey darken-2"
              @click="select"
              @click:close="unselectGender(item.id)"
            >
              <strong>{{ item.name }}</strong>
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col>
        <div class="h4 white--text">Додатково</div>
        <v-checkbox
          v-for="(item, index) in otherItems"
          :key="index"
          dark
          v-model="item.value"
          :label="item.name"
          dense
          hide-details
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-sheet>

    <v-divider color="white" class="mt-4" />

    <div class="mt-3 d-flex justify-space-between">
      <v-btn color="light-green white--text" :disabled="isDataInvalid"
        @click="save">
        Save
      </v-btn>
      <v-btn color="white" @click="$router.push({ name: 'editCompetition', params: { id: $route.params.id}})">
        Скасувати
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      otherItems: [
        { id: 'show_logos', name: 'Відображати в протоколах логотипи', value: true },
        { id: 'show_competition_icon', name: 'Відображати графічні символи видім змаганнь', value: false },
        { id: 'show_protocol_normatives', name: 'Відображати в стартових протоколах розрядні нормативи', value: true },
        { id: 'show_protocol_achievements', name: 'Відображати в стартових протоколах вищі досягнення', value: true },
        { id: 'show_protocol_level', name: 'Відображати в стартових протоколах колонку Розряд', value: true },
        { id: 'show_protocol_best_score', name: 'Відображати в стартових протоколах колонку Кращий результат', value: true },
        { id: 'show_protocol_level_sports', name: 'Відображати в стартових протоколах колонку спортивні розряди', value: true },
        { id: 'show_weather', name: 'Виводити в фінішних протоколах опис погоди', value: false },
        { id: 'english_data', name: 'Дублювати протоколи англійською', value: false },
        { id: 'english_protocols', name: 'Англійська версія протоколів', value: false },
        { id: 'sum_junior_data', name: 'Сумувати суми місць юніорських змаганнь', value: false },
        { id: 'show_print', name: 'Виводити на друк', value: false },
      ],
      competitionItems: [
        {
          id: 'one_hundred_meters', name: '100 метрова полоса'
        }, 
        {
          id: 'assault_ladder', name: 'Штурмова драбина'
        },
        {
          id: 'dueling', name: 'Двоборство'
        },
        {
          id: 'retractable_ladder', name: 'Висувна драбина'
        },
        {
          id: 'fire_relay', name: 'Пожежна естафета'
        },
        {
          id: 'deployment', name: 'Бойове розгортання'
        }
      ],
      paralelCompetitionItems: [
        {
          id: 'two', name: 'Проводити паралельно друге змагання'
        },
        {
          id: 'three', name: 'Проводити паралельно третє змагання'
        },
        {
          id: 'four', name: 'Проводити паралельно четверте змагання'
        },
      ],
      genderItems: [
        {
          id: 'junes', name: 'Юнаки та дівчата(12-14 мол. та 15-16 стар.)'
        },
        {
          id: 'juniors', name: 'Юніори та юніорки (17-18)'
        },
        {
          id: 'young', name: 'Молодь (18-23)'
        },
        {
          id: 'adults', name: 'Дорослі (18+)'
        },
      ],
      isDataInvalid: false,

      // config data holders below
      organizer: '',
      name: '',
      location: '',
      selectedGender: '',
      date: null,
      dateMenu: false,
      time: null,
      timeMenu: false,
      selectedCompetitions: [],
      selectedParalelCompetitions: []
    }
  },
  async mounted () {
    await this.fetchCompetitionById();
  },
  watch: {
    time: {
      handler(v) {
        console.warn('date', v)
      },
      deep: true
    }
  },
  methods: {
    /**
     * {{
     *  name: string,
     *  organizer: string,
     *  location: location,
     *  gender: ('junes'|'juniors'|'young'|'adults'), 
     *  competitions: ('one_hundred_meters'|'assault_ladder'|'dueling'|'retractable_ladder'|'fire_relay'|'deployment')[],
     *  parallelItems: ('two'|'three'|'four')[],
     * }} config
     */
    assignConfig(config) {
      this.name = config.name || '';
      this.organizer = config.organizer || '';
      this.date = config.date || null;
      this.time = config.time || null;
      this.selectedGender = this.genderItems.find(({ id }) => id === config.gender);
      this.selectedCompetitions = this.competitionItems.filter(({ id }) => (config.competitions ||[]).includes(id));
      this.selectedParalelCompetitions = this.paralelCompetitionItems.filter(({ id }) => (config.parallelItems ||[]).includes(id));
    },
    async fetchCompetitionById() {
      const id = this.$route.params.id;
      return this.axios.get(`private/competitions/${id}/config`)
        .then(({ data = {} }) => {
          // TODO update model
          this.assignConfig({ name: 'test', gender: 'junes', date: '2023-02-24', time: '17:14', competitions: ['assault_ladder']});
        })
    },
    save (date) {
        this.$refs.dateMenu.save(date)
    },
    unselectCompetition(id) {
      this.selectedCompetitions = this.selectedCompetitions.filter((item) => item.id !== id);
    },
    unselectParalelCompetition(id) {
      this.selectedParalelCompetitions = this.selectedParalelCompetitions.filter((item) => item.id !== id);
    },
    unselectGender() {
      this.selectedGender = '';
    },
  }
}
</script>
<template>
  <v-container class="config-main white--text" ma-0 pa-0 fluid color="white">
    <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3">
    <v-row class="mt-0">
      <v-col cols="6" class="pt-0">
        <v-textarea
          dark
          label="Організація"
          v-model="organizationName"
          hide-details
        ></v-textarea>
      </v-col>
      <v-col cols="6" class="pt-0">
        <v-textarea
          dark
          label="Назва змаганнь"
          v-model="name"
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
          :return-value.sync="competitionDate"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="competitionDate"
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
            v-model="competitionDate"
            :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
            @change="saveDate"
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
          v-model="locationName"
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
          v-model="sportTypes"
          :items="sportTypesOptions"
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
          v-model="parallelItems"
          :items="parallelItemsOptions"
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
          v-for="(item, index) in protocolOptions"
          :key="index"
          dark
          :value="protocolOptionTypes.includes(item.id)"
          :label="item.name"
          dense
          hide-details
          @change="updateProtocolOptionTypes(item.id)"
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-sheet>

    <v-divider color="white" class="mt-4" />

    <div class="mt-3 d-flex justify-space-between">
      <v-btn color="light-green white--text" :disabled="isDataInvalid"
        @click="saveConfig"
      >
        Save
      </v-btn>
      <v-btn color="white" @click="$router.push({ name: 'editCompetition', params: { id: $route.params.id}})">
        Скасувати
      </v-btn>
    </div>
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      multi-line
    >
      <h3 class="text-center mb-4" v-if="snackbarError">Помилка! {{  snackbarError  }}</h3>
      <h3 class="text-center mb-4" v-else>Змагання створене успішно!</h3>
      <v-row class="text-center justify-center">
        <v-btn
          text
          @click="reloadPage()"
        >
          Нове змагання
        </v-btn>
        <v-btn
          v-if="nextReferenceId"
          text
          @click="openSavedCompetition()"
        >
          Перейти на змагання
        </v-btn>
        <v-btn
          text
          @click="resetSnackbar()"
        >
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
      nextReferenceId: null,
      showSnackbar: false,
      snackbarColor: 'primary',
      snackbarError: '',
      protocolOptions: [
        { id: 'SHOW_LOGOS', name: 'Відображати в протоколах логотипи', value: true },
        { id: 'show_competition_icon', name: 'Відображати графічні символи видім змаганнь', value: false },
        { id: 'show_protocol_normatives', name: 'Відображати в стартових протоколах розрядні нормативи', value: true },
        { id: 'show_protocol_achievements', name: 'Відображати в стартових протоколах вищі досягнення', value: true },
        { id: 'show_protocol_level', name: 'Відображати в стартових протоколах колонку Розряд', value: true },
        { id: 'show_protocol_best_score', name: 'Відображати в стартових протоколах колонку Кращий результат', value: true },
        { id: 'show_protocol_level_sports', name: 'Відображати в стартових протоколах колонку спортивні розряди', value: true },
        { id: 'SHOW_WEATHER', name: 'Виводити в фінішних протоколах опис погоди', value: false },
        { id: 'english_data', name: 'Дублювати протоколи англійською', value: false },
        { id: 'english_protocols', name: 'Англійська версія протоколів', value: false },
        { id: 'sum_junior_data', name: 'Сумувати суми місць юніорських змаганнь', value: false },
        { id: 'SHOW_PRINT', name: 'Виводити на друк', value: false },
      ],
      sportTypesOptions: [
        {
          id: 'HUNDRED_METERS', name: '100 метрова полоса'
        }, 
        {
          id: 'ASSAULT_LADDER', name: 'Штурмова драбина'
        },
        {
          id: 'DUELING', name: 'Двоборство'
        },
        {
          id: 'RETRACEABLE_LADDER', name: 'Висувна драбина'
        },
        {
          id: 'FIRE_DELAY', name: 'Пожежна естафета'
        },
        {
          id: 'DEPLOYMENT', name: 'Бойове розгортання'
        }
      ],
      parallelItemsOptions: [
        {
          id: 'TWO', name: 'Проводити паралельно друге змагання'
        },
        {
          id: 'THREE', name: 'Проводити паралельно третє змагання'
        },
        {
          id: 'FOUR', name: 'Проводити паралельно четверте змагання'
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
      organizationName: '',
      name: '',
      locationName: '',
      selectedGender: '',
      competitionDate: null,
      dateMenu: false,
      time: null,
      timeMenu: false,
      sportTypes: [],
      parallelItems: [],
      protocolOptionTypes: [],
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  async mounted () {
    if (this.id) {
      await this.fetchCompetitionById();
    } else {
      this.assignConfig({});
    }
  },
  methods: {
    reloadPage() {
      this.assignConfig({});
      this.resetSnackbar();
    },
    resetSnackbar() {
      this.showSnackbar = false;
      this.nextReferenceId = null;
      this.snackbarError = '';
    },
    openSavedCompetition() {
      this.$router.push({
        name: 'configMain',
        params: { id: this.nextReferenceId },
      });
    },
    validateConfig() {
      // @TODO verify all values 
    },
    /**
     * {{
     *  name: string,
     *  organizerName: string,
     *  locationName: string,
     *  gender: ('junes'|'juniors'|'young'|'adults'), 
     *  sportTypes: ('HUNDRED_METERS'|'ASSAULT_LADDER'|'DUELING'|'RETRACEABLE_LADDER'|'FIRE_DELAY'|'DEPLOYMENT')[],
     *  parallelItems: ('TWO'|'THREE'|'FOUR')[],
     *  otherOptions: string[],
     *  competitionDate: string,
     *  protocolOptionTypes: ('show_logos'|'show_competition_icon')[]
     * }} config
     */
    assignConfig(config) {
      this.name = config.name || '';
      this.organizationName = config.organizationName || '';
      this.competitionDate = config.competitionDate || null;
      this.time = config.time || null;
      this.locationName = config.locationName || null;
      this.selectedGender = this.genderItems.find(({ id }) => id === config.gender);
      this.sportTypes = this.sportTypesOptions.filter(({ id }) => (config.sportTypes ||[]).includes(id));
      this.parallelItems = this.parallelItemsOptions.filter(({ id }) => (config.parallelItems ||[]).includes(id));
      this.protocolOptionTypes = config.protocolOptionTypes || [];
    },
    async saveConfig() {
      const configId = this.id;
      let requestData = {
        name: this.name,
        organizationName: this.organizationName,
        competitionDate: this.competitionDate,
        time: this.time,
        locationName: this.locationName,
        sportTypes: this.sportTypes.map(({id}) => id),
        parallelItems: this.parallelItems.map(({id}) => id),
        protocolOptionTypes: this.protocolOptionTypes,
      };
      if (this.selectedGender) {
        requestData.gender = this.selectedGender.id;
      }
      if (this.time) {
        requestData.time = this.time;
      }

      try {
        const {data} = configId ?
         await this.axios.put(`private/competitions/${configId}`, requestData) :
         await this.axios.post(`private/competitions`, requestData);

        this.nextReferenceId = !configId && data.reference ? data.reference : null;
        this.snackbarError = '';
        this.snackbarColor ='success';
        this.showSnackbar = true;
      } catch (error) {
        this.snackbarError = 'TODO PARSE MESSAGE';
        this.snackbarColor ='error';
        this.showSnackbar = true;
      }
    },
    async fetchCompetitionById() {
      const id = this.$route.params.id;
      return this.axios.get(`private/competitions/${id}/config`)
        .finally((response) => { // should be 'then' data - (BE config doesnt work yet)
          // TODO update model
          this.assignConfig({ name: 'test', gender: 'junes', competitionDate: '2023-02-24', time: '17:14', sportTypes: ['ASSAULT_LADDER'], protocolOptionTypes: ['SHOW_LOGOS']});
        })
    },
    saveDate(date) {
        this.$refs.dateMenu.save(date)
    },
    unselectCompetition(id) {
      this.sportTypes = this.sportTypes.filter((item) => item.id !== id);
    },
    unselectParalelCompetition(id) {
      this.parallelItems = this.parallelItems.filter((item) => item.id !== id);
    },
    unselectGender() {
      this.selectedGender = '';
    },
    updateProtocolOptionTypes(id) {
      if (!this.protocolOptions.find((option) => option.id === id)) return;

      const items = this.protocolOptionTypes;
      this.protocolOptionTypes = items.includes(id) ?
        items.filter((optionId) => optionId !== id) :
        [...items, id];
    }
  }
}
</script>
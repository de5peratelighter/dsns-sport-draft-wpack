<template>
  <v-container class="config-judges white--text" ma-0 pa-0 fluid>
    <v-data-table
      :headers="mainConfigurationHeaders"
      :items="mainConfigurations"
      dense
      disable-sort
      disable-pagination
      hide-default-footer	
    >
      <template v-slot:[`item.${nameKey}`]="{ item }">
        <v-text-field v-model="item[nameKey]" dense></v-text-field>
      </template>
      <template v-slot:[`item.${initialsKey}`]="{ item }">
        <v-text-field v-model="item[initialsKey]" dense></v-text-field>
      </template>
    </v-data-table>
    <v-spacer class="my-3" />
    <v-data-table
      :headers="otherConfigurationHeaders"
      :items="otherConfigurations"
      dense
      disable-sort
      disable-pagination
      hide-default-footer	
    >
      <template v-slot:[`item.${nameKey}`]="{ item }">
        <v-text-field v-model="item[nameKey]" dense></v-text-field>
      </template>
      <template v-slot:[`item.${initialsKey}`]="{ item }">
        <v-text-field v-model="item[initialsKey]" dense></v-text-field>
      </template>
    </v-data-table>

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
      nameKey: 'name',
      initialsKey: 'initials',
      mainConfigurations: [],
      otherConfigurations: []
    }
  },
  computed: {
    mainConfigurationHeaders() {
      return [
        { text: '', value: 'description', width: '20%' },
        { text: 'Спортивне звання', value: this.nameKey, width: '45%' },
        { text: 'Призвіще, ініціали', value: this.initialsKey, width: '35%' },
      ]
    },
    otherConfigurationHeaders() {
      return [
        { text: 'Старший суддя з виду', value: 'description', width: '20%' },
        { text: 'Спортивне звання', value: this.nameKey, width: '45%' },
        { text: 'Призвіще, ініціали', value: this.initialsKey, width: '35%' },
      ]
    },
    isDataInvalid() {
      const [mainConfigs, otherConfigs] = [this.mainConfigurations, this.otherConfigurations]
      if (!mainConfigs.length || !otherConfigs.length) return true;
      const [nameKey, initialsKey] = [this.nameKey, this.initialsKey]
      return mainConfigs.some((item) => !item?.[nameKey].trim() || !item?.[initialsKey].trim()) ||
        otherConfigs.some((item) => !item?.[nameKey].trim() || !item?.[initialsKey].trim())
    }
  },
  mounted() {
    this.fetchJudgesConfigurations();
  },
  methods: {
   async fetchJudgesConfigurations() {
      const requestData = {};
      return Promise.resolve(requestData)
        .then(({ data = [] }) => {
          this.otherConfigurations = [
            { 
              "id": 'one_hundred_meters',
              "description": "100 метрова полоса", 
              "name": "1",
              "initials": "11"
            },
            { 
              "id": 'assault_ladder',
              "description": "Штурмова драбина", 
              "name": "1",
              "initials": "11"
            },
            { 
              "id": 'dueling',
              "description": "Двоборство", 
              "name": "1",
              "initials": "11"
            },
            { 
              "id": 'retractable_ladder',
              "description": "Висувна драбина", 
              "name": "1",
              "initials": "11"
            },
            { 
              "id": 'fire_relay',
              "description": "Пожежна естафета", 
              "name": "1",
              "initials": "11"
            },
            { 
              "id": 'deployment',
              "description": "Бойове розгортання", 
              "name": "1",
              "initials": "11"
            },
          ];
          this.mainConfigurations = [
            { 
              "id": 'main_judge',
              "description": "Головний суддя змагань", 
              "name": "1",
              "initials": "11"
            },
            { 
              "id": 'main_secretary',
              "description": "Головний секретар змагань", 
              "name": "2",
              "initials": "22"
            },
            { 
              "id": 'judge_inspector',
              "description": "Суддя інспектор змагань", 
              "name": "3",
              "initials": "33"
            },
            { 
            "id": 'starter',
              "description": "Стартер", 
              "name": "4",
              "initials": "44"
            },
          ];
        })
    },
    save() {
      const requestData = { mainConfigurations, otherConfigurations }
      Promise.resolve(requestData)
    }
  }
}
</script>
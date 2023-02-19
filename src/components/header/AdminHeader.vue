<template>
    <v-container ma-0 pa-0 fluid>
        <v-row justify="center" class="ma-0">
        <v-btn text color="white" @click="$router.push({name: 'selectCompetition'})">
          Змінити змагання
        </v-btn>
        <v-menu
          offset-y
          open-on-hover
          :close-on-content-click="false"
          >
          <template v-slot:activator="{ on, attrs }">
            <v-btn text color="white" v-bind="attrs"
              v-on="on">
              Налаштування
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in adminMenuItems"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title v-if="item.items" v-text="item.title" />
                <v-list-item-title 
                  v-else 
                  v-text="item.title" @click="$router.push(item.to)"
                  style="cursor: pointer"
                />
                <v-list>
                  <v-list-item
                    v-for="(subitem, j) in item.items" :key="j"
                    @click="$router.push(subitem.to)"
                  >
                    <v-list-item-title v-text="subitem.title"></v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu
          offset-y
          open-on-hover
          :close-on-content-click="false"
          >
          <template v-slot:activator="{ on, attrs }">
            <v-btn text color="white" v-bind="attrs"
              v-on="on">
              Реєстрація
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in registrationMenuItems"
              :key="i"
              @click="$router.push(item.to)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        
        <v-menu
          offset-y
          open-on-hover
          :close-on-content-click="false"
          >
          <template v-slot:activator="{ on, attrs }">
            <v-btn text color="white" v-bind="attrs"
              v-on="on">
              Протоколи
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in protocolMenuItems"
              :key="i"
              @click="$router.push(item.to)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn text color="error" @click="$router.push({ name: 'main'})">
          Вихід
        </v-btn>
      </v-row>
    </v-container>
</template>

<script>
export default {
  data: function () {
    return {
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    registrationMenuItems() {
      const params = {id: this.id };
      return [
          {
            title: 'Команди',
            to: { name: 'registerTeams', params }
          },
          {
            title: 'Учасники',
            to: { name: 'registerParticipants', params }
          },
      ]
    },
    protocolMenuItems() {
      const params = {id: this.id };
        return [
            {
              title: '100 метрова полоса',
              to: { name: 'protocols', params }
            },
            {
              title: 'Штурмова драбина',
              to: { name: 'protocols', params }
            },
            {
              title: 'Двоборство',
              to: { name: 'protocols', params }
            },
            {
              title: 'Пожежна естафета',
              to: { name: 'protocols', params }
            },
            {
              title: 'Бойове розгортання',
              to: { name: 'protocols', params }
            },
            {
                title: 'Загальнокомандний',
            },
            {
                title: 'Загальнокомандний (по етапах)',
            },
        ]
    },
    adminMenuItems() {
        const params = {id: this.id };
        return [
        {
          title: 'Параметри змаганнь',
          items: [
            { title: 'Основні', to: { name: 'configMain', params } },
            { title: 'Детально по видах', to: { name: 'configByType', params} },
            { title: 'Суддівська бригада', to: { name: 'configJudges', params} },
            { title: 'Логотипи', to: { name: 'configLogos', params} } 
          ]
        },
        {
          title: 'Досягнення',
          to: { name: 'configAchievements', params}
        },
        {
          title: 'Розрядні нормативи',
          to: { name: 'configNormatives', params}
        },
      ]
    }
  },
}

</script>

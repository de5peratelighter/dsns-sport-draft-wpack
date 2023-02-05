<template>
    <v-container ma-0 pa-0 fluid>
      <v-row>
        <v-col cols="10" class="pa-0">
          <div class="d-flex flex-row align-center flex-grow-1">
            <div class="d-flex flex-column align-center">
              <v-btn icon @click="$router.push({ name: 'selectCompetition' })">
                <v-icon color="white" large>mdi-account</v-icon>
              </v-btn>
              
              <v-menu
              offset-y
              >
              <template v-slot:activator="{ on, attrs }">
                <v-app-bar-nav-icon 
                  x-large
                  color="white"
                  v-bind="attrs"
                  v-on="on"
                />
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, i) in mainMenuItems"
                  :key="i"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            </div>
            <v-spacer class="app-header-logo-spacer mr-4 ml-2 flex-grow-0" />
            <v-img
              max-height="90"
              max-width="90"
              contain
              :src="require('@/assets/sport1.png')"
              @click="$router.push('/')"
              style="cursor: pointer"
            />
            <div class="d-flex flex-column align-left ml-6 flex-grow-1">
              <div class="d-flex flex-row justify-space-between flex-grow-1 flex-shrink-0 align-center">
                <div class="text-h6">Чемпіонат України з пожежно-прикладного спорту</div>
                <div>28-30 травня</div>
                <div>м. Київ</div>
                <div>
                  <v-btn small icon>
                    <v-icon color="white">mdi-facebook</v-icon>
                  </v-btn>
                  <v-btn small icon>
                    <v-icon color="white">mdi-twitter</v-icon>
                  </v-btn>
                  <v-btn small icon>
                    <v-icon color="white">mdi-youtube</v-icon>
                  </v-btn>
                </div>
              </div>
              <div class="text-subtitle-1 mb-1">подолання 100м смуги з перешкодами</div>
            </div>
          </div> 
        </v-col>
        <v-col cols="2">
          <div class="d-flex align-center fill-height text-center justify-center">Weather here</div>
        </v-col>
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
    mainMenuItems() {
      const isLoggedIn = true;
      const items = [
        { title: 'Реєстрація команди', show: isLoggedIn },
        { title: 'Протокол команд', show: isLoggedIn },
      ];
      return items.filter(({ show }) => show);
    },
  },
}
</script>


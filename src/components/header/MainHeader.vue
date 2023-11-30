<template>
    <v-container ma-0 pa-0 pt-3 fluid>
      <v-row>
        <v-col cols="10" class="pa-0">
          <div class="d-flex flex-row align-center flex-grow-1">
            <div class="d-flex flex-column align-center">
              <v-btn icon @click="$router.push({ name: 'selectCompetition' })">
                <v-icon color="white" large>mdi-account</v-icon>
              </v-btn>
              
              <v-menu offset-y>
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
                  <v-btn v-for="(social, index) in socialLinks"
                    :key="index"
                    :href="social.url"
                    small
                    icon
                    target="_blank"
                  >
                    <v-icon color="white">{{ `mdi-${social.name}` }}</v-icon>
                  </v-btn>
                </div>
              </div>
              <div class="text-subtitle-1 mb-1">подолання 100м смуги з перешкодами</div>
            </div>
          </div> 
        </v-col>
        <v-col cols="2">
          <div class="d-flex align-center text-center justify-center">
            <button 
              v-for="(language, index) in languageOptions"
              :key="index"
              :class="index ? 'ml-2' : null"
              :style="language.style"
              @click="switchLanguage(language.code)"
            >
              <v-img
                :height="language.height"
                :width="language.width"
                :src="require(`@/assets/${language.code}-flag.png`)"
                :alt="language.alt"
                style="cursor: pointer"
              />
            </button>
          </div>
          <div class="d-flex align-center fill-height text-center justify-center">{{ $t('shared.weather') }}</div>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      activeLang: null,
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
    socialLinks() {
      // @TODO these to be provided by backend
      const items = [
        { name: 'telegram', url: 'https://google.com.ua'},
        { name: 'facebook', url: ''},
        { name: 'twitter', url: ''},
        { name: 'youtube', url: ''},
        { name: 'instagram', url: ''},
        { name: 'web', url: ''},
      ];
      return items;
    },
    languageOptions() {
      const activeLang = this.activeLang;
      const defaultOptions = { width: '33', height: '20' }
      return [
        {
          code: 'uk',
          alt: 'Українська',
        }, 
        {
          code: 'en',
          alt: 'English language',
        }
      ].map((item) => ({...item, ...defaultOptions, style: {'border': `2px solid ${activeLang === item.code ? 'white' : 'transparent'}`}}));
    }
  },
  watch: {
    activeLang: {
      handler(v) {
        if (v) {
          this.$i18n.locale = v;
        } else {
          this.switchLanguage(this.$i18n.locale);
        }
      },
      immediate: true
    }
  },
  methods: {
    switchLanguage(lang) {
      this.activeLang = lang;
      localStorage.setItem('dsns-competitions-lang', lang);
    },
  }
}
</script>


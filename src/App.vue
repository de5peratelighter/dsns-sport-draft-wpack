<template>
  <v-app>
    <template v-if="notHomePage">

      <HomeHeader />

      <v-navigation-drawer
        v-model="drawer"
        fixed
        temporary
      >
      </v-navigation-drawer>
    </template>

    <v-main>
      <v-container fluid class="px-4 py-2 fill-height"> 
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HomeHeader from '@/components/HomeHeader.vue';

export default {
  components: {
    HomeHeader
  },
  data: function () {
    return {
      drawer: false,
    }
  },
  computed: {
    notHomePage() {
        return this.$route.name !== 'home';
    },
  },
  mounted () {
    this.readLanguage();
  },
  methods: {
    readLanguage() {
      let lang = localStorage.getItem('dsns-competitions-lang');
      if (lang) this.$i18n.locale = lang;
    }
  }
}
</script>

<style lang="scss">
html {
  font-size: 18px;
}
#app {
  font-weight: normal;
  width: 100%;
  background: url('@/assets/bg.jpeg');
  background-repeat: repeat;
  background-size: cover;
  /* background: #2193b0; /* fallback for old browsers
  background: -webkit-linear-gradient(to bottom, #2193b0, #6dd5ed);
  background: linear-gradient(to bottom, #2193b0, #6dd5ed); */
}
.app-header {
  &-logo-spacer {
    height: 60px;
    width: 4px;
    background: #fff;
  }
}
</style>
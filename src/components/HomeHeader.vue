<template>
  <v-app-bar app flat absolute tile
    color="transparent" 
    :height="'90px'" 
    class="app-header white--text font-weight-bold"
  >
    <AdminHeader v-if="isEditCompetition || isProtocols" />
    <MainHeader v-if="isMainRoute" />

    <BreadCrumbs v-if="!isProtocols" />
  </v-app-bar>
</template>

<script>
import MainHeader from '@/components/header/MainHeader.vue'
import AdminHeader from '@/components/header/AdminHeader.vue'
import BreadCrumbs from '@/components/header/BreadCrumbs.vue'
export default {
  components: {
    AdminHeader,
    MainHeader,
    BreadCrumbs
  },
  computed: {
    isEditCompetition() {
      return this.$route.name === 'editCompetition'
    },
    isMainRoute() {
      return this.$route.name === 'main'
    },
    isProtocols() {
      return this.$route.name === 'protocols'
    },
  },
}
</script>

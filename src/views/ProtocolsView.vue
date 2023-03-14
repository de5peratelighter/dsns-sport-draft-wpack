<template>
  <v-container class="protocols-view white--text" ma-0 pa-0 fluid>
    <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3 white--text">
      <div class="text-center">
        Сторінка протоколів, ID: {{ competitionId || ''}}
      </div>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
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
      return this.axios.get(`private/competition-types/${this.competitionType}/start-race`)
        .then(({data}) => {
          console.warn('getStartRace', data)
        })
    },
  }
}
</script>
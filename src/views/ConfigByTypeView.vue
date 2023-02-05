<template>
  <v-container class="config-by-type white--text" ma-0 pa-0 fluid>
    <div class="text-center">
      Configuration by type
    </div>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      configurations: []
    }
  },
  mounted() {
    this.fetchConfigurations();
  },
  methods: {
   async fetchConfigurations() {
      const requestData = {};
      return Promise.resolve(requestData)
        .then(({ data = [] }) => {
          this.configurations = data;
        })
    }
  }
}
</script>
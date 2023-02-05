<template>
  <v-row
      justify="center"
      align="center"
      no-gutters
      style="height: 90vh"
    >
    <v-img
      class="home-img"
      max-height="200"
      max-width="200"
      contain
      :src="require('../assets/inner-circle.png')"
    />
    <div class="home-line-wrapper justify-center text-center d-flex">
      <div class="home-line"></div> 
    </div>
    <v-img
      class="home-img"
      max-height="200"
      max-width="200"
      contain
      :src="require('../assets/inner-circle.png')"
    >
      <v-img
        class="home-img mt-3 ml-3"
        max-height="175"
        max-width="175"
        contain
        :src="require('../assets/sport1.png')"
        @click="$router.push('/main')"
      />
    </v-img>
  </v-row>

</template>
<script>
export default {
  data: function () {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
  .img-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .home {
    &-img {
      cursor: pointer;
    }
    &-line {
      width: 5px;
      height: 100%;
      background: linear-gradient(to bottom, rgba(255,255,255,0.3) 0%,rgba(243,243,243,0.9) 50%,rgba(237,237,237,0.9) 51%,rgba(255,255,255,0.3) 100%);
      border-radius: 5px;
      &-wrapper {
        height: 100%;
        width: 300px;
      }
    }
  }
</style>

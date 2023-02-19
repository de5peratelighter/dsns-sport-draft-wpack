<template>
  <v-container class="protocols-view white--text" ma-0 pa-0 fluid>
    <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3 white--text">
      <div class="text-center">
        Сторінка пропотоколів, ID: {{ $route.params.id || ''}} <br />
        Може є зміст використовувати ту саму сторінку з різними табами на різні змагання? 
        (в межах тієї самої сторінки без перезагурузки)
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
}
</script>
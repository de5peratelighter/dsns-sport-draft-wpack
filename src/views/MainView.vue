<template>
    <v-row class="fill-height">
      <v-col cols="7" class="pb-0">
        <v-row style="height: 50%;">
          <v-col cols="8" md="8">
            <div :class="sheetHeadingClasses">{{ $t('shared.onlineLive') }}</div> 
            <v-sheet v-bind="sheetData"></v-sheet>
          </v-col>
          <v-col cols="4">
            <div :class="sheetHeadingClasses">{{ $t('shared.bestResults') }}</div>
            <v-sheet v-bind="sheetData"></v-sheet>
          </v-col>
        </v-row>
        <v-row style="height: 50%;">
          <v-col cols="12">
            <div :class="sheetHeadingClasses">{{ $t('shared.bestByType') }}</div>
            <v-sheet v-bind="sheetData"></v-sheet>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="5" class="fill-height pb-0">
        <v-row class="fill-height">
          <v-col cols="6">
            <div :class="sheetHeadingClasses">{{ $t('shared.teamBestByType') }}</div>
            <v-sheet v-bind="sheetData"></v-sheet>
          </v-col>
          <v-col cols="6">
            <div :class="sheetHeadingClasses">{{ $t('shared.teamOverallBest') }}</div>
            <v-sheet v-bind="sheetData"></v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
</template>

<script>
export default {
  data: function () {
    return {
      sheetData: {
        color: 'rgba(0, 0, 0, 0.35)',
        minHeight: 'calc(100% - 30px)'
      },
      sheetHeadingClasses: 'text-center white--text subtitle-1 pb-2 font-weight-bold text-truncate'
    }
  },
}
</script>


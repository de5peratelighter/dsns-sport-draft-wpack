<template>
  <v-row class="fill-height">
    <v-col cols="7" class="pb-0">
      <v-row style="height: 50%;">
        <v-col cols="8" md="8">
          <div :class="sheetHeadingClasses">{{ $t('shared.onlineLive') }}
            <v-sheet v-bind="sheetData" class="mt-2">
              <iframe class="live-stream" :src="liveStreamLink" frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; web-share"
                allowfullscreen></iframe>
            </v-sheet>
            В РОЗРОБЦІ
          </div>
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
import axios from 'axios';
export default {
  data: function () {
    return {
      liveStreamLink: null,
      sheetData: {
        color: 'rgba(0, 0, 0, 0.35)',
        minHeight: 'calc(100% - 30px)'
      },
      sheetHeadingClasses: 'text-center white--text subtitle-1 pb-2 font-weight-bold text-truncate'
    }
  },
  mounted() {
    this.fetchSocialLinks();
  },
  methods: {
    async fetchSocialLinks() {
      try {
        const response = await axios.get('public/social-network');
        this.socialLinks = response.data.map(link => ({
          name: link.linkType.toLowerCase(),
          url: link.link
        }));
        const liveStream = response.data.find(link => link.linkType === 'ONLINE_TRANSLATION');
        if (liveStream) {
          this.liveStreamLink = liveStream.link;
          console.log('Live stream link:', this.liveStreamLink);
        }
      } catch (error) {
        console.error('Error fetching social links:', error);
      }
    }
  }
}
</script>

<style>
.live-stream {
  max-height: 300px;
  width: 100%;
  height: 100%;
}
</style>


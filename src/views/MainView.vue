<template>
  <v-row class="fill-height">
    <v-col cols="7" class="pb-0">
      <v-row style="height: 50%;">
        <v-col cols="8" md="8">
          <div :class="sheetHeadingClasses">{{ $t('shared.onlineLive') }}
            <v-sheet v-bind="sheetData" class="mt-2">
              <iframe class="live-stream" :src="liveStreamLink" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; web-share" allowfullscreen></iframe>
            </v-sheet>
          </div>
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
        <v-col cols="12">
          <div :class="sheetHeadingClasses">{{ $t('shared.bestResults') }}</div>
          <v-sheet v-bind="sheetData" class="scrollable-sheet">
            <v-simple-table fixed-header height="250px">
              <template>
                <v-sheet v-bind="sheetData" class="scrollable-sheet">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">№</th>
                          <th class="text-left">{{ $t('const.athlete') }}</th>
                          <th class="text-left">{{ $t('const.team') }}</th>
                          <th class="text-left">{{ $t('const.timeSec') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(result, index) in bestResults" :key="result.participantFullName">
                          <td>{{ index + 1 }}</td>
                          <td>{{ result.participantFullName }}</td>
                          <td>{{ result.participantTeamName }}</td>
                          <td>{{ result.bestResult }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-sheet>
              </template>
            </v-simple-table>
          </v-sheet>
        </v-col>

        <v-col cols="12" md="12" class="pb-0">
          <v-row>
            <v-col cols="6">
              <div :class="sheetHeadingClasses">{{ $t('const.teamChampionshipByType') }}</div>
              <v-sheet v-bind="sheetData" class="scrollable-sheet">
                <v-simple-table fixed-header height="250px">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>№</th>
                        <th>{{ $t('const.team') }}</th>
                        <th>{{ $t('const.timeSec') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(teamResult, index) in teamResultsByType" :key="teamResult.teamCompetitionReference">
                        <td>{{ teamResult.position }}</td>
                        <td>{{ teamResult.teamName }}</td>
                        <td>{{ teamResult.result }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-sheet>
            </v-col>

            <v-col cols="6">
              <div :class="sheetHeadingClasses">{{ $t('const.overallTeamChampionship') }}</div>
              <v-sheet v-bind="sheetData" class="scrollable-sheet">
                <v-simple-table fixed-header height="250px">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>№</th>
                        <th>{{ $t('const.team') }}</th>
                        <th>{{ $t('const.sum') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(teamResult, index) in overallTeamResults" :key="teamResult.teamCompetitionReference">
                        <td>{{ teamResult.position }}</td>
                        <td>{{ teamResult.teamName }}</td>
                        <td>{{ teamResult.result }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-sheet>
            </v-col>

          </v-row>
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
      bestResults: [],
      teamResultsByType: [],
      overallTeamResults: [],
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
    this.fetchBestResults();
    this.fetchTeamResultsByType();
    this.fetchOverallTeamResults();
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
    },
    async fetchBestResults() {
      const competitionTypeReference = localStorage.getItem('selectedSportTypeReference');
      if (competitionTypeReference) {
        try {
          const response = await axios.get(`public/competition-types/${competitionTypeReference}/best-race-results`);
          this.bestResults = response.data.bestResultList;
        } catch (error) {
          console.error('Error fetching best results:', error);
          this.bestResults = [];
        }
      }
    },
    async fetchTeamResultsByType() {
      const competitionTypeReference = localStorage.getItem('selectedSportTypeReference');
      if (competitionTypeReference) {
        try {
          const response = await axios.post(`public/teams/competition-types/${competitionTypeReference}/generate-race-result`);
          this.teamResultsByType = response.data;
        } catch (error) {
          console.error('Error fetching team championship by type results:', error);
        }
      }
    },
    async fetchOverallTeamResults() {
      const selectedCompetitionReference = localStorage.getItem('selectedCompetitionReference');
      if (selectedCompetitionReference) {
        try {
          const response = await axios.post(`public/teams/competitions/${selectedCompetitionReference}/generate-team-results`);
          this.overallTeamResults = response.data;
        } catch (error) {
          console.error('Error fetching overall team championship results:', error);
        }
      }
    },
  }
}
</script>

<style>
.live-stream {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 7;
  /* Зберегти пропорції відео */
}

.scrollable-sheet {
  overflow-y: auto;
}
</style>

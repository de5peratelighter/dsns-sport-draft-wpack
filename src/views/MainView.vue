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
      <v-row>
        <v-col cols="12 mt-1">
          <div v-if="hasActiveCompetition" style="height: 100%;">
            <div :class="sheetHeadingClasses">{{ $t('shared.bestByType') }}</div>
            <v-row>
              <v-col cols="12">
                <div class="controls text-center pb-1">
                  <v-btn-toggle v-model="currentStage" mandatory small dense>
                    <v-btn value="start" small>Стартовий протокол</v-btn>
                    <v-btn value="half-final" small>Півфінал</v-btn>
                    <v-btn value="final" small>Фінал</v-btn>
                  </v-btn-toggle>
                </div>
              </v-col>
            </v-row>
            <v-sheet v-bind="sheetData" class="scrollable-sheet personalSheet">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Забіг</th>
                      <th class="text-left">Доріж.</th>
                      <!-- <th class="text-left">№ учас.</th> -->
                      <th class="text-left">Звання/розряд</th>
                      <th class="text-left">Ім'я та прізвище</th>
                      <th class="text-left">Команда</th>
                      <th class="text-left">Перша спроба</th>
                      <th class="text-left">Друга спроба</th>
                      <th class="text-left">Кращий</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(result, index) in raceResults" :key="index">
                      <td>{{ result.roadNumber }}</td>
                      <td>{{ result.trackNumber }}</td>
                      <!-- <td>{{ result.participantNumber }}</td> -->
                      <td>{{ result.participantCategory }}</td>
                      <td>{{ result.participantFullName }}</td>
                      <td>{{ result.participantTeamName }}</td>
                      <td>{{ result.firstResult }}</td>
                      <td>{{ result.secondResult }}</td>
                      <td>{{ result.bestResult }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-sheet>
          </div>
        </v-col>
      </v-row>

    </v-col>

    <v-col cols="5" class="fill-height pb-0">
      <v-row class="fill-height">
        <v-col cols="12">
          <div v-if="hasActiveCompetition">
            <div :class="sheetHeadingClasses">{{ $t('shared.bestResults') }}</div>
            <v-sheet v-bind="sheetData" class="scrollable-sheet">
              <v-simple-table fixed-header>
                <template>
                  <v-sheet v-bind="sheetData" class="scrollable-sheet">
                    <v-simple-table>
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
                    </v-simple-table>
                  </v-sheet>
                </template>
              </v-simple-table>
            </v-sheet>
          </div>
        </v-col>

        <v-col cols="12" md="12" class="pb-0">
          <div v-if="hasActiveCompetition">
            <v-row>
              <v-col cols="6">
                <div :class="sheetHeadingClasses">{{ $t('const.teamChampionshipByType') }}</div>
                <v-sheet v-bind="sheetData" class="scrollable-sheet">
                  <v-simple-table fixed-header>
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
                  <v-simple-table fixed-header>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th>№</th>
                          <th>{{ $t('const.team') }}</th>
                          <th>{{ $t('const.sum') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(teamResult, index) in overallTeamResults"
                          :key="teamResult.teamCompetitionReference">
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
          </div>
        </v-col>
      </v-row>
    </v-col>

  </v-row>
</template>

<script>
import { EventBus } from '../eventBus';
import axios from 'axios';
export default {
  data: function () {
    return {
      bestResults: [],
      teamResultsByType: [],
      overallTeamResults: [],
      raceResults: [],
      currentStage: 'start',
      liveStreamLink: null,
      currentCompetitionReference: localStorage.getItem('selectedCompetitionReference') || null,
      currentSportTypeReference: localStorage.getItem('selectedSportTypeReference') || null,
      sheetData: {
        color: 'rgba(0, 0, 0, 0.35)',
        minHeight: 'calc(100% - 30px)'
      },
      sheetHeadingClasses: 'text-center white--text subtitle-1 pb-2 font-weight-bold text-truncate'
    }
  },
  mounted() {
    window.addEventListener('storage', this.updateData);
    EventBus.$on('competitionChanged', this.updateTablesData);
    EventBus.$on('sportTypeChanged', this.updateTablesData);

    this.fetchSocialLinks();
    this.fetchBestResults();
    this.fetchTeamResultsByType();
    this.fetchOverallTeamResults();
    this.fetchRaceResults();
    this.fetchCompetitions();
    this.updateTablesData();
  },
  beforeDestroy() {
    EventBus.$off('competitionChanged', this.updateTablesData);
    EventBus.$off('sportTypeChanged', this.updateTablesData);
  },
  watch: {
    currentStage(newVal) {
      if (newVal) {
        this.fetchRaceResults();
      }
    },
    currentCompetitionReference(newVal, oldVal) {
      if (newVal !== oldVal) {
        localStorage.setItem('selectedCompetitionReference', newVal);
        this.updateTablesData();
      }
    },
    currentSportTypeReference(newVal, oldVal) {
      if (newVal !== oldVal) {
        localStorage.setItem('selectedSportTypeReference', newVal);
        this.updateTablesData();
      }
    },
  },
  computed: {
    hasActiveCompetition() {
      return !!localStorage.getItem('selectedCompetitionReference');
    },
  },
  methods: {
    updateTablesData() {
      this.fetchBestResults();
      this.fetchTeamResultsByType();
      this.fetchOverallTeamResults();
      this.fetchRaceResults();
    },
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
    async fetchRaceResults() {
      const stageMap = {
        'start': 'start-race-list',
        'half-final': 'half-final-race-results',
        'final': 'final-race-results',
      };
      const competitionTypeReference = localStorage.getItem('selectedSportTypeReference');
      if (competitionTypeReference) {
        try {
          const stageEndpoint = stageMap[this.currentStage] || 'start-race-list';
          const response = await axios.get(`public/competition-types/${competitionTypeReference}/${stageEndpoint}`);
          this.raceResults = response.data;
        } catch (error) {
          console.error('Error fetching race results for', this.currentStage, ':', error);
          this.raceResults = [];
        }
      }
    },
  }
}
</script>

<style scoped>
.controls,
.v-btn-toggle {
  padding: 0;
  background-color: white;
}

.v-sheet {
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}

.v-simple-table {
  margin: 0;
  width: 100%;
  background-color: transparent;
}

.v-btn--small {
  min-width: auto;
  margin: 0 2px;
}

.live-stream {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 7;
}

.scrollable-sheet {
  overflow-y: auto;
  overflow-x: auto;
  height: calc(61vh - 200px);
  max-height: 35vh;
  width: 100%;
}

.personalSheet {
  overflow-y: auto;
  overflow-x: auto;
  height: calc(50vh - 200px);
  max-height: 35vh;
  width: 100%;
}

@media (max-width: 600px) {
  .scrollable-sheet {
    height: calc(70vh - 100px);
    /* Зменшена висота для мобільних пристроїв */
  }
}

@media (min-width: 601px) and (max-width: 1024px) {
  .scrollable-sheet {
    height: calc(100vh - 150px);
    /* Проміжна висота для планшетів */
  }
}
</style>

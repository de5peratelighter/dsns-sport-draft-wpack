<template>
  <v-container class="competitions-container white--text" ma-0 pa-0 fluid>
    <div class="competitions-wrapper">
      <div class="d-flex justify-space-between px-4 mb-2">
        <div class="d-flex flex-column align-center">
          <span class="text-subtitle-1 text-center" style="max-width: 100px; margin-left: -20px; word-wrap: break-word;">Активні
            змагання</span>
        </div>
        <div class="d-flex flex-column align-center">
          <span class="text-subtitle-1 text-center" style="max-width: 100px; margin-right: 90px; word-wrap: break-word;">Зведений
            протокол</span>
        </div>
      </div>
      <v-list two-line pa-0 class="pa-0">
        <v-list-item-group v-model="selectedIndex" active-class="primary--text">
          <template v-for="(item, index) in competitions">
            <v-list-item :key="item.title" class="competitions-item">
              <template #default>
                <div class="d-flex align-center justify-space-between" style="width: 100%;">
                  <div class="d-flex align-center">
                    <v-checkbox v-model="item.show" style="margin-left: 10px" @change="updateShowStatus(item)"></v-checkbox>
                    <v-list-item-content style="margin-left: 20px;">
                      <v-list-item-title v-text="item.name" class="text-center"></v-list-item-title>
                      <v-list-item-subtitle class="text--primary" v-text="item.competitionDate"></v-list-item-subtitle>
                    </v-list-item-content>
                  </div>
                  <div class="d-flex">
                    <v-checkbox v-model="item.checked"></v-checkbox>
                    <div class="d-flex align-center location-delete-block">
                      <v-list-item-action-text v-text="item.locationName"></v-list-item-action-text>
                      <v-icon @click.stop.prevent="deleteItem(item)">mdi-delete</v-icon>
                    </div>
                  </div>
                </div>
              </template>
            </v-list-item>
            <v-divider v-if="index < competitions.length - 1" :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </div>

    <div class="competitions-buttons mt-3 d-flex justify-space-between">
      <div>
        <v-btn color="white" @click="$router.push({ name: 'configMain' })">
          {{ $t('shared.selectCompetitionCreate') }}
        </v-btn>
        <v-btn class="white--text ml-5" color="green" @click="selectCompetition" :disabled="!chosenItem">
          {{ $t('shared.selectCompetitionEdit') }}
        </v-btn>
        <v-btn class="white--text ml-5" color="green" @click="$router.push({ name: 'competitionSettings' })">
          {{ $t('shared.selectCompetitionSettings') }}
        </v-btn>
      </div>
      <div>
        <v-btn class="white--text mr-5" color="blue" @click="consolidatedProtocol">
          {{ $t('shared.selectCompetitionConsolidatedProtocol') }}
        </v-btn>
        <v-btn color="white" @click="$router.push({ name: 'main' })">
          {{ $t('shared.selectCompetitionLeave') }}
        </v-btn>
      </div>
    </div>
  </v-container>
</template>


<script>
import axios from 'axios';
export default {
  data: function () {
    return {
      selectedIndex: [],
      competitions: [],
    };
  },
  computed: {
    chosenItem() {
      return this.competitions.find((_, index) => index === this.selectedIndex);
    },
  },
  mounted() {
    this.fetchCompetitions();
  },
  methods: {
    selectCompetition() {
      localStorage.setItem('selectedCompetitionName', this.chosenItem.name);
      this.$router.push({
        name: 'editCompetition',
        params: { id: this.chosenItem.competitionReference }
      });
    },
    async fetchCompetitions() {
      try {
        const accessToken = this.getAccessToken();

        if (!accessToken) {
          console.error('Access token not available. User may not be authenticated.');
          return;
        }

        const response = await axios.get('private/competitions', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        this.competitions = response.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized access. Redirecting to login page.');
        } else {
          console.error('Error fetching competitions:', error);
        }
      }
    },
    async deleteItem(item) {
      try {
        const accessToken = this.getAccessToken();

        if (!accessToken) {
          console.error('Access token not available. User may not be authenticated.');
          return;
        }

        const response = await axios.delete(`private/competitions/${item.competitionReference}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log('Item deleted:', response.data);

        await this.fetchCompetitions();
      } catch (error) {
        console.error('Error deleting competition:', error);
      }
    },
    getAccessToken() {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token not available. User may not be authenticated.');
        return null;
      }

      return accessToken;
    },
    async updateShowStatus(item) {
      try {
        const accessToken = this.getAccessToken();
        if (!accessToken) {
          console.error('Access token not available. User may not be authenticated.');
          return;
        }

        const response = await axios.patch(`private/competitions/${item.competitionReference}`, {
          show: item.show,
        }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log('Show status updated:', response.data);
      } catch (error) {
        console.error('Error updating show status:', error);
      }
    },
  },
}
</script>

<style lang="scss">
.competitions {
  &-wrapper {
    height: calc(100vh - 100px - 150px);
    overflow: auto;
  }

  &-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &>.d-flex:first-child,
    &>.d-flex:last-child {
      flex: 1;
    }

    .v-checkbox:first-of-type {
      // Для першого чекбокса в блоку, щоб він був вирівняний з другим
      margin-right: 0;
    }

    .location-delete-block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 120px;
      padding-left: 15px;

      .v-list-item-action-text {
        white-space: nowrap; // Запобігає переносу тексту
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .v-checkbox {
    padding: 0;
    margin: 0;
    flex-shrink: 0;
  }
}
</style>

<template>
  <v-container class="competitions-container white--text" ma-0 pa-0 fluid>
    <div class="competitions-wrapper">
      <v-list two-line pa-0 class="pa-0">
        <v-list-item-group v-model="selectedIndex" active-class="primary--text">
          <template v-for="(item, index) in competitions">
            <v-list-item :key="item.title" class="competitions-item">
              <template #default>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name" class="text-center"></v-list-item-title>

                  <v-list-item-subtitle class="text--primary" v-text="item.competitionDate"></v-list-item-subtitle>

                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text v-text="item.locationName"></v-list-item-action-text>
                  <v-icon @click.stop.prevent="deleteItem(item)">mdi-delete</v-icon>
                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider v-if="index < competitions.length - 1" :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </div>
    <div class="competitions-buttons mt-3 d-flex justify-space-between">
      <v-btn color="white" @click="$router.push({ name: 'configMain' })">
        {{ $t('shared.selectCompetitionCreate') }}
      </v-btn>
      <v-btn class="white--text" color="green" @click="$router.push({
        name: 'editCompetition', params: { id: chosenItem.competitionReference }
      })" :disabled="!chosenItem">
        {{ $t('shared.selectCompetitionEdit') }}
      </v-btn>
      <v-btn color="white" @click="$router.push({ name: 'main' })">
        {{ $t('shared.selectCompetitionLeave') }}
      </v-btn>
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
  },
}
</script>

<style lang="scss">
.competitions {
  &-wrapper {
    height: calc(100vh - 100px - 150px);
    overflow: auto;
  }

  &-item {}
}
</style>



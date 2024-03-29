<template>
  <v-container ma-0 pa-0 fluid>
    <v-row justify="center" class="ma-0">
      <v-col cols="12" class="text-center">
        <v-list-item-title class="white--text">
          {{ selectedCompetitionName }}
        </v-list-item-title>
      </v-col>
    </v-row>
    <v-row justify="center" class="ma-0">
      <v-btn text color="white" @click="$router.push({ name: 'selectCompetition' })">
        {{ $t('shared.navMenuCompetitionChange') }}
      </v-btn>
      <v-menu offset-y open-on-hover :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text color="white" v-bind="attrs" v-on="on">
            {{ $t('shared.navMenuConfiguration') }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in adminMenuItems" :key="i">
            <v-list-item-content>
              <v-list-item-title v-if="item.items" v-text="item.title" />
              <v-list-item-title v-else v-text="item.title" @click="$router.push(item.to)" style="cursor: pointer" />
              <v-list>
                <v-list-item v-for="(subitem, j) in item.items" :key="j" @click="$router.push(subitem.to)">
                  <v-list-item-title v-text="subitem.title"></v-list-item-title>
                </v-list-item>
              </v-list>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y open-on-hover :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text color="white" v-bind="attrs" v-on="on">
            {{ $t('shared.navMenuRegister') }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in registrationMenuItems" :key="i" @click="$router.push(item.to)">
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu offset-y open-on-hover>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text color="white" v-bind="attrs" v-on="on">
            {{ $t('shared.navMenuProtocols') }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, i) in protocolMenuItems" :key="i"
            :disabled="item.to && $route.params.type ? $route.params.type === item.to.params.type : false"
            @click="$router.push(item.to)">
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn text color="error" @click="$router.push({ name: 'main' })">
        {{ $t('shared.navMenuLeave') }}
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      competitionReferences: [],
      isLoading: false,
      selectedCompetitionName: localStorage.getItem('selectedCompetitionName') || 'Назва змагання',
    }
  },
  mounted() {
    this.getCompetitionReferences();
  },
  methods: {
    async getCompetitionReferences() {
      this.isLoading = true;
      return this.axios.get(`private/competitions/${this.competitionId}/type`)
        .then(({ data }) => {
          this.competitionReferences = data;
        })
        .finally(() => {
          this.isLoading = false;
        })
    },
  },
  computed: {
    competitionId() {
      return this.$route.params.id;
    },
    registrationMenuItems() {
      const params = { id: this.competitionId };
      return [
        {
          title: this.$t('shared.navSubMenuTeams'),
          to: { name: 'registerTeams', params }
        },
        {
          title: this.$t('shared.navSubMenuParticipants'),
          to: { name: 'registerParticipants', params }
        },
      ]
    },
    protocolMenuItems() {
      const params = { id: this.competitionId };
      const competitionReferences = this.competitionReferences;

      return [...competitionReferences.map(({ reference, sportType }) => {
        return {
          title: this.$t(`const.${sportType}`),
          to: { name: 'protocols', params: { ...params, type: reference } }
        }
      })
      ];
    },
    adminMenuItems() {
      const params = { id: this.competitionId };
      return [
        {
          title: this.$t(`shared.navMenuConfigurationParameters`),
          items: [
            { title: this.$t(`shared.navMenuConfigurationMain`), to: { name: 'configMain', params } },
            { title: this.$t(`shared.navMenuConfigurationDetails`), to: { name: 'configByType', params } },
            { title: this.$t(`shared.navMenuConfigurationJury`), to: { name: 'configJudges', params } },
            { title: this.$t(`shared.navMenuConfigurationLogos`), to: { name: 'configLogos', params } }
          ]
        },
        {
          title: this.$t(`shared.navMenuConfigurationAchievement`),
          to: { name: 'configAchievements', params }
        },
        {
          title: this.$t(`shared.navMenuConfigurationBitStandarts`),
          to: { name: 'configNormatives', params }
        },
      ]
    }
  },
}

</script>
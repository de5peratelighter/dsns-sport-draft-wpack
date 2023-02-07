<template>
    <v-container ma-0 pa-0 fluid v-if="isVisible">
        <v-row v-if="breadCrumbItems.length">
          <v-breadcrumbs light :items="breadCrumbItems">
            <template v-slot:divider>
              <v-icon color="white">mdi-chevron-right</v-icon>
            </template>
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :disabled="item.disabled" class="breadcrumbs-item white--text">
                <span @click="$router.push(item.to)">
                  {{ item.text.toUpperCase() }}
                </span>
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-row>
        <template v-if="isSelectCompetitionRoute">
          <v-row class="justify-center">
            <div class="d-flex justify-center">
              Виберіть змагання із вже існуючих або створіть нове
            </div>
          </v-row>
        </template>
        <template v-else-if="isConfigByTypeRoute">
          <v-row class="justify-center">
            <div class="d-flex justify-center">
              Детальні налаштування по видах
            </div>
          </v-row>
        </template>
        <template v-else-if="isConfigJudgesRoute">
          <v-row class="justify-center">
            <div class="d-flex justify-center">
              Склад суддівської колегії
            </div>
          </v-row>
        </template>
        <template v-else-if="isConfigCoreMain">
          <v-row class="justify-center">
            <div class="d-flex justify-center">
              Налаштування змаганнь
            </div>
          </v-row>
        </template>
    </v-container>
</template>
<script>
export default {
  computed: {
    isVisible() {
      return this.breadCrumbItems.length > 0 || 
        this.isSelectCompetitionRoute;
    },
    isSelectCompetitionRoute() {
      console.warn('this.$route.name',this.$route.name)
      return this.$route.name === 'selectCompetition'
    },
    isEditCompetitionRoute() {
      return this.$route.name === 'editCompetition'
    },
    isConfigByTypeRoute () {
      return this.$route.name === 'configByType';
    },
    isConfigJudgesRoute () {
      return this.$route.name === 'configJudges'
    },
    isConfigCoreMain () {
      return this.$route.name === 'configMain'
    },
    isConfigLogos () {
      return this.$route.name === 'configLogos'
    },
    isConfigAchievementsRoute () {
      return this.$route.name === 'configAchievements'
    },
    isConfigNormativesRoute () {
      return this.$route.name === 'configNormatives'
    },
    isRegisterTeamsRoute (){
      return this.$route.name === 'registerTeams'
    },
    isRegisterParticipantsRoute (){
      return this.$route.name === 'registerParticipants'
    },
    breadCrumbItems() {
      let params = { id: this.$route.params.id }
      if (this.isConfigAchievementsRoute) {
        let configItems = [
          {
            text: 'Налаштування',
            disabled: false,
            exact: true,
            to: { name: 'editCompetition', params },
          },
          {
            text: 'Досягнення',
            disabled: true,
            exact: true,
          }
        ];
        return configItems;
      } else if (this.isRegisterTeamsRoute || this.isRegisterParticipantsRoute) {
        let configItems = [
          {
            text: 'Реєстрація',
            disabled: false,
            exact: true,
            to: { name: 'editCompetition', params },
          },
        ];
        if (this.isRegisterTeamsRoute) {
          configItems.push(
            {
              text: 'Команди',
              disabled: true,
              exact: true,
            }
          )
        } else if (this.isRegisterParticipantsRoute) {
          configItems.push(
            {
              text: 'Учасники',
              disabled: true,
              exact: true,
            }
          )
        }
        return configItems;
      } else if (this.isConfigByTypeRoute || 
       this.isConfigJudgesRoute || 
       this.isConfigCoreMain ||
       this.isConfigLogos || 
       this.isConfigNormativesRoute
      ) {
        let configItems = [
          {
            text: 'Налаштування',
            disabled: false,
            exact: true,
            to: { name: 'editCompetition', params },
          },
        ];
        if (this.isConfigByTypeRoute) {
          configItems.push(
            {
              text: 'По типу',
              disabled: true,
              exact: true,
            }
          )
        } else if (this.isConfigJudgesRoute) {
          configItems.push(
            {
              text: 'Судді',
              disabled: true,
              exact: true,
            }
          )
        } else if (this.isConfigCoreMain) {
          if (!params.id) {
            configItems = [
              {
                text: 'Змінити змагання',
                disabled: false,
                exact: true,
                to: { name: 'selectCompetition' }
              }
            ];
          }
          configItems.push(
            {
              text: 'Основні',
              disabled: true,
              exact: true,
            }
          ) 
        } else if (this.isConfigLogos) {
          configItems.push(
            {
              text: 'Логотипи',
              disabled: true,
              exact: true,
            }
          ) 
        } else if (this.isConfigNormativesRoute) {
          configItems.push(
            {
              text: 'Розрядні нормативи',
              disabled: true,
              exact: true,
            }
          ) 
        }
        return configItems;
      }
      return [];
    }
  },
}
</script>

<style lang="scss">
  .breadcrumbs {
    &-item {
      cursor: pointer;
    }
  }
</style>
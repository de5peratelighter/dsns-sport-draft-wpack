<template>
    <v-container ma-0 pa-0 fluid v-if="isVisible">
        <v-row v-if="breadCrumbItems.length" class="justify-center">
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
              {{ $t('shared.selectCompetitionTitle') }}
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
      return this.breadCrumbItems.length > 0 || this.isSelectCompetitionRoute;
    },
    id() {
      return this.$route.params.id;
    },
    routeName() {
      return this.$route.name;
    },
    isSelectCompetitionRoute() {
      return this.routeName === 'selectCompetition'
    },
    isEditCompetitionRoute() {
      return this.routeName === 'editCompetition'
    },
    isConfigByTypeRoute () {
      return this.routeName === 'configByType';
    },
    isConfigJudgesRoute () {
      return this.routeName === 'configJudges'
    },
    isConfigCoreMain () {
      return this.routeName === 'configMain'
    },
    isConfigLogos () {
      return this.routeName === 'configLogos'
    },
    isConfigAchievementsRoute () {
      return this.routeName === 'configAchievements'
    },
    isConfigNormativesRoute () {
      return this.routeName === 'configNormatives'
    },
    isRegisterTeamsRoute (){
      return this.routeName === 'registerTeams'
    },
    isRegisterParticipantsRoute (){
      return this.routeName === 'registerParticipants'
    },
    isProtocolsRoute (){
      return this.routeName === 'protocols'
    },
    breadCrumbItems() {
      let params = { id: this.id }
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
      } else if (this.isProtocolsRoute) {
        let configItems = [
          {
            text: 'Протоколи',
            disabled: false,
            exact: true,
            to: { name: 'editCompetition', params },
          },
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
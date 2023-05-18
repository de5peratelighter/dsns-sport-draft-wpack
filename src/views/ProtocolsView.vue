<template>
  <v-container class="protocols-view white--text" ma-0 pa-0 fluid>
    <div v-if="isPageLoading" class="text-center">
      <v-progress-circular
        :size="100"
        color="white"
        indeterminate
      ></v-progress-circular>
    </div>
    <template v-else>
    <v-row v-if="activeCompetitionStatus === 'INACTIVE'" class="text-center justify-center mt-3">
      <div class="d-flex" style="flex-direction: column">
        <h4 class="text-center mb-4">{{ activeCompetitionType ? `Стартовий протокол: ${competitionTranslations[activeCompetitionType.sportType]}` : '' }}</h4>
        <template v-if="isDueling">
            <div>{{  competitionTranslations.ASSAULT_LADDER }} та {{ competitionTranslations.HUNDRED_METER }} наразі не завершені</div>
              <v-btn
                  color="light-green white--text"
                  :disabled="!isDuelingReadyfToBeStarted"
                  @click="startCompetition"
              >
                Розпочати змагання
              </v-btn>
        </template>
        <v-btn 
          v-else
          color="light-green white--text"
          @click="startCompetition"
        >
          Розпочати змагання
        </v-btn>
      </div>
    </v-row>
    <v-row v-else>
      <template v-if="activeCompetitionType">
        <v-col cols="7" class="pr-0">
          <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-2 white--text">
            <h4 class="text-center">{{ activeCompetitionType ? `${competitionTranslations[activeCompetitionType.sportType]}` : '' }}</h4>
            <v-stepper v-model="stepper" non-linear style="position: sticky; top: 0; z-index: 1">
              <v-stepper-header>
                <v-stepper-step
                  editable
                  :color="activeCompetitionStatus === 'ACTIVE' ? 'primary' : 'success'"
                  :edit-icon="activeCompetitionStatus === 'ACTIVE' ? '$edit' : '$complete'"
                  :complete="activeCompetitionStatus === 'FINAL' || activeCompetitionStatus === 'HALF_FINAL'"
                  step="1"
                  @click="getRaceData('ACTIVE')"
                >
                  <span :class="{'text-decoration-underline': stepper === 1}">
                    Стартовий протокол
                  </span>
                </v-stepper-step>

                <template v-if="!isDueling && !isRelay && !isCombatDeployment">
                <v-divider></v-divider>

                <v-stepper-step
                  :editable="availableHalfFinal"
                  :color="activeCompetitionStatus === 'HALF_FINAL' ? 'primary' : 'success'"
                  :edit-icon="activeCompetitionStatus === 'HALF_FINAL' ? '$edit' : '$complete'"
                  :complete="activeCompetitionStatus === 'FINAL'"
                  step="2"
                  @click="getRaceData('HALF_FINAL')"
                >
                  <span :class="{'text-decoration-underline': stepper === 2}">
                    Пів-фінал
                  </span>
                  <v-btn 
                    v-if="activeCompetitionStatus === 'ACTIVE'"
                    small
                    color="light-green white--text"
                    :disabled="!availableHalfFinal"
                    @click.stop.prevent="startHalfFinal"
                  >
                    Старт
                  </v-btn>
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step
                  step="3"
                  :editable="availableFinal"
                  :color="activeCompetitionStatus === 'FINAL' ? 'primary' : 'success'"
                  @click="getRaceData('FINAL')"
                >
                  <span :class="{'text-decoration-underline': stepper === 3}">
                    Фінал
                  </span>
                  <v-btn 
                    v-if="activeCompetitionStatus === 'HALF_FINAL'"
                    small
                    color="light-green white--text"
                    :disabled="!availableFinal"
                    @click.stop.prevent="startFinal"
                  >
                    Старт
                  </v-btn>
                </v-stepper-step>
                </template>
              </v-stepper-header>
            </v-stepper>
            <v-data-table
              :headers="participantHeaders"
              :items="participants"
              :loading="isLoading"
              disable-pagination
              disable-sort
              hide-default-footer
              :style="columnWidths"
              class="protocols-table"
            >
              <template #item="{ item, index }">
                <tr :class="{ 'tr-height-extended': isRelay || isCombatDeployment, 'tr-odd': isRelay || isCombatDeployment ? index % 2 : item[stepper == 1 ? 'trackNumber' : stepper == 2 ? 'halfFinalTrackNumber' : 'finalTrackNumber'] % 2 === 0 }"
                  :style="{'height': isRelay || isCombatDeployment ? 'auto' : 'initial'}"
                >
                  <template v-if="stepper == 1">
                    <template v-if="!isDueling">
                      <td>
                        {{ item.trackNumber }}
                      </td>
                      <td>
                        {{ isRelay || isCombatDeployment ? item.raceNumber : item.roadNumber }}
                      </td>
                    </template>
                  </template>
                  <template v-if="stepper == 2">
                    <td>
                      {{ item.halfFinalTrackNumber }}
                    </td>
                    <td>
                      {{ item.halfFinalRoadNumber }}
                    </td>
                  </template>
                  <template v-if="stepper == 3">
                    <td>
                      {{ item.finalTrackNumber }}
                    </td>
                    <td>
                      {{ item.finalRoadNumber }}
                    </td>
                  </template>
                  <template v-if="isRelay || isCombatDeployment">
                    <td style="display:grid;grid-column: 3/6;">
                      <div v-for="(subitem,subItemIndex) in item.teamParticipants" :key="subItemIndex" class="protocols-sub-item">
                        <div>{{ participantCategoryTranslations[subitem.participantCategory] }}</div>
                        <div>{{ subitem.birthday ? subitem.birthday.slice(0,4) : '' }}</div>
                        <div>{{ subitem.fullName }}</div>
                      </div>
                    </td>
                  </template>
                  <template v-else>
                    <td>
                      {{ item.participantNumber }}
                    </td>
                    <td>
                      {{ participantCategoryTranslations[item.participantCategory] }}
                    </td>
                    <td>
                      {{ item.participantBirthday ? item.participantBirthday.slice(0,4) : '' }}
                    </td>
                  </template>
                  <template v-if="!isRelay && !isCombatDeployment">
                    <td>
                      {{ item.participantFullName }}
                    </td>
                  </template>
                  <td>
                    {{ isRelay || isCombatDeployment ? item.teamName : item.participantTeamName }}
                  </td>
                  <template v-if="stepper == 1">
                    <template v-if="isDueling">
                      <td>{{ item.hundredMeterResult }}</td>
                      <td>{{ item.assaultLadderResult }}</td>
                      <td>{{ item.duelingResult }}</td>
                    </template>
                    <template v-else>
                      <template v-if="isRelay">
                        <td>
                          <v-text-field
                            :value="item.bestResultTeam"
                            :success="!!item.bestResultTeam"
                            :suffix="item.relayResultShifted ? plusValueOffset : null"
                            outlined
                            dense
                            hide-details
                            :class="['no-border', {'border-yellow': item.relayResultShifted}]"
                            @focus="bestResultTeam = item.bestResultTeam"
                            @input="validateValueResult($event, 'bestResultTeam')"
                            @change="saveResults(item, 'bestResultTeam', 'relayDisqualificationType')"
                          >
                            <template v-if="item.bestResultTeam == '0'" v-slot:append>
                              <v-menu style="top: -12px" offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                                </template>
                                <v-list>
                                  <v-list-item
                                    v-for="(menuItem, i) in zeroValueOptions"
                                    :key="i"
                                    @click="saveResults(item, 'bestResultTeam', 'relayDisqualificationType', menuItem.value)"
                                  >
                                    <v-list-item-title :class="{'red--text': item.relayDisqualificationType === menuItem.value}">
                                      {{ menuItem.text }}
                                    </v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </template>
                          </v-text-field>
                        </td>
                      </template>
                      <template v-else>
                        <td>
                          <v-text-field
                            :value="item.firstResult"
                            :success="!!item.firstResult"
                            outlined
                            dense
                            hide-details
                            :class="['no-border', {'border-yellow': item.firstResultShifted}]"
                            @focus="firstResult = item.firstResult"
                            @input="validateValueResult($event, 'firstResult')"
                            @change="saveResults(item, 'firstResult', 'firstDisqualificationType')"
                          >
                            <template v-if="item.firstResult == '0'" v-slot:append>
                              <v-menu style="top: -12px" offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                                </template>
                                <v-list>
                                  <v-list-item
                                    v-for="(menuItem, i) in zeroValueOptions"
                                    :key="i"
                                    @click="saveResults(item, 'firstResult', 'firstDisqualificationType', menuItem.value)"
                                  >
                                    <v-list-item-title :class="{'red--text': item.firstDisqualificationType === menuItem.value}">
                                      {{ menuItem.text }}
                                    </v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </template>
                          </v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :value="item.secondResult"
                            :success="!!item.secondResult"
                            outlined
                            dense
                            hide-details
                            :class="['no-border protocols-value-input', {'border-yellow': item.secondResultShifted}]"
                            @focus="secondResult = item.secondResult"
                            @input="validateValueResult($event, 'secondResult')"
                            @change="saveResults(item, 'secondResult', 'secondDisqualificationType')"
                          >
                            <template v-if="item.secondResult == '0'" v-slot:append>
                              <v-menu style="top: -12px" offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                                </template>
                                <v-list>
                                  <v-list-item
                                    v-for="(menuItem, i) in zeroValueOptions"
                                    :key="i"
                                    @click="saveResults(item, 'secondResult', 'secondDisqualificationType', menuItem.value)"
                                  >
                                    <v-list-item-title :class="{'red--text': item.secondDisqualificationType === menuItem.value}">
                                      {{ menuItem.text }}
                                    </v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </template>
                          </v-text-field>
                        </td>
                        <td>
                          {{ item.bestResult }}
                        </td>
                      </template>
                    </template>
                  </template>
                  <template v-if="stepper == 2">
                    <td>
                      <v-text-field
                        :value="item.halfFinalResult"
                        :success="!!item.halfFinalResult"
                        outlined
                        dense
                        hide-details
                        :class="['no-border protocols-value-input', {'border-yellow': item.halfFinalResultShifted}]"
                        :suffix="item.halfFinalResultShifted ? plusValueOffset : null"
                        @focus="halfFinalResult = item.halfFinalResult"
                        @input="validateValueResult($event, 'halfFinalResult')"
                        @change="saveResults(item, 'halfFinalResult', 'halfFinalDisqualificationType')"
                      >
                        <template v-if="item.halfFinalResult == '0'" v-slot:append>
                          <v-menu style="top: -12px" offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                            </template>
                            <v-list>
                              <v-list-item
                                v-for="(menuItem, i) in zeroValueOptions"
                                :key="i"
                                @click="saveResults(item, 'halfFinalResult', 'halfFinalDisqualificationType', menuItem.value)"
                              >
                                <v-list-item-title :class="{'red--text': item.halfFinalDisqualificationType === menuItem.value}">
                                  {{ menuItem.text }}
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </template>
                      </v-text-field>
                    </td>
                  </template>
                  <template v-if="stepper == 3">
                    <td>
                      <v-text-field
                        v-if="activeCompetitionStatus === 'FINAL'"
                        :value="item.finalResult"
                        :success="!!item.finalResult"
                        outlined
                        dense
                        hide-details
                        :class="['no-border protocols-value-input', {'border-yellow': item.finalResultShifted}]"
                        :suffix="item.finalResultShifted ? plusValueOffset : null"
                        @focus="finalResult = item.finalResult"
                        @input="validateValueResult($event, 'finalResult')"
                        @change="saveResults(item, 'finalResult', 'finalDisqualificationType')"
                      >
                        <template v-if="item.finalResult == '0'" v-slot:append>
                          <v-menu style="top: -12px" offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                            </template>
                            <v-list>
                              <v-list-item
                                v-for="(menuItem, i) in zeroValueOptions"
                                :key="i"
                                @click="saveResults(item, 'finalResult', 'finalDisqualificationType', menuItem.value)"
                              >
                                <v-list-item-title :class="{'red--text': item.finalDisqualificationType === menuItem.value}">
                                  {{ menuItem.text }}
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </template>
                      </v-text-field>
                      <template v-else>
                        {{ item.finalResult }}
                      </template>
                    </td>
                  </template>
                </tr>
              </template>

              <template #no-data>
                No data
              </template>
              <template #footer>
              </template>
              </v-data-table>
            </v-sheet>
          </v-col>
          <v-col cols="5">
            <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-2 white--text" style="position: sticky; top: 5px;">
              <template v-if="!isRelay && !isCombatDeployment">
                <h4 class="text-center">Кращі результати</h4>
                <v-data-table
                  :headers="bestResultsHeaders"
                  :items="bestParticipants"
                  disable-pagination
                  disable-sort
                  hide-default-footer
                >
                  <template #item="{ item, index }">
                    <tr>
                      <td>
                        {{ index + 1 }}
                      </td>
                      <td>
                        {{ item.participantFullName }}
                        <v-icon v-if="item.personal" color="red">mdi-account-multiple</v-icon>
                      </td>
                      <td>
                        {{ item.participantTeamName }}
                      </td>
                      <td>
                        {{ item.bestResult }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </template>
              <v-row class="mt-1">
                <v-col cols="6">
                  <h4 class="text-center text-no-wrap">Командна першість по виду
                     <v-icon dark @click="fetchteamResultsByType">mdi-refresh</v-icon>
                  </h4>
                  <v-data-table
                    :headers="teamResultsByTypeHeaders"
                    :items="teamResultsByType"
                    disable-pagination
                    disable-sort
                    hide-default-footer
                  >
                    <template #item="{ item, index }">
                      <tr>
                        <td>
                          {{ index + 1}}
                        </td>
                        <td>
                          {{ item.teamName }}
                        </td>
                        <td>
                          {{ item.result }}
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="6">
                  <h4 class="text-center text-no-wrap">Загальнокомандна першість
                     <v-icon dark @click="fetchteamResultsOverall">mdi-refresh</v-icon>
                  </h4>
                  <v-data-table
                    :headers="teamResultsOverallHeaders"
                    :items="teamResultsOverall"
                    disable-pagination
                    disable-sort
                    hide-default-footer
                  >
                    <template #item="{ item, index }">
                      <tr>
                        <td>
                          {{ index + 1}}
                        </td>
                        <td>
                          {{ item.teamName }}
                        </td>
                        <td>
                          {{ item.result }}
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </template>
      </v-row>
      </template>
      <v-alert
        v-model="showAlert"
        ref="alertDialog"
        :type="alertType"
        dismissible
        class="alert-message"
      >
        {{ alertMessage }}
      </v-alert>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      competitionReferences: [], // has to be fetched so we know what SPORT_TYPE we're actually dealing with (id is taken from route)
      isPageLoading: false,
      isLoading: false,
      participants: [],
      bestParticipants: [],
      teamResultsOverall: [],
      teamResultsByType: [],
      bestResultsHeaders: [
        { text: '', value: 'index', width: '10%' },
        { text: 'Спортсмен', value: 'participantFullName', width: '35%' },
        { text: 'Команда', value: 'participantTeamName', width: '35%' },
        { text: 'Час, сек', value: 'bestResult', width: '20%' },
      ],
      teamResultsByTypeHeaders: [
        { text: '', value: 'index', width: '10%' },
        { text: 'Команда', value: 'teamName', width: '45%' },
        { text: 'Час с', value: 'result', width: '45%' },
      ],
      teamResultsOverallHeaders: [
        { text: '', value: 'index', width: '10%' },
        { text: 'Команда', value: 'teamName', width: '45%' },
        { text: 'Сума', value: 'result', width: '45%' },
      ],
      availableHalfFinal: false,
      availableFinal: false,
      stepper: 1,
      
      alertType: 'error',
      showAlert: false,
      alertMessage: '',
      isPlusEditTriggered: false,

      firstResult: 0,
      secondResult: 0,
      halfFinalResult: 0,
      finalResult: 0,

      firstResultShifted: false,
      secondResultShifted: false,
      halfFinalResultShifted: false,
      finalResultShifted: false,
      relayResultShifted: false
    }
  },
  computed: {
    competitionId() {
      return this.$route.params.id;
    },
    competitionType() {
      return this.$route.params.type;
    },
    activeCompetitionType() {
      const competitionType = this.competitionType;
      return this.competitionReferences.find(({reference}) => reference === competitionType);
    },
    activeCompetitionStatus() {
      return this.activeCompetitionType && this.activeCompetitionType.status;
    },
    competitionTranslations() {
      return {
        ASSAULT_LADDER: 'Штурмова драбина', 
        HUNDRED_METER: '100 метрова смуга',
        DUELING: 'Двоборство',
        RETRACTABLE_LADDER: 'Висувна драбина',
        RELAY: 'Пожежна естафета',
        COMBAT_DEPLOYMENT: 'Бойове розгортання'
      }
    },
    participantCategoryTranslations() {
      return {
        CMS: 'КМС', 
        MS: 'МС',
        IMS: 'МСМК',
        HMS: 'ЗМС',
        I: 'I',
        II: 'II',
        III: 'III',
        I_TEEN: 'I-ю',
        II_TEEN: 'II-ю',
        III_TEEN: 'III-ю',
      }
    },
    // headers do not support custom width (even though the should according to the API) - so we use manual overrides
    columnWidths() {
      const widths = [];
      this.participantHeaders.forEach((header) => widths.push(header.width));
      return `grid-template-columns: ${ widths.length ? widths.join(' ') : 'inherit'}`
    },
    isDueling() {
      return this.activeCompetitionType.sportType === 'DUELING'
    },
    isRelay() {
      return this.activeCompetitionType.sportType === 'RELAY'
    },
    isCombatDeployment() {
      return this.activeCompetitionType.sportType === 'COMBAT_DEPLOYMENT';
    },
    isDuelingReadyfToBeStarted() {
      const relatedCompetitions = this.competitionReferences.filter(({ sportType }) => ['ASSAULT_LADDER', 'HUNDRED_METER'].includes(sportType))
      console.warn('HERE',relatedCompetitions)
      return this.isDueling && relatedCompetitions.length && relatedCompetitions.every(({status}) => status === 'FINAL')
    },
    participantHeaders() {
      const status = this.stepper;
      const headers = [];
      const [isRelay, isDueling, isCombatDeployment] = [this.isRelay, this.isDueling, this.isCombatDeployment];
      if (status == 1) {
        if (isRelay || isCombatDeployment) {
          headers.push(
            { text: 'Забіг', value: 'raceNumber', width: '60px' },
            { text: 'Доріж.', value: 'trackNumber', width: '60px' },
          )
        } else if (!isDueling) {
          headers.push(
            { text: 'Забіг', value: 'roadNumber', width: '60px' },
            { text: 'Доріж.', value: 'trackNumber', width: '60px' },
          )
        }
      }
      if (status == 2) {
        headers.push(
          { text: 'Забіг', value: 'halfFinalRoadNumber', width: '55px' },
          { text: 'Доріж.', value: 'halfFinalTrackNumber', width: '55px' },
        )
      }
      if (status == 3) {
        headers.push(
          { text: 'Забіг', value: 'finalRoadNumber', width: '55px' },
          { text: 'Доріж.', value: 'finalTrackNumber', width: '55px' },
        )
      }

      if (isRelay || isCombatDeployment) {
        headers.push(
          { text: 'Звання/розряд', value: 'participantCategory', width: '60px'  },
          { text: 'Рік народж.', value: 'participantBirthday', width: '60px' }
        );
      } else {
        headers.push(
          { text: '№ учас.', value: 'participantNumber', width: '60px' },
          { text: 'Звання/розряд', value: 'participantCategory', width: '60px'  },
          { text: 'Рік народж.', value: 'participantBirthday', width: '60px' },
        )
      }
      headers.push(
        { text: 'Імя та призвіще', value: 'participantFullName', width: '1fr' },
        { text: 'Команда', value: 'participantTeamName', width: '1fr' },
      )
      if (status == 1) {
        if (isDueling) {
          headers.push(
            { text: '100-м смуга', value: 'hundredMeterResult', width: '80px'  },
            { text: this.competitionTranslations.ASSAULT_LADDER, value: 'assaultLadderResult', width: '80px'  },
            { text: 'Сума', value: 'duelingResult', width: '80px'  }
          )
        } else if(isRelay) {
          headers.push(
            { text: 'Результати', value: 'bestResultTeam', width: '100px'  },
          )
        } else {
          headers.push(
            { text: 'Перша спроба', value: 'firstResult', width: '80px'  },
            { text: 'Друга спроба', value: 'secondResult', width: '80px' },
            { text: 'Кращий', value: 'bestResult', width: '80px'  }
          )
        }
      }
      if (status == 2) {
        headers.push(
          { text: 'Результат пів-фіналу', value: 'halfFinalResult', width: '1fr'  }
        )
      }
      if (status == 3) {
        headers.push(
          { text: 'Результат фіналу', value: 'finalResult', width: '1fr' }
        )
      }
      return headers;
    },
    plusValueOffset() {
      if (!this.activeCompetitionType) return '';
      const activeType = this.activeCompetitionType.sportType;
      if (['ASSAULT_LADDER', 'RETRACTABLE_LADDER'].includes(activeType)) return '0.15';
      return '0.24';
    },
    zeroValueOptions() {
      if (!this.activeCompetitionType) return [];
      const activeType = this.activeCompetitionType.sportType;
      let typeSpecializedOptions = [];
      if (activeType === 'HUNDRED_METER') {
        typeSpecializedOptions = [{
            text: 'Розгалуження',
            value: 'BRANCHING'
          },
          {
            text: 'Ствол на фініші',
            value: 'BARREL_FINISH_LINE'
          },
          {
            text: 'Не зєднані рукава між собою',
            value: 'NO_BRANCHING'
          }]
      } else if (activeType === 'ASSAULT_LADDER') {
        typeSpecializedOptions = [{
            text: 'Фінішний майданчик',
            value: 'FINISH_PLACE'
          }]
      } else if (activeType === 'RELAY') {
        typeSpecializedOptions = [{
            text: 'Фінішний майданчик',
            value: 'TRANSMISSION_ZONE'
          }, {
            text: 'Деко',
            value: 'DECO'
          },
          {
            text: 'Розгалуження',
            value: 'BRANCHING'
          },
          {
            text: 'Не зєднані рукава між собою',
            value: 'NO_BRANCHING'
          }]
      } else if (activeType === 'COMBAT_DEPLOYMENT') {
        typeSpecializedOptions = [{
            text: 'Обмежувальна лінія',
            value: 'LIMITING_LINE'
          },
          {
            text: 'Розрив рукава',
            value: 'SLEEFE_TEAR'
          },
          {
            text: 'Не зднана сітка',
            value: 'NOT_CONNECTED_GRID'
          }]
      }
      return [
        {
          text: 'Фальш старт',
          value: 'FALSE_START'
        },
        ...typeSpecializedOptions,
        {
          text: 'Інше',
          value: 'ANOTHER'
        },
      ];
    },
  },
  watch: {
    competitionType: {
      handler(v) {
        if (v) this.getCompetitionReferences();
      },
      immediate: true
    }
  },
  methods: {
    async startCompetition() {
      let activeCompetitionType = this.activeCompetitionType;
      if (!activeCompetitionType.reference) return Promise.reject('Competition doesnt exist');

      const foundIndex = this.competitionReferences.findIndex(({ reference }) => reference === activeCompetitionType.reference)
      return this.axios.post(`private/competition-types/${activeCompetitionType.reference}/start-competition-type`)
        .then(() => {
          if (foundIndex >= 0) {
            this.$set(this.competitionReferences, foundIndex, { ...activeCompetitionType, status: 'ACTIVE' });
            this.getRaceData();
          }
        })
        .catch((error) => this.showError(error))
    },
    startHalfFinal() {
      let activeCompetitionType = this.activeCompetitionType;
      if (!activeCompetitionType.reference) return Promise.reject('Competition doesnt exist');

      const foundIndex = this.competitionReferences.findIndex(({ reference }) => reference === activeCompetitionType.reference)
      return this.axios.post(`private/competition-types/${activeCompetitionType.reference}/start-half-final`)
        .then(({ data }) => {
          if (foundIndex >= 0) {
            this.$set(this.competitionReferences, foundIndex, { ...activeCompetitionType, status: 'HALF_FINAL' });
            this.participants = data;
            this.stepper = 2;
            Promise.all([this.getBestResults(), this.fetchteamResultsByType(), this.fetchteamResultsOverall()])
          }
        })
        .catch((error) => this.showError(error))
    },
    startFinal() {
      let activeCompetitionType = this.activeCompetitionType;
      if (!activeCompetitionType.reference) return Promise.reject('Competition doesnt exist');

      const foundIndex = this.competitionReferences.findIndex(({ reference }) => reference === activeCompetitionType.reference)
      return this.axios.post(`private/competition-types/${activeCompetitionType.reference}/start-final`)
        .then(({ data }) => {
          if (foundIndex >= 0) {
            this.$set(this.competitionReferences, foundIndex, { ...activeCompetitionType, status: 'FINAL' });
            this.participants = data;
            this.stepper = 3;
            Promise.all([this.getBestResults(), this.fetchteamResultsByType(), this.fetchteamResultsOverall()])
          }
        })
        .catch((error) => this.showError(error))
    },
    async getBestResults() {
      return this.axios.get(`private/competition-types/${this.competitionType}/best-race-results`)
        .then(({ data }) => {
          this.availableHalfFinal = data.availableHalfFinal;
          this.availableFinal = data.availableFinal;
          this.bestParticipants = data.bestResultList;
        })
    },
    async getCompetitionReferences() {
      this.isPageLoading = true;
      return this.axios.get(`private/competitions/${this.competitionId}/type`)
          .then(({ data }) => {
            this.competitionReferences = data;
            this.isPageLoading = false;
            if (this.activeCompetitionType && this.activeCompetitionStatus !== 'INACTIVE') this.getRaceData();
          })
          .catch(() => {
            this.isPageLoading = false;
          });
    },
    async getRaceData(status = this.activeCompetitionStatus) {
      this.isLoading = true;
      this.participants = [];
      let stepper = 0;
      let request = null;
      try {
        if (this.isDueling) {
          stepper = 1;
          request = await this.axios.get(`private/competition-types/${this.competitionType}/dueling-results`);
        } else if (this.isRelay || this.isCombatDeployment) {
          stepper = 1;
          request = await this.axios.get(`private/competition-types/${this.competitionType}/start-team-race-list?sort=bestResultTeam,ASC`);
        } else if (status === 'ACTIVE') {
          stepper = 1;
          request = await this.axios.get(`private/competition-types/${this.competitionType}/start-race-list`);
        } else if (status === 'HALF_FINAL') {
          stepper = 2;
          request = await this.axios.get(`private/competition-types/${this.competitionType}/half-final-race-results`);
        } else if (status === 'FINAL') {
          stepper = 3;
          request = await this.axios.get(`private/competition-types/${this.competitionType}/final-race-results`);
        }
        if (!request) return;
          this.isLoading = false;
          this.stepper = stepper;
          this.participants = request.data;
          if (request.data.length) {
            return Promise.all([this.getBestResults(), this.fetchteamResultsByType(), this.fetchteamResultsOverall()])
          }
      } catch(error) {
        this.isLoading = false;
      }
    },
    async fetchteamResultsByType () {
      return this.axios.post(`private/teams/competition-types/${this.competitionType}/generate-race-result${this.isRelay ? '&sort=bestResultTeam,ASC': ''}`)
        .then(({ data }) => {
          this.teamResultsByType = data;
        })
    },
    async fetchteamResultsOverall () {
      return this.axios.post(`private/teams/competitions/${this.competitionId}/generate-team-results`)
        .then(({ data }) => {
          this.teamResultsOverall = data;
        })
    },
    async saveResults(participant, key, disqualifiedKey = null, disqualifiedValue = null) {
      const [isRelay, isCombatDeployment] = [this.isRelay, this.isCombatDeployment];
      
      const raceReference = isRelay || isCombatDeployment ? participant.reference : participant.raceReference;
      if (!raceReference) return Promise.reject('Incorrect raceReference for saving');
       
      let result = key in this ? `${this[key]}`.trim().replaceAll(',','.') : '';
      // prevent empty values
      if (isNaN(result)) return;

      if (result === '0') {
        disqualifiedValue = disqualifiedValue ? disqualifiedValue : 'ANOTHER';
      } else {
        // prevent saving the same values
        if (Number(participant[key]) === Number(result)) return;
        // formatting dot
        if (!result.includes('.')) result = result + '.00';
        if (result.split('.')[1].length < 2) result = result + '0'; 
      }

      const foundIndex = this.participants
        .findIndex((item) => item[isRelay || isCombatDeployment ? 'reference' : 'participantReference'] === participant[isRelay || isCombatDeployment ? 'reference' : 'participantReference'])
      const shiftedKey = this.shiftedValueKey(isRelay ? 'relayResult' : key);

      let reqData = {
        [key]: result,
        [disqualifiedKey]: disqualifiedValue
      };
      if (shiftedKey) reqData[shiftedKey] = this[shiftedKey];
      if (!isRelay) reqData.participantReference = participant.participantReference;

      return this.axios.patch(`private/competition-types/${isRelay ? 'team-races' : 'races'}/${raceReference}/save-results`, reqData)
        .then(({data = {}}) => {
          // directly saving new properties (since most of other properties returned are null)
          this.$set(this.participants, foundIndex, {
            ...participant, 
            firstResult: data.firstResult,
            secondResult: data.secondResult,
            bestResult: data.bestResult,
            finalResult: data.finalResult,
            halfFinalResult: data.halfFinalResult,
            finalResult: data.finalResult,
            finalDisqualificationType: data.finalDisqualificationType,
            halfFinalDisqualificationType: data.halfFinalDisqualificationType,
            firstDisqualificationType: data.firstDisqualificationType,
            secondDisqualificationType: data.secondDisqualificationType,
            finalResultShifted: data.finalResultShifted,
            halfFinalResultShifted: data.halfFinalResultShifted,
            firstResultShifted: data.firstResultShifted,
            secondResultShifted: data.secondResultShifted,
            bestResultTeam: data.bestResultTeam,
            relayDisqualificationType: data.relayDisqualificationType,
            relayResultShifted: data.relayResultShifted
           });
           // refetch best results
           this.getBestResults();
        })
        .catch((error) => {
          this.$set(this.participants, foundIndex, participant);
          this.showError(error);
        })
    },
    showError(error) {
      this.alertMessage = error.response && error.response.data.description ? error.response.data.description : error.message;
      this.showAlert = true;
    },
    validateValueResult(value, key) {
      if (key in this) {
        const shiftedKey = this.shiftedValueKey(this.isRelay ? 'relayResult' : key);
        
        if (value.includes('+')) {
          this[key] = `${Number(value.replace('+', '')) + Number(this.plusValueOffset)}`;
          if (shiftedKey) this[shiftedKey] = true;
        } else {
          this[key] = value;
          if (shiftedKey) this[shiftedKey] = false;
        }
      }
    },
    shiftedValueKey(key) {
      const shiftedKey = key+'Shifted';
      if (shiftedKey in this) return shiftedKey;
    }
  }
}
</script>

<style lang="scss">
  table .v-input__slot {
    padding: 5px!important;
  }
  .protocols-value-input  {
    .v-input__append-outer{
      margin-left: 0!important;
      button {
        margin-right: 0!important;
      }
    }
    .v-input__append-inner {
      margin-top: 5px!important;
    }
  }
  .protocols-table {
    th, td {
      padding: 0 5px!important;
      display: flex;
      align-items: center;
    }
    .v-data-table__wrapper, table, thead, tbody, tr {
      grid-template-columns: inherit;
    }
    tr {
      display: grid;
    }
    tr.tr-odd {
      background: rgba(0,0,0,.07);
    }
    tr.tr-height-extended {
      padding: 0 5px;
      td {
        padding: 10px 0!important;
        align-items: baseline!important;
        height: inherit!important;
      }
    }
    tbody tr:hover {
      background-color: rgba(24,103,192, 0.20)!important;
    }
    .protocols-sub-item {
      display: grid;
      grid-template-columns: 60px 60px 1fr;
    }
  }
  .alert-message {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }
  .v-application div.border-yellow {
    color: darkorange!important;
  }
</style>
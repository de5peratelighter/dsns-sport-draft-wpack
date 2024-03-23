<template>
  <v-container class="protocols-view white--text" ma-0 pa-0 fluid>
    <div v-if="isPageLoading" class="text-center">
      <v-progress-circular :size="100" color="white" indeterminate></v-progress-circular>
    </div>
    <template v-else>
      <v-row v-if="activeCompetitionStatus === 'INACTIVE'" class="text-center justify-center mt-3">
        <div class="d-flex" style="flex-direction: column">
          <h4 class="text-center mb-4">{{ activeCompetitionType ? `Стартовий протокол:
            ${competitionTranslations[activeCompetitionType.sportType]}` : '' }}</h4>
          <template v-if="isDueling">
            <div>{{ competitionTranslations.ASSAULT_LADDER }} та {{ competitionTranslations.HUNDRED_METER }} наразі не
              завершені</div>
            <v-btn color="light-green white--text" :disabled="!isDuelingReadyfToBeStarted" @click="startCompetition">
              Розпочати змагання
            </v-btn>
          </template>
          <v-btn v-else color="light-green white--text" @click="startCompetition">
            Розпочати змагання
          </v-btn>
        </div>
      </v-row>
      <v-row v-else>

        <template v-if="activeCompetitionType">
          <v-col lg="7" md="12" class="pr-0">
            <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-2 white--text">
              <v-expansion-panels accordion>
                <v-expansion-panel>
                  <v-btn :color="isCompleted ? 'success' : 'grey'" dark small class="ml-2 mt-2"
                    @click="changeCompetitionStatus">
                    {{ isCompleted ? 'Проведено' : 'Триває' }}
                  </v-btn>
                  <v-expansion-panel-header style="padding: 0 15px;">
                    <h4 class="text-center">
                      {{ activeCompetitionType ? `${competitionTranslations[activeCompetitionType.sportType]}` : '' }}
                      <v-menu>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn color="primary" dark small v-bind="attrs" v-on="on" class="ml-2">
                            Друк
                            <v-icon dark right>
                              mdi-printer
                            </v-icon>
                          </v-btn>

                        </template>
                        <v-list>
                          <v-list-item @click="printDocProtocol()">
                            <v-list-item-title>
                              ПРОТОКОЛ ТЕСТ (ДОК-файл з бекенду)
                            </v-list-item-title>
                          </v-list-item>
                          <v-list-item v-for="(menuItem, i) in printOptions" :key="i" @click="printProtocol(menuItem)">
                            <v-list-item-title>
                              {{ menuItem.text }}
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </h4>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content style="pointer-events: none">
                    <div class="d-flex justify-space-between align-center">
                      <div class="mr-1">Легенда:</div>
                      <v-text-field :value="'Збережений результат'" success outlined dense hide-details
                        class="no-border mr-1" />
                      <v-text-field :value="'Результат з руч. хронометражем'" outlined dense hide-details
                        :suffix="getChronometrySuffix(activeCompetitionType.sportType)" class="border-yellow mr-1"
                        style="border: 1px solid darkorange" />
                      <v-text-field value="Дискваліфікований" outlined dense hide-details>

                        <template v-slot:append>
                          <v-menu style="top: -12px" offset-y>
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                            </template>
                            <v-list>
                              <v-list-item>
                                <v-list-item-title class="red--text" />
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </template>
                      </v-text-field>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-stepper v-model="stepper" non-linear style="position: sticky; top: 0; z-index: 1">
                <v-stepper-header>
                  <v-stepper-step editable :color="activeCompetitionStatus === 'ACTIVE' ? 'primary' : 'success'"
                    :edit-icon="activeCompetitionStatus === 'ACTIVE' ? '$edit' : '$complete'"
                    :complete="activeCompetitionStatus === 'FINAL' || activeCompetitionStatus === 'HALF_FINAL'" step="1"
                    @click="getRaceData('ACTIVE')">
                    <span :class="{ 'text-decoration-underline': stepper === 1 }">
                      Стартовий протокол
                      <v-icon left class="ml-1" color="red"
                        @click.stop.prevent="restoreCompetition('INACTIVE')">mdi-history</v-icon>
                    </span>
                  </v-stepper-step>

                  <template v-if="!isDueling && !isRelay && !isCombatDeployment">
                    <v-divider></v-divider>

                    <v-stepper-step :editable="availableHalfFinal"
                      :color="activeCompetitionStatus === 'HALF_FINAL' ? 'primary' : 'success'"
                      :edit-icon="activeCompetitionStatus === 'HALF_FINAL' ? '$edit' : '$complete'"
                      :complete="activeCompetitionStatus === 'FINAL'" step="2" @click="getRaceData('HALF_FINAL')">
                      <span :class="{ 'text-decoration-underline': stepper === 2 }">
                        Пів-фінал
                        <v-icon v-if="activeCompetitionStatus === 'HALF_FINAL'" left class="ml-1" color="red"
                          @click.stop.prevent="restoreCompetition('ACTIVE')">mdi-history</v-icon>
                      </span>
                      <v-btn v-if="activeCompetitionStatus === 'ACTIVE'" small color="light-green white--text"
                        :disabled="!availableHalfFinal" @click.stop.prevent="startHalfFinal">
                        Старт
                      </v-btn>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="3" :editable="availableFinal"
                      :color="activeCompetitionStatus === 'FINAL' ? 'primary' : 'success'"
                      @click="getRaceData('FINAL')">
                      <span :class="{ 'text-decoration-underline': stepper === 3 }">
                        Фінал
                        <v-icon v-if="activeCompetitionStatus === 'FINAL'" left class="ml-1" color="red"
                          @click.stop.prevent="restoreCompetition('HALF_FINAL')">mdi-history</v-icon>
                      </span>
                      <v-btn v-if="activeCompetitionStatus === 'HALF_FINAL'" small color="light-green white--text"
                        :disabled="!availableFinal" @click.stop.prevent="startFinal">
                        Старт
                      </v-btn>
                    </v-stepper-step>
                  </template>
                </v-stepper-header>
              </v-stepper>
              <v-data-table :headers="participantHeaders" :items="participants" :loading="isLoading" disable-pagination
                disable-sort hide-default-footer :style="columnWidths" class="protocols-table">

                <template #item="{ item, index }">
                  <tr
                    :class="{ 'tr-height-extended': isRelay || isCombatDeployment, 'tr-odd': isRelay || isCombatDeployment ? index % 2 : item[stepper == 1 ? 'trackNumber' : stepper == 2 ? 'halfFinalTrackNumber' : 'finalTrackNumber'] % 2 === 0 }"
                    :style="{ 'height': isRelay || isCombatDeployment ? 'auto' : 'initial' }">
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
                        <div v-for="(subitem, subItemIndex) in item.teamParticipants" :key="subItemIndex"
                          class="protocols-sub-item">
                          <div>{{ participantCategoryTranslations[subitem.participantCategory] }}</div>
                          <div>{{ subitem.birthday ? subitem.birthday.slice(0, 4) : '' }}</div>
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
                        {{ item.participantBirthday ? item.participantBirthday.slice(0, 4) : '' }}
                      </td>
                    </template>

                    <template v-if="!isRelay && !isCombatDeployment">
                      <template v-if="item.personal">
                        <v-tooltip left>
                          <template v-slot:activator="{ on, attrs }">
                            <td class="red--text" v-on="on" v-bind="attrs">
                              {{ item.participantFullName }}
                            </td>
                          </template>
                          Особистий результат
                        </v-tooltip>
                      </template>

                      <template v-else>
                        <td>
                          {{ item.participantFullName }}
                        </td>
                      </template>
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
                            <v-text-field :value="item.bestResultTeam" :success="!!item.bestResultTeam"
                              :suffix="item.relayResultShifted ? plusValueOffset : null"
                              :disabled="isUpdatingResults || completed || isCompleted"
                              :class="['no-border', { 'border-yellow': item.relayResultShifted }]" outlined dense
                              hide-details @focus="focusItemUpdate($event, item, 'bestResultTeam', index, 0)"
                              @input="validateValueResult($event, 'bestResultTeam')"
                              @change="saveResults(item, 'bestResultTeam', 'relayDisqualificationType')">
                              <template v-if="item.bestResultTeam == '0'" v-slot:append>
                                <v-menu style="top: -12px" offset-y>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                                  </template>
                                  <v-list>
                                    <v-list-item v-for="(menuItem, i) in zeroValueOptions" :key="i"
                                      @click="saveResults(item, 'bestResultTeam', 'relayDisqualificationType', menuItem.value)">
                                      <v-list-item-title
                                        :class="{ 'red--text': item.relayDisqualificationType === menuItem.value }">
                                        {{ menuItem.text }}
                                      </v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </template>
                            </v-text-field>
                          </td>
                        </template>

                        <template v-else-if="isCombatDeployment">
                          <td>
                            <v-text-field :value="item.firstTeamResult" :success="!!item.firstTeamResult"
                              :disabled="isUpdatingResults || completed || isCompleted"
                              :class="['no-border', { 'border-yellow': item.firstTeamResultShifted }]" outlined dense
                              hide-details @focus="focusItemUpdate($event, item, 'firstTeamResult', index, 0)"
                              @input="validateValueResult($event, 'firstTeamResult')"
                              @change="saveResults(item, 'firstTeamResult', 'firstDisqualificationType')">
                              <template v-if="item.firstTeamResult == '0'" v-slot:append>
                                <v-menu style="top: -12px" offset-y>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                                  </template>
                                  <v-list>
                                    <v-list-item v-for="(menuItem, i) in zeroValueOptions" :key="i"
                                      @click="saveResults(item, 'firstTeamResult', 'firstDisqualificationType', menuItem.value)">
                                      <v-list-item-title
                                        :class="{ 'red--text': item.firstDisqualificationType === menuItem.value }">
                                        {{ menuItem.text }}
                                      </v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </template>
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field :value="item.secondTeamResult" :success="!!item.secondTeamResult"
                              :disabled="isUpdatingResults || completed || isCompleted"
                              :class="['no-border', { 'border-yellow': item.secondTeamResultShifted }]" outlined dense
                              hide-details @focus="focusItemUpdate($event, item, 'secondTeamResult', index, 1)"
                              @input="validateValueResult($event, 'secondTeamResult')"
                              @change="saveResults(item, 'secondTeamResult', 'secondDisqualificationType')">

                              <template v-if="item.secondTeamResult == '0'" v-slot:append>
                                <v-menu style="top: -12px" offset-y>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                                  </template>
                                  <v-list>
                                    <v-list-item v-for="(menuItem, i) in zeroValueOptions" :key="i"
                                      @click="saveResults(item, 'secondTeamResult', 'secondDisqualificationType', menuItem.value)">
                                      <v-list-item-title
                                        :class="{ 'red--text': item.secondDisqualificationType === menuItem.value }">
                                        {{ menuItem.text }}
                                      </v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </template>
                            </v-text-field>
                          </td>
                          <td style="line-height: 40px;">
                            {{ item.bestResultTeam }}
                          </td>
                        </template>

                        <template v-else>
                          <td>
                            <v-text-field :value="item.firstResult" :success="!!item.firstResult"
                              :disabled="isUpdatingResults || completed || isCompleted"
                              :class="['no-border', { 'border-yellow': item.firstResultShifted }]" outlined dense
                              hide-details @focus="focusItemUpdate($event, item, 'firstResult', index, 0)"
                              @input="validateValueResult($event, 'firstResult')"
                              @change="saveResults(item, 'firstResult', 'firstDisqualificationType')">
                              <template v-if="item.firstResult == '0'" v-slot:append>
                                <v-menu style="top: -12px" offset-y>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                                  </template>
                                  <v-list>
                                    <v-list-item v-for="(menuItem, i) in zeroValueOptions" :key="i"
                                      @click="saveResults(item, 'firstResult', 'firstDisqualificationType', menuItem.value)">
                                      <v-list-item-title
                                        :class="{ 'red--text': item.firstDisqualificationType === menuItem.value }">
                                        {{ menuItem.text }}
                                      </v-list-item-title>
                                    </v-list-item>
                                  </v-list>
                                </v-menu>
                              </template>
                            </v-text-field>
                          </td>
                          <td>
                            <v-text-field :value="item.secondResult" :success="!!item.secondResult"
                              :disabled="isUpdatingResults || completed || isCompleted"
                              :class="['no-border protocols-value-input', { 'border-yellow': item.secondResultShifted }]"
                              outlined dense hide-details
                              @focus="focusItemUpdate($event, item, 'secondResult', index, 1)"
                              @input="validateValueResult($event, 'secondResult')"
                              @change="saveResults(item, 'secondResult', 'secondDisqualificationType')">

                              <template v-if="item.secondResult == '0'" v-slot:append>
                                <v-menu style="top: -12px" offset-y>
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                                  </template>
                                  <v-list>
                                    <v-list-item v-for="(menuItem, i) in zeroValueOptions" :key="i"
                                      @click="saveResults(item, 'secondResult', 'secondDisqualificationType', menuItem.value)">
                                      <v-list-item-title
                                        :class="{ 'red--text': item.secondDisqualificationType === menuItem.value }">
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
                        <v-text-field :value="item.halfFinalResult" :success="!!item.halfFinalResult"
                          :disabled="isUpdatingResults || completed || isCompleted"
                          :class="['no-border protocols-value-input', { 'border-yellow': item.halfFinalResultShifted }]"
                          :suffix="item.halfFinalResultShifted ? plusValueOffset : null" outlined dense hide-details
                          @focus="focusItemUpdate($event, item, 'halfFinalResult', index, 0)"
                          @input="validateValueResult($event, 'halfFinalResult')"
                          @change="saveResults(item, 'halfFinalResult', 'halfFinalDisqualificationType')">
                          <template v-if="item.halfFinalResult == '0'" v-slot:append>
                            <v-menu style="top: -12px" offset-y>
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                              </template>
                              <v-list>
                                <v-list-item v-for="(menuItem, i) in zeroValueOptions" :key="i"
                                  @click="saveResults(item, 'halfFinalResult', 'halfFinalDisqualificationType', menuItem.value)">
                                  <v-list-item-title
                                    :class="{ 'red--text': item.halfFinalDisqualificationType === menuItem.value }">
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
                        <v-text-field v-if="activeCompetitionStatus === 'FINAL'" :value="item.finalResult"
                          :disabled="isUpdatingResults || completed || isCompleted" :success="!!item.finalResult"
                          :class="['no-border protocols-value-input', { 'border-yellow': item.finalResultShifted }]"
                          :suffix="item.finalResultShifted ? plusValueOffset : null" outlined dense hide-details
                          @focus="focusItemUpdate($event, item, 'finalResult', index, 0)"
                          @input="validateValueResult($event, 'finalResult')"
                          @change="saveResults(item, 'finalResult', 'finalDisqualificationType')">
                          <template v-if="item.finalResult == '0'" v-slot:append>
                            <v-menu style="top: -12px" offset-y>
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon left v-bind="attrs" v-on="on">mdi-comment-alert</v-icon>
                              </template>
                              <v-list>
                                <v-list-item v-for="(menuItem, i) in zeroValueOptions" :key="i"
                                  @click="saveResults(item, 'finalResult', 'finalDisqualificationType', menuItem.value)">
                                  <v-list-item-title
                                    :class="{ 'red--text': item.finalDisqualificationType === menuItem.value }">
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

                <template #footer />
              </v-data-table>
            </v-sheet>
          </v-col>
          <v-col lg="5" md="12">
            <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-2 white--text" style="position: sticky; top: 5px;">

              <template v-if="!isRelay && !isCombatDeployment">
                <h4 class="text-center">Кращі результати</h4>
                <v-data-table :headers="bestResultsHeaders" :items="bestParticipants" disable-pagination disable-sort
                  hide-default-footer class="protocols-best-results">
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
                  <v-data-table :headers="isRelayOrCombat ? sortedTeamResultsByTypeHeaders : teamResultsByTypeHeaders"
                    :items="isRelayOrCombat ? sortedTeamResultsByType : teamResultsByType" disable-pagination
                    disable-sort hide-default-footer class="protocols-best-type">

                    <template #item="{ item, index }">
                      <tr>
                        <td>
                          {{ index + 1 }}
                        </td>
                        <td>
                          {{ item.teamName }}
                        </td>
                        <td>
                          {{ isRelayOrCombat ? item.bestResultTeam : item.result }}
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="6">
                  <h4 class="text-center text-no-wrap">Загальнокомандна першість
                    <v-icon dark @click="fetchteamResultsOverall">mdi-refresh</v-icon>
                  </h4>
                  <v-data-table :headers="teamResultsOverallHeaders" :items="teamResultsOverall" disable-pagination
                    disable-sort hide-default-footer class="protocols-best-team">

                    <template #item="{ item, index }">
                      <tr>
                        <td>
                          {{ index + 1 }}
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
    <v-dialog v-model="confirmRestoreDialog" max-width="600">
      <v-card ma-2>
        <v-card-title>
          {{ confirmRestoreDialogMessage }}
        </v-card-title>

        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="confirmRestoreDialog = false, confirmRestoreDialogType = null">
            Скасувати
          </v-btn>

          <v-btn color="red darken-1" text @click="undoCompetition">
            Підтвердити
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert v-model="showAlert" ref="alertDialog" :type="alertType" dismissible class="alert-message">
      {{ alertMessage }}
    </v-alert>
  </v-container>
</template>

<script>
import axios from 'axios';
import { Document, Packer, PageOrientation } from "docx";
import { saveAs } from 'file-saver';
import { DATA_TO_DOC_PAGE, DATA_TO_DOC_PAGES } from '../protocols/defaultUtils';
import { TABLE_START_PROTOCOL_RESULTS } from '../protocols/tables/START_PROTOCOL_RESULTS';
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
      sortedTeamResultsByType: [],
      bestResultsHeaders: [
        { text: '', value: 'index', width: '10%' },
        { text: 'Спортсмен', value: 'participantFullName', width: '35%' },
        { text: 'Команда', value: 'participantTeamName', width: '35%' },
        { text: 'Час, сек', value: 'bestResult', width: '20%' },
      ],
      sortedTeamResultsByTypeHeaders: [
        { text: '', value: 'index', width: '10%' },
        { text: 'Команда', value: 'teamName', width: '45%' },
        { text: 'Час с', value: 'bestResultTeam', width: '45%' },
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
      completed: false,

      alertType: 'error',
      showAlert: false,
      alertMessage: '',
      isPlusEditTriggered: false,

      firstResult: 0,
      secondResult: 0,
      halfFinalResult: 0,
      finalResult: 0,
      firstTeamResult: 0,
      secondTeamResult: 0,

      firstResultShifted: false,
      secondResultShifted: false,
      halfFinalResultShifted: false,
      finalResultShifted: false,
      relayResultShifted: false,
      secondTeamResultShifted: false,
      firstTeamResultShifted: false,
      confirmRestoreDialog: false,
      confirmRestoreDialogMessage: 'Повернутись на попередній етап змаганнь?',
      confirmRestoreDialogType: null,

      rowIndex: undefined,
      inputIndex: undefined,
      isUpdatingResults: false,
      isUpdatingTimeout: null,
    }
  },
  computed: {
    getButtonColor() {
      return this.completed ? 'success' : 'grey';
    },
    getButtonText() {
      return this.completed ? 'Проведено' : 'Триває';
    },
    isCompleted() {
      return this.activeCompetitionStatus === 'COMPLETED';
    },
    printOptions() {
      const options = [
      ];
      if (this.isDueling) {
        options.push(
          { text: 'Зведений протокол', value: 'DUELING_RESULT_CSV' },
          { text: 'Протокол особистих результатів', value: 'DUELING_RESULT_CSV' },
          { text: 'Протокол командних результатів', value: 'DUELING_RESULT_CSV' },
        )
      } else {
        if (this.isCombatDeployment || this.isRelay) {
          options.push(
            { text: 'Стартовий протокол', value: 'START_TEAM_CSV' },
            { text: 'Результати', value: 'RESULT_CSV' }
          )
        } else {
          options.push(
            { text: 'Зведений протокол', value: 'merged-team-competition-result-protocol' },
            { text: 'Стартовий протокол', value: 'start-protocol' },
            { text: 'Стартовий протокол (фінальні/півфінальні забіги)', value: 'start-protocol-finals' },
            { text: 'Протокол особистих результатів', value: 'result-protocol' },
            { text: 'Протокол командних результатів', value: 'team-competition-result-protocol' },
            // { text: 'Пів-фінальний протокол', value: 'START_HALF_FINAL_CSV' },
            // { text: 'Фінальний протокол', value: 'START_FINAL_CSV' },
            // { text: 'Результати Стартовий протокол', value: 'RESULT_CSV' },
            // { text: 'Результати Пів-фінальний протокол', value: 'RESULT_HALF_FINAL_CSV' },
            // { text: 'Результати Фінальний протокол', value: 'RESULT_FINAL_CSV' }
          )
        }
      }
      return options;
    },
    competitionId() {
      return this.$route.params.id;
    },
    competitionType() {
      return this.$route.params.type;
    },
    activeCompetitionType() {
      const competitionType = this.competitionType;
      return this.competitionReferences.find(({ reference }) => reference === competitionType);
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
      return `grid-template-columns: ${widths.length ? widths.join(' ') : 'inherit'}`
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
      return this.isDueling && relatedCompetitions.length && relatedCompetitions.every(({ status }) => status === 'FINAL')
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
          { text: 'Звання/розряд', value: 'participantCategory', width: '60px' },
          { text: 'Рік народж.', value: 'participantBirthday', width: '60px' }
        );
      } else {
        headers.push(
          { text: '№ учас.', value: 'participantNumber', width: '60px' },
          { text: 'Звання/розряд', value: 'participantCategory', width: '60px' },
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
            { text: '100-м смуга', value: 'hundredMeterResult', width: '80px' },
            { text: this.competitionTranslations.ASSAULT_LADDER, value: 'assaultLadderResult', width: '80px' },
            { text: 'Сума', value: 'duelingResult', width: '80px' }
          )
        } else if (isRelay) {
          headers.push(
            { text: 'Результати', value: 'bestResultTeam', width: '100px' },
          )
        } else {
          headers.push(
            { text: 'Перша спроба', value: 'firstResult', width: '80px' },
            { text: 'Друга спроба', value: 'secondResult', width: '80px' },
            { text: 'Кращий', value: 'bestResult', width: '80px' }
          )
        }
      }
      if (status == 2) {
        headers.push(
          { text: 'Результат пів-фіналу', value: 'halfFinalResult', width: '1fr' }
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
    isRelayOrCombat() {
      return this.isRelay || this.isCombatDeployment;
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
    },
    isUpdatingResults: {
      handler(value) {
        clearTimeout(this.isUpdatingTimeout);
        if (!value) {
          // focus next row input
          this.triggerNextInputFocus();
          // refetch best results with delay
          this.isUpdatingTimeout = setTimeout(() => {
            this.getBestResults();
          }, 3000)
        }
      }
    }
  },
  methods: {
    getJudgeTitleInUkrainian(title) {
      const coreJudgesTypes = {
        MAIN: 'Головний суддя змаганнь',
        MAIN_SECRETARY: 'Головний секретар змаганнь',
        INSPECTOR: 'Суддя-інспектор змаганнь',
        STARTER: 'Основний стартер',
        ASSISTANCE_STARTER: 'Помічник стартера'
      };

      return coreJudgesTypes[title] || title;
    },
    async changeCompetitionStatus() {
      try {
        // Визначення активного типу змагань
        const activeCompetitionType = this.activeCompetitionType;

        if (!activeCompetitionType) {
          throw new Error('Active competition type is not defined');
        }

        // Знаходимо об'єкт змагань, який потрібно оновити
        const competitionToUpdate = this.competitionReferences.find(({ reference }) => reference === activeCompetitionType.reference);

        if (!competitionToUpdate) {
          throw new Error('Competition to update not found');
        }

        // Визначаємо новий статус
        const newStatus = competitionToUpdate.status === 'COMPLETED' ? 'FINAL' : 'COMPLETED';

        // Оновлюємо статус змагань
        const response = await axios.patch(
          `private/competition-types/${competitionToUpdate.reference}`,
          { ...competitionToUpdate, status: newStatus }
        );

        // Оновлюємо дані в масиві competitionReferences
        const updatedCompetitionReferences = this.competitionReferences.map((competition) => {
          if (competition.reference === competitionToUpdate.reference) {
            return { ...competition, status: newStatus };
          }
          return competition;
        });

        this.competitionReferences = updatedCompetitionReferences;

        // Оновлюємо UI відповідно до нового статусу
        this.completed = newStatus === 'COMPLETED';
      } catch (error) {
        console.error('Error updating competition status:', error);
      }
    },
    async getCompetitionReferences() {
      this.isPageLoading = true;
      return this.axios.get(`private/competitions/${this.competitionId}/type`)
        .then(({ data }) => {
          console.log('Competition references:', data); // Додайте цей рядок
          this.competitionReferences = data;
          this.isPageLoading = false;
          if (this.activeCompetitionType && this.activeCompetitionStatus !== 'INACTIVE') {
            this.getRaceData();
          }
          this.completed = this.activeCompetitionStatus === 'COMPLETED';
          console.log('Completed status:', this.completed); // Додайте цей рядок
        })
        .catch(() => {
          this.isPageLoading = false;
        });
    },
    triggerNextInputFocus() {
      const rowIndex = this.rowIndex;
      if (!isNaN(rowIndex)) {
        this.$nextTick(() => {
          const row = document.querySelectorAll('.protocols-table .v-data-table__wrapper table tbody tr')[rowIndex + 1]
          if (row) {
            const input = row.querySelectorAll('input')[this.inputIndex];
            if (input) input.focus();
          }
        });
      }
    },
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
    getChronometrySuffix(sportType) {
      if (sportType === 'ASSAULT_LADDER') {
        return '0.15';
      } else {
        return '0.24';
      }
    },
    async getBestResults() {
      return this.axios.get(`private/competition-types/${this.competitionType}/best-race-results`)
        .then(({ data }) => {
          this.availableHalfFinal = data.availableHalfFinal;
          this.availableFinal = data.availableFinal;
          this.bestParticipants = data.bestResultList;
        })
      console.log();
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
      // ?sort=bestResultTeam,ASC
      try {
        if (this.isDueling) {
          stepper = 1;
          request = await this.axios.get(`private/competition-types/${this.competitionType}/dueling-results`);
        } else if (this.isRelay || this.isCombatDeployment) {
          stepper = 1;
          request = await this.axios.get(`private/competition-types/${this.competitionType}/start-team-race-list`);
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
      } catch (error) {
        this.isLoading = false;
      }
    },
    async fetchteamResultsByType() {
      if (this.isRelay || this.isCombatDeployment) {
        return this.axios.get(`private/competition-types/${this.competitionType}/start-team-race-list?sort=bestResultTeam,ASC`)
          .then(({ data }) => {
            this.sortedTeamResultsByType = data;
          })
      }
      return this.axios.post(`private/teams/competition-types/${this.competitionType}/generate-race-result`)
        .then(({ data }) => {
          this.teamResultsByType = data;
        })
    },
    async fetchteamResultsOverall() {
      return this.axios.post(`private/teams/competitions/${this.competitionId}/generate-team-results`)
        .then(({ data }) => {
          this.teamResultsOverall = data;
        })
    },
    async undoCompetition() {
      if (!this.confirmRestoreDialogType) return;
      return this.axios.post(`private/competition-types/${this.competitionType}/undo-competition-type?competitionTypeStatus=${this.confirmRestoreDialogType}`)
        .then((response) => {
          window.location.reload();
        });
    },
    async printDocProtocol() {
      return this.axios.get(`private/protocols/${this.competitionId}`)
        .then(({ data }) => {
          if (!data) return;
          try {
            const nextFile = new Document({
              sections: [
                {
                  properties: {
                    page: {
                      size: {
                        orientation: PageOrientation.LANDSCAPE,
                      }
                    }
                  },
                  children: DATA_TO_DOC_PAGES(data),
                },
              ],
            });
            if (nextFile) {
              Packer.toBlob(nextFile).then(blob => {
                const url = URL.createObjectURL(blob);
                const downloadLink = document.createElement("a");
                downloadLink.href = url;
                downloadLink.download = "DocumentWithPageBreak.docx";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
              })
            }
          } catch (err) {
            console.error('Parsing:', err)
            this.showError({ message: 'Protocol parsing failed' })
          }
        });
    },
    async printStartProtocol() {
      return this.axios.get(`private/protocols/competition-types/${this.competitionType}/start-protocol`)
        .then(({ data }) => {
          if (!data) return;
          try {
            const doc = new Document({
              sections: [
                {
                  properties: {
                    page: {
                      size: {
                        orientation: PageOrientation.LANDSCAPE,
                      }
                    }
                  },
                  children: TABLE_START_PROTOCOL_RESULTS(data),
                },
              ],
            });
            if (doc) {
              Packer.toBlob(doc).then(blob => {
                const url = URL.createObjectURL(blob);
                const downloadLink = document.createElement("a");
                downloadLink.href = url;
                downloadLink.download = "StartProtocol.docx";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
              })
            }
          } catch (err) {
            console.error('Parsing:', err)
            this.showError({ message: 'Protocol parsing failed' })
          }
        });
    },
    // async printProtocol(option) {
    //   return this.axios.get(`private/competition-types/${this.competitionType}/csv/download?csvType=${option.value}`)
    //     .then((res) => {
    //       const data = res.data;
    //       const blob = new Blob([data], { type: 'text/csv;charset=utf-8' });
    //       const fileName = `${this.competitionTranslations[this.activeCompetitionType.sportType]}`
    //       if (!blob) return;
    //       const a = document.createElement('a');
    //       a.download = fileName + ' - ' + option.text + '.csv';
    //       a.href = URL.createObjectURL(blob);
    //       document.body.prepend(a);
    //       a.style.position = 'absolute';
    //       a.style.left = '-9999px'
    //       a.click();
    //       a.remove()
    //     })
    //     .catch((error) => this.showError(error))
    // },
    async printProtocol(option) {
      try {
        const { data } = await this.axios.get(`private/protocols/competition-types/${this.competitionType}/${option.value}`);
        const doc = new Document({
          sections: [
            {
              properties: {
                page: {
                  size: {
                    orientation: PageOrientation.LANDSCAPE,
                  }
                }
              },
              children: DATA_TO_DOC_PAGE(data),
            },
          ],
        });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${option.text}.docx`);
      } catch (error) {
        console.error('Error generating protocol:', error);
        this.showError(error);
      }
    },
    async saveResults(participant, key, disqualifiedKey = null, disqualifiedValue = null) {
      const [isRelay, isCombatDeployment] = [this.isRelay, this.isCombatDeployment];

      const raceReference = isRelay || isCombatDeployment ? participant.reference : participant.raceReference;
      if (!raceReference) return Promise.reject('Incorrect raceReference for saving');

      let result = key in this ? `${this[key]}`.trim().replaceAll(',', '.') : '';
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
      if (isRelay || isCombatDeployment) {
        reqData.raceReference = raceReference;
      } else {
        reqData.participantReference = participant.participantReference;
      }

      this.isUpdatingResults = true;
      return this.axios.patch(`private/competition-types/${isRelay || isCombatDeployment ? 'team-races' : 'races'}/${raceReference}/save-results`, reqData)
        .then(({ data = {} }) => {
          this.isUpdatingResults = false;
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
            firstTeamResult: data.firstTeamResult,
            secondTeamResult: data.secondTeamResult,
            firstTeamResultShifted: data.firstTeamResultShifted,
            secondTeamResulShiftedt: data.secondTeamResultShifted,
            relayDisqualificationType: data.relayDisqualificationType,
            relayResultShifted: data.relayResultShifted
          });
        })
        .catch((error) => {
          this.isUpdatingResults = false;
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
    focusItemUpdate(event, key, item, rowIndex, inputIndex) {
      this.rowIndex = rowIndex;
      this.inputIndex = inputIndex;
      if (event) event.target.select();
      this[key] = item[key];
    },
    shiftedValueKey(key) {
      const shiftedKey = key + 'Shifted';
      if (shiftedKey in this) return shiftedKey;
    },
    restoreCompetition(step) {
      this.confirmRestoreDialog = true;
      if (step === 'HALF_FINAL') {
        this.confirmRestoreDialogMessage = 'Повернутись на етап пів-фіналу?';
        this.confirmRestoreDialogType = 'HALF_FINAL';
      } else if (step === 'ACTIVE') {
        this.confirmRestoreDialogMessage = 'Повернутись на етап старту змаганнь?';
        this.confirmRestoreDialogType = 'ACTIVE';
      } else if (step === 'INACTIVE') {
        this.confirmRestoreDialogMessage = 'Скасувати усі результати та повернутись на етап планування змагання?';
        this.confirmRestoreDialogType = 'INACTIVE';
      }
    }
  }
}
</script>

<style lang="scss">
table .v-input__slot {
  padding: 5px !important;
}

.protocols-print-icon {
  cursor: pointer;
  margin: 0 !important;
  height: 25px;
  margin-top: 25px;
}

.protocols-value-input {
  .v-input__append-outer {
    margin-left: 0 !important;

    button {
      margin-right: 0 !important;
    }
  }

  .v-input__append-inner {
    margin-top: 5px !important;
  }
}

.protocols-table {

  th,
  td {
    padding: 0 5px !important;
    display: flex;
    align-items: center;
  }

  .v-data-table__wrapper,
  table,
  thead,
  tbody,
  tr {
    grid-template-columns: inherit;
  }

  tr {
    display: grid;
  }

  tr.tr-odd {
    background: rgba(0, 0, 0, .07);
  }

  tr.tr-height-extended {
    td {
      padding: 10px 5px !important;
      align-items: baseline !important;
      height: inherit !important;
    }
  }

  tbody tr:hover {
    background-color: rgba(24, 103, 192, 0.20) !important;
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
  color: darkorange !important;
}

.protocols-best-results,
.protocols-best-type,
.protocols-best-team {
  thead {
    position: sticky;
    top: 0;
    background: #fff;
  }

  .v-data-table__wrapper {
    max-height: 520px;
    overflow: auto;
  }
}
</style>
<template>
    <v-container class="config-by-type white--text" ma-0 pa-0 fluid>
        <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3">
            <v-col
                class="d-flex sm-6"
                cols="12"
            >
                <v-select
                    dark
                    v-model="selectedTeam"
                    :items="teams"
                    :item-text="'teamName'"
                    :item-value="'teamReference'"
                    label="Команда"
                    hide-details
                />
            </v-col>
            <v-col cols="12">
                <v-data-table
                    v-if="selectedTeam"
                    :loading="areParticipantsLoading"
                    :headers="headers"
                    :items="participants"
                    disable-sort
                    disable-pagination
                    hide-default-footer
                    class="participants-table"
                >
                    <template #item="{ item, index }">
                        <tr>
                            <td>
                                {{ index + 1}}
                            </td>
                            <td>
                                <v-text-field
                                    :error="activeErrorId === `participantNumber-${index}`"
                                    :success="activeSuccessId === `participantNumber-${index}`"
                                    :value="item.participantNumber"
                                    outlined
                                    dense
                                    hide-details
                                    class="no-border"
                                    placeholder="Номер"
                                    @focus="participantNumber = item.participantNumber"
                                    @input="participantNumber = $event"
                                    @change="validateParticipantUpdate(item, 'participantNumber', `participantNumber-${index}`)"
                                />
                            </td>
                            <td>
                                <v-text-field
                                    :error="activeErrorId === `fullName-${index}`"
                                    :success="activeSuccessId === `fullName-${index}`"
                                    :value="item.fullName"
                                    outlined
                                    dense
                                    hide-details
                                    class="no-border"
                                    placeholder="Ім'я та призвіще"
                                    @focus="fullName = item.fullName"
                                    @input="fullName = $event"
                                    @change="validateParticipantUpdate(item, 'fullName', `fullName-${index}`)"
                                />
                            </td>
                            <td>
                                <v-tooltip left>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            :error="activeErrorId === `birthday-${index}`"
                                            :success="activeSuccessId === `birthday-${index}`"
                                            :value="item.birthday"
                                            outlined
                                            dense
                                            hide-details
                                            class="no-border"
                                            placeholder="dd.mm.yyy"
                                            @focus="birthday = item.birthday"
                                            @input="birthday = $event"
                                            @change="validateParticipantUpdate(item, 'birthday', `birthday-${index}`)"
                                            v-bind="attrs"
                                            v-on="on"
                                        />
                                    </template>
                                    <span>Формат дати: dd.mm.yyy </span>
                                </v-tooltip>
                            </td>
                            <!-- <td>
                                {{ item.age }}
                            </td> -->
                            <td>
                                <v-select
                                    :value="item.participantCategory"
                                    :items="participantCategoryItems"
                                    :item-text="'categoryName'"
                                    :item-value="'categoryId'"
                                    @change="updateParticipant(item, {participantCategory: $event})"
                                />
                            </td>
                            <td v-for="(sportType, referenceIndex) in sportTypeHeaders" :key="referenceIndex">
                                <div class="d-flex align-center">
                                <v-text-field
                                    v-if="sportType.value === 'RELAY' || sportType.value === 'COMBAT_DEPLOYMENT'"
                                    :error="activeErrorId === `sportTypePos-${index}-${referenceIndex}`"
                                    :success="activeSuccessId === `sportTypePos-${index}-${referenceIndex}`"
                                    :value="showParticipantPosition(item, sportType.value, 'startingPosition')"
                                    :rules="[isRelayValue]"
                                    outlined
                                    dense
                                    hide-details
                                    class="no-border"
                                    placeholder="Формат: d/d"
                                    @focus="sportTypePos = showParticipantPosition(item, sportType.value, 'startingPosition')"
                                    @input="sportTypePos = $event"
                                    @change="validateParticipantPositionUpdate(item, sportType.value, 'startingPosition', `sportTypePos-${index}-${referenceIndex}`)"
                                />
                                <v-text-field
                                    v-else
                                    :error="activeErrorId === `sportTypePos-${index}-${referenceIndex}`"
                                    :success="activeSuccessId === `sportTypePos-${index}-${referenceIndex}`"
                                    :value="showParticipantPosition(item, sportType.value, 'startingPosition')"
                                    outlined
                                    dense
                                    hide-details
                                    class="no-border"
                                    placeholder="Позиція"
                                    @focus="sportTypePos = showParticipantPosition(item, sportType.value, 'startingPosition')"
                                    @input="sportTypePos = $event"
                                    @change="validateParticipantPositionUpdate(item, sportType.value, 'startingPosition', `sportTypePos-${index}-${referenceIndex}`)"
                                />
                                
                                <!-- Особ чекбокс -->
                                <template v-if="!['RELAY','COMBAT_DEPLOYMENT'].includes(sportType.value)">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-simple-checkbox
                                                v-on="on" v-bind="attrs"
                                                color="primary"
                                                :value="showParticipantPosition(item, sportType.value, 'personal')"
                                                @input="validateParticipantPositionUpdate(item, sportType.value, 'personal')"
                                            />
                                            Ос:
                                        </template>
                                        Особовий результат
                                    </v-tooltip>
                                </template>
                            </div>
                            </td>
                        </tr>
                    </template>

                    <template #no-data>
                        No data
                    </template>
                    <template #footer>
                        <v-row class="ma-3 py-2 justify-center">
                            <v-edit-dialog
                                large
                                @save="addNewParticipant"
                            >
                                <v-btn dark color="primary" @click="fullname = ''">Додати</v-btn>
                                <template #input>
                                <div class="mt-4 text-h6">
                                    Ініціали учасника
                                </div>
                                <v-text-field
                                    v-model="fullName"
                                    :rules="[max100chars]"
                                    label="Ініціали"
                                    placeholder="Ініціали"
                                    single-line
                                ></v-text-field>
                                <div class="mt-4 text-h6">
                                    Номер учасника
                                </div>
                                <v-text-field
                                    v-model="participantNumber"
                                    label="Номер"
                                    placeholder="Номер"
                                    single-line
                                />
                                </template>
                            </v-edit-dialog>
                            <v-btn v-if="false" dark color="primary" class="ml-3" @click="pasteData">
                                Імпорт з буферу
                                <v-icon>mdi-content-paste</v-icon>
                            </v-btn>
                        </v-row>
                    </template>
                </v-data-table>
            </v-col>
        </v-sheet>
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
            teams: [],
            participants: [],
            competitionReferences: [],
            selectedTeam: null,
            fullName: '',
            participantNumber: '',
            isChanged: false,
            sportTypePos: '',
            personalValue: false,
            max100chars: v => v.length <= 100 || 'Input too long!',
            isNumeric: v => !isNaN(v),
            isRelayValue: v => {
                const reg = /\d\/\d/g;
                return !!v && !!v.match(reg) || 'Формат число/число';
            },
            participantCategoryItems: [
                {categoryName: 'КМС', categoryId: 'CMS'},
                {categoryName: 'МС', categoryId: 'MS'},
                {categoryName: 'МСМК', categoryId: 'IMS'},
                {categoryName: 'ЗМС', categoryId: 'HMS'},
                {categoryName: 'I', categoryId: 'I'},
                {categoryName: 'II', categoryId: 'II'},
                {categoryName: 'III', categoryId: 'III'},
                {categoryName: 'I-ю', categoryId: 'I_TEEN'},
                {categoryName: 'II-ю', categoryId: 'II_TEEN'},
                {categoryName: 'III-ю', categoryId: 'III_TEEN'},
            ],
            areParticipantsLoading: false,
            birthday: null,

            alertType: 'error',
            showAlert: false,
            alertMessage: '',

            activeSuccessId: null,
            activeErrorId: null,

            editPersonalResult: false,
            editDisqualified: false,
            editIssueReason: null
        }
    },
    computed: {
        competitionId() {
            return this.$route.params.id;
        },
        headers() {
            const defaultHeaders = [
                { text: '№ п/п', value: 'index', width: '5%' },
                { text: 'Нагрудний номер', value: 'participantNumber' , width: '5%'},
                { text: "Ім'я та призвіще", value: 'fullName', width: '15%' },
                { text: 'Дата народження', value: 'birthday', width: '10%' },
                // { text: 'Вікова категорія', value: 'age', width: '5%' },
                { text: 'Спортивна уласифікація', value: 'grade', width: '5%' },
            ];
            const sportTypeHeaders = this.sportTypeHeaders;
            return [...defaultHeaders, ...sportTypeHeaders]
        },
        sportTypeHeaders() {
            const mapper = {
                ASSAULT_LADDER: 'Штурмова драбина',
                HUNDRED_METER: '100 метрова смуга',
                DUELING: 'Двоборство',
                RETRACTABLE_LADDER: 'Висувна драбина',
                RELAY: 'Пожежна естафета',
                COMBAT_DEPLOYMENT: 'Бойове розгортання'
            }
            return this.competitionReferences.map((reference) => {
                return { text: mapper[reference.sportType], value: reference.sportType, width: '10%'}
            });
        }
    },
    mounted() {
        this.getCompetitionReferences();
        this.getTeams();
    },
    watch: {
        selectedTeam: {
            handler(ref) {
                if (!ref) return;
                this.fetchTeamParticipantsByRef(ref);
            }
        }
    },
    methods: {
        getTeams() {
            return this.axios.get(`private/competitions/${this.competitionId}/teams`)
                .then(({ data }) => {
                    this.teams = data;
                    if (data.length) {
                        this.selectedTeam = data[0].teamReference;
                    }
                });
        },
        getCompetitionReferences() {
            return this.axios.get(`private/competitions/${this.competitionId}/type`)
                .then(({ data }) => {
                    this.competitionReferences = data;
                });
        },
        fetchTeamParticipantsByRef(ref) {
            this.activeSuccessId = null;
            this.activeErrorId = null;
            this.areParticipantsLoading = true;
            return this.axios.get(`private/teams/${ref}/participant/competitions/${this.competitionId}`)
                .then(({ data = [] }) => {
                    this.participants = data;
                })
                .finally(() => {
                    this.areParticipantsLoading = false;
                })
        },
        pasteData() {
            navigator.clipboard
                .readText()
                .then((clipText) => {
                    // @todo parse excel/word format
                    console.warn('PASTED', clipText)
                });
        },
        addNewParticipant() {
            if (!this.fullName || !this.fullName.trim()) return;
            const reqData = {
                fullName: this.fullName.trim(),
                participantNumber: this.participantNumber
            };
            return this.axios.post(`private/participants/competition/${this.competitionId}/teams/${this.selectedTeam}`, reqData)
                .then(({ data }) => {
                    this.fullName = '';
                    this.participantNumber = '';
                    this.participants = [...this.participants, data];
                });
        },
        async validateParticipantUpdate(participant, key, inputTargetId) {
            const value = this[key];
            if (!value) return Promise.reject(`Empty ${key}`)
            const reqData = { [key]: value };
            return this.updateParticipant(participant, reqData, inputTargetId)
        },
        async updateParticipant(participant, reqData, inputTargetId = null) {
            this.activeErrorId = null;
            this.activeSuccessId = null;
            const participantIndex = this.participants.findIndex(({ participantReference }) => participantReference === participant.participantReference);
            return this.axios.patch(`private/participants/${participant.participantReference}/competitions/${this.competitionId}`, reqData)
                .then(({ data }) => {
                    // update state
                    this.$set(this.participants, participantIndex, {...participant, ...data});
                    this.activeSuccessId = inputTargetId;
                })
                .catch((error) => {
                    this.showError(error);
                    this.activeErrorId = inputTargetId;
                })
        },
        showParticipantPosition(participant, type, key) {
            const found = participant.participantStartPositionList.find(({sportType}) => sportType === type);
            if (found) return found[key];
        },
        openParticipantPosition(participant, type, key) {
            this.sportTypePos = this.showParticipantPosition(participant, type, key, '');
        },
        validateParticipantPositionUpdate(participant, sportType, key, inputTargetId) {
            // todo validate
            return this.updateParticipantPosition(participant, sportType, key, inputTargetId)
        },
        updateParticipantPosition(participant, sportType, key, inputTargetId) {
            let participantStartPositionList = participant.participantStartPositionList;
            let foundItem = participantStartPositionList.find((item) => item.sportType === sportType);
            if (foundItem) {
                let nextData = {...foundItem};
                if (key === 'startingPosition') {
                    nextData.startingPosition = this.sportTypePos.trim();
                } else {
                    nextData.personal = !nextData.personal;
                }
                participantStartPositionList = participantStartPositionList.map((list) => {
                    if (list.sportType === sportType) {
                        return nextData;
                    }
                    return list;
                });
            } else {
                let defaultData = { sportType, startingPosition: '',  personal: false }
                if (key === 'startingPosition') {
                    defaultData.startingPosition = this.sportTypePos.trim();
                } else {
                    defaultData.personal = !defaultData.personal;
                }
                participantStartPositionList = [...participantStartPositionList, defaultData];
            }
            const reqData = { participantStartPositionList };
            return this.updateParticipant(participant, reqData, inputTargetId)
        },
        showError(error) {
            this.alertMessage = error.response && error.response.data.description ? error.response.data.description : error.message;
            this.showAlert = true;
        },
        openOtherOptions(participant, sportType) {
            let participantStartPositionList = participant.participantStartPositionList;
            let foundItem = participantStartPositionList.find((item) => item.sportType === sportType);
            if (foundItem) {
                this.editPersonalResult = foundItem.personal;
                this.editDisqualified = foundItem.issue;
                this.editIssueReason = foundItem.description;

            } else {
                this.editPersonalResult = false;
                this.editDisqualified = false;
                this.editIssueReason = null;
            }
        }
    }
}
</script>
<style lang="scss">
  .alert-message {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }
  .participants-table table {
    td {
        padding: 0 10px;
    }
    tbody tr:nth-child(odd) {
      background: rgba(0,0,0,.07);
    }
    tbody tr:hover {
      background-color: rgba(24,103,192, 0.25)!important;
    }
  }
</style>
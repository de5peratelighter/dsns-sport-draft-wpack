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
                />
            </v-col>
            <v-col cols="12">
                <v-data-table
                    v-if="selectedTeam"
                    :headers="headers"
                    :items="participants"
                    disable-sort
                    disable-pagination
                    hide-default-footer
                >
                    <template #item="{ item, index }">
                        <tr>
                            <td>
                                {{ index }}
                            </td>
                            <td>
                                <v-edit-dialog
                                    large
                                    @open="participantNumber = item.participantNumber"
                                    @save="validateParticipantUpdate(item, 'participantNumber')"
                                >
                                    <div>{{ item.participantNumber }}</div>
                                    <template #input>
                                    <div class="mt-4 text-h6">
                                        Номер
                                    </div>
                                    <v-text-field
                                        :value="participantNumber"
                                        :rules="[isNumeric]"
                                        label="Номер"
                                        single-line
                                        counter
                                        autofocus
                                        @input="participantNumber = $event"
                                    />
                                    </template>
                                </v-edit-dialog>
                            </td>
                            <td>
                                <v-edit-dialog
                                    large
                                    @open="fullName = item.fullName"
                                    @save="validateParticipantUpdate(item, 'fullName')"
                                >
                                    <div>{{ item.fullName }}</div>
                                    <template #input>
                                    <div class="mt-4 text-h6">
                                        Ініціали
                                    </div>
                                    <v-text-field
                                        :value="fullName"
                                        :rules="[max100chars]"
                                        label="Призвіще та імя"
                                        single-line
                                        counter
                                        autofocus
                                        @input="fullName = $event"
                                    />
                                    </template>
                                </v-edit-dialog>
                            </td>
                            <td>
                                <v-edit-dialog
                                    large
                                    @open="birthday = item.birthday || null"
                                    @save="validateParticipantUpdate(item, 'birthday')"
                                >
                                    <div>{{ item.birthday }}</div>
                                    <template #input>
                                        <div class="mt-4 text-h6">
                                            Дата народження
                                        </div>   
                                        <v-date-picker
                                            v-model="birthday"
                                            active-picker="YEAR"
                                            :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                            min="1950-01-01"
                                        ></v-date-picker>
                                    </template>
                                </v-edit-dialog>
                            </td>
                            <td>
                                {{ item.age }}
                            </td>
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
                                <div class="d-flex"> 
                                <v-edit-dialog
                                    large
                                    @open="openParticipantPosition(item, sportType.value)"
                                    @save="validateParticipantPositionUpdate(item, sportType.value)"
                                >
                                    <div>Зал: <b>{{ showParticipantPosition(item, sportType.value) }}</b></div>
                                    <template #input>
                                    <div class="mt-4 text-h6">
                                        Зал: {{ `${sportType.text} (${item.fullName})` }} 
                                    </div>
                                    <v-text-field
                                        :value="sportTypePos"
                                        :rules="[isNumeric]"
                                        :label="`Залік ${sportType.text}`"
                                        single-line
                                        counter
                                        autofocus
                                        @input="sportTypePos = $event"
                                    />
                                    </template>
                                </v-edit-dialog>
                                <div class="pl-2">Особ:</div>
                                <v-simple-checkbox
                                    color="primary"
                                    :value="item.osob || false"
                                    @input="item.osob = item.osob"
                                />
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
                                <v-text-field
                                    v-model="fullName"
                                    :rules="[max100chars]"
                                    label="Ініціали учасник"
                                    placeholder="Ініціали учасник"
                                    single-line
                                ></v-text-field>
                                </template>
                            </v-edit-dialog>
                            <v-btn dark color="primary" class="ml-3" @click="pasteData">
                                Імпорт з буферу
                                <v-icon>mdi-content-paste</v-icon>
                            </v-btn>
                        </v-row>
                    </template>
                </v-data-table>
            </v-col>
        </v-sheet>
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
            max100chars: v => v.length <= 100 || 'Input too long!',
            isNumeric: v => !isNaN(v),
            participantCategoryItems: [
                {categoryName: 'CMS', categoryId: 'CMS'},
                {categoryName: 'MS', categoryId: 'MS'},
                {categoryName: 'IMS', categoryId: 'IMS'},
                {categoryName: 'HMS', categoryId: 'HMS'},
                {categoryName: 'I', categoryId: 'I'},
                {categoryName: 'II', categoryId: 'II'},
                {categoryName: 'III', categoryId: 'III'},
                {categoryName: 'I-ю', categoryId: 'I_TEEN'},
                {categoryName: 'II-ю', categoryId: 'II_TEEN'},
                {categoryName: 'III-ю', categoryId: 'III_TEEN'},
            ],
            birthday: null,
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
                { text: 'Вікова категорія', value: 'age', width: '5%' },
                { text: 'Спортивна уласифікація', value: 'grade', width: '5%' },
            ];
            const sportTypeHeaders = this.sportTypeHeaders;
            return [...defaultHeaders, ...sportTypeHeaders]
        },
        sportTypeHeaders() {
            const mapper = {
                ASSAULT_LADDER: 'Штурмова драбина',
                HUNDRED_METER: '100 метрова полоса',
                DUELING: 'Двоборство',
                RETRACTABLE_LADDER: 'Висувна драбина',
                RELAY: 'Пожежна естафета',
                COMBAT_DEPLOYMENT: 'Бойове розгортання'
            }
            return this.competitionReferences.map((reference) => {
                return { text: mapper[reference.sportType], value: reference.sportType,width: '10%'}
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
                    this.selectedTeam = data[0].teamReference;
                });
        },
        getCompetitionReferences() {
            return this.axios.get(`private/competitions/${this.competitionId}/type`)
                .then(({ data }) => {
                    this.competitionReferences = data;
                });
        },
        fetchTeamParticipantsByRef(ref) {
            return this.axios.get(`private/teams/${ref}/participant`)
                .then(({ data = [] }) => {
                    this.participants = data;
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
            };
            return this.axios.post(`private/participants/teams/${this.selectedTeam}`, reqData)
                .then(({ data }) => {
                    this.participants = [...this.participants, data];
                });
        },
        async validateParticipantUpdate(participant, key) {
            const value = this[key];
            if (!value) return Promise.reject(`Empty ${key}`)
            const reqData = { [key]: value };
            return this.updateParticipant(participant, reqData)
        },
        async updateParticipant(participant, reqData) {
            const participantIndex = this.participants.findIndex(({ participantReference }) => participantReference === participant.participantReference);
            return this.axios.patch(`private/participants/${participant.participantReference}/competitions/${this.competitionId}`, reqData)
                .then(({ data }) => {
                    // update state
                    this.$set(this.participants, participantIndex, {...participant, ...data});
                });
        },
        showParticipantPosition(participant, key) {
            const found = participant.participantStartPositionList.find(({sportType}) => sportType === key);
            if (found) return found.startingPosition;
            return 'відс';
        },
        openParticipantPosition(participant, key) {
            this.sportTypePos = this.showParticipantPosition(participant, key);
        },
        validateParticipantPositionUpdate(participant, key) {
            // todo validate
            return this.updateParticipantPosition(participant, key)
        },
        updateParticipantPosition(participant, key) {
            participant.participantStartPositionList = participant.participantStartPositionList.map((item) => {
                if (item.sportType !== key) return item;
                return {
                    ...item,
                    startingPosition: this.sportTypePos
                }
            })
            const reqData = { participantStartPositionList: participant.participantStartPositionList };
            return this.updateParticipant(participant, reqData)
        },
    }
}
</script>
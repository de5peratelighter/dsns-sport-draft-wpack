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
                                {{ item.group }}
                            </td>
                            <td>
                                {{ item.grade }}
                            </td>
                            <td>
                                <v-edit-dialog
                                    large
                                    @open="openParticipantPosition(item, 'HUNDRED_METER')"
                                    @save="validateParticipantPositionUpdate(item, 'HUNDRED_METER')"
                                >
                                    <div>{{ showParticipantPosition(item, 'HUNDRED_METER') }}</div>
                                    <template #input>
                                    <div class="mt-4 text-h6">
                                        100м полоса
                                    </div>
                                    <v-text-field
                                        :value="HUNDRED_METER"
                                        :rules="[max100chars]"
                                        label="Призвіще та імя"
                                        single-line
                                        counter
                                        autofocus
                                        @input="HUNDRED_METER = $event"
                                    />
                                    </template>
                                </v-edit-dialog>
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
            HUNDRED_METER: '',
            max100chars: v => v.length <= 100 || 'Input too long!',
            isNumeric: v => !isNaN(v),
            headers: [
                { text: '№', value: 'num', width: '5%' },
                //{ text: 'Категорія', value: 'participantCategory', width: '5%' },
                { text: 'Номер', value: 'participantNumber' , width: '5%'},
                { text: 'Ініціали', value: 'fullName', width: '20%' },
                { text: 'Дата народження', value: 'birthday', width: '5%' },
                { text: 'Група', value: 'group', width: '5%' },
                { text: 'Спортивна уласифікація', value: 'grade', width: '5%' },
                { text: '100м полоса', value: '', width: '5%' },
                { text: 'Штурмова драбина', value: '', width: '5%' },
                { text: 'Двоборство', value: '', width: '5%' },
                { text: 'Пожежна естафета', value: '', width: '5%' },
                { text: 'Бойове розгортання', value: '', width: '5%' },
                //{ text: 'Загальнокомандний', value: '', width: '5%' },
                //{ text: '', value: 'delete', width: '5%' },
            ],
            birthday: null,
        }
    },
    computed: {
        competitionId() {
            return this.$route.params.id;
        },
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
            return '';
        },
        openParticipantPosition(participant, key) {
            this[key] = this.showParticipantPosition(participant, key);
            console.warn('participant', participant, key, this[key])
        },
        validateParticipantPositionUpdate(participant, key) {
            // todo validate
            return this.updateParticipantPosition(participant, key)
        },
        updateParticipantPosition(participant, key) {
            const teamIndex = this.participants.findIndex(({ participantReference }) => participantReference === participant.participantReference);
            console.warn('update', this.competitionReferences, teamIndex, this[key])
            // todo assign sportType reference
            // return this.axios.patch(`private/participants/${participant.participantReference}/competition-type/${this.competitionId}`, reqData)
            //     .then(({ data }) => {
            //         // update state
            //         this.$set(this.participants, teamIndex, {...participant, ...data});
            //     });
        }
    }
}
</script>
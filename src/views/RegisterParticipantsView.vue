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
                    :item-value="'reference'"
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
                    <template #item="{ item }">
                        <tr>
                            <td>
                            {{ item.num }}
                            </td>
                            <td>
                            {{ item.category }}
                            </td>
                            <td>
                            {{ item.number }}
                            </td>
                            <td>
                            <v-edit-dialog
                                :return-value.sync="item.initials"
                                large
                                @save="updateItem(item)"
                            >
                                <div>{{ item.initials }}</div>
                                <template #input>
                                <div class="mt-4 text-h6">
                                    Ініціали
                                </div>
                                <v-text-field
                                    v-model="item.initials"
                                    :rules="[max100chars]"
                                    label="Призвіще та імя"
                                    single-line
                                    counter
                                    autofocus
                                />
                                </template>
                            </v-edit-dialog>
                            </td>
                            <td>
                                <v-edit-dialog
                                :return-value.sync="item.birthDate"
                                large
                                @save="updateItem(item)"
                            >
                                <div>{{ item.birthDate }}</div>
                                <template #input>
                                    <div class="mt-4 text-h6">
                                        Дата народження
                                    </div>   
                                    <v-date-picker
                                        v-model="item.birthDate"
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
                            <v-btn small icon @click="deleteItem(item)">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
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
                                @save="addItem"
                            >
                                <v-btn dark color="primary" @click="openAddItem">Додати</v-btn>
                                <template #input>
                                <v-text-field
                                    v-model="newInitials"
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
            selectedTeam: null,
            newInitials: '',
            isChanged: false,
            max100chars: v => v.length <= 100 || 'Input too long!',
            isNumeric: v => !isNaN(v),
            headers: [
                { text: '№', value: 'num', width: '5%' },
                { text: 'Категорія', value: 'category', width: '10%' },
                { text: 'Номер', value: 'number' , width: '10%'},
                { text: 'Ініціали', value: 'initials', width: '30%' },
                { text: 'Дата народження', value: 'birthDate', width: '10%' },
                { text: 'Група', value: 'group', width: '10%' },
                { text: 'Розряд', value: 'grade', width: '10%' },
                { text: '', value: 'delete', width: '5%' },
            ],
        }
    },
    mounted() {
        this.fetchTeams();
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
        fetchTeams() {
            return this.axios.get(`private/teams`)
                .then((response) => {
                    this.teams = response.data.teams || [{reference: 'test', teamName: 'test1'},];
                })
        },
        fetchTeamParticipantsByRef(ref) {
            return this.axios.get(`private/teams/${ref}`)
                .finally((response) => {
                    this.participants = [{
                        num: '1',
                        category: 'v',
                        number: '1',
                        initials: 'Bobby Koko',
                        group: 'B',
                        grade: 'A',
                        birthDate: ''
                    }];
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
        openAddItem() {
            this.newInitials = '';
        },
        updateItem() {
            this.isChanged = true;
        },
        addItem() {
            if (!this.newInitials || !this.newInitials.trim()) return;
            // todo call to save participant
            this.participants = [...this.participants, {
                num: '1',
                category: 'v',
                number: '1',
                initials: this.newInitials,
                group: 'B',
                grade: 'A',
                birthDate: ''
            }];
        },
        deleteItem(participant) {
            // todo add id first
        }
    }
}
</script>
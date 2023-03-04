<template>
    <v-container class="config-by-type white--text" ma-0 pa-0 fluid>
        <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3">
            <v-data-table
            :headers="headers"
            :items="teams"
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
                    {{ item.teamName  }}
                </td>
                <td>
                    <v-edit-dialog
                        large
                        @open="newItemNum = item.lotNumber"
                        @save="updateTeamNum(item)"
                    >
                        <div>{{ item.lotNumber }}</div>
                        <template #input>
                            <div class="mt-4 text-h6">
                                Номерлоту
                            </div>
                            <v-text-field
                                :value="newItemNum"
                                :rules="numericRules"
                                label="Номер лоту"
                                single-line
                                counter
                                autofocus
                                @input="newItemNum = $event"
                            ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </td>
                <td>
                    <v-simple-checkbox
                        color="primary"
                        :value="item.generalCompetition"
                        @input="toggleTeamBoolean(item, 'generalCompetition')"
                    />
                </td>
                <td>
                    <v-simple-checkbox
                        color="primary"
                        :value="item.outOfCompetition"
                        @input="toggleTeamBoolean(item, 'outOfCompetition')"
                    />
                </td>
                <td>
                    <v-simple-checkbox
                        color="primary"
                        :value="item.outOfReport"
                        @input="toggleTeamBoolean(item, 'outOfReport')"
                    />
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
                            v-model="newItemName"
                            :rules="[max25chars]"
                            label="Назва команди"
                            placeholder="Назва команди"
                            single-line
                        ></v-text-field>
                        <!-- 
                        <v-text-field
                            v-model="newItemNum"
                            label="По жеребу"
                            placeholder="По жеребу"
                            single-line
                        ></v-text-field>
                         -->
                        </template>
                    </v-edit-dialog>
                    <v-btn dark color="primary" class="ml-3" @click="pasteData">
                        Імпорт з буферу
                        <v-icon>mdi-content-paste</v-icon>
                    </v-btn>
                </v-row>
            </template>
          </v-data-table>
        </v-sheet>
    </v-container>
</template>

<script>
export default {
    data: function () {
        return {
            headers: [
                { text: '№ п/п', value: 'id', width: '5%' },
                { text: 'Назва команди', value: 'teamName', width: '30%' },
                { text: 'По жеребу', value: 'num' , width: '20%'},
                { text: 'Основне змагання', value: 'isMain', width: '10%' },
                { text: 'Поза конкурсно', value: 'isNonCompetetive', width: '10%' },
                { text: 'Не для протоколів', value: 'isIgnored', width: '10%' },
                { text: 'Дії', value: 'actions', width: '10%' },
            ],
            teams: [],
            max25chars: v => v.length <= 25 || 'Назва не більше 25 символів!',
            notEmpty: v => !!v || 'Значення пусте',
            isNumeric: v => !isNaN(v) || 'Лише числа',
            newItemNum: '',
            newItemName: ''
        }
    },
    computed: {
        teamId() {
            return this.$route.params.id;
        },
        numericRules() {
            return [this.notEmpty,this.isNumeric, this.isUniqueNumber];
        },
    },
    mounted() {
        this.getTeams();
    },
    methods: {
        isUniqueNumber(num) {
            console.warn(num, typeof num, this.teams.find(({ lotNumber }) => Number(lotNumber) !== Number(num)))
            return !this.teams.find(({ lotNumber }) => Number(lotNumber) === Number(num)) || 'Номер лоту має бути унікальним'
        },
        openAddItem() {
            this.newItemNum = '';
            this.newItemName = '';
        },
        addItem() {
            const data = {
                teamName: this.newItemName.trim()
            };
            return this.axios.post(`private/competition/${this.teamId}/team`, data)
                .then(({ data }) => {
                    this.teams = [...this.teams, data];
                });
        },
        async updateTeamNum(team) {
            const lotNumber = Number(this.newItemNum);
            const validationRules = this.numericRules;
            if (validationRules.some(rule => typeof rule(lotNumber) === 'string')) return;
            this.updateTeam(team, {lotNumber})
        },
        async toggleTeamBoolean(team, key) {
            const reqData = { [key]: !team[key] };
            return this.updateTeam(team, reqData)
        },
        async updateTeam(team, reqData) {
            const teamIndex = this.teams.findIndex(({ teamReference }) => teamReference === team.teamReference);
            return this.axios.patch(`private/teams/${team.teamReference}/competitions/${this.teamId}`, reqData)
                .then(({ data }) => {
                    // update state
                    this.$set(this.teams, teamIndex, {...team, ...data});
                })
                .catch(() => {
                    // revert state
                    this.$set(this.teams, teamIndex, team);
                })
        },
        async getTeams() {
            return this.axios.get(`private/competitions/${this.teamId}/teams`)
                .then(({ data }) => {
                    this.teams = data;
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
        deleteItem(item) {
            this.teams = this.teams.filter(({ id }) => id !== item.id);
        },
    }
}
</script>
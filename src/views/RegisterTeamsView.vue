<template>
    <v-container class="config-by-type white--text" ma-0 pa-0 fluid>
        <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3">
            <v-data-table
                :loading="areTeamsLoading"
                :headers="headers"
                :items="teams"
                disable-pagination
                hide-default-footer
                @update:sort-by="sortTeams"
                class="teams-table"
            >
            <template #item="{ item, index }">
              <tr>
                <td>
                  {{ index + 1 }}
                </td>
                <td>
                    <v-text-field
                        :error="activeErrorId === `name-${index}`"
                        :success="activeSuccessId === `name-${index}`"
                        :value="item.teamName"
                        outlined
                        dense
                        hide-details
                        class="no-border"
                        placeholder="Назва команди"
                        @focus="teamName = item.teamName"
                        @input="teamName = $event"
                        @change="updateTeamName(item, `name-${index}`)"
                    />
                </td>
                <td>
                    <v-text-field
                        :error="activeErrorId === `num-${index}`"
                        :success="activeSuccessId === `num-${index}`"
                        :value="item.lotNumber"
                        outlined
                        dense
                        hide-details
                        class="no-border"
                        placeholder="Номер лоту"
                        @focus="lotNumber = item.lotNumber"
                        @input="lotNumber = $event"
                        @change="updateTeamNum(item, `num-${index}`)"
                    />
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
                        <div class="mt-4 text-h6">
                            Назва команди
                        </div>
                        <v-text-field
                            v-model="teamName"
                            :rules="[max25chars]"
                            label="Назва команди"
                            placeholder="Назва команди"
                            single-line
                        />
                        <div class="mt-4 text-h6">
                            Номер по жеребу
                        </div>
                        <v-text-field
                            v-model="lotNumber"
                            label="По жеребу"
                            placeholder="По жеребу"
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
            headers: [
                { text: '№ п/п', value: 'id', width: '5%', sortable: false },
                { text: 'Назва команди', value: 'teamName', width: '30%', sortable: true },
                { text: 'По жеребу', value: 'num' , width: '20%', sortable: true },
                { text: 'Основне змагання', value: 'isMain', width: '10%', sortable: false },
                { text: 'Поза конкурсно', value: 'isNonCompetetive', width: '10%', sortable: false },
                //{ text: 'Не для протоколів', value: 'isIgnored', width: '10%' },
                { text: 'Дії', value: 'actions', width: '10%', sortable: false },
            ],
            areTeamsLoading: false,
            teams: [],
            max25chars: v => v.length <= 25 || 'Назва не більше 25 символів!',
            notEmpty: v => !!v || 'Значення пусте',
            isNumeric: v => !isNaN(v) || 'Лише числа',
            lotNumber: '',
            teamName: '',

            alertType: 'error',
            showAlert: false,
            alertMessage: '',

            activeSuccessId: null,
            activeErrorId: null
        }
    },
    computed: {
        competitionId() {
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
            return !this.teams.find(({ lotNumber }) => Number(lotNumber) === Number(num)) || 'Номер лоту має бути унікальним'
        },
        openAddItem() {
            this.lotNumber = '';
            this.teamName = '';
        },
        addItem() {
            const data = {
                teamName: this.teamName.trim(),
                lotNumber: Number(this.lotNumber)
            };
            return this.axios.post(`private/competition/${this.competitionId}/team`, data)
                .then(({ data }) => {
                    this.teamName = '';
                    this.lotNumber = '';
                    this.teams = [...this.teams, data];
                })
                .catch((error) => {
                    this.showError(error);
                })
        },
        async updateTeamNum(team, inputTargetId) {
            const lotNumber = Number(this.lotNumber);
            const validationRules = this.numericRules;
            if (validationRules.some(rule => typeof rule(lotNumber) === 'string')) {
                this.activeErrorId = inputTargetId;
                return;
            }
            this.updateTeam(team, {lotNumber}, false, inputTargetId)
        },
        async updateTeamName(team, inputTargetId) {
            if (!this.teamName.trim()) return;
            // todo maybe validate name?
            this.updateTeam(team, {teamName: this.teamName.trim()}, true, inputTargetId)
        },
        async toggleTeamBoolean(team, key) {
            const reqData = { [key]: !team[key] };
            return this.updateTeam(team, reqData)
        },
        async updateTeam(team, reqData, isNameUpdate = false, inputTargetId = null) {
            this.activeErrorId = null;
            this.activeSuccessId = null;
            const URL = isNameUpdate ? 
                `private/teams/${team.teamReference}`:
                `private/teams/${team.teamReference}/competitions/${this.competitionId}`;

            const teamIndex = this.teams.findIndex(({ teamReference }) => teamReference === team.teamReference);
            return this.axios.patch(URL, reqData)
                .then(({ data }) => {
                    // update state
                    this.$set(this.teams, teamIndex, {...team, ...data});
                    this.activeSuccessId = inputTargetId;
                })
                .catch((error) => {
                    // revert state
                    this.$set(this.teams, teamIndex, team);
                    this.activeErrorId = inputTargetId;
                    this.showError(error);
                })
        },
        async getTeams(sortType = 'LOT') {
            this.areTeamsLoading = true;
            return this.axios.get(`private/competitions/${this.competitionId}/teams`, {sortType})
                .then(({ data }) => {
                    this.teams = data;
                })
                .finally(() => {
                    this.areTeamsLoading = false;
                })
        },
        async sortTeams(sortType) {
            const types = { teamName: 'NAME', num: 'LOT'}
            if (!types[sortType]) return;
            return this.getTeams(types[sortType])
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
        showError(error) {
            this.alertMessage = error.response && error.response.data.description ? error.response.data.description : error.message;
            this.showAlert = true;
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
  .teams-table table {
    tbody tr:nth-child(odd) {
      background: rgba(0,0,0,.07);
    }
    tbody tr:hover {
      background-color: rgba(24,103,192, 0.25)!important;
    }
  }
</style>
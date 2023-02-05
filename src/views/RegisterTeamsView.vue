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
            <template #item="{ item }">
              <tr>
                <td>
                  {{ item.id }}
                </td>
                <td>
                  <v-edit-dialog
                    :return-value.sync="item.teamName"
                    large
                    @save="updateName(item)"
                  >
                    <div>{{ item.teamName }}</div>
                    <template #input>
                      <div class="mt-4 text-h6">
                        Назва команди
                      </div>
                      <v-text-field
                        v-model="item.teamName"
                        :rules="[max25chars]"
                        label="Час в с"
                        single-line
                        counter
                        autofocus
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </td>
                <td>
                    <v-edit-dialog
                        :return-value.sync="item.num"
                        large
                        @save="updateNum(item)"
                    >
                        <div>{{ item.num }}</div>
                        <template #input>
                        <div class="mt-4 text-h6">
                            Номер
                        </div>
                        <v-text-field
                            v-model="item.num"
                            :rules="[isNumeric]"
                            label="Час в с"
                            single-line
                            counter
                            autofocus
                        ></v-text-field>
                        </template>
                    </v-edit-dialog>
                </td>
                <td>
                    <v-checkbox
                        :value="item.isMain"
                    />
                </td>
                <td>
                    <v-checkbox
                        :value="item.isNonCompetetive"
                    />
                </td>
                <td>
                    <v-checkbox
                        :value="item.isIgnored"
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
                        <v-text-field
                            v-model="newItemNum"
                            label="По жеребу"
                            placeholder="По жеребу"
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
        </v-sheet>
    </v-container>
</template>

<script>
export default {
    data: function () {
        return {
            headers: [
                { text: '#', value: 'id', width: '5%' },
                { text: 'Назва команди', value: 'teamName', width: '30%' },
                { text: 'По жеребу', value: 'num' , width: '20%'},
                { text: 'Основне змагання', value: 'isMain', width: '10%' },
                { text: 'Поза конкурсно', value: 'isNonCompetetive', width: '10%' },
                { text: 'Не для протоколів', value: 'isIgnored', width: '10%' },
                { text: 'Дії', value: 'actions', width: '10%' },
            ],
            teams: [],
            max25chars: v => v.length <= 25 || 'Input too long!',
            isNumeric: v => !isNaN(v),
            newItemNum: '',
            newItemName: ''
        }
    },
    mounted() {
        this.getTeams();
    },
    methods: {
        openAddItem() {
            this.newItemNum = '';
            this.newItemName = '';
        },
        addItem() {
            const name = this.newItemName.trim();
            const num = this.newItemNum.trim();

            // TODO request to BE
            return Promise.resolve()
                .then(() => {
                    this.teams.push(
                        {
                            id: this.teams.length + 2,
                            teamName: name,
                            num: num,
                            isMain: true,
                            isNonCompetetive: false,
                            isIgnored: true,
                        }
                    )
                })
        },
        updateName() {
            this.isChanged = true;
        },
        updateNum() {
            this.isChanged = true;
        },
        deleteItem(item) {
            this.teams = this.teams.filter(({ id }) => id !== item.id);
        },
        async getTeams() {
            return this.axios.get(`private/teams/${this.$route.params.id}`)
                .finally(() => {
                    this.teams = [
                        {
                            id: '11',
                            teamName: 'RBG',
                            num: '1',
                            isMain: true,
                            isNonCompetetive: true,
                            isIgnored: true,
                        },
                        {
                            id: '22',
                            teamName: 'RBG',
                            num: '2',
                            isMain: true,
                            isNonCompetetive: false,
                            isIgnored: true,
                        },
                    ];
                })
        },
        pasteData() {
            navigator.clipboard
                .readText()
                .then((clipText) => {
                    // @todo parse excel/word format
                    console.warn('PASTED', clipText)
                });
        }
    }
}
</script>
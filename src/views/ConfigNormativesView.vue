<template>
  <v-container class="config-by-type white--text" ma-0 pa-0 fluid>
    <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3">
      <div class="white--text text-center">Розрядні нормативи</div>

      <v-row dark>
        <v-col
          class="d-flex sm-6"
          cols="12"
        >
          <v-select
            dark
            :value="competitionType"
            :items="competitionItems"
            @input="selectCompetitionType"
            label="Змагання"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3" 
          v-for="table in tableData"
          :key="table.key"
        >
          <v-data-table
            :headers="headers"
            :items="table.rows"
            disable-sort
            disable-pagination
            hide-default-footer
          >
            <template #top>
              <div class="text-center py-2"> {{ table.key }}</div>
            </template>
            <template #item="{ item }">
              <tr>
                <td>
                  {{ item[itemKey] }}
                </td>
                <td>
                  <v-edit-dialog
                    :return-value.sync="item[itemValue]"
                    large
                    @save="save(item)"
                    @cancel="cancel"
                  >
                    <div>{{ item[itemValue] }}</div>
                    <template #input>
                      <div class="mt-4 text-h6">
                        Змінити час
                      </div>
                      <v-text-field
                        v-model="item[itemValue]"
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
                  <v-btn small icon @click="deleteItem(table.key, item)">
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
                  @save="addItem(table.key)"
                  @cancel="cancel"
                >
                <v-btn dark color="primary" @click="openAddItem">Додати</v-btn>
                <template #input>
                  <v-text-field
                    v-model="newItemName"
                    :rules="[max25chars]"
                    label="Розряд"
                    placeholder="Розряд"
                    single-line
                  ></v-text-field>
                  <v-text-field
                    v-model="newItemTime"
                    label="Час"
                    placeholder="Час"
                    single-line
                  ></v-text-field>
                </template>
              </v-edit-dialog>
              </v-row>
            </template>

          </v-data-table>
        </v-col>
      </v-row>
      <v-row class="pa-3 justify-center">
        <v-btn
            :disabled="!isChanged"
            class="white--text"
            color="green darken-1"
            @click="editDialog = false"
          >
            Зберегти
          </v-btn>
          <v-btn
            text
            class="white--text"
            @click="editDialog = false"
          >
            Скасувати
          </v-btn>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      isChanged: false,
      itemKey: 'type',
      itemValue: 'time',
      competitionType: null,
      newItemName: '',
      newItemTime: '',
      competitionItems: [
        {
          value: 'one_hundred_meters', text: '100 метрова смуга'
        }, 
        {
          value: 'assault_ladder', text: 'Штурмова драбина'
        },
        {
          value: 'dueling', text: 'Двоборство'
        },
        {
          value: 'retractable_ladder', text: 'Висувна драбина'
        },
        {
          value: 'fire_relay', text: 'Пожежна естафета'
        },
        {
          value: 'deployment', text: 'Бойове розгортання'
        }
      ],
      headers: [
          { text: 'Розряд', value: 'type', width: '50%' },
          { text: 'Час', value: 'time' , width: '30%'},
          { text: '', value: 'action', width: '20%' },
      ],
      tableData: [],
      max25chars: v => v.length <= 25 || 'Input too long!',
    }
  },
  mounted() {
  },
  methods: {
    selectCompetitionType(competitionType) {
      this.competitionType = competitionType;
      if (competitionType) {
        this.openNormativesByType(competitionType);
      } else {
        this.tableData = false;
      }
    },
    async openNormativesByType(competitionType) {
      return this.axios.get(`private/normatives/${this.$route.params.id}/${competitionType}`)
        .finally(() => {
          this.isChanged = false;
          this.tableData = [
            {
              key: 'junes',
              rows: [
                { type: 'МС', time: '30' },
                { type: 'КМС', time: '4' },
              ]
            },
            {
              key: 'juniors',
              rows: [
                { type: 'МС', time: '30' },
                { type: 'КМС', time: '4' },
              ]
            },
            {
              key: 'young',
              rows: [
                { type: 'МС', time: '30' },
                { type: 'КМС', time: '4' },
              ]
            },
            {
              key: 'adults',
              rows: [
                { type: 'МС', time: '30' },
                { type: 'КМС', time: '4' },
              ]
            },
          ];
        });
    },
    openAddItem() {
      this.newItemName = '';
      this.newItemTime = '';
    },
    addItem(tableKey) {
      console.warn('tableKey', tableKey)
      let foundItem = this.tableData.find(({ key }) => key === tableKey);
      const nextItem = {
        type: this.newItemName,
        time: this.newItemTime,
      };
      foundItem.rows = [...foundItem.rows, nextItem];
      this.isChanged = true;
    },
    deleteItem(tableKey, item) { 
      let foundItem = this.tableData.find(({ key }) => key === tableKey);
      console.warn('item', item)
      foundItem.rows = foundItem.rows.filter(({type}) => type !== item.type);
      this.isChanged = true;
    },
    save () {
      this.isChanged = true;
    },
    cancel () {
    },
  }
}
</script>
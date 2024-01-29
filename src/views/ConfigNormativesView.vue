<template>
  <v-container class="config-by-type white--text" ma-0 pa-0 fluid>
    <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3">
      <div class="white--text text-center">Розрядні нормативи</div>

      <v-row dark>
        <v-col class="d-flex sm-6" cols="12">
          <v-select dark v-model="genderType" :items="genderItems" label="Стать" class=""></v-select>
          <v-select dark :value="competitionType" :items="competitionItems" @input="selectCompetitionType"
            label="Спортивні дисципліни"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3" v-for="table in tableData" :key="table.key">
          <v-data-table :headers="getColumnHeaders(table.ageType)" :items="table.rows" disable-sort disable-pagination
            hide-default-footer>
            <template #top>
              <div class="text-center py-2"> {{ table.key }}</div>
            </template>
            <template #item="{ item }">
              <tr>
                <td>
                  {{ item[itemKey] }}
                </td>
                <td>
                  <v-edit-dialog :return-value.sync="item[itemValue]" large @save="save(item)" @cancel="cancel">
                    <div>{{ item[itemValue] }}</div>
                    <template #input>
                      <div class="mt-4 text-h6">
                        Змінити час
                      </div>
                      <v-text-field v-model="item[itemValue]" :rules="[max25chars]" label="Час в с" single-line counter
                        autofocus></v-text-field>
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
                <v-edit-dialog large @save="addItem(table.key)" @cancel="cancel">
                  <v-btn dark color="primary">Додати</v-btn>
                  <template #input>
                    <v-text-field v-model="newItemName" :rules="[max25chars]" label="Розряд" placeholder="Розряд"
                      single-line></v-text-field>
                    <v-text-field v-model="newItemTime" label="Час" placeholder="Час" single-line></v-text-field>
                  </template>
                </v-edit-dialog>
              </v-row>
            </template>

          </v-data-table>
        </v-col>
      </v-row>
      <v-row class="pa-3 justify-center">
        <v-btn :disabled="!isChanged || isSaving" class="white--text" color="green darken-1" @click="saveNormatives">
          Зберегти
        </v-btn>
        <v-btn text class="white--text" @click="editDialog = false">
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
      isSaving: false,
      itemKey: 'type',
      itemValue: 'time',
      competitionType: null,
      ageTypeForNewItem: '',
      newItemName: '',
      newItemTime: '',
      competitionItems: [
        {
          value: 'HUNDRED_METER', text: '100 метрова смуга'
        },
        {
          value: 'ASSAULT_LADDER', text: 'Штурмова драбина'
        },
        {
          value: 'DUELING', text: 'Двоборство'
        },
        {
          value: 'RETRACTABLE_LADDER', text: 'Висувна драбина'
        },
        {
          value: 'FIRE_RELAY', text: 'Пожежна естафета'
        },
      ],
      headers: [
        { text: 'Розряд', value: 'type', width: '50%' },
        { text: 'Час', value: 'time', width: '30%' },
        { text: '', value: 'action', width: '20%' },
      ],
      genderType: null,
      genderItems: [
        { value: 'MALE', text: 'Чоловіки' },
        { value: 'FEMALE', text: 'Жінки' },
      ],
      columnHeaders: {
        JUNES_MALE: 'Чоловіки (JUNES_MALE)',
        YOUNGS_MALE: 'Чоловіки (YOUNGS_MALE)',
        ADULTS_MALE: 'Чоловіки (ADULTS_MALE)',
        JUNIORS_MALE: 'Чоловіки (JUNIORS_MALE)',
      },
      ageTypes: ["JUNES_MALE", "YOUNGS_MALE", "ADULTS_MALE",],
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
    getColumnHeaders(ageType) {
      const commonHeaders = [
        { text: 'Розряд', value: 'type', width: '50%' },
        { text: 'Час', value: 'time', width: '30%' },
        { text: '', value: 'action', width: '20%' },
      ];

      return [
        ...commonHeaders,
        { text: this.columnHeaders[ageType], align: 'center', value: 'ageTypeHeader' },
      ];
    },
    async openNormativesByType(sportType, genderType) {
      try {
        const response = await this.axios.get(`private/sport-regulations`, {
          params: {
            sportType: sportType,
            genderType: this.genderType,
          },
        });

        this.isChanged = false;
        this.tableData = [];

        const ageTypeData = {};
        this.ageTypes.forEach((ageType) => {
          ageTypeData[ageType] = [];
        });

        response.data.forEach((normative) => {
          ageTypeData[normative.ageType].push({
            id: normative.reference,
            type: normative.category,
            time: normative.time,
            category: normative.category,
            genderType: normative.genderType,
            ageType: normative.ageType,
          });
        });

        this.ageTypes.forEach((ageType) => {
          this.tableData.push({
            key: ageType,
            rows: ageTypeData[ageType],
          });
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async saveNormatives() {
      try {
        this.isSaving = true;

        if (!this.newItemName || !this.newItemTime) {
          console.error('Please fill in both Розряд and Час fields');
          return;
        }

        if (!this.competitionType) {
          console.error('Please select a Змагання');
          return;
        }

        const defaultGenderType = this.getDefaultGenderType(this.competitionType);


        await this.axios.post('private/sport-regulations', {
          sportType: this.competitionType,
          genderType: defaultGenderType,
          ageType: this.ageTypeForNewItem,
          time: this.newItemTime,
          category: this.newItemName,
        });

        this.openNormativesByType(this.competitionType);
        this.openAddItem();
        this.isChanged = true;
      } catch (error) {
        console.error('Error saving normatives:', error);
      } finally {
        this.isSaving = false;
      }
    },

    getDefaultGenderType(competitionType) {
      if (this.ageTypeForNewItem === 'JUNES_MALE' || this.ageTypeForNewItem === 'YOUNGS_MALE') {
        return 'MALE';
      } else if (this.ageTypeForNewItem === 'JUNES_FEMALE' || this.ageTypeForNewItem === 'YOUNGS_FEMALE') {
        return 'FEMALE';
      } else {
        return 'MALE';
      }
    },
    addItem(tableKey) {
      const ageTypeForNewItem = tableKey;
      let foundItem = this.tableData.find(({ key }) => key === tableKey);
      const nextItem = {
        type: this.newItemName,
        time: this.newItemTime,
      };
      foundItem.rows = [...foundItem.rows, nextItem];
      this.ageTypeForNewItem = ageTypeForNewItem;
      this.isChanged = true;
    },
    async deleteItem(tableKey, item) {
      try {
        const response = await this.axios.delete(`private/sport-regulations/${item.id}`);
        if (response.status === 204) {
          const foundItem = this.tableData.find(({ key }) => key === tableKey);
          foundItem.rows.splice(foundItem.rows.findIndex((row) => row.id === item.id), 1);
          this.isChanged = true;

          await this.openNormativesByType(this.competitionType);
        } else {
          console.error('Failed to delete item.');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
    cancel() {
    },
  }
}
</script>
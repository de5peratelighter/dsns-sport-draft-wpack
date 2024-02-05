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
          <v-data-table :headers="getColumnHeaders(table.key)" :items="table.rows" disable-sort disable-pagination
            hide-default-footer>
            <template #top>
              <div class="text-center py-2">{{ getAgeTypeText(table.key) }}</div>
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
          value: 'RELAY', text: 'Пожежна естафета'
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
      ageTypes: {
        MALE: [
          { value: 'JUNES_MALE', text: 'Юнаки молодшої групи' },
          { value: 'JUNIORS_MALE', text: 'Юнаки старшої групи' },
          { value: 'YOUNGS_MALE', text: 'Юніори' },
          { value: 'ADULTS_MALE', text: 'Чоловіки' },
        ],
        FEMALE: [
          { value: 'JUNES_FEMALE', text: 'Юначки молодшої групи' },
          { value: 'JUNIORS_FEMALE', text: 'Юначки старшої групи' },
          { value: 'YOUNGS_FEMALE', text: 'Юніорки' },
          { value: 'ADULTS_FEMALE', text: 'Жінки' },
        ],
      },
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
        const genderType = this.genderType === 'MALE' ? 'JUNES_MALE' : 'JUNES_FEMALE';
        this.openNormativesByType(competitionType, genderType);
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
      ];
    },

    getAgeTypeText(ageType) {
      const genderType = this.genderType === 'MALE' ? 'MALE' : 'FEMALE';
      const selectedAgeType = this.ageTypes[genderType].find(type => type.value === ageType);
      return selectedAgeType ? selectedAgeType.text : ageType;
    },

    getAgeTypesByGender() {
      return this.genderType === 'MALE' ? this.ageTypes.MALE : this.ageTypes.FEMALE;
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
        this.getAgeTypesByGender().forEach((ageType) => {
          ageTypeData[ageType.value] = [];
        });

        response.data.forEach((normative) => {
          // Check if ageType matches the current selection
          if (ageTypeData[normative.ageType]) {
            ageTypeData[normative.ageType].push({
              id: normative.reference,
              type: normative.category,
              time: normative.time,
              category: normative.category,
              genderType: genderType,
              ageType: normative.ageType,
            });
          }
        });

        Object.entries(ageTypeData).forEach(([ageType, rows]) => {
          this.tableData.push({
            key: ageType,
            rows: rows,
          });
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    async save(item) {
      try {
        const { id } = item;
        const categoryMap = {
          'I': 'I',
          'II': 'II',
          'III': 'III',
          'I_TEEN': 'I_TEEN',
          'II_TEEN': 'II_TEEN',
          'III_TEEN': 'III_TEEN',
          'CMS': 'CMS',
          'MS': 'MS',
          'IMS': 'IMS',
          'HMS': 'HMS',
          'NONE': 'NONE'
        };

        const response = await this.axios.patch(`private/sport-regulations/${id}`, {
          sportType: this.competitionType,
          time: item.time,
          category: categoryMap[item.category],
          genderType: this.genderType,
          ageType: item.ageType,
        });

        if (response.status === 200) {
          console.log('Item updated successfully');
          this.isChanged = false;
        } else {
          console.error('Failed to update item.');
        }
      } catch (error) {
        console.error('Error updating item:', error);
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
          genderType: this.genderType,
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

    getDefaultGenderType(competitionType, ageTypeForNewItem) {
      if (ageTypeForNewItem && ageTypeForNewItem.endsWith('_MALE')) {
        return 'MALE';
      } else if (ageTypeForNewItem && ageTypeForNewItem.endsWith('_FEMALE')) {
        return 'FEMALE';
      } else {
        return competitionType === 'FIRE_RELAY' ? 'FEMALE' : 'MALE';
      }
    },
    addItem(tableKey) {
      const ageTypeForNewItem = tableKey;
      let foundItem = this.tableData.find(({ key }) => key === tableKey);

      const nextItem = {
        type: this.newItemName,
        time: this.newItemTime,
        genderType: this.getDefaultGenderType(this.competitionType, ageTypeForNewItem),
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
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
                  <v-btn dark color="primary" @click="postNormative">Додати</v-btn>
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
        <v-btn :disabled="!isChanged" class="white--text" color="green darken-1" @click="editDialog = false">
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
      itemKey: 'type',
      itemValue: 'time',
      competitionType: null,
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
      ageTypes: ["JUNES_MALE", "JUNIORS_MALE", "YOUNGS_MALE", "ADULTS_MALE",],
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

        // Assuming the API returns an array of normatives for the selected sportType
        this.tableData = [];

        // Initialize empty arrays for each age type
        const ageTypeData = {};
        this.ageTypes.forEach((ageType) => {
          ageTypeData[ageType] = [];
        });

        // Categorize data based on ageType
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

        // Populate tableData with categorized data
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
    async postNormative() {
      try {
        if (!this.newItemName || !this.newItemTime) {
          // Add validation logic if necessary
          console.error('Please fill in both Розряд and Час fields');
          return;
        }

        // Assuming competitionType is required, adjust if necessary
        if (!this.competitionType) {
          console.error('Please select a Змагання');
          return;
        }

        // Assuming category is needed, adjust if necessary
        const category = 'III_TEEN';

        await this.postNormative(this.competitionType, this.newItemTime, category, this.genderType);
        this.openNormativesByType(this.competitionType);
        this.openAddItem(); // Clear the input fields after adding
      } catch (error) {
        console.error('Error posting normative:', error);
      }
    },

    async patchNormative(normativeId, newData) {
      try {
        const response = await this.axios.patch(`private/sport-regulations/${normativeId}`, newData);

        const updatedNormative = response.data;

        for (let i = 0; i < this.tableData.length; i++) {
          const foundItem = this.tableData[i].rows.find(({ id }) => id === updatedNormative.id);
          if (foundItem) {
            foundItem.type = updatedNormative.type;
            foundItem.time = updatedNormative.time;
            break;
          }
        }

        this.isChanged = true;
      } catch (error) {
        console.error('Error patching normative:', error);
      }
    },

    async save(item) {
      try {
        // Assuming `item.id` exists and represents the normative identifier
        await this.patchNormative(item.id, { type: item.type, time: item.time });
      } catch (error) {
        console.error('Error saving normative:', error);
      }
    },
    // openAddItem() {
    //   this.newItemName = '';
    //   this.newItemTime = '';
    // },
    // addItem(tableKey) {
    //   console.warn('tableKey', tableKey)
    //   let foundItem = this.tableData.find(({ key }) => key === tableKey);
    //   const nextItem = {
    //     type: this.newItemName,
    //     time: this.newItemTime,
    //   };
    //   foundItem.rows = [...foundItem.rows, nextItem];
    //   this.isChanged = true;
    // },
    // deleteItem(tableKey, item) {
    //   let foundItem = this.tableData.find(({ key }) => key === tableKey);
    //   console.warn('item', item)
    //   foundItem.rows = foundItem.rows.filter(({ type }) => type !== item.type);
    //   this.isChanged = true;
    // },
    // save() {
    //   this.isChanged = true;
    // },
    cancel() {
    },
  }
}
</script>
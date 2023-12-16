<template>
  <v-container class="config-by-type white--text" ma-0 pa-0 fluid>
    <v-sheet :color="'rgba(0, 0, 0, 0.35)'" class="pa-3">
    <div class="text-center" dark>
      <div class="white--text">Досягнення</div>
      <v-col
        class="d-flex sm-6"
        cols="12"
      >
        <v-select
          dark
          v-model="competitionType"
          :items="competitionItems"
          label="Змагання"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-list two-line pa-0 class="pa-0" v-if="competitionType">
        <v-list-item-group
          v-model="selectedIndexes"
          active-class="primary--text"
        >
          <template v-for="(item, index) in filteredRecords">
            <v-list-item :key="item.title" class="competitions-item">
              <template #default>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name" class="text-center"></v-list-item-title>

                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.time"
                  ></v-list-item-subtitle>

                </v-list-item-content>

                <v-list-item-action>
                  <v-row>

                  <v-btn icon>
                    <v-icon color="grey darken-2" @click="editRecord(item)">mdi-file-edit-outline</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon color="error" @click="deleteRecord(item)">mdi-delete</v-icon>
                  </v-btn>
                </v-row>

                </v-list-item-action>
              </template>
            </v-list-item>

            <v-divider
              v-if="index < competitions.length - 1"
              :key="index"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
      </v-col>
      <v-card>
      </v-card>
      <v-row class="ma-3 py-2 justify-center">
        <v-btn dark color="primary" @click="addCompetitionItem">Додати</v-btn>
        <v-btn dark text @click="$router.push({ name: 'editCompetition', params: { id: $route.params.id}})" class="ml-4">Назад</v-btn>
      </v-row>
    </div>
  </v-sheet>

    <v-dialog
      v-model="editDialog"
      width="80%"
      height="80%"
    >
      <v-card>
        <v-card-title class="text-h5 justify-center">
          {{  editItem.id ? 'Edit' : 'New achivement' }}
        </v-card-title>

        <v-card-text>
            <v-col>
              <v-text-field
                  v-model="editItem.name"
                  label="Name"
                  required
              ></v-text-field>
              <v-text-field
                  v-model="editItem.time"
                  label="Time"
                  required
              ></v-text-field>
              <v-select
                v-model="editItem.sportType"
                :items="competitionItems"
                label="Змагання"
              ></v-select>
              <vue-editor v-model="editItem.description" :editorOptions="editorSettings" />
            </v-col>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn
            class="white--text"
            color="green darken-1"
            @click="saveRecord"
          >
            Зберегти
          </v-btn>
          <v-btn
            text
            @click="editDialog = false"
          >
            Скасувати
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
const defaultEditItem = { name: '', time: '', description: '', sportType: null};

export default {
  data: function () {
    return {
      isEditingExistingItem: false,
      editDialog: false,
      editItem: defaultEditItem,

      selectedIndexes: [],
      records: [],
      competitionType: null,
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
          value: 'RETRACTALE_LADDER', text: 'Висувна драбина'
        },
        {
          value: 'RELAY', text: 'Пожежна естафета'
        },
        {
          value: 'COMBAT_DEPLOYMENT', text: 'Бойове розгортання'
        }
      ],

      configurations: [],
      editorSettings: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }]
          ]
        }
      },

      alertType: 'error',
      showAlert: false,
      alertMessage: '',
    }
  },
  computed: {
    chosenItem () {
      const { length, [0]: selectedItem} = this.selectedItems;
      return length == 1 ? selectedItem : null;
    },
    filteredRecords() {
      const competitionType = this.competitionType;
      return this.records.filter(({sportType}) => sportType === competitionType);
    }
  },
  async mounted() {
    await this.fetchCompetitios();
  },
  methods: {
    addCompetitionItem() {
      this.editItem = defaultEditItem;
      this.editDialog = true;
      this.isEditingExistingItem = false;
    },
    editRecord(item) {
      this.editItem = item;
      this.editDialog = true;
      this.isEditingExistingItem = true;
    },
    async saveRecord() {
      try {
        const data = this.isEditingExistingItem 
          ? await this.axios.put('private/records', this.editItem) 
          : await this.axios.post('private/records', this.editItem);
        await this.fetchCompetitios();
        this.editDialog = false;
        this.editItem = defaultEditItem;
      } catch(error) {
        this.showError(error);
      }
    },
    async fetchCompetitios() {
      return this.axios.get('private/records')
        .then(({ data = [] }) => {
          this.records = data;
        })
    },
    async deleteRecord({reference}) {
      if (!reference) console.error('Cant be deleted as there is no reference');
      return this.axios.delete(`private/records/${reference}`,)
        .then(() => this.fetchCompetitios())
    },
    showError(error) {
        this.alertMessage = error.response && error.response.data.description ? error.response.data.description : error.message;
        this.showAlert = true;
    }
  }
}
</script>
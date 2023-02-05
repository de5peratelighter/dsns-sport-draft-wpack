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
          <template v-for="(item, index) in competitions">
            <v-list-item :key="item.title" class="competitions-item">
              <template #default>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name" class="text-center"></v-list-item-title>

                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="item.competitionDate"
                  ></v-list-item-subtitle>

                </v-list-item-content>

                <v-list-item-action>
                  <v-row>

                  <v-btn icon>
                    <v-icon color="grey darken-2" @click="editCompetitionItem(item)">mdi-file-edit-outline</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon color="error">mdi-delete</v-icon>
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
                  v-model="editItem.competitionDate"
                  label="Date"
                  required
              ></v-text-field>
              <vue-editor v-model="content" :editorOptions="editorSettings" />
            </v-col>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn
            class="white--text"
            color="green darken-1"
            @click="editDialog = false"
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

  </v-container>
</template>

<script>
//import { VueEditor } from "vue2-editor";
export default {
  components: {
   // VueEditor
  },
  data: function () {
    return {
      editDialog: false,
      editItem: { name: '', competitionDate: ''},

      selectedIndexes: [],
      competitions: [],
      competitionType: null,
      competitionItems: [
        {
          value: 'one_hundred_meters', text: '100 метрова полоса'
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

      configurations: [],
      content: '',
      editorSettings: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }]
          ]
        }
      }
    }
  },
  computed: {
    chosenItem () {
      const { length, [0]: selectedItem} = this.selectedItems;
      return length == 1 ? selectedItem : null;
    }
  },
  async mounted() {
    await this.fetchCompetitios();
  },
  methods: {
    addCompetitionItem() {
      this.editItem = {name: '', competitionDate: ''};
      this.editDialog = true;
    },
    editCompetitionItem(item) {
      this.editItem = item;
      this.editDialog = true;
      console.warn('item', item)
    },
    async fetchCompetitios() {
      return this.axios.get('private/competitions')
        .then(({ data = [] }) => {
          this.competitions = data;
        })
    }
  }
}
</script>
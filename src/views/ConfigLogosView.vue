<template>
  <v-container class="config-logos white--text" ma-0 pa-0 fluid color="white">
    <v-row class="text-center align-center justify-center">
      <v-col cols="6">
        <v-card max-width="400" class="justify-center text-center mx-auto pa-2">
          <v-card-title class="subtitle-1">
            Вибір логотипа у частинах протоколу
          </v-card-title>
          <v-img class="my-2" :src="leftLogo"></v-img>
          <v-file-input accept="image/*" v-model="leftFile" label="Виберіть файл" :prepend-icon="null"
            prepend-inner-icon="mdi-paperclip" outlined :show-size="1000" hide-details />
          <v-select class="my-2" v-model="logoPosition" :items="['Зверху', 'Знизу', 'Зліва', 'Справа']"
            label="Розміщення логотипу"></v-select>
          <v-card-title class="subtitle-1">
            Вибір статі учасників
          </v-card-title>
          <v-radio-group v-model="selectedGender">
            <v-row>
              <v-col cols="6">
                <v-radio value="male" label="Чоловіки"></v-radio>
              </v-col>
              <v-col cols="6">
                <v-radio value="female" label="Жінки"></v-radio>
              </v-col>
            </v-row>
          </v-radio-group>
          <v-btn color="light-green" block class="mt-2">
            Зберегти
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      leftImage: null,
      leftFile: null,

      rightImage: null,
      rightFile: null,
    }
  },
  computed: {
    leftLogo() {
      const leftImage = this.leftImage;
      if (leftImage) {
        return URL.createObjectURL(leftImage);
      }
      return require('../assets/sport1.png');
    },
    rightLogo() {
      const rightImage = this.rightImage;
      if (rightImage) {
        return URL.createObjectURL(rightImage);
      }
      return require('../assets/sport1.png');
    },
  },
  watch: {
    leftFile: {
      handler(file) {
        this.leftImage = file;
      }
    },
    rightFile: {
      handler(file) {
        this.rightImage = file;
      }
    },
  },
}
</script>
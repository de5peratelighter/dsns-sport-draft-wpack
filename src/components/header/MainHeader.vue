<template>
  <v-container ma-0 pa-0 pt-3 fluid>
    <v-row>
      <v-col cols="10" class="pa-0">
        <div class="d-flex flex-row align-center flex-grow-1">
          <div class="d-flex flex-column align-center">
            <v-btn icon @click="$router.push({ name: 'selectCompetition' })">
              <v-icon color="white" large>mdi-account</v-icon>
            </v-btn>

            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-app-bar-nav-icon x-large color="white" v-bind="attrs" v-on="on" />
              </template>

              <v-list>
                <v-list-item v-for="(item, i) in mainMenuItems" :key="i">
                  <v-list-item-title @click="handleMenuItemClick(item)">{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <v-spacer class="app-header-logo-spacer mr-4 ml-2 flex-grow-0" />
          <v-img max-height="90" max-width="90" contain :src="require('@/assets/sport1.png')" @click="$router.push('/')"
            style="cursor: pointer" />
          <div class="d-flex flex-column align-left ml-6 flex-grow-1">
            <div class="d-flex flex-row justify-space-between flex-grow-1 flex-shrink-0 align-center">
              <div class="text-h6">{{ this.$t(`shared.championshipOfUkraineFirefightingSports`) }}</div>
              <div>{{ this.$t(`shared.eventDate`) }}</div>
              <div>{{ this.$t(`shared.eventPlaceKyiv`) }}</div>
              <div>
                <v-btn v-for="(social, index) in socialLinks" :key="index" :href="social.url" small icon target="_blank">
                  <v-icon color="white">{{ `mdi-${social.name}` }}</v-icon>
                </v-btn>
              </div>
            </div>
            <div class="text-subtitle-1 mb-1">{{ this.$t(`shared.overcoming100mObstacleCourse`) }}</div>
          </div>
        </div>
      </v-col>
      <v-col cols="2">
        <div class="d-flex align-center text-center justify-center">
          <button v-for="(language, index) in languageOptions" :key="index" :class="index ? 'ml-2' : null"
            :style="language.style" @click="switchLanguage(language.code)">
            <v-img :height="language.height" :width="language.width" :src="require(`@/assets/${language.code}-flag.png`)"
              :alt="language.alt" style="cursor: pointer" />
          </button>
        </div>
        <div class="d-flex align-center fill-height text-center justify-center">
          <template>
            <div>
              <div v-if="weatherData">
                <p>Температура в Києві: {{ weatherData.main.temp }}°C</p>
                <!-- <p>Опис: {{ weatherData.weather[0].description }}</p> -->
              </div>
              <div v-else>
                <p>Завантаження погодних даних...</p>
              </div>
            </div>
          </template>
        </div>
      </v-col>
    </v-row>
    <v-dialog v-model="registrationDialog" max-width="400" rounded>
      <v-card>
        <v-card-title class="headline">{{ this.$t(`shared.userRegistration`) }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="registerUser">
            <v-text-field v-model="firstName" label="Ім'я" required></v-text-field>
            <v-text-field v-model="secondName" label="Прізвище" required></v-text-field>
            <v-text-field v-model="username" label="Логін" required></v-text-field>
            <v-text-field v-model="password" label="Пароль" required class="password-input-wrapper"
              :type="showPassword ? 'text' : 'password'">
              <template v-slot:append-outer>
                <v-icon @click="showPassword = !showPassword" class="toggle-password-visibility">
                  {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>
            <v-card-actions class="d-flex justify-space-between">
              <v-btn type="submit" color="primary" class="elevation-3">Зареєструватись</v-btn>
              <v-btn @click="cancelRegistration">Скасувати</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="registrationSuccessDialog" max-width="400" ref="registrationSuccessDialog" rounded>
      <v-card>
        <v-card-title>Успішно!</v-card-title>
        <v-card-actions>
          <p>Зв'яжіться з адміном для завершення реєстрації.</p>
          <v-btn @click="closeRegistrationSuccessDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="loginSuccessDialog" max-width="400" ref="loginSuccessDialog" rounded>
      <v-card>
        <v-card-title>Успішно!</v-card-title>
        <v-card-text class="success-message">
          <p>Ви успішно увійшли в систему.</p>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn @click="closeLoginSuccessDialog">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      loginUsername: '',
      loginPassword: '',
      loginDialog: false,
      loginSuccessDialog: false,
      loginError: null,
      username: '',
      firstName: '',
      secondName: '',
      password: '',
      showPassword: false,
      registrationDialog: false,
      registrationSuccessDialog: false,
      activeLang: null,
      weatherData: null,
      apiKey: '4a697c396f11e7450074d7f1e5b233ec',
      city: 'Kyiv',
      units: 'metric',
      accessToken: ''
    }
  },
  mounted() {
    this.fetchWeather();
  },
  computed: {
    mainMenuItems() {
      const isLoggedIn = this.isLoggedIn;

      const items = [
        { title: this.$t(`shared.profile`), show: isLoggedIn },
        { title: this.$t(`shared.commandProtocol`), show: isLoggedIn },
        { title: this.$t(`shared.userRegistration`), show: !isLoggedIn },
        { title: this.$t(`shared.userLogin`), show: !isLoggedIn },
        { title: this.$t(`shared.athletesBase`), show: !isLoggedIn },
        { title: this.$t(`shared.userLogout`), show: isLoggedIn },
      ];

      return items.filter(({ show }) => show);
    },
    socialLinks() {
      // @TODO these to be provided by backend
      const items = [
        { name: 'telegram', url: 'https://google.com.ua' },
        { name: 'facebook', url: '' },
        { name: 'twitter', url: '' },
        { name: 'youtube', url: '' },
        { name: 'instagram', url: '' },
        { name: 'web', url: '' },
      ];
      return items;
    },
    languageOptions() {
      const activeLang = this.activeLang;
      const defaultOptions = { width: '33', height: '20' }
      return [
        {
          code: 'uk',
          alt: 'Українська',
        },
        {
          code: 'en',
          alt: 'English language',
        }
      ].map((item) => ({ ...item, ...defaultOptions, style: { 'border': `2px solid ${activeLang === item.code ? 'white' : 'transparent'}` } }));
    }
  },
  watch: {
    activeLang: {
      handler(v) {
        if (v) {
          this.$i18n.locale = v;
        } else {
          this.switchLanguage(this.$i18n.locale);
        }
      },
      immediate: true
    }
  },
  methods: {
    openRegistrationDialog() {
      const registrationButton = this.mainMenuItems.find(item => item.title === this.$t('shared.userRegistration'));
      if (registrationButton) {
        this.registrationDialog = true;
      }
    },
    cancelRegistration() {
      this.registrationDialog = false;
    },
    showAdminMessage() {
      this.registrationDialog = false;
      this.registrationSuccessDialog = true;
    },
    closeRegistrationSuccessDialog() {
      if (this.$refs.registrationSuccessDialog) {
        this.$refs.registrationSuccessDialog.isActive = false;
      }
    },
    switchLanguage(lang) {
      this.activeLang = lang;
      localStorage.setItem('dsns-competitions-lang', lang);
    },
    cancelLogin() {
      this.$emit('toggleLoginDialog', false)
    },
    closeLoginSuccessDialog() {
      if (this.$refs.loginSuccessDialog) {
        this.$refs.loginSuccessDialog.isActive = false;
      }
    },
    async registerUser() {
      try {
        const response = await axios.post('public/auth/registration', {
          username: this.username,
          password: this.password,
          firstName: this.firstName,
          secondName: this.secondName,
        });

        console.log('Успішна реєстрація:', response.data);
        this.registrationDialog = false;

        this.showAdminMessage();
      } catch (error) {
        console.error('Помилка реєстрації:', error);
      }
    },
    handleMenuItemClick(item) {
      if (item.title === this.$t('shared.userRegistration')) {
        this.openRegistrationDialog();
      } else if (item.title === this.$t('shared.userLogin')) {
        this.$emit('toggleLoginDialog', true)
      } else if (item.title === this.$t('shared.userLogout')) {
        this.$emit('logoutUser')
      } else if (item.title === this.$t('shared.athletesBase')) {
        this.$router.push('/admin');
      }
    },
    async fetchWeather() {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=${this.units}&appid=${this.apiKey}`);
        this.weatherData = response.data;
      } catch (error) {
        console.error('Помилка отримання погодних даних:', error);
      }
    }
  }
}
</script>

<style>
.success-message {
  padding: 16px;
}

.v-btn {
  min-width: auto;
  padding: 8px 16px;
}

.v-dialog {
  border-radius: 10px;
}

.v-card-title {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.v-card-actions {
  margin-top: 16px;
}

.elevation-3 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper .toggle-password-visibility {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.password-input-wrapper .password-input {
  width: calc(100% - 40px);
  padding-right: 40px;
}

.toggle-password-visibility {
  padding-bottom: 7px;
}
</style>

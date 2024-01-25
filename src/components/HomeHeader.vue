<template>
  <v-app-bar app flat absolute tile color="transparent" :height="'90px'" class="app-header white--text font-weight-bold">
    <AdminHeader v-if="isEditCompetition || isProtocols" />
    <MainHeader v-if="isMainRoute" :isLoggedIn="isLoggedIn" @toggleLoginDialog="toggleLoginDialog"
      @logoutUser="logoutUser" />

    <BreadCrumbs v-if="!isProtocols" />

    <v-dialog v-model="loginDialog" max-width="400" rounded>
      <v-card>
        <v-card-title class="headline">{{ this.$t(`shared.userLogin`) }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="loginUser">
            <v-text-field v-model="loginUsername" label="Логін" required></v-text-field>
            <v-text-field v-model="loginPassword" label="Пароль" required class="password-input-wrapper"
              :type="showPassword ? 'text' : 'password'">
              <template v-slot:append-outer>
                <v-icon @click="togglePasswordVisibility" class="toggle-password-visibility">
                  {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>

            <v-alert v-if="loginError" type="error" class="mt-4">{{ loginError }}</v-alert>

            <v-card-actions class="d-flex justify-space-between">
              <v-btn type="submit" color="primary">Увійти</v-btn>
              <v-btn @click="toggleLoginDialog(false)">Скасувати</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import axios from 'axios';
import MainHeader from '@/components/header/MainHeader.vue'
import AdminHeader from '@/components/header/AdminHeader.vue'
import BreadCrumbs from '@/components/header/BreadCrumbs.vue'
export default {
  components: {
    AdminHeader,
    MainHeader,
    BreadCrumbs
  },
  data: function () {
    return {
      loginUsername: '',
      loginPassword: '',
      loginDialog: false,
      loginSuccessDialog: false,
      loginError: null,
      showPassword: false,
      accessToken: ''
    }
  },
  computed: {
    isEditCompetition() {
      return this.$route.name === 'editCompetition'
    },
    isMainRoute() {
      return this.$route.name === 'main'
    },
    isProtocols() {
      return this.$route.name === 'protocols'
    },
  },
  mounted() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.accessToken = localStorage.getItem('accessToken') ?? '';
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post('public/auth/login', {
          username: this.loginUsername,
          password: this.loginPassword,
        });

        const { accessToken, refreshToken, reference } = response.data;
        this.accessToken = accessToken;
        this.setAuthenticationStatus(true);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('reference', reference);

        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        this.showLoginSuccessMessage();

        this.startTokenRefreshTimer();
      } catch (error) {
        console.error('Login error:', error);

        const errorCode = error.response.data.code;

        if (errorCode === '400-002') {
          this.loginError = this.$t('shared.incorrectPasswordErrorMessage');
        } else if (errorCode === '404-002') {
          this.loginError = this.$t('shared.userNotFoundErrorMessage');
        } else {
          this.loginError = this.$t('shared.loginErrorMessage');
        }
      }
    },
    logoutUser() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('reference');
      localStorage.removeItem('isLoggedIn');

      this.loginUsername = '';
      this.loginPassword = '';
      this.setAuthenticationStatus(false);

      delete axios.defaults.headers.common['Authorization'];

      this.stopTokenRefreshTimer();
    },
    toggleLoginDialog(value) {
      this.loginDialog = value;
    },
    setAuthenticationStatus(isLoggedIn) {
      this.isLoggedIn = isLoggedIn;
      localStorage.setItem('isLoggedIn', isLoggedIn);
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    showLoginSuccessMessage() {
      this.toggleLoginDialog(false);
      this.loginSuccessDialog = true;
    },
    startTokenRefreshTimer() {
      this.stopTokenRefreshTimer();

      const refreshTokenInterval = setInterval(async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const refreshResponse = await axios.post('public/auth/new-access-token', {
              refreshToken,
            });

            const newAccessToken = refreshResponse.data.accessToken;
            localStorage.setItem('accessToken', newAccessToken);

            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          // Handle token refresh error, e.g., redirect to login
          // and stop the refresh timer
          this.logoutUser(); // Redirect or perform necessary actions
          this.stopTokenRefreshTimer();
        }
      }, 1000 * 60 * 30); // Refresh every 30 minutes

      // Save the interval ID to clear it later
      this.refreshTokenInterval = refreshTokenInterval;
    },
    stopTokenRefreshTimer() {
      if (this.refreshTokenInterval) {
        clearInterval(this.refreshTokenInterval);
        this.refreshTokenInterval = null;
      }
    },
  }
}
</script>
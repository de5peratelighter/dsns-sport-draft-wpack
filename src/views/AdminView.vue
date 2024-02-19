<template>
  <v-container fluid class="admin-panel-container">
    <v-row class="text-center justify-center">
      <v-col cols="10">
        <v-row class="d-flex align-center">
          <v-col cols="auto">
            <v-btn icon @click="goBack">
              <v-icon color="white">mdi-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <h2 class="white--text mb-0">{{ this.$t(`shared.usersBase`) }}</h2>
          </v-col>
        </v-row>
        <v-list>
          <v-list-item-group v-if="users && users.content.length > 0">
            <v-list-item v-for="user in users.content" :key="user.reference">
              <v-list-item-content>
                <v-list-item-title>{{ user.username }}</v-list-item-title>
                <v-list-item-subtitle>Статус: {{ user.active ? 'активний' : 'неактивний' }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn @click="toggleUserStatus(user.reference, !user.active)">
                  {{ user.active ? 'Деактивувати' : 'Активувати' }}
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
          <v-alert v-else :value="true" type="info">Користувачів не знайдено.</v-alert>
        </v-list>
        <v-pagination v-if="users && users.totalPages > 1" v-model="currentPage" :length="users.totalPages"
          @input="fetchUsers"></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: null,
      currentPage: 1,
    };
  },
  methods: {
    toggleUserStatus(id, isActive) {
      console.log('Request Payload:', { id, isActive });
      axios.put(`private/users/${id}/status?isActive=${isActive}`)
        .then(() => {
          const updatedUserIndex = this.users.content.findIndex(user => user.reference === id);
          if (updatedUserIndex !== -1) {
            this.$set(this.users.content, updatedUserIndex, { ...this.users.content[updatedUserIndex], active: isActive });
          }
        })
        .catch(error => {
          console.error('Error updating user status:', error);
          console.log('Error response:', error.response);
        });
    },
    fetchUsers() {
      const params = {
        page: this.currentPage - 1,
        size: this.pageSize,
      };

      axios.get('private/users/pageable', { params })
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>
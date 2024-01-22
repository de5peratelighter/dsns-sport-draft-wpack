<template>
  <v-container fluid class="admin-panel-container">
    <v-row class="text-center justify-center">
      <v-col cols="8">
        <h2 class="white--text">БАЗА СПОРТСМЕНІВ</h2>
        <v-list>
          <v-list-item-group v-if="users && users.content.length > 0">
            <v-list-item v-for="user in users.content" :key="user.reference">
              <v-list-item-content>
                <v-list-item-title>{{ user.username }}</v-list-item-title>
                <v-list-item-subtitle>Статус: {{ user.isActive ? 'активний' : 'неактивний' }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn @click="toggleUserStatus(user.reference, !user.isActive)">
                  {{ user.isActive ? 'Деактивувати' : 'Активувати' }}
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
    toggleUserStatus(userId, isActive) {
      axios.put(`private/users/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYXphcjIwMjEiLCJyb2xlIjoiUk9MRV9BRE1JTiIsImlhdCI6MTcwNTk0NzYwMiwiZXhwIjoxNzA1OTQ4MjAyfQ.QG_TZ4xlkTCA4NyA4pMSQeoCQeJd0Aymol_WWNm1qUc/status`, { isActive })
        .then(() => {
          const updatedUserIndex = this.users.content.findIndex(user => user.reference === userId);
          if (updatedUserIndex !== -1) {
            this.$set(this.users.content, updatedUserIndex, { ...this.users.content[updatedUserIndex], isActive });
          }
        })
        .catch(error => {
          console.error('Error updating user status:', error);
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
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>
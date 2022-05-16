<template>
  <nav class="navbar">
    <router-link class="router-link" to="/">Home</router-link>
    <router-link class="router-link" to="/statistiques"
      >Statistiques</router-link
    >
    <router-link v-if="!isAuthenticated" class="router-link" to="/signup"
      >S'inscrire</router-link
    >
    <router-link v-if="!isAuthenticated" class="router-link" to="/login"
      >Connexion</router-link
    >
    <router-link v-if="isAuthenticated" class="router-link" to="/logout"
      >Déconnexion</router-link
    >
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "NavbarComponent",
  methods: {
    logout() {
      localStorage.removeItem("token");
    },
  },
  computed: {
    isAuthenticated() {
      return localStorage.getItem("token") !== null;
    },
  },
});
</script>

<style></style>

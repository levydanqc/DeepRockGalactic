<template>
  <div>
    <h1>LOGIN</h1>
    <form @submit.prevent="login" class="mx-auto p-3">
      <div class="bg-danger text-white p-1 mx-4 rounded" v-if="erreurs.length">
        <span v-for="erreur in erreurs" :key="erreur">{{ erreur }}</span>
      </div>
      <input
        class="text-center p-1 my-3 rounded"
        v-model="email"
        placeholder="Courriel"
      />
      <div class="w-100"></div>
      <input
        class="text-center p-1 rounded"
        v-model="motdepasse"
        placeholder="Mot de passe"
        type="password"
      />
      <div class="w-100"></div>
      <button class="btn btn-success px-5 my-3" type="submit">Login</button>
      <div class="w-100"></div>
      <router-link
        to="/signup"
        class="text-secondary"
        style="text-decoration: none"
        >S'inscrire</router-link
      >
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => {
    return {
      email: "",
      motdepasse: "",
      erreurs: [] as Array<string>,
    };
  },
  methods: {
    login() {
      fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          motdepasse: this.motdepasse,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            this.erreurs.push("Erreur !");
          }
        })
        .then((data) => {
          localStorage.setItem("token", data.token);
          this.$router.push("/");
        });
    },
  },
});
</script>

<style></style>

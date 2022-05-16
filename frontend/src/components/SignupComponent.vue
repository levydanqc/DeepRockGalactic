<template>
  <h1>S'Inscrire</h1>
  <form @submit.prevent="signup" class="mx-auto p-3">
    <div class="bg-danger text-white p-1 mx-4 rounded" v-if="erreurs.length">
      <span v-for="erreur in erreurs" :key="erreur">{{ erreur }}</span>
    </div>
    <v-text-field
      label="Courriel"
      color="secondary"
      variant="outlined"
      v-model="email"
      prepend-inner-icon="mdi-currency-usd"
      class="text-center p-1 rounded"
    ></v-text-field>
    <div class="w-100"></div>
    <v-text-field
      label="Mot de passe"
      color="secondary"
      variant="outlined"
      v-model="motdepasse"
      prepend-inner-icon="mdi-currency-usd"
      type="password"
      class="text-center p-1 rounded"
    ></v-text-field>
    <div class="w-100"></div>
    <button-component type="submit" class="px-5 my-3" @click="signup"
      >Créer un compte</button-component
    >
    <div class="my-3 w-100"></div>
    <router-link to="/login">J'ai déjà un compte</router-link>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ButtonComponent from "./reusable/ButtonComponent.vue";
import ROUTES from "../services/routes";

export default defineComponent({
  data: () => {
    return {
      email: "",
      motdepasse: "",
      nom: "",
      niveau: 0,
      erreurs: [] as Array<string>,
    };
  },
  methods: {
    signup() {
      fetch(ROUTES.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          nom: this.nom,
          motdepasse: this.motdepasse,
          niveau: this.niveau,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 400) {
            this.erreurs.push("Ce courriel est déjà pris!");
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
  components: {
    ButtonComponent,
  },
});
</script>

<style>
@import "../assets/styles/variables.css";

form {
  border: solid 1px black;
  width: 25vw;
  min-width: 300px;
}
</style>

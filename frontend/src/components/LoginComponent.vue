<template>
  <div>
    <h1>Connexion</h1>
    <form @submit.prevent="login" class="mx-auto p-3">
      <div class="text-danger p-1 mx-4 rounded" v-if="erreurs.length">
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
      <button-component type="submit" class="px-5 my-3" @click="login"
        >Se connecter</button-component
      >
      <div class="w-100"></div>
      <router-link to="/signup">S'inscrire</router-link>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ROUTES from "../services/routes";
import ButtonComponent from "./reusable/ButtonComponent.vue";
import { POSITION, useToast } from "vue-toastification";

export default defineComponent({
  data: () => {
    return {
      email: "",
      motdepasse: "",
      erreurs: [] as Array<string>,
    };
  },
  setup: () => {
    const toast = useToast();
    return { toast };
  },
  created() {
    const options: any = {
      position: POSITION.TOP_RIGHT,
      timeout: 3016,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 1,
      showCloseButtonOnHover: false,
      hideProgressBar: true,
      closeButton: "button",
      icon: true,
      rtl: false,
      toastClassName: "my-custom-toast-class",
    };
    if (this.$route.query.redirect)
      this.toast.error(
        "Vous devez être connecté pour accéder à cette page",
        options
      );
  },
  methods: {
    login() {
      fetch(ROUTES.LOGIN, {
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
            this.erreurs.push("Email ou mot de passe incorrect");
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

<style></style>

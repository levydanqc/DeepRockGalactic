<template>
  <div>
    <h1>Connexion</h1>
    <form @submit.prevent="login" class="mx-auto p-3">
      <span class="text-danger p-1 mx-4 rounded" v-if="erreur">
        {{ erreur }}
      </span>
      <v-text-field
        label="Courriel"
        color="secondary"
        variant="outlined"
        v-model="email"
        prepend-inner-icon="mdi-at"
        class="text-center p-1 rounded"
      ></v-text-field>
      <div class="w-100"></div>
      <v-text-field
        label="Mot de passe"
        color="secondary"
        variant="outlined"
        v-model="motdepasse"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="show = !show"
        :type="show ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock"
        class="text-center p-1 rounded"
      ></v-text-field>
      <div class="w-100"></div>
      <button-component type="submit" class="px-5 my-3"
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
      show: false,
      email: "",
      motdepasse: "",
      erreur: undefined as string | undefined,
    };
  },
  setup: () => {
    const toast = useToast();
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
    return { toast, options };
  },
  created() {
    if (this.$route.query.redirect)
      this.toast.error(
        "Vous devez être connecté pour accéder à cette page",
        this.options
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
          } else if (response.status === 401) {
            this.erreur = "Email ou mot de passe incorrect";
          } else {
            this.toast.error(
              "Une erreur est survenue, veuillez réessayer plus tard",
              this.options
            );
          }
        })
        .then((data) => {
          localStorage.setItem("token", data.token);
          this.$router.push("/");
          this.$forceUpdate();
        });
    },
  },
  components: {
    ButtonComponent,
  },
});
</script>

<style></style>

<template>
  <h1>S'inscrire</h1>
  <form @submit.prevent="signup" class="mx-auto p-3">
    <span class="text-danger" v-if="erreur">{{ erreur }}</span>
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
    <v-text-field
      label="Nom d'utilisateur"
      color="secondary"
      variant="outlined"
      v-model="nom"
      prepend-inner-icon="mdi-account"
      class="text-center p-1 rounded"
    ></v-text-field>
    <button-component type="submit" class="px-5 my-3"
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
import { POSITION, useToast } from "vue-toastification";

export default defineComponent({
  data: () => {
    return {
      show: false,
      email: "",
      motdepasse: "",
      nom: "",
      niveau: 1,
      erreur: undefined as string | undefined,
    };
  },
  setup() {
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
  methods: {
    signup() {
      var regex = /\S+@\S+\.\S+/;
      if (this.email.length === 0) {
        this.erreur = "Veuillez entrer un courriel";
        return;
      }
      if (!this.email.match(regex)) {
        this.erreur = "Veuillez entrer un courriel valide";
        return;
      }
      if (this.motdepasse.length === 0) {
        this.erreur = "Veuillez entrer un mot de passe";
        return;
      }
      if (this.nom.length === 0) {
        this.erreur = "Veuillez entrer un nom d'utilisateur";
        return;
      }
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
      }).then((response) => {
        if (response.status === 201) {
          this.toast.success("Votre compte a été créé !", this.options);
          this.$router.push("/login");
          return;
        } else if (response.status === 400) {
          this.erreur = "Ce courriel est déjà pris!";
        } else {
          this.toast.error("Il y a eu une erreur du serveur", this.options);
        }
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

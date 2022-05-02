<template>
  <div>
    <h1>S'Inscrire</h1>
    <form
      @submit.prevent="signup"
      style="border: solid 1px black; width: 25vw; min-width: 300px"
      class="mx-auto p-3"
    >
      <div class="bg-danger text-white p-1 mx-4 rounded" v-if="erreurs.length">
        <span v-for="erreur in erreurs" :key="erreur">{{ erreur }}</span>
      </div>
      <input
        class="text-center p-1 my-3 rounded"
        style="background-color: #e3e3e3"
        v-model="courriel"
        placeholder="Courriel"
      />
      <div style="width: 100%"></div>
      <input
        class="text-center p-1 rounded"
        style="background-color: #e3e3e3"
        v-model="nom"
        placeholder="Nom"
      />
      <div style="width: 100%"></div>
      <input
        class="text-center p-1 my-3 rounded"
        style="background-color: #e3e3e3"
        v-model="password"
        placeholder="Mot de passe"
        type="password"
      />
      <div style="width: 100%"></div>
      <button class="btn btn-success px-5" type="submit">Créer</button>
      <div class="my-3" style="width: 100%"></div>
      <router-link
        to="/login"
        class="text-secondary"
        style="text-decoration: none"
        >J'ai déjà un compte</router-link
      >
    </form>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      courriel: "",
      password: "",
      nom: "",
      erreurs: [],
    };
  },
  methods: {
    signup() {
      fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courriel: this.courriel,
          nom: this.nom,
          password: this.password,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            this.erreurs.push("Erreur!");
          }
        })
        .then((data) => {
          console.log("data", data);
          localStorage.setItem("token", data.token);
          this.$router.push("/");
        });
    },
  },
};
</script>

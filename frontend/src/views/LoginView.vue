<template>
  <div>
    <h1>LOGIN</h1>
    <form
      @submit.prevent="login"
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
        v-model="password"
        placeholder="password"
        type="password"
      />
      <div style="width: 100%"></div>
      <button class="btn btn-success px-5 my-3" type="submit">Login</button>
      <div style="width: 100%"></div>
      <router-link
        to="/signup"
        class="text-secondary"
        style="text-decoration: none"
        >S'inscrire</router-link
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
      erreurs: [],
    };
  },
  methods: {
    login() {
      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courriel: this.courriel,
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

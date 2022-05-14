<template>
  <div id="content">
    <header>
      <v-img
        :src="require('./assets/drg_logo.png')"
        class="my-3"
        contain
        height="200"
      />
    </header>
    <nav class="navbar border">
      <router-link class="router-link nav-item nav-link" to="/"
        >Home</router-link
      >
      <router-link class="router-link nav-item nav-link" to="/planetes"
        >Planètes</router-link
      >
      <router-link class="router-link nav-item nav-link" to="/reservations"
        >Réserver</router-link
      >
      <router-link class="router-link nav-item nav-link" to="/contrats"
        >Contrats</router-link
      >
      <router-link class="router-link nav-item nav-link" to="/login"
        >Se Connecter</router-link
      >
    </nav>
    <router-view />
  </div>
</template>

<style lang="css">
@import "./assets/styles/variables.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  width: 75vw;
  font-size: 1.5vw;
  margin: auto;
  background-color: #686868;
}
.router-link {
  font-weight: bold;
  color: #e0ff2f;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",

  data() {
    return {
      //
    };
  },
});
</script>

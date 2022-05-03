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
    <nav class="navbar navbar-dark bg-secondary border">
      <router-link style="color: #e0ff2f" class="nav-item nav-link" to="/"
        >Home</router-link
      >
      <router-link
        style="color: #e0ff2f"
        class="nav-item nav-link"
        to="/planetes"
        >Planètes</router-link
      >
      <router-link
        style="color: #e0ff2f"
        class="nav-item nav-link"
        to="/reservations"
        >Réserver</router-link
      >
      <router-link
        style="color: #e0ff2f"
        class="nav-item nav-link"
        to="/contrats"
        >Contrats</router-link
      >
      <router-link
        style="color: #e0ff2f"
        class="nav-item nav-link"
        to="/auth/login"
        >Se Connecter</router-link
      >
    </nav>
    <router-view />
  </div>
</template>

<style lang="scss">
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
  a {
    font-weight: bold;
    color: #e0ff2f;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
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

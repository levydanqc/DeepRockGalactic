<template>
  <div id="content">
    <header class="m-0">
      <v-img
        :src="require('./assets/drg_logo.png')"
        class="m-0"
        contain
        height="200"
      />
    </header>
    <nav class="navbar">
      <router-link class="router-link" to="/">Home</router-link>
      <router-link class="router-link" to="/planetes">Planètes</router-link>
      <router-link class="router-link" to="/reservations">Réserver</router-link>
      <router-link class="router-link" to="/contrats">Contrats</router-link>
      <router-link class="router-link" to="/auth/login"
        >Se Connecter</router-link
      >
    </nav>
    <router-view />
  </div>
</template>

<style lang="scss">
@import "./assets/styles/variables.css";
@import "bootstrap";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  width: 100vw;
  padding: 0 20%;
  font-size: 1.5vw;
  margin: auto;
  @extend .border-bottom;
  @extend .border-4;
  border-color: var(--primary-color) !important;
}
.router-link {
  font-weight: bold;
  color: var(--secondary-color);
}
.router-link-exact-active {
  color: var(--primary-color);
}
a {
  text-decoration: none !important;
  &:hover {
    color: var(--hover-color) !important;
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

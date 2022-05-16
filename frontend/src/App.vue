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
    <navbar-component :key="$route.fullPath" />
    <router-view />
  </div>
</template>

<style lang="scss">
@import "bootstrap";
@import "./assets/styles/variables.css";

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
</style>

<script lang="ts">
import { defineComponent } from "vue";
import NavbarComponent from "./components/NavbarComponent.vue";

export default defineComponent({
  name: "App",

  data() {
    return {
      //
    };
  },
  components: {
    NavbarComponent,
  },
});
</script>

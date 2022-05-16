<template>
  <login-component />
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components
import LoginComponent from "../components/LoginComponent.vue";

export default defineComponent({
  name: "LoginView",

  components: {
    LoginComponent,
  },
});
</script>
<style lang="scss">
@import "../assets/styles/variables.css";
form {
  border: solid 1px black;
  width: 25vw;
  min-width: 300px;
}
input {
  background: var(--background-color);
}
</style>

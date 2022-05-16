<template>
  <signup-component />
</template>

<script>
import { defineComponent } from "vue";

import SignupComponent from "../components/SignupComponent.vue";

export default defineComponent({
  name: "SignupView",

  components: {
    SignupComponent,
  },
});
</script>

<style></style>

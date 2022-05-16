<template>
  <logout-component />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import LogoutComponent from "../components/LogoutComponent.vue";

export default defineComponent({
  name: "LogoutView",

  components: {
    LogoutComponent,
  },
});
</script>

<style></style>

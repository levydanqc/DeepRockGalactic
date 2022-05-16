<template>
  <stat-component />
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components
import StatComponent from "../components/StatComponent.vue";

export default defineComponent({
  name: "StatistiquesView",

  components: {
    StatComponent,
  },
});
</script>

<template>
  <search-component />
</template>

<script lang="ts">
import { defineComponent } from "vue";

// Components
import SearchComponent from "../components/SearchComponent.vue";

export default defineComponent({
  name: "HomeView",

  components: {
    SearchComponent,
  },
});
</script>

<template>
  <v-btn @click="$emit('apply')" variant="outlined" class="w-100 bg-primary">
    <slot />
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ButtonComponent",
});
</script>

<style></style>

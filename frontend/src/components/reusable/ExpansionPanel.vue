<template>
  <v-container class="my-2 border-bottom">
    <v-row @click="toggle" class="title">
      <p>{{ title }}</p>
      <v-spacer></v-spacer>
      <v-icon
        end
        :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      ></v-icon>
    </v-row>
    <slot v-if="isOpen" class="mt-2"></slot>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ExpansionPanel",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isOpen: true,
  }),
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
  },
});
</script>

<style lang="scss">
.title {
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: var(--hover-color);
  }
}
</style>

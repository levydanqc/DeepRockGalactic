<template>
  <v-card class="mx-auto">
    <div class="d-flex flex-no-wrap">
      <v-avatar class="p-0" size="300" rounded="0">
        <v-img class="w-100 h-100" cover :src="src"></v-img>
      </v-avatar>

      <div class="d-flex flex-column flex-fill">
        <v-card-title class="d-flex flex-column align-items-start pb-0">
          <small class="h3 mb-0 pb-0"> {{ title }}</small>
          <small class="h6 p-0 m-0 text-grey"> {{ expiration }}</small>
        </v-card-title>
        <v-divider class="mt-1 mb-0"></v-divider>
        <v-card-subtitle>
          <v-container class="d-flex flex-column ps-2 pt-1 p-0">
            <v-row class="my-1">
              <small class="h5"
                ><v-icon icon="mdi-cash-multiple" class="mx-1"></v-icon
                >{{ prime }}</small
              >
            </v-row>
            <v-row class="my-1">
              <small class="h5"
                ><v-icon icon="mdi-diamond-stone" class="mx-1"></v-icon
                >{{ ressource }}</small
              >
            </v-row>
            <v-row class="my-1">
              <small class="h5"
                ><v-icon icon="mdi-weight" class="mx-1"></v-icon
                >{{ qte }}</small
              >
            </v-row>
            <v-row class="my-1">
              <v-icon
                v-for="i in danger"
                :key="i"
                icon="mdi-alert-octagon"
                color="#b01708"
                class="mx-1"
                size="30"
              ></v-icon>
            </v-row>
          </v-container>
        </v-card-subtitle>
        <v-card-actions class="w-100">
          <v-spacer></v-spacer>
          <v-btn
            @click="reserver"
            rounded="lg"
            :prepend-icon="clicked ? 'mdi-note-check' : 'mdi-note-plus-outline'"
            color="deep-purple accent-4"
            class="align-self-end"
            :disabled="clicked"
          >
            <small v-if="!clicked" class="label">Réserver</small>
          </v-btn>
        </v-card-actions>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { reserverContrat } from "@/services/requests";
import moment from "moment";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContratCard",
  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    prime: {
      type: Number,
      required: true,
    },
    danger: {
      type: Number,
      required: true,
    },
    ressource: {
      type: String,
      required: true,
    },
    qte: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    clicked: false,
  }),
  computed: {
    expiration() {
      return moment(this.date).format("DD/MM/YYYY");
    },
  },
  methods: {
    reserver() {
      this.clicked = true;
      reserverContrat(this.id);
    },
  },
});
</script>

<style>
.v-icon {
  vertical-align: sub;
}
</style>

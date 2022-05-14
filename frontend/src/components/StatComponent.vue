<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <contrat-card
          class="my-3"
          v-for="contrat in contrats"
          :key="contrat._id"
          :id="contrat._id"
          :title="contrat.planeteNom"
          :src="contrat.planeteImage"
          :prime="contrat.prime"
          :danger="contrat.danger"
          :ressource="contrat.ressource"
          :qte="contrat.quantiteRessource"
          :date="contrat.dateExpiration"
        >
        </contrat-card>
      </v-col>
    </v-row>
    <h1>allo</h1>
    <h2>allo</h2>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getReservations, getContratByID } from "../services/requests";
import ContratCard from "./ContratCard.vue";

export default defineComponent({
  name: "SearchComponent",
  data: () => ({
    contrats: [] as any[],
    reservations: [],
    primeTotale: Number,
    mineurId: String,
  }),
  components: {
    ContratCard,
  },
  async created() {
    this.reservations = await getReservations();
    this.loadData();
  },
  methods: {
    async loadData() {
      for (let index = 0; index < this.reservations.length; index++) {
        this.contrats.push(
          getContratByID(this.reservations[index]["contratId"])
        );
        this.primeTotale += this.contrats[this.contrats.length - 1]["prime"];
      }
    },
  },
});
</script>

<template></template>

<script lang="ts">
import { defineComponent } from "vue";
import { getReservations, getContratByID } from "../services/requests";

export default defineComponent({
  name: "SearchComponent",
  data: () => ({
    contrats: [] as any[],
    reservations: [],
    primeTotale: Number,
    mineurId: String,
  }),
  async created() {
    this.reservations = await getReservations();
    this.loadData();
  },
  methods: {
    async loadData() {
      let token = localStorage.getItem("token");
      // TODO : set mineur id from token data
      for (let index = 0; index < this.reservations.length; index++) {
        if (
          this.reservations[index]["estTermine"] &&
          this.reservations[index]["mineurId"] == this.mineurId
        ) {
          this.contrats.push(
            getContratByID(this.reservations[index]["contratId"])
          );
          this.primeTotale += this.contrats[this.contrats.length - 1]["prime"];
        }
      }
    },
  },
});
</script>

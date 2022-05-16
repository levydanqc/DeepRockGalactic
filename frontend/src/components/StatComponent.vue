<template>
  <v-container>
    <v-row class="border-bottom">
      <v-col><h1>Vos contrats complétés</h1></v-col>
      <v-col
        ><h5 class="mt-3">
          Totale des primes:
          <v-icon class="mx-3" icon="mdi-cash-multiple"></v-icon
          >{{ primeTotale }}
        </h5></v-col
      >
    </v-row>
    <v-row
      ><h3 class="col mt-3">
        {{ contrats.length || 0 }} contrats trouvés
      </h3></v-row
    >
    <v-row>
      <v-card
        class="my-3 mx-1 bg-light"
        elevation="20"
        v-for="contrat in contrats"
        :key="contrat.id"
        :id="contrat.id"
      >
        <v-card-text>
          <h3>{{ contrat.nom }}</h3>
          <v-img
            height="225"
            :src="require(`@/assets/planets/${contrat.image}`)"
          >
          </v-img>
          <v-list class="bg-light">
            <v-list-item>
              <v-list-item-title class="text-success mr-5"
                ><strong>Prime</strong>
              </v-list-item-title>
              <v-list-item-icon
                icon="mdi-cash-multiple"
                class="mr-5"
              ></v-list-item-icon>
              <v-list-item-title>{{ contrat.prime }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-info mr-5"
                ><strong>Ressource</strong>
              </v-list-item-title>
              <v-list-item-icon
                icon="mdi-diamond-stone"
                class="mr-5"
              ></v-list-item-icon>
              <v-list-item-title>{{ contrat.ressource }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-warning mr-5"
                ><strong>Quantité</strong>
              </v-list-item-title>
              <v-list-item-icon
                icon="mdi-weight"
                class="mr-5"
              ></v-list-item-icon>
              <v-list-item-title>{{
                contrat.quantiteRessource
              }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-danger mr-5"
                ><strong>Danger</strong>
              </v-list-item-title>
              <v-list-item-icon
                v-for="i in contrat.danger"
                :key="i"
                icon="mdi-alert-octagon"
                color="#b01708"
                class="mr-1"
                size="30"
              ></v-list-item-icon>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getReservations, getContrat, getPlanete } from "../services/requests";

export default defineComponent({
  name: "SearchComponent",
  data: () => ({
    contrats: [] as any[],
    reservations: [] as Array<any>,
    primeTotale: 0,
    mineurId: String,
  }),
  async created() {
    this.reservations = await getReservations();
    this.loadContrats();
  },
  methods: {
    async loadContrats() {
      for (const reservation of this.reservations) {
        const contrat = await getContrat(
          reservation.relationships.contrat.links.related
        );
        this.primeTotale += contrat.attributes.prime;
        const planete = getPlanete(
          contrat.relationships.planete.links.related
        ) as any;
        contrat.attributes.image = planete.attributes.image;
        contrat.attributes.nom = planete.attributes.nom;
        this.contrats.push(contrat.attributes);
      }
    },
  },
});
</script>

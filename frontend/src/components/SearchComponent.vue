<template>
  <v-container>
    <v-row>
      <v-col cols="3" class="border-end">
        <expansion-panel title="Date d'échéance">
          <Datepicker
            class="w-100"
            v-model="dates"
            range
            :enableTimePicker="false"
            placeholder="Dates"
            @cleared="loadContrats()"
          />
        </expansion-panel>
        <expansion-panel title="Prime">
          <v-container>
            <v-row class="w-100">
              <v-text-field
                label="Min."
                v-model="minPrime"
                prepend-inner-icon="mdi-currency-usd"
                class="me-1"
                @keypress="isNumber($event, minPrime)"
              ></v-text-field>
              <v-text-field
                label="Max."
                v-model="maxPrime"
                prepend-inner-icon="mdi-currency-usd"
                @keypress="isNumber($event, maxPrime)"
              ></v-text-field>
            </v-row>
            <v-row class="w-100">
              <v-btn
                @click="loadContrats"
                variant="outlined"
                color="primary"
                class="w-100"
              >
                Appliquer
              </v-btn>
            </v-row>
          </v-container>
        </expansion-panel>
        <expansion-panel title="Planètes">
          <v-container>
            <v-row class="w-100">
              <v-combobox
                v-model="chips"
                :items="planetsNames"
                chips
                clearable
                label="Choix"
                multiple
                outlined
                hide-selected
                readonly
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :key="item"
                    :input-value="selected"
                    close
                    label
                    small
                    @click="select"
                    @click:close="remove(item)"
                  >
                    <strong>{{ item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
            </v-row>
            <v-row class="w-100">
              <v-btn
                @click="loadContrats"
                variant="outlined"
                color="primary"
                class="w-100"
              >
                Appliquer
              </v-btn>
            </v-row>
          </v-container>
        </expansion-panel>
        <expansion-panel title="Danger">
          <v-row>
            <v-checkbox
              v-for="i in 5"
              :key="i"
              :value="i"
              :label="i.toString()"
              :false-icon="'mdi-alert-octagon-outline'"
              color="red"
              :true-icon="'mdi-alert-octagon'"
              v-model="dangers"
              :checked="dangers.includes(i)"
            >
            </v-checkbox>
          </v-row>
        </expansion-panel>
      </v-col>

      <v-col cols="7" class="mx-auto">
        <p class="h4 text-start">{{ contrats.length }} contrats trouvés</p>
        <v-divider></v-divider>
        <contrat-card
          class="my-3"
          v-for="contrat in contrats"
          :key="contrat._id"
          :title="contrat.planeteNom"
          :src="contrat.planeteImage"
          :prime="contrat.prime"
          :danger="contrat.danger"
          :ressource="contrat.ressource"
          :qte="contrat.quantiteRessource"
          :date="contrat.dateExpiration"
        ></contrat-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ExpansionPanel from "./ExpansionPanel.vue";
import ContratCard from "./ContratCard.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { getPlanetes, getContrats } from "../services/requests";

export default defineComponent({
  name: "SearchComponent",
  data: () => ({
    contrats: [] as any[],
    minPrime: "",
    maxPrime: "",
    dates: [],
    dangers: [],
    chips: [],
    planets: [],
  }),
  computed: {
    planetsNames() {
      return this.planets.map((planet: any) => planet.nom);
    },
    planetsIds(): string[] {
      const planets = this.chips.map((c: any) =>
        this.planets?.find((obj: any) => {
          return obj?.nom === c;
        })
      );
      return planets?.map((p) => p?.["_id"]) as unknown as string[];
    },
  },
  async created() {
    this.loadContrats();
    this.planets = await getPlanetes();
  },
  components: {
    ExpansionPanel,
    Datepicker,
    ContratCard,
  },
  watch: {
    dates() {
      this.loadContrats();
    },
    dangers() {
      this.loadContrats();
    },
  },
  methods: {
    async loadContrats() {
      this.contrats = await getContrats(
        this.dates && this.dates.length
          ? new Date(this.dates[0]).toISOString()
          : undefined,
        this.dates && this.dates.length
          ? new Date(this.dates[1]).toISOString()
          : undefined,
        this.minPrime,
        this.maxPrime,
        this.dangers,
        this.planetsIds
      );
    },
    isNumber(event: KeyboardEvent, value: string) {
      const charCode = event.which ? event.which : event.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        (charCode !== 46 || value.indexOf(".") !== -1)
      ) {
        event.preventDefault();
        return false;
      }
      return true;
    },
    remove(item: any) {
      this.chips.splice(this.chips.indexOf(item as never), 1);
      this.chips = [...this.chips];
    },
  },
});
</script>
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
          />
        </expansion-panel>
        <expansion-panel title="Prime">
          <v-container>
            <v-row>
              <v-text-field
                label="Min."
                v-model="startPrime"
                prepend-inner-icon="mdi-currency-usd"
                class="me-1"
                @keypress="isNumber($event, startPrime)"
              ></v-text-field>
              <v-text-field
                label="Max."
                v-model="endPrime"
                prepend-inner-icon="mdi-currency-usd"
                @keypress="isNumber($event, endPrime)"
              ></v-text-field>
            </v-row>
            <v-row>
              <v-btn>Appliquer</v-btn>
            </v-row>
          </v-container>
        </expansion-panel>
        <expansion-panel title="Planètes">
          <v-combobox
            v-model="chips"
            :items="planets"
            chips
            clearable
            label="Choix"
            multiple
            solo
            readonly
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                @click="select"
                @click:close="remove(item)"
              >
                <strong>{{ item }}</strong
                >&nbsp;
                <span>(interest)</span>
              </v-chip>
            </template>
          </v-combobox>
        </expansion-panel>
        <expansion-panel title="Danger">
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
        </expansion-panel>
      </v-col>

      <v-col v-if="contrats.length" cols="7" class="mx-auto">
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
    startPrime: "",
    endPrime: "",
    dates: [],
    dangers: [],
    chips: [],
    planets: [],
  }),
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
    dangers(newValue: number[]) {
      this.loadContrats();
    },
    chips(newValue: string[]) {
      this.loadContrats();
    },
  },
  methods: {
    async loadContrats() {
      this.contrats = await getContrats();
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

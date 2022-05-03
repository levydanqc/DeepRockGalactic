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
          <v-text-field
            label="Min."
            v-model="startPrime"
            prepend-inner-icon="mdi-currency-usd"
            class="me-1"
            @keypress="isNumber($event, this.startPrime)"
          ></v-text-field>
          <v-text-field
            label="Max."
            v-model="endPrime"
            prepend-inner-icon="mdi-currency-usd"
            @keypress="isNumber($event, this.endPrime)"
          ></v-text-field>
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

      <v-col cols="7" class="mx-auto">
        <contrat-card></contrat-card>
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
    contrats: [],
    startPrime: null,
    endPrime: null,
    dates: [],
    dangers: [],
    chips: [],
    planets: [
      "Mercure",
      "Venus",
      "Terre",
      "Mars",
      "Jupiter",
      "Saturne",
      "Uranus",
      "Neptune",
    ],
  }),
  async created() {
    this.contrats = await getContrats();
    this.planets = await getPlanetes();
  },
  components: {
    ExpansionPanel,
    Datepicker,
    ContratCard,
  },
  computed: {
    filteredDates() {
      return this.dates.join(" ~ ");
    },
  },
  methods: {
    isNumber(event: KeyboardEvent, value: string) {
      const charCode = event.which ? event.which : event.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        (charCode !== 46 || value.indexOf(".") !== -1)
      ) {
        console.log(value);
        event.preventDefault();
        return false;
      }
      return true;
    },
  },
});
</script>

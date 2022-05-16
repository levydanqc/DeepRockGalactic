// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const lightTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    primary: "#ac4f06",
    secondary: "#ffbc00",
    info: "#0081ff",
    warning: "#ff8e00",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "lightTheme",
    themes: {
      lightTheme,
    },
  },
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

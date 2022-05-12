// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const lightTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    primary: "#6200EE",
    secondary: "#42b983",
    info: "#EDBA0C",
    warning: "#FB8C00",
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

import "./styles/quasar.sass";
import iconSet from "@quasar/extras/material-icons/material-icons.css";
import { Notify } from "quasar";

// To be used on app.use(Quasar, { ... })
export default {
  config: {
    iconSet: iconSet,
    dark: "auto",
  },
  plugins: {
    Notify,
  },
};

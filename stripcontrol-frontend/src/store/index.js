import { createStore, createLogger } from "vuex";
import colorProfileStore from "./profile-store";
import ledStripStore from "./strip-store";

export const store = createStore({
  modules: {
    profileStore: colorProfileStore,
    stripStore: ledStripStore,
  },
  plugins: [createLogger()],
});

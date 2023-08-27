import { reactive } from "@vue/reactivity";
import { StoreStrip } from "@/models/storestrip";

export default {
  state: {
    backendStrips: [],
    selectedStrip: new StoreStrip("", "", 0, 0, 30, 8000000),
  },
  mutations: {
    /** update the backend strips */
    updateBackendStrips(state, loadedLedStrips) {
      state.backendStrips = loadedLedStrips.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    },
    /** update the LED strip, expects an object containing a field with type and a field with name object
     * containing the object */
    updateLedStrip(state, obj) {
      state[obj.type] = obj.object;
    },
    updateLedStripForProfile(state, stripEvent) {
      if (stripEvent === "undefined" || stripEvent.stripId === "undefined") {
        return;
      }
      let objIdx = state.backendStrips.findIndex(
        (obj) => obj.id === stripEvent.stripId
      );
      if (objIdx >= 0) {
        state.backendStrips[objIdx].hasProfile =
          stripEvent.profile !== "undefined";
        state.backendStrips[objIdx].profileId = stripEvent.profile.id;
      }
    },
    /** resets the led strip to 0 values, without id, expects an object containing a type field */
    resetLedStrip(state, obj) {
      state[obj.type] = reactive(new StoreStrip("", "", 0, 0, 30, 8000000));
    },
    updateLedStripInBackendList(state, updatedEntry) {
      if (updatedEntry === "undefined" || updatedEntry.id === "undefined") {
        return;
      }
      let objIdx = state.backendStrips.findIndex(
        (obj) => obj.id === updatedEntry.id
      );
      if (objIdx < 0) {
        state.backendStrips.push(updatedEntry);
      } else {
        state.backendStrips[objIdx] = updatedEntry;
      }
    },
    removeLedStripInBackendList(state, removedEntry) {
      if (removedEntry === "undefined" || removedEntry.id === "undefined") {
        return;
      }
      let objIdx = state.backendStrips.findIndex(
        (obj) => obj.id === removedEntry.id
      );
      if (objIdx >= 0) {
        state.backendStrips.splice(objIdx, 1);
      }
    },
  },
  getters: {
    backendStrips: (state) => state.backendStrips,
    selectedStrip: (state) => state.selectedStrip,
    findLedStrip: (state) => (formName) => {
      return state[formName];
    },
  },
};

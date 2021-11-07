import { reactive } from "@vue/reactivity";

export default {
  state: {
    backendStrips: [],
    editableStrip: {
      name: "",
      description: "",
      misoPin: 0,
      numLeds: 30,
      sclkPin: 0,
      speedHz: 8000000,
    },
    selectedStrip: {},
  },
  mutations: {
    /** update the backend strips */
    updateBackendStrips(state, loadedLedStrips) {
      state.backendStrips = loadedLedStrips;
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
      var objIdx = state.backendStrips.findIndex(
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
      state[obj.type] = reactive({
        name: "",
        description: "",
        misoPin: 0,
        numLeds: 30,
        sclkPin: 0,
        speedHz: 8000000,
      });
    },
    updateLedStripInBackendList(state, updatedEntry) {
      if (updatedEntry === "undefined" || updatedEntry.id === "undefined") {
        return;
      }
      var objIdx = state.backendStrips.findIndex(
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
      var objIdx = state.backendStrips.findIndex(
        (obj) => obj.id === removedEntry.id
      );
      if (objIdx >= 0) {
        state.backendStrips.splice(objIdx, 1);
      }
    },
  },
  getters: {
    backendStrips: (state) => state.backendStrips,
    editableStrip: (state) => state.editableStrip,
    selectedStrip: (state) => state.selectedStrip,
    findLedStrip: (state) => (formName) => {
      return state[formName];
    },
  },
};

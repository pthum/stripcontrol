import { StoreProfile } from "@/models/storeprofile";

export default {
  state: {
    backendProfiles: [],
    editableProfile: new StoreProfile(255, 255, 255, 0),
    selectedProfile: new StoreProfile(255, 255, 255, 0),
  },
  mutations: {
    /** update the backend profiles */
    updateBackendProfiles(state, loadedBackendProfiles) {
      state.backendProfiles = loadedBackendProfiles;
    },
    /** update the color profile, expects an object containing a field with type and a field with name object
     * containing the object */
    updateColorProfile(state, obj) {
      state[obj.type] = obj.object;
    },
    /** resets the color profile to 0 values, without id, expects an object containing a type field */
    resetColorProfile(state, obj) {
      state[obj.type] = new StoreProfile(255, 255, 255, 0);
    },
    updateColorProfileInBackendList(state, updatedEntry) {
      if (updatedEntry === "undefined" || updatedEntry.id === "undefined") {
        return;
      }
      var objIdx = state.backendProfiles.findIndex(
        (obj) => obj.id === updatedEntry.id
      );
      if (objIdx < 0) {
        state.backendProfiles.push(updatedEntry);
      } else {
        state.backendProfiles[objIdx] = updatedEntry;
      }
    },
    removeColorProfileInBackendList(state, removedEntry) {
      if (removedEntry === "undefined" || removedEntry.id === "undefined") {
        return;
      }
      var objIdx = state.backendProfiles.findIndex(
        (obj) => obj.id === removedEntry.id
      );
      if (objIdx >= 0) {
        state.backendProfiles.splice(objIdx, 1);
      }
    },
  },
  getters: {
    backendProfiles: (state) => state.backendProfiles,
    editableProfile: (state) => state.editableProfile,
    selectedProfile: (state) => state.selectedProfile,
    findColorProfile: (state) => (formName) => {
      return state[formName];
    },
    getColorProfileById: (state) => (id) => {
      return state.backendProfiles.find((profile) => profile.id === id);
    },
  },
};

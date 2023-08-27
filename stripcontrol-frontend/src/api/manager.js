import api from "./backend";
import EventBus from "@/utils/eventbus";
import { EventType } from "@/utils/constant-config";
import { store } from "@/store";

export default {
  /** create an entry */
  createLedStrip(obj) {
    api
      .postLedStrip(obj)
      .then((response) => {
        let resUrlArray = response.headers.location.split("/");
        let createdId = resUrlArray[resUrlArray.length - 1];
        obj.id = Number(createdId);
        this.handleSuccess({
          action: EventType.LS_CREATE,
          text: `Successfully created led strip with id ${createdId}`,
          object: obj,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  },
  /** update an entry */
  updateLedStrip(obj) {
    api
      .putLedStrip(obj)
      .then(() => {
        this.handleSuccess({
          action: EventType.LS_UPDATE,
          text: `Successfully updated led strip ${obj.name}`,
          object: obj,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  },
  /** delete an entry */
  deleteLedStrip(obj) {
    api
      .deleteLedStrip(obj)
      .then(() => {
        this.handleSuccess({
          action: EventType.LS_DELETE,
          text: `Deleted led strip ${obj.name}`,
          object: obj,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  },
  callGetLedStrips() {
    api
      .getLedStrips()
      .then((response) => {
        store.commit("updateBackendStrips", response.data);
        this.handleSuccess({
          action: EventType.LS_GETALL,
          text: "Successfully got all led strips",
          object: response.data,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  },
  updateStripProfile(obj) {
    api
      .updateStripProfile(obj)
      .then(() => {
        store.commit("updateLedStripForProfile", obj);
      })
      .catch((error) => {
        this.handleError(error);
      });
  },
  /** Fetches profiles when the component is created. */
  callGetColorProfiles() {
    api
      .getColorProfiles()
      .then((response) => {
        store.commit("updateBackendProfiles", response.data);
        this.handleSuccess({
          action: EventType.LS_GETALL,
          text: "Successfully got all color profiles",
          object: response.data,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  },
  createColorProfile(obj) {
    api
      .postColorProfile(obj)
      .then((response) => {
        let resUrlArray = response.headers.location.split("/");
        let createdId = resUrlArray[resUrlArray.length - 1];
        obj.id = Number(createdId);
        this.handleSuccess({
          action: EventType.CP_CREATE,
          text: `Successfully created color profile with id ${createdId}`,
          object: obj,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  },
  /** update an entry */
  updateColorProfile(obj) {
    api
      .putColorProfile(obj)
      .then(() => {
        this.handleSuccess({
          action: EventType.CP_UPDATE,
          text: `Successfully updated color profile with id ${obj.id}`,
          object: obj,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  },
  /** delete an entry */
  deleteColorProfile(obj) {
    api
      .deleteColorProfile(obj)
      .then(() => {
        this.handleSuccess({
          action: EventType.CP_DELETE,
          text: `Deleted color profile with id ${obj.id}`,
          object: obj,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  },
  /** handle success message, expects object with text field and optionally an object field */
  handleSuccess(event) {
    EventBus.$emit(event.action, {
      type: "positive",
      message: event.text,
      object: event.object,
      position: "top-right",
    });
  },
  /** handle error message */
  handleError(error) {
    EventBus.makeToast({
      type: "negative",
      message: error.message,
      position: "top-right",
    });
    throw error;
  },
};

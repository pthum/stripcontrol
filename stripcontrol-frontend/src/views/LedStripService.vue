<template>
  <div class="ledStripService">
    <div class="q-pa-md">
      <div class="row">
        <div class="col centered">
          <q-btn-group>
            <ledstripselect :addNew="true" />
            <remove-modal
              :removalText="`Really Remove LED Strip  ${storeSelectedStrip.name} ?`"
              :deleteEntryFn="deleteEntry"
              :isBtnActive="storeSelectedStrip.id"
            />
            <q-btn
              @click="submitStripForm()"
              align="right"
              :color="storeSelectedStrip.id ? 'secondary' : 'primary'"
              :icon="storeSelectedStrip.id ? 'edit' : 'add'"
              size="lg"
              flat
              :disabled="!isFormValid"
            ></q-btn>
          </q-btn-group>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <ledstripform
            ref="stripformcomponent"
            formStripName="selectedStrip"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiManager from "@/api/manager";
import ledstripform from "@/components/ledstrip/form";
import ledstripselect from "@/components/ledstrip/select";
import EventBus from "@/utils/eventbus";
import { EventType } from "@/utils/constant-config";
import { mapMutations, mapGetters } from "vuex";
import RemoveModal from "@/components/removeModal";

export default {
  name: "led-strip-service",
  components: {
    ledstripform,
    ledstripselect,
    RemoveModal,
  },
  created() {
    this.callGetLedStrips();
    this.toggle(true);
  },
  data() {
    return {
      // isFormValid: false,
    };
  },
  computed: {
    selected: {
      get() {
        return this.storeSelectedStrip;
      },
      set(value) {
        this.updateStoreStrip({ type: "selectedStrip", object: value });
        this.toggle(false);
      },
    },
    isFormValid() {
      return this.$refs?.stripformcomponent?.$computed?.writable;
    },
    ...mapGetters({
      storeSelectedStrip: "selectedStrip",
    }),
  },
  methods: {
    submitStripForm() {
      this.$refs.stripformcomponent.$refs.stripcreateform.submit();
    },
    /** Fetches strips when the component is created. */
    callGetLedStrips() {
      ApiManager.callGetLedStrips(this);
    },
    toggle(isCreate) {
      if (isCreate) {
        this.resetStoreStrip({ type: "selectedStrip" });
      } else {
        this.updateStoreStrip({
          type: "selectedStrip",
          object: this.storeSelectedStrip,
        });
      }
    },
    /** delete an entry */
    deleteEntry() {
      let obj = {
        id: this.storeSelectedStrip.id,
        name: this.storeSelectedStrip.name,
      };
      ApiManager.deleteLedStrip(this, obj);
    },
    /** set the created object as selected strip, update the led strips, inform user  */
    handleLSSave(event) {
      this.updateStoreStrip({ type: "selectedStrip", object: event.object });
      this.toggle(false);
      this.updateLedStripInBackendList(event.object);
      EventBus.makeToast(this, event);
    },
    /** reset the selected strip, update the led strips, inform user */
    handleLSDelete(event) {
      this.resetStoreStrip({ type: "selectedStrip" });
      this.removeLedStripInBackendList(event.object);
      this.toggle(true);
      EventBus.makeToast(this, event);
    },
    handleLSSelect(event) {
      if (typeof event.object === "undefined") {
        this.toggle(true);
        this.resetStoreStrip({ type: "selectedStrip" });
      } else {
        this.updateStoreStrip({ type: "selectedStrip", object: event.object });
        this.toggle(false);
      }
    },
    handleLSGetAll() {},
    ...mapMutations({
      updateStoreStrip: "updateLedStrip",
      resetStoreStrip: "resetLedStrip",
      updateLedStripInBackendList: "updateLedStripInBackendList",
      removeLedStripInBackendList: "removeLedStripInBackendList",
    }),
  },
  mounted() {
    EventBus.$on(EventType.LS_CREATE, this.handleLSSave);
    EventBus.$on(EventType.LS_UPDATE, this.handleLSSave);
    EventBus.$on(EventType.LS_DELETE, this.handleLSDelete);
    EventBus.$on(EventType.LS_SELECT, this.handleLSSelect);
    EventBus.$on(EventType.LS_GETALL, this.handleLSGetAll);
  },
  beforeUnmount() {
    EventBus.$off(EventType.LS_CREATE, this.handleLSSave);
    EventBus.$off(EventType.LS_UPDATE, this.handleLSSave);
    EventBus.$off(EventType.LS_DELETE, this.handleLSDelete);
    EventBus.$off(EventType.LS_SELECT, this.handleLSSelect);
    EventBus.$off(EventType.LS_GETALL, this.handleLSGetAll);
  },
};
</script>

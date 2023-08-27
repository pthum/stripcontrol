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
              :isBtnActive="typeof storeSelectedStrip.id !== 'undefined'"
            />
            <q-btn
              @click="submitStripForm()"
              align="right"
              :color="fValid ? 'secondary' : 'primary'"
              :icon="storeSelectedStrip.id ? 'edit' : 'add'"
              size="lg"
              flat
              :disabled="!fValid"
            ></q-btn>
          </q-btn-group>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <ledstripform
            ref="stripformcomponent"
            formStripName="selectedStrip"
            :formValid="fValid"
            @update:formValid="(newValue) => (fValid = newValue)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ApiManager from "@/api/manager";
import ledstripform from "@/components/ledstrip/form";
import ledstripselect from "@/components/ledstrip/select";
import RemoveModal from "@/components/removeModal";
import EventBus from "@/utils/eventbus";
import { EventType } from "@/utils/constant-config";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";

const store = useStore();
const fValid = ref(false);
const storeSelectedStrip = computed(() => store.getters.selectedStrip);
const stripformcomponent = ref(null);
function submitStripForm() {
  stripformcomponent.value.stripcreateform.submit();
}
/** Fetches strips when the component is created. */
function callGetLedStrips() {
  ApiManager.callGetLedStrips(this);
}
function toggle(isCreate) {
  if (isCreate) {
    resetStoreStrip();
  } else {
    updateStoreStrip(storeSelectedStrip.value);
  }
}
/** delete an entry */
function deleteEntry() {
  let obj = {
    id: storeSelectedStrip.value.id,
    name: storeSelectedStrip.value.name,
  };
  ApiManager.deleteLedStrip(this, obj);
}
/** set the created object as selected strip, update the led strips, inform user  */
function handleLSSave(event) {
  updateStoreStrip(event.object);
  toggle(false);
  updateLedStripInBackendList(event.object);
  EventBus.makeToast(this, event);
}
/** reset the selected strip, update the led strips, inform user */
function handleLSDelete(event) {
  resetStoreStrip();
  removeLedStripInBackendList(event.object);
  toggle(true);
  EventBus.makeToast(this, event);
}
function handleLSSelect(event) {
  if (typeof event.object === "undefined") {
    toggle(true);
    resetStoreStrip();
  } else {
    updateStoreStrip(event.object);
    toggle(false);
  }
}
function handleLSGetAll() {}

function updateStoreStrip(obj) {
  let o = { type: "selectedStrip", object: obj };
  store.commit("updateLedStrip", o);
}
function resetStoreStrip() {
  store.commit("resetLedStrip", { type: "selectedStrip" });
}
function updateLedStripInBackendList(o) {
  store.commit("updateLedStripInBackendList", o);
}
function removeLedStripInBackendList(o) {
  store.commit("removeLedStripInBackendList", o);
}

onMounted(() => {
  EventBus.$on(EventType.LS_CREATE, handleLSSave);
  EventBus.$on(EventType.LS_UPDATE, handleLSSave);
  EventBus.$on(EventType.LS_DELETE, handleLSDelete);
  EventBus.$on(EventType.LS_SELECT, handleLSSelect);
  EventBus.$on(EventType.LS_GETALL, handleLSGetAll);
});
onBeforeUnmount(() => {
  EventBus.$off(EventType.LS_CREATE, handleLSSave);
  EventBus.$off(EventType.LS_UPDATE, handleLSSave);
  EventBus.$off(EventType.LS_DELETE, handleLSDelete);
  EventBus.$off(EventType.LS_SELECT, handleLSSelect);
  EventBus.$off(EventType.LS_GETALL, handleLSGetAll);
});

callGetLedStrips();
toggle(true);
</script>

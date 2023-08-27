<template>
  <div class="led-strip">
    <div class="q-pa-md">
      <q-form @submit="saveEntry" class="q-gutter-md" ref="stripcreateform">
        <div class="row">
          <div class="col col-sm=9">
            <q-input
              id="nameValue"
              type="text"
              aria-describedby="input-name-required-feedback"
              :rules="[(val) => textValid(val) || 'Required']"
              v-model="currentStrip.name"
              label="Name"
            />
          </div>
        </div>
        <div class="row">
          <div class="col col-sm=9">
            <q-input
              id="descriptionValue"
              type="text"
              v-model="currentStrip.description"
              label="Description"
            />
          </div>
        </div>
        <div class="row">
          <div class="col col-sm=9">
            <q-input
              id="misoPinValue"
              type="number"
              v-model.number="currentStrip.misoPin"
              label="MISO Pin"
              :rules="[(currentPin) => pinValid(currentPin) || 'Invalid Pin']"
            >
              <template #append>
                <q-icon name="info" @click="pinout = true" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row">
          <div class="col col-sm=9">
            <q-input
              id="sclkPinValue"
              type="number"
              v-model.number="currentStrip.sclkPin"
              label="SCLK Pin"
              :rules="[(currentPin) => pinValid(currentPin) || 'Invalid Pin']"
            >
              <template #append>
                <q-icon name="info" @click="pinout = true" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row">
          <div class="col col-sm=9">
            <q-input
              id="numLedValue"
              type="number"
              v-model.number="currentStrip.numLeds"
              label="# LEDs"
              :rules="[(val) => ledsValid(val) || 'Minimum one LED necessary']"
            />
          </div>
        </div>
        <div class="row">
          <div class="col col-sm=9">
            <q-input
              id="speedValue"
              type="number"
              v-model.number="currentStrip.speedHz"
              label="Speed (Hz)"
            />
          </div>
        </div>
      </q-form>
    </div>

    <q-dialog v-model="pinout" title="Pinout">
      <q-card>
        <q-card-section class="q-pt-none">
          <q-img
            src="https://pinout.xyz/resources/raspberry-pi-pinout.png"
            alt="Responsive image"
            style="width: 400px; height: 200px"
            fit="fill"
          />
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="OK" color="secondary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import ApiManager from "@/api/manager";
import { StoreStrip } from "@/models/storestrip";
import { useStore } from "vuex";
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  defineExpose,
  watch,
} from "vue";
const emit = defineEmits(["update:formValid"]);
defineProps({
  formValid: Boolean,
});
const stripcreateform = ref(null);
defineExpose({
  stripcreateform,
});
const store = useStore();
const pinout = ref(false);
const storeSelectedStrip = computed(() => store.getters.selectedStrip);
const currentStrip = computed({
  get() {
    return storeSelectedStrip.value;
  },
  set(value) {
    store.commit("updateLedStrip", { type: "selectedStrip", object: value });
  },
});
function saveEntry() {
  let obj = new StoreStrip(
    currentStrip.value.name,
    currentStrip.value.description,
    currentStrip.value.misoPin,
    currentStrip.value.sclkPin,
    currentStrip.value.numLeds,
    currentStrip.value.speedHz,
    currentStrip.value.id
  );
  if (typeof currentStrip.value.id !== "undefined") {
    ApiManager.updateLedStrip(obj);
  } else {
    ApiManager.createLedStrip(obj);
  }
}

watch(
  currentStrip,
  (newVal, oldVal) => {
    console.log("selected strip mutated");
    let res =
      textValid(newVal.name) &&
      pinValid(newVal.misoPin) &&
      pinValid(newVal.sclkPin) &&
      ledsValid(newVal.numLeds);
    emit("update:formValid", res);
  },
  { deep: true }
);

function textValid(value) {
  return value.length > 0 ? true : false;
}
function pinValid(pin) {
  let currentPin = parseInt(pin, 10);
  return currentPin >= 0 && currentPin <= 27 ? true : false;
}
function ledsValid(leds) {
  return parseInt(leds, 10) > 0 ? true : false;
}
</script>
<script>
export default {
  name: "ledstrip-form",
};
</script>

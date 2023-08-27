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

<script>
import ApiManager from "@/api/manager";
import { mapGetters } from "vuex";
import { StoreStrip } from "@/models/storestrip";

export default {
  name: "ledstrip-form",
  props: ["formStripName"],
  components: {},
  data() {
    return {
      pinout: false,
    };
  },
  computed: {
    currentStrip: {
      get() {
        return this.storeSelectedStrip;
      },
      set(value) {
        this.updateStoreStrip({ type: "selectedStrip", object: value });
        this.toggle(false);
      },
    },
    /* indicates, whether the form can be submitted (create or update) */
    writable() {
      let res =
        this.textValid(this.currentStrip.name) &&
        this.pinValid(this.currentStrip.misoPin) &&
        this.pinValid(this.currentStrip.sclkPin) &&
        this.ledsValid(this.currentStrip.numLeds);
      return res;
    },
    ...mapGetters({
      storeSelectedStrip: "selectedStrip",
    }),
  },
  methods: {
    /** save an entry, will do an update if id is set, create otherwise */
    saveEntry() {
      let obj = new StoreStrip(
        this.currentStrip.name,
        this.currentStrip.description,
        this.currentStrip.misoPin,
        this.currentStrip.sclkPin,
        this.currentStrip.numLeds,
        this.currentStrip.speedHz,
        this.currentStrip.id
      );
      if (typeof this.currentStrip.id !== "undefined") {
        ApiManager.updateLedStrip(this, obj);
      } else {
        ApiManager.createLedStrip(this, obj);
      }
    },
    textValid(value) {
      return value.length > 0 ? true : false;
    },
    pinValid(pin) {
      let currentPin = parseInt(pin, 10);
      return currentPin >= 0 && currentPin <= 27 ? true : false;
    },
    ledsValid(leds) {
      return parseInt(leds, 10) > 0 ? true : false;
    },
  },
};
</script>

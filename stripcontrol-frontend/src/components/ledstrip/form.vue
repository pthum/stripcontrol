<template>
  <div class="led-strip">
    <h4 class="centered" v-if="typeof currentStrip.id !== 'undefined'">
      Edit &quot;{{ currentStrip.name }}&quot;({{ currentStrip.id }})
      <remove-modal
        :removalText="`Really Remove LED Strip  ${currentStrip.name} ?`"
        :deleteEntry="deleteEntry"
      />
    </h4>
    <h4 class="centered" v-else>Create LED Strip</h4>
    <div class="q-pa-md">
      <q-form @submit="saveEntry" class="q-gutter-md">
        <div class="row">
          <div class="col col-sm=9">
            <q-input
              outlined
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
              outlined
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
              outlined
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
              outlined
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
              outlined
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
              outlined
              id="speedValue"
              type="number"
              v-model.number="currentStrip.speedHz"
              label="Speed (Hz)"
            />
          </div>
        </div>
        <div class="row">
          <div class="col centered">
            <div>
              <q-btn
                color="positive"
                type="submit"
                v-if="typeof currentStrip.id !== 'undefined'"
                icon="edit"
                :disable="writable === false"
                >Edit &quot;{{ currentStrip.name }}&quot;
              </q-btn>
              <q-btn
                color="positive"
                :disable="writable === false"
                icon="add-box"
                type="submit"
                v-else
              >
                Create
              </q-btn>
            </div>
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
          <q-btn flat label="OK" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ApiManager from "@/api/manager";
import { mapGetters } from "vuex";
import RemoveModal from "@/components/removeModal";
import { StoreStrip } from "@/models/storestrip";

export default {
  name: "ledstrip-form",
  props: ["formStripName"],
  components: {
    RemoveModal,
  },
  data() {
    return {
      pinout: false,
    };
  },
  computed: {
    currentStrip() {
      return this.findLedStrip(this.formStripName);
    },
    /* indicates, whether the form can be submitted (create or update) */
    writable() {
      return (
        this.textValid(this.currentStrip.name) &&
        this.pinValid(this.currentStrip.misoPin) &&
        this.pinValid(this.currentStrip.sclkPin) &&
        this.ledsValid(this.currentStrip.numLeds)
      );
    },
    ...mapGetters(["findLedStrip"]),
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
    /** delete an entry */
    deleteEntry() {
      let obj = { id: this.currentStrip.id, name: this.currentStrip.name };
      ApiManager.deleteLedStrip(this, obj);
    },
  },
};
</script>

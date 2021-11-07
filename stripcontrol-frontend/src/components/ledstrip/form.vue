<template>
  <div class="led-strip">
    <h4 v-if="typeof id !== 'undefined'" align="center">
      Edit &quot;{{ name }}&quot;({{ id }})
      <remove-modal
        :removalText="`Really Remove LED Strip  ${name} ?`"
        :deleteEntry="deleteEntry"
      />
    </h4>
    <h4 align="center" v-else>Create LED Strip</h4>
    <div class="q-pa-md">
      <q-form @submit="saveEntry" class="q-gutter-md">
        <div class="row">
          <div class="col col-sm=9">
            <q-input
              outlined
              id="nameValue"
              type="text"
              aria-describedby="input-name-required-feedback"
              :rules="[(val) => val.length > 0 || 'Required']"
              v-model="name"
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
              v-model="description"
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
              v-model="misoPin"
              label="MISO Pin"
              :rules="[
                (currentPin) =>
                  (currentPin >= 0 && currentPin <= 27) || 'Invalid Pin',
              ]"
            >
              <template v-slot:append>
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
              v-model="sclkPin"
              label="SCLK Pin"
              :rules="[
                (currentPin) =>
                  (currentPin >= 0 && currentPin <= 27) || 'Invalid Pin',
              ]"
            >
              <template v-slot:append>
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
              v-model="numLeds"
              label="# LEDs"
              :rules="[(val) => val > 0 || 'Minimum one LED necessary']"
            />
          </div>
        </div>
        <div class="row">
          <div class="col col-sm=9">
            <q-input
              outlined
              id="speedValue"
              type="number"
              v-model="speedHz"
              label="Speed (Hz)"
            />
          </div>
        </div>
        <div class="row">
          <div class="col" align="center">
            <div>
              <q-btn
                color="positive"
                type="submit"
                v-if="typeof id !== 'undefined'"
                icon="edit"
                :disable="writable === false"
                >Edit &quot;{{ name }}&quot;
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
        <q-card-actions align="right">
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
    name: {
      get() {
        return this.findLedStrip(this.formStripName).name;
      },
      set(value) {
        this.findLedStrip(this.formStripName).name = value;
      },
    },
    description: {
      get() {
        return this.findLedStrip(this.formStripName).description;
      },
      set(value) {
        this.findLedStrip(this.formStripName).description = value;
      },
    },
    /* indicates, whether the name input field is valid */
    nameState() {
      return this.findLedStrip(this.formStripName).name.length > 0
        ? null
        : false;
    },
    misoValid() {
      var currentPin = this.findLedStrip(this.formStripName).misoPin;
      currentPin = parseInt(currentPin, 10);
      return currentPin >= 0 && currentPin <= 27 ? null : false;
    },
    sclkValid() {
      var currentPin = this.findLedStrip(this.formStripName).sclkPin;
      currentPin = parseInt(currentPin, 10);
      return currentPin >= 0 && currentPin <= 27 ? null : false;
    },
    numLedsValid() {
      return parseInt(this.findLedStrip(this.formStripName).numLeds, 10) > 0
        ? null
        : false;
    },
    /* indicates, whether the form can be submitted (create or update) */
    writable() {
      return this.nameState && this.misoValid && this.sclkValid;
    },

    misoPin: {
      get() {
        return this.findLedStrip(this.formStripName).misoPin;
      },
      set(value) {
        this.findLedStrip(this.formStripName).misoPin = value;
      },
    },
    numLeds: {
      get() {
        return this.findLedStrip(this.formStripName).numLeds;
      },
      set(value) {
        this.findLedStrip(this.formStripName).numLeds = value;
      },
    },
    sclkPin: {
      get() {
        return this.findLedStrip(this.formStripName).sclkPin;
      },
      set(value) {
        this.findLedStrip(this.formStripName).sclkPin = value;
      },
    },
    speedHz: {
      get() {
        return this.findLedStrip(this.formStripName).speedHz;
      },
      set(value) {
        this.findLedStrip(this.formStripName).speedHz = value;
      },
    },
    id() {
      return this.findLedStrip(this.formStripName).id;
    },
    ...mapGetters(["findLedStrip"]),
  },
  methods: {
    /** save an entry, will do an update if id is set, create otherwise */
    saveEntry() {
      var obj = {
        name: this.name,
        description: this.description,
        misoPin: this.misoPin,
        sclkPin: this.sclkPin,
        numLeds: this.numLeds,
        speedHz: this.speedHz,
        id: this.id,
      };
      if (typeof this.id !== "undefined") {
        ApiManager.updateLedStrip(this, obj);
      } else {
        ApiManager.createLedStrip(this, obj);
      }
    },
    /** delete an entry */
    deleteEntry() {
      var obj = { id: this.id, name: this.name };
      ApiManager.deleteLedStrip(this, obj);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

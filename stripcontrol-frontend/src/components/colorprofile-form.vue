<template>
  <div class="color-profile">
    <p></p>
    <h4 v-if="typeof id !== 'undefined'">Edit Profile {{ id }}</h4>
    <h4 v-else>Create ColorProfile</h4>
    <div class="q-pa-md">
      <q-form class="q-gutter-md" @submit="saveEntry">
        <div class="row">
          <div class="col col">
            <q-item>
              <q-item-section avatar>
                <q-icon name="brightness_medium" />
              </q-item-section>
              <q-item-section>
                <q-slider
                  id="brightnessValue"
                  v-model="brightness"
                  icon
                  label
                  label-always
                  :min="0"
                  :max="100"
                  :step="1"
                />
              </q-item-section>
            </q-item>
          </div>
          <div class="col col-1">{{ brightness }}</div>
        </div>
        <div class="row">
          <div class="col col-3">
            <label><q-icon name="palette"> </q-icon></label>
          </div>
          <div class="col col-9">
            <q-card :style="styleBg"
              ><q-card-section
                >{{ red }}, {{ green }}, {{ blue }}
              </q-card-section>

              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-color
                    v-model="color"
                    no-header
                    no-footer
                    class="my-picker"
                  ></q-color>
                </q-popup-proxy>
              </q-icon>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-btn-group>
              <q-btn
                variant="danger"
                v-if="typeof id !== 'undefined'"
                icon="delete"
                @click="removeModal = true"
                >Delete {{ id }}</q-btn
              >
              <q-btn
                variant="success"
                type="submit"
                v-if="typeof id !== 'undefined'"
                icon="edit"
                >Edit {{ id }}</q-btn
              >
              <q-btn variant="success" type="submit" v-else icon="add-box"
                >Create</q-btn
              >
            </q-btn-group>

            <q-dialog
              id="modal-remove-colorprofile"
              v-model="removeModal"
              header-bg-variant="dark"
              header-text-variant="danger"
              title="Remove profile?"
            >
              <!--  @ok="deleteEntry" -->
              <p class="my-4">Really remove profile &quot;{{ name }}&quot; ?</p>
            </q-dialog>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import colorhelper from "./colorhelper";
import ApiManager from "./api-manager";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "color-form",
  props: ["formProfileName"],
  data() {
    return {
      removeModal: false,
    };
  },
  computed: {
    red() {
      return this.findColorProfile(this.formProfileName).red;
    },
    green() {
      return this.findColorProfile(this.formProfileName).green;
    },
    blue() {
      return this.findColorProfile(this.formProfileName).blue;
    },
    color: {
      get() {
        return colorhelper.rgbToHex(
          this.findColorProfile(this.formProfileName)
        );
      },
      set(value) {
        this.handleColorHex(value);
      },
    },
    styleBg() {
      return "background: " + this.color;
    },
    brightness: {
      get() {
        return this.findColorProfile(this.formProfileName).brightness;
      },
      set(value) {
        this.findColorProfile(this.formProfileName).brightness = Number(value);
      },
    },
    id() {
      return this.findColorProfile(this.formProfileName).id;
    },
    hexVal() {
      return colorhelper.rgbToHex(this.findColorProfile(this.formProfileName));
    },
    ...mapGetters(["findColorProfile"]),
  },
  methods: {
    /** handles an update of hex value */
    handleColorHex(hexValue) {
      var result = colorhelper.hexToRgb(hexValue);
      var obj = {
        red: result.r,
        green: result.g,
        blue: result.b,
        brightness: this.brightness,
        id: this.id,
      };
      this.updateStoreProfile({ type: this.formProfileName, object: obj });
    },
    /** handles an update of brightness */
    handleBrightness(value) {
      var obj = {
        red: this.red,
        green: this.green,
        blue: this.blue,
        brightness: Number(value),
        id: this.id,
      };
      this.updateStoreProfile({ type: this.formProfileName, object: obj });
    },
    /** save an entry, will do an update if id is set, create otherwise */
    saveEntry() {
      var obj = {
        red: this.red,
        green: this.green,
        blue: this.blue,
        brightness: this.brightness,
        id: this.id,
      };
      if (typeof this.id !== "undefined") {
        ApiManager.updateColorProfile(this, obj);
      } else {
        ApiManager.createColorProfile(this, obj);
      }
    },
    /** delete an entry */
    deleteEntry() {
      var obj = { id: this.id };
      ApiManager.deleteColorProfile(this, obj);
    },
    ...mapMutations({
      updateStoreProfile: "updateColorProfile",
    }),
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

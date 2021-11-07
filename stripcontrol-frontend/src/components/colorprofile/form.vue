<template>
  <div class="color-profile">
    <p></p>
    <h4 align="center" v-if="typeof currentProfile.id !== 'undefined'">
      Edit Profile {{ currentProfile.id }}

      <remove-modal
        :removalText="`Really Remove Profile ${currentProfile.id}?`"
        :deleteEntry="deleteEntry"
      />
    </h4>
    <h4 align="center" v-else>Create Color Profile</h4>
    <div class="q-pa-md">
      <q-form @submit="saveEntry" class="q-gutter-md">
        <div class="row">
          <div class="col">
            <q-item>
              <q-item-section avatar>
                <q-icon name="brightness_medium" />
              </q-item-section>
              <q-item-section>
                <q-slider
                  id="brightnessValue"
                  v-model.number="currentProfile.brightness"
                  icon="brightness_medium"
                  label
                  label-always
                  label-color="secondary"
                  color="secondary"
                  :min="0"
                  :max="100"
                  :step="1"
                />
              </q-item-section>
            </q-item>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-card 
              ><q-card-section horizontal class="col">
                <q-card-actions vertical>
                  <q-icon size="md" name="palette"
                /></q-card-actions>
                <div
                class="foo text-h5"
                :style="styleBg"
              > &nbsp;
                </div>
                <q-card-actions vertical class="justify-around q-px-md">
                  <q-btn flat icon="colorize" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-color
                        v-model="color"
                        no-header
                        no-footer
                        class="my-picker"
                      ></q-color>
                    </q-popup-proxy>
                  </q-btn>
                </q-card-actions>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col" align="center">
            <q-btn
              color="positive"
              type="submit"
              v-if="typeof currentProfile.id !== 'undefined'"
              icon="edit"
              >Edit {{ currentProfile.id }}</q-btn
            >
            <q-btn color="positive" type="submit" v-else icon="add_box"
              >Create</q-btn
            >
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import colorhelper from "@/utils/colorhelper";
import ApiManager from "@/api/manager";
import { mapMutations, mapGetters } from "vuex";
import RemoveModal from "@/components/removeModal";
import { StoreProfile } from "@/models/storeprofile";

export default {
  name: "colorprofile-form",
  props: ["formProfileName"],
  components: {
    RemoveModal,
  },
  computed: {
    currentProfile() {
      return this.findColorProfile(this.formProfileName);
    },
    color: {
      get() {
        return colorhelper.rgbToHex(
          this.currentProfile
        );
      },
      set(value) {
        this.handleColorHex(value);
      },
    },
    styleBg() {
      return "background: " + this.color;
    },
    hexVal() {
      return colorhelper.rgbToHex(this.currentProfile);
    },
    ...mapGetters(["findColorProfile"]),
  },
  methods: {
    /** handles an update of hex value */
    handleColorHex(hexValue) {
      var result = colorhelper.hexToRgb(hexValue);

      var obj = new StoreProfile(
        result.r,
        result.g,
        result.b,
        this.currentProfile.brightness,
        this.currentProfile.id
      );
      this.updateStoreProfile({ type: this.formProfileName, object: obj });
    },
    /** handles an update of brightness */
    handleBrightness(value) {
      var obj = new StoreProfile(
        this.currentProfile.red,
        this.currentProfile.green,
        this.currentProfile.blue,
        Number(value),
        this.currentProfile.id
      );
      this.updateStoreProfile({ type: this.formProfileName, object: obj });
    },
    /** save an entry, will do an update if id is set, create otherwise */
    saveEntry() {
      var obj = new StoreProfile(
        this.currentProfile.red,
        this.currentProfile.green,
        this.currentProfile.blue,
        this.currentProfile.brightness,
        this.currentProfile.id
      );
      if (typeof this.currentProfile.id !== "undefined") {
        ApiManager.updateColorProfile(this, obj);
      } else {
        ApiManager.createColorProfile(this, obj);
      }
    },
    /** delete an entry */
    deleteEntry() {
      var obj = { id: this.currentProfile.id };
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
.foo {
  float: left;
  width: 100%;
  height: 95%;
  margin: 6px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
</style>

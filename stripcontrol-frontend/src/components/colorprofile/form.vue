<template>
  <div class="color-profile">
    <div class="q-pa-md">
      <q-form @submit="saveEntry" class="q-gutter-md" ref="profilecreateform">
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
                <div class="foo text-h5" :style="styleBg">&nbsp;</div>
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
      </q-form>
    </div>
  </div>
</template>

<script setup>
import ApiManager from "@/api/manager";
import colorhelper from "@/utils/colorhelper";
import { StoreProfile } from "@/models/storeprofile";
import {
  computed,
  defineProps,
  defineEmits,
  defineExpose,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";
const props = defineProps({
  formProfileName: Number,
  formValid: Boolean,
});

const emit = defineEmits(["update:formValid"]);
const profilecreateform = ref(null);
defineExpose({
  profilecreateform,
});
const store = useStore();
const currentProfile = computed(() =>
  store.getters.findColorProfile(props.formProfileName)
);

watch(
  currentProfile,
  (newVal, oldVal) => {
    console.log("selected profile mutated");
    let res = true;
    emit("update:formValid", res);
  },
  { deep: true }
);

const color = computed({
  get() {
    return colorhelper.rgbToHex(currentProfile.value);
  },
  set(value) {
    let result = colorhelper.hexToRgb(value);
    let obj = new StoreProfile(
      result.r,
      result.g,
      result.b,
      currentProfile.value.brightness,
      currentProfile.value.id
    );
    store.commit("updateColorProfile", {
      type: props.formProfileName,
      object: obj,
    });
  },
});
const styleBg = computed(() => `background: ${color.value}`);

/** save an entry, will do an update if id is set, create otherwise */
function saveEntry() {
  let obj = new StoreProfile(
    currentProfile.value.red,
    currentProfile.value.green,
    currentProfile.value.blue,
    currentProfile.value.brightness,
    currentProfile.value.id
  );
  if (typeof currentProfile.value.id !== "undefined") {
    ApiManager.updateColorProfile(obj);
  } else {
    ApiManager.createColorProfile(obj);
  }
}
</script>
<script>
export default {
  name: "colorprofile-form",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.foo {
  float: left;
  width: 100%;
  height: 95%;
  margin: 6px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
</style>

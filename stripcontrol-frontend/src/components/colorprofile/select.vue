<template>
  <q-btn-dropdown :label="stringSelected" v-model="menuState">
    <q-list v-if="storedBackendProfiles.length === 0">
      <q-item
        v-if="addNewOption"
        clickable
        v-close-popup
        @click="handleSelectNew()"
      >
        <q-item-section>
          <q-item-label>Add new profile</q-item-label>
        </q-item-section>
      </q-item>
      <q-item disabled clickable v-close-popup @click="onItemClick">
        <q-item-section>
          <q-item-label> No profiles available </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list v-else>
      <q-item
        v-if="addNewOption"
        clickable
        v-close-popup
        @click="handleSelectNew()"
      >
        <q-item-section>
          <q-item-label>Add new profile</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        v-for="profile in storedBackendProfiles"
        :key="profile.id"
        clickable
        @click="handleSelection(profile)"
      >
        <q-item-section>
          <q-item-label>
            <div
              class="foo"
              :style="{ backgroundColor: getHexColor(profile) }"
            ></div>
            <q-icon name="brightness_medium"></q-icon>
            {{ profile.brightness }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup>
import colorhelper from "@/utils/colorhelper";
import EventBus from "@/utils/eventbus";
import { EventType } from "@/utils/constant-config";
import { ref, computed, defineProps, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  selectId: Number,
  preselected: Number,
  addNew: Boolean,
});

const store = useStore();
const id = ref(props.preselected ? props.preselected : -1);
const menuState = ref(false);

const addNewOption = computed(() => props.addNew === true);
const storedBackendProfiles = computed(() => store.getters.backendProfiles);
const selected = computed(() => store.getters.getColorProfileById(id.value));

const stringSelected = computed(() => {
  if (id.value === null) {
    return "New Profile";
  } else if (
    typeof selected.value === "undefined" ||
    typeof selected.value.id === "undefined"
  ) {
    return "Select Profile";
  }
  let brightness =
    typeof selected.value.brightness !== "undefined"
      ? selected.value.brightness
      : 0;
  return (
    getHexColor(selected.value) +
    ", \u2600:" +
    brightness +
    ` (id: ${selected.value.id})`
  );
});

function handleSelection(profile) {
  id.value = profile.id;
  menuState.value = false;
  EventBus.$emit(EventType.CP_SELECT, {
    object: profile,
    stripId: props.selectId,
    type: "selectProfile",
  });
}
function handleSelectNew() {
  id.value = null;
  EventBus.$emit(EventType.CP_SELECT, { type: "selectProfile" });
}

function getHexColor(profile) {
  return colorhelper.rgbToHex(profile);
}
function handleCPCreate(event) {
  if (
    event !== "undefined" &&
    event.object !== "undefined" &&
    event.object.id !== "undefined"
  ) {
    id.value = event.object.id;
  }
}
onMounted(() => {
  EventBus.$on(EventType.CP_CREATE, handleCPCreate);
});
onBeforeUnmount(() => {
  EventBus.$off(EventType.CP_CREATE, handleCPCreate);
});
</script>
<script>
export default {
  name: "colorprofile-select",
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.foo {
  float: left;
  width: 20px;
  height: 20px;
  margin: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
</style>

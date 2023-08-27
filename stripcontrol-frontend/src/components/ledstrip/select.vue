<template>
  <q-btn-dropdown :label="stringSelected" v-model="menuState">
    <q-list v-if="storedBackendStrips.length === 0">
      <q-item
        v-if="addNewOption"
        clickable
        v-close-popup
        @click="handleSelectNew()"
      >
        <q-item-section>
          <q-item-label>Add new strip</q-item-label>
        </q-item-section>
      </q-item>
      <q-item disabled clickable v-close-popup @click="onItemClick">
        <q-item-section>
          <q-item-label> No strips available </q-item-label>
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
          <q-item-label>Add new strip</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        v-for="strip in storedBackendStrips"
        :key="strip.id"
        clickable
        @click="handleSelection(strip)"
      >
        <q-item-section>
          <q-item-label>
            {{ strip.name }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<script setup>
import { ref, computed, defineProps, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import EventBus from "@/utils/eventbus";
import { EventType } from "@/utils/constant-config";

const props = defineProps({
  selectStripName: String,
  preselected: String,
  addNew: Boolean,
});

const store = useStore();
const id = ref(props.preselected ? props.preselected : -1);
const menuState = ref(false);

const addNewOption = computed(() => props.addNew === true);

const storedBackendStrips = computed(() => store.getters.backendStrips);
const selected = computed(() => {
  return storedBackendStrips.value.find((profile) => profile.id === id.value);
});
const stringSelected = computed(() => {
  if (id.value === null) {
    return "New Strip";
  } else if (
    typeof selected.value === "undefined" ||
    typeof selected.value.id === "undefined"
  ) {
    return "Select strip";
  }
  return selected.value.name + ` (id: ${selected.value.id})`;
});

function handleSelection(strip) {
  id.value = strip.id;
  menuState.value = false;
  EventBus.$emit(EventType.LS_SELECT, {
    object: strip,
    type: props.selectStripName,
  });
}
function handleSelectNew() {
  id.value = null;
  EventBus.$emit(EventType.LS_SELECT, { type: props.selectStripName });
}
function handleLSCreate(event) {
  if (
    event !== "undefined" &&
    event.object !== "undefined" &&
    event.object.id !== "undefined"
  ) {
    id.value = event.object.id;
  }
}
onMounted(() => {
  EventBus.$on(EventType.LS_CREATE, handleLSCreate);
});
onBeforeUnmount(() => {
  EventBus.$off(EventType.LS_CREATE, handleLSCreate);
});
</script>
<script>
export default {
  name: "ledstrip-select",
};
</script>

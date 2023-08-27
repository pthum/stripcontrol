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

<script>
import EventBus from "@/utils/eventbus";
import { mapGetters } from "vuex";
import { EventType } from "@/utils/constant-config";

export default {
  name: "ledstrip-select",
  props: ["selectStripName", "preselected", "addNew"],
  created() {
    this.id = this.preselected;
  },
  data() {
    return {
      id: -1,
      menuState: false,
    };
  },
  computed: {
    selected() {
      return this.storedBackendStrips.find((profile) => profile.id === this.id);
    },
    addNewOption() {
      return this.addNew === true;
    },
    stringSelected: function () {
      if (this.id === null) {
        return "New Strip";
      } else if (
        typeof this.selected === "undefined" ||
        typeof this.selected.id === "undefined"
      ) {
        return "Select strip";
      }
      return this.selected.name + ` (id: ${this.selected.id})`;
    },
    ...mapGetters({
      storedBackendStrips: "backendStrips",
    }),
  },
  methods: {
    handleSelection(strip) {
      this.id = strip.id;
      this.menuState = false;
      EventBus.$emit(EventType.LS_SELECT, {
        object: strip,
        type: this.selectStripName,
      });
    },
    handleSelectNew() {
      this.id = null;
      EventBus.$emit(EventType.LS_SELECT, { type: this.selectStripName });
    },
    handleLSCreate(event) {
      if (
        event !== "undefined" &&
        event.object !== "undefined" &&
        event.object.id !== "undefined"
      ) {
        this.id = event.object.id;
      }
    },
  },
  mounted() {
    EventBus.$on(EventType.LS_CREATE, this.handleLSCreate);
  },
  beforeUnmount() {
    EventBus.$off(EventType.LS_CREATE, this.handleLSCreate);
  },
};
</script>

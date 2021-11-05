<template>
  <div class="ledStripSeelect">
    <q-btn-dropdown :label="stringSelected" v-model="menuState">
      <q-list>
        <q-item
          v-if="storedBackendStrips.length === 0"
          disabled
          clickable
          v-close-popup
          @click="onItemClick"
        >
          <q-item-section>
            <q-item-label> No strips available </q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-else
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
  </div>
</template>

<script>
import EventBus from "./eventbus";
import { mapGetters } from "vuex";
import { EventType } from "./constant-contig";

export default {
  name: "ledstrip-select",
  props: ["selectStripName", "preselected"],
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
    stringSelected: function () {
      if (
        typeof this.selected === "undefined" ||
        typeof this.selected.id === "undefined"
      ) {
        return "Select strip";
      }
      return this.selected.name;
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

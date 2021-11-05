<template>
  <div class="stripcontrolService">
    <h5>
      Strip control
      <q-btn variant="dark" @click="refresh()"><q-icon name="sync" /></q-btn>
    </h5>
    <div v-if="storedBackendStrips.length == 0">
      <div class="q-pa-md">
        <div class="row">
          <div class="col">No LED Strips created yet.</div>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="q-pa-md row items-start q-gutter-md"
        fluid
      >
        <q-card v-for="strip in storedBackendStrips"
        :key="strip.id"
          ><q-card-section>
            <div class="text-h6">{{ strip.name }}</div>
            <q-separator></q-separator>
            <q-card-actions align="around">
              <colorprofileselect
                selectProfileName="selectProfile"
                :selectId="strip.id"
                :preselected="strip.profileId"
              />
              &nbsp; &nbsp;
              <q-btn
                :icon="strip.enabled ? 'light_mode' : 'lightbulb'"
                :color="strip.enabled ? 'yellow-5' : 'dark'"
                :variant="getVariantEnabled(strip)"
                @click="toggleEnabled(strip)"
              />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import colorprofileselect from "./colorprofile-select";
import ApiManager from "./api-manager";
import EventBus from "./eventbus";
import { Ui, EventType } from "./constant-contig";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "stripcontrolservice",
  components: {
    colorprofileselect,
  },
  created() {
    this.refresh();
  },
  computed: {
    ...mapGetters({
      storedBackendStrips: "backendStrips",
    }),
  },
  methods: {
    refresh() {
      ApiManager.callGetColorProfiles(this);
      ApiManager.callGetLedStrips(this);
    },
    /** enable/disable strip */
    toggleEnabled(strip) {
      strip.enabled = !strip.enabled;
      ApiManager.updateLedStrip(this, strip);
    },
    /** return the ui variant of a strip */
    getVariantEnabled(strip) {
      return Ui.getVariant(strip.enabled);
    },
    /** handle selection of a color profile */
    handleCPSelect(event) {
      ApiManager.updateStripProfile(this, {
        stripId: event.stripId,
        profile: event.object,
      });
    },
    ...mapMutations({
      updateStoreStrip: "updateLedStrip",
    }),
  },
  mounted() {
    EventBus.$on(EventType.CP_SELECT, this.handleCPSelect);
  },
  beforeUnmount() {
    EventBus.$off(EventType.CP_SELECT, this.handleCPSelect);
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

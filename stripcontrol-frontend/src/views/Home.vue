<template>
  <div class="stripcontrolService">
    <h4 align="center">
      Strip Control
      <q-btn color="dark" icon="sync" @click="refresh()"></q-btn>
    </h4>
    <div v-if="storedBackendStrips.length == 0">
      <div class="q-pa-md">
        <div class="row">
          <div class="col">No LED Strips created yet.</div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="q-pa-md row items-start q-gutter-md" fluid>
        <q-card v-for="strip in storedBackendStrips" :key="strip.id"
          ><q-card-section>
            <div class="text-h6">{{ strip.name }}</div>
            <q-separator></q-separator>
            <q-card-actions align="around">
              <q-btn-group>
                <colorprofileselect
                  selectProfileName="selectProfile"
                  :selectId="strip.id"
                  :preselected="strip.profileId"
                />

                <q-btn
                  :icon="strip.enabled ? 'light_mode' : 'lightbulb'"
                  :color="strip.enabled ? 'yellow-5' : 'dark'"
                  @click="toggleEnabled(strip)"
                />
              </q-btn-group>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import colorprofileselect from "@/components/colorprofile/select";
import ApiManager from "@/api/manager";
import EventBus from "@/utils/eventbus";
import { EventType } from "@/utils/constant-config";
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

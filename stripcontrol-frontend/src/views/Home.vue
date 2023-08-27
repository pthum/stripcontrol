<template>
  <div class="stripcontrolService">
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
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">
                  {{ strip.name }}
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  round
                  flat
                  :icon="strip.enabled ? 'light_mode' : 'lightbulb'"
                  :color="strip.enabled ? 'yellow-5' : 'grey-7'"
                  @click="toggleEnabled(strip)"
                />
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-card-actions vertical>
              <colorprofileselect
                :selectId="strip.id"
                :preselected="strip.profileId"
              />
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import colorprofileselect from "@/components/colorprofile/select";
import ApiManager from "@/api/manager";
import EventBus from "@/utils/eventbus";
import { EventType } from "@/utils/constant-config";
import { useStore } from "vuex";
import { computed, onMounted, onBeforeUnmount } from "vue";

const store = useStore();
const storedBackendStrips = computed(() => store.getters.backendStrips);

function refresh() {
  ApiManager.callGetColorProfiles(this);
  ApiManager.callGetLedStrips(this);
}
/** enable/disable strip */
function toggleEnabled(strip) {
  strip.enabled = !strip.enabled;
  ApiManager.updateLedStrip(this, strip);
}
/** handle selection of a color profile */
function handleCPSelect(event) {
  ApiManager.updateStripProfile(this, {
    stripId: event.stripId,
    profile: event.object,
  });
}
onMounted(() => {
  EventBus.$on(EventType.CP_SELECT, handleCPSelect);
});
onBeforeUnmount(() => {
  EventBus.$off(EventType.CP_SELECT, handleCPSelect);
});
refresh();
</script>
<script>
export default {
  name: "strip-control-service",
};
</script>

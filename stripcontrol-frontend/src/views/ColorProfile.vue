<template>
  <div class="colorProfileService">
    <div class="q-pa-md">
      <div class="row">
        <div class="col centered">
          <q-btn-group>
            <colorprofileselect
              :preselected="storeSelectedProfile.id"
              :addNew="true"
            />
            <remove-modal
              :removalText="`Really Remove Profile ${storeSelectedProfile.id}?`"
              :deleteEntryFn="deleteEntry"
              :isBtnActive="storeSelectedProfile.id"
            />
            <q-btn
              @click="submitProfileForm()"
              align="right"
              :color="fValid ? 'secondary' : 'primary'"
              :icon="storeSelectedProfile.id ? 'edit' : 'add'"
              size="lg"
              flat
              :disabled="!fValid"
            ></q-btn>
          </q-btn-group>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <colorprofileform
            ref="profileformcomponent"
            formProfileName="selectedProfile"
            :formValid="fValid"
            @update:formValid="(newValue) => (fValid = newValue)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ApiManager from "@/api/manager";
import colorprofileform from "@/components/colorprofile/form";
import colorprofileselect from "@/components/colorprofile/select";
import RemoveModal from "@/components/removeModal";
import EventBus from "@/utils/eventbus";
import { EventType } from "@/utils/constant-config";
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const profileformcomponent = ref(null);
const fValid = ref(false);
function submitProfileForm() {
  profileformcomponent.value.profilecreateform.submit();
}

const storeSelectedProfile = computed(() => store.getters.selectedProfile);

function callGetColorProfiles() {
  ApiManager.callGetColorProfiles();
}
/** delete an entry */
function deleteEntry() {
  let obj = { id: storeSelectedProfile.value.id };
  ApiManager.deleteColorProfile(obj);
}
function toggle(isCreate) {
  if (isCreate) {
    resetStoreProfile();
  } else {
    updateStoreProfile(storeSelectedProfile.value);
  }
}
/** set the saved object as selected profile, update the colorprofiles, inform user  */
function handleCPSave(event) {
  updateStoreProfile(event.object);
  updateColorProfileInBackendList(event.object);
  toggle(false);
  EventBus.makeToast(event);
}
/** reset the selected profile, update the colorprofiles, inform user */
function handleCPDelete(event) {
  resetStoreProfile();
  removeColorProfileInBackendList(event.object);
  toggle(true);
  EventBus.makeToast(event);
}
function handleCPSelect(event) {
  if (typeof event.object === "undefined") {
    toggle(true);
    resetStoreProfile();
  } else {
    updateStoreProfile(event.object);
    toggle(false);
  }
}
function resetStoreProfile() {
  store.commit("resetColorProfile", { type: "selectedProfile" });
}
function removeColorProfileInBackendList(o) {
  store.commit("removeColorProfileInBackendList", o);
}
function updateStoreProfile(obj) {
  let o = {
    type: "selectedProfile",
    object: obj,
  };
  store.commit("updateColorProfile", o);
}
function updateColorProfileInBackendList(o) {
  store.commit("updateColorProfileInBackendList", o);
}

onMounted(() => {
  EventBus.$on(EventType.CP_CREATE, handleCPSave);
  EventBus.$on(EventType.CP_UPDATE, handleCPSave);
  EventBus.$on(EventType.CP_DELETE, handleCPDelete);
  EventBus.$on(EventType.CP_SELECT, handleCPSelect);
});
onBeforeUnmount(() => {
  EventBus.$off(EventType.CP_CREATE, handleCPSave);
  EventBus.$off(EventType.CP_UPDATE, handleCPSave);
  EventBus.$off(EventType.CP_DELETE, handleCPDelete);
  EventBus.$off(EventType.CP_SELECT, handleCPSelect);
  // EventBus.$on(EventType.CP_GETALL, handleCPGetAll);
});

callGetColorProfiles();
toggle(true);
</script>

<script>
export default {
  name: "color-profile-service",
};
</script>

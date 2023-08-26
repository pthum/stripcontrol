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
              v-if="storeSelectedProfile.id"
              :removalText="`Really Remove Profile ${storeSelectedProfile.id}?`"
              :deleteEntry="deleteEntry"
            />
          </q-btn-group>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <colorprofileform formProfileName="selectedProfile" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiManager from "@/api/manager";
import colorprofileform from "@/components/colorprofile/form";
import colorprofileselect from "@/components/colorprofile/select";
import RemoveModal from "@/components/removeModal";
import EventBus from "@/utils/eventbus";
import { Ui, EventType } from "@/utils/constant-config";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "color-profile-service",
  components: {
    colorprofileform,
    colorprofileselect,
    RemoveModal,
  },
  created() {
    this.callGetColorProfiles();
    this.toggle(true);
  },
  data() {
    return {
      variantEdit: Ui.getVariant(false),
    };
  },
  computed: {
    ...mapGetters({
      storeSelectedProfile: "selectedProfile",
    }),
  },
  methods: {
    callGetColorProfiles() {
      ApiManager.callGetColorProfiles(this);
    },
    /** delete an entry */
    deleteEntry() {
      let obj = { id: this.storeSelectedProfile.id };
      ApiManager.deleteColorProfile(this, obj);
    },
    toggle(isCreate) {
      if (isCreate) {
        this.resetStoreProfile({ type: "selectedProfile" });
      } else {
        this.updateStoreProfile({
          type: "selectedProfile",
          object: this.storeSelectedProfile,
        });
      }
    },
    /** set the saved object as selected profile, update the colorprofiles, inform user  */
    handleCPSave(event) {
      this.updateStoreProfile({
        type: "selectedProfile",
        object: event.object,
      });
      this.updateColorProfileInBackendList(event.object);
      this.toggle(false);
      EventBus.makeToast(this, event);
    },
    /** reset the selected profile, update the colorprofiles, inform user */
    handleCPDelete(event) {
      this.resetStoreProfile({ type: "selectedProfile" });
      this.removeColorProfileInBackendList(event.object);
      this.toggle(true);
      EventBus.makeToast(this, event);
    },
    handleCPSelect(event) {
      if (typeof event.object === "undefined") {
        this.toggle(true);
        this.resetStoreProfile({ type: "selectedProfile" });
      } else {
        this.updateStoreProfile({
          type: "selectedProfile",
          object: event.object,
        });
        this.toggle(false);
      }
    },
    ...mapMutations({
      updateStoreProfile: "updateColorProfile",
      resetStoreProfile: "resetColorProfile",
      updateColorProfileInBackendList: "updateColorProfileInBackendList",
      removeColorProfileInBackendList: "removeColorProfileInBackendList",
    }),
  },
  mounted() {
    EventBus.$on(EventType.CP_CREATE, this.handleCPSave);
    EventBus.$on(EventType.CP_UPDATE, this.handleCPSave);
    EventBus.$on(EventType.CP_DELETE, this.handleCPDelete);
    EventBus.$on(EventType.CP_SELECT, this.handleCPSelect);
  },
  beforeUnmount() {
    EventBus.$off(EventType.CP_CREATE, this.handleCPSave);
    EventBus.$off(EventType.CP_UPDATE, this.handleCPSave);
    EventBus.$off(EventType.CP_DELETE, this.handleCPDelete);
    EventBus.$off(EventType.CP_SELECT, this.handleCPSelect);
    EventBus.$on(EventType.CP_GETALL, this.handleCPGetAll);
  },
};
</script>

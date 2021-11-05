<template>
  <div class="colorProfileService">
    <div class="q-pa-md">
      <div class="row">
        <div class="col col-3"></div>
        <div class="col col-5">
          <q-btn-group>
            <colorprofileselect
              selectProfileName="selectedProfile"
              :preselected="storeSelectedProfile.id"
            />
            <q-btn color="dark" @click="callGetColorProfiles()" icon="sync" />
            <q-btn
              :color="variantEdit"
              :disabled="disabledEdit"
              @click="toggle(false)"
              icon="edit"
            />
            <q-btn
              :color="variantCreate"
              :disabled="disabledCreate"
              @click="toggle(true)"
              icon="add_box"
            />
          </q-btn-group>
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <div class="col">
          <colorprofileform formProfileName="editableProfile" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiManager from "@/components/api-manager";
import colorprofileform from "@/components/colorprofile-form";
import colorprofileselect from "@/components/colorprofile-select";
import EventBus from "@/components/eventbus";
import { Ui, EventType } from "@/components/constant-contig";
import { mapMutations, mapGetters } from "vuex";

export default {
  name: "colorprofileservice",
  components: {
    colorprofileform,
    colorprofileselect,
  },
  created() {
    this.callGetColorProfiles();
    this.toggle(true);
    this.disabledEdit = true;
  },
  data() {
    return {
      variantEdit: Ui.getVariant(false),
      variantCreate: Ui.getVariant(false),
      disabledEdit: false,
      disabledCreate: false,
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
    toggle(isCreate) {
      if (isCreate) {
        this.resetStoreProfile({ type: "editableProfile" });
      } else {
        this.updateStoreProfile({
          type: "editableProfile",
          object: this.storeSelectedProfile,
        });
      }
      this.toggleCreateElements(isCreate);
      this.toggleEditElements(!isCreate);
    },
    toggleCreateElements(isEnabled) {
      this.variantCreate = Ui.getVariant(isEnabled);
      this.disabledCreate = isEnabled;
    },
    toggleEditElements(isEnabled) {
      this.variantEdit = Ui.getVariant(isEnabled);
      this.disabledEdit = isEnabled;
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
      this.updateStoreProfile({
        type: "selectedProfile",
        object: event.object,
      });
      this.toggle(false);
    },
    handleCPGetAll(event) {
      if (event.object.length === 0) {
        this.disabledEdit = true;
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
    EventBus.$on(EventType.CP_GETALL, this.handleCPGetAll);
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

<template>
  <q-btn
    @click="test = true"
    align="right"
    color="negative"
    icon="delete"
    size="lg"
    flat
  ></q-btn>
  <q-dialog
    id="modal-remove-item"
    v-model="test"
    header-bg-variant="dark"
    header-text-variant="danger"
  >
    <q-card>
      <q-card-section>
        <q-avatar icon="warning"></q-avatar>
        {{ removalText }}
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="secondary" v-close-popup></q-btn>
        <q-btn
          label="Remove!"
          color="negative"
          v-close-popup
          @click="deleteEntry"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "remove-modal",
  props: ["removalText", "deleteEntry"],
  data() {
    return {
      pinout: false,
      test: false,
    };
  },

  methods: {
    /** delete an entry */
    executeDelete() {
      this.deleteEntry();
    },
  },
};
</script>

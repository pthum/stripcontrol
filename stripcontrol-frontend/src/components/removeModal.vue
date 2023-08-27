<template>
  <q-btn
    @click="test = true"
    align="right"
    :color="isBtnActive ? 'negative' : 'primary'"
    icon="delete"
    size="lg"
    flat
    :disabled="!isBtnActive"
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
          @click="executeDelete"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps } from "vue";
const props = defineProps({
  removalText: String,
  deleteEntryFn: Function,
  isBtnActive: Boolean,
});
const test = ref(false);
function executeDelete() {
  props.deleteEntryFn();
}
</script>

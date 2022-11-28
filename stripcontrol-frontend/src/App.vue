<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated class="bg-black text-white" height-hint="98">
      <q-toolbar>
        <q-tabs align="left">
          <q-route-tab to="/" label="Home" />
          <q-route-tab to="/colorprofileservice" label="Color Profiles" />
          <q-route-tab to="/ledstripservice" label="LED Strips" />
        </q-tabs>
        <q-space></q-space>
        <q-btn icon="light_mode" @click="toggleLight()"></q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  name: "LayoutDefault",

  components: {},

  setup() {
    return {
      leftDrawerOpen: ref(false),
    };
  },
  methods: {
    toggleLight() {
      this.$q.dark.toggle();
    },
  },
};
</script>


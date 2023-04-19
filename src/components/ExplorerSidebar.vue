<script setup lang="ts">
import { ref } from 'vue'
import ExplorerSidebarFilter from './ExplorerSidebarFilter.vue'
const tab = ref('filter')
</script>

<template>
  <v-card style="width:100%">
    <v-tabs
      v-model="tab"
      bg-color="grey-lighten-4"
      color="accent"
      grow
      class="px-8"
      height="64"
    >
      <v-tab value="filter" prepend-icon="mdi-filter-outline">Filter Stations</v-tab>
      <v-tab value="compare" prepend-icon="mdi-chart-line">Compare</v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-card-text>
      <v-window v-model="tab" class="pt-4">
        <v-window-item value="filter">
          <ExplorerSidebarFilter></ExplorerSidebarFilter>
        </v-window-item>

        <v-window-item value="compare">
          <v-alert
            type="error"
            title="Not Implemented Yet"
            text="This tab will contain the comparison chart and associated table listing user-selected station/parameter combos."
            variant="outlined"
          ></v-alert>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<style>
.v-slide-group-item--active {
  background-color: white;
}
</style>

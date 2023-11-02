<script setup lang="ts">
import { ref } from 'vue'
import ExplorerFilter from './ExplorerFilter.vue'
import ExplorerCompare from './ExplorerCompare.vue'
import { useCompareStore } from '@/stores/compare'
import { watch } from 'vue'

const tab = ref('filter')
const compareStore = useCompareStore()
watch(compareStore.results, () => {
  tab.value = 'compare'
})
</script>

<template>
  <v-card style="width:100%">
    <v-tabs
      v-model="tab"
      bg-color="grey-lighten-4"
      color="accent"
      grow
      class="px-8"
      :height="$vuetify.display.width > 1440 ? 64 : 56"
    >
      <v-tab value="filter" prepend-icon="mdi-filter-outline">Filters</v-tab>
      <v-tab value="compare" prepend-icon="mdi-chart-line">Compare</v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-card-text class="px-0">
      <v-window v-model="tab">
        <v-window-item value="filter">
          <ExplorerFilter></ExplorerFilter>
        </v-window-item>

        <v-window-item value="compare">
          <ExplorerCompare></ExplorerCompare>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<style>

</style>

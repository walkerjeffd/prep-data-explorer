<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps(['station'])
const show = ref(true)
const loading = ref(true)
const tab = ref('chart')
const options = {
  title: {
    text: null
  },
  xAxis: {
    type: 'datetime',
    title: {
      text: 'Date'
    }
  },
  yAxis: {
    title: {
      text: 'Temperature (°C)'
    }
  },
  legend: {
    enabled: false
  },
  series: [
    {
      data: Array(10)
        .fill(0)
        .map(() => [
          Date.now() - 365 * 24 * 60 * 60 * 1000 + Math.random() * 10000000000,
          Math.random() * 100
        ])
        .sort((a, b) => a[0] - b[0])
    }
  ]
}

setTimeout(() => {
  loading.value = false
}, 2000)
</script>

<template>
  <v-card>
    <v-toolbar class="pl-4">
      <span class="text-h6">Selected Station: {{ props.station.name }}</span>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-arrow-expand-all" size="x-small" aria-label="Open in full screen"></v-btn>
      <v-btn :icon="show ? '$expand' : '$collapse'" size="x-small" @click="show = !show" :aria-label="show ? 'Expand' : 'Collapse'"></v-btn>
    </v-toolbar>

    <v-progress-linear v-if="loading" indeterminate color="accent"></v-progress-linear>

    <v-sheet v-if="show">
      <div class="px-4 py-2">
        <v-autocomplete variant="underlined" label="Select Parameter"></v-autocomplete>
      </div>

      <v-tabs
        v-model="tab"
        bg-color="grey-lighten-4"
        color="accent"
        grow
        class="px-4"
      >
        <v-tab value="chart" prepend-icon="mdi-chart-line">Chart</v-tab>
        <v-tab value="table" prepend-icon="mdi-table">Table</v-tab>
        <v-tab value="metadata" prepend-icon="mdi-map-marker">Station Metadata</v-tab>
      </v-tabs>

      <div class="pa-4">
        <v-window v-model="tab">
          <v-window-item value="chart">
            <p class="mb-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus eveniet modi rerum quia eos odit velit totam itaque at, ipsa voluptate numquam, sapiente quae temporibus? Quo quae commodi harum doloribus?</p>
            <chart :options="options"></chart>
            <v-divider class="my-4"></v-divider>
            <div class="d-flex mt-4">
              <v-btn variant="tonal" color="accent">
                <v-icon icon="mdi-plus" start></v-icon> Add to Compare
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn variant="tonal" color="accent">
                <v-icon icon="mdi-download" start></v-icon> Download
              </v-btn>
            </div>
          </v-window-item>

          <v-window-item value="table">
            <v-alert
              type="error"
              title="Not Implemented Yet"
              text="This tab will contain a table of data for the selected station and variable."
              variant="outlined"
              class="my-8"
            ></v-alert>
          </v-window-item>

          <v-window-item value="metadata">
            <v-alert
              type="error"
              title="Not Implemented Yet"
              text="This tab will contain metadata for the selected station."
              variant="outlined"
              class="my-8"
            ></v-alert>
          </v-window-item>
        </v-window>
      </div>
    </v-sheet>
  </v-card>
</template>

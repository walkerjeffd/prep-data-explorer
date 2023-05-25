<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import type Station from '@/types/Station'
import type Variable from '@/types/Variable'

import { useStationsStore } from '@/stores/stations'
import { getResultValues } from '@/services/resultValues'
import { downloadFile } from '@/services/download'

const { filteredStations } = storeToRefs(useStationsStore())

const emit = defineEmits(['close'])
const props = defineProps<{
  variables: Array<Variable>,
  selectedVariable: Variable | null,
  minDate: string | null,
  maxDate: string | null
}>()
const error: Ref<string | null> = ref(null)
const loading: Ref<boolean> = ref(false)

const selectedStations: Ref<Station[]> = ref(Array.from(filteredStations.value))
const selectedVariable: Ref<Variable | null> = ref(props.selectedVariable)
const minDate: Ref<string | null> = ref(props.minDate)
const maxDate: Ref<string | null> = ref(props.maxDate)

async function download () {
  error.value = null

  if (!selectedVariable.value) {
    error.value = 'Please select a parameter'
    return
  } else if (!minDate.value || !maxDate.value) {
    error.value = 'Please select a time period'
    return
  } else if (((new Date(maxDate.value)).valueOf() - (new Date(minDate.value)).valueOf()) / 1000 / 60 / 60 / 24 + 1 > 366) {
    error.value = 'Time period must be less than 1 year'
    return
  }

  loading.value = true

  try {
    const values = await getResultValues(
      selectedStations.value,
      selectedVariable.value,
      minDate.value,
      maxDate.value
    )
    if (values.length > 0) {
      downloadFile(values)
    } else {
      error.value = 'No data found for selected stations, parameter, and time period'
    }
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message || err.toString()
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-card>
    <v-card-title class="py-4 px-8 d-flex">
      Bulk Download
      <v-spacer></v-spacer>
      <v-btn icon @click="emit('close')" size="x-small" variant="flat">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text style="max-height: 80%;" class="px-8 py-4">
      <!-- <div class="text-body-1">Stations</div>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            v-model="selectedStations"
            :items="filteredStations"
            variant="underlined"
            placeholder="Select parameter"
            item-title="samplingfeaturecode"
            multiple
            chips
            closable-chips
            clearable
            return-object
          ></v-autocomplete>
        </v-col>
      </v-row> -->

      <p class="text-body-1">
        Choose a parameter and enter a time period to download all data for the current set of filtered stations. You may download up to 1 year of data at a time.
      </p>

      <v-divider class="my-4"></v-divider>

      <div class="text-body-1 mb-4"># Filtered Stations: {{ filteredStations.length }} (as shown on map)</div>

      <div class="text-body-1">Parameter</div>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            v-model="selectedVariable"
            :items="variables"
            variant="underlined"
            item-title="variable_label"
            item-value="variableid_prep"
            placeholder="Select parameter"
            clearable
            return-object
          ></v-autocomplete>
        </v-col>
      </v-row>

      <div class="text-body-1">Time Period</div>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="minDate"
            label="Start"
            type="date"
            variant="underlined"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="maxDate"
            label="End"
            type="date"
            variant="underlined"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>

      <v-alert type="error" variant="tonal" border="start" v-if="error" class="my-4">
        {{ error }}
      </v-alert>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="px-8 py-4">
      <v-btn variant="tonal" color="accent" @click="download()" :loading="loading">
        <v-icon start icon="$download"></v-icon> Download
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn variant="text" @click="emit('close')">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

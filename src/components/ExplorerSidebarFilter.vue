<script setup lang="ts">
import { ref } from 'vue'

const range = ref([0, 100])
</script>

<template>
  <v-row>
    <v-col cols="6">
      <v-text-field label="Start Date" type="date" variant="underlined"></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field label="End Date" type="date" variant="underlined"></v-text-field>
    </v-col>
  </v-row>
  <v-select variant="underlined" label="Sample Medium"></v-select>
  <v-select variant="underlined" label="Parameter Types"></v-select>
  <v-select variant="underlined" label="Parameters"></v-select>
  <v-range-slider
    v-model="range"
    strict
    class="pr-4"
    label="# Samples"
    color="grey-darken-1"
    :ticks="[0, 50, 100]"
    :step="1"
    thumb-label
    show-ticks="always"
  ></v-range-slider>

  <v-divider class="my-4"></v-divider>

  <div class="d-flex">
    <v-btn variant="tonal" color="accent">
      <v-icon icon="mdi-refresh" start></v-icon> Reset
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn variant="tonal" color="accent">
      <v-icon icon="mdi-download" start></v-icon> Batch Download
    </v-btn>
  </div>
</template>

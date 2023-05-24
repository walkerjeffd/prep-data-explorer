<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useResultsStore } from '@/stores/results'
import { watch } from 'vue';
const {
  valueCountTickLabels
} = storeToRefs(useResultsStore())
</script>

<template>
  <v-sheet class="py-2 px-4" elevation="2">
    <div class="d-flex mb-0 align-center">
      <div class="text-caption"># Values per Station</div>
      <v-spacer></v-spacer>
      <v-tooltip dir="left">
        <template v-slot:activator="{ props }">
          <v-btn icon="$info" variant="flat" size="x-small" v-bind="props"></v-btn>
        </template>
        <span v-html="'Stations colored by relative percentile of # values<br>(middle value is median # values over all stations)'"></span>
      </v-tooltip>
    </div>
    <div>
      <svg width="320" height="40" viewBox="0,0,320,40" style="overflow: visible; display: block;">
        <image x="0" y="8" width="320" height="10" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAYAAAAxWXB3AAAAAXNSR0IArs4c6QAAAOxJREFUOE+FkYttxDAMQ0l7tY7Q/UeJDyIlW06LFodAovj0SY5f/F7gAAfRI6QJjqGIHQlyoPzLC05sxjfXvKUc5vN517pWTvMr+1bqqBdbXHmO0E2Vv70fWvNjZu7LGXd/+bl78723M3lH4xZ+qdW9/8w798WQs6fX97tz7Xe/+rQrvbzFPSu/dd1n3b34Oy4OZpi9J5oL7b/5cP68xxs7N1t64KWTC9/eEns9+Kv2mN3Mg7m1vSkvc3lVr9qj/inm2Xz1zcaLKRbeZT/6andE62I1S37Nd593+EbncAQwlTPziExNTIaOX+TOPlHoiQoe9KDCAAAAAElFTkSuQmCC"></image>
        <g transform="translate(0,18)" fill="none" font-size="10" font-family="sans-serif" text-anchor="middle">
          <g class="tick" opacity="1" transform="translate(0,0)">
            <line stroke="currentColor" y2="6" y1="-10"></line>
            <text fill="currentColor" y="9" dy="0.71em">0</text>
          </g>
          <g class="tick" opacity="1" transform="translate(160,0)">
            <line stroke="currentColor" y2="6" y1="-10"></line>
            <text fill="currentColor" y="9" dy="0.71em">{{ valueCountTickLabels[1]?.toLocaleString() }}</text>
          </g>
          <g class="tick" opacity="1" transform="translate(320,0)">
            <line stroke="currentColor" y2="6" y1="-10"></line>
            <text fill="currentColor" y="9" dy="0.71em" text-anchor="end">
              {{ valueCountTickLabels[2]?.toLocaleString() }}
            </text>
          </g>
        </g>
      </svg>
    </div>
    <div>
    </div>
  </v-sheet>
</template>

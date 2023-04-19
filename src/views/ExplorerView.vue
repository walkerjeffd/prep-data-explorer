<script setup lang="ts">
import 'leaflet'
import {
  LMap,
  LTileLayer
} from '@vue-leaflet/vue-leaflet'
import StationCard from '../components/StationCard.vue'
import ExplorerSidebar from '../components/ExplorerSidebar.vue'

import 'leaflet/dist/leaflet.css'
</script>

<template>
  <div class="explorer">
    <div class="explorer-map">
      <div style="height:100%;width:100%">
        <LMap :zoom="11" :center="[43.2, -71]">
          <LTileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            layer-type="base"
            name="OpenStreetMap"
          />
        </LMap>
        <div class="explorer-station">
          <StationCard :station="{ name: 'My Station' }"></StationCard>
        </div>
      </div>
    </div>
    <div class="explorer-sidebar">
      <ExplorerSidebar></ExplorerSidebar>
    </div>
  </div>
</template>

<style scoped>
.explorer {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  background-color: red;
}
.explorer-map {
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  background-color: aqua;
}
.explorer-sidebar {
  display: flex;
  flex-basis: 600px;
  flex-grow: 0;
  flex-shrink: 1;
  background-color: orange;
}
.explorer-station {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 800px;
  background-color: lightgreen;
  z-index:1000;
}
</style>
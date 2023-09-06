import { defineStore } from 'pinia'
import type L from 'leaflet'
// import type GeoJSON from 'geojson'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import type Station from '@/types/Station'
import { getStations } from '@/services/stations'
// import { useResultsStore } from '@/stores/results'

// const API_URL = import.meta.env.VITE_API_URL
// const { valueCountByStation, valueCountSelectedQuantiles } = storeToRefs(useResultsStore())

export const useStationsStore = defineStore('stations', {
  state: () => ({
    allStations: [] as Station[],
    coreStationsOnly: true,
    nearbyStations: [] as Station[],
    selectedStations: [] as Station[],
    selectedStation: null as Station | null,
    spatialFilter: null as any | null,
  }),
  getters: {
    stations (state) {
      return state.allStations
        .filter(d => {
          if (!state.coreStationsOnly) return true
          return d.samplingfeaturecore
        })
        .filter(d => {
          if (state.spatialFilter === null) return true
          return booleanPointInPolygon([d.longitude, d.latitude], state.spatialFilter!.feature.geometry)
        })
    },
    getStationById (state) {
      return (id: number): Station | undefined => state.allStations.find(d => d.samplingfeatureid === id)
    },
    getStationCodeById () {
      return (id: number) => {
        const station = this.getStationById(id)
        return station?.samplingfeaturecode
      }
    }
  },
  actions: {
    async fetchStations () {
      this.allStations = await getStations()
    },
    setNearbyStations (stations: Station[]) {
      this.nearbyStations = stations
    },
    setSpatialFilter (layer: L.Layer | null) {
      if (this.spatialFilter !== null &&
          layer !== null &&
          // @ts-ignore
          this.spatialFilter.options.id === layer.options.id &&
          // @ts-ignore
          this.spatialFilter.feature.id === layer.feature.id) {
        this.spatialFilter = null
        return
      }
      this.spatialFilter = layer
    },
    selectStation (id?: number) {
      if (!id || this.selectedStation && this.selectedStation.samplingfeatureid === id) {
        this.selectedStation = null
        this.setNearbyStations([])
      } else {
        const station = this.getStationById(id)
        if (station) {
          this.selectedStation = station
        } else {
          throw new Error('Station not found')
        }
      }
    }
  },
})

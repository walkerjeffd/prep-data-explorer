import { defineStore, storeToRefs } from 'pinia'
import type L from 'leaflet'
// import type GeoJSON from 'geojson'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import type Station from '@/types/Station'
import { getStations } from '@/services/stations'
import { useResultsStore } from '@/stores/results'

// const API_URL = import.meta.env.VITE_API_URL
const { valueCountByStation, valueCountSelectedQuantiles } = storeToRefs(useResultsStore())

export const useStationsStore = defineStore('stations', {
  state: () => ({
    stations: [] as Station[],
    nearbyStations: [] as Station[],
    station: null as Station | null,
    spatialFilter: null as any | null,
  }),
  getters: {
    getStationById (state) {
      return (id: number): Station | undefined => state.stations.find(d => d.samplingfeatureid === id)
    },
    getStationCodeById () {
      return (id: number) => {
        const station = this.getStationById(id)
        return station?.samplingfeaturecode
      }
    },
    filteredStations (state) {
      return state.stations
        .filter(d => {
          if (!valueCountByStation.value) return true
          const value = valueCountByStation.value.get(d.samplingfeatureid)
          if (value === undefined) return false
          return value >= valueCountSelectedQuantiles.value[0] && value <= valueCountSelectedQuantiles.value[1]
        })
        .filter(d => {
          if (state.spatialFilter === null) return true
          return booleanPointInPolygon([d.longitude, d.latitude], state.spatialFilter!.feature.geometry)
        })
    }
  },
  actions: {
    async fetchStations () {
      this.stations = await getStations()
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
      if (!id || this.station && this.station.samplingfeatureid === id) {
        this.station = null
        this.setNearbyStations([])
      } else {
        const station = this.stations.find(station => station.samplingfeatureid === id)
        if (station) {
          this.station = station
        } else {
          throw new Error('Station not found')
        }
      }
    }
  },
})

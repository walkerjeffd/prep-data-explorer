import { defineStore, storeToRefs } from 'pinia'
import type Station from '@/types/Station'
import { getStations } from '@/services/stations'
import { useResultsStore } from '@/stores/results'

// const API_URL = import.meta.env.VITE_API_URL
const { valueCountByStation, valueCountSelectedQuantiles } = storeToRefs(useResultsStore())

export const useStationsStore = defineStore('stations', {
  state: () => ({
    stations: [] as Station[],
    station: null as Station | null,
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
      return state.stations.filter(d => {
        if (!valueCountByStation.value) return true
        const value = valueCountByStation.value.get(d.samplingfeatureid)
        if (value === undefined) return false
        return value >= valueCountSelectedQuantiles.value[0] && value <= valueCountSelectedQuantiles.value[1]
      })
    }
  },
  actions: {
    async fetchStations () {
      this.stations = await getStations()
    },
    selectStation (id?: number) {
      if (!id || this.station && this.station.samplingfeatureid === id) {
        this.station = null
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

import { defineStore } from 'pinia'
import type Station from '../types/Station'
import { getStations } from '../services/stations'

// const API_URL = import.meta.env.VITE_API_URL

export const useStationsStore = defineStore('stations', {
  state: () => ({
    stations: [] as Station[],
    station: null as Station | null,
  }),
  getters: {
    getStationById (state) {
      return (id: number) => state.stations.find(d => d.samplingfeatureid === id)
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
      this.stations = await getStations()
    },
    selectStation (id?: number) {
      if (this.station && this.station.samplingfeatureid === id) {
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

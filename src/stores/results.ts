import { defineStore } from 'pinia'
import type Result from '../types/Result'
import type Station from '../types/Station'
import type Variable from '../types/Variable'
import { getResults } from '../services/results'
import { min, median, max, sum, rollup, quantile } from 'd3-array'
// const API_URL = import.meta.env.VITE_API_URL

export const useResultsStore = defineStore('results', {
  state: () => ({
    results: [] as Result[],
    minDate: null as string | null,
    maxDate: null as string | null,
    variableIds: [] as number[],
    coreStationsOnly: true,
    valueCountSelectedRange: [0, 100]
  }),
  getters: {
    resultsFilteredByCoreStations (state): Result[] {
      if (!state.coreStationsOnly) return state.results
      return state.results.filter(d => d.samplingfeaturecore)
    },
    resultsFilteredByDates (state): Result[] {
      if (!state.minDate && !state.maxDate) return this.resultsFilteredByCoreStations
      const minDate = state.minDate ? new Date(state.minDate) : new Date(0)
      const maxDate = state.maxDate ? new Date(state.maxDate) : new Date()
      return this.resultsFilteredByCoreStations.filter(d => d.start <= maxDate && d.end >= minDate)
    },
    resultsFilteredByDatesAndVariables (state): Result[] {
      if (state.variableIds.length === 0) return this.resultsFilteredByDates

      return this.resultsFilteredByDates.filter((d) => {
        return state.variableIds.includes(d.variableid_prep)
      })
    },
    valueCountByStation (): Map<number, number> {
      return rollup(
        this.resultsFilteredByDatesAndVariables,
        v => sum(v, d => d.n_values),
        d => d.samplingfeatureid
      )
    },
    valueCountArray (): number[] {
      return Array.from(this.valueCountByStation.values())
    },
    valueCountMin (): number {
      return min(this.valueCountArray)!
    },
    valueCountMedian (): number {
      return median(this.valueCountArray)!
    },
    valueCountMax (): number {
      return max(this.valueCountArray)!
    },
    valueCountTickLabels (): [number, number, number] {
      return [this.valueCountMin, this.valueCountMedian, this.valueCountMax]
    },
    valueCountSelectedQuantiles (state) : [number, number] {
      const lower = state.valueCountSelectedRange[0] === 0 ?
        this.valueCountMin :
        Math.floor(quantile(this.valueCountArray, state.valueCountSelectedRange[0] / 100)!)
      const upper = state.valueCountSelectedRange[1] === 100 ?
        this.valueCountMax :
        Math.ceil(quantile(this.valueCountArray, state.valueCountSelectedRange[1] / 100)!)
      return [lower, upper]
    },
    getResultsByStation: (state) => {
      return (station: Station | null) => {
        if (!station) return []
        return state.results.filter(result => result.samplingfeatureid === station.samplingfeatureid)
      }
    },
    getResultsByVariables: (state) => {
      return (variables: Variable[]) => state.results.filter(result => variables.some(variable => result.variableid_prep === variable.variableid_prep))
    }
  },
  actions: {
    async fetchResults () {
      this.results = await getResults()
    }
  },
})

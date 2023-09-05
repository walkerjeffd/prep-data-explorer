import { defineStore, storeToRefs } from 'pinia'
import type Result from '@/types/Result'
import type Station from '@/types/Station'
import type Variable from '@/types/Variable'
import { getResults } from '@/services/results'
import { min, median, max, sum, rollup, quantile } from 'd3-array'
import { useStationsStore } from '@/stores/stations'
import { useVariablesStore } from '@/stores/variables'

const { stations } = storeToRefs(useStationsStore())
const { variables, selectedVariables } = storeToRefs(useVariablesStore())

export const useResultsStore = defineStore('results', {
  state: () => ({
    allResults: [] as Result[],
    minDate: null as string | null,
    maxDate: null as string | null,
    valueCountSelectedRange: [0, 100]
  }),
  getters: {
    resultsFilteredByDates (state): Result[] {
      if (!state.minDate && !state.maxDate) return state.allResults
      const minDate = state.minDate ? new Date(state.minDate) : new Date(0)
      const maxDate = state.maxDate ? new Date(state.maxDate) : new Date()
      return state.allResults
        .filter(d => d.start <= maxDate && d.end >= minDate)
    },
    resultsFilteredByDatesStations (): Result[] {
      return this.resultsFilteredByDates
        .filter(d => stations.value.some(station => station.samplingfeatureid === d.samplingfeatureid))
    },
    resultsFilteredByDatesStationsVariables (): Result[] {
      if (selectedVariables.value.length > 0) {
        return this.resultsFilteredByDatesStations.filter((d) => {
          return selectedVariables.value.some(variable => variable.prep_variableid === d.prep_variableid)
        })
      }
      return this.resultsFilteredByDatesStations.filter((d) => {
        return variables.value.some(variable => variable.prep_variableid === d.prep_variableid)
      })
    },
    valueCountByStation (): Map<number, number> {
      return rollup(
        this.resultsFilteredByDatesStationsVariables,
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
    valueCountQuantile () : (v: number) => number {
      return (v: number) => {
        return Math.floor(quantile(this.valueCountArray, v / 100)!)
      }
    },
    valueCountSelectedQuantiles (state): [number, number] {
      const lower = state.valueCountSelectedRange[0] === 0 ?
        this.valueCountMin :
        Math.floor(quantile(this.valueCountArray, state.valueCountSelectedRange[0] / 100)!)
      const upper = state.valueCountSelectedRange[1] === 100 ?
        this.valueCountMax :
        Math.ceil(quantile(this.valueCountArray, state.valueCountSelectedRange[1] / 100)!)
      return [lower, upper]
    },
    visibleStations () {
      return stations.value
        .filter(d => {
          if (!this.valueCountByStation) return true
          // @ts-ignore
          const value = this.valueCountByStation.get(d.samplingfeatureid)
          if (value === undefined) return false
          // @ts-ignore
          return value >= this.valueCountSelectedQuantiles[0] && value <= this.valueCountSelectedQuantiles[1]
        })
    },
    getResultsByStation: (state) => {
      return (station: Station | null) => {
        if (!station) return []
        return state.allResults.filter(result => result.samplingfeatureid === station.samplingfeatureid)
      }
    },
    getResultsByVariables: (state) => {
      return (variables: Variable[]) => state.allResults.filter(result => variables.some(variable => result.prep_variableid === variable.prep_variableid))
    }
  },
  actions: {
    async fetchResults () {
      this.allResults = await getResults()
    }
  },
})

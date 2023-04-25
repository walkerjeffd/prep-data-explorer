import { defineStore } from 'pinia'
import type Result from '../types/Result'
import type Station from '../types/Station'
import type Variable from '../types/Variable'
import { getResults } from '../services/results'

// const API_URL = import.meta.env.VITE_API_URL

export const useResultsStore = defineStore('results', {
  state: () => ({
    results: [] as Result[],
    result: null as Result | null,
  }),
  getters: {
    getResultsByStation: (state) => {
      return (station: Station) => state.results.filter(result => result.samplingfeatureid === station.samplingfeatureid)
    },
    getResultsByVariables: (state) => {
      return (variables: Variable[]) => state.results.filter(result => variables.some(variable => result.variable_id_pwde === variable.variable_id_pwde))
    }
  },
  actions: {
    async fetchResults () {
      this.results = await getResults()
    }
  },
})

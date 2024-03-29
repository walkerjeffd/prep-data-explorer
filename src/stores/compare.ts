import { defineStore } from 'pinia'
import type Result from '@/types/Result'

export const useCompareStore = defineStore('compare', {
  state: () => ({
    results: [] as Result[],
  }),
  getters: {
  },
  actions: {
    async addResult (result: Result) {
      if (this.results.map(d => d.prep_resultid).includes(result.prep_resultid)) return
      this.results.push(result)
    },
    async removeResult (result: Result) {
      this.results = this.results.filter(d => d !== result)
    },
    reset () {
      this.results = []
    }
  },
})

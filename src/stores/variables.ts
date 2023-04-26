import { defineStore } from 'pinia'
import type Variable from '../types/Variable'
import { getVariables } from '../services/variables'

export const useVariablesStore = defineStore('variables', {
  state: () => ({
    variables: [] as Variable[]
  }),
  getters: {
    getVariableById (state) {
      return (id: number) => state.variables.find(d => d.variableid_prep === id)
    },
    getVariableCodeById () {
      return (id: number) => {
        const variable = this.getVariableById(id)
        return variable?.variablenamecv
      }
    }
  },
  actions: {
    async fetchVariables () {
      this.variables = await getVariables()
    }
  },
})

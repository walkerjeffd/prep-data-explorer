import { defineStore } from 'pinia'
import type Variable from '../types/Variable'
import { getVariables } from '../services/variables'

export const useVariablesStore = defineStore('variables', {
  state: () => ({
    allVariables: [] as Variable[],
    selectedVariables: [] as Variable[],
    coreVariablesOnly: true,
  }),
  getters: {
    variables (state): Variable[] {
      if (!state.coreVariablesOnly) return state.allVariables
      return state.allVariables.filter(d => d.variablecore)
    },
    getVariableById (state) {
      return (id: number) => state.allVariables.find((d: Variable) => d.prep_variableid === id)
    },
    getVariableCodeById () {
      return (id: number) => {
        const variable = this.getVariableById(id)
        return variable?.variable_label
      }
    }
  },
  actions: {
    async fetchVariables () {
      this.allVariables = await getVariables()
    },
    async selectVariables (variables: Variable[]) {
      this.selectedVariables = variables
    }
  },
})

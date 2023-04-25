import { defineStore } from 'pinia'
import type Variable from '../types/Variable'
import { getVariables } from '../services/variables'

// const API_URL = import.meta.env.VITE_API_URL

export const useVariablesStore = defineStore('variables', {
  state: () => ({
    variables: [] as Variable[],
    variable: null as Variable | null,
  }),
  actions: {
    async fetchVariables () {
      this.variables = await getVariables()
    },
    selectVariable (id: number) {
      console.log("selectVariable", id)
      if (this.variable && this.variable.variable_id_pwde === id) {
        this.variable = null
      } else {
        const variable = this.variables.find(variable => variable.variable_id_pwde === id)
        if (variable) {
          this.variable = variable
        } else {
          throw new Error('Variable not found')
        }
      }
    }
  },
})

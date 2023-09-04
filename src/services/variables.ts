import type Variable from '@/types/Variable'

const API_URL = import.meta.env.VITE_API_URL

export async function getVariables (): Promise<Variable[]> {
  const response = await fetch(`${API_URL}/prep_variables`)
  if (!response.ok) {
    throw new Error('Failed to fetch variables')
  }
  const data = await response.json()
  for (const variable of data) {
    variable.variable_label = variable.unitsabbreviation ?
      `${variable.variablenamecv} (${variable.unitsabbreviation})` :
      variable.variablenamecv
  }
  return data
}

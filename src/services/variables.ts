import type Variable from '@/types/Variable'
const API_URL = import.meta.env.VITE_API_URL

export async function getVariables (): Promise<Variable[]> {
  const response = await fetch(`${API_URL}/variables`)
  if (!response.ok) {
    throw new Error('Failed to fetch variables')
  }
  return await response.json()
}

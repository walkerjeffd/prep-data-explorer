import type Result from '@/types/Result'
const API_URL = import.meta.env.VITE_API_URL

export async function getResults (): Promise<Result[]> {
  const response = await fetch(`${API_URL}/results`)
  if (!response.ok) {
    throw new Error('Failed to fetch results')
  }
  return await response.json()
}

import type Station from '@/types/Station'
const API_URL = import.meta.env.VITE_API_URL

export async function getStations (): Promise<Station[]> {
  const response = await fetch(`${API_URL}/stations`)
  if (!response.ok) {
    throw new Error('Failed to fetch stations')
  }
  return await response.json()
}

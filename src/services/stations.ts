import type Station from '@/types/Station'
const API_URL = import.meta.env.VITE_API_URL

export async function getStations (): Promise<Station[]> {
  const response = await fetch(`${API_URL}/prep_stations`)
  if (!response.ok) {
    throw new Error('Failed to fetch stations')
  }
  const data = await response.json()
  data.sort((a: Station, b: Station) => a.samplingfeaturecode < b.samplingfeaturecode ? -1 : 1)
  return data
}

import type Result from '@/types/Result'
import type Station from '@/types/Station'
const API_URL = import.meta.env.VITE_API_URL

export function filterResultsByVariableIds (items: Result[], variableIds: number[]) {
  if (variableIds.length === 0) return items

  return items.filter(item => variableIds.includes(item.prep_variableid))
}

export function filterResultsByStations (items: Result[], stations: Station[]) {
  if (stations.length === 0) return items
  const stationIds = stations.map(d => d.samplingfeatureid)
  return items.filter(item => stationIds.includes(item.samplingfeatureid))
}

export async function getResults (): Promise<Result[]> {
  const response = await fetch(`${API_URL}/prep_results`)
  if (!response.ok) {
    throw new Error('Failed to fetch results')
  }
  const data = await response.json()
  data.forEach((d: { start: string | Date, end: string | Date }) => {
    d.start = new Date(d.start)
    d.end = new Date(d.end)
  })
  return data
}

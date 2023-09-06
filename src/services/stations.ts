import type Station from '@/types/Station'
const API_URL = import.meta.env.VITE_API_URL

const CORE_STATION_CODES = [
  'GRBAP',
  'GRBCL',
  'GRBLR',
  'GRBCML',
  'GRBGB',
  'GRBGBE',
  'GRBGBW',
  'GRBOR',
  'GRBSF',
  'GRBSQ',
  'GRBULB',
  'GRBUPR',
  'HHHR',
  '02-GWR',
  '05-SFR',
  '07-CCH',
  '05-OYS',
  '05-LMP',
  '09-EXT',
  '05-BLM',
  '02-WNC'
]

export async function getStations (): Promise<Station[]> {
  const response = await fetch(`${API_URL}/prep_stations`)
  if (!response.ok) {
    throw new Error('Failed to fetch stations')
  }
  const data = await response.json()
  // TODO: move samplingfeaturecore to server
  data.forEach((d: Station) => {
    d.samplingfeaturecore = CORE_STATION_CODES.includes(d.samplingfeaturecode)
  })
  // sort data by samplingfeaturecode
  data.sort((a: Station, b: Station) => a.samplingfeaturecode < b.samplingfeaturecode ? -1 : 1)
  return data
}

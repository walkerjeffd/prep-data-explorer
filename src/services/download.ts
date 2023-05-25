import type Result from '@/types/Result'
import type Variable from '@/types/Variable'
import type Value from '@/types/Value'
import type Station from '@/types/Station'
// @ts-ignore
import { Parser } from '@json2csv/plainjs'
import { saveAs } from 'file-saver'

function currentTimestamp (): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}`;
}

const hr = '# ------------------------------------------------------------------------------'

function generateHeader () {
  const now = new Date()
  const body = `# PREP | Piscataqua Watershed Data Explorer
# https://prepestuaries.org/
#
# Downloaded at: ${now.toLocaleDateString('en-US', { timeZone: 'America/New_York' })} ${now.toLocaleTimeString('en-US', { timeZone: 'America/New_York' })}
#`
return body
}

export function downloadCsvFile (filename: string, body: string): void {
  const blob = new Blob([body], {type: 'text/csv;charset=utf-8'})
  saveAs(blob, filename)
}

function formatValueRow(station: Station | undefined, variable: Variable | undefined, value: Value | undefined) {
  return {
    station_id: station?.samplingfeatureid,
    station_code: station?.samplingfeaturecode,
    station_name: station?.samplingfeaturename,
    variable: variable?.variablenamecv,
    units: variable?.unitsabbreviation,
    datetime: value?.datetime,
    // TODO: find efficient date formatter
    // Date.to*String() are very slow (20 seconds each for GRBGB DO dataset, 300k rows)
    // datetime: value.datetime.toISOString(),
    // date: value.datetime.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
    // time: value.datetime.toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
    value: value?.value
  }
}

function formatStationRow(station: Station | undefined) {
  return {
    station_id: station?.samplingfeatureid,
    station_code: station?.samplingfeaturecode,
    station_name: station?.samplingfeaturename,
    station_description: station?.samplingfeaturedescription,
    latitude: station?.latitude,
    longitude: station?.longitude
  }
}

function generateStationsTable (stations: (Station | undefined)[]) {
  if (!stations.length) return

  const rows = stations.map(station => formatStationRow(station))

  const parser = new Parser()
  return parser.parse(rows)
}

function generateValuesTable (results: Result[]) {
  const rows = results
    .map(({station, variable, values}) => {
      if (!values?.length) return []
      return values?.map(value => formatValueRow(station, variable, value))
    })
    .flat()
  if (!rows.length) return

  const parser = new Parser()
  return parser.parse(rows)
}

export function downloadResults (results: Result[]) {
  const header = generateHeader()
  const stations = Array.from(new Set(results.map(({station}) => station)))
  const stationsTable = generateStationsTable(stations)
  const valuesTable = generateValuesTable(results)
  const body = `${header}
${hr}
# Stations Table
#
${stationsTable}
#
${hr}
# Values Table
#
${valuesTable}
  `
  const filename = `PREP_${currentTimestamp()}.csv`
  downloadCsvFile(filename, body)
}

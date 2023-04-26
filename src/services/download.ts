import type Result from '@/types/Result'
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

export function downloadResults (results: Result[]) {
  const header = generateHeader()
  const rows = results
    .map(({station, variable, values}) => {
      return values?.map(d => ({
        station_id: station?.samplingfeatureid,
        station_code: station?.samplingfeaturecode,
        station_name: station?.samplingfeaturename,
        variable: variable?.variablenamecv,
        units: variable?.unitsabbreviation,
        datetime: d.datetime?.toISOString(),
        date: d.datetime?.toLocaleDateString('en-US', { timeZone: 'America/New_York' }),
        time: d.datetime?.toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
        value: d.value
      }))
    })
    .flat()
  const parser = new Parser()
  const csv = parser.parse(rows)

  const body = `${header}
${hr}
${csv}
  `
  const filename = `PREP_${currentTimestamp()}.csv`
  downloadCsvFile(filename, body)
}

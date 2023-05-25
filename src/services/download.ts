import type ResultValues from '@/types/ResultValues'
import type Value from '@/types/Value'
import type Station from '@/types/Station'
// @ts-ignore
import { Parser } from '@json2csv/plainjs'
import { saveAs } from 'file-saver'
import { useStationsStore } from '@/stores/stations'

const { getStationById } = useStationsStore()

function currentTimestamp (): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}`;
}

function hr (n: number): string {
  return `# ${Array(n).fill('-').join('')}`
}

function writeHeader () {
  const now = new Date()
  const body = `# Piscataqua Watershed Data Explorer
# Piscataqua Region Estuaries Partnership (PREP)
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

function writeTable (data: any[]) {
  if (!data.length) return
  const parser = new Parser()
  return parser.parse(data)
}

export function downloadFile (resultValues: ResultValues[]) {
  const results = resultValues.map(({ values, ...d }) => d) // eslint-disable-line @typescript-eslint/no-unused-vars
  results.sort((a: any, b: any) => a.resultid - b.resultid)
  const stations: Station[] = [...new Set(resultValues.map((d: ResultValues) => getStationById(d.samplingfeatureid)!))]
  stations.sort((a: Station, b: Station) => a.samplingfeatureid - b.samplingfeatureid)
  const values = resultValues
    .map((d: ResultValues) => {
      return d.values.map((v: Value) => ({
        resultid: d.resultid,
        samplingfeatureid: d.samplingfeatureid,
        samplingfeaturecode: d.samplingfeaturecode,
        variablenamecv: d.variablenamecv,
        unitsabbreviation: d.unitsabbreviation,
        valueid: v.valueid,
        valuedatetime: v.valuedatetime,
        valuedatetimeutcoffset: v.valuedatetimeutcoffset,
        datavalue: v.datavalue,
        censorcodecv: v.censorcodecv,
      })).sort((a, b) => (new Date(a.valuedatetime)).valueOf() - (new Date(b.valuedatetime)).valueOf())
    })
    .sort((a, b) => a[0].resultid - b[0].resultid)
    .flat()

  const body = `${writeHeader()}
${hr(200)}
# Stations
#
${writeTable(stations)}
${hr(200)}
# Sampling Metadata
#
${writeTable(results)}
${hr(200)}
# Values
#
${writeTable(values)}
  `
  const filename = `PREP_${currentTimestamp()}.csv`
  downloadCsvFile(filename, body)
}

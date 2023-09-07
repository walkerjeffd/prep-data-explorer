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
# http://data.prepestuaries.org/data-explorer/
#
# Downloaded at: ${now.toLocaleDateString('en-US', { timeZone: 'America/New_York' })} ${now.toLocaleTimeString('en-US', { timeZone: 'America/New_York' })}
#
# Reference: The PREP database is based on the Observations Data Model v2 (ODM2) schema. See https://www.odm2.org/ for more information about the tables and columns in this file.
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
      return d.values.map(function mapValue (v: Value) {
        return {
          resultid: d.resultid,
          samplingfeatureid: d.samplingfeatureid,
          samplingfeaturecode: d.samplingfeaturecode,
          variablenamecv: d.variablenamecv,
          unitsabbreviation: d.unitsabbreviation,
          valueid: v.valueid,
          valuedatetime: v.valuedatetime_string.replace('T', ' '),
          valuedatetimeutcoffset: v.valuedatetimeutcoffset,
          datavalue: v.datavalue,
          censorcodecv: v.censorcodecv,
        }
      })
      // @ts-ignore
      .sort((a, b) => a.valuedatetime.valueOf() - b.valuedatetime.valueOf())
    })
    .sort((a, b) => a[0].resultid - b[0].resultid)
    .flat()

  const body = `${writeHeader()}
${hr(200)}
# Sampling Features Table (Stations)
#
${writeTable(stations)}
${hr(200)}
# Results Table (Sampling Metadata)
#
${writeTable(results)}
${hr(200)}
# Timeseries Values Table (Measurements)
#
${writeTable(values)}
  `
  const filename = `PREP_${currentTimestamp()}.csv`
  downloadCsvFile(filename, body)
}

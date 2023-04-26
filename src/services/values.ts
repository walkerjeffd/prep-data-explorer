import type Value from '@/types/Value'
import type Station from '@/types/Station'
import type Variable from '@/types/Variable'
const API_URL = 'http://data.prepestuaries.org:3001'

export async function getValues (station: Station, variable: Variable): Promise<Value[]> {
  const response = await fetch(`${API_URL}/results?featureaction.samplingfeatureid=eq.${station.samplingfeatureid}&variable.variablenamecv=eq.${variable.variablenamecv}&unitsid=eq.${variable.unitsid}&select=*,variable:variables!inner(*),featureaction:featureactions!inner(*),timeseriesresults(*,timeseriesresultvalues(*))`)
  if (!response.ok) {
    throw new Error('Failed to fetch values')
  }
  const data = await response.json()
  const values = data
    // @ts-ignore
    .map(d => d.timeseriesresults.timeseriesresultvalues.map((d: { valuedatetime: string, datavalue: number }) => ({
      datetime: new Date(d.valuedatetime),
      value: d.datavalue,
    })))
    .flat()
    .sort((a: Value, b: Value) => a.datetime.getTime() - b.datetime.getTime())
  return values
}

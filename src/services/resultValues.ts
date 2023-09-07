import type ResultValues from '@/types/ResultValues'
import type Station from '@/types/Station'
import type Value from '@/types/Value'
import type Variable from '@/types/Variable'

const API_URL = import.meta.env.VITE_API_URL

export async function getResultValues (stations: Station[],
                                       variable: Variable,
                                       start: string | null,
                                       end: string | null): Promise<ResultValues[]> {
  const stationIds = stations.map(station => station.samplingfeatureid).join(',')
  let queryDates = ''
  if (start) {
    queryDates += `&timeseriesresults.timeseriesresultvalues.valuedatetime=gte.${start}`
  }
  if (end) {
    queryDates += `&timeseriesresults.timeseriesresultvalues.valuedatetime=lte.${end}+23:59:59.999Z`
  }
  const response = await fetch(`${API_URL}/results?featureaction.samplingfeatureid=in.(${stationIds})&variable.variablenamecv=eq.${encodeURIComponent(variable.variablenamecv)}&variable.variabletypecv=in.(Hydrology,Water quality)&unitsid=eq.${variable.unitsid}&timeseriesresults.timeseriesresultvalues.qualitycodecv=neq.Bad&timeseriesresults.timeseriesresultvalues.datavalue=neq.NaN${queryDates}&select=*,variable:variables!inner(*),units:units!inner(*),featureaction:featureactions!inner(*,samplingfeature:samplingfeatures(*),action:actions(*,method:methods(*))),timeseriesresults(*,timeseriesresultvalues(valueid,resultid,datavalue,valuedatetime,valuedatetimeutcoffset,censorcodecv))`)
  if (!response.ok) {
    throw new Error('Failed to fetch values')
  }
  const data = await response.json()
  return data
    .filter((d: any) => d?.timeseriesresults?.timeseriesresultvalues.length > 0)
    .map((d: any) => {
      d.timeseriesresults.timeseriesresultvalues.forEach((d: any) => {
        d.valuedatetime_string = d.valuedatetime
        d.valuedatetime = new Date(d.valuedatetime)
      })
      const values = d.timeseriesresults
        .timeseriesresultvalues
        .sort((a: Value, b: Value) => {
          return a.valuedatetime.valueOf() - b.valuedatetime.valueOf()
        })
      return {
        resultid: d.resultid,
        featureactionid: d.featureactionid,
        samplingfeatureid: d.featureaction.samplingfeature.samplingfeatureid,
        samplingfeaturecode: d.featureaction.samplingfeature.samplingfeaturecode,
        actionid: d.featureaction.action.actionid,
        actiondescription: d.featureaction.action.actiondescription,
        actiontypecv: d.featureaction.action.actiontypecv,
        variableid: d.variable.variableid,
        variablecode: d.variable.variablecode,
        variabledefinition: d.variable.variabledefinition,
        variablenamecv: d.variable.variablenamecv,
        variabletypecv: d.variable.variabletypecv,
        unitsid: d.unitsid,
        unitsabbreviation: d.units.unitsabbreviation,
        methodid: d.featureaction.action.method.methodid,
        methodcode: d.featureaction.action.method.methodcode,
        methodname: d.featureaction.action.method.methodname,
        methoddescription: d.featureaction.action.method.methoddescription,
        methodtypecv: d.featureaction.action.method.methodtypecv,
        values
      }
    })
    .sort((a: ResultValues, b: ResultValues) => a.resultid - b.resultid)
}

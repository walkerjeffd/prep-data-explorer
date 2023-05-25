import type Value from '@/types/Value'

export default interface ResultValues {
  resultid: number
  featureactionid: number
  samplingfeatureid: number
  samplingfeaturecode: string
  actionid: number
  actiondescription: string
  actiontypecv: string
  variableid: number
  variablecode: string
  variabledefinition: string
  variablenamecv: string
  variabletypecv: string
  unitsid: number
  unitsabbreviation: string
  methodid: number
  methodcode: string
  methodname: string
  methoddescription: string
  methodtypecv: string
  values: Value[]
}
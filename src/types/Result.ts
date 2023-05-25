import type ResultValues from '@/types/ResultValues'
import type Station from '@/types/Station'
import type Variable from '@/types/Variable'

export default interface Result {
  resultid_prep: number
  samplingfeatureid: number
  samplingfeaturecore: boolean
  variableid_prep: number
  start: Date
  end: Date
  n_values: number
  variable?: Variable
  station?: Station
  resultValues?: ResultValues[]
}
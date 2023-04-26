import type Value from './Value'
import type Variable from './Variable'
import type Station from './Station'

export default interface Result {
  resultid_prep: number
  samplingfeatureid: number
  variableid_prep: number
  start: Date
  end: Date
  n_values: number,
  visible?: boolean
  values?: Value[],
  variable?: Variable,
  station?: Station
}
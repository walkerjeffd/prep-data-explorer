import type L from 'leaflet'

interface onEachFeatureFunction {
  (feature, layer: L.Layer): void
}
interface styleFunction {
  (feature): {}
}

export default interface MapOverlay {
  id: string
  title: string
  visible: boolean
  url: string
  interactive: boolean
  onEachFeature: onEachFeatureFunction
  style: styleFunction
  legend?: {
    byFeature: boolean,
    featureLabel: string
  }
}
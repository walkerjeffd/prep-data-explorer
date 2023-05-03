import { schemeTableau10 } from 'd3-scale-chromatic'

export default [
  {
    name: 'Basin',
    visible: false,
    style: () => ({
      fillOpacity: 0
    }),
    options: {
      url: 'gis/basin.geojson',
      interactive: false
    }
  },
  {
    name: 'HUC12 Basins',
    visible: false,
    style: () => ({
      fillOpacity: 0,
      weight: 2
    }),
    options: {
      interactive: false,
      url: 'gis/huc12.geojson'
    }
  },
  {
    name: 'Waterbody Regions',
    visible: false,
    style: (feature: { id: number }) => ({
      weight: 2,
      color: schemeTableau10[feature.id]
    }),
    options: {
      interactive: false,
      url: 'gis/regions.geojson'
    }
  }
]

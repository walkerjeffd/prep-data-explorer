import { schemeTableau10 } from 'd3-scale-chromatic'
import type L from 'leaflet'

export default [
  {
    style: () => ({
      fillOpacity: 0
    }),
    options: {
      id: 'basin',
      title: 'PREP Basin',
      visible: true,
      url: 'gis/basin.geojson',
      interactive: false,
      onEachFeature: function (feature: { }, layer: L.Layer) {
        layer.bindTooltip('PREP Basin', { sticky: true })
      }
    }
  },
  {
    style: () => ({
      fillOpacity: 0,
      color: schemeTableau10[2],
      weight: 2
    }),
    options: {
      id: 'huc12',
      title: 'HUC12 Basins',
      visible: false,
      interactive: true,
      url: 'gis/huc12.geojson',
      onEachFeature: function (feature: { properties: { Name: string, HUC12: string } }, layer: L.Layer) {
        layer.bindTooltip(`${feature.properties.Name} (${feature.properties.HUC12})`, { sticky: true })
      }
    }
  },
  {
    options: {
      id: 'regions',
      title: 'Waterbody Regions',
      visible: false,
      interactive: true,
      url: 'gis/regions.geojson',
      onEachFeature: function (feature: { properties: { name: string } }, layer: L.Layer) {
        layer.bindTooltip(feature.properties.name, { sticky: true })
      },
      legend: {
        byFeature: true,
        featureLabel: 'name'
      }
    },
    style: (feature: { id: number }) => ({
      weight: 2,
      color: schemeTableau10[feature.id]
    })
  },
  {
    options: {
      id: 'eelgrass-2010',
      title: 'Eelgrass (2010)',
      visible: false,
      interactive: false,
      url: 'gis/eelgrass/Great_Bay_Estuary_Eelgrass_-_2010.geojson'
    },
    style: () => ({
      weight: 1,
      color: schemeTableau10[1]
    })
  },
  {
    options: {
      id: 'eelgrass-2015',
      title: 'Eelgrass (2015)',
      visible: false,
      interactive: false,
      url: 'gis/eelgrass/Great_Bay_Estuary_Eelgrass_-_2015.geojson'
    },
    style: () => ({
      weight: 1,
      color: schemeTableau10[1]
    })
  },
  {
    options: {
      id: 'eelgrass-2021',
      title: 'Eelgrass (2021)',
      visible: false,
      interactive: false,
      url: 'gis/eelgrass/Great_Bay_Estuary_Eelgrass_-_2021.geojson'
    },
    style: () => ({
      weight: 1,
      color: schemeTableau10[1]
    })
  }
]

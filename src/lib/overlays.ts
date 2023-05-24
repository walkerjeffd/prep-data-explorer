import { schemeTableau10 } from 'd3-scale-chromatic'
import type L from 'leaflet'

export default [
  {
    name: 'Basin',
    visible: true,
    style: () => ({
      fillOpacity: 0
    }),
    options: {
      visibleOnLoad: true,
      url: 'gis/basin.geojson',
      interactive: false,
      onEachFeature: function (feature: { }, layer: L.Layer) {
        layer.bindTooltip('PREP Basin', { sticky: true })
      }
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
      interactive: true,
      url: 'gis/huc12.geojson',
      onEachFeature: function (feature: { properties: { Name: string, HUC12: string } }, layer: L.Layer) {
        layer.bindTooltip(`${feature.properties.Name} (${feature.properties.HUC12})`, { sticky: true })
      }
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
      interactive: true,
      url: 'gis/regions.geojson',
      onEachFeature: function (feature: { properties: { name: string } }, layer: L.Layer) {
        layer.bindTooltip(feature.properties.name, { sticky: true })
      }
    }
  },
  {
    name: 'Eelgrass (2010)',
    visible: false,
    style: () => ({
      weight: 1,
      color: schemeTableau10[1]
    }),
    options: {
      interactive: false,
      visibleOnLoad: false,
      url: 'gis/eelgrass/Great_Bay_Estuary_Eelgrass_-_2010.geojson'
    }
  },
  {
    name: 'Eelgrass (2015)',
    visible: false,
    style: () => ({
      weight: 1,
      color: schemeTableau10[1]
    }),
    options: {
      interactive: false,
      visibleOnLoad: false,
      url: 'gis/eelgrass/Great_Bay_Estuary_Eelgrass_-_2015.geojson'
    }
  },
  {
    name: 'Eelgrass (2021)',
    visible: false,
    style: () => ({
      weight: 1,
      color: schemeTableau10[1]
    }),
    options: {
      interactive: false,
      visibleOnLoad: false,
      url: 'gis/eelgrass/Great_Bay_Estuary_Eelgrass_-_2021.geojson'
    }
  }
]

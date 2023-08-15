import { schemeTableau10 } from 'd3-scale-chromatic'
import type L from 'leaflet'

export default [
  {
    id: 'basin',
    title: 'PREP Basin',
    visible: true,
    url: 'gis/basin.geojson',
    interactive: false,
    onEachFeature: function (feature: { }, layer: L.Layer) {
      layer.bindTooltip('PREP Basin', { sticky: true })
    },
    style: () => ({
      fillOpacity: 0
    }),
  },
  {
    id: 'huc10',
    title: 'HUC10 Basins',
    interactive: true,
    url: 'gis/huc10.geojson',
    onEachFeature: function (feature: { properties: { Name: string, HUC10: string } }, layer: L.Layer) {
      layer.bindTooltip(`${feature.properties.Name} (HUC10 ${feature.properties.HUC10})`, { sticky: true })
    },
    style: () => ({
      fillOpacity: 0,
      color: schemeTableau10[5],
      weight: 2
    }),
  },
  {
    id: 'huc12',
    title: 'HUC12 Basins',
    interactive: true,
    url: 'gis/huc12.geojson',
    onEachFeature: function (feature: { properties: { Name: string, HUC12: string } }, layer: L.Layer) {
      layer.bindTooltip(`${feature.properties.Name} (HUC12 ${feature.properties.HUC12})`, { sticky: true })
    },
    style: () => ({
      fillOpacity: 0,
      color: schemeTableau10[2],
      weight: 2
    }),
  },
  {
    id: 'regions',
    title: 'Waterbody Regions',
    interactive: true,
    url: 'gis/regions.geojson',
    onEachFeature: function (feature: { properties: { name: string } }, layer: L.Layer) {
      layer.bindTooltip(feature.properties.name, { sticky: true })
    },
    style: (feature: { id: number }) => ({
      weight: 2,
      color: schemeTableau10[feature.id]
    }),
    legend: {
      byFeature: true,
      featureLabel: 'name'
    },
  },
  {
    id: 'towns',
    title: 'Towns and Municipalities',
    interactive: true,
    url: 'gis/towns.geojson',
    onEachFeature: function (feature: { properties: { name: string } }, layer: L.Layer) {
      layer.bindTooltip(`${feature.properties.name}, ${feature.properties.state}`, { sticky: true })
    },
    style: () => ({
      weight: 2,
      fillOpacity: 0,
      color: schemeTableau10[4]
    })
  },
  {
    id: 'eelgrass-2010',
    title: 'Eelgrass (2010)',
    interactive: false,
    url: 'gis/eelgrass/Great_Bay_Estuary_Eelgrass_-_2010.geojson',
    style: () => ({
      weight: 1,
      color: schemeTableau10[1]
    })
  },
  {
    id: 'eelgrass-2015',
    title: 'Eelgrass (2015)',
    interactive: false,
    url: 'gis/eelgrass/Great_Bay_Estuary_Eelgrass_-_2015.geojson',
    style: () => ({
      weight: 1,
      color: schemeTableau10[2]
    })
  },
  {
    id: 'eelgrass-2021',
    title: 'Eelgrass (2021)',
    interactive: false,
    url: 'gis/eelgrass/Great_Bay_Estuary_Eelgrass_-_2021.geojson',
    style: () => ({
      weight: 1,
      color: schemeTableau10[3]
    })
  },
]

import type L from 'leaflet'

export function parseDate (dateString: string): Date {
  const parts = dateString.split('-').map(d => Number(d))
  return new Date(parts[0], parts[1] - 1, parts[2])
}

export function distance (start: L.Point, end: L.Point) {
  return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2))
}

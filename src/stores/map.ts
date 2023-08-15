import { defineStore } from 'pinia'
import overlays from '@/lib/overlays'

export const useMapStore = defineStore('map', {
  state: () => ({
    overlays,
    selectedOverlays: overlays.filter(d => d.visible),
  })
})

import type Result from '@/types/Result'
const API_URL = import.meta.env.VITE_API_URL

export async function getResults (): Promise<Result[]> {
  const response = await fetch(`${API_URL}/prep_results`)
  if (!response.ok) {
    throw new Error('Failed to fetch results')
  }
  const data = await response.json()
  data.forEach((d: { start: string | Date, end: string | Date }) => {
    d.start = new Date(d.start)
    d.end = new Date(d.end)
  })
  return data
}

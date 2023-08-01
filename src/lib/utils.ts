export function parseDate (dateString: string): Date {
  const parts = dateString.split('-').map(d => Number(d))
  return new Date(parts[0], parts[1] - 1, parts[2])
}

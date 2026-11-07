import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function formatRemainingTime(date: string): string {
  const target = new Date(date)

  if (target.getTime() <= Date.now()) {
    return 'Finalizada'
  }

  return formatDistanceToNow(target, {
    addSuffix: true,
    locale: es,
  })
}

export function formatDateTimeLocal(date: string): string {
  return format(new Date(date), "yyyy-MM-dd'T'HH:mm")
}

export function toUtcISOString(date: string): string {
  return new Date(date).toISOString()
}
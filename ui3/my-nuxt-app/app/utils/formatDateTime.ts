/**
 * 格式化日期时间 (YYYY-MM-DD HH:mm:ss)
 */
import dayjs from 'dayjs'

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

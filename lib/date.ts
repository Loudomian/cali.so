import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export function getDate(timezone = 'Asia/Shanghai'): dayjs.Dayjs {
  return dayjs().tz(timezone)
}

export function formatDate(date: string | Date, format = 'YYYY年MM月DD日 HH:mm'): string {
  return dayjs(date).tz('Asia/Shanghai').format(format)
}

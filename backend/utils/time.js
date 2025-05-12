import { DateTime } from 'luxon'

export function getNowDate() {
    const now = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
    return now
}

import { DateTime } from 'luxon'

export function getNowDate() {
    const now = DateTime.now().setZone('Asia/Seoul').toFormat('yyyy-MM-dd HH:mm:ss')
    return now
}

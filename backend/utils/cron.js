import { STATE_ACTIVE_ON, STATE_RESERVED, ACTIVE_ON_COMPLETE} from '../constants/state.js'
import cron from 'node-cron'
import db from "../mysql/db.js"

const activeCronJobs = new Map()

// 예약 작업 스케줄링 함수
export function reserveCron(id, reservedDate) {
    const cronDate = getCronDateFormat(reservedDate)
    const logDate  = getLogDateFormat(reservedDate)
    const jobKey   = `site_setting_${id}`

    // 이미 동일 id의 예약 작업이 있다면 중지하고 제거
    deleteCron(id)

    // 예약된 시간에 실행될 cron 작업 추가
    const job = cron.schedule(cronDate, async () => { 
        const [results] = await db.query('UPDATE site_setting SET active_state = ? WHERE id = ?', [STATE_ACTIVE_ON, id])
        if (results.affectedRows === 0) {
            console.error(`[UPDATE ERROR] scheduled site_setting with id: ${id}`)
            return
        }

        const [updateRes] = await db.query('UPDATE site_setting_reserved SET reserved_state = ? WHERE settings_id = ?', [ACTIVE_ON_COMPLETE, id])
        if (updateRes.affectedRows === 0) {
            console.error(`[UPDATE ERROR] site_setting_reserves, settings_id: ${id}`)
            return
        }

        // 작업 완료 후 cron 중지
        deleteCron(id)
        console.log(`[ACTIVE ON] complete site_setting id: ${id} at ${logDate}`)
        return
    })

    // 활성화된 작업 관리
    activeCronJobs.set(jobKey, job)
    console.log(`[RESERVE SETTING] site_setting id: ${id} at ${logDate}`)
    return
}

export function deleteCron(id) {
    const jobKey = `site_setting_${id}`

    if (activeCronJobs.has(jobKey)) {
        activeCronJobs.get(jobKey).stop()
        activeCronJobs.delete(jobKey)
        console.log(`[DELETE CRON] reserved site_setting id: ${id}`)
    }

    return
}

export async function resumeReservedCrons() {
    const joinQuery = `SELECT reserved.settings_id, reserved.reserved_date
                       FROM site_setting_reserved AS reserved
                       JOIN site_setting AS setting ON reserved.settings_id = setting.id
                       WHERE setting.active_state = ?`  

    const [rows] = await db.query(joinQuery, [STATE_RESERVED])
    if (rows.length === 0) {
        console.log('[CRON RESUME] No reserved crons found.')
        return
    }
  
    for (const row of rows) {
        if (isReservedPastTime(row.reserved_date)) {
            immediateActivateSetting(row)
            continue
        }

        reserveCron(row.settings_id, row.reserved_date)
        console.log(`[CRON RESUME] site_setting id: ${row.settings_id}`)
    }

    return
}

export function isReservedPastTime(reservedDate) {
    const now = new Date()

    if (new Date(reservedDate) <= now) {
        return true
    }

    return false
}

// 외부에서 에러 catch 하도록 명시적 에러 throw
async function immediateActivateSetting(row) {
    const [settingRes]  = await db.query('UPDATE site_setting SET active_state = ? WHERE id = ?', [STATE_ACTIVE_ON, row.settings_id])
    if (settingRes.affectedRows === 0) {
        throw new Error(`[CRON IMMEDIATE ERROR] update site_setting error, site_setting id: ${row.settings_id}`)
    }
    
    const [reservedRes] = await db.query('UPDATE site_setting_reserved SET reserved_state = ? WHERE settings_id = ?', [ACTIVE_ON_COMPLETE, row.settings_id])
    if (reservedRes.affectedRows === 0) {
        throw new Error(`[CRON IMMEDIATE ERROR] update site_setting_reserved error, site_setting id: ${row.settings_id}`)
    }

    console.log(`[CRON IMMEDIATE] site_setting id: ${row.settings_id} (past reserved_date: ${row.reserved_date})`)
    return
}

function getCronDateFormat(reservedDate) {
    const date = new Date(reservedDate)

    const minute  = date.getMinutes()
    const hour    = date.getHours()    
    const day     = date.getDate()
    const month   = date.getMonth() + 1    // 월은 0부터 시작하므로 +1
    const weekDay = '*'                    // 특정 요일이 필요하지 않으면 * 사용

    return `${minute} ${hour} ${day} ${month} ${weekDay}`
}

function getLogDateFormat(date) {
    if (typeof date === 'string') {
        return date.replace('T', ' ')
    }

    return String(date).replace('T', ' ')
}

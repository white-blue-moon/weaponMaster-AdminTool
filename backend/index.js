import db from './mysql/db.js'
import express from 'express'
import cors from 'cors'
import cron from 'node-cron'
import { DateTime } from 'luxon'


const app = express()
const port = 7770

const activeCronJobs = new Map() // 활성화된 예약 작업을 관리하기 위한 Map
const STATE_ACTIVE_ON = 1    // TODO 상수 파일 따로 관리하기
const STATE_RESERVED = 2     // TODO 상수 파일 따로 관리하기
const ACTIVE_ON_BEFORRE  = 0 // TODO 상수 파일 따로 관리하기
const ACTIVE_ON_COMPLETE = 1 // TODO 상수 파일 따로 관리하기

app.use(cors())         // 다른 도메인에서의 요청을 허용(CORS 정책 적용)
app.use(express.json()) // 요청 본문(JSON 형식)을 파싱하여 req.body에 저장

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
};

// TODO DB 에러처리 필요, 반환 값 공통화 필요
app.post('/site_setting', asyncHandler(async (req, res) => {
    const { siteSetting, reservedDate } = req.body
    if (!siteSetting || typeof siteSetting !== 'object') {
        return res.status(400).send({ message: '[INSERT ERROR] Invalid input. Please provide a valid siteSetting object.' })
    }

    const state = siteSetting.active_state
    const title = siteSetting.settings_comment
    const settings = JSON.stringify(siteSetting.settings)
    if (state === undefined || !settings) {
        return res.status(400).send({ message: '[INSERT ERROR] Missing required fields: active_state or settings.' })
    }

    const [results] = await db.query('INSERT INTO site_setting (active_state, settings_comment, settings) VALUES (?, ?, ?)', [state, title || null, settings])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[INSERT ERROR] site_setting` })
    }

    // 예약 상태로 요청 시 예약 내역 등록
    const id = results.insertId
    if (state == STATE_RESERVED) {
        // 예약 내역 DB 데이터 추가
        const [insertRes] = await db.query('INSERT site_setting_reserved (settings_id, reserved_date) values (?, ?)', [id, reservedDate])
        if (insertRes.affectedRows === 0) {
            return res.status(404).send({ message: `[INSERT ERROR] site_setting_reserved, settings_id: ${id}` })
        }
    
        // 에약 내역 cron 등록
        reserveCron(id, reservedDate)
    }

    res.send({ success: true })
}))

app.get('/site_setting/list', asyncHandler(async (req, res) => {
    const [siteSettings] = await db.query('SELECT * FROM site_setting ORDER BY id DESC')
    const [reservedRes]  = await db.query('SELECT * FROM site_setting_reserved')

    res.json({
        siteSettings:  siteSettings,
        reservedInfo:  reservedRes,
    })
}))

app.get('/site_setting/last', asyncHandler(async (req, res) => {
    // 가장 최근 생성된 홈페이지 설정 조회
    const [results] = await db.query('SELECT * FROM site_setting ORDER BY id DESC LIMIT 1')
    if (results.length === 0) {
        return res.status(404).send({ message: `[SELECT ERROR] No last site_setting found` })
    }

    // 예약 내역 존재 시 조회
    const siteSetting = results[0]
    let reservedDate
    if (siteSetting.active_state == STATE_RESERVED) {
       const [reservedRes] = await db.query('SELECT * FROM site_setting_reserved WHERE settings_id = ?', [siteSetting.id])
       if (reservedRes.length === 0) {
           return res.status(404).send({ message: `[SELECT ERROR] No site_setting_reserved found with settings_id ${siteSetting.id}` })
       }

       reservedDate = reservedRes.reserved_date
    }

    res.json({
        siteSetting:  siteSetting,
        reservedDate: reservedDate,
    })
}))

app.get('/site_setting/:id', asyncHandler(async (req, res) => {
     const { id } = req.params

     // 홈페이지 설정 조회
     const [results] = await db.query('SELECT * FROM site_setting WHERE id = ?', [id])
     if (results.length === 0) {
         return res.status(404).send({ message: `[SELECT ERROR] No site_setting found with id ${id}` })
     }

     // 예약 내역 존재 시 조회
     const siteSetting = results[0]
     let reservedDate
     if (siteSetting.active_state == STATE_RESERVED) {
        const [reservedRes] = await db.query('SELECT * FROM site_setting_reserved WHERE settings_id = ?', [id])
        if (reservedRes.length === 0) {
            return res.status(404).send({ message: `[SELECT ERROR] No site_setting_reserved found with settings_id ${id}` })
        }

        reservedDate = reservedRes[0].reserved_date
     }

     res.json({
        siteSetting:  siteSetting,
        reservedDate: reservedDate,
    })
}))

app.put('/site_setting/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { siteSetting, reservedDate } = req.body
    
    const state = siteSetting.active_state
    const title = siteSetting.settings_comment
    const settings = JSON.stringify(siteSetting.settings)

    // 1. 기존 state 값 확인
    const [selectRes] = await db.query('SELECT * FROM site_setting WHERE id = ?', [id])
    if (selectRes.length === 0) {
        return res.status(404).send({ message: `[SELECT ERROR] No site_setting found with id ${id}` })
    }

    // 2-1. 예약 -> 바뀜 (예약 내역 제거하기)
    if (selectRes[0].active_state == STATE_RESERVED && selectRes[0].active_state != state) {
        // 예약 내역 DB 데이터 제거
        const [deleteRes] = await db.query('DELETE FROM site_setting_reserved WHERE settings_id = ?', [id])
        if (deleteRes.affectedRows === 0) {
            return res.status(404).send({ message: `[DELETE ERROR] site_setting_reserved, settings_id: ${id}` })
        }

        // 에약 내역 cron 데이터 제거
        deleteCron(id)
    }

    // 2-2. 예약 아님 -> 예약 (예약 내역 추가하기)
    if (selectRes[0].active_state != STATE_RESERVED && state == STATE_RESERVED) {
        const [reservedRes] = await db.query('SELECT * FROM site_setting_reserved WHERE settings_id = ?', [id])
        
        // DB 내역 없으면 추가
        if (reservedRes.length === 0) {
            const [insertRes] = await db.query('INSERT site_setting_reserved (settings_id, reserved_date) values (?, ?)', [id, reservedDate])
            if (insertRes.affectedRows === 0) {
                return res.status(404).send({ message: `[INSERT ERROR] site_setting_reserved, settings_id: ${id}` })
            }
        }

        // DB 에 추가한 적 있었으면 UPDATE
        if (reservedRes.length !== 0) {
            const [updateRes] = await db.query('UPDATE site_setting_reserved SET reserved_date = ?, reserved_state = ? WHERE settings_id = ?', [reservedDate, ACTIVE_ON_BEFORRE, id])
            if (updateRes.affectedRows === 0) {
                console.error(`[UPDATE ERROR] site_setting_reserves, settings_id: ${id}`)
                return
            }
        }

        // 에약 내역 cron 등록
        reserveCron(id, reservedDate)
    }

    // 2-3. 예약 -> 예약 시간 변경 (예약 내역 업데이트)
    if (selectRes[0].active_state == STATE_RESERVED && state == STATE_RESERVED) {
        if (selectRes[0].reserved_date != reservedDate) {
            const [updateRes] = await db.query('UPDATE site_setting_reserved SET reserved_date = ?, reserved_state = ? WHERE settings_id = ?', [reservedDate, ACTIVE_ON_BEFORRE, id])
            if (updateRes.affectedRows === 0) {
                console.error(`[UPDATE ERROR] site_setting_reserves, settings_id: ${id}`)
                return
            }
    
            // 에약 내역 cron 갱신
            reserveCron(id, reservedDate)
        }  
    }

    // 3. site_setting 업데이트
    const [updateRes] = await db.query('UPDATE site_setting SET active_state = ?, settings_comment = ?, settings = ? WHERE id = ?', [state, title, settings, id])
    if (updateRes.affectedRows === 0) {
        return res.status(404).send({ message: `[UPDATE ERROR] site_setting with id ${id}` })
    }

    res.send({ success: true })
}))

app.delete('/site_setting/:id', asyncHandler(async (req, res) => {
    const { id } = req.params

    // 1. 예약 여부 확인
    const [selectRes] = await db.query('SELECT * FROM site_setting WHERE id = ?', [id])
    if (selectRes.length === 0) {
        return res.status(404).send({ message: `[SELECT ERROR] No site_setting found with id ${id}` })
    }

    // 2. 예약 내역 존재 시 예약 내역 삭제
    if (selectRes[0].active_state == STATE_RESERVED) {
        // DB 쪽 예약 내역 삭제
        const [deleteRes] = await db.query('DELETE FROM site_setting_reserved WHERE settings_id = ?', [id])
        if (deleteRes.affectedRows === 0) {
            return res.status(404).send({ message: `[DELETE ERROR] site_setting_reserved with settings_id ${id}` })
        }

        // cron 쪽 예약 내역 삭제
        deleteCron(id)
    }

    // 3. 홈페이지 설정값 삭제
    const [results] = await db.query('DELETE FROM site_setting WHERE id = ?', [id])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[DELETE ERROR] site_setting with id ${id}` })
    }

    res.send({ success: true })
}))

app.get('/access_level/list', asyncHandler(async (req, res) => {
    const [results] = await db.query('SELECT * FROM user_info ORDER BY id DESC')

    res.json({
        userInfoList:  results,
    })
}))

app.get('/access_level/:id', asyncHandler(async (req, res) => {
    const { id } = req.params

    const [results] = await db.query('SELECT * FROM user_info WHERE id = ?', [id])
    if (results.length === 0) {
        return res.status(404).send({ message: `[SELECT ERROR] No user_info found with id ${id}` })
    }

    res.json({
       userInfo: results[0],
   })
}))

app.put('/access_level/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { setting } = req.body

    const [updateRes] = await db.query('UPDATE user_info SET user_type = ?, user_id = ? WHERE id = ?', [setting.state, setting.title, id])
    if (updateRes.affectedRows === 0) {
        return res.status(404).send({ message: `[UPDATE ERROR] user_info with id ${id}` })
    }

    res.send({ success: true })
}))

app.delete('/access_level/:id', asyncHandler(async (req, res) => {
    const { id } = req.params

    const [results] = await db.query('DELETE FROM user_info WHERE id = ?', [id])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[DELETE ERROR] user_info with id ${id}` })
    }

    res.send({ success: true })
}))

app.get('/insepction/active', asyncHandler(async (req, res) => {
    let isInspectionOn = false
    let inspection

    const now = getNowDate()
    const [results] = await db.query('SELECT * FROM inspection WHERE active_state = ? AND (start_date <= ? AND ? <= end_date)', [STATE_ACTIVE_ON, now, now])
    if (results.length > 0) {
        isInspectionOn = true
        inspection = results[0]
    }

    res.json({
        isInspectionOn: isInspectionOn,
        inspection:     inspection,
   })
}))

app.listen(port, () => {
    console.log(`[AdminTool backend Server] running at http://localhost:${port}`)
})

// 예약 작업 스케줄링 함수
function reserveCron(id, reservedDate) {
    const cronDate   = getCronDateFormat(reservedDate)
    const logDate    = getLogDateFormat(reservedDate)
    const jobKey     = `site_setting_${id}`

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

function getCronDateFormat(reservedDate) {
    const date = new Date(reservedDate)

    const minute  = date.getMinutes()      // 로컬 시간
    const hour    = date.getHours()        // 로컬 시간
    const day     = date.getDate()
    const month   = date.getMonth() + 1    // 월은 0부터 시작하므로 +1
    const weekDay = '*'                    // 특정 요일이 필요하지 않으면 * 사용

    return `${minute} ${hour} ${day} ${month} ${weekDay}`
}

function getLogDateFormat(date) {
    return date.replace('T', ' ')
}

function deleteCron(id) {
    const jobKey = `site_setting_${id}`

    if (activeCronJobs.has(jobKey)) {
        activeCronJobs.get(jobKey).stop()
        activeCronJobs.delete(jobKey)
        console.log(`[DELETE CRON] reserved site_setting id: ${id}`)
    }

    return
}

function getNowDate() {
    const now = DateTime.now().setZone('Asia/Seoul').toFormat('yyyy-MM-dd HH:mm:ss')
    return now
}

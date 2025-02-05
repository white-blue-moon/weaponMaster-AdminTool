import { asyncHandler } from "../utils/asyncHandler.js"
import { STATE_RESERVED, ACTIVE_ON_BEFORE } from "../constants/state.js"
import { reserveCron, deleteCron } from "../utils/cron.js"

import db from "../mysql/db.js"
import express from 'express'


const router = express.Router()

// TODO DB 에러처리 필요, 반환 값 공통화 필요
router.post('/', asyncHandler(async (req, res) => {
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

    const [results] = await db.query('INSERT INTO  (active_state, settings_comment, settings) VALUES (?, ?, ?)', [state, title || null, settings])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[INSERT ERROR] ` })
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

router.get('/list', asyncHandler(async (req, res) => {
    const [siteSettings] = await db.query('SELECT * FROM site_setting ORDER BY id DESC')
    const [reservedRes]  = await db.query('SELECT * FROM site_setting_reserved')

    res.json({
        siteSettings:  siteSettings,
        reservedInfo:  reservedRes,
    })
}))

router.get('/last', asyncHandler(async (req, res) => {
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

router.get('/:id', asyncHandler(async (req, res) => {
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

router.put('/:id', asyncHandler(async (req, res) => {
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
            const [updateRes] = await db.query('UPDATE site_setting_reserved SET reserved_date = ?, reserved_state = ? WHERE settings_id = ?', [reservedDate, ACTIVE_ON_BEFORE, id])
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
        // TODO 시간 포멧 동일한지, 연산 정상 동작하는지 확인 필요
        if (selectRes[0].reserved_date != reservedDate) {
            const [updateRes] = await db.query('UPDATE site_setting_reserved SET reserved_date = ?, reserved_state = ? WHERE settings_id = ?', [reservedDate, ACTIVE_ON_BEFORE, id])
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

router.delete('/:id', asyncHandler(async (req, res) => {
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

export default router

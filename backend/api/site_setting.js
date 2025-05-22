import { asyncHandler } from "../utils/asyncHandler.js"
import { STATE_RESERVED, ACTIVE_ON_BEFORE } from "../constants/state.js"
import { reserveCron, deleteCron } from "../utils/cron.js"
import { saveUserLog } from "../utils/user_log.js"
import { LOG_ACT_TYPE, LOG_CONTENTS_TYPE } from "../constants/userLogType.js"
import { FOCUS_BANNER_TYPE } from "../constants/focusBannerType.js"
import { isAdminAuthorized } from "../utils/adminPermision.js"

import db from "../mysql/db.js"
import express from 'express'


const router = express.Router()

// TODO DB 에러처리 필요, 반환 값 공통화 필요
router.post('/site_setting', asyncHandler(async (req, res) => {
    const { siteSetting, reservedDate, adminUserId, adminToken } = req.body

    if(!await isAdminAuthorized(adminUserId, adminToken)) {
        return res.status(400).send({ message: '[INSERT ERROR] no admin authorized' })
    }

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

    await saveUserLog(adminUserId, LOG_CONTENTS_TYPE.WEAPON_SITE_SETTING, LOG_ACT_TYPE.CREATE, id, state)

    return res.send({ success: true })
}))

router.get('/site_setting/list', asyncHandler(async (req, res) => {
    const [siteSettings] = await db.query('SELECT * FROM site_setting ORDER BY id DESC')
    const [reservedRes]  = await db.query('SELECT * FROM site_setting_reserved')

    return res.json({
        siteSettings:  siteSettings,
        reservedInfo:  reservedRes,
    })
}))

router.get('/site_setting/last', asyncHandler(async (req, res) => {
    // 가장 최근 생성된 홈페이지 설정 조회
    const [results] = await db.query('SELECT * FROM site_setting ORDER BY id DESC LIMIT 1')
    if (results.length === 0) {
        return res.status(404).send({ message: `[SELECT ERROR] No last site_setting found` })
    }

    return res.json({
        siteSetting:  results[0],
    })
}))

router.get('/site_setting/maxVersions', asyncHandler(async (req, res) => {
    const maxVersionMap = {};

    maxVersionMap['publisher_logo_ver']         = await getMaxVersion('SELECT version FROM ref_publisher_logo ORDER BY version DESC LIMIT 1');
    maxVersionMap['home_main_focus_ver']        = await getMaxVersion('SELECT version FROM ref_focus_banner_info WHERE banner_type = ? ORDER BY version DESC LIMIT 1', [FOCUS_BANNER_TYPE.MAIN]);
    maxVersionMap['home_news_focus_first_ver']  = await getMaxVersion('SELECT version FROM ref_focus_banner_info WHERE banner_type = ? ORDER BY version DESC LIMIT 1', [FOCUS_BANNER_TYPE.NEWS_FIRST]);
    maxVersionMap['home_news_focus_second_ver'] = await getMaxVersion('SELECT version FROM ref_focus_banner_info WHERE banner_type = ? ORDER BY version DESC LIMIT 1', [FOCUS_BANNER_TYPE.NEWS_SECOND]);
    maxVersionMap['character_banner_ver']       = await getMaxVersion('SELECT version FROM ref_character_banner ORDER BY version DESC LIMIT 1');
    maxVersionMap['inspection_main_focus_ver']  = await getMaxVersion('SELECT version FROM ref_focus_banner_info WHERE banner_type = ? ORDER BY version DESC LIMIT 1', [FOCUS_BANNER_TYPE.INSPECTION_MAIN]);

    return res.send({ success: true,  maxVersionMap: maxVersionMap})
}))

async function getMaxVersion(query, params = []) {
    const [result] = await db.query(query, params)
    return (result.length === 0) ? 0 : result[0].version
}

router.get('/site_setting/:id', asyncHandler(async (req, res) => {
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

    return res.json({
        siteSetting:  siteSetting,
        reservedDate: reservedDate,
    })
}))

router.put('/site_setting/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { siteSetting, reservedDate, adminUserId, adminToken } = req.body
    
    const state    = siteSetting.active_state
    const title    = siteSetting.settings_comment
    const settings = JSON.stringify(siteSetting.settings)

    if(!await isAdminAuthorized(adminUserId, adminToken)) {
        return res.status(400).send({ message: '[UPDATE ERROR] no admin authorized' })
    }

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
            return res.status(500).send({ message: `[DELETE ERROR] site_setting_reserved, settings_id: ${id}` })
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
                return res.status(500).send({ message: `[INSERT ERROR] site_setting_reserved, settings_id: ${id}` })
            }
        }

        // DB 에 추가한 적 있었으면 UPDATE
        if (reservedRes.length !== 0) {
            const [updateRes] = await db.query('UPDATE site_setting_reserved SET reserved_date = ?, reserved_state = ? WHERE settings_id = ?', [reservedDate, ACTIVE_ON_BEFORE, id])
            if (updateRes.affectedRows === 0) {
                // TODO -> 콘솔에 남기는 것 외에 res 로도 반환해야 할지 체크해 보기
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

    await saveUserLog(adminUserId, LOG_CONTENTS_TYPE.WEAPON_SITE_SETTING, LOG_ACT_TYPE.UPDATE, id, state)

    return res.send({ success: true })
}))

router.delete('/site_setting/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { adminUserId, adminToken } = req.body

    if(!await isAdminAuthorized(adminUserId, adminToken)) {
        return res.status(400).send({ message: '[UPDATE ERROR] no admin authorized' })
    }

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
            return res.status(500).send({ message: `[DELETE ERROR] site_setting_reserved with settings_id ${id}` })
        }

        // cron 쪽 예약 내역 삭제
        deleteCron(id)
    }

    // 3. 홈페이지 설정값 삭제
    const [results] = await db.query('DELETE FROM site_setting WHERE id = ?', [id])
    if (results.affectedRows === 0) {
        return res.status(500).send({ message: `[DELETE ERROR] site_setting with id ${id}` })
    }

    await saveUserLog(adminUserId, LOG_CONTENTS_TYPE.WEAPON_SITE_SETTING, LOG_ACT_TYPE.DELETE, id)

    return res.send({ success: true })
}))

export default router

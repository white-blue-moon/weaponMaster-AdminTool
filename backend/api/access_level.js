import { asyncHandler } from "../utils/asyncHandler.js"
import { saveUserLog } from "../utils/user_log.js"
import { LOG_ACT_TYPE, LOG_CONTENTS_TYPE } from "../constants/userLogType.js"

import db from "../mysql/db.js"
import express from 'express'



const router = express.Router()

router.get('/access_level/list', asyncHandler(async (req, res) => {
    const [results] = await db.query('SELECT * FROM user_info ORDER BY id DESC')

    return res.json({
        userInfoList:  results,
    })
}))

router.get('/access_level/:id', asyncHandler(async (req, res) => {
    const { id } = req.params

    const [results] = await db.query('SELECT * FROM user_info WHERE id = ?', [id])
    if (results.length === 0) {
        return res.status(404).send({ message: `[SELECT ERROR] No user_info found with id ${id}` })
    }

    return res.json({
       userInfo: results[0],
   })
}))

router.put('/access_level/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { setting, adminUserId } = req.body

    // TODO 아이디 변경은 못하게 막기 (프론트도 막기)
    

    const [updateRes] = await db.query('UPDATE user_info SET user_type = ? WHERE id = ?', [setting.state, id])
    if (updateRes.affectedRows === 0) {
        return res.status(404).send({ message: `[UPDATE ERROR] user_info with id ${id}` })
    }

    await saveUserLog(adminUserId, LOG_CONTENTS_TYPE.WEAPON_ACCOUNT_MANAGEMENT, LOG_ACT_TYPE.UPDATE, id, setting.state)
    
    return res.send({ success: true })
}))

router.delete('/access_level/:id', asyncHandler(async (req, res) => {
    const { id }          = req.params
    const { adminUserId } = req.body

    // TODO 해당 유저 관련 DB 데이터 삭제 필요
    // TODO comment 쪽 데이터는 유지하기 or 삭제 상태로 업데이트

    const [results] = await db.query('DELETE FROM user_info WHERE id = ?', [id])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[DELETE ERROR] user_info with id ${id}` })
    }

    await saveUserLog(adminUserId, LOG_CONTENTS_TYPE.WEAPON_ACCOUNT_MANAGEMENT, LOG_ACT_TYPE.DELETE, id)
    
    return res.send({ success: true })
}))

export default router

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

    const [updateRes] = await db.query('UPDATE user_info SET user_type = ?, user_id = ? WHERE id = ?', [setting.state, setting.title, id])
    if (updateRes.affectedRows === 0) {
        return res.status(404).send({ message: `[UPDATE ERROR] user_info with id ${id}` })
    }

    await saveUserLog(adminUserId, LOG_CONTENTS_TYPE.WEAPON_ACCOUNT_MANAGEMENT, LOG_ACT_TYPE.UPDATE, id, setting.state)
    
    return res.send({ success: true })
}))

router.delete('/access_level/:id', asyncHandler(async (req, res) => {
    const { id }          = req.params
    const { adminUserId } = req.body

    const [results] = await db.query('DELETE FROM user_info WHERE id = ?', [id])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[DELETE ERROR] user_info with id ${id}` })
    }

    await saveUserLog(adminUserId, LOG_CONTENTS_TYPE.WEAPON_ACCOUNT_MANAGEMENT, LOG_ACT_TYPE.DELETE, id)
    
    return res.send({ success: true })
}))

export default router

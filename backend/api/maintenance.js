import { asyncHandler } from "../utils/asyncHandler.js"
import { STATE_ACTIVE_ON } from "../constants/state.js"
import { getNowDate } from "../utils/time.js"
import { saveUserLog } from "../utils/user_log.js"
import { LOG_ACT_TYPE, LOG_CONTENTS_TYPE } from "../constants/userLogType.js"
import { isAdminAuthorized } from "../utils/adminPermission.js"

import db from "../mysql/db.js"
import express from 'express'


const router = express.Router()

router.get('/maintenance/active', asyncHandler(async (req, res) => {
    let isMaintenanceOn = false
    let maintenance

    const now = getNowDate()
    const [results] = await db.query('SELECT * FROM maintenance WHERE active_state = ? AND (start_date <= ? AND ? <= end_date)', [STATE_ACTIVE_ON, now, now])
    if (results.length > 0) {
        isMaintenanceOn = true
        maintenance = results[0]
    }

    return res.json({
        isMaintenanceOn: isMaintenanceOn,
        maintenance:     maintenance,
   })
}))

router.get('/maintenance/active/latest', asyncHandler(async (req, res) => {
    let maintenance

    const [results] = await db.query('SELECT * FROM maintenance WHERE active_state = ? ORDER BY id DESC LIMIT 1', [STATE_ACTIVE_ON])
    if (results.length > 0) {
        maintenance = results[0]
    }

    return res.json({maintenance: maintenance})
}))

router.get('/maintenance/list', asyncHandler(async (req, res) => {
    const [results] = await db.query('SELECT * FROM maintenance ORDER BY id DESC')

    return res.json({
        maintenanceList: results,
   })
}))

router.get('/maintenance/:id', asyncHandler(async (req, res) => {
    const { id } = req.params

    const [results] = await db.query('SELECT * FROM maintenance WHERE id = ?', [id])
    if (results.length === 0) {
        return res.status(404).send({ message: `[SELECT ERROR] No maintenance found with id ${id}` })
    }

    return res.json({
       maintenance: results[0],
   })
}))

router.put('/maintenance/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { setting, adminUserId, adminToken } = req.body

    if(! await isAdminAuthorized(adminUserId, adminToken)) {
        return res.status(400).send({ message: `[UPDATE ERROR] no admin authorized` })
    }

    const [updateRes] = await db.query('UPDATE maintenance SET active_state = ?, comment = ?, start_date = ?, end_date = ? WHERE id = ?', [setting.state, setting.title, setting.start_date, setting.end_date, id])
    if (updateRes.affectedRows === 0) {
        return res.status(500).send({ message: `[UPDATE ERROR] maintenance with id ${id}` })
    }

    await saveUserLog(adminUserId, LOG_CONTENTS_TYPE.WEAPON_MAINTENANCE_CONTROL, LOG_ACT_TYPE.UPDATE, id, setting.state)

    return res.send({ success: true })
}))

router.delete('/maintenance/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { adminUserId, adminToken } = req.body

    if(!await isAdminAuthorized(adminUserId, adminToken)) {
        return res.status(400).send({ message: `[DELETE ERROR] no admin authorized` })
    }

    const [results] = await db.query('DELETE FROM maintenance WHERE id = ?', [id])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[DELETE ERROR] maintenance with id ${id}` })
    }

    await saveUserLog(adminUserId, LOG_CONTENTS_TYPE.WEAPON_MAINTENANCE_CONTROL, LOG_ACT_TYPE.DELETE, id)

    return res.send({ success: true })
}))

router.post('/maintenance/', asyncHandler(async (req, res) => {
    const { setting, adminUserId, adminToken } = req.body

    if(!await isAdminAuthorized(adminUserId, adminToken)) {
        return res.status(400).send({ message: `[INSERT ERROR] no admin authorized` })
    }

    if (!setting) {
        return res.status(400).send({ message: '[INSERT ERROR] Invalid input. Please provide a valid maintenance-input' })
    }

    const [result] = await db.query('INSERT INTO maintenance (active_state, comment, start_date, end_date) VALUES (?, ?, ?, ?)', [setting.state, setting.title, setting.start_date, setting.end_date])
    if (result.affectedRows === 0) {
        return res.status(500).send({ message: `[INSERT ERROR] maintenance` })
    }

    await saveUserLog(adminUserId, LOG_CONTENTS_TYPE.WEAPON_MAINTENANCE_CONTROL, LOG_ACT_TYPE.CREATE, result.insertId, setting.state)

    return res.send({ success: true })
}))

export default router

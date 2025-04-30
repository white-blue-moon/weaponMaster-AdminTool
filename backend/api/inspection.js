import { asyncHandler } from "../utils/asyncHandler.js"
import { STATE_ACTIVE_ON } from "../constants/state.js"
import { getNowDate } from "../utils/time.js"

import db from "../mysql/db.js"
import express from 'express'


const router = express.Router()

router.get('/inspection/active', asyncHandler(async (req, res) => {
    let isInspectionOn = false
    let inspection

    const now = getNowDate()
    const [results] = await db.query('SELECT * FROM inspection WHERE active_state = ? AND (start_date <= ? AND ? <= end_date)', [STATE_ACTIVE_ON, now, now])
    if (results.length > 0) {
        isInspectionOn = true
        inspection = results[0]
    }

    return res.json({
        isInspectionOn: isInspectionOn,
        inspection:     inspection,
   })
}))

router.get('/inspection/list', asyncHandler(async (req, res) => {
    const [results] = await db.query('SELECT * FROM inspection ORDER BY id DESC')

    return res.json({
        inspectionList: results,
   })
}))

router.get('/inspection/:id', asyncHandler(async (req, res) => {
    const { id } = req.params

    const [results] = await db.query('SELECT * FROM inspection WHERE id = ?', [id])
    if (results.length === 0) {
        return res.status(404).send({ message: `[SELECT ERROR] No inspection found with id ${id}` })
    }

    return res.json({
       inspection: results[0],
   })
}))

router.put('/inspection/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { setting } = req.body

    const [updateRes] = await db.query('UPDATE inspection SET active_state = ?, comment = ?, start_date = ?, end_date = ? WHERE id = ?', [setting.state, setting.title, setting.start_date, setting.end_date, id])
    if (updateRes.affectedRows === 0) {
        return res.status(404).send({ message: `[UPDATE ERROR] inspection with id ${id}` })
    }

    return res.send({ success: true })
}))

router.delete('/inspection/:id', asyncHandler(async (req, res) => {
    const { id } = req.params

    const [results] = await db.query('DELETE FROM inspection WHERE id = ?', [id])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[DELETE ERROR] inspection with id ${id}` })
    }

    return res.send({ success: true })
}))

router.post('/inspection/', asyncHandler(async (req, res) => {
    const { setting } = req.body
    if (!setting) {
        return res.status(400).send({ message: '[INSERT ERROR] Invalid input. Please provide a valid inspection-input' })
    }

    const [results] = await db.query('INSERT INTO inspection (active_state, comment, start_date, end_date) VALUES (?, ?, ?, ?)', [setting.state, setting.title, setting.start_date, setting.end_date])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[INSERT ERROR] inspection` })
    }

    return res.send({ success: true })
}))

export default router

import { asyncHandler } from "../utils/asyncHandler.js"

import db from "../mysql/db.js"
import express from 'express'


const router = express.Router()

router.get('/list', asyncHandler(async (req, res) => {
    const [results] = await db.query('SELECT * FROM user_info ORDER BY id DESC')

    res.json({
        userInfoList:  results,
    })
}))

router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params

    const [results] = await db.query('SELECT * FROM user_info WHERE id = ?', [id])
    if (results.length === 0) {
        return res.status(404).send({ message: `[SELECT ERROR] No user_info found with id ${id}` })
    }

    res.json({
       userInfo: results[0],
   })
}))

router.put('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { setting } = req.body

    const [updateRes] = await db.query('UPDATE user_info SET user_type = ?, user_id = ? WHERE id = ?', [setting.state, setting.title, id])
    if (updateRes.affectedRows === 0) {
        return res.status(404).send({ message: `[UPDATE ERROR] user_info with id ${id}` })
    }

    res.send({ success: true })
}))

router.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params

    const [results] = await db.query('DELETE FROM user_info WHERE id = ?', [id])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[DELETE ERROR] user_info with id ${id}` })
    }

    res.send({ success: true })
}))

export default router

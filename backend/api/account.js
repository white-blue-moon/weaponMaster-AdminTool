import { asyncHandler } from "../utils/asyncHandler.js"
import { getNowDate }   from "../utils/time.js"
import { saveUserLog } from "../utils/user_log.js"
import { LOG_ACT_TYPE, LOG_CONTENTS_TYPE } from "../constants/userLogType.js"

import db from "../mysql/db.js"
import express from 'express'
import { ADMIN_TOKEN_TYPE } from "../constants/adminTokenType.js"


const router = express.Router()

// TODO -> 공통 반환 값 처리 필요 (success: true/false)
// 아이디 중복확인
router.get('/account/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params

    const [results] = await db.query('SELECT * FROM admin_tool_user_info WHERE user_id = ?', [userId])
    if (results.length > 0) {
        return res.send({ success: false })
    }

    return res.send({ success: true })
}))

// 회원가입
router.post('/account/join', asyncHandler(async (req, res) => {
    const { userInfo } = req.body

    const [results] = await db.query('SELECT * FROM admin_tool_user_info WHERE user_id = ?', [userInfo.userId])
    if (results.length > 0) {
        return res.status(400).send({ success: false, message: `[JOIN ERROR] user_id ${userInfo.userId} already exist` })
    }

    const [tokenRes] = await db.query('SELECT * FROM admin_token WHERE type = ?', [ADMIN_TOKEN_TYPE.ADMIN_TOOL])
    if (tokenRes.length === 0) {
        return res.status(400).send({ success: false, message: `[JOIN ERROR] no admin authorized` })
    }
    if (userInfo.token !== tokenRes[0].token) {
        return res.status(400).send({ success: false, message: `[JOIN ERROR] no admin authorized` })
    }

    const [insertRes] = await db.query('INSERT admin_tool_user_info (user_id, user_pw) values (?, ?)', [userInfo.userId, userInfo.userPw])
    if (insertRes.affectedRows === 0) {
        return res.status(500).send({ success: false, message: `[JOIN ERROR] INSERT data FAIL, user_id: ${userInfo.userId}` })
    }

    await saveUserLog(userInfo.userId, LOG_CONTENTS_TYPE.ADMIN_TOOL, LOG_ACT_TYPE.JOIN, insertRes.insertId)
   
    return res.send({ success: true })
}))

// 로그인
router.post('/account/login', asyncHandler(async (req, res) => {
    const { loginInfo } = req.body

    const [results] = await db.query('SELECT * FROM admin_tool_user_info WHERE user_id = ?', [loginInfo.userId])
    if (results.length === 0) {
        return res.send({ success: false, message: `[LOGIN ERROR] can't find user_id: ${loginInfo.userId}` })
    }

    if (loginInfo.userPw != results[0].user_pw) {
        return res.send({ success: false, message: `[LOGIN ERROR] wrong pw, user_id: ${loginInfo.userId}` })
    }

    const [updateRes] = await db.query('UPDATE admin_tool_user_info SET last_login_date = ? WHERE user_id = ?', [getNowDate(), loginInfo.userId])
    if (updateRes.affectedRows === 0) {
        return res.status(404).send({ success: false, message: `[LOGIN ERROR] UPDATE last_login_date FAIL, user_id: ${loginInfo.userId}` })
    }

    await saveUserLog(loginInfo.userId, LOG_CONTENTS_TYPE.ADMIN_TOOL, LOG_ACT_TYPE.LOGIN)
    
    return res.send({ success: true })
}))

// TODO 로그아웃

export default router

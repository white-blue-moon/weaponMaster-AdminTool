import { asyncHandler } from "../utils/asyncHandler.js"
import { saveUserLog } from "../utils/user_log.js"
import { LOG_ACT_TYPE, LOG_CONTENTS_TYPE } from "../constants/userLogType.js"
import { ACCESS_GATE_TYPE } from "../constants/accessGateType.js"

import db from "../mysql/db.js"
import express from 'express'


const router = express.Router()

router.post('/access-gate/verify', asyncHandler(async (req, res) => {
    const { password } = req.body

    const [result] = await db.query('SELECT * FROM access_gate_password WHERE type = ?', [ACCESS_GATE_TYPE.ADMIN_TOOL])
    if (result.length === 0) {
        return res.send({ success: false, message: `[ACCESS GATE LOGIN ERROR] can't find password info` })
    }

    if (password.join('') != result[0].password) {
        return res.send({ success: false, message: `[ACCESS GATE LOGIN ERROR] wrong pw` })
    }

    // TODO 페이지 접근 해제가 몇 번 정도 이루어지는지 확인을 위해 임시 로그 추가 -> 추후 삭제 필요
    await saveUserLog("어드민툴-시스템", LOG_CONTENTS_TYPE.ADMIN_TOOL, LOG_ACT_TYPE.ACCESS_GATE_LOGIN)

    return res.send({ success: true })
}))

export default router

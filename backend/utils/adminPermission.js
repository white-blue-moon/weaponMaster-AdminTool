import { ADMIN_TOKEN_TYPE } from "../constants/adminTokenType.js"
import db from "../mysql/db.js"

export async function isAdminAuthorized(userId, token) {
    const [userResults] = await db.query('SELECT * FROM admin_tool_user_info WHERE user_id = ?', [userId])
    if (userResults.length === 0) {
        console.log(`[ADMIN PERMISSION ERROR] not found userId: ${userId}`)
        return false
    }

    const [tokenResults] = await db.query('SELECT * FROM admin_token WHERE type = ?', [ADMIN_TOKEN_TYPE.ADMIN_TOOL])
    if (tokenResults.length === 0) {
        console.log(`[ADMIN PERMISSION ERROR] not found admin_token. userId: ${userId}, type: ${ADMIN_TOKEN_TYPE.ADMIN_TOOL}`)
        return false
    }

    if (token !== tokenResults[0].token) {
        console.log(`[ADMIN PERMISSION ERROR] no match admin token. userId: ${userId}`)
        return false
    }

    return true
}

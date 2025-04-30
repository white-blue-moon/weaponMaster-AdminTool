import db from "../mysql/db.js"

export async function saveUserLog(userId, contentsType, actType, refValue = 0, extraRefValue = 0) {
    const [result] = await db.query('INSERT admin_tool_user_log (user_id, contents_type, act_type, ref_value, extra_ref_value) values (?, ?, ?, ?, ?)', [userId, contentsType, actType, refValue, extraRefValue])
    if (result.affectedRows === 0) {
        console.log(`[INSERT ERROR] admin_tool_user_log, userId: ${userId}, contentsType: ${contentsType}, actType: ${actType}, refValue: ${refValue}, extraRefValue: ${extraRefValue}`)
    }
}

import express from 'express'
import cors from 'cors'

import siteSettingAPI from "./api/site_setting.js"
import accessLevelAPI from "./api/access_level.js"
import inspectionAPI  from "./api/inspection.js"


const app = express()
const port = 7770

app.use(cors())         // 다른 도메인에서의 요청을 허용(CORS 정책 적용)
app.use(express.json()) // 요청 본문(JSON 형식)을 파싱하여 req.body에 저장

app.use('/site_setting', siteSettingAPI)
app.use('/access_level', accessLevelAPI)
app.use('/inspection',   inspectionAPI)

app.listen(port, () => {
    console.log(`[AdminTool backend Server] running at http://localhost:${port}`)
})

export default app

import express from 'express'
import cors from 'cors'

import siteSettingAPI from "./api/site_setting.js"
import accessLevelAPI from "./api/access_level.js"
import maintenanceAPI from "./api/maintenance.js"
import accountAPI     from "./api/account.js"
import accessGateAPI  from "./api/access_gate.js"


const app = express()
const port = 7770

// 다른 도메인에서의 요청을 허용(CORS 정책 적용)
// [ 실제 배포 주소, 로컬 어드민 프론트, 로컬 웨펀마스터 프론트 ]
app.use(cors({
    origin: [
      'https://weapon-master-portfolio.duckdns.org',
      'http://localhost:8880',
      'http://localhost:8080'
    ]
}))         
app.use(express.json()) // 요청 본문(JSON 형식)을 파싱하여 req.body에 저장

app.use(siteSettingAPI)
app.use(accessLevelAPI)
app.use(maintenanceAPI)
app.use(accountAPI)
app.use(accessGateAPI)

app.listen(port, () => {
    console.log(`[AdminTool backend Server] running at http://localhost:${port}`)
})

export default app

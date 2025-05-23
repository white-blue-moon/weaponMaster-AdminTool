import { resumeReservedCrons } from './utils/cron.js'

import express from 'express'
import cors from 'cors'

import siteSettingAPI from "./api/site_setting.js"
import accessLevelAPI from "./api/access_level.js"
import maintenanceAPI from "./api/maintenance.js"
import accountAPI     from "./api/account.js"
import accessGateAPI  from "./api/access_gate.js"


const app  = express()
const port = 7770

async function startServer() {
    // CORS 정책 적용 [ 실제 배포 주소, 로컬 어드민 프론트, 로컬 웨펀마스터 프론트 ]
    app.use(cors({
        origin: [
          'https://weapon-master-portfolio.uk',
          'http://localhost:8880',
          'http://localhost:8080'
        ]
    }))

    // 요청 본문(JSON 형식)을 파싱하여 req.body에 저장
    app.use(express.json()) 

    // API 라우터들 연결
    app.use(siteSettingAPI)
    app.use(accessLevelAPI)
    app.use(maintenanceAPI)
    app.use(accountAPI)
    app.use(accessGateAPI)

    // 서버 재시작 시 예약 크론(예약 설정) 재등록
    try {
        await resumeReservedCrons()
    } catch(err) {
        console.error('[CRON RESUME ERROR]', err)
    }

    // 서버 시작
    app.listen(port, () => {
        console.log(`[AdminTool backend Server] running at http://localhost:${port}`)
    })
}

await startServer()

export default app

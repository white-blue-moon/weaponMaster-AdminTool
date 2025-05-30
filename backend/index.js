import { resumeReservedCrons } from './utils/cron.js'

import dotenv from "dotenv"
import express from 'express'
import cors from 'cors'

import siteSettingAPI from "./api/site_setting.js"
import accessLevelAPI from "./api/access_level.js"
import maintenanceAPI from "./api/maintenance.js"
import accountAPI     from "./api/account.js"
import accessGateAPI  from "./api/access_gate.js"

// .env 파일 로드
dotenv.config()

const app  = express()
const port = 7770

async function startServer() {
    // .env 에서 CORS 목록 확인
    const allowedOrigins = process.env.CORS_ORIGINS.split(',').map(url => url.trim())
    
    // CORS 정책 적용
    app.use(cors({
        origin: allowedOrigins
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

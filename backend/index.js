import db from './db.js'
import express from 'express'
import cors from 'cors'

const app = express()
const port = 7770

app.use(cors())         // 다른 도메인에서의 요청을 허용(CORS 정책 적용)
app.use(express.json()) // 요청 본문(JSON 형식)을 파싱하여 req.body에 저장

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/site_setting/list', (req, res) => {
    db.query('SELECT * FROM site_setting ORDER BY id DESC', (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.json(results)
    })
})

app.listen(port, () => {
    console.log(`[AdminTool backend Server] running at http://localhost:${port}`)
})

import db from './mysql/db.js'
import express from 'express'
import cors from 'cors'

const app = express()
const port = 7770

app.use(cors())         // 다른 도메인에서의 요청을 허용(CORS 정책 적용)
app.use(express.json()) // 요청 본문(JSON 형식)을 파싱하여 req.body에 저장

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
};

// TODO DB 에러처리 필요, 반환 값 공통화 필요
app.post('/site_setting', asyncHandler(async (req, res) => {
    const { siteSetting } = req.body
    console.log('siteSetting: ', siteSetting)
    console.log('typeof siteSetting: ', typeof siteSetting)
    if (!siteSetting || typeof siteSetting !== 'object') {
        return res.status(400).send({ message: '[INSERT ERROR] Invalid input. Please provide a valid siteSetting object.' })
    }

    const state = siteSetting.active_state
    const title = siteSetting.settings_comment
    const settings = JSON.stringify(siteSetting.settings)
    if (state === undefined || !settings) {
        return res.status(400).send({ message: '[INSERT ERROR] Missing required fields: active_state or settings.' })
    }

    const [results] = await db.query('INSERT INTO site_setting (active_state, settings_comment, settings) VALUES (?, ?, ?)', [state, title || null, settings])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[INSERT ERROR] site_setting` })
    }

    res.send({ success: true })
}))

app.get('/site_setting/list', asyncHandler(async (req, res) => {
    const [results] = await db.query('SELECT * FROM site_setting ORDER BY id DESC')
    res.json(results)
}))

app.get('/site_setting/last', asyncHandler(async (req, res) => {
    const [results] = await db.query('SELECT * FROM site_setting ORDER BY id DESC LIMIT 1')
    if (results.length === 0) {
        return res.status(404).send({ message: `[SELECT ERROR] No last site_setting found` })
    }

    res.json(results[0])
}))

app.get('/site_setting/:id', asyncHandler(async (req, res) => {
     const { id } = req.params

     const [results] = await db.query('SELECT * FROM site_setting WHERE id = ?', [id])
     if (results.length === 0) {
         return res.status(404).send({ message: `[SELECT ERROR] No site_setting found with id ${id}` })
     }

     res.json(results[0])
}))

app.put('/site_setting/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    const { siteSetting } = req.body
    
    const state = siteSetting.active_state
    const title = siteSetting.settings_comment
    const settings = JSON.stringify(siteSetting.settings)
    console.log("settings: ", settings) 
    
    const [results] = await db.query('UPDATE site_setting SET active_state = ?, settings_comment = ?, settings = ? WHERE id = ?', [state, title, settings, id])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[UPDATE ERROR] site_setting with id ${id}` })
    }

    res.send({ success: true })
}))

app.delete('/site_setting/:id', asyncHandler(async (req, res) => {
    const { id } = req.params

    const [results] = await db.query('DELETE FROM site_setting WHERE id = ?', [id])
    if (results.affectedRows === 0) {
        return res.status(404).send({ message: `[DELETE ERROR] site_setting with id ${id}` })
    }

    res.send({ success: true })
}))

app.listen(port, () => {
    console.log(`[AdminTool backend Server] running at http://localhost:${port}`)
})

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

app.get('/site_setting/list', (req, res) => {
    db.query('SELECT * FROM site_setting ORDER BY id DESC', (err, results) => {
        if (err) {
            const errMsg = { message: err }
            return res.status(500).send(errMsg)
        }
        res.json(results)
    })
})

app.get('/site_setting/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM site_setting WHERE id = ?', [id], (err, results) => {
        if (err) {
            const errMsg = { message: err.message || 'Database query error' };
            return res.status(500).send(errMsg);
        }

        if (results.length === 0) {
            return res.status(404).send({ message: `No site_setting found with id ${id}` });
        }

        res.json(results[0]);
    });
});

app.listen(port, () => {
    console.log(`[AdminTool backend Server] running at http://localhost:${port}`)
})

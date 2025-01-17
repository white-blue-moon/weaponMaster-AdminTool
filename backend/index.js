import db from './db.js'
import express from 'express'

const app = express()
const port = 7770

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/db', (req, res) => {
    db.query('SELECT * FROM site_setting WHERE is_active = 1 ORDER BY id DESC LIMIT 1', (err, results) => {
        if (err) {
            return res.status(500).send(err)
        }
        res.json(results)
    })
})

app.listen(port, () => {
    console.log(`[AdminTool backend Server] running at http://localhost:${port}`)
})

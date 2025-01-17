import dotenv from 'dotenv';
import { createConnection } from 'mysql2'

// .env 파일 로드
dotenv.config()

const connection = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

connection.connect((err) => {
    if (err) {
        console.log('.env Info : ', process.env.DB_HOST)
        console.error('Error connecting to the database:', err.stack)
        return
    }
    console.log('Connected to the database as id ' + connection.threadId)
})

export default connection

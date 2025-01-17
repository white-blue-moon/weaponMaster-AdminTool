import dotenv from 'dotenv';
import { createConnection } from 'mysql2'


import { createPool } from 'mysql2/promise';

// .env 파일 로드
dotenv.config()



// Connection Pool 생성
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // 대기 중인 연결 요청 허용
    connectionLimit: 10,      // 최대 연결 수
    queueLimit: 0             // 대기열 제한 (0은 무제한)
});

export default pool


// const connection = createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// })

// connection.connect((err) => {
//     if (err) {
//         console.log('.env Info : ', process.env.DB_HOST)
//         console.error('Error connecting to the database:', err.stack)
//         return
//     }
//     console.log('Connected to the database as id ' + connection.threadId)
// })

// export default connection

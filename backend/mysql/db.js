import dotenv from 'dotenv'
import { createPool } from 'mysql2/promise'

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
    queueLimit: 0,            // 대기열 제한 (0은 무제한)
    dateStrings: true         // 타임존 보정 없이 DB에 저장된 값을 그대로 전달받을 수 있음
});

export default pool

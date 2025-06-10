# Admin Tool Backend

> Express 기반의 관리자 페이지 백엔드 API 서버입니다.  
> 포트폴리오 제출용으로 제작되었습니다.

---

## 기술 스택

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MySQL
- **환경 변수 관리**: dotenv
- **배포 방식**: 별도 서버 혹은 클라우드 환경에 Node.js 앱으로 배포

---

## 폴더 구조

```
backend
├── api
│   ├── account.js
│   ├── access_level.js
│   ├── site_setting.js
│   └── (기타 API 관련 파일들)
│
├── constants
│   └── state.js
│   └── (기타 상수 파일들)
│
├── mysql
│   ├── sql
│   │   └── create.sql
│   └── db.js
│
├── utils
│   ├── adminPermission.js
│   ├── cron.js
│   ├── time.js
│   └── (기타 유틸리티 파일들)
│
├── .env
├── deploy.sh
├── index.js
├── package-lock.json
└── package.json
```


---

## 실행 방법
> ⚠️ 실행 전에 `.env` 환경 변수 파일을 먼저 설정해 주세요.
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 실행
node index.js

# Node.js 서버를 pm2 같은 프로세스 매니저로 관리하는 것을 권장합니다.
```

---

## 환경 변수 (.env)

백엔드에서 사용하는 주요 환경 변수 예시는 다음과 같습니다:

```ini
# MySQL 데이터베이스 접속 정보
DB_HOST=localhost         
DB_USER=admin_user          
DB_PASSWORD=secure_pass123 
DB_NAME=admin_tool_db    
DB_PORT=3306                

# CORS 허용 출처 (여러 도메인 허용 시 쉼표(,)로 구분)
CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

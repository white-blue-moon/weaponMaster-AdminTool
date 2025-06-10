# Admin Tool Frontend

> Svelte 기반의 관리자 페이지 프론트엔드  
> 포트폴리오 제출을 위한 SPA 프로젝트입니다.

---

## 기술 스택

- **Framework**: Svelte
- **Bundler**: Rollup
- **Style**: SCSS
- **배포 방식**: Nginx + HTTPS + 경로 기반 서비스(`/admin-front/`)

---

## 폴더 구조

```
frontend
├── public
│   ├── admin-front
│   │   ├── build
│   │   │   ├── bundle.css
│   │   │   └── bundle.js
│   │   │
│   │   ├── images
│   │   │   └── (로고, 아이콘 등)
│   │   │
│   │   ├── index.html
│   │   └── ...
│
├── scripts
│   └── updateIndex.js
│
├── src
│   ├── components
│   │   └── (공통 UI 컴포넌트들 .svelte)
│   │       └── Footer.svelte, Gnb.svelte 등
│   │
│   ├── constants
│   │   └── (각종 상수 정의)
│   │       └── paths.js 등
│   │
│   ├── routes
│   │   ├── (페이지로 사용되는 컴포넌트들)
│   │   ├── access_level/
│   │   ├── account/
│   │   ├── maintenance/
│   │   ├── ...
│   │   └── Home.svelte
│   │
│   ├── utils
│   │   ├── apifetch.js
│   │   ├── auth.js
│   │   └── time.js
│   │
│   ├── App.svelte
│   ├── main.js
│   └── variables.scss
│
├── .env
├── deploy.sh
├── package.json
├── package-lock.json
└── rollup.config.js
```


---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 배포 빌드
npm run build

# Nginx에 배포될 정적 파일: /public/admin-front/

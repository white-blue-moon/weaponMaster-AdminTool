import fs from 'fs';

const buildDir  = './public/admin-front/build';
const indexPath = './public/admin-front/index.html';

// 번들 파일 검색
const files  = fs.readdirSync(buildDir);
const jsFile = files.find(f => f.endsWith('.js'));

// index.html 불러오기
let html = fs.readFileSync(indexPath, 'utf-8');

// JS 링크 교체
html = html.replace(/<script defer src='build\/.*\.js'><\/script>/, `<script defer src='build/${jsFile}'></script>`);

// 저장
fs.writeFileSync(indexPath, html);

console.log(`✔ index.html updated with:\n→ JS: ${jsFile}`);

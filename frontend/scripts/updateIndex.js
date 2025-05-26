import fs from 'fs'

const buildDir  = './public/admin-front/build'
const indexPath = './public/admin-front/index.html'

// 번들 파일 검색
const files   = fs.readdirSync(buildDir)
const jsFile  = files.find(f => f.endsWith('.js'))
const cssFile = files.find(f => f.endsWith('.css'))

// index.html 불러오기
let html = fs.readFileSync(indexPath, 'utf-8')

// 정규식 패턴 분리
const jsPattern  = `<script defer src='build\\/.*\\.js'><\\/script>`
const cssPattern = `<link rel='stylesheet' href='build\\/.*\\.css' ?\\/?>`

// 조합된 정규식 (두 패턴 중 하나에 매칭)
const combinedPattern = new RegExp(`(${jsPattern})|(${cssPattern})`, 'g')

// 한 번의 replace로 스크립트와 스타일 교체
html = html.replace(combinedPattern, (match) => {
    if (match.startsWith('<script')) {
        return `<script defer src='build/${jsFile}'></script>`
    }

    if (match.startsWith('<link')) {
        return `<link rel='stylesheet' href='build/${cssFile}'>`
    }
    
    return match
})

// 저장
fs.writeFileSync(indexPath, html)

console.log('✔ index.html updated with:')
console.log(`→ JS: ${jsFile}`)
console.log(`→ CSS: ${cssFile}`)

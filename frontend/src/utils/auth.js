import { writable } from "svelte/store"
import { PATHS } from "../constants/paths"

// 홈페이지 자체 접근 가능 여부
export const canAccessAdminPage = writable(
    getCookieValue("canAccessAdminPage") === "true"
);

// 사용자 정보 저장소
export const userInfo = writable(
    JSON.parse(localStorage.getItem("userInfo")) || null
)

// 로그인 상태 저장소
export const isLoggedIn = writable(
    JSON.parse(localStorage.getItem("isLoggedIn")) || false
)

// 구독을 통해 변경될 때 브라우저 저장소에 저장
userInfo.subscribe((value) => {
    localStorage.setItem("userInfo", JSON.stringify(value))
})

isLoggedIn.subscribe((value) => {
    localStorage.setItem("isLoggedIn", JSON.stringify(value))
})

export function handleLogout() {
    userInfo.set(null)
    isLoggedIn.set(false)

    alert("로그아웃 되었습니다.")
    window.location.href = PATHS.HOME
}

// Caps Lock 감지 함수
export function handleCapsLock(event, setCapsLockWarning) {
    const capsLockOn = event.getModifierState("CapsLock");
    setCapsLockWarning(capsLockOn)
}

export function setCookie(name, value, day = 1) {
    const expires  = new Date()
    const oneDayMs = (24 * 60 * 60 * 1000)

    expires.setTime(expires.getTime() + (day * oneDayMs)) // day 일 후 만료
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()};`

    canAccessAdminPage.set(true)
    return
}

export function getCookieValue(name) {
    // 정규식: "쿠키이름=값;" > "쿠키이름, =, 값, ;" > 값
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
}

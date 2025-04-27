import { writable } from "svelte/store"
import { PATHS } from "../constants/paths"

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

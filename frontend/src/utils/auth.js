import { writable } from "svelte/store"
import { PATHS } from "../constants/paths"
import { DURATION } from "../constants/duration"

export const canAccessAdminPage = cookieWritable("canAccessAdminPage", false) // 홈페이지 자체 접근 가능 여부
export const adminToolToken     = cookieWritable("adminToolToken", null)      // 관리자 전용 토큰 값

export const isAdminLoggedIn    = localStorageWritable("isAdminLoggedIn", false) // 로그인 여부
export const adminUserInfo      = localStorageWritable("adminUserInfo", null)    // 사용자 정보 (아이디 등)

export function authLogin(userId, token) {
    const expireMs = Date.now() + (DURATION.HOUR_MS * 4) // 4시간 후 만료

    adminUserInfo.set(userId, expireMs)
    adminToolToken.set(token, expireMs)
    isAdminLoggedIn.set(true, expireMs)

    alert(`로그인에 성공하였습니다.\n${userId} 님 안녕하세요.`)
    window.location.href = PATHS.HOME
    return
}

export function authLogout() {
    adminToolToken.set(null)
    adminUserInfo.set(null)
    isAdminLoggedIn.set(false)

    localStorage.removeItem("adminUserInfo")
    localStorage.removeItem("isAdminLoggedIn")
    
    alert("로그아웃 되었습니다.")
    window.location.href = PATHS.HOME
    return
}

export function isSessionExpired() {
    const isExpired = !getStoredValue("adminUserInfo") || 
                      !getStoredValue("isAdminLoggedIn") ||
                      !getCookieValue("adminToolToken")  
    
    if (isExpired) {
      return true
    }

    return false
}

// Caps Lock 감지
export function handleCapsLock(event, setCapsLockWarning) {
    const capsLockOn = event.getModifierState("CapsLock")
    setCapsLockWarning(capsLockOn)
}

export function safeJsonParse(str) {
    if (!str) {
      return null
    }

    try {
        return JSON.parse(str)
    } catch {
        return null
    }
}

function cookieWritable(key, defaultValue = "") {
    const raw           = getCookieValue(key)
    const initial       = initParse(raw, defaultValue)
    const store         = writable(initial)
    const defaultExpire = Date.now() + DURATION.DAY_MS

    return {
        subscribe: store.subscribe,
        update:    store.update,
        set: (value, expireMs = defaultExpire) => {
            setCookie(key, value, expireMs)
            store.set(value)
        },
    }
}

function getCookieValue(name) {
    // 정규식: "쿠키이름=값;" > "쿠키이름, =, 값, ;" > 값
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) {
        return decodeURIComponent(match[2])
    }

    return null
}

function setCookie(name, value, expireMs) {
    const expires  = new Date()
    expires.setTime(expireMs)

    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()};`
}

// 초기값 파싱 유틸
function initParse(value, defaultValue) {
    if (value === null || value === undefined) {
      return defaultValue
    }
  
    if (typeof defaultValue === "boolean") {
      return value === "true"
    }
  
    const parsed = safeJsonParse(value)
    if (parsed !== null && parsed !== undefined) {
      return parsed
    }
  
    return value
}

function isValidStoredData(obj) {
    if (!obj)                    return false
    if (typeof obj !== "object") return false
    if (!("value" in obj))       return false
    if (!("expireMs" in obj))    return false
  
    return true
}
  
function isExpired(expireMs) {
    if (typeof expireMs !== "number") return true
    if (expireMs <= Date.now())       return true
  
    return false
}
  
function getStoredValue(key, defaultValue) {
    const raw = localStorage.getItem(key)
    if (!raw) {
      return defaultValue
    }

    const parsed = safeJsonParse(raw)
    if (!isValidStoredData(parsed)) {
      return defaultValue
    }
  
    if (isExpired(parsed.expireMs)) {
      return defaultValue
    }
  
    return parsed.value
}

function saveToLocalStorage(key, value, expireMs) {
    const toStore  = { value, expireMs }
    localStorage.setItem(key, JSON.stringify(toStore))
}
  
function localStorageWritable(key, defaultValue = "") {
    const stored        = getStoredValue(key, defaultValue)
    const store         = writable(stored)
    const defaultExpire = Date.now() + DURATION.DAY_MS

    return {
        subscribe: store.subscribe,
        update:    store.update,
        set: (value, expireMs = defaultExpire) => { 
            saveToLocalStorage(key, value, expireMs)
            store.set(value)
        },
    }
}

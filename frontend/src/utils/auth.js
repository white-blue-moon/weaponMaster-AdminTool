import { writable } from "svelte/store";
import { PATHS } from "../constants/paths";

export const canAccessAdminPage = cookieWritable("canAccessPage", false); // 홈페이지 자체 접근 가능 여부
export const adminToolToken     = cookieWritable("adminToolToken", null); // 관리자 전용 토큰 값

export const isAdminLoggedIn    = localStorageWritable("isLoggedIn", false); // 로그인 여부
export const adminUserInfo      = localStorageWritable("userInfo", null);    // 사용자 정보 (아이디 등)

export function handleLogout() {
    adminUserInfo.set(null);
    isAdminLoggedIn.set(false);
    adminToolToken.set(null);

    alert("로그아웃 되었습니다.");
    window.location.href = PATHS.HOME;
}

// Caps Lock 감지
export function handleCapsLock(event, setCapsLockWarning) {
  const capsLockOn = event.getModifierState("CapsLock");
  setCapsLockWarning(capsLockOn);
}

function getCookieValue(name) {
    // 정규식: "쿠키이름=값;" > "쿠키이름, =, 값, ;" > 값
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) {
        return decodeURIComponent(match[2]);
    }

    return null;
}

function setCookie(name, value, day = 1) {
    const expires  = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    expires.setTime(expires.getTime() + (day * oneDayMs)); // day 일 후 만료
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()};`;
}

// 초기값 파싱 유틸
function initParse(value, defaultValue) {
    if (value === null || value === undefined) {
      return defaultValue;
    }
  
    if (typeof defaultValue === "boolean") {
      return value === "true";
    }
  
    const parsed = safeJsonParse(value);
    if (parsed !== null && parsed !== undefined) {
      return parsed;
    }
  
    return value;
}

function safeJsonParse(str) {
    try {
        return JSON.parse(str);
    } catch(e) {
        // TODO 로컬 확인용 로그
        // console.warn("JSON parse error:", e);
        return null;
    }
}  

// 쿠키 기반 writable
function cookieWritable(key, defaultValue = "") {
    const raw     = getCookieValue(key);
    const initial = initParse(raw, defaultValue);
    const store   = writable(initial);
  
    store.subscribe(value => {
      setCookie(key, value);
    });
  
    return store;
}

function isValidStoredData(obj) {
    if (!obj)                    return false;
    if (typeof obj !== "object") return false;
    if (!("value" in obj))       return false;
    if (!("expireTs" in obj))    return false;
  
    return true;
}
  
function isExpired(expireTs) {
    if (typeof expireTs !== "number") return true;
    if (expireTs <= Date.now())       return true;
  
    return false;
}
  
function getStoredValue(key, defaultValue) {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return defaultValue;
    }

    const parsed = safeJsonParse(raw);
    if (!isValidStoredData(parsed)) {
      return defaultValue;
    }
  
    if (isExpired(parsed.expireTs)) {
      return defaultValue;
    }
  
    return parsed.value;
}

function saveToLocalStorage(key, value, expireMs) {
    const expireTs = Date.now() + expireMs;
    const toStore  = { value, expireTs };

    localStorage.setItem(key, JSON.stringify(toStore));
}
  
function localStorageWritable(key, defaultValue = "", expireMs = 24 * 60 * 60 * 1000) {
    const stored = getStoredValue(key, defaultValue);
    const store  = writable(stored);

    return {
        subscribe: store.subscribe,
        update:    store.update,
        set: (value) => { 
            saveToLocalStorage(key, value, expireMs);
            store.set(value); 
        },
    };
}

import { isSessionExpired, safeJsonParse } from "./auth"
import { API } from "../constants/api"
import { PATHS } from "../constants/paths"

export async function apiFetch(url, options = {}) {
    if (shouldCheckSession(url, options.body)) {
        if (isSessionExpired()) {
            alert('로그인 정보가 만료되었습니다.\n로그인 후 이용해 주세요.')
            window.location.href = PATHS.ACCOUNT.LOGIN
            throw new Error('로그인 세션 정보 만료')
        }
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (!response.ok) {
        const errorData = await response.json();
        const errJson   = JSON.stringify(errorData)
        throw new Error(errJson || 'API 요청 실패')
    }

    return response.json()
}

export function handleApiError(error) {
    console.error('API Error:', error.message)
    return { "success": false }
}

const exceptAPI   = [ API.ACCOUNT.LOGIN, API.ACCOUNT.JOIN ]
const sessionKeys = ['userId', 'adminUserId', 'adminToken']

function shouldCheckSession(url, body) {
    if (exceptAPI.some(api => url.startsWith(api))) {
        return false
    }

    const bodyObj = safeJsonParse(body)
    if (!bodyObj || typeof bodyObj !== 'object') {
        return false
    }

    if (sessionKeys.some(key => key in bodyObj)) {
        return true
    }

    return false
}

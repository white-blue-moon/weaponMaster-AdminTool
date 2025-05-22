export async function apiFetch(url, options = {}) {
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

export const LOG_CONTENTS_TYPE = {
    ADMIN_TOOL: 0, // 어드민툴 시스템 자체

    WEAPON_SITE_SETTING:        1, // 웨펀마스터 사이트 설정
    WEAPON_ACCOUNT_MANAGEMENT:  2, // 웨펀마스터 계정 관리
    WEAPON_MAINTENANCE_CONTROL: 3, // 웨펀마스터 점검 제어
}

export const LOG_ACT_TYPE = {
    LOGIN:  1,
    LOGOUT: 2,
    JOIN:   3, // 회원가입

    CREATE: 10,
    READ:   11,
    UPDATE: 12,
    DELETE: 13,
}

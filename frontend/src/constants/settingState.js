export const SETTING_STATE = {
    OFF:        0,
    ON:         1,
    RESERVED:   2,
}

export const SETTING_STATE_TEXT = {
    [SETTING_STATE.OFF]:      "OFF",
    [SETTING_STATE.ON]:       "ON",
    [SETTING_STATE.RESERVED]: "RESERVED",
}

export const ACCESS_LEVEL = {
    NORMAL: 0,
    ADMIN:  1,
}

export const ACCESS_LEVEL_TEXT = {
    [ACCESS_LEVEL.NORMAL]:  "일반",
    [ACCESS_LEVEL.ADMIN]:   "관리자",
}

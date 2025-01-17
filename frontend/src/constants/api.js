const ROOT = 'http://localhost:7770'; // TODO .env 파일을 통한 경로 관리 추후 고려 ex) const ROOT = import.meta.env.API_ROOT

export const API = {
    HOME: ROOT,
    SITE_SETTING: {
        LIST: `${ROOT}/site_setting/list`,
    },
    ADMIN_USER: {
        // TODO
    },
    INSPECTIOIN: {
        // TODO
    },
};

const ROOT = 'http://localhost:7770'; // TODO .env 파일을 통한 경로 관리 추후 고려 ex) const ROOT = import.meta.env.API_ROOT

export const API = {
    VERIFY_ACCESS_GATE: `${ROOT}/access-gate/verify`,
    HOME: ROOT,
    SITE_SETTING: {
        CREATE:       `${ROOT}/site_setting`,
        LIST:         `${ROOT}/site_setting/list`,
        READ_LAST:    `${ROOT}/site_setting/last`,
        MAX_VERSIONS: `${ROOT}/site_setting/maxVersions`,
        READ:          (id) => `${ROOT}/site_setting/${id}`,
        UPDATE:        (id) => `${ROOT}/site_setting/${id}`,
        DELETE:        (id) => `${ROOT}/site_setting/${id}`,
    },
    ACCESS_LEVEL: {
        LIST:       `${ROOT}/access_level/list`,
        READ:        (id) => `${ROOT}/access_level/${id}`,
        UPDATE:      (id) => `${ROOT}/access_level/${id}`,
        DELETE:      (id) => `${ROOT}/access_level/${id}`,
    },
    MAINTENANCE: {
        CREATE:     `${ROOT}/maintenance`,
        LIST:       `${ROOT}/maintenance/list`,
        READ:        (id) => `${ROOT}/maintenance/${id}`,
        UPDATE:      (id) => `${ROOT}/maintenance/${id}`,
        DELETE:      (id) => `${ROOT}/maintenance/${id}`,
    },
    ACCOUNT: {
        LOGIN:     `${ROOT}/account/login`,
        JOIN:      `${ROOT}/account/join`,
        ID_CHECK:   (userId) => `${ROOT}/account/${userId}`,
    },
};

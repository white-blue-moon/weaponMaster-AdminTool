const BASE = `/admin-front`;

export const PATHS = {
    ACCESS_GATE: `${BASE}/access-gate`,
    HOME: `${BASE}/`,
    ACCOUNT: {
        JOIN:   `${BASE}/account/join`,
        LOGIN:  `${BASE}/account/login`,
    },
    SITE_SETTING: {
        LIST:   `${BASE}/`,
        INSERT: `${BASE}/site_setting/insert`,
        EDIT:   (id) => `${BASE}/site_setting/edit/${id}`,
        EDIT_TEMPLATE:  `${BASE}/site_setting/edit/:id`,
    },
    ACCESS_LEVEL: {
        LIST:   `${BASE}/access_level/list`,
        INSERT: `${BASE}/access_level/insert`,
        EDIT:   (id) => `${BASE}/access_level/edit/${id}`,
        EDIT_TEMPLATE:  `${BASE}/access_level/edit/:id`,
    },
    MAINTENANCE: {
        LIST:   `${BASE}/maintenance/list`,
        INSERT: `${BASE}/maintenance/insert`,
        EDIT:   (id) => `${BASE}/maintenance/edit/${id}`,
        EDIT_TEMPLATE:  `${BASE}/maintenance/edit/:id`,
    },

    WEAPON_MASTER: `https://weapon-master-portfolio.duckdns.org/weapon-front/`,
};

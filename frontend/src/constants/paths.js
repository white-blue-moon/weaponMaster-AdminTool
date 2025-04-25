export const PATHS = {
    HOME: '/',
    ACCOUNT: {
        JOIN:   '/account/join',
        LOGIN:  '/account/login',
    },
    SITE_SETTING: {
        LIST:   '/',
        INSERT: `/site_setting/insert`,
        EDIT:   (id) => `/site_setting/edit/${id}`,
        EDIT_TEMPLATE:  '/site_setting/edit/:id',
    },
    ACCESS_LEVEL: {
        LIST:   `/access_level/list`,
        INSERT: `/access_level/insert`,
        EDIT:   (id) => `/access_level/edit/${id}`,
        EDIT_TEMPLATE:  '/access_level/edit/:id',
    },
    INSPECTION: {
        LIST:   `/inspection/list`,
        INSERT: `/inspection/insert`,
        EDIT:   (id) => `/inspection/edit/${id}`,
        EDIT_TEMPLATE:  '/inspection/edit/:id',
    },

    WEAPON_MASTER: `http://localhost:8080/`,
};

export const PATHS = {
    HOME: '/',
    ACCOUNT: {
        JOIN:   '/account/join',
        LOGIN:  '/account/login',
    },
    SITE_SETTING: {
        EDIT:   (id) => `/site_setting/edit/${id}`,

        EDIT_TEMPLATE:  '/site_setting/edit/:id',
    },
};



module.exports = {
    HASH_OPTIONS: {
        algorithm: 'RSA-SHA512'
    },
    PASSWORD_REGEX: '(?=.*?[^a-zA-Z])(?=.*[A-Z]).{8,}',
    EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    // List of user roles
    user: {
        roles: {
            ADMIN: "admin",
            USER: 'user'
        },
        defaultPassword: "NodeBeat"
    },
    APIPath: '/api/v1',
    APIFolder: 'api',
};
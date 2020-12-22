/* eslint-disable no-empty-function */
'use strict';

module.exports = app => {
    if (app.config.env === 'unittest') {
        app.beforeStart(async () => {
            await app.model.sync({ force: true });
        });
    }
};

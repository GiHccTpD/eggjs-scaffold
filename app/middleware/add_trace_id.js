'use strict';
const { v4: uuidv4 } = require('uuid');

// eslint-disable-next-line no-unused-vars
module.exports = (options, app) => {
    return async function addTraceId(ctx, next) {
        ctx.state.traceId = uuidv4().replace(/-/g, '');
        await next();
    };
};

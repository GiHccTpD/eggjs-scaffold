'use strict';

module.exports = () => {
    return async function notFoundHandler(ctx, next) {
        await next();
        if (ctx.status === 404 && !ctx.body) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                msg: 'Not Found',
                data: {},
                traceId: ctx.state.traceId
            };
        }
    };
};

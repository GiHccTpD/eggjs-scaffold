/* eslint-disable array-bracket-spacing */
'use strict';

const _ = require('lodash');
const CONST = require('../constant/constant');

module.exports = (options, app) => {
    const config = app.config;
    return async function tokenRequired(ctx, next) {
        if (process.env.EGG_SERVER_ENV === CONST.LOCAL_ENV) {
            ctx.state.user = config.localUser;
            return next();
        }

        // 过滤白名单路由
        const router = `${ctx.method.toLowerCase()}|${ctx.path}`;
        const { whiteListRoutes } = options;
        const isWhiteListRouter = _.find(whiteListRoutes, item => {
            return router.startsWith(item);
        });

        ctx.logger.info('isWhiteListRouter: ', isWhiteListRouter);

        if (isWhiteListRouter) {
            ctx.state.user = config.localUser;
            return next();
        }
        const Authorization =
            ctx.request.header.authorization || 'Bearer ' + (ctx.cookies.get('token') || '');
        const token = Authorization.split(' ')[1] || '';

        if (!token) {
            ctx.status = 401;
            ctx.fail({ ctx, code: 401 });
            return;
        }

        try {
            ctx.state.user = await ctx.service.token.verify(token, config.secret);
        } catch (e) {
            ctx.status = +e.message;
            ctx.fail({ ctx, code: +e.message });
            return;
        }
        await next();
    };
};

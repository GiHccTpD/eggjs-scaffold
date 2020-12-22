/**
 * 通用错误处理中间件
 */

'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = (options, app) => {
    return async function errorHandler(ctx, next) {
        try {
            await next();
        } catch (err) {
            // 鉴权失败
            if (err.status === 403 || err.status === 401 || err.status === 400) {
                ctx.status = err.status;
                ctx.body = '';
                return;
            }

            const { app } = ctx;
            // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
            app.emit('error', err, ctx);

            // 输出错误堆栈
            ctx.logger.error('middleware errorHandler: ', err);
            ctx.status = 500;
            ctx.body = {
                code: 500,
                msg: '服务器内部错误,请稍后重试',
                data: {},
                traceId: ctx.state.traceId
            };
            return;
        }
    };
};

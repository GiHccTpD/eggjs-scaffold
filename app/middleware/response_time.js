'use strict';

/**
 * 计算请求响应时间，并打印日志
 */
// eslint-disable-next-line no-unused-vars
module.exports = (options, app) => {
    return async function responseTime(ctx, next) {
        // app.logger.debug({
        //     // stackdriver suggested to provide stack in the message
        //     message: `<-- ${ctx.method} ${ctx.path}`
        // });
        const startTime = Date.now();
        try {
            await next();
        } catch (e) {
            throw e;
        } finally {
            const latency = Date.now() - startTime;

            const postBody = ctx.request.body || {};
            const queryParams = ctx.query || {};
            const urlParams = ctx.params || {};

            app.logger.info(
                JSON.stringify({
                    // stackdriver suggested to provide stack in the message
                    message: `-->${latency}ms ${ctx.method} ${ctx.path} ${ctx.status}`,
                    // https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#HttpRequest
                    httpRequest: {
                        status: ctx.status,
                        userAgent: ctx.get('user-agent'),
                        referer: ctx.get('referer'),
                        requestMethod: ctx.method,
                        responseSize: ctx.length,
                        requestUrl: ctx.href,
                        latency,
                        postBody,
                        queryParams,
                        urlParams,
                        traceId: ctx.state.traceId,
                        remoteIp: ctx.id
                    }
                })
            );
        }
    };
};

'use strict';

/**
 * 接口请求频次限制
 * @param  {Object} options 参数：{ expire: '过期时间，秒', limit: '请求次数' }
 */
// eslint-disable-next-line no-unused-vars
module.exports = (options, app) => {
    return async function requestLimit(ctx, next) {
        const userId = ctx.user.id;
        const key = `dp@limit:${ctx.path}:${userId}`;
        const { expire, limit } = options;
        if (!limit || !expire) {
            return next();
        }
        const num = await ctx.app.redis.get('app').incr(key);
        if (num === 1) {
            await ctx.app.redis.get('app').expire(key, expire);
        }
        if (num > limit) {
            throw new Error('request_limit');
        }
        await next();
    };
};

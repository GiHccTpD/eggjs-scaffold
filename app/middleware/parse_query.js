'use strict';

/**
 * 处理请求参数
 */
const _ = require('lodash');
// eslint-disable-next-line no-unused-vars
module.exports = (options, app) => {
    return async function parseQuery(ctx, next) {
        const query = ctx.request.query;
        _.each(query, (v, k) => {
            if (k === 'pagesize') {
                query.pageSize = parseInt(v);
            }
            if (k === 'page') {
                query.page = parseInt(v) || 1;
            }
            if (k === 'pageSize') {
                query.pageSize = parseInt(v);
            }
        });

        await next();
    };
};

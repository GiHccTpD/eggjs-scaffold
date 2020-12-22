'use strict';

const _ = require('lodash');

/**
 * Context 扩展
 *
 * 框架会把 app/extend/context.js 中定义的对象与 Koa Context 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 ctx 对象。
 * this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
 * 调用方式：ctx.xxxx
 */

module.exports = {
    success({ ctx, code = 200, data = {} }) {
        this.body = {
            code: code || 200,
            msg: (ctx && _.cloneDeep(ctx.helper.errorCode[code])) || 'OK',
            data: data || {},
            traceId: ctx.state.traceId
        };
        return;
    },
    fail({ ctx, code = 500, msg, data = {} }) {
        msg = msg || (ctx && _.cloneDeep(ctx.helper.errorCode[code]));
        ctx.status = code;
        this.body = {
            code: code || 500,
            msg: msg || '服务器内部错误,请稍后重试',
            data: !_.isEmpty(data) ? { error: data } : {},
            traceId: ctx.state.traceId
        };
        return;
    }
};

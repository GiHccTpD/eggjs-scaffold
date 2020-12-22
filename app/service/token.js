'use strict';

const Service = require('egg').Service;

class TokenService extends Service {
    create(obj, expire = 86400 * 7) {
        const { ctx } = this;
        if (!obj || Object.keys(obj).length === 0) {
            throw new Error(new Error(400));
        }
        obj.timestamp = Date.now();
        try {
            const token = this.app.jwt.sign({ payload: obj }, this.app.config.jwt.secret, {
                expiresIn: expire
            });
            return token;
        } catch (err) {
            ctx.logger.error('token create error: ', err);
            return this.ctx.throw(new Error(500));
        }
    }

    async verify(token) {
        const { payload } = this.app.jwt.decode(token); // decode
        const { id } = payload || {};
        if (!id) {
            return this.ctx.throw(new Error(401));
        }
        try {
            const decoded = await this.app.jwt.verify(token, this.app.config.jwt.secret); // 校验
            return decoded.payload;
        } catch (err) {
            const { ctx } = this;
            ctx.logger.error('token verify error: ', err);
            return this.ctx.throw(new Error(401));
        }
    }
}

module.exports = TokenService;

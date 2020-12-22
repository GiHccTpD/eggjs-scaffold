'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    /**
     * 根据用户的手机号和类型判断用户 是否存在
     * @param {*} mobilePhone
     * @param {*} type
     */
    async isExistedUserByPhoneAndType(mobilePhone, type) {
        const { ctx } = this;
        const where = { mobilePhone, type, deleted: 0 };
        const user = await ctx.model.User.findOne(where);

        return user;
    }

    async fetchMpUsers({ limit, offset }) {
        const { ctx } = this;
        const where = {
            type: 3
        };

        const user = await ctx.model.User.findAndCountAll({
            where,
            limit,
            offset
        });

        return user;
    }
}

module.exports = UserService;

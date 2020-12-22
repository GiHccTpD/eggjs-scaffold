'use strict';

const _ = require('lodash');
const CONST = require('../../constant/constant');
const Controller = require('egg').Controller;

class UserController extends Controller {
    // 仅用于测试
    async register() {
        const { ctx } = this;

        const body = ctx.request.body;
        const { password } = body;

        // 根据手机号查询用户是否存在
        let user = await ctx.model.User.findOne({
            where: { mobilePhone: body.mobilePhone, deleted: 0 }
        });
        if (!_.isEmpty(user)) {
            ctx.status = 400;
            ctx.fail({ ctx, code: 400, msg: '手机号已被注册' });
            return;
        }

        // 新建用户
        const salt = ctx.helper.generateSalt(body.name);
        const _password = this.ctx.helper.passwordResolve(salt + password);
        body.password = _password;
        body.salt = salt;
        body.type = CONST.ADMIN_USER_TYPE;
        user = await ctx.model.User.create(body);

        // 生成token
        const payload = {
            id: user.id,
            name: body.name,
            type: CONST.ADMIN_USER_TYPE
        };

        try {
            const token = ctx.service.token.create(payload);
            payload.token = token;
            ctx.status = 200;
            ctx.success({
                ctx,
                data: payload
            });
        } catch (err) {
            ctx.fail({ ctx, code: 500, data: err });
        }
    }

    async login() {
        const { ctx } = this;

        const body = ctx.request.body;
        const { password, mobilePhone } = body;

        // 根据手机号查询用户是否存在
        const user = await ctx.model.User.findOne({
            attributes: ['id', 'name', 'type', 'avatar', 'password', 'salt'],
            where: { mobilePhone, deleted: 0 }
        });

        if (_.isEmpty(user)) {
            ctx.status = 400;
            ctx.fail({ ctx, code: 400, msg: '用户不存在' });
            return;
        }

        const _password = this.ctx.helper.passwordResolve(user.salt + password);
        if (_password !== user.password) {
            ctx.fail({ ctx, code: 400, msg: '密码错误' });
            return;
        }

        // 生成token
        const payload = {
            ..._.pick(user, ['id', 'name', 'type'])
        };

        try {
            const token = ctx.service.token.create(payload);
            payload.token = token;
            ctx.status = 200;
            ctx.success({
                ctx,
                data: {
                    ...payload,
                    avatar: user.avatar
                }
            });
        } catch (err) {
            ctx.fail({ ctx, code: 500, data: err });
        }
    }

    async index() {
        const { ctx } = this;

        try {
            const avatar = await ctx.service.oss.putStreamForWechatAvatarUrl(
                'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKmB1DWZP1l7YR3mCv1QAhib4eVZjvr9goFNhQxibwWibia5ewVjIUhy0Dib9EpCC2BPI9PfldhpiaJs3ag/132',
                `test-avatar`
            );
            ctx.success({ ctx, data: { avatar } });
        } catch (err) {
            ctx.fail({ ctx, code: 500, data: err });
            return;
        }
    }

    async userInfo() {
        const { ctx } = this;
        const { name, avatar, password } = ctx.request.body;
        const { id: userId } = ctx.state.user;
        const user = await ctx.model.User.findOne({ where: { id: userId, deleted: 0 } });
        if (_.isEmpty(user)) {
            ctx.fail({ ctx, code: 500, data: {}, msg: '查无此用户' });
            return;
        }
        const salt = ctx.helper.generateSalt(user.name);
        let param = {};
        if (password) {
            const _password = ctx.helper.passwordResolve(salt + password);
            param = { salt, password: _password };
        } else {
            param = { name, avatar };
        }
        const where = { id: userId };
        try {
            await ctx.model.User.update(param, { where });
            ctx.success({ ctx, code: 200, data: {} });
        } catch (err) {
            ctx.fail({ ctx, code: 500, data: err });
            return;
        }
    }
}

module.exports = UserController;

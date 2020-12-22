'use strict';

const _ = require('lodash');
const CONST = require('../../constant/constant');
const Controller = require('egg').Controller;

class UserController extends Controller {
    async login() {
        const { ctx, service } = this;
        let { code, encryptedData, iv } = ctx.request.body;
        encryptedData = decodeURI(encryptedData);
        ctx.logger.info('微信登录 login post: ', ctx.request.body);

        let res;
        try {
            res = await service.mp.login(code);
        } catch (err) {
            ctx.logger.error('微信登录 login: ', err);
            ctx.fail({ ctx });
            return;
        }
        const { session_key: sessionKey, openid } = res;
        ctx.logger.info('微信登录 res: ', res);

        let userInfo = {};
        try {
            userInfo = await service.mp.decryptData(sessionKey, encryptedData, iv);
        } catch (err) {
            ctx.logger.error('微信登录 decryptData: ', err);
            ctx.fail({ ctx });
            return;
        }

        const openId = openid || userInfo.openId;

        let user = await ctx.model.User.findOne({ where: { openId, deleted: 0 } });

        // 为空,说明第一次登录,需要创建
        if (_.isEmpty(user)) {
            // 将微信的头像转换成自己的存储
            let avatar = '';
            try {
                avatar = await service.oss.putStreamForWechatAvatarUrl(
                    userInfo.avatarUrl,
                    `${userInfo.nickName}-${Date.now()}-avatar`
                );
            } catch (err) {
                ctx.fail({ ctx, code: 500, data: err });
                return;
            }

            // 存库
            user = await ctx.model.User.create({
                openId,
                avatar,
                name: userInfo.nickName,
                sex: userInfo.gender,
                wxAvatar: userInfo.avatarUrl,
                type: CONST.CUSTOMER_USER_TYPE,
                wxUserInfo: JSON.stringify(userInfo)
            });
        }

        // token payload
        const payload = _.pick(user, ['id', 'name', 'type', 'openId']);

        try {
            const token = ctx.service.token.create(payload);
            userInfo.token = token;
            ctx.status = 200;
            ctx.success({ ctx, data: userInfo });
            return;
        } catch (err) {
            ctx.fail({ ctx, code: 500, data: err });
        }
    }
}

module.exports = UserController;

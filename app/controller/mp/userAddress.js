'use strict';

const _ = require('lodash');
const validator = require('validator');
const Controller = require('egg').Controller;

class UserAddressController extends Controller {
    async fetchRegionList() {
        const { ctx, service } = this;
        const { type, pid } = ctx.params;

        // 行政区域类型，如如1则是省， 如果是2则是市，如果是3则是区县
        if (!validator.isIn('' + type, ['1', '2', '3'])) {
            ctx.fail({ ctx, code: 400, msg: 'type错误' });
            return;
        }

        if (+pid && !validator.isInt('' + pid)) {
            ctx.fail({ ctx, code: 400, msg: 'pid错误' });
            return;
        }

        const where = { type };
        if (+pid) {
            where.pid = pid;
        }
        const data = await service.userAddress.fetchRegionList(where);
        ctx.success({ ctx, data });
    }

    async fetchList() {
        const { ctx, service } = this;
        const { id: userId } = ctx.state.user;
        const data = await service.userAddress.fetchList({ userId });
        ctx.success({ ctx, data });
    }

    async add() {
        const { ctx, service } = this;
        const { id: userId } = ctx.state.user;
        const {
            mobilePhone,
            receiver,
            isDefault = 0,
            postcode,
            provinceId,
            cityId,
            countyId,
            town,
            detail
        } = ctx.request.body;

        // 查询下之前有没有记录 isDefault
        let addressList = [];
        if (isDefault) {
            addressList = await service.userAddress.fetchList({ userId });
        }

        if (!_.isEmpty(addressList) && addressList.length > 50) {
            ctx.fail({ ctx, code: 400, msg: '收货地址过多,目前已有' + addressList.length });
        }

        const setDefault = isDefault && !_.isEmpty(addressList);

        // 插入操作
        const params = {
            mobilePhone,
            receiver,
            isDefault,
            postcode,
            provinceId,
            cityId,
            countyId,
            town,
            detail,
            setDefault,
            userId
        };
        await service.userAddress.add(params);
        ctx.success({ ctx });
    }
    async del() {
        const { ctx, service } = this;
        const { id: userId } = ctx.state.user;
        const { id } = ctx.params;
        if (!validator.isInt('' + id) && id !== 'all') {
            ctx.fail({ ctx, code: 400, msg: '地址Id错误' });
            return;
        }

        const where = {};
        if (validator.isInt('' + id)) {
            where.id = id;
        } else {
            where.userId = userId;
        }
        await service.userAddress.del(where);

        ctx.success({ ctx });
    }
    async edit() {
        const { ctx, service } = this;
        const { id: userId } = ctx.state.user;
        const { body } = ctx.request;
        const {
            id,
            // mobilePhone,
            // receiver,
            isDefault = 0
            // postcode,
            // provinceId,
            // cityId,
            // countyId,
            // town,
            // detail
        } = body;
        console.log(body);

        let addr = await ctx.model.UserAddress.findOne({
            where: {
                id
                // userId
            }
        });
        addr = ctx.helper.deepClone(addr);
        if (_.isEmpty(addr)) {
            ctx.fail({ ctx, code: 400, msg: '记录不存在' });
            return;
        }

        // 查询下之前有没有记录 isDefault
        let addressList = [];
        if (+isDefault === 1) {
            addressList = await service.userAddress.fetchList({ userId });
        }

        const setDefault = +isDefault === 1 && !_.isEmpty(addressList);

        // 插入操作
        const params = {
            ...body,
            setDefault,
            userId
        };
        await service.userAddress.edit(params);
        ctx.success({ ctx });
    }
}

module.exports = UserAddressController;

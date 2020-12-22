'use strict';

const _ = require('lodash');
const validator = require('validator');
const Controller = require('egg').Controller;

class ShoppingCartController extends Controller {
    // 修改数量
    async fetchList() {
        const { ctx, service } = this;
        this.ctx.logger.info('ctx.state.user: ', ctx.state.user);
        const { id: userId } = ctx.state.user;
        const where = { userId };
        const { pageSize, currentPage } = ctx.query;
        const limit = validator.isInt('' + pageSize) ? pageSize : 10;
        const offset = validator.isInt('' + currentPage) ? (+currentPage - 1) * +pageSize : 0;

        let data = await service.shoppingCart.fetchList({ where, limit, offset });
        data = ctx.helper.deepClone(data);
        const skuIds = _.map(data.rows, 'skuId');
        const skus = await service.sku.findListBySkuIds(skuIds);
        const objSku = _.keyBy(skus, 'id');
        data.rows.forEach(item => {
            item.price = objSku[item.skuId].price;
            item.productAmountTotal = parseFloat(item.price) * item.amount;
        });
        ctx.success({ data, ctx });
    }

    // 添加购物车
    async add() {
        const { ctx, service } = this;
        const { skuId, spuId, amount = 1 } = ctx.request.body;
        const { id: userId } = ctx.state.user;
        if (!validator.isInt('' + skuId)) {
            ctx.fail({ ctx, code: 400, msg: 'skuId错误' });
            return;
        }

        if (!validator.isInt('' + spuId)) {
            ctx.fail({ ctx, code: 400, msg: 'spuId错误' });
            return;
        }

        if (!validator.isInt('' + amount)) {
            ctx.fail({ ctx, code: 400, msg: 'amount错误' });
            return;
        }

        // 查询下有没有记录
        const where = { spuId, skuId, userId };
        const isExisted = await service.shoppingCart.findOne(where);

        if (isExisted) {
            const params = {
                amount: isExisted.amount + amount
            };
            await service.shoppingCart.update(params, where);

            ctx.success({ ctx });
            return;
        }

        const res = await service.shoppingCart.create({ spuId, skuId, amount, userId });

        ctx.success({ ctx, data: res });
    }

    async update() {
        const { ctx, service } = this;
        const { id, amount = 1 } = ctx.request.body;
        const { id: userId } = ctx.state.user;
        if (!validator.isInt('' + id)) {
            ctx.fail({ ctx, code: 400, msg: '购物出记录Id错误' });
            return;
        }

        if (!validator.isInt('' + amount, { min: 1, max: 100000 })) {
            ctx.fail({ ctx, code: 400, msg: '数量至少为1' });
            return;
        }

        const where = { id, userId };
        const isExisted = await service.shoppingCart.findOne(where);

        if (_.isEmpty(isExisted)) {
            ctx.fail({ ctx, code: 400, msg: '购物出记录不存在' });
            return;
        }

        const params = {
            amount
        };
        await service.shoppingCart.update(params, where);

        ctx.success({ ctx });
        return;
    }

    // 删除购物车
    async del() {
        const { ctx, service } = this;
        const { id: userId } = ctx.state.user;
        const { id } = ctx.params;
        if (!validator.isInt('' + id) && id !== 'all') {
            ctx.fail({ ctx, code: 400, msg: '购物出记录Id错误' });
            return;
        }

        const where = {};
        if (validator.isInt('' + id)) {
            where.id = id;
        } else {
            where.userId = userId;
        }
        await service.shoppingCart.del(where);

        ctx.success({ ctx });
    }
}

module.exports = ShoppingCartController;

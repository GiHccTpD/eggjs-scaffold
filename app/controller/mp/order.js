'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const validator = require('validator');
const Controller = require('egg').Controller;
const CONST = require('../../constant/constant');

class OrderController extends Controller {
    async direct() {
        const { ctx, service } = this;
        const { skuId, spuId, amount = 1, addressId, payChannel = 1 } = ctx.request.body;
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

        const sku = await service.sku.findOne(skuId);
        const spu = await service.spu.findDetail(spuId);

        if (_.isEmpty(sku) || _.isEmpty(spu)) {
            return ctx.fail({ ctx, code: 400, msg: '商品不存在' });
        }

        const userAddress = await service.userAddress.findDetail(addressId, userId);

        if (_.isEmpty(userAddress)) {
            return ctx.fail({ ctx, code: 400, msg: '收货地址不存在' });
        }

        const params = {
            userId,
            addressId,
            payChannel,
            subOrderParam: [{ skuId, spuId, amount }]
        };

        try {
            const data = await service.order.create(params);
            ctx.success({ ctx, data: { id: data.pOrder.id } });
        } catch (err) {
            return ctx.fail({ ctx, code: 500, msg: err.message });
        }
    }

    async cart() {
        const { ctx, service } = this;
        const { shoppingCartIds, addressId, payChannel = 1 } = ctx.request.body;
        const { id: userId } = ctx.state.user;

        const _shoppingCartIds = ('' + shoppingCartIds).split(',').map(id => +_.trim(id));

        const shoppingCartList = await service.shoppingCart.fetchAll({
            where: { id: _shoppingCartIds }
        });

        shoppingCartList.forEach(item => {
            item.shoppingCartId = item.id;
            delete item.id;
        });
        if (_.isEmpty(shoppingCartList)) {
            return ctx.fail({ ctx, code: 400, msg: '购物车参数错误' });
        }

        const userAddress = await service.userAddress.findDetail(addressId, userId);

        if (_.isEmpty(userAddress)) {
            return ctx.fail({ ctx, code: 400, msg: '收货地址不存在' });
        }

        const params = {
            userId,
            addressId,
            payChannel,
            shoppingCartId: _shoppingCartIds,
            subOrderParam: shoppingCartList
        };
        const data = await service.order.create(params);
        ctx.success({ ctx, data: { id: data.pOrder.id } });
    }

    async preview() {
        const { ctx, service } = this;
        const { shoppingCartIds, skuId, spuId, amount = 1 } = ctx.request.body;
        const { id: userId } = ctx.state.user;

        let spuAndSkuList = [];
        if (shoppingCartIds) {
            const _shoppingCartIds = ('' + shoppingCartIds).split(',').map(id => +_.trim(id));

            spuAndSkuList = await service.shoppingCart.fetchAll({
                where: { id: _shoppingCartIds }
            });
            spuAndSkuList = _.map(spuAndSkuList, item => {
                return {
                    shoppingCartId: item.id,
                    skuId: item.skuId,
                    spuId: item.spuId,
                    amount: item.amount
                };
            });
        } else {
            spuAndSkuList = [{ skuId, spuId, amount }];
        }

        const res = await Promise.map(spuAndSkuList, async item => {
            const sku = await service.sku.findOne(item.skuId);
            const spu = await service.spu.findDetail(item.spuId);

            const res = {
                skuId: item.skuId,
                spuId: item.spuId,
                skuName: sku.skuName,
                skuInfo: validator.isJSON(sku.info) ? JSON.parse(sku.info) : {},
                price: parseFloat(sku.price),
                spuName: spu.name,
                spuCover: spu.cover || '',
                amount: item.amount,
                productAmountTotal: parseFloat(sku.price) * item.amount
            };
            if (item.shoppingCartId) {
                res.shoppingCartId = item.shoppingCartId;
            }

            return res;
        });
        const total = _.sumBy(res, 'productAmountTotal');

        const userAddresses = await service.userAddress.fetchList({ userId });
        const userAddress = ctx.helper.deepClone(userAddresses)[0];

        const data = {
            userAddress,
            previewList: res,
            total
        };
        ctx.success({ ctx, data });
    }

    async fetchList() {
        const { ctx, service } = this;
        const { id: userId } = ctx.state.user;
        const { pageSize, currentPage, orderStatus } = ctx.query;
        const limit = validator.isInt('' + pageSize) ? pageSize : 10;
        const offset = validator.isInt('' + currentPage) ? (+currentPage - 1) * +pageSize : 0;
        const where = { userId };

        if (validator.isInt('' + orderStatus)) {
            where.orderStatus = orderStatus;
        }

        let data = await service.order.findAllPagination({ where, limit, offset });
        data = ctx.helper.deepClone(data);
        data.rows.forEach(i => {
            i.allowedConfirmed = i.orderStatus === CONST.ORDER_STATUS_SHIPPING;
        });

        ctx.success({ ctx, data });
    }

    async fetchOne() {
        const { ctx, service } = this;
        const { id: userId } = ctx.state.user;
        const { id } = ctx.params;

        const data = await service.order.findOne(id);

        if (data.userId !== userId) {
            ctx.fail({ ctx, code: 404, msg: '订单不存在' });
            return;
        }
        data.allowedConfirmed = data.orderStatus === CONST.ORDER_STATUS_SHIPPING;

        ctx.success({ ctx, data });
    }

    async confirm() {
        const { ctx, service } = this;
        const { orderId } = ctx.request.body;
        const { id: userId } = ctx.state.user;

        const data = await service.order.findOne(orderId);
        if (_.isEmpty(data)) {
            ctx.fail({ ctx, code: 404, msg: '订单不存在' });
            return;
        }
        if (data && data.userId !== userId) {
            ctx.fail({ ctx, code: 404, msg: '订单不存在' });
            return;
        }
        if (data && data.orderStatus !== CONST.ORDER_STATUS_SHIPPING) {
            ctx.fail({ ctx, code: 400, msg: '订单状态无法确认收货' });
            return;
        }
        await service.order.updateV2(
            {
                orderStatus: CONST.ORDER_STATUS_RECEIVED
            },
            orderId
        );
        ctx.success({ ctx });
    }
}

module.exports = OrderController;

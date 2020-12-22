'use strict';

const _ = require('lodash');
const validator = require('validator');
const moment = require('moment');
const Promise = require('bluebird');
const CONST = require('../constant/constant');
const Service = require('egg').Service;
const area = require('../constant/area');

class OrderService extends Service {
    async create(params) {
        const { ctx, service } = this;
        const { userId, addressId, subOrderParam, payChannel, shoppingCartId } = params;
        const t = await ctx.model.transaction();

        const orderNo = this.orderIdGenerator(userId);
        const _parentOrderParam = {
            userId,
            parentId: 0,
            addressId,
            orderNo,
            payChannel,
            orderStatus: CONST.ORDER_STATUS_NON_PAYMENT,
            productCount: _.sumBy(subOrderParam, 'amount')
        };

        // 收货地址冗余
        const address = await service.userAddress.findDetail(addressId);
        address.provinceName = area.province_list[address.provinceId];
        address.cityName = area.city_list[address.cityId];
        address.countyName = area.county_list[address.countyId];

        // 检查商品,获取信息,形成订单参数
        const _subOrderParams = await Promise.map(subOrderParam, async sub => {
            const { skuId, spuId, amount = 1 } = sub;
            const sku = await service.sku.findOne(skuId);
            const spu = await service.spu.findDetail(spuId);

            const productAmountTotal = parseFloat(sku.price) * +amount;
            return {
                userId,
                orderNo,
                skuId,
                skuName: sku.skuName,
                skuInfo: sku.info,
                spuId,
                spuName: spu.name,
                spuCover: spu.cover,
                productCount: amount,
                orderStatus: CONST.ORDER_STATUS_NON_PAYMENT,
                productAmountTotal,
                orderAmountTotal: productAmountTotal,
                logisticsFee: 0,
                addressId,
                payChannel,
                userAddress: JSON.stringify(address),
                shoppingCartId: sub.shoppingCartId || 0
            };
        });

        _parentOrderParam.orderAmountTotal = _.sumBy(_subOrderParams, 'productAmountTotal');
        _parentOrderParam.productAmountTotal = _parentOrderParam.orderAmountTotal;
        _parentOrderParam.userAddress = JSON.stringify(address);

        try {
            // 父订单
            const pOrder = await ctx.model.Order.create(_parentOrderParam, {
                transaction: t
            });

            // 子订单
            _subOrderParams.forEach(item => {
                item.parentId = pOrder.id;
            });
            const subOrders = await ctx.model.Order.bulkCreate(_subOrderParams, {
                transaction: t
            });

            // await ctx.model.UserAddress.create(params, {
            //     transaction: t
            // });

            // 删除购物车记录
            if (!_.isEmpty(shoppingCartId)) {
                await ctx.model.ShoppingCart.destroy({
                    where: { id: shoppingCartId },
                    transaction: t
                });
            }

            await t.commit();
            return { pOrder, subOrders };
        } catch (err) {
            // If the execution reaches this line, an error was thrown.
            // We rollback the transaction.
            await t.rollback();
            ctx.logger.error('新增订单失败: ', err);
            throw new Error('新增订单失败');
        }
    }

    orderIdGenerator(userId) {
        const now = Date.now();
        return `${now}${_.padStart('' + userId, 5, '0')}${_.random(1000, 9999)}`;
    }

    async findAllPagination({
        where = {},
        limit,
        offset,
        order = [['updatedAt', 'desc']],
        showUserAddress,
        showUserName = false
    }) {
        const { ctx } = this;

        // 父订单条件
        where.parentId = 0;
        const orders = await ctx.model.Order.findAndCountAll({
            where,
            limit,
            offset,
            order
        });
        const ids = _.map(ctx.helper.deepClone(orders).rows, 'id');
        const subOrders = await ctx.model.Order.findAll({ where: { parentId: ids } });

        let objUsers = {};
        if (showUserName) {
            const userIds = _.map(ctx.helper.deepClone(orders).rows, 'userId');
            let userInfos = await ctx.model.User.findAll({ where: { id: userIds } });
            userInfos = ctx.helper.deepClone(userInfos);
            objUsers = _.keyBy(userInfos, 'id');
        }

        // 对数据进行转换 parentOrder: [{xxxx, subOrder: []}, {xxxx, subOrder: []}, {xxxx, subOrder: []}]
        orders.rows = this.orderMerge(orders.rows, subOrders);
        orders.rows.forEach(item => {
            if (showUserAddress) {
                item.userAddress = validator.isJSON('' + item.userAddress)
                    ? JSON.parse(item.userAddress)
                    : {};

                item.subOrder.forEach(i => {
                    i.userAddress = validator.isJSON('' + i.userAddress)
                        ? JSON.parse(i.userAddress)
                        : {};
                });
            } else {
                delete item.userAddress;
                item.subOrder.forEach(i => {
                    delete i.userAddress;
                });
            }
            if (showUserName) {
                item.userName = _.get(objUsers[item.userId], 'name', '用户');
            }
        });

        return orders;
    }

    async findOne(id, needAddress = true) {
        const { ctx } = this;

        const orders = await Promise.all([
            ctx.model.Order.findOne({
                where: { id }
            }),
            ctx.model.Order.findAll({ where: { parentId: id } })
        ]);
        if (!orders[0]) {
            return null;
        }
        const order = this.orderMerge([orders[0]], orders[1])[0];

        // 地址
        if (!needAddress) {
            delete order.userAddress;
            order.subOrder.forEach(i => {
                delete i.userAddress;
            });
        } else {
            order.userAddress = validator.isJSON('' + order.userAddress)
                ? JSON.parse(order.userAddress)
                : {};

            order.subOrder.forEach(i => {
                i.userAddress = validator.isJSON('' + i.userAddress)
                    ? JSON.parse(i.userAddress)
                    : {};
            });
        }

        return order;
    }

    orderMerge(parentOrder, subOrder) {
        const { ctx } = this;

        parentOrder = _.compact(parentOrder);

        parentOrder = ctx.helper.deepClone(parentOrder);
        if (_.isEmpty(parentOrder)) {
            return [];
        }
        subOrder = ctx.helper.deepClone(subOrder);

        const objSubOrder = _.groupBy(subOrder, 'parentId');
        parentOrder.forEach(item => {
            item.subOrder = objSubOrder[item.id] || [];
        });

        return parentOrder;
    }

    async update(body, orderId) {
        const { ctx } = this;
        const t = await ctx.model.transaction();
        const payTime = moment(body.time_end, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

        try {
            // 更新父订单
            await ctx.model.Order.update(
                {
                    payChannel: 1,
                    orderStatus: 1,
                    transactionId: body.transaction_id,
                    payTime,
                    orderSettlementStatus: 1,
                    orderSettlementTime: payTime
                },
                {
                    where: {
                        id: orderId
                    },
                    transaction: t
                }
            );

            // 更新子订单
            await ctx.model.Order.update(
                {
                    payChannel: 1,
                    orderStatus: 1,
                    transactionId: body.transaction_id,
                    payTime,
                    orderSettlementStatus: 1,
                    orderSettlementTime: payTime
                },
                {
                    where: {
                        parentId: orderId
                    },
                    transaction: t
                }
            );

            // 更新交易记录
            await ctx.model.TransactionRecords.update(
                {
                    transactionId: body.transaction_id,
                    payStatus: 1,
                    payResult: JSON.stringify(body)
                },
                {
                    where: {
                        orderNo: body.out_trade_no
                    },
                    transaction: t
                }
            );

            // 查询商品信息
            let orders = await ctx.model.Order.findAll({
                attributes: ['spuId', 'skuId', ['product_count', 'amount']],
                where: {
                    parentId: orderId
                },
                transaction: t
            });
            orders = ctx.helper.deepClone(orders);
            let spus = await ctx.model.Spu.findAll({
                attributes: ['id', 'inventory', 'salesVolume'],
                where: {
                    id: _.uniq(_.compact(_.map(orders, 'spuId')))
                },
                transaction: t
            });
            spus = ctx.helper.deepClone(spus);
            const objSpus = _.keyBy(spus, 'id');

            // spu 数据更新
            await Promise.map(_.uniqBy(orders, 'spuId'), async p => {
                // 库存
                let inventory = _.get(objSpus[p.spuId], 'inventory', 0);
                if (inventory - p.amount <= 0) {
                    inventory = 0;
                } else {
                    inventory = inventory - p.amount;
                }

                // 销量
                let salesVolume = _.get(objSpus[p.spuId], 'salesVolume', 0);
                salesVolume = salesVolume + p.amount;

                await ctx.model.Spu.update(
                    {
                        inventory,
                        salesVolume
                    },
                    {
                        where: {
                            id: p.spuId
                        },
                        transaction: t
                    }
                );
            });

            let skus = await ctx.model.Sku.findAll({
                attributes: ['id', 'inventory', 'salesVolume'],
                where: {
                    id: _.uniq(_.compact(_.map(orders, 'skuId')))
                }
            });
            skus = ctx.helper.deepClone(skus);
            const objSkus = _.keyBy(skus, 'id');

            // 更新商品库存和销量
            await Promise.map(orders, async o => {
                // 库存
                let inventory = _.get(objSkus[o.skuId], 'inventory', 0);
                ctx.logger.info('sku修改之前inventory: ', inventory);
                if (inventory - o.amount <= 0) {
                    inventory = 0;
                } else {
                    inventory = inventory - o.amount;
                }

                // 销量
                let salesVolume = _.get(objSkus[o.skuId], 'salesVolume', 0);
                salesVolume = salesVolume + o.amount;
                await ctx.model.Sku.update(
                    {
                        inventory,
                        salesVolume
                    },
                    {
                        where: {
                            id: o.skuId
                        },
                        transaction: t
                    }
                );
            });

            await t.commit();
            ctx.logger.info('更新订单状态成功');
            return;
        } catch (err) {
            // If the execution reaches this line, an error was thrown.
            // We rollback the transaction.
            await t.rollback();
            ctx.logger.error('更新订单失败: ', err);
            throw new Error('更新订单失败');
        }
    }

    async updateV2(body, orderId) {
        const { ctx } = this;
        const t = await ctx.model.transaction();

        try {
            // 更新父订单
            await ctx.model.Order.update(body, {
                where: {
                    id: orderId
                },
                transaction: t
            });

            // 更新子订单
            await ctx.model.Order.update(body, {
                where: {
                    parentId: orderId
                },
                transaction: t
            });

            await t.commit();
            ctx.logger.info('更新订单状态成功');
            return;
        } catch (err) {
            // If the execution reaches this line, an error was thrown.
            // We rollback the transaction.
            await t.rollback();
            ctx.logger.error('更新订单失败: ', err);
            throw new Error('更新订单失败');
        }
    }

    statusModifyList(status) {
        if (status === 1) {
            return [
                {
                    status: 2,
                    name: '已发货'
                }
            ];
        }

        if (status === -1) {
            return [
                {
                    status: -2,
                    name: '退货中'
                }
            ];
        }

        if (status === -2) {
            return [
                {
                    status: -3,
                    name: '已退货'
                }
            ];
        }
    }
}

module.exports = OrderService;

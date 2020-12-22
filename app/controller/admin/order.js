'use strict';

const _ = require('lodash');
const moment = require('moment');
const validator = require('validator');
const Controller = require('egg').Controller;

class OrderController extends Controller {
    async fetchList() {
        const { ctx, service } = this;
        const { pageSize, currentPage } = ctx.query;
        const limit = validator.isInt('' + pageSize) ? pageSize : 10;
        const offset = validator.isInt('' + currentPage) ? (+currentPage - 1) * +pageSize : 0;

        const data = await service.order.findAllPagination({
            limit,
            offset,
            showUserAddress: true,
            showUserName: true
        });

        ctx.success({ ctx, data });
    }

    async fetchOne() {
        const { ctx, service } = this;
        const { id } = ctx.params;

        const data = await service.order.findOne(id);

        if (_.isEmpty(ctx.helper.deepClone(data))) {
            ctx.fail({ ctx, code: 404, msg: '订单不存在' });
            return;
        }

        ctx.success({ ctx, data });
    }

    async statusModifyList() {
        const { ctx, service } = this;
        const { id } = ctx.params;

        const data = await service.order.findOne(id);

        if (_.isEmpty(ctx.helper.deepClone(data))) {
            ctx.fail({ ctx, code: 404, msg: '订单不存在' });
            return;
        }

        const statusList = ctx.service.order.statusModifyList(+data.orderStatus);
        if (!statusList) {
            ctx.fail({ ctx, code: 403, msg: '订单状态不允许修改' });
            return;
        }
        ctx.success({ ctx, data: statusList });
    }

    async statusModify() {
        const { ctx, service, app } = this;
        const { Sequelize } = app;
        const { Op } = Sequelize;
        const { orderId, orderStatus } = ctx.request.body;

        const data = await service.order.findOne(orderId, false);

        if (_.isEmpty(ctx.helper.deepClone(data))) {
            ctx.fail({ ctx, code: 404, msg: '订单不存在' });
            return;
        }

        const statusList = ctx.service.order.statusModifyList(+data.orderStatus);
        if (!statusList) {
            ctx.fail({ ctx, code: 403, msg: '订单状态不允许修改' });
            return;
        }

        if (_.isEmpty(_.find(statusList, ['status', orderStatus]))) {
            ctx.fail({ ctx, code: 403, msg: '订单状态不允许修改' });
            return;
        }

        await ctx.model.Order.update(
            { orderStatus },
            {
                where: {
                    [Op.or]: [{ id: orderId }, { parentId: orderId }]
                }
            }
        );
        ctx.success({ ctx });
    }

    async trackingNumber() {
        const { ctx, service, app } = this;
        const { Sequelize } = app;
        const { Op } = Sequelize;
        const {
            orderId,
            trackingNumber,
            deliveryTime = moment().format('YYYY-MM-DD HH:mm:ss')
        } = ctx.request.body;

        const data = await service.order.findOne(orderId, false);

        if (_.isEmpty(ctx.helper.deepClone(data))) {
            ctx.fail({ ctx, code: 404, msg: '订单不存在' });
            return;
        }

        await ctx.model.Order.update(
            { trackingNumber, deliveryTime },
            {
                where: {
                    [Op.or]: [{ id: orderId }, { parentId: orderId }]
                }
            }
        );
        ctx.success({ ctx });
    }
}

module.exports = OrderController;

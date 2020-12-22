/* eslint-disable no-unused-vars */
'use strict';

const _ = require('lodash');
const Decimal = require('decimal.js');
const CONST = require('../../constant/constant');
const xmlParser = require('xml2json');
const Controller = require('egg').Controller;

class PayController extends Controller {
    async createOrder() {
        const { ctx, service, app } = this;

        // 测试支付 openid
        const { openId = 'ouXMy5WK6HOMKpQc-4MzrDePg2BI' } = ctx.state.user;
        const { mp } = app.config;

        // orderId 为父订单
        const { orderId } = ctx.request.body;

        // 查询订单信息
        let order = await service.order.findOne(orderId, false);
        order = ctx.helper.deepClone(order);

        if (_.isEmpty(order)) {
            ctx.fail({ ctx, code: 400, msg: '订单不存在' });
            return;
        }

        let payOrder = {};
        try {
            const data = {
                tradeNo: order.orderNo, // 内部订单号
                totalFee: new Decimal(parseFloat(order.orderAmountTotal))
                    .mul(new Decimal(100))
                    .toFixed(), // 单位为分的标价金额
                body: '军创联合商品购买', // 应用市场上的APP名字-商品概述
                notifyUrl: mp.notifyUrl // 异步接收微信支付结果通知
            };
            ctx.logger.info('统一下单参数: ', data);
            payOrder = await service.mp.createOrder(openId, data);
        } catch (err) {
            ctx.logger.error('创建支付订单失败: ', err);
            ctx.fail({ ctx, msg: '创建支付订单失败', data: err });
            return;
        }
        await service.transactionRecords.create({
            orderNo: order.orderNo,
            payChannel: 1, // 微信
            unifiedorderStatus: payOrder.return_code === 'SUCCESS',
            unifiedorderResult: JSON.stringify(payOrder)
        });

        if (payOrder.code === -1) {
            ctx.logger.error('创建支付订单签名失败: ', payOrder);
            ctx.fail({ ctx, msg: '创建支付订单签名失败', data: payOrder });
            return;
        }
        ctx.success({ ctx, data: payOrder });
    }

    async notify() {
        const { ctx, service } = this;

        const body = ctx.request.body;
        // ctx.logger.info('body======>',body)
        try {
            const json = xmlParser.toJson(body);
            const { xml } = JSON.parse(json);
            const {
                appid, // 公众账号ID
                bank_type, // 付款银行
                cash_fee, // 现金支付金额
                device_info, // 设备号
                fee_type, // 货币种类
                is_subscribe, // 是否关注公众账号
                mch_id, // 商户号
                nonce_str, // 随机字符串
                openid, // 用户标识
                out_trade_no, // 商户订单号
                result_code, // 业务结果
                return_code, // 返回状态码
                sign, // 签名
                time_end, // 支付完成时间
                total_fee, // 订单金额
                trade_type, // 交易类型
                transaction_id, // 微信支付订单号
                attach
            } = xml;
            // status
            if (result_code !== 'SUCCESS') {
                ctx.fail({ ctx, msg: '支付失败:' + return_code, data: body });
                return;
            }

            // sign
            // const _sign = await service.sign.getPaySign(_.omit(body, 'sign'));
            // if (_sign !== sign) {
            //     ctx.logger.error('微信支付回调签名验证结果:', _sign);
            //     ctx.logger.error('微信支付回调签名验证结果:', sign);
            //     ctx.fail({ ctx, msg: '支付失败', data: body });
            //     return;
            // }

            // 根据 out_trade_no(系统内orderNo) 查询订单信息
            let order = await ctx.model.Order.findOne({
                where: {
                    orderNo: out_trade_no
                }
            });
            order = ctx.helper.deepClone(order);

            // 会回调多次 只更新一次
            if (order.orderStatus >= CONST.ORDER_STATUS_PAID) {
                ctx.success({ ctx });
                return;
            }

            const orderAmount = new Decimal(parseFloat(order.orderAmountTotal)).mul(
                new Decimal(100)
            );

            if (!orderAmount.equals(new Decimal(total_fee))) {
                ctx.fail({ ctx, msg: '支付失败, 金额错误', data: xml });
                return;
            }

            // 更新订单状态
            const updateOrderReturn = await service.order.update(xml, order.id);
            ctx.success({ ctx });
        } catch (err) {
            ctx.logger.error('xmlParser error: ', err);
            ctx.fail({ ctx });
            return;
        }
    }
}

module.exports = PayController;

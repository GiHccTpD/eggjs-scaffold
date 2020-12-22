'use strict';

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER, DECIMAL, DATE, BOOLEAN, NOW } = Sequelize;

    const Order = app.model.define(
        't_orders',
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '主键'
            },
            parentId: {
                type: INTEGER,
                defaultValue: 0,
                allowNull: false,
                comment: '父订单ID'
            },
            orderNo: {
                type: STRING(100),
                defaultValue: '',
                allowNull: false,
                comment: '订单编号'
            },
            userId: {
                type: INTEGER.UNSIGNED,
                defaultValue: 0,
                allowNull: false,
                comment: '用户ID'
            },
            shoppingCartId: {
                type: INTEGER.UNSIGNED,
                defaultValue: 0,
                allowNull: false,
                comment: '0 直接购买， 非零通过购物车购买'
            },
            orderStatus: {
                type: INTEGER(4),
                defaultValue: 0,
                allowNull: false,
                comment:
                    '订单状态 0未付款,1已付款,2已发货,3已签收,-1退货申请,-2退货中,-3已退货,-4取消交易'
            },
            afterStatus: {
                type: INTEGER(4),
                defaultValue: 0,
                allowNull: false,
                comment: '用户售后状态 0 未发起售后 1 申请售后 -1 售后已取消 2 处理中 200 处理完毕'
            },
            productCount: {
                type: INTEGER.UNSIGNED,
                defaultValue: 0,
                allowNull: false,
                comment: '商品数量'
            },
            productAmountTotal: {
                type: DECIMAL(12, 2),
                defaultValue: 0,
                allowNull: false,
                comment: '商品总价'
            },
            orderAmountTotal: {
                type: DECIMAL(12, 2),
                defaultValue: 0,
                allowNull: false,
                comment: '实际付款金额'
            },
            skuId: {
                type: INTEGER.UNSIGNED,
                defaultValue: 0,
                allowNull: false,
                comment: 'sku_id'
            },
            spuId: {
                type: INTEGER.UNSIGNED,
                defaultValue: 0,
                allowNull: false,
                comment: 'spu_id'
            },
            skuName: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: 'sku_name'
            },
            skuInfo: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: 'sku_info'
            },
            spuName: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: 'spuName'
            },
            spuCover: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '商品封面'
            },
            trackingNumber: {
                type: STRING(32),
                defaultValue: '',
                allowNull: false,
                comment: '运单号'
            },
            logisticsFee: {
                type: DECIMAL(12, 2),
                defaultValue: 0,
                allowNull: false,
                comment: '运费金额'
            },
            addressId: {
                type: INTEGER.UNSIGNED,
                defaultValue: 0,
                allowNull: false,
                comment: '收货地址id'
            },
            userAddress: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '收货地址信息冗余'
            },
            payChannel: {
                type: INTEGER(4).UNSIGNED,
                defaultValue: 1,
                allowNull: false,
                comment: '支付渠道 0余额 1微信 2支付宝'
            },
            transactionId: {
                type: STRING,
                comment: '订单支付单号'
            },
            payTime: {
                type: DATE,
                comment: '付款时间'
            },
            deliveryTime: {
                type: DATE,
                comment: '发货时间'
            },
            orderSettlementStatus: {
                type: BOOLEAN,
                comment: '订单结算状态 0未结算 1已结算'
            },
            orderSettlementTime: {
                type: DATE,
                comment: '订单结算时间'
            },
            createdAt: {
                type: DATE,
                defaultValue: NOW,
                comment: '记录添加时间'
            },
            updatedAt: {
                type: DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                comment: '记录修改时间'
            },
            deletedAt: {
                type: DATE,
                comment: '记录删除时间'
            }
        },
        {
            freezeTableName: true,
            // https://sequelize.org/master/manual/naming-strategies.html
            underscored: true,
            underscoredAll: true
            // indexes: [
            //     {
            //         unique: true,
            //         fields: ['orderSn']
            //     },
            //     {
            //         name: 'order_order_sn_member_id_order_status_out_trade_no_index',
            //         using: 'BTREE',
            //         fields: [
            //             'orderSn',
            //             'userId',
            //             'orderStatus',
            //             { attribute: 'outTradeNo', length: 19 }
            //         ]
            //     }
            // ]
        }
    );

    return Order;
};

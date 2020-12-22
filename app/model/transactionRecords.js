// t_transaction_records

'use strict';

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER, DATE, BOOLEAN, NOW, TEXT } = Sequelize;

    const PayRecords = app.model.define(
        't_pay_records',
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '主键'
            },
            orderNo: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '订单号'
            },
            transactionId: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '支付订单号'
            },
            payChannel: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '支付渠道 1微信 2支付宝'
            },
            unifiedorderStatus: {
                type: BOOLEAN,
                allowNull: false,
                defaultValue: 0,
                comment: '下单结果 1：成功 0：失败'
            },
            unifiedorderResult: {
                type: TEXT,
                allowNull: false,
                defaultValue: '',
                comment: '下单详情'
            },
            payStatus: {
                type: BOOLEAN,
                allowNull: false,
                defaultValue: 0,
                comment: '支付结果 1：成功 0：失败'
            },
            payResult: {
                type: TEXT,
                allowNull: false,
                defaultValue: '',
                comment: '支付结果详情'
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
            }
        },
        {
            freezeTableName: true,
            // https://sequelize.org/master/manual/naming-strategies.html
            underscored: true,
            underscoredAll: true,
            indexes: [
                {
                    name: 'pay_order_no_idx',
                    fields: ['orderNo', 'transactionId']
                }
            ]
        }
    );

    return PayRecords;
};

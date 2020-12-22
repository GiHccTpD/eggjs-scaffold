'use strict';

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER, DATE, NOW } = Sequelize;

    const ShoppingCart = app.model.define(
        't_shopping_cart',
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '主键'
            },
            userId: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '用户ID'
            },
            spuId: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '商品ID'
            },
            spuName: {
                type: STRING(30),
                defaultValue: '',
                allowNull: false,
                comment: '商品名称'
            },
            spuCover: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '商品封面'
            },
            skuId: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '商品SKU_ID'
            },
            skuName: {
                type: STRING(30),
                defaultValue: '',
                allowNull: false,
                comment: 'sku名称'
            },
            skuInfo: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: 'sku属性'
            },
            amount: {
                type: INTEGER,
                defaultValue: 1,
                allowNull: false,
                comment: '数量'
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
                    unique: true,
                    fields: ['userId', 'skuId']
                }
            ]
        }
    );

    return ShoppingCart;
};

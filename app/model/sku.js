'use strict';

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER, DATE, BOOLEAN, NOW, DECIMAL } = Sequelize;

    const SKU = app.model.define(
        't_products_sku',
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '主键'
            },
            mainCategoryId: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '商品主分类ID'
            },
            subCategoryId: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '商品二级分类ID'
            },
            spuId: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '商品ID'
            },
            skuName: {
                type: STRING(30),
                defaultValue: '',
                allowNull: false,
                comment: '具体规格商品名称'
            },
            info: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '具体规格信息，json格式'
            },
            inventory: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '库存数量'
            },
            salesVolume: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '销量'
            },
            price: {
                type: DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
                comment: '价格，精确到小数点之后两位小数'
            },
            isSale: {
                type: BOOLEAN,
                allowNull: false,
                defaultValue: 1,
                comment: '是否上架售卖 0：没有 1：售卖'
            },
            deleted: {
                type: BOOLEAN,
                allowNull: false,
                defaultValue: 0,
                comment: '是否删除 0：没有被删除；1：被删除'
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
            underscoredAll: true
        }
    );

    return SKU;
};

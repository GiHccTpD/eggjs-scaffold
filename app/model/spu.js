'use strict';

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER, DATE, BOOLEAN, NOW } = Sequelize;

    const SPU = app.model.define(
        't_products_spu',
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
            name: {
                type: STRING(30),
                defaultValue: '',
                allowNull: false,
                comment: '商品名称'
            },
            top: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '置顶推荐，非零被推荐状态，数字越大，排序越靠前'
            },
            images: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '图片链接地址'
            },
            cover: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '封面图片链接'
            },
            showPrice: {
                type: STRING,
                allowNull: false,
                defaultValue: 0,
                comment: '展示价格'
            },
            descriptions: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '描述'
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

    return SPU;
};

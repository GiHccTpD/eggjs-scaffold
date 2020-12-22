'use strict';

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER, DATE, BOOLEAN, NOW } = Sequelize;

    const MainCategory = app.model.define(
        't_products_main_categories',
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '主键'
            },
            name: {
                type: STRING(30),
                defaultValue: '',
                allowNull: false,
                comment: '名称'
            },
            icon: {
                type: STRING,
                allowNull: false,
                defaultValue: '',
                comment: '图标'
            },
            deleted: {
                type: BOOLEAN,
                allowNull: false,
                defaultValue: 0,
                comment: '是否删除 0：没有被删除；1：被删除'
            },
            weight: {
                type: INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: '排序权重 数值越大越靠前'
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

    return MainCategory;
};

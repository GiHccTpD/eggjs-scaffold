'use strict';

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER, DATE, NOW } = Sequelize;

    const ProductPropertyName = app.model.define(
        't_product_property_names',
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '主键'
            },
            name: {
                type: STRING(10),
                allowNull: false,
                comment: '名称'
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
            // 唯一索引
            indexes: [
                {
                    unique: true,
                    fields: ['name']
                }
            ]
        }
    );

    return ProductPropertyName;
};

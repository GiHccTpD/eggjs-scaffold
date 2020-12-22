'use strict';

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER } = Sequelize;

    const Region = app.model.define(
        't_regions',
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '主键'
            },
            pid: {
                type: INTEGER,
                defaultValue: 0,
                allowNull: false,
                comment: '行政区域父ID，例如区县的pid指向市，市的pid指向省，省的pid则是0'
            },
            name: {
                type: STRING(120),
                defaultValue: '',
                allowNull: false,
                comment: '行政区域名称'
            },
            type: {
                type: INTEGER,
                defaultValue: 0,
                allowNull: false,
                comment: '行政区域类型，如如1则是省， 如果是2则是市，如果是3则是区县'
            },
            postcode: {
                type: INTEGER,
                defaultValue: 0,
                allowNull: false,
                comment: '邮政编码'
            },
            keyword: {
                type: STRING(5),
                comment: '关键字'
            },
            isHot: {
                type: INTEGER,
                defaultValue: 0,
                allowNull: false,
                comment: '热度 0是 1否'
            },
            isdirectlycity: {
                type: INTEGER,
                defaultValue: 0,
                allowNull: false,
                comment: '是否是直辖市 0是,1否'
            }
        },
        {
            timestamps: false,
            freezeTableName: true,
            // https://sequelize.org/master/manual/naming-strategies.html
            underscored: true,
            underscoredAll: true,
            indexes: [
                {
                    name: 'parent_id',
                    using: 'BTREE',
                    fields: ['pid']
                },
                {
                    name: 'region_type',
                    using: 'BTREE',
                    fields: ['type']
                },
                {
                    name: 'agency_id',
                    using: 'BTREE',
                    fields: ['postcode']
                }
            ]
        }
    );

    return Region;
};

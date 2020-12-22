'use strict';

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER, DATE, BOOLEAN, NOW } = Sequelize;

    const User = app.model.define(
        't_user_addresses',
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '主键'
            },
            userId: {
                type: INTEGER,
                defaultValue: 0,
                comment: '用户ID'
            },
            mobilePhone: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '手机号'
            },
            receiver: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '收件人'
            },
            isDefault: {
                type: BOOLEAN,
                defaultValue: false,
                comment: '是否默认 0：不是默认 1：是默认'
            },
            postcode: {
                type: INTEGER,
                defaultValue: 0,
                comment: '邮政编码'
            },
            provinceId: {
                type: INTEGER,
                defaultValue: 0,
                comment: '省级ID'
            },
            cityId: {
                type: INTEGER,
                defaultValue: 0,
                comment: '市级ID'
            },
            countyId: {
                type: INTEGER,
                defaultValue: 0,
                comment: '县区ID'
            },
            town: {
                type: STRING,
                defaultValue: '',
                comment: '乡镇街道地址'
            },
            detail: {
                type: STRING,
                defaultValue: '',
                comment: '详细地址'
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
                    fields: ['mobilePhone']
                },
                {
                    unique: true,
                    fields: ['openId']
                }
            ]
        }
    );

    return User;
};

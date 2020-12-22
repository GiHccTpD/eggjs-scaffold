'use strict';

const CONST = require('../constant/constant');

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER, DATE, BOOLEAN, NOW } = Sequelize;

    const User = app.model.define(
        't_users',
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '主键'
            },
            name: {
                type: STRING(30),
                allowNull: false,
                comment: '名称'
            },
            age: {
                type: INTEGER,
                defaultValue: 0,
                comment: '年龄'
            },
            mobilePhone: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '手机号'
            },
            password: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '密码(加盐后)'
            },
            salt: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '盐'
            },
            openId: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '微信openid'
            },
            avatar: {
                type: STRING,
                defaultValue: CONST.DEFAULT_AVATAR,
                allowNull: false,
                comment: '头像'
            },
            wxAvatar: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '微信头像'
            },
            wxUserInfo: {
                type: STRING,
                defaultValue: '',
                allowNull: false,
                comment: '微信信息'
            },
            type: {
                type: INTEGER,
                defaultValue: 3,
                allowNull: false,
                comment: '用户类型：1.超级管理员 2.管理员 3.小程序用户'
            },
            deleted: {
                type: BOOLEAN,
                defaultValue: false,
                comment: '是否删除 0：未删除 1：已删除'
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

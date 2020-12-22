'use strict';

module.exports = app => {
    const { Sequelize } = app;
    const { STRING, INTEGER } = Sequelize;

    const Gallery = app.model.define(
        't_gallery',
        {
            id: {
                type: INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: '主键'
            },
            title: {
                type: STRING(20),
                defaultValue: '',
                comment: '标题'
            },
            imageUrl: {
                type: STRING,
                comment: '图片链接'
            },
            redirectPath: {
                type: STRING,
                comment: '重定向路径'
            }
        },
        {
            timestamps: false,
            freezeTableName: true,
            // https://sequelize.org/master/manual/naming-strategies.html
            underscored: true,
            underscoredAll: true
        }
    );

    return Gallery;
};

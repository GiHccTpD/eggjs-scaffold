'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const { ctx, service, app } = this;
        const { Sequelize } = app;
        const { Op } = Sequelize;
        // 查询轮播图
        // 查询分类
        const fetchResult = await Promise.all([service.gallery.findAll({})]);
        const galleryList = ctx.helper.deepClone(fetchResult[0]);
        let mainCategoryList = await service.mainCategory.findAll({});
        const mainCategoryIds = _.map(ctx.helper.deepClone(mainCategoryList), 'mainCategoryId');
        mainCategoryList = ctx.helper.deepClone(mainCategoryList);

        // 查询二级分类
        const subCategoryList = await service.subCategory.findAll({
            where: { mainCategoryId: mainCategoryIds }
        });
        const subCategoryObj = _.groupBy(subCategoryList, 'mainCategoryId');
        mainCategoryList.forEach(item => {
            item.subCategoryList = subCategoryObj[item.mainCategoryId] || [];
        });
        mainCategoryList = _.filter(mainCategoryList, item => {
            return !_.isEmpty(item.subCategoryList);
        });

        const where = {
            deleted: 0,
            isSale: 1,
            top: {
                [Op.gt]: 0
            }
        };

        const productList = await service.spu.findAndCountAll({ where });

        ctx.success({
            ctx,
            data: {
                galleryList,
                productList,
                mainCategoryList
            }
        });
    }

    async categoryList() {
        const { ctx, service } = this;
        let mainCategoryList = await service.mainCategory.findAll({});
        mainCategoryList = ctx.helper.deepClone(mainCategoryList);
        const mainCategoryIds = _.map(ctx.helper.deepClone(mainCategoryList), 'mainCategoryId');

        // 查询二级分类
        const subCategoryList = await service.subCategory.findAll({
            where: { mainCategoryId: mainCategoryIds }
        });
        const subCategoryObj = _.groupBy(subCategoryList, 'mainCategoryId');
        mainCategoryList.forEach(item => {
            item.subCategoryList = subCategoryObj[item.mainCategoryId] || [];
        });
        mainCategoryList = _.filter(mainCategoryList, item => {
            return !_.isEmpty(item.subCategoryList);
        });

        ctx.success({
            ctx,
            data: { mainCategoryList }
        });
    }
}

module.exports = HomeController;

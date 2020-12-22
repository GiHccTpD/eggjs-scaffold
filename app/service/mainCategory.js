'use strict';

const _ = require('lodash');
const Service = require('egg').Service;

class MainCategoryService extends Service {
    async findAll({ attributes, where, order }) {
        const { ctx } = this;
        const list = await ctx.model.MainCategory.findAll({
            attributes: attributes || [
                ['id', 'mainCategoryId'],
                ['name', 'mainName'],
                ['icon', 'mainIcon'],
                'deleted'
            ],
            where: where || { deleted: 0 },
            order: order || [['weight', 'desc']]
        });

        return list;
    }

    async findOne(where) {
        const { ctx } = this;
        const res = await ctx.model.MainCategory.findOne({
            // attributes: [['id', 'mainCategoryId'], ['name', 'mainName'], ['icon', 'mainIcon']],
            where: where || { deleted: 0 }
        });

        return res;
    }

    async mainCategoryDel(id) {
        const { ctx } = this;
        const t = await ctx.model.transaction();

        try {
            await ctx.model.MainCategory.update({ deleted: 1 }, { where: { id }, transaction: t });

            await ctx.model.SubCategory.update(
                { mainCategoryId: 0 },
                { where: { mainCategoryId: id }, transaction: t }
            );

            await ctx.model.Spu.update(
                { mainCategoryId: 0 },
                { where: { mainCategoryId: id }, transaction: t }
            );

            await ctx.model.Sku.update(
                { mainCategoryId: 0 },
                { where: { mainCategoryId: id }, transaction: t }
            );

            await t.commit();
        } catch (err) {
            // If the execution reaches this line, an error was thrown.
            // We rollback the transaction.
            await t.rollback();
            ctx.logger.error('删除主分类失败: ', err);
            throw new Error('删除主分类失败');
        }
    }

    async findMainListWithSubLIst() {
        const { ctx, service, app } = this;
        const { Sequelize } = app;

        // 查询分类
        let mainCategoryList = await this.findAll({ where: {} });
        mainCategoryList = ctx.helper.deepClone(mainCategoryList);
        const mainCategoryIds = _.map(ctx.helper.deepClone(mainCategoryList), 'mainCategoryId');
        // mainCategoryIds.push(0); // 未分类
        // if (!_.isEmpty(_.filter(mainCategoryList, ['deleted', true]))) {
        //     mainCategoryList.push({
        //         mainCategoryId: 0,
        //         deleted: false,
        //         mainName: '未分类',
        //         mainIcon: CONST.DEFAULT_CATEGORY_ICON,
        //         subCategoryList: []
        //     });
        // }
        // mainCategoryList = _.filter(mainCategoryList, ['deleted', false]);

        // 查询商品
        let productsCountByMainCategoryId = await ctx.model.Spu.findAll({
            group: ['mainCategoryId'],
            attributes: ['mainCategoryId', [Sequelize.fn('COUNT', 'id'), 'count']]
        });
        productsCountByMainCategoryId = ctx.helper.deepClone(productsCountByMainCategoryId);
        const objProductsCountByMainCategoryId = _.keyBy(
            productsCountByMainCategoryId,
            'mainCategoryId'
        );

        let productsCountBySubCategoryId = await ctx.model.Spu.findAll({
            group: ['subCategoryId'],
            attributes: ['subCategoryId', [Sequelize.fn('COUNT', 'id'), 'count']]
        });
        productsCountBySubCategoryId = ctx.helper.deepClone(productsCountBySubCategoryId);
        const objProductsCountBySubCategoryId = _.keyBy(
            productsCountBySubCategoryId,
            'subCategoryId'
        );

        // 查询二级分类
        let subCategoryList = await service.subCategory.findAll({
            where: { mainCategoryId: mainCategoryIds }
        });
        subCategoryList = ctx.helper.deepClone(subCategoryList);

        subCategoryList.forEach(item => {
            item.allowedDeleted = !(
                _.get(objProductsCountBySubCategoryId[item.subCategoryId], 'count', 0) > 0
            );
        });

        const subCategoryObj = _.groupBy(subCategoryList, 'mainCategoryId');

        mainCategoryList.forEach(item => {
            item.allowedDeleted = !(
                _.get(objProductsCountByMainCategoryId[item.mainCategoryId], 'count', 0) > 0
            );
            item.subCategoryList = subCategoryObj[item.mainCategoryId] || [];
            // if (!_.isEmpty(_.filter(item.subCategoryList, ['deleted', true]))) {
            //     item.subCategoryList.push({
            //         subCategoryId: 0,
            //         deleted: false,
            //         subName: '未分类',
            //         subIcon: CONST.DEFAULT_CATEGORY_ICON
            //     });
            // }
            // item.subCategoryList = _.filter(item.subCategoryList, ['deleted', false]);
        });

        return mainCategoryList;
    }
}

module.exports = MainCategoryService;

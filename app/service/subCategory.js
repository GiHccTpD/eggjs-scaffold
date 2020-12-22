'use strict';

const Service = require('egg').Service;

class SubCategoryService extends Service {
    async findAll({ attributes, where, order }) {
        const { ctx } = this;
        const list = ctx.model.SubCategory.findAll({
            attributes: attributes || [
                ['id', 'subCategoryId'],
                ['name', 'subName'],
                ['icon', 'subIcon'],
                'mainCategoryId',
                'deleted'
            ],
            where: where || { deleted: 0 },
            order: order || [['weight', 'desc']]
        });

        return list;
    }

    async findOne(where) {
        const { ctx } = this;
        const res = await ctx.model.SubCategory.findOne({
            where: where || { deleted: 0 }
        });

        return res;
    }
    async del(id) {
        const { ctx } = this;
        const t = await ctx.model.transaction();

        try {
            await ctx.model.SubCategory.update({ deleted: 1 }, { where: { id }, transaction: t });

            await ctx.model.Spu.update(
                { subCategoryId: 0 },
                { where: { subCategoryId: id }, transaction: t }
            );

            await ctx.model.Sku.update(
                { subCategoryId: 0 },
                { where: { subCategoryId: id }, transaction: t }
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

    async findSubList(mainCategoryId) {
        const { ctx } = this;

        // 查询分类
        let subCategoryList = await this.findAll({ where: { mainCategoryId, deleted: 0 } });
        subCategoryList = ctx.helper.deepClone(subCategoryList);
        // if (!_.isEmpty(_.filter(subCategoryList, ['deleted', true]))) {
        //     subCategoryList.push({
        //         mainCategoryId,
        //         subName: '未分类',
        //         deleted: false,
        //         subIcon: CONST.DEFAULT_CATEGORY_ICON
        //     });
        // }
        // subCategoryList = _.filter(subCategoryList, ['deleted', false]);

        return subCategoryList;
    }
}

module.exports = SubCategoryService;

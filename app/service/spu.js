'use strict';

const _ = require('lodash');
const Service = require('egg').Service;

class SpuService extends Service {
    async fetchProductCountByMainIdAndSubId(mainId, subId) {
        const { ctx } = this;
        const total = await ctx.model.SPU.count({
            where: {
                mainCategoryId: mainId,
                subCategoryId: subId,
                deleted: 0,
                isSale: 1
            }
        });

        return total;
    }

    async findAndCountAll({ attributes, where, order, limit, offset }) {
        const { ctx } = this;
        attributes = attributes || [
            'id',
            'mainCategoryId',
            'cover',
            'subCategoryId',
            'top',
            'name',
            'images',
            'showPrice',
            'salesVolume',
            'createdAt',
            'updatedAt'
        ];

        const defaults = {
            deleted: 0,
            isSale: 1
        };
        where = where || defaults;

        order = order || [['top', 'desc'], ['salesVolume', 'desc']];
        limit = limit || 10;
        offset = offset || 0;
        const res = await ctx.model.Spu.findAndCountAll({
            attributes,
            where,
            order,
            limit,
            offset
        });

        res.rows.forEach(item => {
            item.images = ctx.helper.imagesHandler(item.images);
        });

        return res;
    }

    async findDetail(id) {
        const attributes = [
            'id',
            'mainCategoryId',
            'subCategoryId',
            'top',
            'name',
            'images',
            'cover',
            'showPrice',
            'inventory',
            'salesVolume',
            'descriptions',
            'createdAt',
            'updatedAt'
        ];

        const where = {
            deleted: 0,
            isSale: 1,
            id
        };

        const res = await this.ctx.model.Spu.findOne({
            attributes,
            where
        });

        if (!_.isEmpty(res)) {
            res.images = res.images.split(',');
            res.images = _.filter(res.images, _.size);
        }

        return res;
    }

    async add(body) {
        const { ctx } = this;
        const t = await ctx.model.transaction();

        try {
            const spu = await ctx.model.Spu.create(_.omit(body, 'skuList'));
            body.skuList.forEach(item => {
                item.spuId = spu.id;
            });
            const skus = await ctx.model.Sku.bulkCreate(body.skuList);

            await t.commit();
            return {
                spu: ctx.helper.deepClone(spu),
                skuList: ctx.helper.deepClone(skus)
            };
        } catch (err) {
            // If the execution reaches this line, an error was thrown.
            // We rollback the transaction.
            await t.rollback();
            ctx.logger.error('新增商品失败: ', err);
            throw new Error('新增商品失败');
        }
    }

    async update(body) {
        const res = await this.ctx.model.Spu.update(_.omit(body, ['id']), {
            where: { id: body.id }
        });
        return res;
    }

    async findByName(name, id) {
        const { app } = this;
        const { Sequelize } = app;
        const { Op } = Sequelize;

        let where = {};
        if (id) {
            where = {
                name,
                deleted: 0,
                [Op.not]: id
            };
        } else {
            where = {
                name,
                deleted: 0
            };
        }
        console.log(where);
        const res = await this.ctx.model.Spu.findOne({
            where
        });
        return res;
    }
}

module.exports = SpuService;

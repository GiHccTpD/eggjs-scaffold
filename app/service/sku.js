'use strict';

const _ = require('lodash');
const Service = require('egg').Service;

class SkuService extends Service {
    async findListBySpuId(spuId) {
        const { ctx } = this;

        const res = ctx.model.Sku.findAll({
            where: {
                spuId,
                deleted: 0,
                isSale: 1
            },
            attributes: [
                'spuId',
                'skuName',
                'info',
                'price',
                'inventory',
                'createdAt',
                'updatedAt',
                'id'
            ]
        });

        return res;
    }
    async findListBySkuIds(id) {
        const { ctx } = this;

        const res = ctx.model.Sku.findAll({
            where: {
                id,
                deleted: 0,
                isSale: 1
            },
            attributes: [
                'spuId',
                'skuName',
                'info',
                'price',
                'inventory',
                'createdAt',
                'updatedAt',
                'id'
            ]
        });

        return res;
    }

    async findOne(id) {
        const { ctx } = this;

        const res = await ctx.model.Sku.findOne({
            where: {
                deleted: 0,
                isSale: 1,
                id
            }
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
        const res = await this.ctx.model.Sku.findOne({
            where
        });
        return res;
    }

    async update(body) {
        const { ctx } = this;
        const t = await ctx.model.transaction();

        try {
            await ctx.model.Sku.update(_.omit(body, ['spuId', 'id']), {
                where: {
                    id: body.id
                }
            });

            await t.commit();
            return true;
        } catch (err) {
            // If the execution reaches this line, an error was thrown.
            // We rollback the transaction.
            await t.rollback();
            throw new Error('更新sku失败');
        }
    }
}

module.exports = SkuService;

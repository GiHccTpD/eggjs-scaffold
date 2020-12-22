'use strict';

const Service = require('egg').Service;

class ShoppingCartService extends Service {
    async findOne(where) {
        const { ctx } = this;
        const res = await ctx.model.ShoppingCart.findOne({ where });
        return ctx.helper.deepClone(res);
    }

    async update(param, where) {
        const { ctx } = this;
        const res = await ctx.model.ShoppingCart.update(param, {
            where
        });
        return res;
    }

    async create({ skuId, spuId, amount, userId }) {
        const { ctx } = this;

        const sku = await ctx.model.Sku.findOne({ where: { id: skuId } });
        const spu = await ctx.model.Spu.findOne({ where: { id: spuId } });

        const params = {
            userId,
            amount,
            skuId,
            spuId,
            spuName: spu.name,
            spuCover: spu.cover || ctx.helper.imagesHandler(spu.spuImages)[0],
            skuName: sku.skuName,
            skuInfo: sku.info
        };
        const res = await ctx.model.ShoppingCart.create(params);
        return res;
    }

    async fetchList(params) {
        const { ctx } = this;
        params.attributes = [
            'id',
            'amount',
            'skuId',
            'spuId',
            'spuName',
            'spuCover',
            'skuName',
            'skuInfo'
        ];
        const data = await ctx.model.ShoppingCart.findAndCountAll(params);

        return data;
    }

    async fetchAll(params) {
        const { ctx } = this;
        params.attributes = [
            'id',
            'amount',
            'skuId',
            'spuId',
            'spuName',
            'spuCover',
            'skuName',
            'skuInfo'
        ];
        const data = await ctx.model.ShoppingCart.findAll(params);

        return data;
    }

    async del(where) {
        const { ctx } = this;

        const res = await ctx.model.ShoppingCart.destroy({ where });
        return res;
    }
}

module.exports = ShoppingCartService;

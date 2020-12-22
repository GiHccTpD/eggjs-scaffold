'use strict';

const _ = require('lodash');
const validator = require('validator');
const Controller = require('egg').Controller;

class SpuController extends Controller {
    async fetchList() {
        const { ctx, service } = this;

        const { mainCategoryId, subCategoryId } = ctx.params;
        const { pageSize, currentPage } = ctx.query;
        if (!validator.isInt('' + mainCategoryId)) {
            ctx.fail({ ctx, code: 400, msg: 'mainCategoryId错误' });
            return;
        }

        if (!validator.isInt('' + subCategoryId)) {
            ctx.fail({ ctx, code: 400, msg: 'subCategoryId错误' });
            return;
        }

        const limit = validator.isInt('' + pageSize) ? pageSize : 10;
        const offset = validator.isInt('' + currentPage) ? (+currentPage - 1) * +pageSize : 0;

        const res = await service.spu.findAndCountAll({
            where: {
                mainCategoryId,
                subCategoryId,
                deleted: 0,
                isSale: 1
            },
            limit,
            offset
        });

        ctx.success({ ctx, data: res });
    }

    async fetchDetail() {
        const { ctx, service } = this;

        const { id } = ctx.params;

        if (!validator.isInt('' + id)) {
            ctx.fail({ ctx, code: 400, msg: '商品ID错误' });
            return;
        }

        const res = await Promise.all([
            service.spu.findDetail(id),
            service.sku.findListBySpuId(id)
        ]);
        const spu = ctx.helper.deepClone(res[0]);
        if (_.isEmpty(spu)) {
            ctx.fail({ ctx, code: 404, msg: '商品不存在' });
            return;
        }
        const sku = ctx.helper.deepClone(res[1]);

        sku.forEach(s => {
            if (!_.isEmpty(sku)) {
                s.info = validator.isJSON('' + s.info) ? JSON.parse(s.info) : [];
            } else {
                spu.sku = [];
            }
        });
        spu.sku = sku;
        ctx.success({ ctx, data: spu });
    }
}

module.exports = SpuController;

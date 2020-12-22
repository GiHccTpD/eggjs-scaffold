'use strict';

const _ = require('lodash');
const validator = require('validator');
const CONST = require('../../constant/constant');
const Controller = require('egg').Controller;

class ProductController extends Controller {
    async addPropertyName() {
        const { ctx } = this;
        const { name } = ctx.request.body;

        if (!name) {
            ctx.fail({ ctx, code: 400, msg: '属性名称错误' });
            return;
        }

        if (!validator.isLength('' + name, { min: 1, max: 10 })) {
            ctx.fail({ ctx, code: 400, msg: '属性名称长度错误' });
            return;
        }

        const isExisted = await this.service.productProperty.findPropertyNameByName(name);

        if (!_.isEmpty(ctx.helper.deepClone(isExisted))) {
            ctx.fail({ ctx, code: 400, msg: '属性名称错误' });
            return;
        }

        await ctx.model.ProductPropertyName.create({ name });
        ctx.success({ ctx });
    }
    async addPropertyValue() {
        const { ctx } = this;
        const { name, nameId } = ctx.request.body;

        if (!validator.isInt('' + nameId)) {
            ctx.fail({ ctx, code: 400, msg: '属性值名称ID错误' });
            return;
        }

        if (!name) {
            ctx.fail({ ctx, code: 400, msg: '属性值名称错误' });
            return;
        }

        if (!validator.isLength('' + name, { min: 1, max: 10 })) {
            ctx.fail({ ctx, code: 400, msg: '属性值名称长度错误' });
            return;
        }

        const isExisted = await this.service.productProperty.findPropertyValueByName(name, nameId);

        if (!_.isEmpty(ctx.helper.deepClone(isExisted))) {
            ctx.fail({ ctx, code: 400, msg: '属性值名称错误' });
            return;
        }

        await ctx.model.ProductPropertyValue.create({ name, nameId });
        ctx.success({ ctx });
    }

    async findPropertyNameList() {
        const list = await this.service.productProperty.findPropertyNameList();
        this.ctx.success({ ctx: this.ctx, data: list });
    }

    async findPropertyValueList() {
        const { nameId } = this.ctx.params;

        if (!validator.isInt('' + nameId)) {
            this.ctx.fail({ ctx: this.ctx, code: 400, msg: '属性值名称ID错误' });
            return;
        }
        const list = await this.service.productProperty.findPropertyValueList(nameId);
        this.ctx.success({ ctx: this.ctx, data: list });
    }

    async fetchList() {
        const { ctx, service, app } = this;
        const { Sequelize } = app;
        const { Op } = Sequelize;

        const { mainCategoryId, subCategoryId } = ctx.params;
        const { pageSize, currentPage, orderField = 'top', order = 'desc', name = '' } = ctx.query;
        if (mainCategoryId && !validator.isInt('' + mainCategoryId)) {
            ctx.fail({ ctx, code: 400, msg: 'mainCategoryId错误' });
            return;
        }

        if (subCategoryId && !validator.isInt('' + subCategoryId)) {
            ctx.fail({ ctx, code: 400, msg: 'subCategoryId错误' });
            return;
        }

        const limit = validator.isInt('' + pageSize) ? pageSize : 10;
        const offset = validator.isInt('' + currentPage) ? (+currentPage - 1) * +pageSize : 0;
        const attributes = [
            'id',
            'mainCategoryId',
            'subCategoryId',
            'cover',
            'inventory',
            'isSale',
            'top',
            'name',
            'images',
            'showPrice',
            'salesVolume'
        ];

        const where = {
            deleted: 0
        };
        if (mainCategoryId) {
            where.mainCategoryId = mainCategoryId;
        }
        if (mainCategoryId) {
            where.subCategoryId = subCategoryId;
        }

        if (name) {
            where.name = {
                [Op.like]: '%' + name + '%'
            };
        }

        const res = await service.spu.findAndCountAll({
            attributes,
            where,
            order: [[orderField, order]],
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
        const sku = res[1];

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

    async add() {
        const { ctx, service } = this;
        const body = ctx.request.body;
        const {
            mainCategoryId,
            subCategoryId,
            name,
            top,
            images,
            cover = CONST.DEFAULT_GOODS_PIC,
            // descriptions,
            inventory,
            isSale = 1,
            skuList = []
        } = body;
        let { showPrice = '' } = body;

        if (!validator.isInt('' + mainCategoryId, { min: 1 })) {
            ctx.fail({ ctx, code: 400, msg: '主分类ID错误' });
            return;
        }

        if (!validator.isInt('' + subCategoryId, { min: 1 })) {
            ctx.fail({ ctx, code: 400, msg: '二级分类ID错误' });
            return;
        }

        if (!(name && validator.isLength('' + name, { min: 1, max: 30 }))) {
            ctx.fail({ ctx, code: 400, msg: '商品名称错误' });
            return;
        }

        const spuByName = await service.spu.findByName(name);
        if (!_.isEmpty(ctx.helper.deepClone(spuByName))) {
            ctx.fail({ ctx, code: 400, msg: '商品已存在' });
            return;
        }

        if (!(cover && validator.isLength('' + cover, { min: 1 }))) {
            ctx.fail({ ctx, code: 400, msg: '商品封面错误' });
            return;
        }

        if (!validator.isInt('' + top)) {
            ctx.fail({ ctx, code: 400, msg: '置顶参数必须为数字' });
            return;
        }

        if (!(images && validator.isLength('' + images, { min: 1 }))) {
            ctx.fail({ ctx, code: 400, msg: '商品图片错误' });
            return;
        }

        if (!validator.isInt('' + inventory)) {
            ctx.fail({ ctx, code: 400, msg: '库存必须为数字' });
            return;
        }

        if (!validator.isIn('' + isSale, ['0', '1'])) {
            ctx.fail({ ctx, code: 400, msg: '上下架只能为0或1' });
            return;
        }

        if (_.isEmpty(skuList)) {
            ctx.fail({ ctx, code: 400, msg: '至少包含一个sku' });
            return;
        }

        const maxPrice = _.maxBy(skuList, 'price');
        const minPrice = _.maxBy(skuList, 'price');
        if (maxPrice !== minPrice) {
            showPrice = `${minPrice.price}-${maxPrice.price}`;
        } else {
            showPrice = `${minPrice.price}`;
        }
        body.showPrice = showPrice;

        body.skuList.forEach(item => {
            item.mainCategoryId = mainCategoryId;
            item.subCategoryId = subCategoryId;
            item.isSale = 1;

            if (!item.info) {
                item.info = '[]';
            }
        });

        try {
            const data = await service.spu.add(body);

            ctx.success({ ctx, data });
        } catch (err) {
            ctx.logger.error('商品添加失败:', err);
            ctx.fail({ ctx, msg: '商品添加失败', data: err });
            return;
        }
    }

    async update() {
        const { ctx, service } = this;
        const body = ctx.request.body;
        const {
            id,
            mainCategoryId,
            subCategoryId,
            name,
            top,
            images,
            cover = CONST.DEFAULT_GOODS_PIC,
            // descriptions,
            inventory,
            isSale = 1
        } = body;

        if (!validator.isInt('' + id, { min: 1 })) {
            ctx.fail({ ctx, code: 400, msg: '商品ID错误' });
            return;
        }

        if (mainCategoryId && !validator.isInt('' + mainCategoryId, { min: 1 })) {
            ctx.fail({ ctx, code: 400, msg: '主分类ID错误' });
            return;
        }

        if (subCategoryId && !validator.isInt('' + subCategoryId, { min: 1 })) {
            ctx.fail({ ctx, code: 400, msg: '二级分类ID错误' });
            return;
        }

        if (name) {
            if (!(name && validator.isLength('' + name, { min: 1, max: 30 }))) {
                ctx.fail({ ctx, code: 400, msg: '商品名称错误' });
                return;
            }

            const spuByName = await service.spu.findByName(name, id);
            if (!_.isEmpty(ctx.helper.deepClone(spuByName))) {
                ctx.fail({ ctx, code: 400, msg: '商品已存在' });
                return;
            }
        }

        if (cover && !(cover && validator.isLength('' + cover, { min: 1 }))) {
            ctx.fail({ ctx, code: 400, msg: '商品封面错误' });
            return;
        }

        if (top && !validator.isInt('' + top)) {
            ctx.fail({ ctx, code: 400, msg: '置顶参数必须为数字' });
            return;
        }

        if (images && !(images && validator.isLength('' + images, { min: 1 }))) {
            ctx.fail({ ctx, code: 400, msg: '商品图片错误' });
            return;
        }

        if (inventory && !validator.isInt('' + inventory)) {
            ctx.fail({ ctx, code: 400, msg: '库存必须为数字' });
            return;
        }

        if (isSale && !validator.isIn('' + isSale, ['0', '1'])) {
            ctx.fail({ ctx, code: 400, msg: '上下架只能为0或1' });
            return;
        }

        try {
            await service.spu.update(body);

            ctx.success({ ctx });
        } catch (err) {
            ctx.logger.error('商品添加失败:', err);
            ctx.fail({ ctx, msg: '商品添加失败', data: err });
            return;
        }
    }
    async upload() {
        const { ctx, service } = this;
        const file = ctx.request.files[0];
        /**
         * file:  {
                field: 'image',
                filename: 'head-img-upload-test.png',
                encoding: '7bit',
                mime: 'image/png',
                fieldname: 'image',
                transferEncoding: '7bit',
                mimeType: 'image/png',
                filepath: '/var/folders/_6/zpv6n0nd05g65hdzr1l213vm0000gn/T/egg-multipart-tmp/micromall/2020/12/07/10/cccc1038-7db1-499d-a9e6-bd08b750add0.png'
            }
         */

        // 配置在 CONST.OSS_BUCKET_FOLDER
        const ossFolder = 'goods';
        let url;
        try {
            url = await service.image.upload(file, ossFolder);
        } catch (err) {
            ctx.logger.error('图片上传失败: ', err);
            ctx.fail({ ctx, code: 500, data: err, msg: '图片上传失败' });
            return;
        }

        ctx.success({ ctx, data: { url } });
    }
    async updateSku() {
        const { ctx, service } = this;
        const body = ctx.request.body;
        const { id, skuName, price, isSale = 1 } = body;

        if (!validator.isInt('' + id, { min: 1 })) {
            ctx.fail({ ctx, code: 400, msg: 'SKU ID错误' });
            return;
        }

        if (skuName) {
            if (!validator.isLength('' + skuName, { min: 1, max: 30 })) {
                ctx.fail({ ctx, code: 400, msg: '商品SKU名称错误' });
                return;
            }

            const spuByName = await service.sku.findByName(skuName, id);
            if (!_.isEmpty(ctx.helper.deepClone(spuByName))) {
                ctx.fail({ ctx, code: 400, msg: '商品SKU名称已存在' });
                return;
            }
        }

        if (!validator.isInt('' + price)) {
            ctx.fail({ ctx, code: 400, msg: '价格错误' });
            return;
        }

        if (isSale && !validator.isIn('' + isSale, ['0', '1'])) {
            ctx.fail({ ctx, code: 400, msg: '上下架只能为0或1' });
            return;
        }

        const sku = await service.sku.findOne(id);
        body.spuId = sku.spuId;

        if (_.isEmpty(ctx.helper.deepClone(sku))) {
            ctx.fail({ ctx, code: 400, msg: 'sku不存在' });
            return;
        }

        try {
            await service.sku.update(body);
        } catch (err) {
            ctx.fail({ ctx, code: 500, msg: '更新sku错误' });
            return;
        }

        let skus = await ctx.model.Sku.findAll({
            where: {
                spuId: body.spuId
            }
        });
        skus = ctx.helper.deepClone(skus);

        let showPrice = '';
        const maxPrice = _.maxBy(skus, 'price');
        const minPrice = _.maxBy(skus, 'price');
        if (maxPrice !== minPrice) {
            showPrice = `${minPrice.price}-${maxPrice.price}`;
        } else {
            showPrice = `${minPrice.price}`;
        }
        body.showPrice = showPrice;

        await ctx.model.Spu.update(
            {
                showPrice: body.showPrice
            },
            {
                where: {
                    id: body.spuId
                }
            }
        );

        ctx.success({ ctx });
    }
}

module.exports = ProductController;

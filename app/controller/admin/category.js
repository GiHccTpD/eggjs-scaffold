'use strict';

const _ = require('lodash');
const validator = require('validator');
const CONST = require('../../constant/constant');

const Controller = require('egg').Controller;

class CategoryController extends Controller {
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
        const ossFolder = 'category';
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

    async mainCategoryAdd() {
        const { ctx, service } = this;
        const { name, icon = CONST.DEFAULT_CATEGORY_ICON, weight = 0 } = ctx.request.body;

        if (!validator.isLength('' + name, { min: 1, max: 20 })) {
            ctx.fail({ ctx, code: 400, msg: 'name错误' });
            return;
        }

        // check
        const mc = await service.mainCategory.findOne({ deleted: 0, name: _.trim(name) });
        if (!_.isEmpty(ctx.helper.deepClone(mc))) {
            ctx.fail({ ctx, code: 400, msg: '名称重复', data: mc });
            return;
        }

        // add
        const res = await ctx.model.MainCategory.create({ name, icon, weight });

        ctx.success({ ctx, data: { id: res.id } });
    }

    async mainCategoryModify() {
        const { ctx, service, app } = this;
        const { id, name, icon = CONST.DEFAULT_CATEGORY_ICON, weight = 0 } = ctx.request.body;
        const { Sequelize } = app;
        const { Op } = Sequelize;

        if (!validator.isLength('' + name, { min: 1, max: 20 })) {
            ctx.fail({ ctx, code: 400, msg: 'name错误' });
            return;
        }

        // check
        const mc1 = await service.mainCategory.findOne({ deleted: 0, id });
        if (_.isEmpty(ctx.helper.deepClone(mc1))) {
            ctx.fail({ ctx, code: 404, msg: '不存在' });
            return;
        }
        const mc = await service.mainCategory.findOne({
            deleted: 0,
            name: _.trim(name),
            id: {
                [Op.ne]: id
            }
        });
        if (!_.isEmpty(ctx.helper.deepClone(mc))) {
            ctx.fail({ ctx, code: 400, msg: '名称重复', data: mc });
            return;
        }

        await ctx.model.MainCategory.update({ name, icon, weight }, { where: { id } });

        ctx.success({ ctx });
    }

    async mainCategoryDel() {
        const { ctx, service } = this;
        const { id } = ctx.params;

        if (!validator.isInt('' + id)) {
            ctx.fail({ ctx, code: 400, msg: 'name错误' });
            return;
        }

        // check
        const mc1 = await service.mainCategory.findOne({ deleted: 0, id });
        if (_.isEmpty(ctx.helper.deepClone(mc1))) {
            ctx.fail({ ctx, code: 404, msg: '不能存在' });
            return;
        }

        await service.mainCategory.mainCategoryDel(id);
        ctx.success({ ctx });
    }

    async mainCategoryListWithSubCategoryList() {
        const { ctx, service } = this;
        const data = await service.mainCategory.findMainListWithSubLIst();
        ctx.success({ ctx, data });
    }

    async subCategoryAdd() {
        const { ctx, service } = this;
        const {
            name,
            icon = CONST.DEFAULT_CATEGORY_ICON,
            weight = 0,
            mainCategoryId = 0
        } = ctx.request.body;

        if (!validator.isInt('' + mainCategoryId, { min: 1 })) {
            ctx.fail({ ctx, code: 400, msg: 'mainCategoryId错误' });
            return;
        }

        if (!validator.isLength('' + name, { min: 1, max: 20 })) {
            ctx.fail({ ctx, code: 400, msg: 'name错误' });
            return;
        }

        // check
        const mc = await service.subCategory.findOne({
            deleted: 0,
            name: _.trim(name)
        });
        if (!_.isEmpty(ctx.helper.deepClone(mc))) {
            ctx.fail({ ctx, code: 400, msg: '名称重复', data: mc });
            return;
        }

        // add
        const res = await ctx.model.SubCategory.create({
            name: _.trim(name),
            icon,
            weight,
            mainCategoryId
        });
        ctx.success({ ctx, data: { id: res.id } });
    }

    async subCategoryModify() {
        const { ctx, service, app } = this;
        const { Sequelize } = app;
        const { Op } = Sequelize;

        const {
            id,
            name,
            icon = CONST.DEFAULT_CATEGORY_ICON,
            weight = 0,
            mainCategoryId
        } = ctx.request.body;

        if (!validator.isLength('' + name, { min: 1, max: 20 })) {
            ctx.fail({ ctx, code: 400, msg: 'name错误' });
            return;
        }

        if (!validator.isInt('' + mainCategoryId)) {
            ctx.fail({ ctx, code: 400, msg: 'mainCategoryId错误' });
            return;
        }

        // check
        const sc1 = await service.subCategory.findOne({ deleted: 0, id });
        if (_.isEmpty(ctx.helper.deepClone(sc1))) {
            ctx.fail({ ctx, code: 404, msg: '不存在' });
            return;
        }
        const sc = await service.subCategory.findOne({
            deleted: 0,
            name: _.trim(name),
            id: {
                [Op.ne]: id
            }
        });
        if (!_.isEmpty(ctx.helper.deepClone(sc))) {
            ctx.fail({ ctx, code: 400, msg: '名称重复', data: sc });
            return;
        }

        await ctx.model.SubCategory.update(
            { name, icon, weight, mainCategoryId },
            { where: { id } }
        );
        ctx.success({ ctx });
    }

    async subCategoryDel() {
        const { ctx, service } = this;
        const { id } = ctx.params;

        if (!validator.isInt('' + id)) {
            ctx.fail({ ctx, code: 400, msg: 'id错误' });
            return;
        }

        // check
        const mc1 = await service.subCategory.findOne({ deleted: 0, id });
        if (_.isEmpty(ctx.helper.deepClone(mc1))) {
            ctx.fail({ ctx, code: 404, msg: '不能存在' });
            return;
        }

        await service.subCategory.del(id);
        ctx.success({ ctx });
    }

    async subCategoryListWithSubCategoryList() {
        const { ctx, service, mainCategoryId } = this;

        if (!validator.isInt('' + mainCategoryId, { min: 1 })) {
            ctx.fail({ ctx, code: 400, msg: 'mainCategoryId错误' });
            return;
        }
        const data = await service.subCategory.findSubList(mainCategoryId);
        ctx.success({ ctx, data });
    }
}

module.exports = CategoryController;

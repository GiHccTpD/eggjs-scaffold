'use strict';

const Controller = require('egg').Controller;

class GalleryController extends Controller {
    async add() {
        const { ctx } = this;
        const { title, imageUrl, redirectPath } = ctx.request.body;

        await ctx.model.Gallery.create({ title, imageUrl, redirectPath });
        ctx.success({ ctx });
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
        const ossFolder = 'gallery';
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
    async edit() {
        const { ctx } = this;
        const { title, imageUrl, redirectPath, id } = ctx.request.body;

        await ctx.model.Gallery.update(
            { title, imageUrl, redirectPath },
            {
                where: {
                    id
                }
            }
        );
        ctx.success({ ctx });
    }
    async del() {
        const { ctx } = this;
        const { id } = ctx.params;

        await ctx.model.Gallery.destroy({
            where: {
                id
            }
        });
        ctx.success({ ctx });
    }
    async list() {
        const { ctx } = this;
        const data = await ctx.model.Gallery.findAll({});
        ctx.success({ ctx, data });
    }
}

module.exports = GalleryController;

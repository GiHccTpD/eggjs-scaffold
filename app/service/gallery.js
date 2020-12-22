'use strict';

const Service = require('egg').Service;

class GalleryService extends Service {
    async findAll() {
        const { ctx } = this;
        const list = ctx.model.Gallery.findAll({
            attributes: ['id', 'title', 'imageUrl', 'redirectPath']
        });

        return list;
    }
}

module.exports = GalleryService;

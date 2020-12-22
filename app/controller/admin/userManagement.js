'use strict';

const validator = require('validator');
const Controller = require('egg').Controller;

class UserManagementController extends Controller {
    async fetchList() {
        const { ctx, service } = this;
        const { pageSize, currentPage } = ctx.query;
        const limit = validator.isInt('' + pageSize) ? pageSize : 10;
        const offset = validator.isInt('' + currentPage) ? (+currentPage - 1) * +pageSize : 0;

        const data = await service.user.fetchMpUsers({
            limit,
            offset
        });

        ctx.success({ ctx, data });
    }
}

module.exports = UserManagementController;

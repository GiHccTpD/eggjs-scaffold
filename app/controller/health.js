'use strict';

const Controller = require('egg').Controller;

class HealthController extends Controller {
    healthCheck() {
        const { ctx } = this;
        ctx.success();
    }
}

module.exports = HealthController;

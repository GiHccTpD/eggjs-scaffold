'use strict';

const Service = require('egg').Service;

class TransactionRecordService extends Service {
    async create(body) {
        const res = await this.ctx.model.TransactionRecords.create(body);
        return res;
    }
}

module.exports = TransactionRecordService;

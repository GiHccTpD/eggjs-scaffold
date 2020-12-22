'use strict';

const Service = require('egg').Service;

class ProductService extends Service {
    async findPropertyNameByName(name) {
        const propertyName = await this.ctx.model.ProductPropertyName.findOne({ where: { name } });
        return propertyName;
    }

    async findPropertyNameList() {
        const list = await this.ctx.model.ProductPropertyName.findAll();
        return list;
    }
    async findPropertyValueByName(name, propertyNameId) {
        const propertyName = await this.ctx.model.ProductPropertyValue.findOne({
            where: { name, nameId: propertyNameId }
        });
        return propertyName;
    }

    async findPropertyValueList(propertyNameId) {
        const list = await this.ctx.model.ProductPropertyValue.findAll({
            where: { nameId: propertyNameId }
        });
        return list;
    }
}

module.exports = ProductService;

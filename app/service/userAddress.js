'use strict';

const _ = require('lodash');
const area = require('../constant/area');
const Service = require('egg').Service;

class UserAddressService extends Service {
    async fetchRegionList(where) {
        const attributes = ['id', 'pid', 'name', 'type', 'postcode', 'isdirectlycity'];
        const data = this.ctx.model.Region.findAll({ where, attributes });
        return data;
    }

    async fetchList(where) {
        const attributes = [
            'id',
            'mobilePhone',
            'receiver',
            'isDefault',
            'postcode',
            'provinceId',
            'cityId',
            'countyId',
            'town',
            'detail'
        ];
        let list = await this.ctx.model.UserAddress.findAll({
            attributes,
            where,
            order: [['isDefault', 'desc'], ['id', 'desc']]
        });
        list = this.ctx.helper.deepClone(list);
        list.forEach(item => {
            item.provinceName = area.province_list[item.provinceId];
            item.cityName = area.city_list[item.cityId];
            item.countyName = area.county_list[item.countyId];
        });
        return list;
    }

    async add(params) {
        const { ctx } = this;
        // const { Sequelize } = app;
        const t = await ctx.model.transaction();

        try {
            if (params.setDefault) {
                await ctx.model.UserAddress.update(
                    {
                        isDefault: 0
                    },
                    {
                        where: {
                            userId: params.userId
                        },
                        transaction: t
                    }
                );
            }

            await ctx.model.UserAddress.create(params, {
                transaction: t
            });
            t.commit();
            return;
        } catch (err) {
            // If the execution reaches this line, an error was thrown.
            // We rollback the transaction.
            await t.rollback();
            ctx.logger.error('新增地址记录失败: ', err);
            throw new Error('新增地址记录失败');
        }
    }

    async edit(params) {
        const { ctx } = this;
        // const { Sequelize } = app;
        const t = await ctx.model.transaction();

        try {
            if (params.setDefault) {
                await ctx.model.UserAddress.update(
                    {
                        isDefault: 0
                    },
                    {
                        where: {
                            userId: params.userId
                        },
                        transaction: t
                    }
                );
            }

            await ctx.model.UserAddress.update(params, {
                where: {
                    id: params.id
                },
                transaction: t
            });
            t.commit();
            return;
        } catch (err) {
            // If the execution reaches this line, an error was thrown.
            // We rollback the transaction.
            await t.rollback();
            ctx.logger.error('更新地址记录失败: ', err);
            throw new Error('更新地址记录失败');
        }
    }

    async del(where) {
        const { ctx } = this;

        const res = await ctx.model.UserAddress.destroy({ where });
        return res;
    }

    async findDetail(id, userId) {
        const { ctx } = this;

        const where = { id };
        if (userId) {
            where.userId = userId;
        }

        const attributes = [
            'id',
            'userId',
            'mobilePhone',
            'receiver',
            'isDefault',
            'postcode',
            'provinceId',
            'cityId',
            'countyId',
            'town',
            'detail'
        ];

        let address = await ctx.model.UserAddress.findOne({
            attributes,
            where
        });
        address = ctx.helper.deepClone(address);

        if (_.isEmpty(address)) {
            return {};
        }

        address.provinceName = area.province_list[address.provinceId];
        address.cityName = area.city_list[address.cityId];
        address.countyName = area.county_list[address.countyId];

        return address;
    }
}

module.exports = UserAddressService;

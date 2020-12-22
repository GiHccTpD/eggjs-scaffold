'use strict';

module.exports = (options, app) => {
    return async function maintain(ctx, next) {
        // 1.从环境变量判断运维状态
        const status = parseInt(process.env.APP_MAINTAIN);
        if (!status) {
            // 正常状态
            return next();
        }
        // 短期运维
        if (status === app.config.maintenanceStatus.maintenance) {
            throw new Error('service_maintenance');
        }
        // 停机运维
        if (status === app.config.maintenanceStatus.upgrade) {
            throw new Error('service_upgrade');
        }
        return next();
    };
};

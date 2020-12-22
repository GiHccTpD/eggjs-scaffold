'use strict';

/**
 * Egg框架内置插件
 */
const inner = {
    // 统一异常处理
    onerror: false,
    // Session 实现
    session: false,
    // 安全
    security: true,
    // 定时任务
    schedule: true,
    // 多语言
    i18n: false,
    // 文件流式上传
    multipart: false,
    // 静态服务器
    static: false,
    // jsonp 支持
    jsonp: false,
    // 模板引擎
    view: false,
    // 文件和文件夹监控（只在开发环境生效）
    watcher: true
};

/**
 * 第三方插件
 */
const thirdParty = {
    // Redis插件，使用ioredis库
    redis: {
        enable: true,
        package: 'egg-redis'
    },
    // 跨域支持
    cors: {
        enable: true,
        package: 'egg-cors'
    },
    // JWT插件
    jwt: {
        enable: true,
        package: 'egg-jwt'
    },
    sequelize: {
        package: 'egg-sequelize',
        enable: true
    },
    mp: {
        package: 'egg-mp',
        enable: true
    },
    alinode: {
        enable: true,
        package: 'egg-alinode'
    },
    // https://github.com/eggjs/egg-router-plus
    routerPlus: {
        enable: true,
        package: 'egg-router-plus'
    },
    multipart: {
        enable: true,
        package: 'egg-multipart'
    }
};

module.exports = Object.assign(inner, thirdParty);

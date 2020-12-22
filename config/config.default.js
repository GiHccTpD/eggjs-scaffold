'use strict';

const path = require('path');
const os = require('os');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = {
        // use for cookie sign key, should change to your own and keep security
        keys: appInfo.name + '_1606451965039_8482',
        env: process.env.EGG_SERVER_ENV,
        // 中间件
        middleware: [
            'addTraceId',
            'errorHandler',
            'tokenRequired',
            'notFoundHandler',
            'parseQuery',
            'maintain',
            'responseTime'
        ],

        // 错误处理中间件
        errorHandler: {
            enable: true
        },
        userAuth: {
            enable: true
        },
        // 禁用框架自带404
        notfound: {
            enable: true
        },
        // API接口鉴权中间件
        tokenRequired: {
            enable: true,
            // 忽略授权的中间件
            whiteListRoutes: [
                'post|/v1/mp/login',
                'post|/v1/admin/register',
                'post|/v1/admin/login',
                'get|/health/check',
                'post|/v1/console/login',
                'get|/v1/mp/home',
                'get|/v1/mp/categoryList',
                'get|/v1/mp/products/',
                'get|/v1/mp/product/detail/',
                'post|/v1/mp/pay/notifyUrl',
                'put|/v1/admin/order/statusModify'
            ]
            // // 忽略用户授权的路由（由于以下路由都不需要获取用户信息，为了避免无效的用户查询，需要进行过滤）
            // ignoreAuthRoutes: [
            //     'get|/1.0/config/error_code' // 错误码
            // ]
        },
        // 运维状态控制中间件
        maintain: {
            enable: true
        },
        // 默认日志
        logger: {
            // level: 'NONE', // NONE: 关闭所有打印到文件的日志; DEBUG:打印所有级别日志到文件中
            disableConsoleAfterReady: process.env.EGG_SERVER_ENV === 'prod',
            consoleLevel: process.env.EGG_SERVER_ENV === 'prod' ? 'INFO' : 'DEBUG', // console
            coreLogger: {
                consoleLevel: 'INFO'
            },
            dir: path.join(__dirname, '..', 'logs')
        },
        // post数据解析
        bodyParser: {
            // https://github.com/eggjs/egg/issues/974#issuecomment-388561452
            jsonLimit: '10mb',
            formLimit: '10mb',
            enable: true,
            encoding: 'utf8',
            strict: true,
            // @see https://github.com/hapijs/qs/blob/master/lib/parse.js#L8 for more options
            queryString: {
                arrayLimit: 100,
                depth: 5,
                parameterLimit: 1000
            },
            enableTypes: ['json', 'form', 'text'],
            extendTypes: {
                text: ['text/xml', 'application/xml']
            }
        },
        // Eggs内置安全插件配置
        security: {
            csrf: {
                enable: false // 关闭csrf检测
            }
        },
        // 跨域支持
        cors: {
            origin: '*',
            allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
        },
        // JWT配置
        jwt: {
            secret: '5e3140acf6048ad642875c4723d2f734'
        },
        // mysql 配置
        sequelize: {
            dialect: 'mysql',
            database: process.env.MYSQL_DB_NAME || 'micromall',
            host: process.env.MYSQL_DB_HOST || 'localhost',
            port: process.env.MYSQL_DB_PORT || 3306,
            username: process.env.MYSQL_DB_USERNAME || 'root',
            password: process.env.MYSQL_DB_PASSWORD || 'Yg9YhKp9yKkY',
            timezone: '+08:00',
            dialectOptions: {
                dateStrings: true,
                typeCast(field, next) {
                    if (field.type === 'DATETIME') {
                        return field.string();
                    }
                    return next();
                }
            }
            // delegate: 'myModel', // load all models to `app[delegate]` and `ctx[delegate]`, default to `model`
            // baseDir: 'my_model', // load all files in `app/${baseDir}` as models, default to `model`
            // exclude: 'index.js', // ignore `app/${baseDir}/index.js` when load models, support glob and array
            // more sequelize options
        },
        // redis配置
        redis: {
            client: {
                host: process.env.REDIS_HOST || 'localhost', // Redis host
                port: process.env.REDIS_PORT || '6379', // Redis port
                password: process.env.REDIS_PASSWORD || '',
                db: process.env.REDIS_DB || 0
            }
        },
        onerror: {
            json(err, ctx) {
                // json handler
                ctx.body = {
                    code: 500,
                    msg: '服务器内部错误,请稍后重试',
                    data: {}
                };
                ctx.status = 500;
            }
        },
        multipart: {
            mode: 'file',
            fileSize: '50mb',
            tmpdir: path.join(os.tmpdir(), 'egg-multipart-tmp', appInfo.name),
            whitelist: [
                // images
                '.jpg',
                '.jpeg', // image/jpeg
                '.png', // image/png, image/x-png
                '.gif', // image/gif
                '.bmp', // image/bmp
                '.wbmp', // image/vnd.wap.wbmp
                '.webp',
                '.tif',
                '.psd',
                // text
                '.svg',
                '.js',
                '.jsx',
                '.json',
                '.css',
                '.less',
                '.html',
                '.htm',
                '.xml',
                // tar
                '.zip',
                '.gz',
                '.tgz',
                '.gzip',
                // video
                '.mp3',
                '.mp4',
                '.avi'
            ]
        },
        alinode: {
            appid: '86941',
            secret: 'db527c4697e69fc10ad51302f34f8c85298420e2'
        }
    };

    // add your user config here
    const userConfig = {};

    return {
        ...config,
        ...userConfig
    };
};

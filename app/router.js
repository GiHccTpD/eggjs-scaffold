/**
 * 路由入口
 */

'use strict';

const fs = require('fs');
const path = require('path');

module.exports = app => {
    // 自动加载路由
    const routeFiles = fs.readdirSync(path.join(__dirname, './router'));
    routeFiles.forEach(file => {
        if (path.extname(file) === '.js') {
            require('./router/' + file)(app);
        }
    });
};

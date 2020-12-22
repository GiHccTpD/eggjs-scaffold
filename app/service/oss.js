'use strict';

const OSS = require('ali-oss');
const request = require('request');
const CONST = require('../constant/constant');
const Service = require('egg').Service;

class OssService extends Service {
    // 获取oss上传对象
    get ossClient() {
        const aliyunOss = this.app.config.aliyunOss;
        const ossClient = new OSS({ ...aliyunOss });
        return ossClient;
    }

    async putStreamForWechatAvatarUrl(fileUrl, fileName) {
        const { ctx } = this;
        const arrFileUrl = fileUrl.split('/');
        fileName = fileName || arrFileUrl[arrFileUrl.length - 1];
        const stream = request(fileUrl);
        try {
            const res = await this.ossClient.putStream('user/' + fileName + '.jpg', stream);
            const url = CONST.IMAGE_DOMAIN + '/' + res.name;
            return url;
        } catch (err) {
            ctx.logger.error('上传微信头像错误: ', err);
            throw err;
        }
    }

    async put(fileName, filePath) {
        const { ctx } = this;
        try {
            const res = await this.ossClient.put(fileName, filePath);
            const url = CONST.IMAGE_DOMAIN + '/' + res.name;
            return url;
        } catch (err) {
            ctx.logger.error('上传图片错误:', err);
            throw err;
        }
    }
}

module.exports = OssService;

/**
 * Helper 扩展
 *
 * 主要是实现常用的 utility 函数。
 * 框架会把 app/extend/helper.js 中定义的对象与内置 helper 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 helper 对象。
 * this 是 helper 对象，在其中可以调用其他 helper 方法，this.ctx => context 对象，this.app => application 对象
 * 调用方式：ctx.helper
 */

'use strict';

const crypto = require('crypto');
const md5 = require('js-md5');
const _ = require('lodash');
const moment = require('moment');

module.exports = {
    /**
     * MD5加密
     * @param  {String} str 待加密字符窜
     * @return {String}     md5加密
     */
    md5(str) {
        return md5(str);
    },
    /**
     * SHA1加密
     * @param  {String} str     加密字符窜
     * @param  {String} encode  编码方式，默认：hex-16进制
     * @return {String}         加密结果
     */
    sha1(str, encode = 'hex') {
        return crypto
            .createHash('sha1')
            .update(str)
            .digest(encode);
    },
    filterSearchKeyword(keyword) {
        // 清空左右空格
        keyword = _.trim(keyword);
        if (keyword !== null) {
            // 替换特殊字符为空 + - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \ /％
            keyword = keyword
                .replace(/\\/g, '')
                .replace(/\+/g, '')
                .replace(/\\-/g, '')
                .replace(/=/g, '')
                .replace(/&&/g, '')
                .replace(/\|/g, '')
                .replace(/>/g, '')
                .replace(/</g, '')
                .replace(/!/g, '')
                .replace(/\(/g, '')
                .replace(/\)/g, '')
                .replace(/\{/g, '')
                .replace(/}/g, '')
                .replace(/\[/g, '')
                .replace(/]/g, '')
                .replace(/\^/g, '')
                .replace(/"|'/g, '')
                .replace(/~/g, '')
                .replace(/\*/g, '')
                .replace(/\?/g, '')
                .replace(/:/g, '')
                .replace(/\//g, '')
                .replace(/@|&|#|\$/g, '')
                .replace(/。|，|;|:|！|？|￥|…|&|·|《|》|〈|〉|“|“|‘|’/g, ''); // 中文字符
            keyword = _.trim(keyword);
        }
        return keyword;
    },

    /**
     * 密码算法
     * @param {*} text
     * @return {String}  password
     */
    passwordResolve(text) {
        for (let i = 0; i < 512; i++) {
            text = crypto
                .createHash('sha512')
                .update(text)
                .digest();
        }
        return crypto
            .createHash('sha512')
            .update(text)
            .digest('base64');
    },
    /**
     * 加密盐值
     * @param {*} text
     * @return {String}  salt
     */
    generateSalt(text) {
        return Buffer.from(text + new Date().getTime()).toString('base64');
    },
    generateRandomCode(minNum, maxNum) {
        const random = minNum + Math.ceil(Math.random() * maxNum);
        if (random > maxNum) return random - minNum;
        return random;
    },
    /**
     * 生成短信验证码
     * @return {Number}
     */
    generateCode() {
        const minNum = 100000;
        const maxNum = 999999;
        const random = minNum + Math.ceil(Math.random() * maxNum);
        if (random > maxNum) {
            return random - minNum;
        }
        return random;
    },
    formatNickname(nickname) {
        nickname = nickname ? nickname.toString().trim() : '';
        // eslint-disable-next-line no-irregular-whitespace
        return nickname.replace(/[@#: 　]+/g, '');
    },
    // 转成url安全base64编码
    toUrlSafeBase64(buf) {
        return buf
            .toString('base64')
            .replace(/\+/g, '-') // Convert '+' to '-'
            .replace(/\//g, '_') // Convert '/' to '_'
            .replace(/=+$/, ''); // Remove ending '='
    },
    /**
     * 128位分组对称加密
     * @param  {Buffer} buf 需加密的buffer
     * @param  {String} key 加密秘钥
     * @param  {String} iv  偏移向量
     * @return {String}     加密后的base64字符窜
     */
    aes128Cbc(buf, key, iv) {
        const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        cipher.setAutoPadding(true);
        const bf = [];
        bf.push(cipher.update(buf));
        bf.push(cipher.final());
        return Buffer.concat(bf).toString('base64');
    },
    aes128CbcDecode(data, key, iv) {
        const cipherChunks = [];
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        decipher.setAutoPadding(true);
        cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
        cipherChunks.push(decipher.final('utf8'));
        return cipherChunks.join('');
    },
    /**
     *  根据ids顺序重新排序data数组
     * @param {Array} ids 一个id列表
     * @param {Array} data 根据id列表查出来的数据
     */
    sortByIdArray(ids, data) {
        const result = new Array(ids.length);
        for (const item of data) {
            const index = ids.indexOf(item.id);
            if (index > -1) {
                result[index] = item;
            }
        }
        return _.compact(result);
    },
    /**
     * @param {Array} nums 一个数字
     * 获取近几天的YYYY-MM-DD Array[String]
     */
    getLastDayOfKeys(nums) {
        const date = new Date();
        const keys = [];
        while (--nums >= 0) {
            const momentDate = moment(date);
            keys.push(momentDate.subtract(nums, 'day').format('YYYY-MM-DD'));
        }
        return keys;
    },
    getRandStr(num) {
        return Math.random()
            .toString(36)
            .substring(num);
    },
    errorCode: {
        200: 'success',
        201: 'success',
        202: '请求被接收',
        204: '客户端告知服务器删除一个资源,服务器移除它',
        206: '请求成功,但是只有部分回应',
        400: '请求无效,数据不正确,请重试',
        401: '请求没有权限,Token缺少、无效或者超时',
        403: '用户得到授权,但是访问是被禁止的',
        404: 'not found',
        406: '请求失败,请求头部不一致,请重试',
        410: '请求的资源被永久删除,且不会再得到的',
        422: '请求失败,请验证参数',
        500: '服务器发生错误,请检查服务器',
        502: '网关错误',
        503: '服务不可用,服务器暂时过载或维护',
        504: '网关超时'
    },
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    imagesHandler(images = '') {
        images = images.split(',');
        images = _.filter(images, _.size);
        return images || [];
    }
};

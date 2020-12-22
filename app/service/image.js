'use strict';

const path = require('path');
const CONST = require('../constant/constant');
const Service = require('egg').Service;

class ImageService extends Service {
    async upload(file, ossBucketFolder) {
        const { ctx, service } = this;
        /**
         * file:  {
                field: 'image',
                filename: 'head-img-upload-test.png',
                encoding: '7bit',
                mime: 'image/png',
                fieldname: 'image',
                transferEncoding: '7bit',
                mimeType: 'image/png',
                filepath: '/var/folders/_6/zpv6n0nd05g65hdzr1l213vm0000gn/T/egg-multipart-tmp/micromall/2020/12/07/10/cccc1038-7db1-499d-a9e6-bd08b750add0.png'
            }
         */
        let basename = path.basename(file.filename);
        const extname = path.extname(basename);
        basename = path.basename(basename, extname);
        basename = `${basename}-${Date.now()}${extname}`;
        const name = CONST.OSS_BUCKET_FOLDER[ossBucketFolder.toUpperCase()] + basename;
        let result;
        try {
            // process file or upload to cloud storage
            result = await service.oss.put(name, file.filepath);
        } catch (err) {
            throw err;
        } finally {
            // remove tmp files and don't block the request's response
            // cleanupRequestFiles won't throw error even remove file io error happen
            ctx.cleanupRequestFiles();
            // remove tmp files before send response
            // await ctx.cleanupRequestFiles();
        }

        return result;
    }
}

module.exports = ImageService;

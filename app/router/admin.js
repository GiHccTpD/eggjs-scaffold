'use strict';

/** 管理后台接口
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/health/check', controller.health.healthCheck);

    const v1Router = router.namespace('/v1/admin');

    // 如果有的API不需要token校验 需要去config.default.js里面的whiteListRoutes配置
    v1Router.post('/register', controller.admin.user.register);
    v1Router.post('/login', controller.admin.user.login);
    v1Router.put('/userInfo', controller.admin.user.userInfo);
    v1Router.get('/test', controller.admin.user.index);
    v1Router.get('/mpUsers', controller.admin.userManagement.fetchList);
    v1Router.post('/category/upload', controller.admin.category.upload);
    v1Router.post('/mainCategory', controller.admin.category.mainCategoryAdd);
    v1Router.get('/mainCategory', controller.admin.category.mainCategoryListWithSubCategoryList);
    v1Router.put('/mainCategory', controller.admin.category.mainCategoryModify);
    v1Router.delete('/mainCategory/:id', controller.admin.category.mainCategoryDel);

    v1Router.post('/subCategory', controller.admin.category.subCategoryAdd);
    v1Router.get(
        '/:mainSubId/subCategory',
        controller.admin.category.subCategoryListWithSubCategoryList
    );
    v1Router.put('/subCategory', controller.admin.category.subCategoryModify);
    v1Router.delete('/subCategory/:id', controller.admin.category.subCategoryDel);

    v1Router.get('/orders', controller.admin.order.fetchList);
    v1Router.get('/order/detail/:id', controller.admin.order.fetchOne);
    v1Router.get('/order/:id/statusModifyList', controller.admin.order.statusModifyList);
    v1Router.put('/order/statusModify', controller.admin.order.statusModify);
    v1Router.put('/order/trackingNumber', controller.admin.order.trackingNumber);

    v1Router.post('/product/property/names', controller.admin.product.addPropertyName);
    v1Router.get('/product/property/names', controller.admin.product.findPropertyNameList);
    v1Router.post('/product/property/values', controller.admin.product.addPropertyValue);
    v1Router.get(
        '/product/property/:nameId/values',
        controller.admin.product.findPropertyValueList
    );
    v1Router.get('/products/:mainCategoryId/:subCategoryId', controller.admin.product.fetchList);
    v1Router.get('/products', controller.admin.product.fetchList);
    v1Router.get('/product/detail/:id', controller.admin.product.fetchDetail);
    v1Router.post('/product/add', controller.admin.product.add);
    v1Router.post('/product/upload', controller.admin.product.upload);
    v1Router.put('/product', controller.admin.product.update);
    v1Router.put('/product/sku', controller.admin.product.updateSku);

    v1Router.get('/gallery', controller.admin.gallery.list);
    v1Router.post('/gallery', controller.admin.gallery.add);
    v1Router.post('/gallery/upload', controller.admin.gallery.upload);
    v1Router.put('/gallery', controller.admin.gallery.edit);
    v1Router.delete('/gallery/:id', controller.admin.gallery.del);
};

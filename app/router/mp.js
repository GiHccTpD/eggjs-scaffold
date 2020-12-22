'use strict';

/** 微信小程序端接口
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    const v1Router = router.namespace('/v1/mp');
    v1Router.post('/login', controller.mp.user.login);
    v1Router.get('/home', controller.mp.home.index);
    v1Router.get('/categoryList', controller.mp.home.categoryList);
    v1Router.get('/products/:mainCategoryId/:subCategoryId', controller.mp.spu.fetchList);
    v1Router.get('/product/detail/:id', controller.mp.spu.fetchDetail);
    v1Router.post('/shoppingCart', controller.mp.shoppingCart.add);
    v1Router.put('/shoppingCart', controller.mp.shoppingCart.update);
    v1Router.get('/shoppingCart', controller.mp.shoppingCart.fetchList);
    v1Router.delete('/shoppingCart/:id', controller.mp.shoppingCart.del);
    v1Router.delete('/shoppingCart/all', controller.mp.shoppingCart.del);
    v1Router.get('/regionList/:type', controller.mp.userAddress.fetchRegionList);
    v1Router.get('/regionList/:type/:pid', controller.mp.userAddress.fetchRegionList);
    v1Router.post('/userAddress', controller.mp.userAddress.add);
    v1Router.delete('/userAddress/:id', controller.mp.userAddress.del);
    v1Router.delete('/userAddress/all', controller.mp.userAddress.del);
    v1Router.put('/userAddress', controller.mp.userAddress.edit);
    v1Router.get('/userAddresses', controller.mp.userAddress.fetchList);
    v1Router.post('/preorder/preview', controller.mp.order.preview);
    v1Router.post('/order/direct', controller.mp.order.direct);
    v1Router.post('/order/cart', controller.mp.order.cart);
    v1Router.post('/order/confirm', controller.mp.order.confirm);
    v1Router.get('/orders', controller.mp.order.fetchList);
    v1Router.get('/order/detail/:id', controller.mp.order.fetchOne);
    v1Router.post('/pay/createOrder', controller.mp.pay.createOrder);
    v1Router.post('/pay/notifyUrl', controller.mp.pay.notify);
};

'use strict';

module.exports = {
    SUPER_ADMIN_USER_TYPE: 1, // 内置用户,超级管理员
    ADMIN_USER_TYPE: 2, // 超级管理员设置的管理员,超级管理员可以删除新增管理员用户
    CUSTOMER_USER_TYPE: 3, // 普通类型用户
    DEFAULT_AVATAR: 'https://image.jclh81.com/user/avatar.png',
    IMAGE_DOMAIN: 'https://image.jclh81.com',
    LOCAL_ENV: 'local',

    // 订单状态 0未付款,1已付款,2已发货,3已签收,-1退货申请,-2退货中,-3已退货,-4取消交易
    ORDER_STATUS_NON_PAYMENT: 0,
    ORDER_STATUS_PAID: 1,
    ORDER_STATUS_SHIPPING: 2,
    ORDER_STATUS_RECEIVED: 3,
    ORDER_STATUS_APPLY_FOR_REFUND: -1,
    ORDER_STATUS_RETURNING: -2,
    ORDER_STATUS_RETURNED: -3,
    ORDER_STATUS_CANCELED: -4,

    // oss bucket 文件夹
    OSS_BUCKET_FOLDER: {
        CATEGORY: 'category/',
        USER: 'user/',
        GALLERY: 'gallery/',
        GOODS: 'goods/'
    },

    DEFAULT_CATEGORY_ICON: 'https://image.jclh81.com/category/default-category-1607327538428.png',
    DEFAULT_GOODS_PIC: 'https://image.jclh81.com/goods/defeault-product-1607612830539.png'
};

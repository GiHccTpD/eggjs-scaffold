CREATE TABLE `t_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) unsigned NOT NULL DEFAULT '2' COMMENT '用户类型：1.超级管理员 2.管理员 3.小程序用户',
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '用户名称',
  `age` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '年龄',
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除 0：未删除 1： 已删除',
  `salt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码加盐',
  `mobile_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '手机号码',
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '密码',
  `open_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '微信open_id',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '头像',
  `wx_avatar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '微信头像',
  `wx_user_info` blob NOT NULL COMMENT '微信用户信息',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录添加时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_uniq_user_1` (`open_id`(32)) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE `t_products_main_categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '分类名称',
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '分类图标',
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除 0：没有被删除；1：被删除',
  `weight` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '排序权重',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录添加时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品主分类表';

CREATE TABLE `t_products_sub_categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `main_category_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '主分类id',
  `weight` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '排序权重',
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图标',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '二级分类名称',
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除 0：未被删除；1：已被删除',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录添加时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='二级分类表';

CREATE TABLE `t_products_spu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `main_category_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '主分类ID',
  `sub_category_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '二级分类ID',
  `top` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '置顶推荐，非零被推荐状态，数字越大，排序越靠前',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品名称',
  `cover` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '封面图片',
  `images` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '图片链接地址',
  `show_price` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '展示价格',
  `descriptions` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '描述',
  `inventory` int(255) unsigned NOT NULL DEFAULT '0' COMMENT '库存数量',
  `sales_volume` int(255) unsigned NOT NULL DEFAULT '0' COMMENT '销量',
  `is_sale` int(1) unsigned NOT NULL DEFAULT '1' COMMENT '是否上架售卖 0：没有 1：售卖',
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除 0：没有被删除；1：被删除',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录添加时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

CREATE TABLE `t_products_sku` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `main_category_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '商品主分类ID',
  `sub_category_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '商品二级分类ID',
  `spu_id` int(11) NOT NULL COMMENT '商品ID',
  `sku_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '具体规格商品名称',
  `price` decimal(12,2) unsigned DEFAULT '0.00',
  `info` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '具体规格信息，json格式',
  `deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否删除 0：没有被删除 1：被删除',
  `is_sale` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '是否上架售卖 0：没有 1：售卖',
  `inventory` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '库存',
  `sales_volume` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '销量',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录添加时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品sku表';

CREATE TABLE `t_shopping_cart` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '用户ID',
  `spu_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '商品ID',
  `spu_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品名称',
  `spu_cover` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '商品图片',
  `sku_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '商品SKU_ID',
  `sku_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'sku名称',
  `sku_info` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'sku属性',
  `amount` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '数量',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录添加时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_uniq_1` (`user_id`,`sku_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车表';

CREATE TABLE `t_orders` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '父订单ID',
  `order_no` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单编号',
  `user_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '客户ID',
  `shopping_cart_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '0 直接购买， 非零通过购物车购买',
  `order_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '订单状态 0未付款,1已付款,2已发货,3已签收,-1退货申请,-2退货中,-3已退货,-4取消交易',
  `after_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '用户售后状态 0 未发起售后 1 申请售后 -1 售后已取消 2 处理中 200 处理完毕',
  `product_count` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '商品数量',
  `product_amount_total` decimal(12,2) unsigned NOT NULL COMMENT '商品总价',
  `order_amount_total` decimal(12,2) unsigned NOT NULL DEFAULT '0.00' COMMENT '实际付款金额',
  `sku_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT 'sku_id',
  `sku_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'sku_name',
  `sku_info` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'sku_info',
  `spu_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '商品ID',
  `spu_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'spu name',
  `spu_cover` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT 'spu cover',
  `logistics_fee` decimal(12,2) NOT NULL COMMENT '运费金额',
  `address_id` int(11) NOT NULL COMMENT '收货地址id',
  `pay_channel` tinyint(4) unsigned NOT NULL DEFAULT '1' COMMENT '支付渠道 0余额 1微信 2支付宝',
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '订单支付单号',
  `pay_time` timestamp NULL DEFAULT NULL COMMENT '付款时间',
  `delivery_time` timestamp NULL DEFAULT NULL COMMENT '发货时间',
  `order_settlement_status` tinyint(1) NOT NULL DEFAULT '0' COMMENT '订单结算状态 0未结算 1已结算',
  `order_settlement_time` timestamp NULL DEFAULT NULL COMMENT '订单结算时间',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '订单创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '订单更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '订单删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 已创建
-- CREATE TABLE `t_regions` (
--   `id` int(11) NOT NULL AUTO_INCREMENT,
--   `pid` int(11) NOT NULL DEFAULT '0' COMMENT '行政区域父ID，例如区县的pid指向市，市的pid指向省，省的pid则是0',
--   `name` varchar(120) NOT NULL DEFAULT '' COMMENT '行政区域名称',
--   `type` tinyint(3) NOT NULL DEFAULT '0' COMMENT '行政区域类型，如如1则是省， 如果是2则是市，如果是3则是区县',
--   `postcode` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '行政区域编码',
--   `keyword` varchar(5) DEFAULT NULL COMMENT '关键字',
--   `isHot` tinyint(3) NOT NULL DEFAULT '1' COMMENT '热度 0是 1否',
--   `isdirectlycity` tinyint(3) NOT NULL DEFAULT '1' COMMENT '0是,1否',
--   PRIMARY KEY (`id`),
--   KEY `parent_id` (`pid`),
--   KEY `region_type` (`type`),
--   KEY `agency_id` (`postcode`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=3232 DEFAULT CHARSET=utf8mb4 COMMENT='行政区域表';

CREATE TABLE `t_user_addresses` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '用户ID',
  `receiver` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '收件人',
  `mobile_phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '收件人手机号码',
  `is_default` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否默认 0：不是默认 1：是默认',
  `postcode` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '邮政编码',
  `province_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '省级ID',
  `city_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '市级ID',
  `county_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0' COMMENT '县区ID',
  `town` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '乡镇街道地址',
  `detail` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '详细地址',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录添加时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户地址表';

CREATE TABLE `t_gallery` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '标题',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '展示图片地址',
  `redirect_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '重定向路径',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='轮播图';

CREATE TABLE `t_pay_records` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pay_channel` int(11) unsigned DEFAULT '0' COMMENT '支付渠道 1微信 2支付宝',
  `order_no` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '订单号',
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '支付订单号',
  `unifiedorder_status` tinyint(255) unsigned DEFAULT '0' COMMENT '下单结果 1：成功 0：失败',
  `unifiedorder_result` text COLLATE utf8mb4_unicode_ci COMMENT '下单详情',
  `pay_status` tinyint(1) unsigned DEFAULT '0' COMMENT '下单结果 1：成功 0：失败',
  `pay_result` text COLLATE utf8mb4_unicode_ci COMMENT '支付结果详情',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pay_order_no_idx` (`order_no`(191),`transaction_id`(191)) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

CREATE TABLE `t_product_property_names` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_property_name_idx` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `t_product_property_values` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name_id` int(11) unsigned NOT NULL DEFAULT '0',
  `name` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_property_value_idx` (`name`,`name_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

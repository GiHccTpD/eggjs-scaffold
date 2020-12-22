[TOC]

# micromall

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

## 配置

1. run.sh配置
  如下命令,服务于可执行权限

  ```bash
  chmod +x run.sh
  ```

  `run.sh` 内容如下

  ```bash
    #!/usr/bin/env bash

  export ENABLE_NODE_LOG=YES
  # 自定义
  export NODE_LOG_DIR=/path/to/logs
  export TZ=Asia/Shanghai
  export EGG_SERVER_ENV=local
  export EGG_WORKERS=1
  export NODE_ENV=dev

  # 测试环境
export MYSQL_DB_NAME=你的本地数据库名称
  export MYSQL_DB_HOST=你的本地数据库host
  export MYSQL_DB_PORT=3306
  export MYSQL_DB_USERNAME=root
  export MYSQL_DB_PASSWORD=你的本地数据库密码
  
  export REDIS_PORT=6379
export REDIS_HOST=127.0.0.1
  export REDIS_DB=0
  
  egg-bin dev --port=7001
```
  
2. deploy.sh 配置

  如下命令,服务于可执行权限

  ```bash
  chmod +x deploy.sh
  ```

  `deploy.sh` 内容如下

  ```bash
  #!/usr/bin/env bash

  export TZ=Asia/Shanghai
  export EGG_SERVER_ENV=prod
  export EGG_WORKERS=1
  export NODE_ENV=production

  export MYSQL_DB_NAME=正式数据库名称
  export MYSQL_DB_HOST=正式数据库地址
  export MYSQL_DB_PORT=3306
  export MYSQL_DB_USERNAME=数据库登录用户
  export MYSQL_DB_PASSWORD=数据库密码

  export REDIS_PORT=6379
  export REDIS_HOST=127.0.0.1
  export REDIS_DB=0

  git pull

  # npm install
  changedFiles="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

  checkForChangedFiles() {
      echo "$changedFiles" | grep --quiet "$1" && eval "$2"
  }

  packageJsonHasChanged() {
    echo "Changes to package.json detected, installing updates"
    npm i
  }

  checkForChangedFiles package.json packageJsonHasChanged
  
  ./node_modules/.bin/egg-scripts stop
  ./node_modules/.bin/egg-scripts start --port=7001 --daemon --env=prod --title=egg-server-mallapi
  ```

3. `config.local.js` 和 `config.prod.js` 配置
   在 `config/` 文件夹中新建该文件并按照如下配置

   ```JavaScript
    'use strict';

    module.exports = {
      mp: {
          appId: '', // 公众平台应用编号
          appSecret: '', // 公众平台应用密钥
          mchId: '', // 商户平台商家编号
          apiKey: '', // 商户支付密钥
          notifyUrl: '' // 支付结果回调地址
      },
      oss: {
          region: 'oss-cn-beijing',
          accessKeyId: '',
          accessKeySecret: '',
          bucket: ''
      },
      alinode: {
          appid: '',
          secret: ''
      }
    };
   ```

## 本地开发

```bash
npm i
./run dev
open http://localhost:7001/
```

## Deploy

```bash
./deploy.sh
```

## npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- ~~Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.~~

[egg]: https://eggjs.org

## sequelize

### migrations[非必须]

migrations仅用于sql变更的时候,建表的sql都存在项目目录下 `/sql` 文件夹中
执行migration的同时要记得,修改对应的model

1. 第一步创建migration文件

    ```bash
    sequelize migration:create --name TABLE_NAME_ACTION_COLUMN_XXXXX
    ```

    执行结果如下

    ```bash
    sequelize migration:create --name user_add_column_of_password_and_mobile_phone

    Sequelize CLI [Node: 12.18.3, CLI: 6.2.0, ORM: 6.3.5]

    migrations folder at "/path/to/project/database/migrations" already exists.
    New migration was created at /path/to/project/database/migrations/20201128110339-user_add_column_of_password_and_mobile_phone.js .
    ➜  egg (main) ✗ sequelize db:migrate

    Sequelize CLI [Node: 12.18.3, CLI: 6.2.0, ORM: 6.3.5]
    ```

2. 在 `/path/to/project/database/migrations/` 对应的文件中添加要执行的操作操作

    ```js
    const transaction = await queryInterface.sequelize.transaction();
        try {
          await queryInterface.addColumn(// 加一个字段
            'users',// 表名
            'mobile_phone', // 要加的字段
            {// 配置
              type: Sequelize.DataTypes.STRING(20),
              defaultValue: '',
              allowNull: false
            },
            { transaction }
          );
          await transaction.commit();
    ```

    > 更多细节请参考: https://sequelize.org/v5/manual/migrations.html

3. 执行

    ```bash
    sequelize db:migrate
    ```

    执行结果如下

    ```bash
    ➜  egg (main) ✗ sequelize db:migrate

    Sequelize CLI [Node: 12.18.3, CLI: 6.2.0, ORM: 6.3.5]

    Loaded configuration file "database/config.js".
    Using environment "development".
    == 20201128110339-user_add_column_of_password_and_mobile_phone: migrating =======
    == 20201128110339-user_add_column_of_password_and_mobile_phone: migrated (0.174s)
    ```

    如果返回以上结果代表已执行成功

## token

不需要进行token校验的路由需要在`config/config.default.js`中的`tokenRequired.whiteListRoutes`进行配置

## alinode

1. 安装 `alinode`, Node.js 性能平台使用 tnvm 进行版本维护，采用如下命令安装 tnvm。
  Linux:

  ```bash
  wget -O- https://raw.githubusercontent.com/aliyun-node/tnvm/master/install.sh | bash
  ```

  macOs:

  ```bash
  curl https://raw.githubusercontent.com/aliyun-node/tnvm/master/install.sh | bash
  ```

2. 将 tnvm 添加到系统命令。根据上面命令最后的提示，针对不同操作系统，进行手工操作。
  linux 系统下:

  ```bash
  source ~/.bashrc
  ```

  macOS(使用zsh的话):

  ```bash
  source ~/.zshrc
  ```

3. 利用 tnvm 安装需要版本的运行时。请参考 Node.js性能平台运行时版本 选择合适的运行时版本。

  查看远端版本

  ```bash
  tnvm ls-remote alinode
  ```

4. 安装需要版本：版本对应关系
  请根据版本对应关系，选择合适(与当前应用使用的 Node.js 版本一致)的 alinode 版本。

  ```bash
  tnvm install alinode-vx.y.z
  ```

5. 使用vx.y.z的运行时

  ```bash
  tnvm use alinode-vx.y.z
  ```

> 参考: https://help.aliyun.com/document_detail/60902.html?spm=a2c4g.11186623.6.554.3c4c1e380dL02c


6. 安装 `egg-alinode` 插件

  ```bash
  npm i egg-alinode --save
  ```

7. 启用插件

   ```bash
    // config/plugin.js
    exports.alinode = {
      enable: true,
      package: 'egg-alinode'
    };
   ```

> 参考: https://help.aliyun.com/document_detail/60907.html?spm=a2c4g.11186623.6.555.4d261c0eVNUZpZ
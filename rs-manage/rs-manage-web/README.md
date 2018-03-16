# icode: baidu/cm-fe/rs-admin-fe

# 依次操作如下步骤：

# 1 安装依赖
npm install

# 2起服务
npm run dev

# 3 项目打包（开发阶段不用）
npm run build

# 带有report的打包
npm run build --report
```

目录结构

├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── view                   // view
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     
|   |── mock                   // mock数据
│   ├── jquery                 // 第三方不打包资源，可用可不用
│   └── html                   // 模板html
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── index.html                 // html模板
└── package.json               // package.json

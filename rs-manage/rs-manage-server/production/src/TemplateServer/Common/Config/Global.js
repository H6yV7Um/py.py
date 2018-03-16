/**
 * @file 全局配置文件
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */
oojs.define({
    name: 'Global',
    namespace: 'TemplateServer.Common.Config',
    // 日志配置部分
    log: {
        // 客户进程向主进程发送日志消息的时间间隔, 单位ms
        clientTimeSpan: 1000,
        // 主进程写文件的时间间隔, 单位ms
        masterTimeSpan: 1000,
        // 每个多少分钟切割文件, 单位分钟.
        fileTimeSpan: 15,
        // 日志目录
        filePath: './logs/',
        // info和notice级别日志记录的文件名
        accessFileName: 'render_server.log',
        // error和fatal级别的日志记录的文件名
        fatalFileName: 'render_server.log.wf',
        // 日志级别
        level: 'info'

    },
    // 服务器配置部分
    server: {
        // 服务端口号
        port: 8124,
        // 连接超时时间
        socketTimeout: 300,
        // 连接队列深度
        queueLength: 255,
        // CPU是否支持超线程
        ht: false

    },
    // master进程健康检查配置项
    healthCheck: {
        // 每个健康检查周期内启动多少次则认为是错误
        restartLimitTimes: 10,
        // 健康检查周期的时间, 单位毫秒,默认为1秒
        healthCheckTime: 1000

    },
        // 静态资源类配置
    resource: {
        baseCssUrl: 'https://cpro.baidustatic.com/cpro/ui/noexpire/css/2.1.5/template.min.css',
        baseJsUrl: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/2.0.1/oojs.js',
        anticheatJsUrl: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/rs/business/anticheat.js',
        anticheatMobJsUrl: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/rs/business/1.0.2/anticheat_mob.min.js',
        anticheatMobFCJsUrl: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/rs/business/1.0.0/anticheat_mob_fc.min.js',
        commonJsUrl: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/rs/template/common.min.js',
        feedbackMobile: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/rs/business/feedbackMobile.min.js',
        feedbackPC: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/rs/business/feedbackPC.min.js'
    },

    // 缓存配置部分
    cache: {
        // 缓存文件保存的目录
        cacheFilePath: './cache/',
        // 数据库监控的间隔时间, 单位秒
        databaseIntervalSeconds: 240,
        // 文件监控的间隔时间, 单位秒
        fileIntervalSeconds: 120
    }
});

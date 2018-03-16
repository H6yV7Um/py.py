/**
 * @file 守护进程
 * @author zhangziqiu@baidu.com
 */

/* global oojs */
require('node-oojs');
oojs.define({
    name: 'master',
    namespace: '',
    deps: {
        childProcess: require('child_process'),
        config: 'rs.common.config.global',
        log: 'rs.common.utility.log',
        performanceMoniter: 'rs.common.utility.performanceMoniter'
    },

    /**
     * 记录所有worker进程数组
     */
    workers: [],
    workerStatus: {},

    /**
     * 静态构造函数
     */
    $master: function () {
        // 初始化日志模块
        this.config.log.mode = 'master';
        oojs.log = oojs.create(this.log, this.config.log);

        // 计算cpu
        var cpuCount = require('os').cpus().length;
        // 是否使用了hyper-threading超线程技术.
        var threadCount = this.config.server.ht ? cpuCount * 2 : cpuCount;
        // 预留一个给master进程
        this.threadCount = threadCount - 1;

        // 启动子进程
        this.workerOnStart();

        // 启动服务
        setTimeout(function () {
            this.masterStartInterval = setInterval(this.masterOnStart.proxy(this), 500);
        }.proxy(this), this.threadCount * 1000);

        // 启动健康检查
        this.healthCheckOnStart();

        // 启动性能统计
        this.startPerformanceMonitor();
    },

    /**
     * 启动性能监控
     *
     */
    startPerformanceMonitor: function () {
        oojs.perf = oojs.create(this.performanceMoniter, {
            mode: 'master'
        });
    },

    /**
     * 健康检查启动函数
     */
    healthCheckOnStart: function () {
        // 读取配置文件
        this.healthCheck = this.config.healthCheck;
        // 初始化重启次数
        this.healthCheck.restartTimes = 0;
        // 启动健康检查定时器
        setInterval(this.healthCheckOnTimer.proxy(this), this.healthCheck.healthCheckTime);
    },

    /**
     * 健康检查定时函数
     */
    healthCheckOnTimer: function () {
        if (this.healthCheck.restartTimes > this.healthCheck.restartLimitTimes) {
            oojs.log.fatal('restart too frequently. times:' + this.healthCheck.restartTimes);
            // 终止父进程
            process.exit(1);
        }
        this.healthCheck.restartTimes = 0;
    },

    /**
     * 删除一个worker
     *
     * @param {Object} worker 工作进程
     * @return {number} 返回0表示未有进程被删除, 正常删除返回被删除进程的pid
     */
    deleteWorker: function (worker) {
        if (worker && worker.pid) {
            var pid = worker.pid;
            var newWorkers = [];
            for (var i = 0, count = this.workers.length; i < count; i++) {
                var tempWorker = this.workers[i];
                if (tempWorker && tempWorker.pid && tempWorker.pid !== pid) {
                    newWorkers.push(tempWorker);
                }
            }
            this.workers = newWorkers;
            this.workerStatus[pid] = false;
            oojs.log.notice('worker ' + worker.pid + ' deleted.');
            return pid;
        }
        return 0;
    },

    /**
     * 创建一个worker
     *
     * @return {Object} 新创建的子工作进程
     */
    createWorker: function () {
        var worker = this.childProcess.fork('src/rs/api/protocol/rpc.js');
        // 添加日志监控
        oojs.log.addWorker(worker);
        worker.on('message', this.workerOnMessage.proxy(this, worker));
        worker.on('exit', this.workerOnExit.proxy(this, worker));
        worker.on('uncaughtException', this.workerOnUncaughtError);
        this.workers.push(worker);
        oojs.log.notice('worker ' + worker.pid + ' created.');
        return worker;
    },

    /**
     * 启动子进程
     *
     * @return {boolean} 返回true表示启动成功
     */
    workerOnStart: function () {
        for (var i = 0; i < this.threadCount; i++) {
            setTimeout(this.createWorker.proxy(this), i * 900);
        }
        return true;
    },

    /**
     * 子进程退出事件处理函数
     *
     * @param {number} exitCode 退出代码
     * @param {number} signal 信号量, 可能不存在
     * @param {Object} worker 子工作进程
     */
    workerOnExit: function (exitCode, signal, worker) {
        oojs.log.error('worker ' + worker.pid + ' exited. exitCode:' + exitCode + ', signal:' + signal);
        this.deleteWorker(worker);
        this.healthCheck.restartTimes++;
        this.createWorker();
    },

    /**
     * 主进程收到子进程消息时的处理函数
     *
     * @param {Object} message 收到的worker进程发送来的消息
     * @param {string} message.action 消息字符串. suicide表示工作进程自杀信号, performance表示性能监控日志
     * @param {Object} sendHandler 句柄
     * @param {Object} worker 子工作进程
     */
    workerOnMessage: function (message, sendHandler, worker) {
        if (message && message.action) {
            switch (message.action) {
                case 'suicide':
                    this.deleteWorker(worker);
                    break;
                case 'performance':
                    oojs.perf.masterOnMessage(message);
                    break;
                case 'workerOnStart':
                    this.workerStatus[message.pid] = true;
                    break;
            }
        }
    },

    /**
     * 工作进程层异常处理函数
     *
     * @param {Object} err 异常对象
     */
    workerOnUncaughtError: function (err) {
        oojs.log.error('[workerOnUncaughtError]', err);
    },

    /**
     * 启动宿主进程
     */
    masterOnStart: function () {
        // 检查所有的worker是否启动成功
        var isWorkerFinished = true;
        for (var i = 0, count = this.workers.length; i < count; i++) {
            var pid = this.workers[i].pid;
            if (!this.workerStatus[pid]) {
                isWorkerFinished = false;
                break;
            }
        }
        if (!isWorkerFinished) {
            oojs.log.notice('masterOnStart:worker not finished......');
            return;
        }

        // 所有worker准备完毕, 开始启动服务
        clearInterval(this.masterStartInterval);

        // 宿主进程异常处理
        process.on('uncaughtException', this.masterOnError);

        // 通知第一个进程监控数据库
        this.workers[0].send('database-monitor');

        // 监听外部端口
        var net = require('net');
        this.server = net.createServer({
            // 查看ISSUE: https://github.com/nodejs/node-v0.x-archive/pull/8576
            // 在 socket 在进程间传递时，暂停 socket 的数据读取
            // 避免因为 client 端数据传递太快，出现 data 事件不响应
            pauseOnConnect: true
        });
        this.server.on('connection', this.masterOnConnection.proxy(this));
        this.server.on('error', this.masterOnError);
        this.server.listen(this.config.server.port, this.config.server.queueLength, function () {
            oojs.log.notice('server bound. master process: ' + process.pid);
        });
    },

    /**
     * 服务器连接事件处理函数.
     *
     * @param {Object} socket 本次连接的socket对象
     */
    masterOnConnection: function (socket) {
        // oojs.log.info('onConnection. pid:' + process.pid + ", socket.address:" + socket.address().port);
        if (socket && socket.writable) {
            socket.setTimeout(this.config.server.socketTimeout);
            // 随机分配给某一个工作进程
            var workerCount = this.workers.length;
            var randomIndex = parseInt(Math.random() * workerCount, 10);
            this.workers[randomIndex].send('socket', socket);
        }
    },

    /**
     * 宿主服务异常处理函数
     *
     * @param {Object} err 异常对象
     */
    masterOnError: function (err) {
        oojs.log.error('[masterOnError]', err);
    }

});

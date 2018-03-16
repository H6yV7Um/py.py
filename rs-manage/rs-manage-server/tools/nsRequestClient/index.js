/**
 * @file rpc request client
 * @author chenzhansheng <chenzhansheng@baidu.com>
 */

/* eslint-disable fecs-no-require, no-console */

const Client = require('./client');


module.exports = {
    Client: Client,
    request(options) {
        // TODO: 暂时全部做成 rpc 用完即抛弃, 看后续是否有必要做成 client 池形式
        let client = new Client(options);
        return client.doRequest();
    }
};

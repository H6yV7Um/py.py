/**
 * @file nshead copy from zhangziqiu
 * @author ...
 */

/* eslint-disable fecs-no-require */

const NSHEAD_LENGTH = 36;
const MAGIC_NUM = 0xfb709394;

const DEFAULT_NSHEAD_VAL = {
    id: 0x00,
    flags: false,
    logId: 0,
    traceId: 0,
    parentSpanId: 0,
    spanId: 0,
    magicNumber: MAGIC_NUM,
    methodId: 0,
    bodyLength: 0
};

module.exports = {

    get nsLen() {
        return NSHEAD_LENGTH;
    },

    set nsLen(val) {
        throw new Error('nsHead length can not be changed!');
    },

    get magicNum() {
        return MAGIC_NUM;
    },

    set magicNum(val) {
        throw new Error('magic number can not be changed!');
    },

    /**
     * pb-rpc 的 nsHead 是对标准的 nsHead 进行再次规划了（下面的字段都是按顺序的，不要调整顺序）
     *
     * 规范字段如下：
     * typedef struct _nshead_t {
     *     unsigned short id;              // id (2)
     *     unsigned short version;         // 版本号 (2)
     *     // (M)由apache产生的logid，贯穿一次请求的所有网络交互
     *     unsigned int   log_id;          // (4)
     *     // (M)客户端标识，建议命名方式：产品名-模块名，比如"sp-ui", "mp3-as"
     *     char           provider[16];    // (16)
     *     // (M)特殊标识，标识一个包的起始
     *     unsigned int   magic_num;       // (4)
     *     unsigned int   reserved;        // 保留 (4)
     *     // (M)head后请求数据的总长度
     *     unsigned int   body_len;        // (4)
     * } nshead_t;
     *
     * rs 使用的是 pb-rpc 的 nsHead 规范如下：
     * http://wiki.baidu.com/display/UBFE/pb-rpc?src=contextnavpagetreemode
     * typedef struct _nshead_t {
     *     unsigned short id;              // id (2)
     *     unsigned short flags;           // 其实是用来表示是否snappy压缩 (2)
     *     unsigned int   log_id;          // log id (4)
     *     double         trace_id;        // trace id (8)
     *     unsigned int   parent_span_id;  // parent span id (4)
     *     unsigned int   span_id;         // span id (4)
     *     unsigned int   magic_num;       // (4)
     *     unsigned int   method_id;       // method id (4)
     *     unsigned int   body_len;        // (4)
     * } nshead_t;
     * provider（客户端标志） 被 trace_id、parent_span_id、span_id 替换
     * reserved（保留） 被用来使用做 method_id 用来作为接口标记位
     *
     * TODO: 目前看来，rs 的调用方其实都是用 ral 来做请求，也就是说调用方其实都是按照标准的 nsHead 来的
     *
     * TODO: log_id 可以被放进日志，各方日志查询会方便很多
     */

    /**
     * 从 buffer 中解析出 nsHead
     *
     * @param {Buffer} buffer net buffer
     * @return {Object} nsHead Object
     */
    unpack(buffer) {
        let flags = buffer.readUInt16LE(2, 3);
        return {
            id: buffer.readUInt16LE(0),
            flags: flags,
            logId: buffer.readUInt32LE(4, 7),
            traceId: buffer.readDoubleLE(8, 15),
            parentSpanId: buffer.readUInt32LE(16, 19),
            spanId: buffer.readUInt32LE(20, 23),
            magicNumber: buffer.readUInt32LE(24, 27),
            methodId: buffer.readUInt32LE(28, 31),
            bodyLength: buffer.readUInt32LE(32, 35),
            snappy: flags & 1
        };
    },

    /**
     * 将数据打包成 nsHead
     * 所有 number 都为 inter
     * TODO: 用 bufferpack 在里面处理转化个字段到整型
     *
     * @param {number} id           nsHead id
     * @param {number} flags        nsHead flags
     * @param {number} logId        nsHead logId
     * @param {number} traceId      nsHead traceId
     * @param {number} parentSpanId nsHead parentSpanId
     * @param {number} spanId       nsHead spanId
     * @param {number} magicNumber  nsHead magicNumber
     * @param {number} methodId     nsHead methodId
     * @param {number} bodyLength   nsHead bodyLength
     * @return {Buffer} nsHead
     */
    pack({
        id = DEFAULT_NSHEAD_VAL.id,
        flags = DEFAULT_NSHEAD_VAL.flags,
        logId = DEFAULT_NSHEAD_VAL.logId,
        traceId = DEFAULT_NSHEAD_VAL.traceId,
        parentSpanId = DEFAULT_NSHEAD_VAL.parentSpanId,
        spanId = DEFAULT_NSHEAD_VAL.spanId,
        magicNumber = DEFAULT_NSHEAD_VAL.magicNumber,
        methodId = DEFAULT_NSHEAD_VAL.methodId,
        bodyLength = DEFAULT_NSHEAD_VAL.bodyLength
    } = DEFAULT_NSHEAD_VAL) {
        let result = new Buffer(NSHEAD_LENGTH);
        flags = flags ? 0x01 : 0x00;
        result.writeUInt16LE(id, 0);              // id, 2
        result.writeUInt16LE(flags, 2);           // flags or snappy, 2
        result.writeUInt32LE(logId, 4);           // log id, 4
        result.writeDoubleLE(traceId, 8);         // trace id, 8
        result.writeUInt32LE(parentSpanId, 16);   // parent span id, 4
        result.writeUInt32LE(spanId, 20);         // span id, 4
        result.writeUInt32LE(magicNumber, 24);    // magic number, 4
        result.writeUInt32LE(methodId, 28);       // method id, 4
        result.writeUInt32LE(bodyLength, 32);     // body length, 4
        return result;
    }
};

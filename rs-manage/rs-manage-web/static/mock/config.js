module.exports = {

    // mockup数据开关，1则所有请求都使用mock数据，0则不使用mock数据
    // 也可以开关为0，则不用mockup数据，单单独某个请求上加上mockup=1，单个请求使用mock数据
    'useMockup': 0,

    // 用于测试数据出错的case，将该字段置为1则会把mock返回的数据status改为非0
    'useErrorData': 0
};
/**
 * @file 模型转换工具类.
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'Converter',
    namespace: 'TemplateServer.Common.Model',
    deps: {
        proto: 'TemplateServer.Common.Model.Proto'
    },

    /**
     * 记录javascript原始数据类型, 以下类型直接赋值不会进行类型转换.
     */
    nativeType: {
        'string': true,
        'number': true,
        'object': true,
        'function': true,
        'boolean': true,
        'date': true
    },

    /**
     * 根据meta和数据buffer, 获取pb对象
     *
     * @param {Object} model 模型类
     * @param {string} buffer 带转换的字节数组
     * @return {Object} proto对象模型
     */
    byteToProto: function (model, buffer) {
        // 获取pb类
        var protoType = this.proto.getClass(model.protoType);
        return protoType.decode(buffer);
    },

    /**
     * 将一个obj, 根据meta信息, 转换成pb对象
     *
     * @param {Object} model 模型类
     * @param {Object} obj 带转换的数据对象
     * @return {Object} proto对象模型
     */
    objToProto: function (model, obj) {
        // 已经是pb类型的对象
        if (obj.isProto) {
            return obj;
        }

        var result;
        if (obj instanceof Array) {
            // 处理数组
            result = [];
            for (var i = 0, count = obj.length; i < count; i++) {
                result.push(this.objToProto(model, obj[i]));
            }
        }
        else {
            // 处理单个obj对象
            var ProtoType = this.proto.getClass(model.protoType);
            result = new ProtoType();
            var modelProperty = model.property;
            for (var key in modelProperty) {
                if (key && modelProperty.hasOwnProperty(key) && typeof obj[key] !== 'undefined') {
                    var currentProperty = modelProperty[key];
                    var currentType = currentProperty.type;
                    if (!this.nativeType[currentType]) {
                        var tempModel = oojs.using(currentType);
                        result[key] = this.objToProto(tempModel, obj[key]);
                    }
                    else {
                        result[key] = obj[key];
                    }
                }

            }
        }

        result.isProto = true;
        return result;
    },


    /**
     * 比较source和to在model上定义的属性是否相等.
     *
     * @param {Object} model 模型
     * @param {Object|Array} source 源对象
     * @param {Object|Array} to 目标对象
     * @return {boolean} 完全相等返回true, 否则抛出异常
     */
    compare: function (model, source, to) {
        var property = model.property;
        if (source instanceof Array) {
            // 处理数组
            for (var i = 0, count = source.length; i < count; i++) {
                this.compare(model, source[i], to[i]);
            }
        }
        else {
            for (var key in property) {
                if (key && property.hasOwnProperty(key)) {
                    var itemType = property[key].type;
                    var sourceItem = source[key];
                    var toItem = to[key];
                    if (!this.nativeType[itemType]) {
                        // 处理非原生类型
                        var tempType = oojs.using(itemType);
                        this.compare(tempType, source[key], to[key]);
                    }
                    else {
                        // 处理原生类型
                        var sourceValue;
                        var toValue;
                        var modelName;
                        if (sourceItem instanceof Array) {
                            // 处理数组
                            for (var j = 0, jcount = sourceItem.length; j < jcount; j++) {
                                sourceValue = sourceItem[j];
                                toValue = toItem[j];
                                if (itemType === 'string') {
                                    sourceValue = sourceValue.toString('utf8');
                                    toValue = sourceValue.toString('utf8');
                                }

                                if (sourceValue !== toValue) {
                                    modelName = model.namespace + '.' + model.name;
                                    throw new Error(modelName + ':' + key + ' not equal!');
                                }
                            }
                        }
                        else if(sourceValue) {
                            // 处理非数组
                            sourceValue = sourceItem;
                            toValue = toItem;
                            if (itemType === 'string') {
                                sourceValue = sourceValue.toString('utf8');
                                toValue = sourceValue.toString('utf8');
                            }
                            if (sourceValue !== toValue) {
                                modelName = model.namespace + '.' + model.name;
                                throw new Error(modelName + ':' + key + ' not equal!');
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
});

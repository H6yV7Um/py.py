oojs.define({
    name: 'converter',
    namespace: 'rs.common.model',
    deps:{
        pb:'rs.common.model.protobuf',
        orm: require('sequelize')
    },

    /**
     * 根据meta和数据buffer, 获取pb对象
     */
    decodePbItem:function(meta, buffer){
        //获取pb类
        var pbTypeClass = this.pb.getClass( meta.pbType );
        return pbTypeClass.decode(buffer);
    },

    /**
     根据meta, 获取DB模型
     */
    getDBModel:function(meta){
        var result = {};
        var metaProperty = meta.property;
        for(var key in metaProperty){
            if (key && metaProperty.hasOwnProperty(key) && metaProperty[key].dbType ) {
                result[key] = this.orm[ metaProperty[key].dbType ]
            }
        }
        return result;
    },

    /**
    将一个obj, 根据meta信息, 转换成pb对象
    */
    convertToPbItem: function (meta, data) {
        //参数校验
        if(!meta || !data){
            return;
        }
        //已经是pb类型的对象
        if(data._model_type === 'pb'){
            return data;
        }
    
        //获取pb类
        var pbTypeClass = this.pb.getClass( meta.pbType );
        var result = new pbTypeClass();
        var metaProperty = meta.property;
        
        //属性转换
        for (var key in metaProperty) {
            if (key && metaProperty.hasOwnProperty(key) && typeof data[key] !== 'undefined') {
                var currentProperty = metaProperty[key];
                if (currentProperty.metaType) {
                    var tempMeta = oojs.using(currentProperty.metaType);
                    result[key] = this.convertToPb({ meta:tempMeta, data:data[key] });
                }
                else {
                    result[key] = data[key];
                }
            }
        }
        result._model_type = 'pb';
        return result;
    },

    /**
    将一个obj, 根据meta信息, 转换成pb对象
    */
    convertToPb: function ( param ) {
        if(!param){
            return;
        }       

        var meta = param.meta;
        var data = param.data;

        if (data instanceof Array) {
            var result = [];
            for (var i = 0, count = data.length; i < count; i++) {
                result.push(this.convertToPbItem(meta, data[i]));
            }
            return result;
        }
        else {
            return this.convertToPbItem(meta, data);
        }
        return true;
    }
});
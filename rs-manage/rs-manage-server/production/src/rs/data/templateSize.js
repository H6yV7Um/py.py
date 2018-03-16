oojs.define({
    name: 'templateSize',
    namespace: 'rs.data',
    deps: {
        config: 'rs.common.config.global',
        converter: 'rs.common.model.converter',
        templateSizeMetaInfo: 'rs.common.model.templateSize',
        sequelize: require('sequelize')
    },

    $templateSize: function () {
        this.readDB = new this.sequelize(this.config.db.database, this.config.db.readUsername, this.config.db.readPassword, this.config.db);
        this.writeDB = new this.sequelize(this.config.db.database, this.config.db.writeUsername, this.config.db.writePassword, this.config.db);
        this.prepareTemplateSizeInfo();
    },

    prepareTemplateSizeInfo: function () {
        this.templateSizeInfo = this.readDB.define(
            'template_size',
            this.converter.getDBModel(this.templateSizeMetaInfo),
            {
                tableName: 'ts_template_size',
                // this will deactivate the timestamp columns
                timestamps: false
            }
        );
    },

    //批量获取size对象
    //callback(err, items)
    //err:异常信息
    //items:size对象集合
    get: function (item, callback) {
        item = item || {};
        this.templateSizeInfo.findAll({
            where: item
        }).complete(function (err, items) {
            callback(err, items);
        });
        return true;
    },

    /*
    insertUpdate: function (item, callback) {        //更新模板
        var insertItem = this.templateSizeInfo.build(item);
        for(var i= 0, count=insertItem.length; i<count; i++){
            insertItem[i].save().complete(function (err) {
                console.log(err);
                callback();
            });
        }
    },

    update:function(itemArray, callback){

    },

     */


    //批量插入size
    //callback(err, insertCount)
    //err:异常信息
    //insertCount:插入的条数
    insert: function (itemArray, callback) {
        if(!itemArray){
            callback(new Error('need the insert items'), 0);
            return false;
        }

        this.templateSizeInfo.bulkCreate(itemArray).complete(function (err, callbackItems) {
            var insertCount = callbackItems?callbackItems.length : 0;
            callback(err, insertCount);
        });
        return true;
    },

    //根据模板id删除size表数据
    //callback(err, deleteCount)
    //err:异常信息
    //deleteCount:删除的条数
    deleteByTemplateId:function(templateId, callback){
        if(!templateId){
            callback(new Error('need templateId'), 0);
            return false;
        }
        var whereObj = { template_id : templateId };
        this.templateSizeInfo.destroy({where:whereObj}).complete(function(err, deleteCount){
            if(err){
                deleteCount = 0;
            }
            callback(err, deleteCount);
        }.proxy(this, callback));
        return true;
    }
});
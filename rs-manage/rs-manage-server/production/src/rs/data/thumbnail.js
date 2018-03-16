oojs.define({
    name: 'thumbnail',
    namespace: 'rs.data',
    deps: {
        config: 'rs.common.config.global',
        converter: 'rs.common.model.converter',
        thumbnailMetaInfo: 'rs.common.model.thumbnail',
        sequelize: require('sequelize')
    },

    $thumbnail: function () {
        this.readDB = new this.sequelize(this.config.db.database, this.config.db.readUsername, this.config.db.readPassword, this.config.db);
        this.writeDB = new this.sequelize(this.config.db.database, this.config.db.writeUsername, this.config.db.writePassword, this.config.db);
        this.prepareThumbnailInfo();
    },

    prepareThumbnailInfo: function () {
        this.thumbnailInfo = this.readDB.define('thumbnail', this.converter.getDBModel(this.thumbnailMetaInfo), {
            tableName: 'ts_thumbnail',
            timestamps: false // this will deactivate the timestamp columns
        });
    },

    //批量获取thumbnail对象
    //callback(err, items)
    //err:异常信息
    //items:size对象集合
    get: function (item, callback) {
        item = item || {};
        this.thumbnailInfo.findAll({
            where: item
        }).complete(function (err, items) {
            callback(err, items);
        });
        return true;
    },

    //批量插入thumbnail对象
    //callback(err, insertCount)
    //err:异常信息
    //insertCount:插入的条数
    insert: function (items, callback) {
        if(!items){
            callback(new Error('need the insert items'), 0);
            return false;
        }

        this.thumbnailInfo.bulkCreate(items).complete(function (err, callbackItems) {
            var insertCount = callbackItems?callbackItems.length : 0;
            callback(err, insertCount);
        });
        return true;
    },

    //根据模板id删除thumbnail对象
    //callback(err, deleteCount)
    //err:异常信息
    //deleteCount:删除的条数
    deleteByTemplateId:function(templateId, callback){
        if(!templateId){
            callback(new Error('need templateId'), 0);
            return false;
        }
        var whereObj = { template_id : templateId };
        this.thumbnailInfo.destroy({where:whereObj}).complete(function(err, deleteCount){
            if(err){
                deleteCount = 0;
            }
            callback(err, deleteCount);
        }.proxy(this, callback));
        return true;
    }
});
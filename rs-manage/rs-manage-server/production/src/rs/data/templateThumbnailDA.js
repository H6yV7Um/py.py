/**
 * @file Global Config File
 * @author zhangziqiu@baidu.com
 */
// http://eslint.org/docs/rules/
// 妈的，自己查规则去吧
/* eslint-disable*/
/* global oojs */
oojs.define({
    name: 'templateThumbnailDA',
    namespace: 'rs.data',
    deps: {
        mysql: require('mysql'),
    },
    templateThumbnailDA: function (database, connection, transactionErrorHandle) {
        this.database = database;
        this.connection = connection;
        this.transactionErrorHandle = transactionErrorHandle;
    },
    deleteThumbnail: function (ids, rpcCallback, callback) {
        if (!ids) {
            callback();
            return;
        }

        // 如果直接在数据库中执行这条语句，
        // 是会出现警告的，警告的内容和原因如下：
        // http://stackoverflow.com/questions/20925792/
        // mysql-warning-code-1592-unsafe-statement-written-to-the-binary-log-using-stateme
        // 目测不会对我们的数据产生负面影响        
        this.connection.query('DELETE FROM ' + this.database + '.ts_thumbnail '
            + ' WHERE template_id IN (' + ids + ')', function (err, result) {
                if (err) {
                    this.transactionErrorHandle(err, rpcCallback);
                    return;
                }
                callback();
        }.proxy(this));
    },
    insertThumbnail: function (thumbnailItems, rpcCallback, callback) {
        if (!thumbnailItems || !thumbnailItems.length) {
            callback();
            return;
        }

        var valueStr = '';
        thumbnailItems.forEach(function (item, index) {
            valueStr += '(' 
                + this.connection.escape(item.id) + ', ' 
                + this.connection.escape(item.template_id) + ', ' 
                + this.connection.escape(item.type) + ', '
                + this.connection.escape(item.width) + ', '
                + this.connection.escape(item.height) + ', '
                + this.connection.escape(item.url) 
            + ')' + (index === thumbnailItems.length - 1 ? ';' : ',');
        }.proxy(this));

        var queryStr = 'INSERT INTO ' + this.database + '.ts_thumbnail '
        + ' (id, template_id, type, width, height, url) '
        + ' VALUES '
        + valueStr;

        this.connection.query(queryStr, function (err, result) {
            if (err) {
                this.transactionErrorHandle(err, rpcCallback);
                return;
            }

            callback();
        }.proxy(this));
    }
});

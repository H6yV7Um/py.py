/**
 * @file Global Config File
 * @author zhangziqiu@baidu.com
 */
// http://eslint.org/docs/rules/
// 妈的，自己查规则去吧
/* eslint-disable*/
/* global oojs */
oojs.define({
    name: 'templateSizeDA',
    namespace: 'rs.data',
    deps: {
        mysql: require('mysql'),
    },
    templateSizeDA: function (database, connection, transactionErrorHandle) {
        this.database = database;
        this.connection = connection;
        this.transactionErrorHandle = transactionErrorHandle;
    },
    insertSize: function (sizeItems, rpcCallback, callback) {
        if (!sizeItems || !sizeItems.length) {
            callback();
            return;
        }

        var valueStr = '';

        sizeItems.forEach(function (item, index) {
            valueStr += '(' 
                + this.connection.escape(item.id) + ', ' 
                + this.connection.escape(item.template_id) + ', ' 
                + this.connection.escape(item.type) + ', '
                + this.connection.escape(item.width) + ', '
                + this.connection.escape(item.height)
            + ')' + (index === sizeItems.length - 1 ? ';' : ',');
        }.proxy(this));        

        var queryStr = 'INSERT INTO ' + this.database + '.ts_template_size '
        + ' (id, template_id, type, width, height) '
        + ' VALUES '
        + valueStr;

        this.connection.query(queryStr, function (err, result) {
            if (err) {
                this.transactionErrorHandle(err, rpcCallback);
                return;
            }

            callback();
        }.proxy(this));
    },
    deleteSize: function (ids, rpcCallback, callback) {
        if (!ids) {
            callback();
            return;
        }

        this.connection.query('DELETE FROM ' + this.database + '.ts_template_size '
            + ' WHERE template_id IN (' + ids + ')', function (err, result) {
                if (err) {
                    this.transactionErrorHandle(err, rpcCallback);
                    return;
                }
                callback();
        }.proxy(this));
    }    
});

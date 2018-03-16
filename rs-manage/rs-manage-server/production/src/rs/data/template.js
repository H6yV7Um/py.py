/**
 * @file Global Config File
 * @author zhangziqiu@baidu.com
 */
// http://eslint.org/docs/rules/
// 妈的，自己查规则去吧
/* eslint-disable*/
/* global oojs */
oojs.define({
    name: 'template',
    namespace: 'rs.data',
    deps: {
        config: 'rs.common.config.global',
        templateSizeDA: 'rs.data.templateSizeDA',
        templateThumbnailDA: 'rs.data.templateThumbnailDA',
        mysql: require('mysql'),
        connection: null
    },
    $template: function () {

    },
    template: function () {
        this.connection = this.mysql.createConnection({
            host: this.config.db.host, // host user password读取自配置信息
            port: this.config.db.port,
            user: this.config.db.readUsername,
            password: this.config.db.readPassword,
            database: this.config.db.database
        });
        this.sizeDA = oojs.create(
            this.templateSizeDA,
            this.config.db.database,
            this.connection, 
            this.transactionErrorHandle
        );
        this.thumbnailDA = oojs.create(
            this.templateThumbnailDA,
            this.config.db.database, 
            this.connection, 
            this.transactionErrorHandle
        );
    },
    endConnection: function () {
        this.connection.end(function (err) {
            return err;
        });
    },
    regularErrorHandle: function (err, callback) {
        callback(err, 0);
        if (this.connection) {
            this.endConnection();
        }

        return false;
    },
    transactionErrorHandle: function (err, callback) {
        if (this.connection) {
            this.connection.rollback(function () {
                this.endConnection();
                callback(err, 0);
                return false;
            }.proxy(this));
        }

        return false;
    },
    search: function (searchObj, withPublic, withSubTemplate, callback) {
        // 查询条件对象
        searchObj = searchObj || {};

        // 是否选择公共模板
        var whereObj = searchObj;

        // 是否包含子模板
        var whereStyleType = null;
        if (searchObj.id) {
            // 只有根据id查询, 并且with_sub_template为true时, 才查询子模板
            whereStyleType = {
                style_type: searchObj.id
            };
        }

        var searchPra = '(';
        for (var pra in searchObj) {
            searchPra += pra + '=\'' + searchObj[pra] + '\' and ';
        }
        searchPra = searchPra.substr(0, searchPra.length - 5) + ')';
        if (withPublic && whereStyleType) {
            // 查询条件拼接
            searchPra += ' or ' + 'style_type=' + searchObj.id;
            searchPra += ' or ' + '(create_user_platform=\'system\' and create_user_id=\'system\' and status=1)';
        }
        else if (withPublic && !whereStyleType) {
            searchPra += ' or ' + '(create_user_platform=\'system\' and create_user_id=\'system\' and status=1)';
        }
        else if (!withPublic && whereStyleType) {
            searchPra += ' or ' + 'style_type=' + searchObj.id;
        }

        // 查询template
        try {
            var temResults = [];
            var temSql = 'select * from ' + this.config.db.database + '.ts_template where ' + searchPra;
            // this.createConnection();
            this.connection.query(temSql, function (err, results) {
                if (err) {
                    this.regularErrorHandle(err, callback);
                    return false;
                }

                temResults = results;
                var temIdArr = [];
                var temIdStr = '';
                for (var i = 0; i < temResults.length; i++) {
                    temIdArr.push(temResults[i].id);
                }
                temIdStr = temIdArr.join(',');
                if (temIdStr.length === 0) {
                    callback(null, []);
                    this.endConnection();
                    return;
                }

                // 查询size
                var sizeSql = 'select * from ' + this.config.db.database + '.ts_template_size where template_id in (' + temIdStr + ')';
                var sizeResults = [];
                this.connection.query(sizeSql, function (err, results) {
                    if (err) {
                        this.regularErrorHandle(err, callback);
                        return false;
                    }

                    sizeResults = results;
                    // 查询thumbnail
                    var thumbnailSql = 'select * from ' + this.config.db.database + '.ts_thumbnail where template_id in (' + temIdStr + ')';
                    var thumbnailResults = [];
                    this.connection.query(thumbnailSql, function (err, results) {
                        if (err) {
                            this.regularErrorHandle(err, callback);
                            return false;
                        }

                        thumbnailResults = results;
                        // 拼接查询结果
                        for (var i = 0; i < temResults.length; i++) {
                            var sizeArr = [];
                            for (var j = 0; j < sizeResults.length; j++) {
                                if (sizeResults[j].template_id === temResults[i].id) {
                                    sizeArr.push(sizeResults[j]);
                                }

                            }
                            temResults[i].size = sizeArr;
                            var thumbnailArr = [];
                            for (var j = 0; j < thumbnailResults.length; j++) {
                                if (thumbnailResults[j].template_id === temResults[i].id) {
                                    thumbnailArr.push(thumbnailResults[j]);
                                }

                            }
                            temResults[i].thumbnail = thumbnailArr;
                        }
                        this.endConnection();
                        callback(null, temResults);
                    }.proxy(this));
                }.proxy(this));
            }.proxy(this));
        }
        catch (e) {
            this.regularErrorHandle(e, callback);
        }
    },
    updateSingleTemplate: function (item, subItemArray, isSubTemplate, rpcCallback, shouldCommit) {
        // update防不能使用事务，否则delete size与insert size会发生冲突，
        // 造成锁表，原因未知
        this.update(item, subItemArray, isSubTemplate, rpcCallback, shouldCommit);
    },
    update: function (item, subItemArray, isSubTemplate, rpcCallback, shouldCommit, callback) {
        var templateId = item.id;
        var updateTplStr = 'UPDATE ' + this.config.db.database + '.ts_template ' 
            + ' SET ' 
            + ' style_type=' + this.connection.escape(item.style_type) + ','
            + ' name=' + this.connection.escape(item.name) + ','
            + ' content=' + this.connection.escape(item.content) + ','
            + ' sdl=' + this.connection.escape(item.sdl) + ','
            + ' version=' + this.connection.escape(item.version) + ','
            + ' create_account=' + this.connection.escape(item.create_account) + ','
            + ' create_user_id=' + this.connection.escape(item.create_user_id) + ','
            + ' create_user_platform=' + this.connection.escape(item.create_user_platform) + ','
            + ' update_account=' + this.connection.escape(item.update_account) + ','
            + ' update_user_id=' + this.connection.escape(item.update_user_id) + ','
            + ' update_user_platform=' + this.connection.escape(item.update_user_platform) + ','
            + ' status=' + this.connection.escape(item.status) + ','
            + ' remark=' + this.connection.escape(item.remark)
            + ' WHERE id=' +  templateId;

        this.connection.query(updateTplStr, function (err, result) {
            if (err) {
                this.transactionErrorHandle(err, rpcCallback);
                return;
            }

            // 删除原主模板附带的缩略图
            this.thumbnailDA.deleteThumbnail(templateId, rpcCallback, function () {
                // 删除原主模板附带的尺寸
                this.sizeDA.deleteSize(templateId, rpcCallback, function () {
                    item.thumbnail.forEach(function (thumbnailItem) {
                        thumbnailItem.id = null;
                        thumbnailItem.template_id = templateId;
                    });
                    // 插入当前主模板带的缩略图
                    this.thumbnailDA.insertThumbnail(item.thumbnail, rpcCallback, function () {

                        var sizeItems = item.size;
                        sizeItems.forEach(function (sizeItem) {
                            sizeItem.id = null;
                            sizeItem.template_id = templateId;
                        });

                        // 插入主模板附带的尺寸信息
                        this.sizeDA.insertSize(sizeItems, rpcCallback, function () {
                            // 统计哪些模板需要删除/更新/新插入
                            if (!isSubTemplate) {
                                this.connection.query('SELECT id FROM ' 
                                    + this.config.db.database 
                                    + '.ts_template WHERE '
                                    + 'style_type=' + templateId, function (err, subTplIds) {
                                        if (err) {
                                            this.transactionErrorHandle(err, rpcCallback);
                                            return;
                                        }

                                        // 子模板id必须存在
                                        // 所有的旧模板id
                                        subTplIds = subTplIds.map(function (idObj, index) {
                                            return idObj.id;
                                        });

                                        var tplId4delete = []; // 要删除的模板, 存储id
                                        var tplId4update = []; // 要更新的模板，存储id
                                        var tplItem4insert = []; // 要新插入的模板，存储模板

                                        // 如果有id同时存在于旧模板和新模板的中
                                        // 则该id模板需要更新
                                        var exist = false;
                                        for (var i = 0; i < subTplIds.length; i++) {
                                            var oldId = subTplIds[i];
                                            exist = false;
                                            for (var j = 0; j < subItemArray.length; j++) {
                                                if (subItemArray[j].id) {
                                                    var newId = subItemArray[j].id;
                                                    // 如果旧的id存在于新的id中
                                                    // 更新现有模板
                                                    if (oldId === newId) {
                                                        tplId4update.push(newId);
                                                        exist = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            // 如果旧的id不存在新的id中
                                            // 则删除旧id代表的模板
                                            if (!exist) {
                                                tplId4delete.push(oldId);
                                            }
                                        }

                                        for (var i = 0; i < subItemArray.length; i++) {
                                            // 如果子模板没有id
                                            // 或者子模板的id存在但不在旧的子模板中
                                            // 或者子模板的style_type存在但不等于主模板id
                                            // 则需要把模板插入
                                            if (!subItemArray[i].id
                                                || (subItemArray[i].id && subTplIds.indexOf(subItemArray[i].id) < 0)
                                                || (subItemArray[i].style_type && subItemArray[i].style_type != templateId)) {

                                                subItemArray[i].id = null;
                                                subItemArray[i].style_type = templateId;
                                                tplItem4insert.push(subItemArray[i]);
                                            }
                                        }

                                        function insertTemplateInBatch(items) {
                                            items.forEach(function (subItem, index) {
                                                this.insert(
                                                    subItem, 
                                                    [], 
                                                    true, 
                                                    rpcCallback, 
                                                    (index === items.length - 1 ? true : false)
                                                );
                                            }.proxy(this));
                                        }

                                        insertTemplateInBatch = insertTemplateInBatch.proxy(this);

                                        function updateTemplateInBatch(updateIds, insertItems) {
                                            updateIds.forEach(function (id, index) {
                                                subItemArray.forEach(function (subItem) {
                                                    if (subItem.id && id === subItem.id) {
                                                        this.update(
                                                            subItem, 
                                                            [], 
                                                            true, 
                                                            rpcCallback, 
                                                            (
                                                                (index === updateIds.length - 1) 
                                                                && !insertItems.length
                                                            ) ? true : false,
                                                            (
                                                                insertItems.length
                                                                && index === updateIds.length - 1
                                                            ) ? function () {
                                                                insertTemplateInBatch(
                                                                    insertItems
                                                                );
                                                            } : null
                                                        );
                                                    }
                                                }.proxy(this))
                                            }.proxy(this));
                                        }

                                        updateTemplateInBatch = updateTemplateInBatch.proxy(this);

                                        function deleteTemplateInBatch(deleteIds, updateIds, insertItems) {
                                            deleteIds.forEach(function (id, index) {
                                                this.deleteByTemplateId(
                                                    id, 
                                                    rpcCallback, 
                                                    (
                                                        (deleteIds.length - 1 === index)
                                                        && !updateIds.length
                                                        && !insertItems.length
                                                    ) ? true : false,
                                                    (
                                                        (updateIds.length || insertItems.length)
                                                        && (deleteIds.length - 1 === index)
                                                    ) ? 
                                                    function () {
                                                        if (updateIds.length) {
                                                            updateTemplateInBatch(updateIds, insertItems);
                                                        } else if (insertItems.length) {
                                                            insertTemplateInBatch(insertItems);
                                                        }
                                                    } : null
                                                );
                                            }.proxy(this));
                                        }

                                        deleteTemplateInBatch = deleteTemplateInBatch.proxy(this);


                                        if (tplId4delete.length) {
                                            deleteTemplateInBatch(tplId4delete, tplId4update, tplItem4insert);
                                        } else if (tplId4update.length) {
                                            updateTemplateInBatch(tplId4update, tplItem4insert);
                                        } else {
                                            insertTemplateInBatch(tplItem4insert);
                                        }
                                }.proxy(this));
                            }

                            if (callback) {
                                callback();
                            }

                            if (shouldCommit) {
                                this.connection.commit(function (err) {
                                    if (err) {
                                        this.transactionErrorHandle(err, rpcCallback);
                                        return;
                                    }
                                    rpcCallback(null,  item.style_type);
                                    this.endConnection();
                                }.proxy(this));                       
                                return;
                            }
                        }.proxy(this))
                    }.proxy(this))
                }.proxy(this));
            }.proxy(this))
        }.proxy(this))
    },
    insertSingleTemplate: function (item, subItemArray, isSubTemplate, rpcCallback, shouldCommit) {
        this.connection.beginTransaction(function (err) {
            if (err) {
                this.transactionErrorHandle(err, rpcCallback);
                return;
            }
            this.insert(item, subItemArray, isSubTemplate, rpcCallback, shouldCommit);
        }.proxy(this));
    },
    insert: function (item, subItemArray, isSubTemplate, rpcCallback, shouldCommit) {
        // 插入时同时要考虑子 模板/主模板、更新/插入 4种情况
        var templateId = item.id;
        var sqlInsertStr = 'insert into ' + this.config.db.database + '.ts_template set ? ';
        var itemMain = {
            id: item.id,
            style_type: item.style_type,
            name: item.name,
            content: item.content,
            sdl: item.sdl,
            version: item.version,
            create_account: item.create_account,
            create_user_id: item.create_user_id,
            create_user_platform: item.create_user_platform,
            update_account: item.update_account,
            update_user_id: item.update_user_id,
            update_user_platform: item.update_user_platform,
            status: item.status,
            remark: item.remark
        };

        this.connection.query(sqlInsertStr, itemMain, function (err, result) {
            if (err) {
                this.transactionErrorHandle(err, rpcCallback);
                return;
            }

            // 这里返回的insertId，也就是pkid，对于新模板来说等同于id
            var insertId = result.insertId;

            templateId = insertId;
            // 首先把主模板的style_type填充完毕
            if (!itemMain.style_type) {
                var queryStr = 'UPDATE ' + this.config.db.database + '.ts_template'
                    + ' set style_type=' + insertId
                    + ' WHERE id=' + insertId;
                this.connection.query(queryStr, function (err, result) {
                    if (err) {
                        this.transactionErrorHandle(err, rpcCallback);
                        return;
                    }

                }.proxy(this));
            }

            // 然后，再根据主模板的id，填充子模板的style_type和name
            // 规则根据 businsess/template 晓丽写的旧脚本
            if (subItemArray && subItemArray.length) {
                // ========== 子模板数据预处理 begin ========
                for (var i = 0, count = subItemArray.length; i < count; i++) {
                    var subTemplateItem = subItemArray[i];
                    // 子模板的自带 id 统一置为 null（无论是否自带），全部交由数据库生成
                    subTemplateItem.id = null;
                    subTemplateItem.style_type = subTemplateItem.style_type
                        ? subTemplateItem.style_type
                        : templateId
                            ? templateId
                            : '';
                    subTemplateItem.name = subTemplateItem.name
                        || (templateId ? ('sub-template-' + templateId) : '');
                }
            }

            var sizeItems = item.size || [];
            var thumbnailItems = item.thumbnail || [];

            thumbnailItems.forEach(function (thumbnailItem) {
                // 主模板、子模板的尺寸自带 id 统一置为 null（无论是否自带）
                thumbnailItem.id = null;
                // 主模板、子模板的尺寸自带 template_id 全部统一设置为所属模板的 templateId，无论是否自带
                thumbnailItem.template_id = templateId;
            });

            this.thumbnailDA.insertThumbnail(thumbnailItems, rpcCallback, function () {
                sizeItems.forEach(function (sizeItem) {
                    // 主模板、子模板的缩略图处理逻辑参考尺寸处理逻辑
                    sizeItem.id = null;
                    sizeItem.template_id = templateId;
                });

                // 备注：智能创意模板需要冗余，开始大家都以为尺寸信息只有在子模板上有
                // 所以要把子模板的信息保存两遍
                // 但霓裳已经在主模板上又保存了一遍子模板的尺寸，
                // 相当于已经为我们做了冗余，所以只要照常插入就好了，
                // 不需要手动复制子模板尺寸
                // if (isSubTemplate) {
                //     var duplicateSizeItems = sizeItems.slice().map(function (sizeItem) {
                //         sizeItem = Object.assign({}, sizeItem);
                //         sizeItem.template_id = item.style_type;
                //         return sizeItem;
                //     });
                //     sizeItems = sizeItems.concat(duplicateSizeItems);
                // }

                this.sizeDA.insertSize(sizeItems, rpcCallback, function () {
                    if (shouldCommit) {
                        this.connection.commit(function (err) {
                            if (err) {
                                this.transactionErrorHandle(err, rpcCallback);
                                return;
                            }

                            rpcCallback(null, item.style_type);
                            this.endConnection();
                        }.proxy(this));
                        return;
                    }

                    subItemArray.forEach(function (subTemplate, index) {
                        this.insert(
                            subTemplate, 
                            [], 
                            true, 
                            rpcCallback, 
                            (index === subItemArray.length - 1 ? true : false)
                        );
                    }.proxy(this));
                }.proxy(this))
            }.proxy(this));
        }.proxy(this));
    },
    checkIsNewTemplate: function (id, callback) {
        this.connection.query('SELECT * FROM ' + this.config.db.database + '.ts_template WHERE id=' + id,
            function (error, result, fields) {
                if (error) {
                    this.regularErrorHandle(error);
                    return;
                }
                callback(result.length ? true : false);
            }.proxy(this)
        );
    },
    deleteByTemplateId: function (templateId, rpcCallback, shouldCommit, callback) {
        var queryIdStr = 'SELECT id FROM ' + this.config.db.database + '.ts_template'
            + ' WHERE (id=' + templateId + ' OR style_type=' + templateId + ')';

        this.connection.beginTransaction(function (err) {
            
            if (err) {
                this.transactionErrorHandle(err, rpcCallback);
                return;
            }
            // 这一步骤可以省略（查询id）
            // 可以直接把查询语句当作deleteSize和deleteThumbnail的参数
            // 但是在操作过程中可能引起死锁操作，原因未知
            this.connection.query(queryIdStr, function (err, results) {
                if (err) {
                    this.transactionErrorHandle(err, rpcCallback);
                    return;                    
                }
                var ids = results.map(function (idObj) {
                    return idObj.id;
                }).join(',');

                this.sizeDA.deleteSize(ids, rpcCallback, function () {
                    this.thumbnailDA.deleteThumbnail(ids, rpcCallback, function () {
                        this.connection.query('DELETE FROM ' + this.config.db.database + '.ts_template '
                            + ' WHERE (id=' + templateId
                            + ' OR style_type=' + templateId + ')', function (err, result) {
                                
                                if (err) {
                                    this.transactionErrorHandle(err, rpcCallback);
                                    return;
                                }

                                if (callback) {
                                    callback();
                                }

                                if (shouldCommit) {
                                    this.connection.commit(function (err) {
                                        
                                        if (err) {
                                            this.transactionErrorHandle(err, rpcCallback);
                                            return;
                                        }

                                        this.endConnection();
                                        rpcCallback(null, result.affectedRows);
                                    }.proxy(this));
                                }
                            }.proxy(this));
                    }.proxy(this));
                }.proxy(this));
            }.proxy(this));
        }.proxy(this));
    }
});
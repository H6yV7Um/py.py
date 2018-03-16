oojs.define({
    name: 'templateService',
    namespace: 'rs.api.service',
    deps: {
        templateBL: 'rs.business.template',
        converter: 'rs.common.model.converter',
        searchRequest: 'rs.common.model.searchRequest',
        searchResponse: 'rs.common.model.searchResponse',
        insertUpdateRequest: 'rs.common.model.insertUpdateRequest',
        insertUpdateResponse: 'rs.common.model.insertUpdateResponse',
        deleteRequest: 'rs.common.model.deleteRequest',
        deleteResponse: 'rs.common.model.deleteResponse'
    },

    log: {
        requestInfo: {
            account: 1
        }
    },

    /**
     * 静态构造函数
     * @static constructor
     */
    $templateService: function () {

    },

    search: function (requestInfo, callback) {
        requestInfo = requestInfo || {};

        var searchObj = {};
        if (requestInfo.user_platform) {
            searchObj.create_user_platform = requestInfo.user_platform;
        }
        if (requestInfo.user_id) {
            searchObj.create_user_id = requestInfo.user_id;
        }
        if (requestInfo.template_id) {
            searchObj.id = requestInfo.template_id;
        }

        //是否包括公共模版, 默认是true
        var withPublic = typeof requestInfo.with_public === 'undefined' ? true : requestInfo.with_public;

        //是否包括子模版, 默认是false
        var withSubTemplate = typeof requestInfo.withSubTemplate === 'undefined' ? true : requestInfo.with_public;

        this.templateBL.search(searchObj,
            withPublic,
            withSubTemplate,
            this.searchCallback.proxy(this, requestInfo, callback));
        return true;
    },
    searchCallback: function (err, resultObj, requestInfo, callback) {
        //check error
        var errorString = "";
        var status = 1;
        if (err) {
            status = -1;
            errorString = JSON.stringify(err);
        }

        resultObj = resultObj || [];

        var templateModelType = 1;
        if (requestInfo && requestInfo.template_model_type) {
            templateModelType = requestInfo.template_model_type;
        }

        /*
         //返回全部属性
         ALL = 1;
         //列表模式, 只带有最简单的用于列表展示的数据, 不携带 sdl, size, content 和 update信息
         LIST = 2;
         //SDL模式, 只返回SDL, 不带有模版内容
         SDL = 3;
         //CONTENT模式, 只返回模板内容, 不带有SDL信息
         CONTENT = 4;
         * */
        if (templateModelType === 2) {
            for (var i = 0, count = resultObj.length; i < count; i++) {
                var item = resultObj[i];
                item.sdl = '';
                item.size = [];
                item.content = '';
            }
        }
        else if (templateModelType === 3) {
            for (var i = 0, count = resultObj.length; i < count; i++) {
                var item = resultObj[i];
                item.size = [];
                item.content = '';
            }
        }
        else if (templateModelType === 4) {
            for (var i = 0, count = resultObj.length; i < count; i++) {
                var item = resultObj[i];
                item.sdl = '';
            }
        }

        //过滤子模板
        var tempArray = [];
        if (!requestInfo.with_sub_template) {
            //默认过滤子模板
            var templateIdIndex = {}; //结果的模板id索引, 用于过滤子模板使用.
            for (var i = 0, count = resultObj.length; i < count; i++) {
                templateIdIndex[resultObj[i].id] = 1;
            }

            for (var i = 0, count = resultObj.length; i < count; i++) {
                var item = resultObj[i];
                if (item.style_type && item.style_type !== item.id && templateIdIndex[item.style_type]) {
                    //此模版是子模板
                    continue;
                }
                else {
                    tempArray.push(item);
                }
            }
        }
        else {
            //不过滤子模板
            tempArray = resultObj;
        }


        var responseInfo = {status: status, template: tempArray, error: errorString};
        callback(null, responseInfo);
    },

    insertUpdate: function (requestInfo, callback) {
        var templateId = requestInfo.template.id;

        // 检查主模板合法性
        var checkMainTemplateResult = this.templateBL.checkValid(requestInfo.template);
        if (!checkMainTemplateResult.isValid) {
            var mainTemplateError = new Error(checkMainTemplateResult.message);
            this.checkInvalidCallback(mainTemplateError, callback);
            return true;
        }

        // 检查子模板合法性
        if (requestInfo.sub_template && requestInfo.sub_template.length) {
            var subTemplateArray = requestInfo.sub_template;
            for (var i = 0, count = subTemplateArray.length; i < count; i++) {
                var checkSubTemplateResult = this.templateBL.checkValid(subTemplateArray[i]);
                if (!checkSubTemplateResult.isValid) {
                    var subTemplateError = new Error(checkSubTemplateResult.message + ', sub template index:' + i);
                    this.checkInvalidCallback(subTemplateError, callback);
                    return true;
                }
            }
        }


        if (templateId) {
            this.templateBL.deleteByTemplateId({template_id: templateId},
                function (err, deleteCount, requestInfo, callback) {
                    this.templateBL.insert(requestInfo, this.insertUpdateCallback.proxy(this, callback));
                }.proxy(this, requestInfo, callback));
        }
        else {
            this.templateBL.insert(requestInfo, this.insertUpdateCallback.proxy(this, callback));
        }
        return true;
    },

    /**
     * 模板检查失败时的回调函数
     *
     * @param  {Object} err 异常对象
     * @param  {Function} callback 回调函数
     */
    checkInvalidCallback: function (err, callback) {
        var responseInfo = {
            status: 100,
            template_id: 0,
            error: err.message
        };
        var pbResponseInfo = this.converter.convertToPb({meta: this.insertUpdateResponse, data: responseInfo});
        callback(null, pbResponseInfo);
    },

    insertUpdateCallback: function (err, templateId, callback) {
        var errorString = "";
        var status = 1;

        if (err) {
            status = -1;
            errorString = JSON.stringify(err);
        }
        var responseInfo = {status: status, template_id: templateId, error: errorString};
        var pbResponseInfo = this.converter.convertToPb({meta: this.insertUpdateResponse, data: responseInfo});
        callback(null, pbResponseInfo);
    },

    delete: function (requestInfo, callback) {
        this.templateBL.deleteByTemplateId(requestInfo, this.deleteCallback.proxy(this, callback));
        return true;
    },

    deleteCallback: function (err, deleteCount, callback) {
        var errorString = "";
        var status = 1;

        if (err) {
            status = -1;
            errorString = JSON.stringify(err);
        }
        var responseInfo = {status: status, count: deleteCount, error: errorString};
        var pbResponseInfo = this.converter.convertToPb({meta: this.deleteResponse, data: responseInfo});
        callback(null, pbResponseInfo);
    }

});
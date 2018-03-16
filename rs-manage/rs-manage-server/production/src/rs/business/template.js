/**
 * @file templates
 * @author liguangyi@baidu.com
 */

/* global oojs */
// http://eslint.org/docs/rules/
// 妈的，自己查规则去吧
/* eslint-disable*/
oojs.define({
    name: 'template',
    namespace: 'rs.business',
    deps: {
        otpl: 'rs.business.otplRenderEngine',
        templateDA: 'rs.data.template'
    },
    search: function (searchObj, withPublic, withSubTemplate, callback) {
        searchObj = searchObj || {};

        // 模板状态值, 默认只选取可用模板
        if (typeof searchObj.status === 'undefined') {
            searchObj.status = 1;
        }

        var da = oojs.create(this.templateDA);
        da.search(searchObj, withPublic, withSubTemplate, callback);
    },

    setDefault: function (source, dataType, defaultValue) {
        if (typeof defaultValue === 'undefined') {
            switch (dataType) {
                case 'string':
                    defaultValue = '';
                    break;
                case 'date':
                    defaultValue = new Date();
                    break;
                case 'int':
                    defaultValue = 1;
            }
        }

        if (source === null || typeof source === 'undefined') {
            return defaultValue;
        }

        return source;

    },

    /**
     * 检查模板合法性
     *
     * @param {Object} templateInfo 模版对象
     * @return {{isValid: boolean, message: string}} 检查结果
     */
    checkValid: function (templateInfo) {
        var result = {
            isValid: true,
            message: ''
        };

        // 只检查填写了content字段的模板
        if (templateInfo && templateInfo.content) {
            try {
                // 预处理模板
                var templateContent = this.otpl.toServerRenderTemplate(templateInfo.content, {
                    commonModule: true
                });
                // 预编译模板
                var templateFunction = this.otpl.compile(templateContent);
            }
            catch (ex) {
                result.isValid = false;
                result.message = 'template content can not be compiled. ';
                result.message += ex.message;
            }
        }

        return result;
    },
    // callback:function(err, templateId)
    insert: function (requestInfo, callback) {

        // 没有子模板插入代码是没有意义的
        // 没有子模板就没有具体的模板内容，没有尺寸信息
        if (!requestInfo.sub_template || !requestInfo.sub_template.length) {
            callback('No sub templates', null);
            return false;
        }

        var template = requestInfo.template;
        var styleType = template.style_type;
        var templateId = template.id || ''; // id 允许为空
        var subTemplateArray = requestInfo.sub_template;

        // 主模板预处理
        template.style_type = template.style_type || 0;
        template.name = this.setDefault(template.name, 'string');
        template.content = this.setDefault(template.content, 'string');
        template.sdl = this.setDefault(template.sdl, 'string');
        template.version = this.setDefault(template.version, 'int', 1);
        template.create_account = this.setDefault(template.create_account, 'string');
        template.create_user_id = this.setDefault(template.create_user_id, 'string');
        template.create_user_platform = this.setDefault(template.create_user_platform, 'string');
        template.update_account = this.setDefault(template.update_account, 'string');
        template.update_user_id = this.setDefault(template.update_user_id, 'string');
        template.update_user_platform = this.setDefault(template.update_user_platform, 'string');
        template.status = this.setDefault(template.status, 'int', 1);
        template.remark = this.setDefault(template.remark, 'string');

        // 插入模板组
        if (subTemplateArray && subTemplateArray.length) {
            // ========== 子模板数据预处理 begin ========
            for (var i = 0, count = subTemplateArray.length; i < count; i++) {
                var subTemplateItem = subTemplateArray[i];
                // 注意 id/style_type/name 是依赖主模板的，在主模板还没有插入的情况下允许置为空

                // 如果是更新模板，首选沿用原id
                subTemplateItem.id = subTemplateItem.id ? subTemplateItem.id : '';
                // 子模板的style_type肯定是主模板的id
                subTemplateItem.style_type = templateId;
                // 子模板名称首选沿用原名称
                subTemplateItem.name = subTemplateItem.name
                    ? subTemplateItem.name
                    : (templateId ? ('sub-template-' + templateId) : '');

                subTemplateItem.content = subTemplateItem.content || '';
                subTemplateItem.sdl = subTemplateItem.sdl || template.sdl;
                subTemplateItem.version = subTemplateItem.version || template.version;
                subTemplateItem.create_account = template.create_account;
                subTemplateItem.create_user_id = template.create_user_id;
                subTemplateItem.create_user_platform = template.create_user_platform;
                subTemplateItem.update_account = template.update_account;
                subTemplateItem.update_user_id = template.update_user_id;
                subTemplateItem.update_user_platform = template.update_user_platform;
                subTemplateItem.status = template.status;
                subTemplateItem.remark = subTemplateItem.remark || template.remark;
            }
        }

        // 如果没有id，一定是插入新模板
        if (!templateId) {
            var da = oojs.create(this.templateDA);
            da.insertSingleTemplate(template, subTemplateArray, false, callback, false);
        } else {
            // 如果有id，既有可能插入新模板，也有可能是更新旧模板
            // 如果数据库中有这个id，则表示在更新旧模板，否则不允许插入带id的模板
            var da = oojs.create(this.templateDA);
            da.checkIsNewTemplate(templateId, function (idIsExist) {
                // 如果数据库中没有该ID的模板，则表示无法更新
                if (!idIsExist) {
                    callback("You can not insert tempalte with ID", null);
                    da.endConnection();
                    return;
                }

                da.updateSingleTemplate(
                    requestInfo.template,
                    requestInfo.sub_template,
                    false,
                    callback,
                    false
                );
            })
        }
    },
    // callback:function(err, deleteCount)
    deleteByTemplateId: function (context, callback) {
        var templateId = context.template_id;
        var da = oojs.create(this.templateDA);
        da.deleteByTemplateId(templateId, callback, true);
    }
});
/**
 * @file ģ���ѯ�ӿ��������ģ��
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SearchRequest',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SearchRequest',
    property: {
        account: {
            type: 'string'
        },
        user_platform: {
            type: 'string'
        },
        user_id: {
            type: 'string'
        },
        template_id: {
            type: 'number'
        },
        /**
         * 1:����ȫ������
         * 2:�б�ģʽ, ֻ������򵥵������б�չʾ������, ��Я�� sdl, size, content �� update��Ϣ
         * 3:SDLģʽ, ֻ����SDL, ������ģ������
         * 4:CONTENTģʽ, ֻ����ģ������, ������SDL��Ϣ
         */
        template_model_type: {
            type: 'number'
        },
        /**
         * �Ƿ񷵻ع���ģ��, Ĭ��Ϊ false
         */
        with_public: {
            type: 'boolean'
        },
        /**
         * �Ƿ񷵻���ģ��, Ĭ��Ϊ false, ��Ĭ��ֻ������ģ��
         */
        with_sub_template: {
            type: 'boolean'
        }
    }
});

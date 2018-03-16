/**
 * @file 解决IE不缓存图片的问题
 * @author fanwenjuan@baidu.com
 */
try {
    // 解决IE不缓存图片的问题
    document.execCommand('BackgroundImageCache', false, true);
}
catch (err) {}

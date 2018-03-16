/* global oojs */
/**
* @file text_app_download_lbs
* @author fanwenjuan
*/
oojs.define({
    name: 'page',
    namespace: 'rs.template.text_app_download_lbs',
    deps: {},
    $page: function () {
        var secCount = document.getElementById('spanSec');
        var minCount = document.getElementById('spanMin');
        if (secCount && minCount) {
            setInterval(function () {
                var secCount = document.getElementById('spanSec');
                var minCount = document.getElementById('spanMin');
                if (parseInt(secCount.innerHTML, 10) - 1 === 0) {
                    minCount.innerHTML = parseInt(minCount.innerHTML, 10) - 1 < 0 ? 4 : parseInt(minCount.innerHTML, 10) - 1;
                    secCount.innerHTML = 59;
                }
                else {
                    secCount.innerHTML = parseInt(secCount.innerHTML, 10) - 1;
                }
            }, 1000);
        }
    }
});
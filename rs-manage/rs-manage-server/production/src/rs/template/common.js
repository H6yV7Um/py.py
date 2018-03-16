/**
 * @file common
 */
/* global oojs */
try {
    document.execCommand("BackgroundImageCache", false, true);
}
catch (err) {
}

oojs.config({basePath: '{{dupDomain}}/cpro/ui/noexpire/js/'});
oojs.loadScript('rs.business.anticheat');
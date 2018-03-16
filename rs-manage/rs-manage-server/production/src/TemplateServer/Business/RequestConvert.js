/**
 * @file RequestConvert
 * @author qianxiaoli@baidu.com
 */
/* global oojs */
oojs.define({
    name: 'RequestConvert',
    namespace: 'TemplateServer.Business',
    deps: {
    },

    $RequestConvert: function (requestInfo) {

    },
    middleConvert: function (requestInfo) {
        try {
            var ads = JSON.parse(requestInfo.ads);
            var adArray = [];
            var adElement = {
                textCreativeName: [],
                textTitle: [],
                textDesc1: [],
                textDesc2: [],
                textAdditionalTitle: [],
                textAdditionalName: [],
                textAdditionalDesc: [],

                imgCreativeName: [],
                imgWidth: [],
                imgHeight: [],
                imgFileSrc: [],
                imgMediaId: [],
                imgFileMd5: [],
                imgFileSize: [],
                imgMediaPath: [],
                imgMediaPreviewUrl: [],
                imageSource: [],
                imgRainbowTemplateId: [],

                videoCreativeName: [],
                videoFileSrc: [],
                videoMediaId: [],
                videoFileMd5: [],
                videoFileSize: [],
                videoMediaPath: [],
                videoMediaPreviewUrl: [],
                videoWidth: [],
                videoHeight: [],
                videoBitRate: [],
                videoLen: [],
                videoRealLen: [],

                iconFileSrc: [],
                iconMediaId: [],
                iconFileMd5: [],
                iconFileSize: [],
                iconMediaPath: [],
                iconMediaPreviewUrl: [],
                iconWidth: [],
                iconHeight: [],

                appName: '',
                appComment: '',
                appIntroduction: '',
                appDescription: '',
                appLogoUrl: '',
                appOs: '',
                appPackage: '',
                appKey: '',
                appSize: '',
                ipaInstallUrl: '',
                appVersion: '',
                appChannel: '',
                hasSdk: false,
                isUpload: false,
                appUrl: '',
                appCategory: '',
                screenshotList: '',
                finalAppUrl: '',
                headerImg: '',

                action: [],
                additionalAction: [],
                creativeType: '',

                sdkInteractionInfo: '',
                wapAppInfo: ''
            };
            if (ads.creativeContents) {
                for (var i = 0; i < ads.creativeContents.length; i++) {
                    var ad = ads.creativeContents[i];
                    var adE = JSON.parse(JSON.stringify(adElement)); // adElement;
                    if (ad.textMaterial && ad.textMaterial.length > 0) {
                        for (var j = 0; j < ad.textMaterial.length; j++) {
                            var textM = ad.textMaterial[j];
                            adE.textCreativeName.push(textM.creativeName || '');
                            adE.textTitle.push(textM.creativeTitle || '');
                            adE.textDesc1.push(textM.creativeDesc1 || '');
                            adE.textDesc2.push(textM.creativeDesc2 || '');
                            adE.textAdditionalTitle.push(textM.additionalTitle);
                            adE.textAdditionalName.push(textM.additionalName);
                            adE.textAdditionalDesc.push(textM.additionalDesc);
                        }
                    }
                    if (ad.imageMaterial && ad.imageMaterial.length > 0) {
                        for (var j = 0; j < ad.imageMaterial.length; j++) {
                            var imgM = ad.imageMaterial[j];
                            adE.imgCreativeName.push(imgM.creativeName || '');
                            adE.imgWidth.push(imgM.width || 90);
                            adE.imgHeight.push(imgM.height || 90);
                            adE.imgFileSrc.push(imgM.file && imgM.file.fileSrc || '');
                            adE.imgMediaId.push(imgM.file && imgM.file.mediaId || '');
                            adE.imgFileMd5.push(imgM.file && imgM.file.fileMd5 || '');
                            adE.imgFileSize.push(imgM.file && imgM.file.fileSize || '');
                            adE.imgMediaPath.push(imgM.file && imgM.file.mediaPath || '');
                            adE.imgMediaPreviewUrl.push(imgM.file && imgM.file.mediaPreviewUrl || '');
                            adE.imageSource.push(imgM.file && imgM.imageSource || '');
                            adE.imgRainbowTemplateId.push(imgM.file && imgM.rainbowTemplateId || '');
                        }
                    }
                    if (ad.videoMaterial && ad.videoMaterial.length > 0) {
                        for (var j = 0; j < ad.videoMaterial.length; j++) {
                            var videoM = ad.videoMaterial[j];
                            adE.videoCreativeName.push(videoM.creativeName || '');
                            adE.videoWidth.push(videoM.width || 90);
                            adE.videoHeight.push(videoM.height || 90);
                            adE.videoFileSrc.push(videoM.file && videoM.file.fileSrc || '');
                            adE.videoMediaId.push(videoM.file && videoM.file.mediaId || '');
                            adE.videoFileMd5.push(videoM.file && videoM.file.fileMd5 || '');
                            adE.videoFileSize.push(videoM.file && videoM.file.fileSize || '');
                            adE.videoMediaPath.push(videoM.file && videoM.file.mediaPath || '');
                            adE.videoMediaPreviewUrl.push(videoM.file && videoM.file.mediaPreviewUrl || '');
                            adE.videoBitRate.push(videoM.file && videoM.VideoBitRate || '');
                            adE.videoLen.push(videoM.file && videoM.videoLen || '');
                            adE.videoRealLen.push(videoM.file && videoM.videoRealLen || '');
                        }
                    }
                    if (ad.iconMaterial && ad.iconMaterial.length > 0) {
                        for (var j = 0; j < ad.iconMaterial.length; j++) {
                            var iconM = ad.iconMaterial[j];
                            adE.iconWidth.push(iconM.width || 90);
                            adE.iconHeight.push(iconM.height || 90);
                            adE.iconFileSrc.push(iconM.file && iconM.file.fileSrc || '');
                            adE.iconMediaId.push(iconM.file && iconM.file.mediaId || '');
                            adE.iconFileMd5.push(iconM.file && iconM.file.fileMd5 || '');
                            adE.iconFileSize.push(iconM.file && iconM.file.fileSize || '');
                            adE.iconMediaPath.push(iconM.file && iconM.file.mediaPath || '');
                            adE.iconMediaPreviewUrl.push(iconM.file && iconM.file.mediaPreviewUrl || '');
                        }
                    }
                    if (ad.promoteAppMaterial) {
                        var promoteAppM = ad.promoteAppMaterial || '';
                        adE.appName = promoteAppM.appName || '';
                        adE.appComment = promoteAppM.appComment || '';
                        adE.appIntroduction = promoteAppM.appIntroduction || '';
                        adE.appDescription = promoteAppM.appDescription || '';
                        adE.appLogoUrl = promoteAppM.appLogoUrl || '';
                        adE.appOs = promoteAppM.appOs || '';
                        adE.appPackage = promoteAppM.appPackage || '';
                        adE.appKey = promoteAppM.appKey || '';
                        adE.appSize = promoteAppM.appSize || '';
                        adE.ipaInstallUrl = promoteAppM.ipaInstallUrl || '';
                        adE.appVersion = promoteAppM.appVersion || '';
                        adE.appChannel = promoteAppM.appChannel || '';
                        adE.hasSdk = promoteAppM.hasSdk || '';
                        adE.isUpload = promoteAppM.isUpload || '';
                        adE.appUrl = promoteAppM.appUrl || '';
                        adE.appCategory = promoteAppM.appCategory || '';
                        adE.screenshotList = promoteAppM.screenshotList || '';
                        adE.finalAppUrl = promoteAppM.finalAppUrl || '';
                        adE.headerImg = promoteAppM.headerImg || '';
                    }
                    adE.action = ad.action || '';
                    adE.creativeType = ad.creativeType || '';
                    adE.additionalAction = ad.additionalAction;

                    adE.sdkInteractionInfo = ad.sdkInteractionInfo || '{}';
                    adE.wapAppInfo = ad.wapAppInfo || '{}';
                    adArray.push(adE);
                }
            }
            if (ads.mainCreatives) {
                for (var i = 0; i < ads.mainCreatives.length; i++) {
                    var ad = ads.mainCreatives[i];
                    var adE =  JSON.parse(JSON.stringify(adElement)); // adElement;
                    if (ad.text && ad.text.material) {
                        var textM = ad.text.material;
                        adE.textCreativeName.push(textM.creativeName || '');
                        adE.textTitle.push(textM.creativeTitle || '');
                        adE.textDesc1.push(textM.creativeDesc1 || '');
                        adE.textDesc2.push(textM.creativeDesc2 || '');
                        if (ad.text.additionalAction) {
                            adE.action = ad.text.additionalAction || '';
                        }
                        adE.action.unshift(ad.text.action || '');
                        if (ad.text.action && ad.text.action.forward) {
                            adE.action[0].clickLink = ad.text.action.forward.clickLink;
                            adE.action[0].forward.title = ad.text.action.forward.targetPage;
                        }
                    }
                    else if (ad.image  && ad.image.material) {
                        var imgM = ad.image.material;
                        adE.imgCreativeName.push(imgM.creativeName || '');
                        adE.imgWidth.push(imgM.width || 90);
                        adE.imgHeight.push(imgM.height || 90);
                        adE.imgFileSrc.push(imgM.file && imgM.file.fileSrc || '');
                        adE.imgMediaId.push(imgM.file && imgM.file.mediaId || '');
                        adE.imgFileMd5.push(imgM.file && imgM.file.fileMd5 || '');
                        adE.imgFileSize.push(imgM.file && imgM.file.fileSize || '');
                        adE.imgMediaPath.push(imgM.file && imgM.file.mediaPath || '');
                        adE.imgMediaPreviewUrl.push(imgM.file && imgM.file.mediaPreviewUrl || '');
                        adE.imageSource.push(imgM.file && imgM.file.imageSource || '');
                        adE.imgRainbowTemplateId.push(imgM.file && imgM.file.rainbowTemplateId || '');
                        if (ad.image.additionalAction) {
                            adE.action = ad.image.additionalAction || '';
                        }
                        adE.action.unshift(ad.image.action || '');
                        if (ad.image.action && ad.image.action.forward) {
                            adE.action[0].clickLink = ad.image.action.forward.clickLink;
                            adE.action[0].forward.title = ad.image.action.forward.targetPage;
                        }
                    }
                    else if (ad.textWithIcon && ad.textWithIcon.material) {
                        var textWithIconM = ad.textWithIcon.material;
                        adE.textCreativeName.push(textWithIconM.creativeName || '');
                        adE.textTitle.push(textWithIconM.creativeTitle || '');
                        adE.textDesc1.push(textWithIconM.creativeDesc1 || '');
                        adE.textDesc2.push(textWithIconM.creativeDesc2 || '');
                        adE.iconWidth.push(textWithIconM.width || 90);
                        adE.iconHeight.push(textWithIconM.height || 90);
                        adE.iconFileSrc.push(textWithIconM.file.fileSrc || '');
                        adE.iconMediaId.push(textWithIconM.file.mediaId || '');
                        adE.iconFileMd5.push(textWithIconM.file.fileMd5 || '');
                        adE.iconFileSize.push(textWithIconM.file.fileSize || '');
                        adE.iconMediaPath.push(textWithIconM.file.mediaPath || '');
                        adE.iconMediaPreviewUrl.push(textWithIconM.file.mediaPreviewUrl || '');
                        if (ad.textWithIcon.additionalAction) {
                            adE.action = ad.textWithIcon.additionalAction || '';
                        }
                        adE.action.unshift(ad.textWithIcon.action || '');
                        if (ad.textWithIcon.action && ad.textWithIcon.action.forward) {
                            adE.action[0].clickLink = ad.textWithIcon.action.forward.clickLink;
                            adE.action[0].forward.title = ad.textWithIcon.action.forward.targetPage;
                        }
                    }
                    else if (ad.video && ad.video.material) {
                        var videoM = ad.video.material;
                        adE.videoCreativeName.push(videoM.creativeName || '');
                        adE.videoWidth.push(videoM.width || 90);
                        adE.videoHeight.push(videoM.height || 90);
                        adE.videoFileSrc.push(videoM.file && videoM.file.fileSrc || '');
                        adE.videoMediaId.push(videoM.file && videoM.file.mediaId || '');
                        adE.videoFileMd5.push(videoM.file && videoM.file.fileMd5 || '');
                        adE.videoFileSize.push(videoM.file && videoM.file.fileSize || '');
                        adE.videoMediaPath.push(videoM.file && videoM.file.mediaPath || '');
                        adE.videoMediaPreviewUrl.push(videoM.file && videoM.file.mediaPreviewUrl || '');
                        adE.videoBitRate.push(videoM.file && videoM.VideoBitRate || '');
                        adE.videoLen.push(videoM.file && videoM.videoLen || '');
                        adE.videoRealLen.push(videoM.file && videoM.videoRealLen || '');
                        adE.action.push(ad.video.action || '');
                        if (ad.video.action && ad.video.action.forward) {
                            adE.action[0].clickLink = ad.video.action.forward.clickLink;
                            adE.action[0].forward.title = ad.video.action.forward.targetPage;
                        }
                    }
                    else if (ad.flash && ad.flash.material) { // flash复用image数据对象，模板中读取image数据对应值
                        var imgM = ad.flash.material;
                        adE.imgCreativeName.push(imgM.creativeName || '');
                        adE.imgWidth.push(imgM.width || 90);
                        adE.imgHeight.push(imgM.height || 90);
                        adE.imgFileSrc.push(imgM.file && imgM.file.fileSrc || '');
                        adE.imgMediaId.push(imgM.file && imgM.file.mediaId || '');
                        adE.imgFileMd5.push(imgM.file && imgM.file.fileMd5 || '');
                        adE.imgFileSize.push(imgM.file && imgM.file.fileSize || '');
                        adE.imgMediaPath.push(imgM.file && imgM.file.mediaPath || '');
                        adE.imgMediaPreviewUrl.push(imgM.file && imgM.file.mediaPreviewUrl || '');
                        adE.imageSource.push(imgM.file && imgM.file.imageSource || '');
                        adE.imgRainbowTemplateId.push(imgM.file && imgM.file.rainbowTemplateId || '');
                        if (ad.flash.additionalAction) {
                            adE.action = ad.flash.additionalAction || '';
                        }
                        adE.action.unshift(ad.image.action || '');
                        if (ad.image.action && ad.image.action.forward) {
                            adE.action[0].clickLink = ad.image.action.forward.clickLink;
                            adE.action[0].forward.title = ad.image.action.forward.targetPage;
                        }
                    }
                    adE.additionalAction = ad.additionalAction;
                    adE.creativeType = ad.creativeType || '';
                    adE.sdkInteractionInfo = ad.extention || '{}';
                    adE.wapAppInfo = ad.extention || '{}';
                    adArray.push(adE);
                }
            }
            return adArray;
        }
        catch (e) {
            oojs.log.error(e);
        }
    }

});
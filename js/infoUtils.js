var Utils = {
    getDeviceType: function () {
        var userAgent =  navigator.userAgent.toLocaleLowerCase();
        console.log(userAgent.indexOf("android") >= 0);
        if(userAgent.indexOf("micrcomeeager") >= 0){
            return DEVICE_CONFIG.WEIXING;
        }else if(userAgent.indexOf("chrome") >= 0 && userAgent.indexOf("windows") >= 0){
            return DEVICE_CONFIG.CHROME;
        }else if(userAgent.indexOf("iphone") >= 0){
            return DEVICE_CONFIG.IOS;
        }else if(userAgent.indexOf("android") >= 0){
            return DEVICE_CONFIG.ANDROID;
        }else if(false){
            return DEVICE_CONFIG.WP;
        }
        return DEVICE_CONFIG.CHROME;
    },
    //�ж��Ƿ���PC����
    isIOS: function () {
        var userAgent =  navigator.userAgent.toLocaleLowerCase();
        return (userAgent.indexOf("iphone") >= 0);
    }
};

/**
 *
 * */
var DEVICE_CONFIG = {
    WEIXING : "weixing",
    CHROME : "chrome",
    PC: "PC",
    ANDROID: "android",
    IOS: "iphone",
    WP: "",
    MOBILE: ""
};

/* eslint-disable */oojs.define({name:"page",namespace:"",deps:{},sdk:{},adsExtention:[],resizeTimer:null,$page:function(){try{this.adClick("container")}catch(a){}},adClick:function(b){b=b||"container";var a=document.getElementById(b);var f=a.getElementsByTagName("a");for(var d=0;d<f.length;d++){var e=f[d].className;var c=f[d].id;if(e){e=e.toLowerCase();if(e==="gylogo"||e==="bdlogo"||e.substring(0,7)==="bd-logo"){continue}}this.bind(f[d],"click",this.onAdClick.proxy(this))}},onAdClick:function(f){var g=this.formatEventObj(f);var d=g.target;while(d.tagName.toLowerCase()!=="a"&&d.tagName.toLowerCase()!=="body"){d=d.parentNode}var a=this.getAttr(d,"type");if(a==="phone"){var c=this.getAttr(d,"href");var b=this.getAttr(d,"date-tel");this.sendByImage(c,window,b);return this.stopEvent(f)}if(a==="forward"){var b=this.getAttr(d,"href");window.open(b,"_blank");return this.stopEvent(f)}},bind:function(a,c,b){if(a.addEventListener){a.addEventListener(c,b,false)}else{a.attachEvent("on"+c,b)}},getAttr:function(b,a){if(b&&b.getAttribute){return b.getAttribute(a)}else{return b[a]}},formatEventObj:function(a){a=a||window.event;a.target=a.target||a.srcElement;return a},stopEvent:function(a){if(a&&a.stopPropagation){a.stopPropagation()}else{window.event.cancelBubble=true}if(a&&a.preventDefault){a.preventDefault()}return false},sendByImage:function(d,f,c){var b=new Image();var e="cpro_log_"+Math.floor(Math.random()*2147483648).toString(36);f=f||window;f[e]=b;b.onload=b.onerror=b.onabort=function(){b.onload=b.onerror=b.onabort=null;f[e]=null;b=null;window.open(c,"_top")};b.src=d;var a=navigator.userAgent.toLowerCase();if(a.indexOf("safari")>-1&&a.indexOf("version")>-1&&(a.indexOf("iphone")>-1||a.indexOf("ipad")>-1||a.indexOf("itouch")>-1)){window.open(c,"_top")}}});
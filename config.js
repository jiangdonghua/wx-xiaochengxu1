/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

// var host = "apitest.ipaotui.com"
var host = "api.ipaotui.com"
const debug = wx.getStorageSync('debug')
if(debug) {
    host = "apitest.ipaotui.com"
}

var config = {

    // 下面的地址配合云端 Server 工作
    host

};

module.exports = config
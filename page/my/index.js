// page/my/index.js
var App = getApp();

Page({
  data: {
    userInfo: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    const that = this
    wx.showNavigationBarLoading()
    App.getUserInfo(function (err, userInfo) {
      wx.hideNavigationBarLoading()
      if (err) {
        return false
      }
      that.setData({
        userInfo
      })
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onShareAppMessage() {
    return {
      title: '爱跑腿-个人信息',
      path: '/page/my/index'
    }
  }
})
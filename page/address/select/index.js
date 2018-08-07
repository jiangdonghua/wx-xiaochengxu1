// page/address/select/index.js
import {getPrevPage, getAddress} from '../../../assets/libs/utils'
Page({
  data: {
    addressList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      selectedIndex: options.index
    }),
    this.opts = options
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.loadAddressList()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  loadAddressList() {
    const addressList = wx.getStorageSync('addressList') || []
    this.setData({
      addressList
    })
  },
  selectAddress(e) {
    const index = e.detail.value
    const page = getPrevPage()
    page.setData({
      [this.opts.from]: getAddress(index),
      [`${this.opts.from}Index`]: index
    })
    wx.navigateBack()  
  },
})
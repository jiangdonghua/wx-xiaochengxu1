// page/address/list/index.js
import {getAddress, removeAddress} from '../../../assets/libs/utils'

Page({
  data: {
    addressList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
  onLongTap(e) {
    const that = this
    const index = e.currentTarget.dataset.index
    const address = getAddress(index)
    wx.showModal({
      title: '提示',
      content: `是否删除地址 ${address.address_name} ${address.detail}`,
      confirmText: '删除',
      success: function(res) {
        if(res.confirm) {
          removeAddress(index)
          that.loadAddressList()
        }
      }
    })
  }
})
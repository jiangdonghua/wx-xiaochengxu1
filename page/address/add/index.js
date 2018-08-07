// page/address/address/add/index

import WxValidate from '../../../assets/libs/WxValidate'
import { alert, reverseGeocoder, getAddress } from '../../../assets/libs/utils'
const App = getApp()

Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.initValidate()
    this.initData(options.id)

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          }, 
          address_name: res.name,
        })
      }
    })
  },
  formSubmit: function (e) {
    this.setData({
      loading: true
    })
    const params = e.detail.value
    const that = this

    if (!this.wxValidate.checkForm(e)) {
      const error = this.wxValidate.errorList[0]
      that.setData({
        loading: false
      })
      return alert(error.msg)
    }
    const {location , address_name} = this.data
    if (!location || !address_name) {
      that.setData({
        loading: false
      })
      return alert('请选取联系地址')
    }
    reverseGeocoder({
      location,
      success: function (address) { 
        var address = Object.assign(address, {
          address_name, location
        }, params)
        var addressList = wx.getStorageSync('addressList') || []
        if (that.data.id) {
          addressList[that.data.id] = address
        } else {
          addressList.push(address)
        }
        wx.setStorageSync('addressList', addressList)
        wx.navigateBack()
      },
      complete: function (res) {
        that.setData({
          loading: false
        })
      }
    })
  },
  initValidate() {
    this.wxValidate = new WxValidate({
      name: {
        required: true,
      },
      phone: {
        required: true,
        tel: true,
      }
    }, {
        name: {
          required: '请输入联系人姓名',
        },
        phone: {
          required: '请输入手机号',
        },
      })
  },
  initData(id) {
    const that = this
    if (id) {
      const address = getAddress(id)
      if (address) {
        var {
          name, phone, detail, location, address_name
        } = address
        this.setData({
          name, phone, detail,
          address_name, location,
          id
        })
      }
      wx.setNavigationBarTitle({
        title: '修改地址'
      })
    } else {
      App.getUserInfo(function (err, userInfo) {
        if (err) {
          return alert(err)
        } else {
          that.setData({
            name: userInfo.nickName,
            phone: userInfo.bound_phone,
          })
        }
      })
    }
  },
})
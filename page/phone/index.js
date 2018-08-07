// page/phone/index.js
import WxValidate from '../../assets/libs/WxValidate'
import { alert } from '../../assets/libs/utils'
import { getCode, verify } from '../../assets/libs/apis'
const App = getApp()
Page({
  data: {
    countDown: 0,
    codeLabel: '获取验证码',
    phone: '',
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.initValidate()
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
    clearInterval(this.timer)
  },
  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  initValidate() {
    this.wxValidate = new WxValidate({
      phone: {
        required: true,
        tel: true,
      },
      code: {
        required: true,
      },
    }, {
        phone: {
          required: '请输入手机号',
        },
        code: {
          required: '请输入验证码',
        },
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
    verify({
      phone: params.phone,
      code: params.code,
      success(data) {
        App.globalData.userInfo = Object.assign(App.globalData.userInfo, data)
        wx.navigateBack()
      },
      complete() {
        that.setData({
          loading: false
        })
      }
    })
  },
  bindCode: function (e) {
    if (this.data.countDown > 0) {
      return;
    }

    if (!this.data.phone) {
      alert('请输入手机号')
      return;
    }
    if (!/^1[34578]\d{9}$/.test(this.data.phone)) {
      alert('请输入11位手机号码')
      return;
    }

    this.setData({
      countDown: 5
    })
    const that = this
    that.timer = setInterval(function () {
      let countDown = that.data.countDown - 1
      that.setData({
        countDown
      })
      if (countDown <= 0) {
        clearInterval(that.timer)
        that.setData({
          codeLabel: '重新获取验证码'
        })
      }
    }, 1000)
    getCode({
      phone: this.data.phone,
    })
  },
})
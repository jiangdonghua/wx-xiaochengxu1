// page/send/send.js
import WxValidate from '../../assets/libs/WxValidate'
import { getCurrentAddress, alert, coordFormat } from '../../assets/libs/utils'
import { getPriceCalc, addOrder, requestPayment } from '../../assets/libs/apis'

Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.initAddress()
    this.initValidate()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.calcPriceIfNeed()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getAddressInfo(index) {
    const addressList = wx.getStorageSync('addressList') || []
    return addressList[index]
  },
  calcPriceIfNeed() {
    const fromAddress = this.data.fromAddress,
      toAddress = this.data.toAddress,
      that = this
    if (fromAddress && toAddress) {
      that.setData({
        loading: true
      })
      getPriceCalc({
        fromAddress, toAddress,
        success: function (data) {
          that.setData({
            priceInfo: data,
            loading: false,
          })
        }
      })
    }

  },
  formSubmit(e) {
    const that = this

    this.setData({
      loading: true
    })
    if (!this.wxValidate.checkForm(e)) {
      const error = this.wxValidate.errorList[0]
      that.setData({
        loading: false
      })
      return alert(error.msg)
    }
    const {
      info,
      fromAddress, toAddress,
      priceInfo
    } = that.data
    if (!info) {
      this.setData({
        loading: false
      })
      return alert('请选取物品信息')
    }
    if (!fromAddress) {
      this.setData({
        loading: false
      })
      return alert('请选取发货地址')
    }
    if (!toAddress) {
      this.setData({
        loading: false
      })
      return alert('请选取收货地址')
    }
    if (!priceInfo) {
      this.setData({
        loading: false
      })
      return alert('价格计算中, 请耐心等待')
    }
    const params = e.detail.value
    addOrder({
      data: Object.assign({
        errands_price: priceInfo.price,
        good_info: info,
        start_city: fromAddress.city_id,
        start_address: [fromAddress.address_name, fromAddress.detail].join(' ').trim(),
        start_location: coordFormat(fromAddress.location),
        end_city: toAddress.city_id,
        end_address: [toAddress.address_name, toAddress.detail].join(' ').trim(),
        end_location: coordFormat(toAddress.location),
        district_name: fromAddress.district,
      }, params),
      success(data) {
        requestPayment({
          order_id: data.order_id,
          success(res) {
          },
          fail(res) {
          },
          complete(res) {
            that.setData({
              loading: false
            })
            var msg;
            if (res.errMsg == 'requestPayment:ok') {
              msg = '微信支付成功'
            } else if (res.errMsg == 'requestPayment:fail cancel') {
              msg = '微信支付已取消'
            } else {
              msg = '微信支付出错'
            }
            alert(msg, function () {
              wx.navigateTo({
                url: `/page/order/show/index?id=${data.order_id}`
              })
            })
          }
        })
      },
      error() {
        that.setData({
          loading: false
        })
      },
    })
  },
  initAddress() {
    var that = this
    getCurrentAddress({
      success(address) {
        var {fromAddress} = that.data
        if (!fromAddress) {
          that.setData({
            fromAddress: address
          })
          that.calcPriceIfNeed()
        }
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '爱跑腿-代我送',
      path: '/page/send/index'
    }
  },
  initValidate() {
    this.wxValidate = new WxValidate({
      send_finish_key_phones: {
        tel: true,
      }, 
    }, {
      send_finish_key_phones: {
        tel: '请输入有效收货人手机号'
      }
    })
  },
})
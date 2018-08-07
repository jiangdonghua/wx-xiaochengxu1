// page/buy/index.js
import WxValidate from '../../assets/libs/WxValidate'
import { getCurrentAddress, alert, coordFormat } from '../../assets/libs/utils'
import {
  getBuyPriceCalc, getPriceCan,
  addOrderBuy, requestPayment
} from '../../assets/libs/apis'


Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
      this.good_info=options.info||''
      this.setData({
          good_info:this.good_info
      })
    this.initValidate()
    this.initAddress()
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
  calcPriceIfNeed() {
    const {toAddress, buyAddress} = this.data
    console.log(this.data)
    const that = this
    if (buyAddress && toAddress) {
      that.setData({
        loading: true
      })
      getBuyPriceCalc({
        fromAddress: buyAddress,
        toAddress,
        success: function (data) {
          console.log(data)
          that.setData({
            priceInfo: data,
            loading: false,
          })
        }
      })
    } else if (toAddress) {
      const {city_id, district_id} = toAddress
      that.setData({
        loading: true
      })
      getPriceCan({
        city_id, district_id,
        success: function (data) {
          that.setData({
            priceInfo: {
              price: data.order_buy,
            },
            loading: false,
          })
        }
      })
    }

  },
  clearAddress(e) {
    console.log(e.currentTarget)
    var {name} = e.currentTarget.dataset;
    this.setData({
      [name]: null
    })
  },
  formSubmit(e) {
    const that = this

    this.setData({
      loading: true
    })

    if (!this.wxValidate.checkForm(e)) {
      const error = this.wxValidate.errorList[0]
      this.setData({
        loading: false
      })
      return alert(error.msg)
    }
    const params = e.detail.value
    var {
      buyAddress, toAddress, priceInfo
    } = this.data
    if (!toAddress) {
      this.setData({
        loading: false
      })
      return alert('请选择收获地址')
    }
    if (!priceInfo) {
      this.setData({
        loading: false
      })
      return alert('价格计算中, 请耐心等待')
    }
    var data = {}
    if (buyAddress) {
      data = Object.assign(data, {
        specified_city: buyAddress.city_id,
        specified_address: [buyAddress.address_name, buyAddress.detail].join(' ').trim(),
        specified_location: coordFormat(buyAddress.location),
      })
    }
    addOrderBuy({
      data: Object.assign({
        errands_price: priceInfo.price,
        city: toAddress.city_id,
        address: [toAddress.address_name, toAddress.detail].join(' ').trim(),
        location: coordFormat(toAddress.location),
        district_name: toAddress.district,
      }, data, params),
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
  initValidate() {
    this.wxValidate = new WxValidate({
      good_info: {
        required: true,
      },
    }, {
        good_info: {
          required: '请输入商品名称',
        },
      })
  },
  initAddress() {
    var that = this
    getCurrentAddress({
      success(address) {
        var {toAddress} = that.data
        if (!toAddress) {
          that.setData({
            toAddress: address
          })
          that.calcPriceIfNeed()
        }
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '爱跑腿-代我买',
      path: '/page/buy/index'
    }
  }
})
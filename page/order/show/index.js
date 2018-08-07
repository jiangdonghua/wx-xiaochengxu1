// page/order/show/index.js
import {
  datetimeFormat, confirm, alert,
  showLoading, hideLoading,
} from '../../../assets/libs/utils'
import {
  getOrderInfo,
  cancelOrder, giveupOrder,
  agreeGiveupOrder, disagreeGiveupOrder,
  finishOrder,
  requestPayment,
} from '../../../assets/libs/apis'
import {
  STATUS, STATUS_GIVEUP,
  START_LABEL, TYPE_LABEL, TYPE
} from '../list/constant'

Page({
  data: {
    orderInfo: {},
    STATUS, START_LABEL, TYPE
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.order_id = options.id || '5882'
    this.loadData()
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
  onPullDownRefresh: function () {
    this.loadData(function () {
      wx.stopPullDownRefresh()
    })
  },
  loadData(callback) {
    const that = this,
      order_id = this.order_id
    getOrderInfo({
      order_id,
      success(data) {
        data.add_time_format = datetimeFormat(data.add_time)
        data.status_label = data.state == '5' ? STATUS_GIVEUP[data.giveup] : STATUS[data.state]
        data.type_label = TYPE_LABEL[data.type]
        that.setData({
          orderInfo: data
        })
      },
      complete: callback
    })
  },
  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone,
      success: function (res) {
        // success
      }
    })
  },
  onCancel(e) {
    const order_id = this.order_id,
      that = this
    confirm({
      content: '您是否确定取消订单?',
      confirmText: '确认取消',
      ok() {
        cancelOrder({
          order_id,
          success(data) {
            that.loadData()
          }
        })
      }
    })
  },
  onGiveup(e) {
    const order_id = this.order_id,
      that = this
    confirm({
      content: '您是否确定放弃订单?',
      confirmText: '确认放弃',
      ok() {
        giveupOrder({
          order_id,
          success(data) {
            that.loadData()
          }
        })
      }
    })
  },
  onDisagree(e) {
    const order_id = this.order_id,
      that = this
    confirm({
      content: '您是否确定不同意放弃订单?',
      confirmText: '不同意',
      ok() {
        disagreeGiveupOrder({
          order_id,
          success(data) {
            that.loadData()
          }
        })
      }
    })
  },
  onAgree(e) {
    const order_id = this.order_id,
      that = this
    confirm({
      content: '您是否确定同意放弃订单?',
      confirmText: '同意',
      ok() {
        agreeGiveupOrder({
          order_id,
          success(data) {
            that.loadData()
          }
        })
      }
    })
  },
  onFinish(e) {
    const order_id = this.order_id,
      that = this
    confirm({
      content: '您是否确定完成订单?',
      confirmText: '确定完成',
      ok() {
        finishOrder({
          order_id,
          success(data) {
            that.loadData()
          }
        })
      }
    })
  },
  onPay(e) {
    const order_id = this.order_id,
      that = this

    if (that.data.paying) {
      return;
    }
    that.setData({
      paying: true,
    })
    requestPayment({
      order_id,
      success(res) {
        alert('微信支付成功')
        that.loadData()
      },
      fail(res) {
        if (res.errMsg == 'requestPayment:fail cancel') {
          alert('微信支付已取消')
        } else {
          alert('微信支付出错')
        }
      },
      complete() {
        that.setData({
          paying: false,
        })
      }
    })
  },
})
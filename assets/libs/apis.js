import {
    fetch,
    showLoading, hideLoading,
    coordFormat, confirm
} from './utils'

// 代我送计算价格
export function getPriceCalc(options) {
    const {
        fromAddress, toAddress, success
    } = options
    getApp().getUserInfo(function (err, userInfo) {
      console.log(err)
        if (err) {
            return alert(err)
        }
        fetch({
            url: "index.php?m=Api&c=Common&a=getPriceCalc",
            data: {
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                start_city: fromAddress.city_id,
                start_location: coordFormat(fromAddress.location),
                end_city: toAddress.city_id,
                end_location: coordFormat(toAddress.location),
                district_id: fromAddress.district_id,
                district_name: fromAddress.district
            },
            success: function (data) {
                success && success(data)
            }
        })
    })
}

// 代我买计算价格
export function getBuyPriceCalc(options) {
    const {
        fromAddress, toAddress, success
    } = options
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        fetch({
            url: "index.php?m=Api&c=Common&a=getBuyPriceCalc",
            data: {
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                start_city: fromAddress.city_id,
                start_location: coordFormat(fromAddress.location),
                end_city: toAddress.city_id,
                end_location: coordFormat(toAddress.location),
                district_id: fromAddress.district_id,
                district_name: fromAddress.district
            },
            success: function (data) {
                success && success(data)
            }
        })
    })
}

// 获取代我买价格
export function getPriceCan(options) {
    const {
        city_id, district_id,
        success
    } = options
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        fetch({
            url: "index.php?m=Api&c=Common&a=getPriceCan",
            data: {
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                city_id, district_id
            },
            success: function (data) {
                success && success(data)
            }
        })
    })
}

// 获取验证码
export function getCode(options) {
    const {
        phone, success
    } = options
    fetch({
        url: "index.php?m=Api&c=Common&a=checkMSG",
        data: {
            phone,
            key: 'fast_login'
        },
        success: function (data) {
            success && success(data)
        }
    })
}

// 登录
export function login(options) {
    const {
        code, success
    } = options
    fetch({
        url: "index.php?m=Api&c=WeixinMini&a=login",
        data: {
            code,
            session_3rd: wx.getStorageSync('session_3rd'),
        },
        success(data) {
            success && success(data)
        }
    })
}

// 验证手机
export function verify(options) {
    const {
        phone, code, success, complete
    } = options
    const App = getApp()
    App.getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err);
        }
        fetch({
            url: "index.php?m=Api&c=WeixinMini&a=verify",
            data: {
                phone,
                code,
                openid: userInfo.openid
            },
            success(data) {
                success && success(data)
            },
            complete() {
                complete && complete()
            }
        })
    })
}

// 加载订单
export function getReleaseList(options) {
    const {
        last_id, success
    } = options;
    showLoading()
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        fetch({
            url: 'index.php?m=Api&c=Order&a=getReleaseList',
            data: {
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                last_id
            },
            success(data) {
                success && success(data)
            },
            complete() {
                hideLoading()
            }
        })
    })

}

// 订单详情
export function getOrderInfo(options) {
    const {
        order_id, success, complete
    } = options
    showLoading()
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        fetch({
            url: 'index.php?m=Api&c=Order&a=getOrderInfo',
            data: {
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                order_id
            },
            success(data) {
                hideLoading()
                success && success(data)
            },
            error: hideLoading,
            complete
        })
    })
}

function verifyPhone() {
    confirm({
        content: '您未验证手机, 不能下单',
        confirmText: "立即验证",
        ok() {
            wx.navigateTo({
                url: '/page/phone/index',
            })
        }
    })
}

// 代我买
export function addOrderBuy(options) {
    const {
        data, success, error, complete
    } = options
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        if (!userInfo.user_id) {
            error && error()
            return verifyPhone()
        }
        fetch({
            url: 'index.php?m=Api&c=My&a=addOrder_buy',
            data: Object.assign({
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                send_finish_key_phones: userInfo.bound_phone,
                pay_type: 0,

            }, data),
            success(data) {
                success && success(data)
            },
            error, complete
        })
    })
}
// 代我送
export function addOrder(options) {
    const {
        data, success, error, complete
    } = options
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        if (!userInfo.user_id) {
            error && error()
            return verifyPhone()
        }
        fetch({
            url: 'index.php?m=Api&c=My&a=addOrder',
            data: Object.assign({
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                send_start_phones: userInfo.bound_phone,
                pay_type: 0,
            }, data),
            success(data) {
                success && success(data)
            },
            error, complete
        })
    })
}

// 取消订单
export function cancelOrder(options) {
    const {
        order_id, success, complete
    } = options
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        fetch({
            url: 'index.php?m=Api&c=My&a=cancelOrder',
            data: {
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                order_id,
            },
            success,
            complete,
        })
    })
}
// 放弃订单
export function giveupOrder(options) {
    const {
        order_id, success, complete
    } = options
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        fetch({
            url: 'index.php?m=Api&c=My&a=giveupOrder',
            data: {
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                order_id,
            },
            success,
            complete,
        })
    })
}
// 同意放弃订单
export function agreeGiveupOrder(options) {
    const {
        order_id, success, complete
    } = options
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        fetch({
            url: 'index.php?m=Api&c=My&a=giveupOrder',
            data: {
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                order_id,
                agree: 1,
            },
            success,
            complete,
        })
    })
}
// 不同意放弃订单
export function disagreeGiveupOrder(options) {
    const {
        order_id, success, complete
    } = options
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        fetch({
            url: 'index.php?m=Api&c=My&a=giveupOrder',
            data: {
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                order_id,
                agree: 0,
            },
            success,
            complete,
        })
    })
}
// 完成订单
export function finishOrder(options) {
    const {
        order_id, success, complete
    } = options
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        fetch({
            url: 'index.php?m=Api&c=My&a=finishOrder',
            data: {
                user_id: userInfo.user_id,
                user_token: userInfo.user_token,
                order_id,
                role: 'release',
            },
            success,
            complete,
        })
    })
}

// 获取微信支付参数
export function getPayment(options) {
    const {
        order_id, success, complete
    } = options
    getApp().getUserInfo(function (err, userInfo) {
        if (err) {
            return alert(err)
        }
        fetch({
            url: 'index.php?m=Api&c=WeixinMini&a=getPayment',
            data: {
                order_id,
                openid: userInfo.openid
            },
            success,
            complete,
        })
    })
}
// 微信支付
export function requestPayment(options) {
    const {
        order_id,
        success, fail, complete,
    } = options
    getPayment({
        order_id,
        success(data) {
            wx.requestPayment(Object.assign(data, {
                success, fail, complete
            }))
        },
    })

}
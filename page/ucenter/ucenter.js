Page({
  data: {
    list: [{
      url: "order",
      img: "../../image/order.png",
      text: "我的订单"
    }, {
      url: "address",
      img: "../../image/address.png",
      text: "收获地址"
    }, {
      url: "kefu",
      img: "../../image/kefu.png",
      text: "联系客服"
    }]
  },

  getToken: function () {
    //调用登录接口
    wx.login({
      success: function (res) {
        console.log('code');
        console.log(res.code);
        wx.request({
          url: "http://yimi.com/api/v1/user/token",
          data: {
            code: res.code
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          success: function (res) {
            console.log(res.data);
            wx.setStorageSync('token', res.data.token);
          },
          fail: function (res) {
            console.log(res.data);
          }
        })
      }
    })
  }
})
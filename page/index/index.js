import {Index} from 'index-model.js'

var index = new Index();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },


  onProductTap: function(event) {
    var id = index.getDataSet(event, "id");
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  _loadData: function() {
    index.getBannerData(1, (data) => {
      console.log(data);
      this.setData({
        "bannerArray": data
      });
    });
    
    //todo 学习模版
    index.getRecentProducts((data) => {
      this.setData({
        "products": data
      });
      console.log(data);
    });
  },
});

// var baseUrl = 'http://yimi.com/api/v1';
// Page({
//   onLoad: function () {
//   },


//   getToken: function () {
//     //调用登录接口
//     wx.login({
//       success: function (res) {
//         var code = res.code;
//         console.log('code');
//         console.log(code);
//         wx.request({
//           url: baseUrl + '/user/token',
//           data: {
//             code: code
//           },
//           method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
//           success: function (res) {
//             console.log(res.data);
//             wx.setStorageSync('token', res.data.token);
//           },
//           fail: function (res) {
//             console.log(res.data);
//           }
//         })
//       }
//     })
//   },

//   pay: function () {
//     var token = wx.getStorageSync('token');
//     var that = this;
//     wx.request({
//       url: baseUrl + '/order',
//       header: {
//         token: token
//       },
//       data: {
//         products:
//         [
//           {
//             product_id: 1, qty: 1
//           },
//           {
//             product_id: 2, qty: 1
//           }
//         ]
//       },
//       method: 'POST',
//       success: function (res) {
//         console.log(res.data);
//         if(res.data.pass) {
//           var orderId = res.data.order_id;
//           wx.setStorageSync('order_id', orderId)
//           that.getPreOrder(token, orderId);
//         } else {
//           console.log("订单创建失败");
//         }
//       }
//     })
//   },

//   getPreOrder: function (token, orderId) {
//     if(token) {
//       wx.request({
//         url: baseUrl + '/pay/pre_order',
//         header: {
//           token: token
//         },
//         data: {
//           id: orderId
//         },
//         method: 'POST',
//         success: function (res) {
//           var preData = res.data;
//           console.log(preData);
//           wx.requestPayment({
//             timeStamp: preData.timeStamp,
//             nonceStr: preData.nonceStr,
//             package: preData.package,
//             signType: preData.signType,
//             paySign: preData.paySign,
//             success: function(res) {
//               console.log(res.data);
//             },
//             fail: function(error) {
//               console.log(error);
//             }
//           })
//         },
//       }) 
//     }
//   },

//   getOrders: function() {
//     var token = wx.getStorageSync('token');

//     wx.request({
//       url: 'http://yimi.com/api/v1/order/by_user',
//       header: {
//         token: token
//       },
//       meethod: 'GET',
//       success: function(res) {
//         console.log(res.data);
//       }


//     })
//   }
// })

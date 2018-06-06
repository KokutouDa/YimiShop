import { Order } from './order-model.js';
import { Cart } from '../cart/cart-model.js';
import { Address } from '../../utils/address.js';
var order = new Order();
var cart = new Cart();
var address = new Address();

Page({
  data: {
    orderProducts: [],
    orderStatus: 0,
    orderStatusArr: order._orderStatusArr,
    footerStatus: order._footerStatus,
  },

  onLoad: function (option) {
    if (option.from == "cart") {
      this._fromCart(option.productsPrice);
    }
    else {
      this._fromOrder(option.orderID);
      this.data.orderID = option.orderID
    }
  },

  _fromCart: function (productsPrice) {
    var orderProducts = cart.getCartDataFromLocal(true);
    var productsPrice = parseFloat(productsPrice);

    this.setData({
      'orderProducts': orderProducts,
      'productsPrice': productsPrice,
    });

    var addressInfo = wx.getStorageSync("addressInfo");
    if (!addressInfo) {
      this.onAddressTap();
    } else {
      this.setByAddress(addressInfo);
    }
  },

  /**
   * todo clien server不一样的值有
   * product_id=>id
   */
  _fromOrder: function (orderID) {
    var that = this;
    order.getOrderByID(orderID, (data) => {
      console.log(data);
      var freight = data.freight_fee;
      var totalPrice = parseFloat(data.total_price) + freight;
      that.setData({
        "orderNum": data.order_num,
        "addressInfo": data.snap_address,
        "orderProducts": data.snap_products,
        "productsPrice": data.total_price,
        "orderStatus": data.status,
        "orderingTime": order.getStringTime(data.create_time),
        "freight": freight,
        "message": data.message,
        "totalPrice": totalPrice,
      });
    });
  },

  onAddressTap: function (event) {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var addressInfo = address.setAddress(res);
        that.setByAddress(addressInfo);
        wx.setStorageSync("addressInfo", addressInfo);
      }
    })
  },

  onPayTap: function (event) {
    if (this.data.orderStatus == 0) {
      this.firstPay();
    } else {
      this.oneMorePay();
    }
  },

  //todo 试试setStorageSync false时的会加载数据
  firstPay: function () {
    var that = this;
    order.generateOrder(this.data.orderProducts, this.data.addressInfo,
                        this.data.freight, this.data.message, (data) => {
      console.log(data);
      if (data.pass) {
        var orderID = data.order_id;
        that.execPay(orderID)
      } else {
        that._orderFailed(data);
      }
    });
  },

  oneMorePay: function () {
    order.execPay(this.data.orderID, (statusCode) => {
      console.log(statusCode);
      if (statusCode == order._paySuccess) {
        this.setData({
          "orderStatus": statusCode
        });
      }
    });
  },

  _orderFailed: function (data) {
    var products = data.productsStatus;
    var productsName = "";
    for (let i = 0; i < products.length; i++) {
      if (!products[i].haveStock) {
        productsName += products[i].name;
        if (products.length - 1 != i) {
          productsName += ", ";
        }
      }
    }
    productsName += "缺货"
    wx.showModal({
      title: '下单失败',
      content: productsName,
      showCancel: false,
    });
  },

  //todo 支付成功之后服务端没有更新orderStatus，需要尝试自己解决。wxNotify
  execPay: function (orderID) {
    var that = this;
    order.execPay(orderID, (statusCode) => {
      if (statusCode != order._payNoStock) {
        that.deleteCartProducts();
        wx.redirectTo({
          url: '/page/order/order?orderID=' + orderID + '&from=order',
        })
      }
    });
  },

  bindMessage: function (e) {
    var message = e.detail.value;
    this.setData({
      "message": message
    });
  },

  //todo 在生成订单成功后调用此方法
  deleteCartProducts: function () {
    var orderProducts = this.data.orderProducts;
    var ids = [];
    for (let i = 0; i < orderProducts.length; i++) {
      ids.push(orderProducts[i].id);
    }
    cart.deleteById(ids)
  },

  //通过地址信息更新相关数据
  setByAddress: function (addressInfo) {
    order.getFreight(addressInfo.provinceName, (delivery) => {
      var freight = delivery.price;
      console.log(this.data.productsPrice);
      var totalPrice = this.data.productsPrice + freight;
      var deliveryDesc = delivery.desc;
      this.setData({
        'addressInfo': addressInfo,
        'freight': freight,
        'totalPrice': totalPrice,
        'deliveryDesc': deliveryDesc
      });
    })
  },
});
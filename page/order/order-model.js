import { Base } from "../../utils/base.js";
import { Category } from "../../utils/category.js";

var category = new Category();

class Order extends Base {
  constructor() {
    super();
    this._freightKeyName = "freight";
    this._storageName = "newOrder";
    this._orderStatusArr = ["", "待支付", "待发货", "待收货", "已完成", "已取消"];
    this._footerStatus = {
      0: "提交订单",
      1: "付款",
      3: "确认收货"
    };
    this._payNoStock = 0;
    this._payFail = 1;
    this._paySuccess = 2;
  }

  getFreight(provinceName, callback) {
    var type = category.getStorage();
    var method = "";
    if (type == category._typeTakeOut) {
      method = category._takeOut;
    } else {
      if (this.isNear(provinceName)) {
        method = category._deliveryNear;
      } else {
        method = category._deliveryFar;
      }
    }
    var params = {
      url: "delivery/" + method,
      sCallback(data) {
        callback && callback(data);
      }
    }
    this.request(params);
  }

  isNear(provinceName) {
    var reg = provinceName.match(/(江苏|上海|浙江)*/);
    if (reg[0] != "") {
      return true;
    } else {
      return false;
    }
  }

  //生成订单
  /**
   * products: array 购买的相关产品
   * orderInfo :JSON obj  订单的其它信息
   */
  generateOrder(oProducts, orderInfo, callback) {
    var that = this;
    var params = {
      url: "order",
      type: "POST",
      data: {
        "products": that.encoderProducts(oProducts),
        "orderInfo": JSON.stringify(orderInfo),
      },
      sCallback(data) {
        callback && callback(data);
      }
    }
    this.request(params);
  }

  encoderProducts(orderProducts) {
    var data = [];
    for (var i = 0; i < orderProducts.length; i++) {
      data.push({
        "product_id": orderProducts[i].id,
        "qty": orderProducts[i].qty
      });
    }
    return data;
  }

  //中心城市细节问题
  generateAddress(res) {
    var address = {
      userName: res.userName,
      telNumber: res.telNumber,
      provinceName: res.provinceName,
      cityName: res.cityName,
      countyName: res.countyName,
      detailInfo: res.detailInfo,
    };
    return address;
  }

  execPay(orderId, callback) {
    var that = this;
    var params = {
      url: 'pay/pre_order',
      data: {
        id: orderId
      },
      type: 'POST',
      sCallback(data) {
        if (data.timeStamp) {
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function (res) {
              callback && callback(that._paySuccess)
            },
            fail: function (error) {
              callback && callback(that._payFail)
            }
          })
        } else {
          callback && callback(that._payNoStock);
        }
      }
    };
    this.request(params);
  }

  getOrderByID(orderID, callback) {
    var params = {
      url: "order/" + orderID,
      type: "GET",
      sCallback(data) {
        callback && callback(data)
      }
    };
    this.request(params)
  }

  getOrders(page, callback) {
    var params = {
      url: "order/by_user?page=" + page,
      type: "GET",
      sCallback(data) {
        callback && callback(data.data);
      }
    }
    this.request(params);
  }

  getStringTime(millisecond) {
    var date = new Date(millisecond);
    var year = date.getFullYear().toString()
    var month = (date.getMonth()+1).toString();
    var day = date.getDate().toString();
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    var orderingTime = year + "-" + month + "-" + day
     + " " + hours + ":" + minutes + ":" + seconds;
     return orderingTime;
  }
}

export { Order };
import { Order } from "../../order/order-model.js";

var order = new Order();
// order-list.js
Page({
  data: {
    currentPage: 1,
    orders: [],
    orderStatusArr: order._orderStatusArr,
    isLoadedAll: false,   
  },

  onLoad: function(event) {
    this._getOrders();
  },

  onReachBottom: function() {
    if (!this.data.isLoadedAll) {
      this.data.currentPage++;
      this._getOrders();
    }
  },

  onOrderTap: function(event) {
    var id = order.getDataSet(event, "id");
    wx.navigateTo({
      url: '/page/order/order?orderID=' + id + '&from=order',
    })
  },

  _getOrders: function() {
    order.getOrders(this.data.currentPage, data => {
      if (data.length > 0) {
        var orders = this.data.orders.concat(data);
        this.setData({
          "orders": orders,
        });
      } else {
        this.data.isLoadedAll = true;
      }
    });
  }
  
})
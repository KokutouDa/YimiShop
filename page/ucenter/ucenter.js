import { Order } from '../order/order-model.js';
import { Ucenter } from './ucenter-model.js';

var order = new Order();
var ucenter = new Ucenter();

Page({
  
  onLoad: function(event) {
    this._loadData();
  },

  _loadData() {
    ucenter.getUserInfo(data => {
      this.setData({
        "userInfo": data
      });
    });
  },

  onOrderTap: function(event) {
    wx.navigateTo({
      url: '/page/ucenter/order-list/order-list',
    })
  }
})
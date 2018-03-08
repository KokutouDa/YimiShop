import { Cart } from "./cart-model.js";
var cart = new Cart();

Page({

  data: {
    cartProducts: [],
    isAllSelected: false,
    hasOneSelected: false,
    totalPrice: 0,
  },

  onLoad: function (options) {

  },

  onShow: function (options) {
    var cartProducts = cart.getCartDataFromLocal();
    this._resetData(cartProducts);
  },

  onShoppingTap: function () {
    wx.switchTab({
      url: '/page/index/index',
    });
  },

  onProductTap: function (event) {
    //todo 导航到指定商品
  },

  //todo 可以增加到model里。
  onItemDeleteTap: function (event) {
    var cartProducts = cart.deleteItem(event);
    this.setData({
      "cartProducts": cartProducts,
      "totalPrice": cart.totalPrice(),
    });
  },

  onChangeQtyTap: function(event) {
    var cartProducts = cart.changeQty(event);
    this.setData({
      "cartProducts": cartProducts,
      "totalPrice": cart.totalPrice()
    });

  },

  onItemSelectTap: function (event) {
    var cartProducts = cart.itemSelect(event);
    this._resetData(cartProducts);
  },

  onAllSelectTap: function (event) {
    var cartProducts = cart.allSelected(this.data.isAllSelected);
    this._resetData(cartProducts);
  },

  onOrderingTap: function(event) {
    console.log(event);
  },

  _resetData: function(cartProducts) {
    this.setData({
      "cartProducts": cartProducts,
      "isAllSelected": cart.isAllSelected(),
      "hasOneSelected": cart.hasOneSelected(),
      "totalPrice": cart.totalPrice()
    });
  }
});
import { Cart } from "./cart-model.js";
import { Order } from "../order/order-model.js"
var cart = new Cart();
var order = new Order();

Page({

  data: {
    cartProducts: [],
    isAllSelected: false,
    hasOneSelected: true,
    totalPrice: 0,
  },

  onLoad: function (options) {
    
  },

  onShow: function (options) {
    var cartProducts = cart.getCartDataFromLocal();
    this._resetData(cartProducts);
  },

  onHide: function (options) {
    cart.setCartData(this.data.cartProducts);
  },

  onShoppingTap: function () {
    wx.switchTab({
      url: '/page/index/index',
    });
  },

  onProductTap: function (event) {
    var id = cart.getDataSet(event, "id");
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

  onDeleteTap: function (event) {
    var index = cart.getDataSet(event, "index");
    var id = this.data.cartProducts[index].id;
    var cartProducts = cart.deleteById(id);
    this._resetData(cartProducts);
  },

  onChangeQtyTap: function(event) {
    var index = cart.getDataSet(event, "index");
    var type = cart.getDataSet(event, "type");
    var cartProducts = cart.changeQty(index, type);
    this.setData({
      "cartProducts": cartProducts,
      "totalPrice": cart.totalPrice(),
    });

  },

  onItemSelectTap: function (event) {
    var index = cart.getDataSet(event, "index");
    var cartProducts = cart.itemSelect(index);
    this._resetData(cartProducts);
  },

  onAllSelectTap: function (event) {
    var cartProducts = cart.allSelected(this.data.isAllSelected);
    this._resetData(cartProducts);
  },

  onOrderingTap: function(event) {
    wx.navigateTo({
      url: "../order/order?totalPrice=" + this.data.totalPrice + "&from=cart",
    })
  },

  _resetData: function(cartProducts) {
    this.setData({
      "cartProducts": cartProducts,
      "isAllSelected": cart.isAllSelected(cartProducts),
      "hasOneSelected": cart.hasOneSelected(cartProducts),
      "totalPrice": cart.totalPrice(cartProducts)
    })
  },
});
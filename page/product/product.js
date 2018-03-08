import {Product} from './product-model.js';
import { Cart } from '../cart/cart-model.js';

var product = new Product();
var cart = new Cart();

Page({
  data: {
    product: [],
    currentQtyIndex: 0,
    currentTab: 0,
    detailText: ["商品详情", "产品参数", "售后保障"],
    stockArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this._loadData(options);
  },
  _loadData: function(options) {
    var id = options.id;

    product.getProductByID(id, (res) => {
      var stockArr = [];
      if(res.stock > 0) {
        for (let i = 1; i <= res.stock; i++) {
          stockArr.push(i);
        }
      } else {
        stockArr.push(0);
      }
      this.setData({
        "product": res,
        "stockArr": stockArr
      })
    })
  },

  onPickerTap: function(event) {
    this.setData({
      "currentQtyIndex": event.detail.value
    });
  },

  onTabTap: function (event) {
    var index = product.getDataSet(event, "index"); 
    this.setData({
      "currentTab": index
    });
  },

  onCartTap: function(event) {
    var product = this.parseCartData(this.data.product);
    var qty = this.data.stockArr[this.data.currentQtyIndex];
    cart.add(product, qty);
  },

  parseCartData(data) {
    var product = {};
    var keys = ["id", "name",  "img_url", "price", "stock"]
    for (var key in data) {
      if (keys.indexOf(key) >= 0) {
        product[key] = data[key];
      }
    }
    return product;
  },
});
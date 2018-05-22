import {Index} from 'index-model.js'
import { Cart } from '../cart/cart-model.js';

var index = new Index();
var cart = new Cart();

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

  _loadData: function() {
    index.getCategory((data) => {
      this.setData({
        "category": data,
        "currentID": data[0].id
      })
    });

    var length = {};
    // length["11"] = "aaa";
    // length["12"] = "bbb";
    length['11'] = 'aaa';
    length['22'] = 'bbb';
    console.log(length);
  },

  onCategoryTap: function(event) {
    var id = index.getDataSet(event, 'id');
    if (id != this.data.currentID) {
      this.setData({
        "currentID": id
      });
      index.getProductsByCategory(id, (data) => {
        console.log(data);
        this.setData({
          "products": data
        })
      });
    }
  },

  onChangeQtyTap: function(event) {
    var type = index.getDataSet(event, 'type');
    var ind = index.getDataSet(event, 'index');
    var products = this.data.products;
    var product = products[ind];
    if (type == cart.flatAdd) {
      var product = cart.add(product, 1);
      products[ind] = product;
      console.log(product);
    } else {
      var product = cart.add(product, -1);
      products[ind] = product;
    }
    this.setData({
      "products": products
    })
  }


//   onProductTap: function(event) {
//     var id = index.getDataSet(event, "id");
//     wx.navigateTo({
//       url: '../product/product?id=' + id,
//     })
//   },

//   _loadData: function() {
//     index.getBannerData(1, (data) => {
//       console.log(data);
//       this.setData({
//         "bannerArray": data
//       });
//     });
    
//     index.getRecentProducts((data) => {
//       this.setData({
//         "products": data
//       });
//       console.log(data);
//     });
//   },
});
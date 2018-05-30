import { Index } from 'index-model.js'
import { Cart } from '../cart/cart-model.js';
import { Location } from '../../utils/location.js';
import { Category } from '../../utils/category.js';
import { Order } from '../order/order-model.js';

var index = new Index();
var cart = new Cart();
var location = new Location();
var category = new Category();
var order = new Order();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "productsPrice": 0,
    "emptyCart": true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  onShow: function (options) {
    var cartProducts = cart.getCartDataFromLocal(false);
    if (JSON.stringify(this.data.cartProducts) != JSON.stringify(cartProducts)) {
      var categoryData = this.setAllCategoryNum(this.data.category, cartProducts);
      var cartNum = this.getCartNum(categoryData);
      console.log(cartProducts);
      // console.log(cartNum);
      this.setData({
        "cartProducts": cartProducts,
        "category": categoryData,
        "cartNum": cartNum
      })
    }
  },

  _loadData: function () {
    var that = this;
    index.getShopInfo(1, (data) => {
      location.getDistance(data.latitude, data.longitude, (distance) => {
        distance = distance * 1000;
        var type = "";
        var minFee = 1;
        if (data.distance - distance > 0) {
          type = category._typeTakeOut;
          minFee = data.min_takeout_fee;
        } else {
          type = category._typeDelivery;
          minFee = data.min_delivery_fee;
        }
        category.setStorage(type);

        category.getByType(type, (data) => {
          var cartProducts = cart.getCartDataFromLocal(false);
          var categoryData = that.setAllCategoryNum(data, cartProducts);
          var cartNum = that.getCartNum(categoryData);
          that.setData({
            "cartProducts": cartProducts,
            "category": categoryData,
            "cartNum": cartNum,
            "currentID": categoryData[0].id,
            "minFee": minFee,
            "productsPrice": cart.totalPrice(),
            "emptyCart": cart.isEmptyJson(cartProducts)
          });

          index.getProductsByCategory(categoryData[0].id, (data) => {
            that.setData({
              "products": data
            })
          })
        })
      });
    })
  },

  onCategoryTap: function (event) {
    var id = index.getDataSet(event, 'id');
    if (id != this.data.currentID) {
      this.setData({
        "currentID": id
      });
      index.getProductsByCategory(id, (data) => {
        this.setData({
          "products": data
        })
      });

      wx.pageScrollTo({
        scrollTop: 0,
      })
    }
  },

  onChangeQtyTap: function (event) {
    var type = index.getDataSet(event, 'type');
    var productsIndex = index.getDataSet(event, 'index');
    var product = this.data.products[productsIndex];
    var num = (type == cart.flatAdd ? 1 : -1);
    var cartProducts = cart.add(product, num);

    var category = this.setCategoryNum(this.data.currentID,
      this.data.category, num);
    var cartNum = this.data.cartNum + num;
    console.log(cartProducts);
    this.setData({
      "cartProducts": cartProducts,
      "category": category,
      "productsPrice": cart.totalPrice(),
      "cartNum": cartNum,
      "emptyCart": cart.isEmptyJson(cartProducts)
    })
  },

  onCartTap: function(event) {
    if (!this.data.emptyCart) {
      wx.navigateTo({
        url: '../cart/cart',
      })
    }
  },

  /**
  * 1.遍历 cartProducts
  * 2.每个product 的categoryID，查找category所在的index 加上 product.qty
  */
  setAllCategoryNum: function (category, cartProducts) {
    for (var i in category) {
      category[i].qty = 0;
    }
    for (var i in cartProducts) {
      var categoryID = cartProducts[i].category_id;
      category = this.setCategoryNum(categoryID, category, cartProducts[i].qty);
    }
    console.log(category);
    return category;
  },

  //购物车上显示的数量
  getCartNum: function(categoryData) {
    var num = 0;
    for (var i in categoryData) {
      if (categoryData[i].qty) {
        num += categoryData[i].qty;
      }
    }
    return num;
  },

  /**
   * num: int 添加的数量
   */
  setCategoryNum: function (categoryID, category, num) {
    var categoryIndex = index.hasArrayAttr(categoryID,
      'id', category);
    if (index != -1) {
      if (!category[categoryIndex].qty) {
        category[categoryIndex].qty = num;
      } else {
        category[categoryIndex].qty += num;
      }
    }
    return category;
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
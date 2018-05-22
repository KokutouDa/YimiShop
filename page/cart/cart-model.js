import { Base } from "../../utils/base.js";

class Cart extends Base {

  constructor() {
    super();
    this._storageKeyName = 'cart';
    this.flatAdd = "add";
    this.flatSubtract = "subtract"
  }
  
  //获取购物车产品数据，flag为true时获取选中的产品
  getCartDataFromLocal(flag) {
    var products = wx.getStorageSync(this._storageKeyName);
    if (!products) {
      products = [];
    }
    if (flag) {
      var selectedProducts = [];
      for (var i = 0; i < products.length; i++) {
        if (products[i].selectStatus) {
          selectedProducts.push(products[i]);
        }
      }
      products = selectedProducts;
    }
    return products;
  }

  setCartData(products) {
    wx.setStorageSync(this._storageKeyName, products);
  }

  //添加到购物车
  add(product, qty) {
    // var qty = arguments[1] ? arguments[1] : 1;
    var products = this.getCartDataFromLocal();
    var index = this.hasArrItem(product.id, "id", products);
    if (index == -1) {
      product.qty = qty;
      product.selectStatus = true;
      products.push(product);
    } else {
      products[index].qty += qty;
      product.qty += qty;
    }
    this.setCartData(products);
    return product;
  }


  /**
   * 判断数组中是否含有指定value，返回value所在位置。不存在时返回-1
   * value: {obj}查找值
   * key: {string} 被查找数组下json值对应的key
   * arr: {array}被查找数组
   */
  /**/
  hasArrItem(value, key, arr) {
    var index = -1;
    arr.forEach(function (item, i) {
      if (item[key] == value) {
        index = i;
      }
    });
    return index;
  }

  deleteById(ids) {
    var cartProducts = this.getCartDataFromLocal();
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    for (let i = 0; i < ids.length; i++) {
      var index = this.hasProduct(ids[i], cartProducts);
      if (index != -1) {
        cartProducts.splice(index, 1);
      }
    }
    this.setCartData(cartProducts);
    return cartProducts;
  }

  /**
   * 是否有指定 id 的 product
   * 返回的是数组当前product的位置，如果不存在，返回-1
   */
  hasProduct(id, products) {
    var index = -1;
    for (let i = 0; i < products.length; i++) {
      if (id == products[i].id) {
        index = i;
      }
    }
    return  index;
  }

  itemSelect(index) {
    var products = this.getCartDataFromLocal();
    products[index].selectStatus = !products[index].selectStatus;
    this.setCartData(products);
    return products;
  }

  allSelected(isAllSelected) {
    var products = this.getCartDataFromLocal();
    products.forEach(function (item) {
      item.selectStatus = !isAllSelected;
    });
    this.setCartData(products);
    return products;
  }

  hasOneSelected() {
    var products = this.getCartDataFromLocal();
    for (var i = 0; i < products.length; i++) {
      if (products[i].selectStatus == true) {
        return true;
      }
    }
    return false;
  }

  isAllSelected() {
    var products = this.getCartDataFromLocal();
    var isAllSelected = true;
    products.forEach(function (item) {
      if(!item.selectStatus) {
        isAllSelected = false;
      }
    });
    return isAllSelected;
  }

  changeQty(index, type) {
    var products = this.getCartDataFromLocal();
    if (type == this.flatAdd) {
      if (products[index].qty < products[index].stock) {
        products[index].qty++;
      }
    } else {
      if (products[index].qty > 1) {
        products[index].qty--;
      }
    }
    this.setCartData(products);
    return products;
  }

  totalPrice() {
    var products = this.getCartDataFromLocal();
    var totalPrice = 0;
    products.forEach(function (item) {
      if (item.selectStatus) {
        totalPrice += item.price * 100 * item.qty;
      }
    });
    return totalPrice / 100;
  }
}

export { Cart };
import { Base } from "../../utils/base.js";

class Cart extends Base {

  constructor() {
    super();
    this._storageKeyName = 'cart';
    this.flatAdd = "add";
    this.flatSubtract = "subtract"
  }

  getCartDataFromLocal() {
    var products = wx.getStorageSync(this._storageKeyName);
    if (!products) {
      products = [];
    }
    return products;
  }

  setCartData(products) {
    wx.setStorageSync(this._storageKeyName, products);
  }

  //添加到购物车
  add(product, qty) {
    var products = this.getCartDataFromLocal();
    var exist = false;
    var index = this.hasArrItem(product.id, "id", products);
    if (index == -1) {
      product.qty = qty;
      product.selectStatus = true;
      products.push(product);
    } else {
      products[index].qty += qty;
    }
    this.setCartData(products);
    return products;
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

  deleteItem(event) {
    var index = this.getDataSet(event, "index");
    var products = this.getCartDataFromLocal();
    products.splice(index, 1);
    this.setCartData(products);
    return products;
  }

  itemSelect(event) {
    var index = this.getDataSet(event, "index");
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
    this.setCartData(products);
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
    this.setCartData(products);
    return isAllSelected;
  }

  changeQty(event) {
    var products = this.getCartDataFromLocal();
    var index = this.getDataSet(event, "index");
    var type = this.getDataSet(event, "type");
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
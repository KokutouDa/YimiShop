import { Base } from "../../utils/base.js";

class Cart extends Base {

  constructor() {
    super();
    this._storageKey = 'cart';
    this.flatAdd = "add";
    this.flatSubtract = "subtract"
  }
  
  //获取购物车产品数据，flag为true时获取选中的产品
  getCartDataFromLocal(flag) {
    var products = wx.getStorageSync(this._storageKey);
    if (!products) {
      products = {};
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
    wx.setStorageSync(this._storageKey, products);
  }

  //添加到购物车
  add(product, qty) {
    var products = this.getCartDataFromLocal();
    var id = product.id;
    
    var isHas = this.haveJsonKey(products, product.id);
    if (!isHas) {
      product.qty = qty;
      product.selectStatus = true;
      products[id] = product;
    } else {
      if (!(products[id].qty <= 0 && qty < 0)) {
        products[id].qty += qty;
      }
    }
    if (products[id].qty == 0) {
      delete products[id];
    }
    this.setCartData(products);
    return products;
  }

  //查找value里是否有指定key
  haveJsonKey(value, key) {
    for (var i in value) {
      if (key == i) {
        return true;
      }
    }
    return false;
  }

  deleteById(ids) {
    var cartProducts = this.getCartDataFromLocal();
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    for (let i = 0; i < ids.length; i++) {
      var id = ids[i];
      delete cartProducts[id];
    }
    this.setCartData(cartProducts);
    return cartProducts;
  }

  /**
   * 是否有指定 id 的 product
   * 返回的是数组当前product的位置，如果不存在，返回-1
   */
  // hasProduct(id, products) {
  //   var index = -1;
  //   for (let i = 0; i < products.length; i++) {
  //     if (id == products[i].id) {
  //       index = i;
  //     }
  //   }
  //   return  index;
  // }

  itemSelect(index) {
    var products = this.getCartDataFromLocal();
    products[index].selectStatus = !products[index].selectStatus;
    this.setCartData(products);
    return products;
  }

  allSelected(isAllSelected) {
    var products = this.getCartDataFromLocal();
    for (var i in products) {
      products[i].selectStatus = !isAllSelected;
    }
    this.setCartData(products);
    return products;
  }

  hasOneSelected() {
    var products = this.getCartDataFromLocal();
    for (var i in products) {
      var product = products[i];
      if (product.selectStatus == true) {
        return true;
      }
    }
    return false;
  }

  isAllSelected() {
    var products = this.getCartDataFromLocal();
    for (var i in products) {
      var product = products[i];
      if (!product.selectStatus) {
        return false;
      }
    }
    return true;
  }

  //购物车内修改数量
  changeQty(index, type) {
    var products = this.getCartDataFromLocal();
    console.log(index);
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

  productsPrice() {
    var products = this.getCartDataFromLocal();
    var productsPrice = 0;
    for (var i in products) {
      var product = products[i];
      if (product.selectStatus) {
        productsPrice += product.price * 100 * product.qty;
      }
    }
    return productsPrice / 100;
  }

  isEmpty() {
    var products = this.getCartDataFromLocal();
    return this.isEmptyJson(products);
  }

  //todo old delete
  isEmptyJson(json) {
    var products = this.getCartDataFromLocal();
    for (var i in json) {
      return false;
    }
    return true;
  }
}

export { Cart };
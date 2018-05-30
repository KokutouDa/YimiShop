import { Base } from '../../utils/base.js'


class Index extends Base {
  constructor() {
    super();
  }

  getShopInfo(id, callback) {
    var params = {
      url: 'shopinfo/' + id,
      sCallback(data) {
        callback && callback(data);
      }
    }
    this.request(params);
  }

  getProductsByCategory(id, callback) {
    var params = {
      url: 'category/' + id,
      sCallback(data) {
        callback && callback(data);
      }
    }
    this.request(params);
  }

  /**
   * 判断数组中是否含有指定value，返回value所在位置。不存在时返回-1
   * value: {obj}查找值
   * key: {string} 被查找数组下json值对应的key
   * arr: {array}被查找数组
   */
  hasArrayAttr(value, key, arr) {
    var index = -1;
    arr.forEach(function (item, i) {
      if (item[key] == value) {
        index = i;
      }
    });
    return index;
  }

  // /**
  //  * 获取轮播数据
  //  */
  // getBannerData(id, callback) {
  //   var params = {
  //     url: "banner/" + id,
  //     type: 'GET',
  //     sCallback(data) {
  //       callback&&callback(data.banner_items);
  //     }
  //   };
  //   this.request(params);
  // }

  // /**
  //  * 获取最近新品
  //  */
  // getRecentProducts(callback) {
  //   var params = {
  //     url: "product/recent",
  //     type: "GET",
  //     sCallback(data) {
  //       callback && callback(data);
  //     }
  //   };
  //   this.request(params);
  // }
}

export { Index };
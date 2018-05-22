import {Base} from '../../utils/base.js'


class Index extends Base{
  constructor() {
    super();
  }

  getCategory(callback) {
    var params = {
      url: "category",
      sCallback(data) {
        callback && callback(data);
      }
    }
    this.request(params)
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

export {Index};
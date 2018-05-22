import { Base } from './base.js';
import { Config } from './config.js';

class Address extends Base {
  constructor() {
    super();
  }

  setAddress(res) {
    var provinceName = this.parseProvinceName(res.provinceName);
    var completeAddress = provinceName + " " + 
      res.cityName + " " + res.countyName + " " + res.detailInfo
    var address = {
      userName: res.userName,
      telNumber: res.telNumber,
      provinceName: res.provinceName,
      completeAddress: completeAddress
    }
    return address;
  }

  parseProvinceName(res) {
    if ((res.substr(res.length - 1, res.length)) == '市') {
      res = res.substr(0, res.length - 1);
    };
    return res;
  }
}

export { Address };
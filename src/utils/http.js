import axios from 'axios';

// import {config} from 'src/utils/config';
import { Message } from 'iview';
// axios.defaults.withCredentials = true;
axios.defaults.timeout = 100000;
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
axios.defaults.validateStatus = function(status) {
  return status >= 200 && status < 599; // default
};

var fnComplete;
var source;
// import { router } from '../main';

import router from '../router/index';

console.log(router);

export class HttpMiddleware {
  constructor(fn) {
    let self = this;
    function resolve(url, res) {
      let data = res.data;
      !!self.fnComplete && self.fnComplete(res);
      if (res.status >= 400) {
        Message.error(res.data);
      }

      if (res.status === 401) {
        localStorage.clear();
        Message.error(res.data);
        // window.location.href = '/login';
        // window.location.reload();
        return;
      }

      // if(res.data.SubErrCode === 'Authentication_TokenExpired'){
      //   localStorage.clear();
      //   Message.error(res.data.SubErrMsg);
      //   router.replace('/login');
      //   return
      // }
      // if(res.data.SubErrCode === 'Authorization_SessionExpired'){
      //   localStorage.clear();
      //   Message.error(res.data.SubErrMsg);
      //   router.replace('/login');
      //   return
      // }
      // if(res.data.SubErrCode === 'Authorization_SessionInvalid'){
      //   localStorage.clear();
      //   Message.error(res.data.SubErrMsg);
      //   router.replace('/login');
      //   return
      // }
      // if(res.data.SubErrCode === 'Authentication_Missing'){
      //   localStorage.clear();
      //   Message.error(res.data.SubErrMsg);
      //   router.replace('/login');
      //   return
      // }
      // if(res.data.ErrMsg){
      //   Message.error(res.data.ErrMsg);
      //   return
      // }
      // if(res.data.SubErrMsg){
      //   Message.error(res.data.SubErrMsg);
      //   return
      // }
    }
    function reject(url, error) {
      // console.log(Message)

      console.error('request error: \n' + 'url: ' + url, error);
    }
    function abort(source) {
      self.source = source;
    }
    return fn(resolve, reject, abort);
  }
  then(done) {
    this.fnComplete = done;
    return this;
  }
  abort() {
    let source = this.source;
    source.cancel('API is aborted.');
    return this;
  }
}

const BASE_URL = process.env.VUE_APP_REQUEST_URL;
const appId = process.env.VUE_APP_APPID;
const appSecret = process.env.VUE_APP_APPSECRECT;
const scope = process.env.VUE_APP_SCOPE;
const terminal = process.env.VUE_APP_TERMINAL;
class Http {
  constructor() {
    this.vue = {};
    this.request = function(opt) {
      return new HttpMiddleware((resolve, reject, abort) => {
        let CancelToken = axios.CancelToken;
        let source = CancelToken.source();

        if (!opt.url.match('http')) {
          opt.url = BASE_URL + opt.url;
        }

        opt.headers = {
          appId: appId,
          appSecret: appSecret,
          scope: scope,
          terminal: terminal,
        };
        if (window.returnCitySN) {
          opt.headers.ipAddress = window.returnCitySN.cip;
        }
        if (localStorage.token) {
          opt.headers.Authorization = 'Bearer ' + localStorage.token;
        }
        opt.headers.terminal = 'Merchant';
        axios
          .request({ cancelToken: source.token, ...opt })
          .then(res => {
            if (this.vue.loading) {
              this.vue.loading = false;
            }

            if (this.vue.btnLoading) {
              this.vue.btnLoading = false;
            }
            resolve(opt.url, res);
          })
          .catch(error => {
            // Message.error("系统错误！");
            Message.error(error.toString());
            if (this.vue.loading) {
              this.vue.loading = false;
            }

            if (this.vue.btnLoading) {
              this.vue.btnLoading = false;
            }
            Message.error(error.toString());
            reject(opt.url, error);
          });

        abort(source);
      });
    };
  }
  get(url, params = {}, cb, config) {
    this.cb = cb;
    let p = {};
    Object.keys(params).forEach(key => {
      if (params[key] || params[key] === false) {
        p[key] = params[key];
      }
    });
    return this.request({
      method: 'get',
      url: url,
      params: p,
      ...config,
    });
  }
  post(url, data, vue, config) {
    this.vue = vue || {};
    return this.request({
      method: 'post',
      url: url,
      data: data,
      ...config,
    });
  }
  put(url, data, vue, config) {
    this.vue = vue || {};
    return this.request({
      method: 'put',
      url: url,
      data: data,
      ...config,
    });
  }
  patch(url, data, vue, config) {
    this.vue = vue || {};
    return this.request({
      method: 'patch',
      url: url,
      data: data,
      ...config,
    });
  }
  delete(url, params = {}, vue, config) {
    this.vue = vue || {};
    return this.request({
      method: 'delete',
      url: url,
      params: params,
      ...config,
    });
  }
  delete_in_body(url, data, vue, config) {
    this.vue = vue || {};
    return this.request({
      method: 'delete',
      url: url,
      data: data,
      ...config,
    });
  }
}

export const API = new Http();

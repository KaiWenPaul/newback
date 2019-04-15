import axios from 'axios'
import qs from 'qs'

// axios.interceptors.request.use(config => {
//   return config
// }, error => {
//   return Promise.resolve(error.response)
// })
// axios.defaults.timeout =  1000;
// axios.interceptors.response.use(response => {
//   return response
// }, error => {
//   return Promise.resolve(error.response)
// })
// 超时设置，一般后台处理慢，前台超时报错
// axios.defaults.retry = 50;
// axios.defaults.retryDelay = 1000;
 
// //在API文件中
// axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
//     var config = err.config;
//     // If config does not exist or the retry option is not set, reject
//     if(!config || !config.retry) return Promise.reject(err);
    
//     // Set the variable for keeping track of the retry count
//     config.__retryCount = config.__retryCount || 0;
    
//     // Check if we've maxed out the total number of retries
//     if(config.__retryCount >= config.retry) {
//         // Reject with the error
//         return Promise.reject(err);
//     }
    
//     // Increase the retry count
//     config.__retryCount += 1;
    
//     // Create new promise to handle exponential backoff
//     var backoff = new Promise(function(resolve) {
//         setTimeout(function() {
//             resolve();
//         }, config.retryDelay || 1);
//     });
    
//     // Return the promise in which recalls axios to retry the request
//     return backoff.then(function() {
//         return axios(config);
//     });
// });

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response.data
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  if(response){
    if(response.data){
      return {
        status: -404,
        msg: '网络异常',
        error:response.data.error,
      }
    }
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常',
    error: '未知异常',
  }
}

// hy add 暂不适用
function checkStatusu (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    var res = response.data; 
    if (res.status == "ok") {
      return res;
    }else if(res.status == "error") {
      return {
        status: -404,
        msg: res.error
      }
    }else if(res.status == "pending"){
      return {
        status: -404,
        msg: "登录状态失效，请重新登录"
      }
    }
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
   
  }
  if (res.data && (!res.data.success)) {
  }
  return res
}

export default {
  post (url, data ,baseURL='http://47.99.133.23:8080/sw/') {
    return axios({
      method: 'post',
      baseURL: baseURL,
      // baseURL='http://47.99.133.23:8080/sw/'
      // baseURL= 'http://47.99.133.23:8089/erp/',
      // baseURL='https://www.valubio.com/'
      url,
      data: qs.stringify(data),
      timeout: 10000,
      headers: {
        'Content-Type': 'multipart/form-data; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get (url, params) {
    return axios({
      method: 'get',
      baseURL: 'static/json',
      url,
      params, // get 请求时带的参数
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
        //  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  postAjax(url, data, suc) {
    return  $.ajax({
      url: url,
      type: 'POST',
      data: data,
      async:false, //或false,是否异步
      dataType: 'json',
      success: function (res) {   
              suc(res);
      },
      error: function () {
          alert('网络异常,请稍后再试');
      }
  });
  },
 
  // hy add
  postu (url, data,baseURL='http://47.99.133.23:8080/sw/') { // http://47.99.133.23:8089/erp/
    // data.account_name = window.sessionStorage.getItem('account_name');
    // data.token =localStorage.getItem('token');
    return axios({
      method: 'post',
      baseURL: baseURL,
      url,
      data:qs.stringify(data),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}

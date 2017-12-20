/**
 * Created by Administrator on 2017/9/24.
 */
import originJSONP from 'jsonp'

/**
 * 封装的jsonp方法
 * @param url     请求的url
 * @param data    请求的在参数
 * @param option  选项
 */
export default  function jsonp(url,data,option){
  url += (url.indexOf('?')<0 ? '?' : '&') + param(data)
  //resolve:代表请求成功,调用resolve
  //reject:代表请求失败,调用reject
  return new Promise((resolve,reject)=>{
     originJSONP(url,option,(err,data)=>{
      if(!err){//err不是null时候是成功
        resolve(data)
      }else{
        reject(err)
      }
    })
  });
}

/**
 * 封装参数,传入的是json参数格式
 * @param data
 * @returns {string}
 */
function param(data){
  let url = ''
  //k就是json的参数名,data[k]就是参数的值
  for(var k in data){
    let value = data[k] != undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }

  return url ? url.substring(1) : ''
}



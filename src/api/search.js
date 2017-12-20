/**
 * Created by Administrator on 2017/11/7.
 */
import jsonp from 'common/js/jsonp'
import {commonParams,options,disc_options} from './config'

export function getHotSearch(){
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({},commonParams,{
    needNewCode:'1',
    notice:0,
    uin:0,
    g_tk:5381,
    platform:'yqq',
  })

  return jsonp(url,data,options);
}

export function search(query,page,zhida){
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({},commonParams,{
    g_tk:5381,
    uin:0,
    notice:0,
    platform:'yqq',
    needNewCode:1,
    w:query,
    zhidaqu:1,
    catZhida:zhida?1:0,
    t:0,
    flag:1,
    ie:'utf-8',
    sem:1,
    aggr:0,
    perpage:20,
    n:20,
    p:page,
    remoteplace:'txt.mqq.all',
    uid:0
  })

  return jsonp(url,data,options);
}

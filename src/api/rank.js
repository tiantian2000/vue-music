/**
 * Created by Administrator on 2017/10/26.
 */
import jsonp from 'common/js/jsonp'
import {commonParams,options,disc_options} from './config'

export function getRankList(){
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({},commonParams,{
    needNewCode:'1',
    notice:0,
    uin:0,
    g_tk:5381,
    platform:'yqq',
  })

  return jsonp(url,data,options);
}

export function getTopList(id){
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  //g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&
  // notice=0&platform=h5&needNewCode=1&tpl=3
  // &page=detail&type=top&topid=4&_=1509056957037
  const data = Object.assign({},commonParams,{
    needNewCode:'1',
    notice:0,
    uin:0,
    g_tk:5381,
    platform:'yqq',
    tpl:3,
    page:'detail',
    topid:id
  })

  return jsonp(url,data,options);
}

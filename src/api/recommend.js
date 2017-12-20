/**
 * Created by Administrator on 2017/9/25.
 */
import jsonp from 'common/js/jsonp'
import {commonParams,options,disc_options} from './config'

/**
 * 获取推荐音乐
 */
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  //合并对象,把参数2,参数3对象合并到参数1中
  const data = Object.assign({},commonParams,{
    platform : 'h5', //h5平台
    uin : 0,          //qq号,不填就是0
    needNewCode : 1   //
  })

  return jsonp(url,data,options)
}

/**
 * 获取歌单列表
 */
/*export function getDiscList(){
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const data = Object.assign({},commonParams,{
    type:1,
    json:1,
    utf8:1,
    onlysong:0,
    disstid:2069407274,
    jsonpCallback:'playlistinfoCallback',
    loginUin:0,
    hostUin:0,
    platform:'yqq',
    needNewCode:0
  })

  return jsonp(url,data,disc_options)
}*/

export function  getDiscList() {
  let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?data={"comm":{"ct":24},"recomPlaylist":{"method":"get_hot_recommend","param":{"async":1,"cmd":2},"module":"playlist.HotRecommendServer"}}';
  const data = Object.assign({},commonParams,{
    callback:'playlistinfoCallback',
    platform:'yqq',
    needNewCode:0,

  })
  return jsonp(url,data,disc_options)
}

export function getTopList(){
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
    topid:4
  })

  return jsonp(url,data,options);
}

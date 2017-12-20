/**
 * Created by Administrator on 2017/9/25.
 */
//获取QQ音乐的公共参数
export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

//选项的参数
export const options = {
  param:'jsonpCallback'
}

export const disc_options = {
  param:'jsonpCallback',
  name:'playlistinfoCallback'
}

//返回正确的值
export const ERROR_OK = 0

//播放模式
export const playMode = {
  sequence:0, //顺序播放
  loop:1,     //循环播放
  random:2    //随机播放
}

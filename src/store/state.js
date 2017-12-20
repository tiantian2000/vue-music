/**
 * Created by Administrator on 2017/9/28.
 */
import {playMode} from 'common/js/config'
import {loadSearch,loadSong} from 'common/js/cache.js'
const state = {
  singer:{},             //歌手详情
  closed:true,           //是否显示播放器
  playing:false,         //是否正在播放
  fullScreen:false,     //播放器是否展开
  currentSong:{},       //当前播放的歌曲
/*  playlist:[],          //播放的歌曲控制列表
  sequenceList:[],       //播放的歌曲顺序列表
  mode:playMode.sequence, //播放模式
  currentIndex:-1,        //当前播放的索引*/
  searchHitory:loadSearch(),  //搜索历史
  songHistory:loadSong()     //歌曲历史
}

export default state

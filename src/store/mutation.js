/**
 * Created by Administrator on 2017/9/28.
 */
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state,singer){
    state.singer = singer
  },
  [types.SET_CLOSED](state,flag){
    state.closed = flag
  },
  [types.SET_PLAYING_STATE](state,flag){
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state,flag){
    state.fullScreen = flag
  },
  [types.SET_CURRENT_SONG](state,song){
    state.currentSong = song
  },
 /* [types.SET_PLAYLIST](state,list){
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state,list){
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state,mode){
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state,index){
    state.currentIndex = index
  },*/
  [types.SET_SEARCH_HISTORY](state,history){
    state.searchHitory = history
  },
  [types.SET_SONG_HISTORY](state,history){
    state.songHistory = history
  }
}

export default mutations

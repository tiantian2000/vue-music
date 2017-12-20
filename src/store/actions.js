/**
 * Created by Administrator on 2017/9/28.
 */
import * as types from './mutation-types'
import {saveSearch,saveSong,delItemSerchHistory,delItemSongHistory,delAllItemSearchHistory,delAllItemSongHistory}
from 'common/js/cache.js'
//选择播放
export const selectPlay = function({commit,state},{song}){
  commit(types.SET_CLOSED,false)
  commit(types.SET_CURRENT_SONG,song)
/*  commit(types.SET_SEQUENCE_LIST,list)
  commit(types.SET_PLAYLIST,list)
  commit(types.SET_CURRENT_INDEX,index)*/
  commit(types.SET_FULL_SCREEN,false)
  commit(types.SET_PLAYING_STATE,true)
}

//退出播放器
export const exitPlay = function({commit,state}){
  //commit(types.SET_PLAYLIST,[])
  //commit(types.SET_CURRENT_INDEX,0)
  commit(types.SET_CURRENT_SONG,{})
  commit(types.SET_CLOSED,true)
  commit(types.SET_PLAYING_STATE,false)
}

//保存搜索历史
export const saveSearchHistory = function({commit,state},{query}){
  console.log('query='+query)
  commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

//删除搜索历史中的某个元素
export const delSerchHistory = function({commit,state},{query}){
  commit(types.SET_SEARCH_HISTORY,delItemSerchHistory(query))
}

//删除所有搜索项
export const delAllSearchHistory = function({commit,state}){
  commit(types.SET_SEARCH_HISTORY,delAllItemSearchHistory())
}

//保存歌曲历史
export const saveSongHistory = function({commit,state},{query}){
  console.log(query)
  commit(types.SET_SONG_HISTORY,saveSong(query))
}

//删除搜索歌曲历史中的某个元素
export const delSongHistory = function({commit,state},{query}){
  commit(types.SET_SONG_HISTORY,delItemSongHistory(query))
}

//删除所有歌曲历史项
export const delAllSongHistory = function({commit,state}){
  commit(types.SET_SONG_HISTORY,delAllItemSongHistory())
}

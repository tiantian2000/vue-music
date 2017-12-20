/**
 * Created by Administrator on 2017/11/14.
 */
import storage from 'good-storage'

const SEARCH_KEY = '__search'
const SEARCH_MAX_LENGTH = 5

const SONG_KEY = '_song'
const SONG_MAX_LENGTH = 10

export function saveSearch(query){
  //从storage中取数据,如果没有返回空数据
  let searchs = storage.get(SEARCH_KEY,[])
  console.log(searchs)
  console.log('query='+query)
  let index = searchs.findIndex((value,index,arr)=>{
    return value===query
  })

  if(index != 0){ //如果找到的元素不是在第一个
    if(index > 0){ //查找到的数据不是在第一个
      //从把找到的元素从数组中删除
      searchs.splice(index,1)
    }
    //把查询的值保存到数组的第一个
    searchs.unshift(query)
    if(searchs.length>SEARCH_MAX_LENGTH){//如果超过了保存的最大数,则把数组的最后一个元素删除
      searchs.pop()
    }
  }

  console.log(searchs)
  //把最新的查询历史保存到storage中
  storage.set(SEARCH_KEY,searchs)
  return searchs
}

//从本地storage获取搜索历史
export function loadSearch(){
  return storage.get(SEARCH_KEY,[])
}

//从本地storage中删除给定的搜索项
export function delItemSerchHistory(query){
  //从storage中取数据,如果没有返回空数据
  let searchs = storage.get(SEARCH_KEY,[])
  let index = searchs.findIndex((value,index,arr)=>{
    return value===query
  })
  console.log(index)
  if(index>=0) searchs.splice(index,1)
  storage.set(SEARCH_KEY,searchs)
  return searchs
}

//从本地storage删除所有搜索项
export function delAllItemSearchHistory(){
  storage.set(SEARCH_KEY,[])
  return []
}

export function saveSong(query){
  console.log(query)
  let searchs = storage.get(SONG_KEY,[])
  console.log(searchs)
  let index = searchs.findIndex((value,index,arr)=>{
    return value? value.musicData.songid === query.musicData.songid : false
  })

  if(index != 0){
    if(index>0){
      searchs.splice(index,1)
    }
    searchs.unshift(query)
    if(searchs.length>SONG_MAX_LENGTH){
      searchs.pop()
    }
  }

  console.log(searchs)
  storage.set(SONG_KEY,searchs)
  return searchs
}

export function loadSong(){
  console.log(storage.get(SONG_KEY,[]))
  return storage.get(SONG_KEY,[])
}

//从本地storage中删除给定的搜索项
export function delItemSongHistory(query){
  console.log(query)
  //从storage中取数据,如果没有返回空数据
  let searchs = storage.get(SONG_KEY,[])
  let index = searchs.findIndex((value,index,arr)=>{
    return value? value.musicData.songid === query.musicData.songid : false
  })
  console.log(index)
  if(index>=0) searchs.splice(index,1)
  storage.set(SONG_KEY,searchs)
  return searchs
}

export function delAllItemSongHistory(){
  storage.set(SONG_KEY,[])
  return []
}

/**
 * Created by Administrator on 2017/9/28.
 */
export const singer = state => state.singer

export const closed = state => state.closed

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const searchHistory = state => state.searchHitory

export const songHistory = state => state.songHistory

export const currentSong = state => state.currentSong

/*//计算属性,计算当前的歌曲
export const currentSong = (state)=>{
  let current = {}
  current.musicData = []
  current.musicData.songName = ''
  return state.playlist[state.currentIndex] || current
}*/

<template>
  <transition name="slide">
    <div class="user">
      <div class="header">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
      </div>
      <div class="search-history">
        <h1 class="title">
          <span class="text">歌曲历史</span>
          <span @click="deleteAllItem()" class="clear">
                <i class="icon-clear"></i>
              </span>
        </h1>
        <ul class="search-list">
          <li   class="search-item" v-for="item,index in songHistory">
            <span @click="addQuery(index,$event)" class="text">{{item.musicData.songname}}</span>
            <span @click="addQuery(index,$event)" class="singer">{{item.musicData.singer | showSinger }}</span>
            <span @click="deleteItem(item)" class="icon">
                  <i class="icon-delete"></i>
                </span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>

  import {mapActions,mapGetters} from 'vuex'
  export default {
    data(){
      return{

      }
    },
    methods:{
      back(){
        this.$router.back()
      },
      addQuery(index){
        if(this.currentSong.songid === this.songHistory[index].musicData.songid && !this.closed){
          return
        }
        this.selectPlay({song:this.songHistory[index].musicData})
        this.saveSongHistory({query:this.songHistory[index]})
      },
      deleteItem(item){
        this.delSongHistory({query:item})
      },
      deleteAllItem(){
        this.delAllSongHistory()
      },
      ...mapActions([
        'selectPlay',
        'saveSongHistory',
        'delSongHistory',
        'delAllSongHistory'
      ])
    },
    computed:{
      ...mapGetters([
        'songHistory',
        'currentSong',
        'closed'
      ])
    },
    filters: {
      showSinger(value){
        let singers = []
        value.forEach((item, index) => {
          singers.push(item.name)
        })
        return singers.join('/')
      }
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .user
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: #fff
    .header
      position:relative
      .back
        position:absolute
        top:10px;
        left:5px
  .search-history
    position:relative
    margin:60px
    font-size:14px
    .title
      .text
        padding:10px 70px
        border: 1px solid rgba(0,0,0,.6)
        border-radius:10px
        background-color:$color-theme
        font-size:18px
        color:#fff
      .clear
        position:absolute
        right:-5px
        font-size:22px
    .search-list
      margin-top:20px
      .search-item
        position:relative
        line-height:40px
        .text
          font-size:16px
          color: $color-text-h
        .singer
          margin-left:5px
          font-size:14px
          color: #808080
        .icon
          position: absolute
          right:0
          color:#000
  //路由跳转过场动画
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

<template>
  <transition name="slide">
    <div class="top">
      <div class="header" :style="bgStyle">
        <div class="content">
            <div class="title">{{topinfo.ListName}}</div>
            <div class="desc">第{{duration}}</div>
            <div class="desc">{{topDetail.update_time}} 更新</div>
        </div>
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <!--<div class="background"></div>-->
      </div>
      <div class="song-list" ref="topWrapper">
        <ul>
          <span class="count_box__desc">排行榜 共100首</span>
          <li @click="selectItem(index)" class="item" v-for="item,index in topDetail.songlist">
            <div class="play">
              <span :class="getRankCls(index)">{{index + 1}}</span>
            </div>
            <div class="content">
              <h2 class="name">{{item.data.songname}}</h2>
              <p class="desc">
                <span>{{item.data.singer | showSinger}}</span><span class="detail">{{item.data.albumdesc}}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
  import {mapActions,mapGetters} from 'vuex'
  import {getTopList} from 'api/rank'
  import {ERROR_OK} from 'api/config'
  import BScroll from 'better-scroll'
  export default {
    data(){
      return{
        topDetail:{},
        duration:{},
        topinfo:{},
        songList:[]
      }
    },
    created(){
      this._getTopList(this.$route.params.id)
    },
    methods:{
      _getTopList(id){
        getTopList(id).then((res)=>{
          if(res.code === ERROR_OK){
            this.topDetail = res
            this.topinfo = this.topDetail.topinfo
            if(this.topDetail.day_of_year){
              this.duration = this.topDetail.day_of_year+'天'
            }else{
              this.duration=this.topDetail.date+'周'
            }
            this.topDetail.songlist.forEach((item,index) => {
              let musicData = {'musicData':item.data}
              this.songList.push(musicData)
            })
            this.$nextTick(()=>{
              this._initScroll()
            })
          }
          console.log(this.topDetail)
        })
      },
      back(){
        this.$router.back()
      },
      getRankCls(index){
        if(index<=2) return 'rank'
      },
      selectItem(index){
        console.log(this.songList)
        if(this.currentSong.songid === this.songList[index].musicData.songid && !this.closed){
          return
        }
        this.saveSongHistory({query:this.songList[index]})
        this.selectPlay({song:this.songList[index].musicData})
      },
      _initScroll(){ //初始化滚动条
        this.topScroll = new BScroll(this.$refs.topWrapper, {
          'click':true
        })
      },
      ...mapActions([
        'selectPlay',
        'saveSongHistory'
      ])
    },
    computed:{
      bgStyle(){
        return `background-image:url(${this.topinfo.pic_album})`
      },
      ...mapGetters([
        'currentSong',
        'closed'
      ])
    },
    filters:{
      showSinger(value){
          let singers = []
          value.forEach((item,index)=>{
              singers.push(item.name)
          })
          return singers.join('/')
      }
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .top
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: #fff
    .header
      position:relative
      width:100%
      height:0
      padding-top:70%
      color:#fff
      /*background-image:url(http://imgcache.qq.com/music/photo_new/T002R300x300M0000037qtDt3hxO46.jpg)*/
      background-size:cover
      overflow:hidden
      .content
          position:absolute
          width: 65%
          height: 50%
          overflow: auto
          margin: auto
          top: 0; left: 0; bottom: 0; right: 0
          line-height:20px
          .title
            font-size:20px
          .info
            margin-top:10px
            font-size: 16px
            color: #b4b4b4
          .desc
            margin-top:10px
            font-size:16px
        .back
          position:absolute
          top:10px;
          left:5px
/*      .background
        position:absolute
        top:0
        left:0
        width:100%
        height:100%
        z-index:-1
        background:rgba(0,0,0,0.8)
        filter:blur(2px)*/

    .song-list
      position:absolute
      top: 270px
      width:100%
      bottom: 0;
      overflow:hidden
      padding:15px
      .count_box__desc
        font-size:14px
        color:#777
      .item
        display:flex
        height:50px
        margin-top:10px
        line-height:20px
        .play
          flex:0 0 22px
          .rank
            color: #FF400B
        .content
          flex:1
          padding-left:10px
          line-height:20px
        .name
          font-size:16px
        .desc
          padding:0 5px 0 0
          font-size:12px
          color: #9c9c9c
          .detail
            margin-left:5px

  //路由跳转过场动画
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>

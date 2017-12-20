<template>
  <transition name="slide">
    <div class="song">
      <div class="header">
        <div class="content-wrapper">
          <div class="avatar">
            <img :src="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.singer.Fsinger_mid}.jpg?max_age=2592000`" width="128" height="128"/>
          </div>
          <div class="content">
            <div class="title">{{singerDetail.singer_name}}</div>
            <div class="info">
              <span class="single">单曲 : {{singerDetail.total}}</span>
              <span class="album">专辑 : {{singerDetail.albumTotal}}</span>
            </div>
            <div class="desc">{{singerDetail.SingerDesc | format}}</div>
          </div>
        </div>
<!--        <div class="play">
          <span class="title">播放全部</span>
        </div>-->
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <div class="background"></div>
      </div>
      <div class="song-list" ref="songWrapper">
        <ul>
          <li @click="selectItem(index)" class="item" v-for="item,index in singerDetail.list">
            <div class="play">
              <span class="icon"></span>
            </div>
            <div class="content">
              <h2 class="name">{{item.musicData.songname}}</h2>
              <p class="desc">
                <span>{{item.musicData.albumdesc}}</span>
                <span v-show="!item.musicData.albumdesc">{{item.musicData.albumname}}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import {mapGetters,mapActions} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERROR_OK} from 'api/config'
  export default {
      data(){
        return{
            singerDetail:{},
            singer_img:{},
        }
      },
      computed:{
        ...mapGetters([
            'singer',
            'currentSong',
            'closed'
        ])
      },
      created(){
        this._getDetail()
         console.log(this.singer)
      },
      methods:{
          _getDetail(){
            if(!this.singer.Fsinger_id){
                //如果刷新页面则没有id，返回到歌手列表
                this.$router.push('/singer')
                return
            }
            getSingerDetail(this.singer.Fsinger_id).then((res)=>{
                if(res.code === ERROR_OK){
                  this.singerDetail = res.data
                  this.$nextTick(()=>{
                    this._initScroll()
                  })
                }
              console.log(this.singerDetail)
            })
          },
          selectItem(index){
              if(this.currentSong.songid === this.singerDetail.list[index].musicData.songid && !this.closed){
                  return
              }
              this.saveSongHistory({query:this.singerDetail.list[index]})
              this.selectPlay({song:this.singerDetail.list[index].musicData})
          },
          _initScroll(){ //初始化滚动条
            this.singerScroll = new BScroll(this.$refs.songWrapper, {
              'click':true
            })
          },
          back(){
            this.$router.back()
          },
          ...mapActions([
            'selectPlay',
            'saveSongHistory',
          ])
      },
      filters:{
        format:function(value){
          if(value){
            value = value.slice(1,value.indexOf('。'))
          }
          return value
        }
      }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .song
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: #fff
    .header
      position:relative
      color:#fff
      overflow:hidden
      .content-wrapper
        display:flex
        padding:24px 12px 18px 24px
        .avatar
          flex:0 0 128px
          width:128px
        .content
          flex:1
          margin-left:16px
          .title
            font-size:16px
          .info
            margin-top:10px
            font-size: 12px
            color: #b4b4b4
            .album
              margin-left:5px
          .desc
            margin-top:10px
            font-size:12px
            line-height:18px

      .play
        margin-bottom:15px
        text-align:center
        .title
          padding:10px 30px 10px 30px
          background:#31C27C
          font-size:14px
          color:#fff
          border-radius:10px
          &::before
            content: "";
            display: inline-block;
            height: 0;
            width: 0;
            margin-right: -3px;
            border-color: transparent transparent transparent #fff;
            border-width: 7px 11px;
            border-style: solid;
            border-radius: 2px;

      .back
        position:absolute
        top:10px;
        left:5px

      .background
        position:absolute
        top:0
        left:0
        width:100%
        height:100%
        z-index:-1
        background:rgba(0,0,0,0.8)
        filter:blur(2px)
    .song-list
      position:absolute
      top: 190px
      width:100%
      bottom: 0;
      overflow:hidden
      padding:10px
      .item
        display:flex
        height:64px
        .play
          flex:0 0 22px
          .icon
            display:inline-block
            width: 20px;
            height: 20px;
            margin-top:8px
            background:url('search_sprite.png')
            background-repeat:no-repeat
            background-size:20px 30px
        .content
          flex:1
          padding-left:10px
          line-height:20px
          .name
            font-size:14px
          .desc
            padding:0 5px 0 0
            font-size:12px
            color:rgba(7,17,27,0.4)
  //路由跳转过场动画
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>

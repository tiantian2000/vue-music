<template>

    <div>
      <div class="player" v-show="!closed">
        <transition name="normal">
          <div class="normal-player" v-show="fullScreen">
              <div class="background">
                <img :src="singer_img" width="100%" height="100%" />
              </div>
              <div class="top">
                <div class="back" @click="back">
                  <i class="icon-back"></i>
                </div>
                <h1 class="title">{{currentSong.songname}}</h1>
                <h2 class="subtitle">{{singers.join(',')}}</h2>
              </div>
              <div class="middle ">
                <div class="cd-wrapper">
                  <div class="cd">
                    <div class="cd_img" :class="cdCls">
                      <img class="image" :src="songImg" />
                      <div class="operators">
                        <div class="play">
                          <i :class="icon" @click="selectPlay"></i>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="lyric" ref="lyricWrapper">
                  <ul>
                    <li class="text" ref="lyricLine" :class="{'current':index===currentNum}" v-for="item,index in lyric.lines">
                      {{item.txt}}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="bottom">
                <div class="progress-wrapper">
                  <span class="time">{{formatTime(currentTime)}}</span>
                  <div class="progress-bar" ref="progressBar">
                    <div class="bar-inner" >
                      <div class="progress" ref="progress"></div>
                      <div class="progress-btn-wrapper" ref="progressBtn">
                        <div class="progress-btn"></div>
                      </div>
                    </div>
                  </div>
                  <span class="time">{{formatTime(currentSong.interval)}}</span>
                </div>
              </div>
          </div>
        </transition>
        <transition name="mini">
          <div class="mini-player" v-show="!fullScreen" @click="full">
              <div class="icon" :class="cdCls">
                <img :src="songImg" width="40" height="40"/>
              </div>
              <div class="text">
                <h2 class="name">{{currentSong.songname}}</h2>
                <p class="desc">{{singers.join(',')}}</p>
              </div>
              <div class="control">
                <i :class="icon" @click.stop="selectPlay"></i>
              </div>
              <div class="close" @click.stop="close">
                <i class="icon-close"></i>
              </div>
          </div>
        </transition>
      </div>
      <!-- 当歌曲播放时会触发回调函数timeupdate获取当前的播放时间-->
      <audio ref="audio" :src="song" @timeupdate="updateTime"></audio>
    </div>

</template>

<script>
  import {getLyric} from 'api/song'
  import {ERROR_OK} from 'api/config'
  import {Base64} from 'js-base64'
  import BScroll from 'better-scroll'
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import {mapMutations} from 'vuex'
  import Lyric from 'lyric-parser'

  var unescapeHTML = function (str) {
    var t = document.createElement("div");
    t.innerHTML = str;
    return t.textContent || t.innerText;
  }

  export default {
      data(){
        return{
          song:{},
          songImg:{},
          singer_img:{},
          singers:[],
          lyric:{},
          currentLyric:{},
          currentTime:0,
          currentNum:0,
        }
      },
      computed:{
        cdCls(){
           return this.playing ? 'play':'pause'
        },
        icon(){ //根据是否正在播放，改变播放的样式
            //return 'icon-play'
            return this.playing ? 'icon-pause' : 'icon-play'
        },
        ...mapGetters([
            'fullScreen',
            'singer',
            'closed',
            'playlist',
            'currentSong',
            'playing',

        ])
      },
      watch: {
        currentSong(){
          console.log('进currentsong')
          console.log(this.currentSong)
          console.log(this.lyric)
          if(!this.currentSong.songid){
              return
          }
          this.setPlayingState(false)
          if(this.lyric.lines !== undefined) this.lyric.stop()
          this.end = false
          this.setClosed(false)
          this.singers = []
          this.song = `http://ws.stream.qqmusic.qq.com/${this.currentSong.songid}.m4a?fromtag=46`
          this.songImg = `http://y.gtimg.cn/music/photo_new/T002R150x150M000${this.currentSong.albummid}.jpg`
          this.singer_img = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.currentSong.singer[0].mid}.jpg?max_age=2592000`
          console.log(this.songImg)
          this.currentSong.singer.forEach((item) => {
            this.singers.push(item.name)
          })
          getLyric(this.currentSong.songid).then((res) => {
            console.log(res)
            if (res.code === ERROR_OK) {
              this.currentLyric = res.lyric
              this.lyric = new Lyric(unescapeHTML(res.lyric),this.handleLyric)
              this.$nextTick(() => {
                    if(!this.$refs.audio.error){
                      //this.$refs.audio.play()
                      this.lyric.play()
                      this.setPlayingState(true)
                    }
                    this._initScroll()
              })
            }
            console.log(this.lyric)
          })
        },
        currentTime(){
            let percent = this.currentTime / this.currentSong.interval
            //console.log(percent)
            if(percent >= 0){
              //(当前进度条总宽度-小球的宽度)*播放的进度
              let newWidth = (this.$refs.progressBar.clientWidth-16) * percent
              this.$refs.progress.style.width = `${newWidth}px`
              this.$refs.progressBtn.style['transform'] = `translate3d(${newWidth}px,0,0)`
            }
            if(this.$refs.audio.ended){ //播放结束
              this.lyric.stop() //停止滚动歌词
              this.lyric = new Lyric(unescapeHTML(this.currentLyric),this.handleLyric)  //重新构造歌词对象
              //歌词回到第一行
              let lyricEl = this.$refs.lyricLine[0]
              this.lyricScroll.scrollToElement(lyricEl,1000)
              //播放状态设为false
              this.setPlayingState(false)
            }

        },
        playing(){ //根据是否正在播放，控制播放还是暂停
          console.log(this.playing)
          this.$nextTick(() => {
            if (!this.playing) {
              this.$refs.audio.pause()
            } else {
              if(!this.$refs.audio.error){
                this.$refs.audio.play()
              }
            }
          })
        }
      },
      methods:{
        back(){
           this.setFullScreen(false)
        },
        handleLyric({lineNum,txt}){
          this.currentNum = lineNum
          //console.log(this.currentNum + ":" + txt)
          if(lineNum > 5){ //如果歌词到大于第5行则滚动
            //定位到5行之前的li元素
            let lyricEl = this.$refs.lyricLine[lineNum-5]
            this.lyricScroll.scrollToElement(lyricEl,1000)
          }
        },
        full(){
          this.setFullScreen(true)
          this.$nextTick(() => {
            if(!this.lyricScroll) this._initScroll()
            else this.lyricScroll.refresh()
          })
          //console.log(this.lyric.length)
          /*if(this.lyric.length==0){
            console.log('取歌词')
            getLyric(this.currentSong.musicData.songid).then((res) => {
              console.log(res)
              if (res.code === ERROR_OK) {
                this.lyric = res.lyric.split('&#10;').slice(5)
                this.$nextTick(() => {
                  this._initScroll()
                })
              }
              console.log(this.lyric)
            })
          }*/

        },
        close(){
          this.$refs.audio.load()
          this.$refs.audio.pause()
          if(this.lyric.lines !== undefined) this.lyric.stop()
          //歌词回到第一行
          let lyricEl = this.$refs.lyricLine[0]
          this.lyricScroll.scrollToElement(lyricEl,1000)
          this.exitPlay()
        },
        format: function (value) {
          return value.slice(value.indexOf(']')+1)
        },
        selectPlay(){
          console.log(this.$refs.audio.error)
          if(!this.$refs.audio.error){
            this.lyric.togglePlay()
            this.setPlayingState(!this.playing)
          }
        },
        _initScroll(){ //初始化滚动条
          this.lyricScroll = new BScroll(this.$refs.lyricWrapper, {
            'click':true
          })
        },
        //参数是event对象,event的target就是audio标签,此标签有一个currentTime就是当前的播放时间
        updateTime(e){
            this.currentTime = e.target.currentTime
            //console.log(this.currentTime)
        },
        //格式化时间
        formatTime(interval){
            interval = interval | 0 //向下取整
            const minute = interval / 60 | 0
            const second = this.pad(interval % 60)
            return `${minute}:${second}`
        },
        pad(num){
          let len = num.toString().length
          while(len<2){
              num = '0' + num
              len++
          }
          return num
        },
        ...mapActions([
          'exitPlay'
        ]),
        ...mapMutations({
          //把mutations-types中的常量映射到setSinger方法
          setPlayingState:'SET_PLAYING_STATE',
          setFullScreen:'SET_FULL_SCREEN',
          setPlayList:'SET_PLAYLIST',
          setClosed:'SET_CLOSED'
        })
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .player
    .normal-player
      position:fixed
      left:0
      right:0
      top:0
      bottom:0
      z-index:150
      background: $color-background
      color:#fff
      .background
        position:absolute
        left:0
        top:0
        width:100%
        height:100%
        z-index:-1
        opacity:0.6
        filter:blur(20px)
      .top
        position:relative
        margin-bottom: 25px
        .back
          position:absolute
          top:0
          left:6px
          .icon-back
            display:block
            padding: 9px
            font-size:$font-size-large-x
            color:$color-theme
            transform :rotate(-90deg)

        .title
          padding:30px
          text-align:center
          color:#31C27C
          font-size:$font-size-large
        .subtitle
          line-height: 25px
          text-align:center
          font-size:$font-size-medium
          color:#31C27C
      .middle
        position:relative
        .cd-wrapper
          .cd
            text-align:center
            .cd_img
               position:relative
               &.play
                animation:rotate 20s linear infinite
               &.pause
                animation-play-state: paused
               .image
                 border: 10px solid rgba(255, 255, 255, 0.1)
                 border-radius: 50%
            .operators
              margin: auto
              position:absolute
              top: 35%;
              left: 0;
              bottom: 0;
              right: 0
              font-size:50px
        .lyric
          position:fixed
          left:0
          right:0
          top:320px
          bottom:55px
          padding:0 20px
          overflow:hidden
          text-align:center
          .text
            line-height: 32px
            color:$color-text-l
            font-size:$font-size-medium
            &.current
              color:#31C27C
      .bottom
        position: fixed
        width:100%
        bottom:10px
        text-align:center
        .progress-wrapper
          display: flex
          width:80%
          align-items:center
          padding:10px 0
          margin:0 auto
          .time
            flex:0 0 30px
            line-height: 30px
            width:30px
            font-size:14px
            color:#fff
            padding:0 2px
          .progress-bar
            flex:1
            height:30px
            .bar-inner
              position: relative
              top: 13px
              height:4px
              background: rgba(0,0,0,0.3)
              .progress
                position:absolute
                height:100%
                background:#31C27C
              .progress-btn-wrapper
                  position:absolute
                  left:-10px
                  top:-13px
                .progress-btn
                  position:relative
                  top:7px
                  left:7px
                  box-sizing:border-box
                  width: 16px
                  height:16px
                  border:3px solid #fff
                  border-radius:50%
                  background:#31C27C
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display:flex
      align-items:center
      position:fixed
      left:0
      bottom:0
      z-index:180
      width:100%
      height: 60px
      background:$color-highlight-background
      color:#fff
      overflow:hidden
      .icon
        flex:0 0 40px
        width: 40px
        padding:0 10px 0 20px
        img
          border-radius:50%
        &.play
          animation: rotate 20s linear infinite
        &.pause
          animation-play-state: paused
      .text
        display:flex
        flex-direction:column
        justify-content:center
        flex:1
        line-height: 20px
        //overflow:hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size:$font-size-medium
        .desc
          no-wrap()
          font-size:$font-size-small
          color:$color-text-d
      .control
        flex:1
        font-size:28px
      .close
        position:absolute
        top:1px
        right:1px
        padding:5px
        font-size:$font-size-medium-x
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>

<template>
  <div class="recommend">
   <div ref="recommendWrapper" class="recommend-content" >
      <div>
            <div v-if="recommends.length" class="slider-wrapper">
              <slider>
                <div v-for="item in recommends">
                  <a :href="item.linkUrl">
                    <img :src="item.picUrl"/>
                  </a>
                </div>
              </slider>
            </div>

        <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul >
              <li @click="selectItem(index)" v-for="item,index in discList" class="item">
                <div class="icon">
                   <!--懒加载加载图片-->
                    <img width="60" height="60" v-lazy="`https://y.gtimg.cn/music/photo_new/T002R150x150M000${item.musicData.albummid}.jpg?max_age=2592000`"/>
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.musicData.songname"></h2>
                  <p class="desc">{{item.musicData.singer | showSinger }}</p>
                </div>
              </li>
            </ul>
          </div>
            <!-- loading提示-->
         <div class="loading-container" v-show="!discList.length">
              <loading></loading>
            </div>

      </div>
      </div>
    <router-view></router-view>

  </div>
</template>

<script>
  import Slider from 'base/slider/slider'
  import BScroll from 'better-scroll'
  import Loading from 'base/loading/loading'
  import {getRecommend,getDiscList,getTopList} from 'api/recommend'
  import {ERROR_OK} from 'api/config'
  import {mapActions,mapGetters} from 'vuex'

  export default {
      data(){
          return{
            recommends : [],
            discList : []
          }
      },
      created(){
        this._getRecommend()
        this._getDiscList()
      },
      methods:{
          _getRecommend(){
            getRecommend().then((res)=>{
                if(res.code === ERROR_OK){ //请求成功
                    console.log(res.data.slider)
                    this.recommends = res.data.slider
                }
            })
          },
          _getDiscList(){
            getTopList().then((res)=>{
                if(res.code === ERROR_OK){
                    res.songlist.forEach(item=>{
                      let musicData = {'musicData':item.data}
                      this.discList.push(musicData)
                    })
                    this.discList = this.discList.slice(0,10)
                    console.log(this.discList)
                    this.$nextTick(()=>{
                      this._initScroll()
                    })
                }
            })
          },
          detail(id){
            this.$router.push({
              path : `/recommend/${id}`
            })
          },
          selectItem(index){
            if(this.currentSong.songid === this.discList[index].musicData.songid && !this.closed){
              return
            }
            this.selectPlay({song:this.discList[index].musicData})
            this.saveSongHistory({query:this.discList[index]})
          },
          _initScroll(){ //初始化滚动条
            this.recommendScroll = new BScroll(this.$refs.recommendWrapper, {
              'click':true
            })
          },
          ...mapActions([
            'selectPlay',
            'saveSongHistory'
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
      },
      computed:{
        ...mapGetters([
          'currentSong',
          'closed'
        ])
      },
      components:{
          'slider' : Slider,
          'loading': Loading
      }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .recommend
    position : fixed
    width:100%
    top: 88px
    bottom:0
    .swipe-wrapper
      width:100%
      height:150px
    .recommend-content
      height: 100%;
      overflow : hidden
      .recommend-list
        .list-title
          height: 65px
          line-height :65px
          text-align :center
          font-size :$font-size-medium
          color : $color-text-h
        .item
          display : flex
          box-sizing :border-box
          align-items : center
          padding:0 20px 20px 20px
          height:80px
          .icon
            flex:0 0 60px
            height:60px
          .text
            flex:1
            padding-left:10px
            line-height:30px
            .name
              font-size:14px
            .desc
              padding:0 5px 0 0
              font-size:12px
              color:rgba(7,17,27,0.4)
      .loading-container
        position : relative
        width:100%
        //实现垂直居中
        top:50%


</style>

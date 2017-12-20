<template>
  <div class="singer">
    <!--<scroll ref="scroll" class="singer-content" :data="singers">-->
        <div class="singer-list" ref="singerWrapper">
            <ul >
              <li @click="selectItem(item)" v-for="item in singers" class="item">
                <div class="icon">
                  <!--懒加载加载图片-->
                  <img width="60" height="60" v-lazy="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`"/>
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.Fsinger_name"></h2>
                </div>
              </li>
            </ul>
      </div>
   <!-- </scroll>-->
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from 'api/singer'
  import {ERROR_OK} from 'api/config'
  import BScroll from 'better-scroll'
  import {mapMutations} from 'vuex'

  export default {
      data(){
          return{
            singers:[]
          }

      },
      created(){
          this._getSingerList();
      },
      methods:{
          _getSingerList(){
            getSingerList().then((res)=>{
                console.log(res)
                if(res.code === ERROR_OK){
                  this.singers = res.data.list
                  this.$nextTick(()=>{
                    this._initScroll()
                  })
                }
                //console.log(this.singers)
            })
          },
          selectItem(item){
            this.$router.push({
              path : `/singer/${item.Fsinger_id}`
            })
            //提交mutation
            this.setSinger(item)
          },
          _initScroll(){ //初始化滚动条
            this.singerScroll = new BScroll(this.$refs.singerWrapper, {
              'click':true
            })
          },
           ...mapMutations({
              //把mutations-types中的常量映射到setSinger方法
              setSinger:'SET_SINGER'
          })
      }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "~common/stylus/variable"
    .singer
      .singer-list
        position:absolute
        top: 88px
        width:100%
        bottom:0
        overflow:hidden
        .item
          display : flex
          box-sizing :border-box
          align-items : center
          padding:0 20px 20px 20px
          .icon
            padding-right:20px
          .text
            line-height 20px;
            font-size : $font-size-medium
</style>

<!-- 轮播图组件 -->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
        <span class="dot" v-for="item,index in dots" :class="{active:currentPageIndex==index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from 'common/js/dom'
  import BScroll from 'better-scroll'

  export default {
    data(){
      return{
          dots:[],
          currentPageIndex:0
      }
    },
    props:{
        loop:{ //循环轮播
            type:Boolean,
            default:true
        },
        autoPlay:{ //自动轮播
            type:Boolean,
            default:true
        },
        interval:{ //间隔时间
            type:Number,
            default:4000
        }
    },
    mounted(){
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if(this.autoPlay){
          this._play()
      }

      //监听改变窗口大小事件
      window.addEventListener('resize',()=>{
          //slider还没初始化,直接return
          if(!this.slider){
            return
          }
          //重新计算宽度
          this._setSliderWidth(true)
          this.slider.refresh()
      })
    },
    methods:{
      //设置Slider宽度
      _setSliderWidth(isResize){
        //取有多少个图片
        this.children = this.$refs.sliderGroup.children;
        let width = 0;
        //取slider的宽度
        let sliderWidth = this.$refs.slider.clientWidth
        //计算总宽度
        for(let i=0;i<this.children.length;i++){
            let child = this.children[i];
            //给每一个图片添加样式和宽度
            child.className = 'slider-item'
            child.style.width = sliderWidth + "px";
            width += sliderWidth
        }

        if(this.loop && !isResize){//循环切换的话,总长度需要2倍
            width += 2 * sliderWidth;
        }
        //设置总宽度
        this.$refs.sliderGroup.style.width = width + 'px'

      },
      //初始化dots
      _initDots(){
          this.dots = new Array(this.children.length);
      },
      //初始化Slider
      _initSlider(){
        this.slider = new BScroll(this.$refs.slider,{
            scrollX:true,
            scrollY:false,
            momentum:false,      //当快速滑动时是否开启滑动惯性
            snap:true,
            snapLoop:this.loop,  // 开启循环播放
            snapThreshold:0.3,   // 滚动距离超过宽度/高度的 30% 时切换图片
            snapSpeed:400,       //切换动画时长 400ms
            //click:true
        });

        //绑定一个滚动结束事件
        this.slider.on('scrollEnd',()=>{
            let pageIndex = this.slider.getCurrentPage().pageX
            if(this.loop){ //scroll实际会多一个副本
                pageIndex -= 1;
            }
            this.currentPageIndex = pageIndex
            //每个页面结束时,调用自动播放
            if(this.autoPlay){
                //取消由 setTimeout() 方法设置的 timeout
                clearTimeout(this.timer)
                this._play()
            }
        })
      },
      //自动播放
      _play(){
        let pageIndex = this.currentPageIndex + 1
        if(this.loop){
            pageIndex += 1
        }
        //间隔时间后自动跳转到下一个页面
        this.timer = setTimeout(()=>{
            this.slider.goToPage(pageIndex,0,400)
        },this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height:1px
    position:relative
    .slider-group
      position:relative
      overflow:hidden
      white-space:nowrap
      .slider-item
        float:left
        box-sizing:border-box
        overflow:hidden
        text-align:center
        a
          display:block
          width:100%
          overflow:hidden
          text-decoration:none
        img
          display:block
          width:100%

    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 12px
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width:20
          border-radius: 5px
          background:rgba(255, 255, 255, 0.8)
</style>

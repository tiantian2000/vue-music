<template>
  <div >
      <div class="search-box">
        <div class="box">
          <input class="input-box" v-model="query" :placeholder="placeholder"/>
          <i class="icon-search"></i>
        </div>
          <i @click='clear' v-show='query' class="icon-dismiss"></i>
      </div>

      <div class="hot-cut" v-show="!query">
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
   <!--           <li class="item special">
                <span>{{special.special_key}}</span>
              </li>-->
              <li @click="addQuery(item.k,$event)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="deleteAllItem()" class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <ul class="search-list">
              <li   class="search-item" v-for="item in searchHistory">
                <span @click="addQuery(item,$event)" class="text">{{item}}</span>
                <span @click="deleteItem(item)" class="icon">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </ul>
          </div>
      </div>
      <div class="search-result" v-show="query" ref="searchWrapper">
        <ul>
          <li v-show="singerDetail.zhida.songnum" class="title">
            <div class="play" v-if="singerDetail.zhida.singermid">
              <span class="icon"><img class="img-title"  width="40" height="40" :src="singerImg"/></span>
            </div>
            <div class="content">
              <h2 class="name">{{singerDetail.zhida.singername}}</h2>
              <p class="desc">
                <span class="single">单曲 : {{singerDetail.zhida.songnum}}</span> <span class="albumnum">专辑 : {{singerDetail.zhida.albumnum}}</span>
              </p>
            </div>
          </li>
          <li @click="selectItem(index)" class="item" v-for="item,index in songList">
            <div class="play">
              <span class="icon"></span>
            </div>
            <div class="content">
              <h2 class="name">{{item.musicData.songname}}</h2>
              <p class="desc">
                <span>{{item.musicData.singer | showSinger }}</span>
               </p>
            </div>
          </li>
        </ul>
      </div>
  </div>
</template>

<script>
  import {getHotSearch,search} from 'api/search'
  import {ERROR_OK} from 'api/config'
  import BScroll from 'better-scroll'
  import {mapActions,mapGetters} from 'vuex'
  export default {
      data(){
          return{
              placeholder:'搜索歌曲、歌单、专辑',
              query:'',
              page:1,
              hotKey:[],
              special:{},
              singerDetail:{'song':{'list':[]},'zhida':{'singermid':''}},
              song:{},
              songList:[],
              singerImg:'./search_sprite.png'
          }
      },
      created(){
        this._getHotSearch()
      },
      methods:{
        _getHotSearch(){
          getHotSearch().then((res)=>{
            if(res.code === ERROR_OK){
              this.hotKey = res.data.hotkey.slice(0,7)
              this.special.special_key = res.data.special_key
              this.special.special_url = res.data.special_url
            }
          })
        },
        _getSearch(){
          this.songList = []
          search(this.query,this.page,1).then((res)=>{
                this.singerDetail = res.data
                console.log(this.singerDetail.zhida)
                if(this.singerDetail.zhida.singermid === undefined) this.singerDetail.zhida.singermid = ''
                if(this.singerDetail.zhida.singermid != ''){
                    this.singerImg = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.singerDetail.zhida.singermid}.jpg?max_age=2592000`
                }
                //this.songList = res.data.song.list
                res.data.song.list.forEach((item,index) => {
                  let musicData = {'musicData':item}
                  this.songList.push(musicData)
                })
                this.song = res.data.song
                this.$nextTick(()=> {
                  console.log(this.songList)
                  if (!this.singerScroll) {
                    this.singerScroll = new BScroll(this.$refs.searchWrapper, {
                      'click':true
                    })
                    this.singerScroll.on('scrollEnd', () => {
                      if (this.singerScroll.y <= (this.singerScroll.maxScrollY + 50)) { //如果滚动到底部
                         console.log('滚动到底部')
                         if(this.song.curnum + (this.song.curpage-1) * 20 <= this.song.totalnum){ //如果没有加载完
                            this.searchMore() //加载更多
                          }

                      }
                    })
                  } else {
                    this.singerScroll.refresh()
                  }
                })


          })
        },
        searchMore(){
          this.page++
          search(this.query,this.page,1).then((res)=>{
            if(res.code === ERROR_OK) {
                    let result = []
                    res.data.song.list.forEach((item, index) => {
                      let musicData = {'musicData': item}
                      result.push(musicData)
                    })
                this.song = res.data.song
                this.songList = this.songList.concat(result)
                console.log(this.songList)
                this.singerScroll.refresh()

            }
          })

        },
        clear(){
              this.query = ''
              this.page = 1
          },
        addQuery(k,event){
/*            if(!event._constructed){
              return
            }*/
            this.query = k
            //this._getSearch()
        },
        selectItem(index){
          console.log(this.query)
          if(this.currentSong.songid === this.songList[index].musicData.songid && !this.closed){
            return
          }
          //保存搜索结果
          this.saveSearchHistory({query:this.query})
          this.saveSongHistory({query:this.songList[index]})
          this.selectPlay({song:this.songList[index].musicData})
        },
        deleteItem(query){
          this.delSerchHistory({query:query})
        },
        deleteAllItem(){
          this.delAllSearchHistory()
        },
        ...mapActions([
          'selectPlay',
          'saveSearchHistory',
          'delSerchHistory',
          'delAllSearchHistory',
          'saveSongHistory'
        ])
      },
      watch:{
        query(){
            if(this.query != ''){
              this._getSearch()
            }
        }
      },
      computed:{
        ...mapGetters([
          'searchHistory',
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
  .search-box
    display:flex
    margin-top:10px
    align-items:center
    box-sizing:border-box
    padding:10px
    width:100%
    background: #f4f4f4
    .box
      position:relative
      flex:10 //宽度占80px
      .input-box
        padding: 8px 12px 8px 35px
        border-radius: 4px
        width: 80%
        height: 20px
        line-height: 20px
        color: rgba(0,0,0,.2)
        font-size: 14px
      .icon-search
        position:absolute
        top:6px
        left:0
        font-size:24px
    .icon-dismiss
      flex:1
  .hot-cut
    height:100%
    overflow:hidden
    .hot-key
      margin:20px
      .title
        margin-bottom: 10px
        font-size:$font-size-medium
        color:#7e8c8d
        font-weight: bold
      .item
        display:inline-block
        padding:5px 20px
        margin:0 20px 10px 0
        border: 1px solid rgba(0,0,0,.6)
        border-radius:10px
        font-size:14px
        &.special
          color: #fc4524;
          border-color: #fc4524;
    .search-history
      position:relative
      margin:20px
      font-size:16px
      .title
        .clear
          position:absolute
          right:0
      .search-list
        margin-top:10px
        .search-item
          padding:5px
          line-height:30px
          font-size:14px
          position:relative
          .icon
            position: absolute
            right:0
  .search-result
    position:absolute
    top: 155px
    width:100%
    bottom: 0;
    overflow:hidden
    padding-top:10px
    .title
      display:flex
      height:64px
      padding-left:10px
      padding-top:10px
      .play
        flex:0 0 40px
        width:40px
        .icon
          .img-title
            border-radius:50%
      .content
            flex:1
            padding-left:10px
            line-height:20px
            .name
              font-size:16px
            .desc
              padding:0 5px 0 0
              font-size:12px
              color: #808080
              .albumnum
                padding-left:10px
    .item
      display:flex
      height:64px
      padding-left:10px
      .play
        flex:0 0 22px
        .icon
          display:inline-block
          width: 22px;
          height: 20px;
          margin-top:8px
          background-position: 0 0;
          background:url('search_sprite.png')
          background-repeat:no-repeat
          background-size:22px 30px
          .img-title
            border-radius:50%
      .content
        flex:1
        padding-left:10px
        line-height:20px
        .name
          padding-right:20px
          font-size:14px
        .desc
          padding:0 5px 0 0
          font-size:12px
          color:rgba(7,17,27,0.4)
</style>

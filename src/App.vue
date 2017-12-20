<template>
  <div id="app">
    <page-header></page-header>
    <tab></tab>
    <!-- 把dom缓存到内存中,页面切换不重新加载 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
   </div>
</template>

<script>
import Header from 'components/header/header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  name: 'app',
  components:{
    'page-header':Header,
    'tab':Tab,
    Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>

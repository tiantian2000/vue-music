<template>
  <div class="header">
    <div class="icon"></div>
    <h1 class="text">天天音乐</h1>
    <router-link to="/user" class="mine">
      <i class="icon-mine"></i>
    </router-link>

  </div>
</template>

<script>
  export default{

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .header
    position relative
    height: 44px
    text-align center
    color:$color-text
    font-size:0
    background-color : $color-background-h;
    .icon
      display : inline-block
      vertical-align : top
      width:30px;
      height:32px;
      margin-right 9px
      bg-image('logo')
      background-size: 30px 32px
    .text
      display : inline-block
      vertical-align : top
      line-height : 44px;
      font-size $font-size-large
    .mine
      position:absolute
      top:0
      right:0
      .icon-mine
        display: block
        font-size: 18px
        padding:10px
        color:$color-text
</style>

/**
 * Created by Administrator on 2017/9/24.
 */
import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import Disc from 'components/disc/disc'
import Player from 'components/player/player'
import SingerDetail from 'components/singer-detail/singer-detail'
import TopList from 'components/top-list/top-list'
import User from 'components/user/user'

Vue.use(Router)

export default new Router({
  routes:[
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path:'/recommend',
      component:Recommend,
      //配置子路由
      children: [
        {
          path: ':id',
          component: Player
        }
      ]
    },
    {
      path:'/singer',
      component:Singer,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/rank',
      component:Rank,
      children:[
        {
          path:':id',
          component:TopList
        }
      ]
    },
    {
      path:'/search',
      component:Search
    },
    {
      path:'/user',
      component:User
    }
  ]
})

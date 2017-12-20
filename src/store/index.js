/**
 * Created by Administrator on 2017/9/28.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutation'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

//打开调试工具
const debug = process.env.NODE_ENV != 'production'

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict:debug, //打开调试工具
    plugins:debug?[createLogger()]:[] //使用日志插件
  }
)

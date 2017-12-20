/**
 * Created by Administrator on 2017/10/22.
 */
import {commonParams,options,disc_options} from './config'
import axios from 'axios'
export function getLyric(singerid){
  console.log(singerid)
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    nobase64:1,
    musicid:singerid,
    songtype:0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

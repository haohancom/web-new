import request from '@/utils/fetch'

//动作分布
export function dzfb(params) {
    return request({
     url: '/today/eleven',
      method: 'get',
      params
    })
  }

  //教员动作分布
  export function jydz(params) {
    return request({
     url: '/today/thirteen',
      method: 'get',
      params
    })
  }

   //课程发言次数分布
  export function fycs(params) {
    return request({
     url: '/today/seventeen',
      method: 'get',
      params
    })
  }

  
   //课程发言次数分布
  export function fyqs(params) {
    return request({
     url: '/today/eighteen',
      method: 'get',
      params
    })
  }
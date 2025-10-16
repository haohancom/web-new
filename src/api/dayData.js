import request from '@/utils/fetch'

    //今日数据概况
  export function jrgk(params) {
    return request({
     url: '/today/ten',
      method: 'get',
      params
    })
  }

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

  
   //课程发言前十分布
  export function fyqs(params) {
    return request({
     url: '/today/eighteen',
      method: 'get',
      params
    })
  }

     //参与度前十班级动作分布
  export function cydz(params) {
    return request({
     url: '/today/nineteen',
      method: 'get',
      params
    })
  }

      //兴奋度前十情绪分布
  export function xfqx(params) {
    return request({
     url: '/today/twenty',
      method: 'get',
      params
    })
  }
   //班级概况
  export function bjgk(params) {
    return request({
     url: '/today/fourteen',
      method: 'get',
      params
    })
  }

   //学生出勤率
  export function xscq(params) {
    return request({
     url: '/today/fifteen',
      method: 'get',
      params
    })
  }

  //课堂类型数据
  export function twentyOne(params) {
    return request({
      url: '/today/twentyOne',
      method: 'get',
      params
    })
  }

  //获取教员人数和学员人数
  export function getClassroomAttendance(params) {
    return new Promise(async (resolve, reject) => {
      try {
        // 构建查询参数
        const queryString = new URLSearchParams(params).toString();
        const url = `/qt/course/dock/getClassroomAttendance${queryString ? '?' + queryString : ''}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }
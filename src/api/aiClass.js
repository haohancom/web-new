import request from '@/utils/fetch'

   //获取课程列表
  export function getCourse(params) {
    return request({
     url: '/aiClass/queryCourse',
      method: 'get',
      params
    })
  }

   //获取教师列表
  export function getTeacher(params) {
    return request({
     url: '/aiClass/queryTeacher',
      method: 'get',
      params
    })
  }


  //获取学生班级列表
  export function getStudentClass(params) {
    return request({
     url: '/aiClass/queryStudentClass',
      method: 'get',
      params
    })
  }


  
  //获取学生教室列表
  export function getClassroom(params) {
    return request({
     url: '/aiClass/querySite',
      method: 'get',
      params
    })
  }



    //获取班级数据
  export function getClass(params) {
    return request({
     url: '/aiClass/pageQuery',
      method: 'get',
      params
    })
  }

      //获取列表数据详情
  export function getStudentAction(params) {
    return request({
     url: '/aiClass/queryStudentActionByCurriculumId',
      method: 'get',
      params
    })
  }
  export function getTeacherAction(params) {
    return request({
     url: '/aiClass/queryTeacherActionByCurriculumId',
      method: 'get',
      params
    })
  }

    export function getStudentEmotion(params) {
    return request({
     url: '/aiClass/queryStudentEmotionByCurriculumId',
      method: 'get',
      params
    })
  }

  //获取数据总数
  export function getClassCount(params) {
    return request({
      url: '/aiClass/queryCount',
      method: 'get',
      params
    })
  }

  //获取详情列表数据
  export function getDetailList(params) {
    return request({
      url: '/aiClass/queryDetailList',
      method: 'get',
      params
    })
  }

  //获取教员详情数据
  export function getTeacherDetail(params) {
    return request({
      url: '/teacherData/thirtyEight',
      method: 'get',
      params
    })
  }

  //获取学员班级详情数据
  export function getStudentClassDetail(params) {
    return request({
      url: '/studentClass/fiftyTwo',
      method: 'get',
      params
    })
  }
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

  //获取教员抬头率数据
  export function getTeacherHeadupRate(params) {
    return request({
      url: '/teacherData/fortyOne',
      method: 'get',
      params
    })
  }

  //获取教员教授班级列表
  export function getTeacherClassList(params) {
    return request({
      url: '/teacherData/fortyTwo',
      method: 'get',
      params
    })
  }

  //获取教员学员情绪分布数据
  export function getTeacherStudentEmotion(params) {
    return request({
      url: '/teacherData/fortyThree',
      method: 'get',
      params
    })
  }

  //获取教员学员动作分布数据
  export function getTeacherStudentAction(params) {
    return request({
      url: '/teacherData/fortyFour',
      method: 'get',
      params
    })
  }

  //获取学员班级学员动作分布数据
  export function getStudentClassAction(params) {
    return request({
      url: '/studentClass/fiftySix',
      method: 'get',
      params
    })
  }

  //获取学员班级学员情绪分布数据
  export function getStudentClassEmotion(params) {
    return request({
      url: '/studentClass/fiftySeven',
      method: 'get',
      params
    })
  }

  //获取学员班级抬头率数据
  export function getStudentClassHeadupRate(params) {
    return request({
      url: '/studentClass/fiftyThree',
      method: 'get',
      params
    })
  }
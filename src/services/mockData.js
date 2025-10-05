// Mock数据服务 - 模拟动态数据变化

// 生成随机数的工具函数
const randomBetween = (min, max) => {
  return Math.random() * (max - min) + min
}

const randomInt = (min, max) => {
  return Math.floor(randomBetween(min, max + 1))
}

// 颜色列表 - 复用原有项目的颜色
export const colorList = [
  '#FE9A58', '#FD8B8B', '#988DFE', '#6A99D9', '#95DD83', 
  '#82AEFD', '#71D1FD', '#F0B6DF', '#FDA594', '#F34849', 
  '#CB8D63', '#7ABB74', '#FED463', '#59CBD3', '#FEA66D', 
  '#6BC97D', '#54CEBE', '#8FC6FE'
]
// 学员数据
export const getStudentData = async () => {
  try {
    const response = await fetch("http://localhost:8080/student/ten")
    if (!response.ok) {
      throw new Error("网络请求失败")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取学员数据失败:', error)
    // 返回模拟数据
    return Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      name: `学员${index + 1}`,
      class: `班级${randomInt(1, 5)}`,
      attendance: randomBetween(80, 100),
      engagement: randomBetween(70, 95),
      performance: randomBetween(75, 90)
    }))
  }
}

// 教员数据
export const getTeacherData = async () => {
  try {
    const response = await fetch("http://localhost:8080/teacher/ten")
    if (!response.ok) {
      throw new Error("网络请求失败")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取教员数据失败:', error)
    // 返回模拟数据
    return Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      name: `教员${index + 1}`,
      subject: ['语文', '数学', '英语', '物理', '化学'][randomInt(0, 4)],
      classes: randomInt(2, 5),
      students: randomInt(50, 150),
      rating: randomBetween(4.0, 5.0)
    }))
  }
}

// 班级概览数据
export const getClassOverview = async () => {
  try {
    const response = await fetch("http://localhost:8080/class/overview")
    if (!response.ok) {
      throw new Error("网络请求失败")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取班级概览失败:', error)
    return {
      totalClasses: randomInt(20, 30),
      activeClasses: randomInt(15, 25),
      averageAttendance: randomBetween(85, 95),
      averageEngagement: randomBetween(75, 85)
    }
  }
}

// 教室概览数据
export const getClassroomOverview = async () => {
  try {
    const response = await fetch("http://localhost:8080/classroom/overview")
    if (!response.ok) {
      throw new Error("网络请求失败")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取教室概览失败:', error)
    return {
      totalClassrooms: randomInt(15, 25),
      occupiedClassrooms: randomInt(10, 20),
      availableClassrooms: randomInt(5, 10),
      utilizationRate: randomBetween(70, 85)
    }
  }
}

// 课程类型数据
export const getCourseTypes = async () => {
  try {
    const response = await fetch("http://localhost:8080/course/types")
    if (!response.ok) {
      throw new Error("网络请求失败")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取课程类型失败:', error)
    return [
      { name: '理论课', value: randomInt(40, 60), color: colorList[0] },
      { name: '实践课', value: randomInt(20, 35), color: colorList[1] },
      { name: '讨论课', value: randomInt(15, 25), color: colorList[2] },
      { name: '实验课', value: randomInt(10, 20), color: colorList[3] }
    ]
  }
}

// 热门发言课程
export const getTopSpeakingCourses = async () => {
  try {
    const response = await fetch("http://localhost:8080/course/speaking")
    if (!response.ok) {
      throw new Error("网络请求失败")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取热门发言课程失败:', error)
    return Array.from({ length: 5 }, (_, index) => ({
      name: `课程${index + 1}`,
      speakingCount: randomInt(50, 200),
      engagement: randomBetween(80, 95)
    }))
  }
}

// 高参与度班级
export const getTopEngagementClasses = async () => {
  try {
    const response = await fetch("http://localhost:8080/class/engagement")
    if (!response.ok) {
      throw new Error("网络请求失败")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取高参与度班级失败:', error)
    return Array.from({ length: 5 }, (_, index) => ({
      name: `班级${index + 1}`,
      engagement: randomBetween(85, 95),
      students: randomInt(30, 50)
    }))
  }
}

// 班级行为分布
export const getClassActionDistribution = async () => {
  try {
    const response = await fetch("http://localhost:8080/class/actions")
    if (!response.ok) {
      throw new Error("网络请求失败")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取班级行为分布失败:', error)
    return [
      { name: '认真听讲', value: randomInt(60, 80), color: colorList[0] },
      { name: '积极发言', value: randomInt(15, 25), color: colorList[1] },
      { name: '小组讨论', value: randomInt(10, 20), color: colorList[2] },
      { name: '其他活动', value: randomInt(5, 15), color: colorList[3] }
    ]
  }
}

// 班级情绪分布
export const getClassEmotionDistribution = async () => {
  try {
    const response = await fetch("http://localhost:8080/class/emotions")
    if (!response.ok) {
      throw new Error("网络请求失败")
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取班级情绪分布失败:', error)
    return [
      { name: '积极', value: randomInt(70, 85), color: '#52c41a' },
      { name: '中性', value: randomInt(10, 20), color: '#faad14' },
      { name: '消极', value: randomInt(5, 15), color: '#f5222d' }
    ]
  }
}

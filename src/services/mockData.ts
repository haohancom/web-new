// Mock数据服务 - 模拟动态数据变化

// 生成随机数的工具函数
const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(randomBetween(min, max + 1));
};

// 颜色列表 - 复用原有项目的颜色
export const colorList = [
  '#FE9A58', '#FD8B8B', '#988DFE', '#6A99D9', '#95DD83', 
  '#82AEFD', '#71D1FD', '#F0B6DF', '#FDA594', '#F34849', 
  '#CB8D63', '#7ABB74', '#FED463', '#59CBD3', '#FEA66D', 
  '#6BC97D', '#54CEBE', '#8FC6FE'
];

// 今日数据Mock
export const getTodayData = () => {
  return {
    studentEngagementRate: randomBetween(15, 25), // 参与度
    studentActivationRate: randomBetween(30, 40), // 活跃度
    studentExcitementRate: randomBetween(0, 5),   // 兴奋度
    studentFocusRate: randomBetween(70, 85),      // 专注度
    teacherTeachRate: randomBetween(80, 95),      // 教师授课率
    interactionRate: randomBetween(60, 80)        // 互动率
  };
};

// 学员数据Mock
export const getStudentData = () => {
  const actions = [
    { name: '举手', value: randomInt(8, 18) },
    { name: '听讲', value: randomInt(20, 30) },
    { name: '读写', value: randomInt(3, 8) },
    { name: '趴桌子', value: randomInt(2, 7) },
    { name: '转身', value: randomInt(10, 20) },
    { name: '站立', value: randomInt(1, 5) }
  ];

  return {
    totalStudents: randomInt(3200, 3300),
    totalTeachers: randomInt(335, 345),
    courses: randomInt(45, 55),
    actions,
    emotions: [
      { name: '微笑', value: randomInt(1, 5) },
      { name: '愤怒', value: randomInt(8, 15) },
      { name: '悲伤', value: randomInt(15, 25) },
      { name: '厌恶', value: randomInt(2, 6) },
      { name: '害怕', value: randomInt(3, 8) },
      { name: '惊讶', value: randomInt(10, 20) },
      { name: '正常', value: randomInt(1, 3) },
      { name: '大笑', value: randomInt(1, 2) },
      { name: '高兴', value: randomInt(1, 2) },
      { name: '困惑', value: randomInt(1, 3) },
      { name: '尖叫', value: randomInt(1, 2) }
    ]
  };
};

// 教员数据Mock
export const getTeacherData = () => {
  return {
    actions: [
      { name: '背对学生', value: randomInt(1, 3) },
      { name: '走上讲台', value: randomInt(8, 15) },
      { name: '面对学生', value: randomInt(20, 30) },
      { name: '板书', value: randomInt(3, 8) },
      { name: '走动', value: randomInt(4, 10) },
      { name: '走下讲台', value: randomInt(10, 18) },
      { name: '举手', value: randomInt(1, 3) },
      { name: '提问', value: randomInt(1, 3) },
      { name: '学生上讲台', value: randomInt(1, 2) }
    ]
  };
};

// 班级概况数据Mock
export const getClassOverview = () => {
  return [
    { title: '前排就坐率', num: `${randomBetween(85, 95).toFixed(1)}%`, background: '#FED463' },
    { title: '出勤率', num: `${randomBetween(95, 99).toFixed(1)}%`, background: '#59CBD3' },
    { title: '出勤人数', num: randomInt(90, 100), background: '#FEA66D' },
    { title: '抬头次数', num: randomInt(180, 220), background: '#6BC97D' },
    { title: '抬头率', num: `${randomBetween(50, 65).toFixed(1)}%`, background: '#54CEBE' },
    { title: '峰值抬头率', num: `${randomBetween(75, 85).toFixed(1)}%`, background: '#8FC6FE' }
  ];
};

// 课堂概况数据Mock
export const getClassroomOverview = () => {
  return [
    { title: '学生到课率', num: `${randomBetween(85, 98).toFixed(1)}%`, background: '#80B5E2' },
    { title: '学生到课人数', num: randomInt(80, 95), background: '#C572F4' },
    { title: '应到人数', num: randomInt(90, 100), background: '#6D8BEE' },
    { title: '未到人数', num: randomInt(2, 10), background: '#EA5DB3' }
  ];
};

// 课程类型数据Mock
export const getCourseTypes = () => {
  return [
    { value: randomInt(8, 15), name: "练习型" },
    { value: randomInt(6, 12), name: "混合型" },
    { value: randomInt(12, 20), name: "对话型" },
    { value: randomInt(20, 30), name: "讲授型" }
  ];
};

// 发言次数前十课程Mock
export const getTopSpeakingCourses = () => {
  const courses = [
    '训练体能', '马克思主义哲学', '毛泽东思想', '中国特色社会主义', 
    '听党指挥', '军事理论', '计算机基础', '英语听说', '数学分析', '物理实验'
  ];
  
  return courses.slice(0, 10).map(course => ({
    title: course,
    num: randomInt(10, 50)
  }));
};

// 参与度前十班级数据Mock
export const getTopEngagementClasses = () => {
  const classes = [
    '2022级潜艇观通（电子信息工程）指挥班',
    '2022级舰艇指挥班',
    '2023级通信工程班',
    '2023级计算机科学与技术班',
    '2022级电子信息工程班',
    '2023级软件工程班',
    '2022级网络工程班',
    '2023级数据科学与大数据技术班',
    '2022级人工智能班',
    '2023级物联网工程班'
  ];
  
  return classes.slice(0, 10).map(className => ({
    title: className,
    num: randomBetween(75, 95).toFixed(1)
  }));
};

// 班级动作分布数据Mock
export const getClassActionDistribution = () => {
  const classNames = [
    '2022级潜艇观通班', '2022级舰艇指挥班', '2023级通信工程班', 
    '2023级计算机班', '2022级电子班', '2023级软件班',
    '2022级网络班', '2023级数据班', '2022级AI班', '2023级物联网班'
  ];
  
  const actions = ['举手', '听讲', '读写', '趴桌子', '转身', '站立'];
  
  return {
    classList: classNames.slice(0, 10),
    data: actions.map(action => ({
      name: action,
      type: 'line',
      stack: 'Total',
      data: Array.from({ length: 10 }, () => randomInt(5, 25))
    }))
  };
};

// 班级情绪分布数据Mock
export const getClassEmotionDistribution = () => {
  const classNames = [
    '2022级潜艇观通班', '2022级舰艇指挥班', '2023级通信工程班', 
    '2023级计算机班', '2022级电子班', '2023级软件班',
    '2022级网络班', '2023级数据班', '2022级AI班', '2023级物联网班'
  ];
  
  const emotions = ['微笑', '愤怒', '悲伤', '厌恶', '害怕', '惊讶', '正常', '大笑', '高兴', '困惑', '尖叫'];
  
  return {
    classList: classNames.slice(0, 10),
    data: emotions.map(emotion => ({
      name: emotion,
      type: 'line',
      stack: 'Total',
      data: Array.from({ length: 10 }, () => randomInt(0, 15))
    }))
  };
};

// 动态数据更新器
export class DataUpdater {
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: (() => void)[] = [];

  start(interval: number = 5000) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      this.callbacks.forEach(callback => callback());
    }, interval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(callback: () => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }
}

// 创建全局数据更新器实例
export const globalDataUpdater = new DataUpdater();

<template>
  <div class="page-container">
    <div class="header">
      <a-button 
        type="primary" 
        :icon="h(ArrowLeftOutlined)" 
        @click="goHome"
        class="back-button"
      >
        返回首页
      </a-button>
      <h1 class="title">班级数据</h1>
    </div>

    <!-- 筛选框区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-label">开始日期：</label>
          <a-date-picker
            v-model:value="startDate"
            placeholder="选择开始日期"
            format="YYYY-MM-DD"
            @change="onStartDateChange"
            class="date-picker"
          />
        </div>
        <div class="filter-item">
          <label class="filter-label">结束日期：</label>
          <a-date-picker
            v-model:value="endDate"
            placeholder="选择结束日期"
            format="YYYY-MM-DD"
            :disabled-date="disabledEndDate"
            @change="onEndDateChange"
            class="date-picker"
          />
        </div>
        <div class="filter-item">
          <label class="filter-label">课程：</label>
          <a-select
            v-model:value="course"
            placeholder="请先选择日期"
            :disabled="!canSelectCourse"
            @change="onCourseChange"
            class="course-select"
            style="width: 200px"
          >
            <a-select-option
              v-for="courseName in courseList"
              :key="courseName"
              :value="courseName"
            >
              {{ courseName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <!-- 班级信息区域 -->
    <div class="class-info-section" v-if="classList.length > 0">
      <div class="class-info-content">
        当前时间段内，<span class="highlight">{{ course }}</span>班次共<span class="highlight">{{ classList.length }}</span>个小班参与，
        分别是<span class="class-names">{{ displayClassNames }}</span>
      </div>
    </div>

    <!-- 顶部数据卡片 -->
    <div class="data-grid">
      <a-card
        v-for="(item, index) in numList"
        :key="index"
        class="data-card"
        :style="{ '--card-color': item.color }"
      >
        <div class="card-number">
          <span v-if="item.label1">{{ item.num1 }} / </span>
          {{ item.num }}
        </div>
        <div class="card-title">
          <span v-if="item.label1">{{ item.label1 }} / </span>
          {{ item.label }}
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import moment from 'moment'
import service from '@/utils/fetch'
import { colorList } from "../services/mockData";

export default {
  name: 'ClassData',
  components: {
    ArrowLeftOutlined
  },
  data() {
    return {
      h,
      loading: false,
      classData: {},
      studentData: {},
      headupRate: 0, // 学员抬头率
      classList: [], // 班级列表
      // 筛选相关数据
      startDate: null,
      endDate: null,
      course: null,
      courseList: [],
      courseMapping: {}, // 存储课程名到courseId的映射
      columns: [
        {
          title: '班级名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '学员人数',
          dataIndex: 'studentCount',
          key: 'studentCount'
        },
        {
          title: '教员',
          dataIndex: 'teacher',
          key: 'teacher'
        },
        {
          title: '出勤率',
          dataIndex: 'attendanceRate',
          key: 'attendanceRate',
          customRender: ({ text }) => `${text}%`
        },
        {
          title: '参与度',
          dataIndex: 'engagementRate',
          key: 'engagementRate',
          customRender: ({ text }) => `${text}%`
        },
        {
          title: '满意度',
          dataIndex: 'satisfactionRate',
          key: 'satisfactionRate',
          customRender: ({ text }) => `${text}%`
        }
      ]
    }
  },
  computed: {
    canSelectCourse() {
      return this.startDate && this.endDate
    },
    displayClassNames() {
      if (!this.classList || this.classList.length === 0) {
        return ''
      }
      
      // 最多显示10个班级名
      const displayClasses = this.classList.slice(0, 10)
      let result = displayClasses.join('小班、')
      
      // 如果超过10个，添加省略号
      if (this.classList.length > 10) {
        result += '小班等'
      } else {
        result += '小班'
      }
      
      return result
    },
    numList() {
      return [
        {
          label: "学员人数",
          num: this.studentData?.totalStudents || 0,
          label1: "教员人数",
          num1: this.studentData?.totalTeachers || 0,
          color: colorList[0],
        },
        {
          label: "学员参与度",
          num: this.classData && this.classData.studentEngagementRate !== null && this.classData.studentEngagementRate !== undefined
            ? `${Number(this.classData.studentEngagementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[1],
        },
        {
          label: "学员兴奋度",
          num: this.classData && this.classData.studentExcitementRate !== null && this.classData.studentExcitementRate !== undefined
            ? `${Number(this.classData.studentExcitementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[2],
        },
        {
          label: "学员抬头率",
          num: this.headupRate !== null && this.headupRate !== undefined 
            ? `${Number(this.headupRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[3],
        },
        {
          label: "学员活跃度",
          num: this.classData && this.classData.studentActivationRate !== null && this.classData.studentActivationRate !== undefined
            ? `${Number(this.classData.studentActivationRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[4],
        },
        {
          label: "课程数",
          num: this.studentData?.courses || 0,
          color: colorList[5],
        },
      ];
    },
  },
  async mounted() {
    await this.loadClassData()
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    // 日期选择相关方法
    onStartDateChange(date) {
      this.startDate = date
      // 如果开始日期晚于结束日期，清空结束日期
      if (this.endDate && date && moment(date).isAfter(moment(this.endDate))) {
        this.endDate = null
        this.course = null
        this.courseList = []
        this.courseMapping = {}
      }
    },
    onEndDateChange(date) {
      this.endDate = date
      // 当两个日期都选择后，获取课程列表
      if (this.startDate && this.endDate) {
        this.fetchCourseList()
      } else {
        this.course = null
        this.courseList = []
        this.courseMapping = {}
        this.headupRate = 0
        this.classList = []
      }
    },
    onCourseChange(value) {
      this.course = value
      console.log('选择的课程:', value)
      // 重置抬头率和班级列表
      this.headupRate = 0
      this.classList = []
      // 选择课程后获取班级数据
      if (value) {
        this.fetchClassData()
      }
    },
    // 禁用结束日期（不能早于开始日期）
    disabledEndDate(current) {
      if (!this.startDate) {
        return false
      }
      return current && moment(current).isBefore(moment(this.startDate).startOf('day'))
    },
    // 获取课程列表
    async fetchCourseList() {
      if (!this.startDate || !this.endDate) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        
        const response = await service({
          method: 'get',
          url: '/aiClass/queryCourse',
          params: {
            startDate: startDateStr,
            endDate: endDateStr
          }
        })
        
        // 处理新的响应格式：{"courseId":"{courseName}","courseId":"{courseName}"}
        // 提取所有的 courseName 值，并保存映射关系
        if (response && typeof response === 'object') {
          this.courseList = Object.values(response) || []
          // 保存课程名到courseId的映射
          this.courseMapping = {}
          Object.entries(response).forEach(([courseId, courseName]) => {
            this.courseMapping[courseName] = courseId
          })
        } else {
          this.courseList = []
          this.courseMapping = {}
        }
      } catch (error) {
        console.error('获取课程列表出错:', error)
        this.courseList = []
      }
    },
    // 获取班级数据
    async fetchClassData() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/twentyFive',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 更新班级数据
        this.classData = response || {}
        
        // 模拟学员和教员数据（实际项目中应该从其他接口获取）
        this.studentData = {
          totalStudents: 120,
          totalTeachers: 8,
        }
        
        // 获取学员抬头率
        await this.fetchHeadupRate()
        
        // 获取班级列表
        await this.fetchClassList()
        
      } catch (error) {
        console.error('获取班级数据出错:', error)
        this.classData = {}
      }
    },
    // 获取学员抬头率
    async fetchHeadupRate() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/twentySix',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 更新学员抬头率数据
        this.headupRate = response || 0
        
      } catch (error) {
        console.error('获取学员抬头率出错:', error)
        this.headupRate = 0
      }
    },
    // 获取班级列表
    async fetchClassList() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/twentySeven',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 更新班级列表数据
        this.classList = Array.isArray(response) ? response : []
        
      } catch (error) {
        console.error('获取班级列表出错:', error)
        this.classList = []
      }
    },
    async loadClassData() {
      this.loading = true
      try {
        // 初始化时加载一些默认数据
        this.studentData = {
          totalStudents: 0,
          totalTeachers: 0,
          courses: 0
        }
      } catch (error) {
        console.error('加载班级数据失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  min-height: 100vh;
  background: var(--background-color);
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  margin-right: 16px;
}

.title {
  margin: 0;
  color: var(--primary-color);
  font-size: 24px;
  font-weight: bold;
}


/* 筛选框样式 */
.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  min-width: 80px;
}

.date-picker {
  width: 180px;
}

.course-select {
  min-width: 200px;
}

/* 班级信息区域样式 */
.class-info-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #1890ff;
}

.class-info-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.highlight {
  color: #1890ff;
  font-weight: bold;
}

.class-names {
  color: #666;
  font-weight: 500;
}

/* 数据网格样式 */
.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .data-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .data-grid {
    grid-template-columns: 1fr;
  }
}

.data-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(5, 109, 232, 0.15);
}

.data-card::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--card-color);
}

.card-number {
  color: var(--card-color);
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-title {
  font-size: 16px;
  color: #7c7c7c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .filter-item {
    width: 100%;
    justify-content: space-between;
  }
  
  .date-picker,
  .course-select {
    width: 100%;
    max-width: 300px;
  }
}
</style>

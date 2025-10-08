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

    <a-card class="data-card">
      <div class="card-title">班级数据概览</div>
      <a-table 
        :columns="columns" 
        :data-source="classData" 
        :pagination="false"
        :loading="loading"
      />
    </a-card>
  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import moment from 'moment'
import service from '@/utils/fetch'

export default {
  name: 'ClassData',
  components: {
    ArrowLeftOutlined
  },
  data() {
    return {
      h,
      loading: false,
      classData: [],
      // 筛选相关数据
      startDate: null,
      endDate: null,
      course: null,
      courseList: [],
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
    }
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
      }
    },
    onCourseChange(value) {
      this.course = value
      console.log('选择的课程:', value)
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
        // 提取所有的 courseName 值
        if (response && typeof response === 'object') {
          this.courseList = Object.values(response) || []
        } else {
          this.courseList = []
        }
      } catch (error) {
        console.error('获取课程列表出错:', error)
        this.courseList = []
      }
    },
    async loadClassData() {
      this.loading = true
      try {
        // 模拟数据
        this.classData = Array.from({ length: 10 }, (_, index) => ({
          key: index + 1,
          name: `班级${index + 1}`,
          studentCount: Math.floor(Math.random() * 30) + 20,
          teacher: `教员${index + 1}`,
          attendanceRate: (Math.random() * 20 + 80).toFixed(1),
          engagementRate: (Math.random() * 25 + 70).toFixed(1),
          satisfactionRate: (Math.random() * 15 + 80).toFixed(1)
        }))
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

.data-card {
  background: #f7f8fa;
  border-radius: 10px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  position: relative;
  margin-bottom: 20px;
  padding-left: 14px;
}

.card-title::after {
  content: '';
  position: absolute;
  height: 100%;
  width: 4px;
  border-radius: 2px;
  background: #1890ff;
  left: 0;
  top: 0;
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

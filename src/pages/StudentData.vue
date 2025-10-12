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
      <h1 class="title">学员数据</h1>
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
          <label class="filter-label">学员班级：</label>
          <a-select
            v-model:value="studentClass"
            placeholder="请先选择日期"
            :disabled="!canSelectStudentClass"
            @change="onStudentClassChange"
            class="student-class-select"
            style="width: 200px"
          >
            <a-select-option
              v-for="className in studentClassList"
              :key="className"
              :value="className"
            >
              {{ className }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import moment from 'moment'
import service from '@/utils/fetch'
import { getStudentClass } from '@/api/aiClass'

export default {
  name: 'StudentData',
  components: {
    ArrowLeftOutlined
  },
  data() {
    return {
      h,
      // 筛选相关数据
      startDate: null,
      endDate: null,
      studentClass: null,
      studentClassList: [],
      studentClassMapping: {}, // 存储班级名到studentClassId的映射
    }
  },
  computed: {
    canSelectStudentClass() {
      return this.startDate && this.endDate
    }
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
        this.studentClass = null
        this.studentClassList = []
        this.studentClassMapping = {}
      } else if (this.startDate && this.endDate) {
        // 如果两个日期都存在，重新获取学员班级列表
        this.fetchStudentClassList()
      }
    },
    onEndDateChange(date) {
      this.endDate = date
      // 当两个日期都选择后，获取学员班级列表
      if (this.startDate && this.endDate) {
        this.fetchStudentClassList()
      } else {
        this.studentClass = null
        this.studentClassList = []
        this.studentClassMapping = {}
      }
    },
    onStudentClassChange(value) {
      this.studentClass = value
      console.log('选择的学员班级:', value)
      // 选择学员班级后可以在这里添加获取学员数据的逻辑
      if (value) {
        this.fetchStudentData()
      }
    },
    // 禁用结束日期（不能早于开始日期）
    disabledEndDate(current) {
      if (!this.startDate) {
        return false
      }
      return current && moment(current).isBefore(moment(this.startDate).startOf('day'))
    },
    // 获取学员班级列表
    async fetchStudentClassList() {
      if (!this.startDate || !this.endDate) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        
        const response = await service({
          method: 'get',
          url: '/aiClass/queryStudentClass',
          params: {
            startDate: startDateStr,
            endDate: endDateStr
          }
        })
        
        // 处理响应格式：{"studentClassId":"{studentClassName}","studentClassId":"{studentClassName}"}
        if (response && typeof response === 'object') {
          this.studentClassList = Object.values(response) || []
          // 保存班级名到studentClassId的映射
          this.studentClassMapping = {}
          Object.entries(response).forEach(([studentClassId, studentClassName]) => {
            this.studentClassMapping[studentClassName] = studentClassId
          })
        } else {
          this.studentClassList = []
          this.studentClassMapping = {}
        }
      } catch (error) {
        console.error('获取学员班级列表出错:', error)
        this.studentClassList = []
      }
    },
    // 获取学员数据
    async fetchStudentData() {
      if (!this.startDate || !this.endDate || !this.studentClass) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const studentClassId = this.studentClassMapping[this.studentClass]
        
        if (!studentClassId) {
          console.error('未找到对应的studentClassId:', this.studentClass)
          return
        }
        
        // 这里可以添加获取具体学员数据的API调用
        console.log('获取学员数据:', {
          startDate: startDateStr,
          endDate: endDateStr,
          studentClassId: studentClassId
        })
        
      } catch (error) {
        console.error('获取学员数据出错:', error)
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

.student-class-select {
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
  .student-class-select {
    width: 100%;
    max-width: 300px;
  }
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
</style>

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
      <h1 class="title">教员数据</h1>
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
          <label class="filter-label">教员：</label>
          <a-select
            v-model:value="teacher"
            placeholder="请先选择日期"
            :disabled="!canSelectTeacher"
            @change="onTeacherChange"
            class="teacher-select"
            style="width: 200px"
          >
            <a-select-option
              v-for="teacherName in teacherList"
              :key="teacherName"
              :value="teacherName"
            >
              {{ teacherName }}
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
import { getTeacher } from '@/api/aiClass'

export default {
  name: 'TeacherData',
  components: {
    ArrowLeftOutlined
  },
  data() {
    return {
      h,
      // 筛选相关数据
      startDate: null,
      endDate: null,
      teacher: null,
      teacherList: [],
      teacherMapping: {}, // 存储教员名到teacherId的映射
    }
  },
  computed: {
    canSelectTeacher() {
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
        this.teacher = null
        this.teacherList = []
        this.teacherMapping = {}
      } else if (this.startDate && this.endDate) {
        // 如果两个日期都存在，重新获取教员列表
        this.fetchTeacherList()
      }
    },
    onEndDateChange(date) {
      this.endDate = date
      // 当两个日期都选择后，获取教员列表
      if (this.startDate && this.endDate) {
        this.fetchTeacherList()
      } else {
        this.teacher = null
        this.teacherList = []
        this.teacherMapping = {}
      }
    },
    onTeacherChange(value) {
      this.teacher = value
      console.log('选择的教员:', value)
      // 选择教员后可以在这里添加获取教员数据的逻辑
      if (value) {
        this.fetchTeacherData()
      }
    },
    // 禁用结束日期（不能早于开始日期）
    disabledEndDate(current) {
      if (!this.startDate) {
        return false
      }
      return current && moment(current).isBefore(moment(this.startDate).startOf('day'))
    },
    // 获取教员列表
    async fetchTeacherList() {
      if (!this.startDate || !this.endDate) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        
        const response = await service({
          method: 'get',
          url: '/aiClass/queryTeacher',
          params: {
            startDate: startDateStr,
            endDate: endDateStr
          }
        })
        
        // 处理响应格式：{"teacherId":"{teacherName}","teacherId":"{teacherName}"}
        if (response && typeof response === 'object') {
          this.teacherList = Object.values(response) || []
          // 保存教员名到teacherId的映射
          this.teacherMapping = {}
          Object.entries(response).forEach(([teacherId, teacherName]) => {
            this.teacherMapping[teacherName] = teacherId
          })
        } else {
          this.teacherList = []
          this.teacherMapping = {}
        }
      } catch (error) {
        console.error('获取教员列表出错:', error)
        this.teacherList = []
      }
    },
    // 获取教员数据
    async fetchTeacherData() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        // 这里可以添加获取具体教员数据的API调用
        console.log('获取教员数据:', {
          startDate: startDateStr,
          endDate: endDateStr,
          teacherId: teacherId
        })
        
      } catch (error) {
        console.error('获取教员数据出错:', error)
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

.teacher-select {
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
  .teacher-select {
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

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

    <!-- 教员班级信息区域 -->
    <div class="teacher-info-section" v-if="teacher">
      <div class="teacher-info-content">
        <span v-if="teacherClassList.length > 0">
          当前时间段内，<span class="highlight">{{ teacher }}</span>老师共教授<span class="highlight">{{ teacherClassList.length }}</span>个小班，
          教授班级为: <span class="class-names">{{ displayTeacherClassNames }}</span>
        </span>
        <span v-else>
          当前时间段内，<span class="highlight">{{ teacher }}</span>老师无教授班级
        </span>
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
          {{ item.num }}
        </div>
        <div class="card-title">
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
import { getTeacher, getTeacherDetail, getTeacherHeadupRate } from '@/api/aiClass'
import { colorList } from '../services/mockData'

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
      // 教员详情数据
      teacherDetail: {},
      // 教员抬头率数据
      headupRate: 0,
      // 教员教授班级列表
      teacherClassList: [],
    }
  },
  computed: {
    canSelectTeacher() {
      return this.startDate && this.endDate
    },
    displayTeacherClassNames() {
      if (!this.teacherClassList || this.teacherClassList.length === 0) {
        return ''
      }
      
      // 最多显示10个班级名
      const displayClasses = this.teacherClassList.slice(0, 10)
      let result = displayClasses.join('小班、')
      
      // 如果超过10个，添加省略号
      if (this.teacherClassList.length > 10) {
        result += '小班等'
      } else {
        result += '小班'
      }
      
      return result
    },
    numList() {
      return [
        {
          label: "学员参与度",
          num: this.teacherDetail && this.teacherDetail.studentEngagementRate !== null && this.teacherDetail.studentEngagementRate !== undefined
            ? `${Number(this.teacherDetail.studentEngagementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[1],
        },
        {
          label: "学员活跃度",
          num: this.teacherDetail && this.teacherDetail.studentActivationRate !== null && this.teacherDetail.studentActivationRate !== undefined
            ? `${Number(this.teacherDetail.studentActivationRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[4],
        },
        {
          label: "学员兴奋度",
          num: this.teacherDetail && this.teacherDetail.studentExcitementRate !== null && this.teacherDetail.studentExcitementRate !== undefined
            ? `${Number(this.teacherDetail.studentExcitementRate).toFixed(1)}%`
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
      ];
    },
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
        
        const response = await service({
          method: 'get',
          url: '/teacherData/thirtyEight',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 更新教员详情数据
        this.teacherDetail = response || {}
        
        // 获取教员抬头率数据
        await this.fetchTeacherHeadupRate()
        
        // 获取教员教授班级列表
        await this.fetchTeacherClassList()
        
      } catch (error) {
        console.error('获取教员数据出错:', error)
        this.teacherDetail = {}
      }
    },
    // 获取教员抬头率数据
    async fetchTeacherHeadupRate() {
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
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortyOne',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 更新教员抬头率数据
        this.headupRate = response || 0
        
      } catch (error) {
        console.error('获取教员抬头率出错:', error)
        this.headupRate = 0
      }
    },
    // 获取教员教授班级列表
    async fetchTeacherClassList() {
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
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortyTwo',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 更新教员教授班级列表数据
        this.teacherClassList = Array.isArray(response) ? response : []
        
      } catch (error) {
        console.error('获取教员教授班级列表出错:', error)
        this.teacherClassList = []
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

/* 教员班级信息区域样式 */
.teacher-info-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #1890ff;
}

.teacher-info-content {
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

.old-data-card {
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

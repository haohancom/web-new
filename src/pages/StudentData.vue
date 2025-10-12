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

    <!-- 图表区域 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">学员动作分布</div>
        <v-chart
          id="studentClassActionChart"
          :option="studentActionOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">学员情绪分布</div>
        <v-chart
          id="studentClassEmotionChart"
          :option="studentEmotionOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>
    </div>

  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import moment from 'moment'
import service from '@/utils/fetch'
import { getStudentClass, getStudentClassDetail, getStudentClassHeadupRate, getStudentClassAction, getStudentClassEmotion } from '@/api/aiClass'
import { colorList } from '../services/mockData'
import * as echarts from "echarts"
import VChart from "vue-echarts"

export default {
  name: 'StudentData',
  components: {
    ArrowLeftOutlined,
    VChart
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
      // 学员班级详情数据
      studentClassDetail: {},
      // 学员班级抬头率数据
      headupRate: 0,
      // 图表相关数据
      studentActionOptions: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "学员动作分布",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
      studentEmotionOptions: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "学员情绪分布",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
    }
  },
  computed: {
    canSelectStudentClass() {
      return this.startDate && this.endDate
    },
    numList() {
      return [
        {
          label: "学员参与度",
          num: this.studentClassDetail && this.studentClassDetail.studentEngagementRate !== null && this.studentClassDetail.studentEngagementRate !== undefined
            ? `${Number(this.studentClassDetail.studentEngagementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[1],
        },
        {
          label: "学员活跃度",
          num: this.studentClassDetail && this.studentClassDetail.studentActivationRate !== null && this.studentClassDetail.studentActivationRate !== undefined
            ? `${Number(this.studentClassDetail.studentActivationRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[4],
        },
        {
          label: "学员兴奋度",
          num: this.studentClassDetail && this.studentClassDetail.studentExcitementRate !== null && this.studentClassDetail.studentExcitementRate !== undefined
            ? `${Number(this.studentClassDetail.studentExcitementRate).toFixed(1)}%`
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
        
        const response = await service({
          method: 'get',
          url: '/studentClass/fiftyTwo',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            studentClassId: studentClassId
          }
        })
        
        // 更新学员班级详情数据
        this.studentClassDetail = response || {}
        
        // 获取学员班级抬头率数据
        await this.fetchStudentClassHeadupRate()
        
        // 获取学员动作分布数据
        await this.fetchStudentClassActionData()
        
        // 获取学员情绪分布数据
        await this.fetchStudentClassEmotionData()
        
      } catch (error) {
        console.error('获取学员数据出错:', error)
        this.studentClassDetail = {}
      }
    },
    // 获取学员班级抬头率数据
    async fetchStudentClassHeadupRate() {
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
        
        const response = await service({
          method: 'get',
          url: '/studentClass/fiftyThree',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            studentClassId: studentClassId
          }
        })
        
        // 更新学员班级抬头率数据
        this.headupRate = response || 0
        
      } catch (error) {
        console.error('获取学员班级抬头率出错:', error)
        this.headupRate = 0
      }
    },
    // 获取学员班级学员动作分布数据
    async fetchStudentClassActionData() {
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
        
        const response = await service({
          method: 'get',
          url: '/studentClass/fiftySix',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            studentClassId: studentClassId
          }
        })
        
        // 处理响应数据，过滤掉null值的动作
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 更新图表数据
        this.studentActionOptions.series[0].data = filteredData
        
        // 手动更新图表
        this.$nextTick(() => {
          const chart = echarts.init(document.getElementById('studentClassActionChart'))
          if (chart) {
            chart.setOption(this.studentActionOptions)
          }
        })
        
      } catch (error) {
        console.error('获取学员班级学员动作分布数据出错:', error)
        this.studentActionOptions.series[0].data = []
      }
    },
    // 获取学员班级学员情绪分布数据
    async fetchStudentClassEmotionData() {
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
        
        const response = await service({
          method: 'get',
          url: '/studentClass/fiftySeven',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            studentClassId: studentClassId
          }
        })
        
        // 处理响应数据，过滤掉null值的情绪
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 更新图表数据
        this.studentEmotionOptions.series[0].data = filteredData
        
        // 手动更新图表
        this.$nextTick(() => {
          const chart = echarts.init(document.getElementById('studentClassEmotionChart'))
          if (chart) {
            chart.setOption(this.studentEmotionOptions)
          }
        })
        
      } catch (error) {
        console.error('获取学员班级学员情绪分布数据出错:', error)
        this.studentEmotionOptions.series[0].data = []
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

/* 图表网格样式 */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .chart-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: #f7f8fa;
  border-radius: 10px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  position: relative;
  margin-bottom: 20px;
  padding-left: 14px;
}

.chart-title::after {
  content: "";
  position: absolute;
  height: 100%;
  width: 4px;
  border-radius: 2px;
  background: #1890ff;
  left: 0;
  top: 0;
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

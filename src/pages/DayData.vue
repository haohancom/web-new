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
      <h1 class="title">今日数据</h1>
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

    <!-- 图表区域 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">学员动作分布</div>
        <v-chart 
          :option="studentActionOptions" 
          style="height: 280px"
        />
      </a-card>
      
      <a-card class="chart-card">
        <div class="chart-title">教员动作分布</div>
        <v-chart 
          :option="teacherActionOptions" 
          style="height: 280px"
        />
      </a-card>
      
      <a-card class="chart-card">
        <div class="chart-title">教员情绪分布</div>
        <v-chart 
          :option="teacherEmotionOptions" 
          style="height: 280px"
        />
      </a-card>
    </div>

    <!-- 发言次数前十课程 -->
    <a-card class="chart-card" style="margin-bottom: 20px;">
      <div class="chart-title">课程发言次数分布</div>
      <v-chart 
        :option="speakingOptions" 
        style="height: 280px"
      />
    </a-card>

    <!-- 底部图表区域 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">发言次数前十课程</div>
        <v-chart 
          :option="speakingOptions" 
          style="height: 280px"
        />
      </a-card>
      
      <a-card class="chart-card">
        <div class="chart-title">参与度前十班级动作分布</div>
        <v-chart 
          :option="actionDistributionOptions" 
          style="height: 280px"
        />
      </a-card>
      
      <a-card class="chart-card">
        <div class="chart-title">兴奋度前十班级情绪分布</div>
        <v-chart 
          :option="emotionDistributionOptions" 
          style="height: 280px"
        />
      </a-card>
      
      <a-card class="chart-card">
        <div class="chart-title">参与度前十班级对比</div>
        <v-chart 
          :option="engagementOptions" 
          style="height: 280px"
        />
      </a-card>
    </div>

    <!-- 概况区域 -->
    <div class="overview-grid">
      <a-card class="overview-card">
        <div class="overview-title">班级概况</div>
        <div class="item-grid" style="grid-template-columns: repeat(3, 1fr);">
          <div 
            v-for="(item, index) in classOverview" 
            :key="index" 
            class="overview-item"
            :style="{ background: item.background }"
          >
            <div class="item-number">{{ item.num }}</div>
            <div class="item-title">{{ item.title }}</div>
          </div>
        </div>
      </a-card>
      
      <a-card class="overview-card">
        <div class="overview-title">课堂概况</div>
        <div class="item-grid" style="grid-template-columns: repeat(2, 1fr);">
          <div 
            v-for="(item, index) in classroomOverview" 
            :key="index" 
            class="overview-item"
            :style="{ background: item.background }"
          >
            <div class="item-number">{{ item.num }}</div>
            <div class="item-title">{{ item.title }}</div>
          </div>
        </div>
      </a-card>
      
      <a-card class="overview-card">
        <div class="overview-title">课堂类型</div>
        <div style="padding: 20px;">
          <v-chart 
            :option="courseTypeOptions" 
            style="height: 280px"
          />
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import VChart from 'vue-echarts'
import {
  colorList
} from '../services/mockData'

export default {
  name: 'DayData',
  components: {
    VChart,
    ArrowLeftOutlined
  },
  data() {
    return {
      todayData: null,
      studentData: null,
      teacherData: null,
      classOverview: null,
      classroomOverview: null,
      courseTypes: null,
      topSpeakingCourses: null,
      topEngagementClasses: null,
      classActionDistribution: null,
      classEmotionDistribution: null,
      h
    }
  },
  computed: {
    numList() {
      return [
        { 
          label: '学员人数', 
          num: this.studentData?.totalStudents || 0, 
          label1: '教员人数', 
          num1: this.studentData?.totalTeachers || 0,
          color: colorList[0]
        },
        { 
          label: '学员参与度', 
          num: this.todayData
              ? `${(Number(this.todayData.studentEngagementRate)).toFixed(1)}%`
              : '0.0%',
          color: colorList[1]
        },
        { 
          label: '学员兴奋度',
          num: this.todayData
              ? `${(Number(this.todayData.studentExcitementRate)).toFixed(1)}%`
              : '0.0%',
          color: colorList[2]
        },
        { 
          label: '学员抬头率', 
          num: this.todayData ? `${this.todayData.studentFocusRate?.toFixed(1) || 0}%` : '0.0%',
          color: colorList[3]
        },
        { 
          label: '学员活跃度',
          num: this.todayData
              ? `${(Number(this.todayData.studentActivationRate)).toFixed(1)}%`
              : '0.0%',
          color: colorList[4]
        },
        { 
          label: '课程数', 
          num: this.studentData?.courses || 0,
          color: colorList[5]
        }
      ]
    },
    studentActionOptions() {
      if (!this.studentData?.actions) return {}
      return {
        tooltip: { trigger: 'item' },
        legend: {
          orient: 'vertical',
          top: 'center',
          right: 0,
          data: this.studentData.actions.map(item => item.name)
        },
        series: [{
          type: 'pie',
          radius: ['70%', '96%'],
          left: 'center',
          center: [40, 'center'],
          data: this.studentData.actions,
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    },
    teacherActionOptions() {
      if (!this.teacherData?.actions) return {}
      return {
        tooltip: { trigger: 'item' },
        legend: {
          orient: 'vertical',
          top: 'center',
          right: 0,
          data: this.teacherData.actions.map(item => item.name)
        },
        series: [{
          type: 'pie',
          radius: ['70%', '96%'],
          left: 'center',
          center: [40, 'center'],
          data: this.teacherData.actions,
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    },
    teacherEmotionOptions() {
      if (!this.studentData?.emotions) return {}
      return {
        tooltip: { trigger: 'item' },
        legend: {
          orient: 'vertical',
          top: 'center',
          right: 0,
          data: this.studentData.emotions.map(item => item.name)
        },
        series: [{
          type: 'pie',
          radius: ['70%', '96%'],
          left: 'center',
          center: [40, 'center'],
          data: this.studentData.emotions,
          label: { show: false },
          labelLine: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    },
    speakingOptions() {
      if (!this.topSpeakingCourses) return {}
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              width: 26,
              color: 'rgba(150,150,150,0.3)'
            }
          }
        },
        color: ['#71D1FD'],
        xAxis: {
          type: 'category',
          name: '课程名',
          nameGap: 1,
          data: this.topSpeakingCourses.map(item => item.title),
          axisLabel: {
            rotate: 20,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '发言次数',
          minInterval: 1,
          min: 0
        },
        series: [{
          data: this.topSpeakingCourses.map(item => item.num),
          type: 'bar',
          barWidth: 20
        }]
      }
    },
    engagementOptions() {
      if (!this.topEngagementClasses) return {}
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              width: 26,
              color: 'rgba(150,150,150,0.3)'
            }
          }
        },
        color: ['#71D1FD'],
        xAxis: {
          type: 'category',
          name: '班级名',
          nameGap: 1,
          data: this.topEngagementClasses.map(item => item.title),
          axisLabel: {
            rotate: 20,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '参与度/%',
          minInterval: 1,
          min: 0
        },
        series: [{
          data: this.topEngagementClasses.map(item => parseFloat(item.num)),
          type: 'bar',
          barWidth: 20
        }]
      }
    },
    actionDistributionOptions() {
      if (!this.classActionDistribution) return {}
      return {
        tooltip: { trigger: 'axis' },
        legend: {
          data: this.classActionDistribution.data.map(item => item.name)
        },
        xAxis: {
          type: 'category',
          data: this.classActionDistribution.classList,
          axisLabel: {
            rotate: 20,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          splitNumber: 8
        },
        series: this.classActionDistribution.data
      }
    },
    emotionDistributionOptions() {
      if (!this.classEmotionDistribution) return {}
      return {
        tooltip: { trigger: 'axis' },
        legend: {
          data: this.classEmotionDistribution.data.map(item => item.name)
        },
        xAxis: {
          type: 'category',
          data: this.classEmotionDistribution.classList,
          axisLabel: {
            rotate: 20,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          splitNumber: 8
        },
        series: this.classEmotionDistribution.data
      }
    },
    courseTypeOptions() {
      if (!this.courseTypes) return {}
      return {
        tooltip: { trigger: "item" },
        legend: {
          top: "5%",
          left: "center",
          textStyle: { color: "#333" }
        },
        series: [{
          name: "学习类型",
          type: "pie",
          radius: ["45%", "60%"],
          center: ['50%', '55%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "outside",
            formatter: (params) => `${params.name}: ${params.percent.toFixed(1)}%`,
            color: '#333'
          },
          data: this.courseTypes
        }],
        color: ["#4a90e2", "#50e3c2", "#f5a623", "#ff4c4c"]
      }
    }
  },
  async mounted() {
    await this.initData()
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    async initData() {
      try {
        this.todayData = {
          ...this.todayData,
          ...(await this.ten() || {})
        }
        this.studentData = studentData
        this.teacherData = teacherData
        this.classOverview = classOverview
        this.classroomOverview = classroomOverview
        this.courseTypes = courseTypes
        this.topSpeakingCourses = topSpeakingCourses
        this.topEngagementClasses = topEngagementClasses
        this.classActionDistribution = classActionDistribution
        this.classEmotionDistribution = classEmotionDistribution
      } catch (error) {
        console.error('初始化数据失败:', error)
      }
    },

    async ten() {
      try {
        const response = await fetch("http://localhost:8080/today/ten")
        if (!response.ok) {
          throw new Error("网络请求失败")
        }
        const data = await response.json()

        // 只取需要的字段
        return {
          studentEngagementRate: data.studentEngagementRate || 0,
          studentExcitementRate: data.studentExcitementRate || 0,
          studentActivationRate: data.studentActivationRate || 0,
        }
      } catch (error) {
        console.error('获取今日数据失败:', error)
        return {
          studentEngagementRate: 0,
          studentExcitementRate: 0,
          studentActivationRate: 0,
        }
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

.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  content: '';
  position: absolute;
  height: 100%;
  width: 4px;
  border-radius: 2px;
  background: #1890ff;
  left: 0;
  top: 0;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1200px) {
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

.overview-card {
  padding: 0;
}

.overview-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  position: relative;
  margin-bottom: 20px;
  padding: 10px 20px 0;
}

.overview-title::after {
  content: '';
  position: absolute;
  height: 100%;
  width: 4px;
  border-radius: 2px;
  background: #1890ff;
  left: 14px;
  top: 0;
}

.item-grid {
  display: grid;
  gap: 20px;
  padding: 20px;
}

.overview-item {
  border-radius: 8px;
  height: 120px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-number {
  color: #fff;
  font-size: 26px;
  line-height: 42px;
  margin-bottom: 5px;
}

.item-title {
  color: #333;
  font-weight: bold;
  font-size: 20px;
}
</style>

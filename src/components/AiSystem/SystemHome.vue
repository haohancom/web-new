<template>
  <div class="container">
    <a-row :gutter="16">
      <a-col :span="6" v-for="(stat, index) in stats" :key="index">
        <a-card class="stat-card" :style="{ '--card-color': stat.color }">
          <a-statistic
            :title="stat.title"
            :value="stat.value"
            :suffix="stat.suffix"
            :value-style="{ color: stat.color }"
          />
          <div class="progress-container">
            <a-progress 
              :percent="stat.progress" 
              :stroke-color="stat.color"
              :show-info="false"
            />
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 20px;">
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">学员行为分析</div>
          <v-chart :option="behaviorOptions" style="height: 300px" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">教学质量评估</div>
          <v-chart :option="qualityOptions" style="height: 300px" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-top: 20px;">
      <a-col :span="24">
        <a-card class="chart-card">
          <div class="chart-title">课堂活跃度趋势</div>
          <v-chart :option="trendOptions" style="height: 300px" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VChart from 'vue-echarts'

export default {
  name: 'SystemHome',
  components: {
    VChart
  },
  data() {
    return {
      stats: [
        {
          title: '活跃学员',
          value: 856,
          suffix: '人',
          progress: 85,
          color: '#1890ff'
        },
        {
          title: '在线课程',
          value: 24,
          suffix: '门',
          progress: 80,
          color: '#52c41a'
        },
        {
          title: '教学质量',
          value: 92,
          suffix: '%',
          progress: 92,
          color: '#faad14'
        },
        {
          title: '系统健康度',
          value: 98,
          suffix: '%',
          progress: 98,
          color: '#f5222d'
        }
      ],
      behaviorOptions: {
        tooltip: { trigger: 'item' },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [{
          name: '行为分析',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 40, name: '认真听讲' },
            { value: 25, name: '积极发言' },
            { value: 20, name: '小组讨论' },
            { value: 15, name: '其他活动' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      },
      qualityOptions: {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100
        },
        series: [{
          data: [85, 88, 92, 90, 87, 89, 91],
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(24, 144, 255, 0.3)'
              }, {
                offset: 1, color: 'rgba(24, 144, 255, 0.1)'
              }]
            }
          }
        }]
      },
      trendOptions: {
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['参与度', '活跃度', '满意度']
        },
        xAxis: {
          type: 'category',
          data: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00']
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100
        },
        series: [
          {
            name: '参与度',
            type: 'line',
            data: [75, 82, 88, 85, 90, 87],
            smooth: true
          },
          {
            name: '活跃度',
            type: 'line',
            data: [70, 78, 85, 82, 88, 85],
            smooth: true
          },
          {
            name: '满意度',
            type: 'line',
            data: [80, 85, 90, 88, 92, 89],
            smooth: true
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(5, 109, 232, 0.15);
}

.stat-card::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--card-color);
}

.progress-container {
  margin-top: 10px;
}

.chart-card {
  margin-bottom: 20px;
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
</style>

<template>
  <div class="container">
    <a-card class="chart-card">
      <div class="chart-title">教学质量评估</div>
      <v-chart :option="qualityOptions" style="height: 400px" />
    </a-card>

    <a-row :gutter="16" style="margin-top: 20px;">
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">教学效果评分</div>
          <v-chart :option="effectOptions" style="height: 300px" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">学员反馈</div>
          <v-chart :option="feedbackOptions" style="height: 300px" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VChart from 'vue-echarts'

export default {
  name: 'TeachQuality',
  components: {
    VChart
  },
  data() {
    return {
      qualityOptions: {
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['教学质量', '学员满意度', '课堂活跃度', '知识掌握度']
        },
        xAxis: {
          type: 'category',
          data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周']
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100
        },
        series: [
          {
            name: '教学质量',
            type: 'line',
            data: [85, 87, 90, 92, 94, 96],
            smooth: true
          },
          {
            name: '学员满意度',
            type: 'line',
            data: [80, 82, 85, 88, 90, 92],
            smooth: true
          },
          {
            name: '课堂活跃度',
            type: 'line',
            data: [75, 78, 82, 85, 88, 90],
            smooth: true
          },
          {
            name: '知识掌握度',
            type: 'line',
            data: [70, 73, 78, 82, 85, 87],
            smooth: true
          }
        ]
      },
      effectOptions: {
        tooltip: { trigger: 'item' },
        series: [{
          name: '教学效果',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 40, name: '优秀' },
            { value: 35, name: '良好' },
            { value: 20, name: '一般' },
            { value: 5, name: '待改进' }
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
      feedbackOptions: {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['内容质量', '教学方法', '互动性', '时间安排', '整体评价']
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 5
        },
        series: [{
          data: [4.5, 4.3, 4.2, 4.0, 4.4],
          type: 'bar',
          itemStyle: {
            color: '#1890ff'
          }
        }]
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
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

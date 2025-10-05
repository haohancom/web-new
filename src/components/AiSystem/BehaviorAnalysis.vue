<template>
  <div class="container">
    <a-card class="chart-card">
      <div class="chart-title">行为分析概览</div>
      <v-chart :option="behaviorOptions" style="height: 400px" />
    </a-card>

    <a-row :gutter="16" style="margin-top: 20px;">
      <a-col :span="8">
        <a-card class="chart-card">
          <div class="chart-title">注意力分布</div>
          <v-chart :option="attentionOptions" style="height: 300px" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="chart-card">
          <div class="chart-title">情绪分析</div>
          <v-chart :option="emotionOptions" style="height: 300px" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card class="chart-card">
          <div class="chart-title">互动频率</div>
          <v-chart :option="interactionOptions" style="height: 300px" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VChart from 'vue-echarts'

export default {
  name: 'BehaviorAnalysis',
  components: {
    VChart
  },
  data() {
    return {
      behaviorOptions: {
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['认真听讲', '积极发言', '小组讨论', '其他活动']
        },
        xAxis: {
          type: 'category',
          data: ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30']
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100
        },
        series: [
          {
            name: '认真听讲',
            type: 'line',
            data: [75, 78, 82, 85, 88, 90],
            smooth: true
          },
          {
            name: '积极发言',
            type: 'line',
            data: [20, 25, 30, 28, 32, 35],
            smooth: true
          },
          {
            name: '小组讨论',
            type: 'line',
            data: [15, 18, 22, 25, 28, 30],
            smooth: true
          },
          {
            name: '其他活动',
            type: 'line',
            data: [10, 12, 15, 18, 20, 22],
            smooth: true
          }
        ]
      },
      attentionOptions: {
        tooltip: { trigger: 'item' },
        series: [{
          name: '注意力',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 60, name: '高度集中' },
            { value: 25, name: '一般集中' },
            { value: 10, name: '分散' },
            { value: 5, name: '严重分散' }
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
      emotionOptions: {
        tooltip: { trigger: 'item' },
        series: [{
          name: '情绪',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 70, name: '积极' },
            { value: 20, name: '中性' },
            { value: 10, name: '消极' }
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
      interactionOptions: {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['举手', '发言', '讨论', '提问', '回答']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [25, 30, 20, 15, 35],
          type: 'bar',
          itemStyle: {
            color: '#52c41a'
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

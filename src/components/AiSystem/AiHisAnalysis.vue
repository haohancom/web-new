<template>
  <div class="container">
    <a-card class="chart-card">
      <div class="chart-title">历史数据分析</div>
      <v-chart :option="historyOptions" style="height: 400px" />
    </a-card>

    <a-row :gutter="16" style="margin-top: 20px;">
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">月度趋势</div>
          <v-chart :option="monthlyOptions" style="height: 300px" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">对比分析</div>
          <v-chart :option="comparisonOptions" style="height: 300px" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VChart from 'vue-echarts'

export default {
  name: 'AiHisAnalysis',
  components: {
    VChart
  },
  data() {
    return {
      historyOptions: {
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['参与度', '活跃度', '满意度', '教学质量']
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
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
            data: [75, 78, 82, 85, 88, 90],
            smooth: true
          },
          {
            name: '活跃度',
            type: 'line',
            data: [70, 73, 78, 82, 85, 87],
            smooth: true
          },
          {
            name: '满意度',
            type: 'line',
            data: [80, 82, 85, 88, 90, 92],
            smooth: true
          },
          {
            name: '教学质量',
            type: 'line',
            data: [85, 87, 90, 92, 94, 96],
            smooth: true
          }
        ]
      },
      monthlyOptions: {
        tooltip: { trigger: 'item' },
        series: [{
          name: '月度数据',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 35, name: '优秀' },
            { value: 40, name: '良好' },
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
      comparisonOptions: {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['本周', '上周', '本月', '上月']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [88, 85, 90, 87],
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

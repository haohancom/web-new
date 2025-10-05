<template>
  <div class="container">
    <a-card class="chart-card">
      <div class="chart-title">学员画像诊断</div>
      <v-chart :option="portraitOptions" style="height: 400px" />
    </a-card>

    <a-row :gutter="16" style="margin-top: 20px;">
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">学习能力分析</div>
          <v-chart :option="abilityOptions" style="height: 300px" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">性格特征分析</div>
          <v-chart :option="personalityOptions" style="height: 300px" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VChart from 'vue-echarts'

export default {
  name: 'PortraitDiagnosis',
  components: {
    VChart
  },
  data() {
    return {
      portraitOptions: {
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['学习能力', '参与度', '专注力', '创造力']
        },
        xAxis: {
          type: 'category',
          data: ['学员1', '学员2', '学员3', '学员4', '学员5']
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100
        },
        series: [
          {
            name: '学习能力',
            type: 'bar',
            data: [85, 78, 92, 88, 90]
          },
          {
            name: '参与度',
            type: 'bar',
            data: [80, 75, 88, 85, 87]
          },
          {
            name: '专注力',
            type: 'bar',
            data: [75, 70, 85, 80, 82]
          },
          {
            name: '创造力',
            type: 'bar',
            data: [70, 65, 80, 75, 78]
          }
        ]
      },
      abilityOptions: {
        tooltip: { trigger: 'item' },
        series: [{
          name: '学习能力',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 30, name: '优秀' },
            { value: 40, name: '良好' },
            { value: 25, name: '一般' },
            { value: 5, name: '待提升' }
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
      personalityOptions: {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['外向性', '宜人性', '尽责性', '神经质', '开放性']
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100
        },
        series: [{
          data: [75, 80, 85, 70, 78],
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

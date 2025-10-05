<template>
  <div class="container">
    <a-card class="data-card">
      <div class="card-title">课堂预警信息</div>
      <a-table 
        :columns="columns" 
        :data-source="warningData" 
        :pagination="false"
        :loading="loading"
      />
    </a-card>

    <a-row :gutter="16" style="margin-top: 20px;">
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">预警类型分布</div>
          <v-chart :option="warningTypeOptions" style="height: 300px" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">预警趋势</div>
          <v-chart :option="trendOptions" style="height: 300px" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VChart from 'vue-echarts'

export default {
  name: 'ClassroomWarning',
  components: {
    VChart
  },
  data() {
    return {
      loading: false,
      warningData: [],
      columns: [
        {
          title: '预警时间',
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: '教室',
          dataIndex: 'classroom',
          key: 'classroom'
        },
        {
          title: '预警类型',
          dataIndex: 'type',
          key: 'type',
          customRender: ({ text }) => {
            const typeMap = {
              attention: '注意力分散',
              behavior: '行为异常',
              participation: '参与度低',
              emotion: '情绪异常'
            }
            return typeMap[text] || text
          }
        },
        {
          title: '严重程度',
          dataIndex: 'level',
          key: 'level',
          customRender: ({ text }) => {
            const levelMap = {
              low: '低',
              medium: '中',
              high: '高'
            }
            return levelMap[text] || text
          }
        },
        {
          title: '处理状态',
          dataIndex: 'status',
          key: 'status',
          customRender: ({ text }) => {
            const statusMap = {
              pending: '待处理',
              processing: '处理中',
              resolved: '已解决'
            }
            return statusMap[text] || text
          }
        }
      ],
      warningTypeOptions: {
        tooltip: { trigger: 'item' },
        series: [{
          name: '预警类型',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 35, name: '注意力分散' },
            { value: 25, name: '行为异常' },
            { value: 20, name: '参与度低' },
            { value: 20, name: '情绪异常' }
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
      trendOptions: {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '预警次数',
          type: 'line',
          data: [5, 3, 7, 4, 6],
          smooth: true,
          itemStyle: {
            color: '#ff4d4f'
          }
        }]
      }
    }
  },
  async mounted() {
    await this.loadWarningData()
  },
  methods: {
    async loadWarningData() {
      this.loading = true
      try {
        // 模拟数据
        this.warningData = Array.from({ length: 10 }, (_, index) => ({
          key: index + 1,
          time: `2024-01-${String(index + 1).padStart(2, '0')} 10:30`,
          classroom: `教室A${String(index + 1).padStart(2, '0')}`,
          type: ['attention', 'behavior', 'participation', 'emotion'][Math.floor(Math.random() * 4)],
          level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          status: ['pending', 'processing', 'resolved'][Math.floor(Math.random() * 3)]
        }))
      } catch (error) {
        console.error('加载预警数据失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
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

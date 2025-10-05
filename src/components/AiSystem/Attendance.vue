<template>
  <div class="container">
    <a-card class="data-card">
      <div class="card-title">考勤管理</div>
      <a-table 
        :columns="columns" 
        :data-source="attendanceData" 
        :pagination="false"
        :loading="loading"
      />
    </a-card>

    <a-row :gutter="16" style="margin-top: 20px;">
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">出勤率统计</div>
          <v-chart :option="attendanceOptions" style="height: 300px" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="chart-card">
          <div class="chart-title">迟到早退统计</div>
          <v-chart :option="lateOptions" style="height: 300px" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VChart from 'vue-echarts'

export default {
  name: 'Attendance',
  components: {
    VChart
  },
  data() {
    return {
      loading: false,
      attendanceData: [],
      columns: [
        {
          title: '学员姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '班级',
          dataIndex: 'class',
          key: 'class'
        },
        {
          title: '出勤状态',
          dataIndex: 'status',
          key: 'status',
          customRender: ({ text }) => {
            const statusMap = {
              present: '出勤',
              absent: '缺勤',
              late: '迟到',
              early: '早退'
            }
            return statusMap[text] || text
          }
        },
        {
          title: '出勤时间',
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: '备注',
          dataIndex: 'note',
          key: 'note'
        }
      ],
      attendanceOptions: {
        tooltip: { trigger: 'item' },
        series: [{
          name: '出勤率',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 85, name: '出勤' },
            { value: 10, name: '迟到' },
            { value: 3, name: '早退' },
            { value: 2, name: '缺勤' }
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
      lateOptions: {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '迟到人数',
          type: 'bar',
          data: [5, 3, 7, 4, 6],
          itemStyle: {
            color: '#ff4d4f'
          }
        }]
      }
    }
  },
  async mounted() {
    await this.loadAttendanceData()
  },
  methods: {
    async loadAttendanceData() {
      this.loading = true
      try {
        // 模拟数据
        this.attendanceData = Array.from({ length: 20 }, (_, index) => ({
          key: index + 1,
          name: `学员${index + 1}`,
          class: `班级${Math.floor(Math.random() * 5) + 1}`,
          status: ['present', 'absent', 'late', 'early'][Math.floor(Math.random() * 4)],
          time: '09:00',
          note: index % 5 === 0 ? '请假' : ''
        }))
      } catch (error) {
        console.error('加载考勤数据失败:', error)
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

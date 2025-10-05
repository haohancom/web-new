<template>
  <div class="container">
    <a-card class="chart-card">
      <div class="chart-title">教学巡视实时监控</div>
      <v-chart :option="monitoringOptions" style="height: 400px" />
    </a-card>

    <a-row :gutter="16" style="margin-top: 20px;">
      <a-col :span="8" v-for="(classroom, index) in classrooms" :key="index">
        <a-card class="classroom-card">
          <div class="classroom-title">{{ classroom.name }}</div>
          <div class="classroom-status" :class="classroom.status">
            {{ classroom.statusText }}
          </div>
          <div class="classroom-info">
            <div>学员: {{ classroom.students }}人</div>
            <div>教员: {{ classroom.teacher }}</div>
            <div>课程: {{ classroom.course }}</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VChart from 'vue-echarts'

export default {
  name: 'AiTeachingTour',
  components: {
    VChart
  },
  data() {
    return {
      classrooms: [
        {
          name: '教室A101',
          status: 'active',
          statusText: '正常',
          students: 32,
          teacher: '张老师',
          course: '数学'
        },
        {
          name: '教室A102',
          status: 'warning',
          statusText: '注意',
          students: 28,
          teacher: '李老师',
          course: '语文'
        },
        {
          name: '教室A103',
          status: 'active',
          statusText: '正常',
          students: 30,
          teacher: '王老师',
          course: '英语'
        }
      ],
      monitoringOptions: {
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['参与度', '活跃度', '注意力']
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
            name: '注意力',
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

.classroom-card {
  margin-bottom: 16px;
}

.classroom-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.classroom-status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 12px;
}

.classroom-status.active {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.classroom-status.warning {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.classroom-info div {
  margin-bottom: 4px;
  color: #666;
}
</style>

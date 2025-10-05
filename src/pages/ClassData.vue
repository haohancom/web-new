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
      <h1 class="title">班级数据</h1>
    </div>

    <a-card class="data-card">
      <div class="card-title">班级数据概览</div>
      <a-table 
        :columns="columns" 
        :data-source="classData" 
        :pagination="false"
        :loading="loading"
      />
    </a-card>
  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

export default {
  name: 'ClassData',
  components: {
    ArrowLeftOutlined
  },
  data() {
    return {
      h,
      loading: false,
      classData: [],
      columns: [
        {
          title: '班级名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '学员人数',
          dataIndex: 'studentCount',
          key: 'studentCount'
        },
        {
          title: '教员',
          dataIndex: 'teacher',
          key: 'teacher'
        },
        {
          title: '出勤率',
          dataIndex: 'attendanceRate',
          key: 'attendanceRate',
          customRender: ({ text }) => `${text}%`
        },
        {
          title: '参与度',
          dataIndex: 'engagementRate',
          key: 'engagementRate',
          customRender: ({ text }) => `${text}%`
        },
        {
          title: '满意度',
          dataIndex: 'satisfactionRate',
          key: 'satisfactionRate',
          customRender: ({ text }) => `${text}%`
        }
      ]
    }
  },
  async mounted() {
    await this.loadClassData()
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    async loadClassData() {
      this.loading = true
      try {
        // 模拟数据
        this.classData = Array.from({ length: 10 }, (_, index) => ({
          key: index + 1,
          name: `班级${index + 1}`,
          studentCount: Math.floor(Math.random() * 30) + 20,
          teacher: `教员${index + 1}`,
          attendanceRate: (Math.random() * 20 + 80).toFixed(1),
          engagementRate: (Math.random() * 25 + 70).toFixed(1),
          satisfactionRate: (Math.random() * 15 + 80).toFixed(1)
        }))
      } catch (error) {
        console.error('加载班级数据失败:', error)
      } finally {
        this.loading = false
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
</style>

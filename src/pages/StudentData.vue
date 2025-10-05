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
      <h1 class="title">学员数据</h1>
    </div>

    <a-card class="data-card">
      <div class="card-title">学员数据概览</div>
      <a-table 
        :columns="columns" 
        :data-source="studentData" 
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
  name: 'StudentData',
  components: {
    ArrowLeftOutlined
  },
  data() {
    return {
      h,
      loading: false,
      studentData: [],
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
          title: '出勤率',
          dataIndex: 'attendance',
          key: 'attendance',
          customRender: ({ text }) => `${text}%`
        },
        {
          title: '参与度',
          dataIndex: 'engagement',
          key: 'engagement',
          customRender: ({ text }) => `${text}%`
        },
        {
          title: '表现评分',
          dataIndex: 'performance',
          key: 'performance',
          customRender: ({ text }) => `${text}%`
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          customRender: ({ text }) => {
            const statusMap = {
              active: '活跃',
              inactive: '非活跃'
            }
            return statusMap[text] || text
          }
        }
      ]
    }
  },
  async mounted() {
    await this.loadStudentData()
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    async loadStudentData() {
      this.loading = true
      try {
        // 模拟数据
        this.studentData = Array.from({ length: 20 }, (_, index) => ({
          key: index + 1,
          name: `学员${index + 1}`,
          class: `班级${Math.floor(Math.random() * 5) + 1}`,
          attendance: (Math.random() * 20 + 80).toFixed(1),
          engagement: (Math.random() * 25 + 70).toFixed(1),
          performance: (Math.random() * 20 + 75).toFixed(1),
          status: Math.random() > 0.3 ? 'active' : 'inactive'
        }))
      } catch (error) {
        console.error('加载学员数据失败:', error)
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

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
      <h1 class="title">教员数据</h1>
    </div>

    <a-card class="data-card">
      <div class="card-title">教员数据概览</div>
      <a-table 
        :columns="columns" 
        :data-source="teacherData" 
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
  name: 'TeacherData',
  components: {
    ArrowLeftOutlined
  },
  data() {
    return {
      h,
      loading: false,
      teacherData: [],
      columns: [
        {
          title: '教员姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '科目',
          dataIndex: 'subject',
          key: 'subject'
        },
        {
          title: '授课班级数',
          dataIndex: 'classCount',
          key: 'classCount'
        },
        {
          title: '学员总数',
          dataIndex: 'studentCount',
          key: 'studentCount'
        },
        {
          title: '评分',
          dataIndex: 'rating',
          key: 'rating',
          customRender: ({ text }) => text.toFixed(1)
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
    await this.loadTeacherData()
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    async loadTeacherData() {
      this.loading = true
      try {
        // 模拟数据
        this.teacherData = Array.from({ length: 10 }, (_, index) => ({
          key: index + 1,
          name: `教员${index + 1}`,
          subject: ['语文', '数学', '英语', '物理', '化学'][Math.floor(Math.random() * 5)],
          classCount: Math.floor(Math.random() * 5) + 2,
          studentCount: Math.floor(Math.random() * 100) + 50,
          rating: Math.random() * 1 + 4,
          status: Math.random() > 0.2 ? 'active' : 'inactive'
        }))
      } catch (error) {
        console.error('加载教员数据失败:', error)
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

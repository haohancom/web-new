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
      <h1 class="title">智能中心</h1>
    </div>

    <div class="content-container">
      <div class="sidebar">
        <a-menu
          :default-selected-keys="[currentRoute]"
          mode="vertical"
          @click="handleMenuClick"
        >
          <a-menu-item key="home">
            <a-icon type="home" />
            <span>系统首页</span>
          </a-menu-item>
          <a-menu-item key="teaching-tour">
            <a-icon type="eye" />
            <span>教学巡视</span>
          </a-menu-item>
          <a-menu-item key="history-analysis">
            <a-icon type="history" />
            <span>历史分析</span>
          </a-menu-item>
          <a-menu-item key="attendance">
            <a-icon type="user" />
            <span>考勤管理</span>
          </a-menu-item>
          <a-menu-item key="behavior-analysis">
            <a-icon type="bar-chart" />
            <span>行为分析</span>
          </a-menu-item>
          <a-menu-item key="teach-quality">
            <a-icon type="trophy" />
            <span>教学质量</span>
          </a-menu-item>
          <a-menu-item key="portrait-diagnosis">
            <a-icon type="user-switch" />
            <span>画像诊断</span>
          </a-menu-item>
          <a-menu-item key="classroom-warning">
            <a-icon type="exclamation-circle" />
            <span>课堂预警</span>
          </a-menu-item>
        </a-menu>
      </div>

      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

export default {
  name: 'AiSystem',
  components: {
    ArrowLeftOutlined
  },
  data() {
    return {
      h,
      currentRoute: 'home'
    }
  },
  watch: {
    '$route'(to) {
      this.currentRoute = to.name || 'home'
    }
  },
  mounted() {
    this.currentRoute = this.$route.name || 'home'
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    handleMenuClick({ key }) {
      this.currentRoute = key
      this.$router.push(`/aiSystem/${key}`)
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

.content-container {
  display: flex;
  gap: 20px;
}

.sidebar {
  width: 250px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar .ant-menu {
  border-radius: 8px;
  border: none;
}

.sidebar .ant-menu-item {
  height: 50px;
  line-height: 50px;
  margin: 0;
  border-radius: 0;
}

.sidebar .ant-menu-item:hover {
  background-color: #f0f2f5;
}

.sidebar .ant-menu-item-selected {
  background-color: #e6f7ff;
  color: #1890ff;
}

.main-content {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
</style>

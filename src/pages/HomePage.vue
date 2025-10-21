<template>
  <div class="home-page">
    <h1 class="page-title">思政课堂学员自主学习系统</h1>
    <div class="home-container">
      <div class="nav-container">
        <div class="button-grid">
          <a-button
            v-for="button in navButtons"
            :key="button.key"
            type="primary"
            size="large"
            class="nav-button"
            @click="handleNavigate(button.route)"
          >
            <a-icon :component="button.icon" />
            {{ button.text }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CalendarOutlined, TeamOutlined, UserOutlined, ContactsOutlined } from '@ant-design/icons-vue'

export default {
  name: 'HomePage',
  components: {
    CalendarOutlined,
    TeamOutlined,
    UserOutlined,
    ContactsOutlined
  },
  data() {
    return {
      navButtons: [
         {
          key: 'aiClass',
          icon: CalendarOutlined,
          text: 'AI课堂',
          route: '/aiClass'
        },
        {
          key: 'dayData',
          icon: CalendarOutlined,
          text: '今日数据',
          route: '/dayData'
        },
        {
          key: 'classData',
          icon: TeamOutlined,
          text: '班级数据',
          route: '/classData'
        },
        {
          key: 'teacherData',
          icon: UserOutlined,
          text: '教员数据',
          route: '/teacherData'
        },
        {
          key: 'studentData',
          icon: ContactsOutlined,
          text: '学员数据',
          route: '/studentData'
        },
      ]
    }
  },
  methods: {
    handleNavigate(route) {
      this.$router.push(route)
    }
  }
}
</script>

<style scoped>
.home-page {
  padding: 0;
  background: #f0f2f5;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.page-title {
  text-align: center;
  color: #1890ff;
  font-size: 32px;
  font-weight: bold;
  width: 100%;
  padding: 60px 20px 40px 20px;
  flex-shrink: 0;
  margin-top: 20px;
}

.home-container {
  padding: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
}

.button-grid {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: nowrap;
  max-width: 1200px;
  padding: 20px;
}

.nav-button {
  height: 120px;
  width: 160px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-button .anticon {
  font-size: 24px;
  margin-bottom: 8px;
}

.nav-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(24, 144, 255, 0.25);
}
</style>

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
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  color: #1890ff;
  font-size: 28px;
  font-weight: bold;
  width: 100%;
  display: block;
}

.home-container {
  padding: 60px 20px;
  min-height: 100vh;
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
  flex-wrap: wrap;
  max-width: 1000px;
}

.nav-button {
  height: 120px;
  width: 180px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.nav-button .anticon {
  font-size: 24px;
  margin-bottom: 8px;
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}
</style>

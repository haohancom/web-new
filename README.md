# 思政课堂学员自主学习系统 - Vue2版本

这是一个用Vue2重写的思政课堂学员自主学习系统，完全使用Mock数据，具有动态数据更新和动画效果。

## 功能特性

- 🚀 **动态数据更新**: 所有数据每3秒自动更新，模拟实时数据变化
- 🎨 **动画效果**: 卡片悬停效果、数据变化动画
- 📊 **丰富的图表**: 使用ECharts展示各种数据可视化
- 🎯 **响应式设计**: 适配不同屏幕尺寸
- 🎨 **复用原有样式**: 保持与原项目一致的颜色和样式风格

## 页面结构

### 主要页面
- **首页** (`/`): 导航菜单，包含5个主要功能入口
- **今日数据** (`/dayData`): 核心数据展示页面，包含各种统计图表
- **班级数据** (`/classData`): 班级信息统计表格
- **教员数据** (`/teacherData`): 教师信息统计表格
- **学员数据** (`/studentData`): 学生信息统计表格

### AI系统子页面
- **首页**: 系统概览和性能监控
- **AI教学巡课**: 实时课堂监控
- **AI历史分析**: 历史数据分析
- **课堂考勤**: 考勤统计
- **课堂行为分析**: 行为分析
- **教学质量分析**: 教学质量评估
- **教师画像及诊改**: 教师画像分析
- **课堂预警**: 预警系统

## 技术栈

- **Vue 2.7**: 前端框架
- **Vue Router 3**: 路由管理
- **Ant Design Vue 1.7**: UI组件库
- **ECharts**: 数据可视化
- **Vue CLI**: 构建工具

## 安装和运行

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run serve
```

项目将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```

## 项目结构

```
src/
├── components/          # 通用组件
│   └── NotFound/       # 404页面
├── pages/              # 页面组件
│   ├── HomePage.vue    # 首页
│   ├── DayData.vue     # 今日数据
│   ├── ClassData.vue   # 班级数据
│   ├── TeacherData.vue # 教员数据
│   └── StudentData.vue # 学员数据
├── services/           # 服务层
│   └── mockData.js     # Mock数据服务
├── styles/             # 样式文件
│   └── index.css       # 全局样式
├── router/             # 路由配置
│   └── index.js        # 路由定义
├── App.vue             # 应用主组件
└── main.js             # 应用入口
```

## 核心特性说明

### Mock数据服务
- `mockData.js`提供所有页面的模拟数据
- 数据生成函数确保数据的随机性和真实性
- 支持实时数据变化模拟

### 样式系统
- 复用原有项目的颜色变量和样式规范
- 使用CSS变量管理主题色彩
- 响应式布局适配不同设备

### 动画效果
- 卡片悬停效果（上移+阴影）
- 数据变化时的平滑过渡
- 图表数据的动态更新动画

## 数据说明

所有数据都是Mock数据，包括：
- 学生参与度、活跃度、兴奋度等指标
- 教师教学质量、学生评分等数据
- 班级出勤率、行为分析等统计
- 系统性能监控数据
- AI识别准确率等指标

## 开发说明

### 添加新页面
1. 在`src/pages/`下创建新页面组件
2. 在`src/router/index.js`中添加路由配置
3. 在`mockData.js`中添加对应的数据生成函数

### 修改样式
1. 全局样式在`src/styles/index.css`中修改
2. 组件样式使用Vue单文件组件样式
3. 颜色变量在CSS变量中统一管理

### 添加新图表
1. 使用ECharts配置图表选项
2. 在组件中使用`v-chart`渲染
3. 确保图表数据与Mock数据同步更新

## 迁移说明

本项目已从React迁移到Vue2，主要变化：

1. **框架变更**：React 18 → Vue 2.7
2. **路由**：React Router → Vue Router 3
3. **UI组件库**：Ant Design → Ant Design Vue
4. **图表库**：echarts-for-react → vue-echarts
5. **样式**：Styled Components → Vue单文件组件样式
6. **状态管理**：React Hooks → Vue data/computed/methods
7. **构建工具**：Create React App → Vue CLI

## 注意事项

- 所有数据都是模拟数据，不连接真实后端
- 数据更新频率为3秒，可根据需要调整
- 图表配置支持响应式，自动适配容器大小
- 样式完全复用原有项目，保持视觉一致性
- 使用Vue 2.7语法，支持Composition API
- 组件使用单文件组件(.vue)格式
- 路由配置在`src/router/index.js`
- 样式使用scoped避免污染
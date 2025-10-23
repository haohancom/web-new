<template>
  <div class="page-container">
    <div class="header">
      <a-button 
        type="primary" 
        @click="goHome"
        class="back-button"
      >
        <ArrowLeftOutlined />
        返回首页
      </a-button>
      <h1 class="title">教员数据</h1>
    </div>

    <!-- 筛选框区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-label">开始日期：</label>
          <a-date-picker
            v-model:value="startDate"
            placeholder="选择开始日期"
            format="YYYY-MM-DD"
            @change="onStartDateChange"
            class="date-picker"
          />
        </div>
        <div class="filter-item">
          <label class="filter-label">结束日期：</label>
          <a-date-picker
            v-model:value="endDate"
            placeholder="选择结束日期"
            format="YYYY-MM-DD"
            :disabled-date="disabledEndDate"
            @change="onEndDateChange"
            class="date-picker"
          />
        </div>
        <div class="filter-item">
          <label class="filter-label">教员：</label>
          <a-select
            v-model:value="teacher"
            placeholder="请先选择日期"
            :disabled="!canSelectTeacher"
            @change="onTeacherChange"
            @search="onTeacherSearch"
            @clear="onTeacherClear"
            class="teacher-select"
            style="width: 200px"
            show-search
            allow-clear
            :loading="teacherSearchLoading"
            :filter-option="false"
            :key="teacherListKey"
          >
            <a-select-option
              v-for="teacherName in teacherList"
              :key="teacherName"
              :value="teacherName"
            >
              {{ teacherName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <!-- 教员班级信息区域 -->
    <div class="teacher-info-section" v-if="teacher">
      <div class="teacher-info-content">
        <div class="teacher-overview-title">
          <span class="title-text">学员概况</span>
        </div>
        <span v-if="teacherClassList.length > 0">
          当前时间段内，<span class="highlight">{{ teacher }}</span>老师共教授<span class="highlight">{{ teacherClassList.length }}</span>个小班，
          教授班级为: <span class="class-names">{{ displayTeacherClassNames }}</span>
        </span>
        <span v-else>
          当前时间段内，<span class="highlight">{{ teacher }}</span>老师未教授班级
        </span>
      </div>
    </div>

    <!-- 顶部数据卡片 -->
    <div class="data-grid">
      <a-card
        v-for="(item, index) in numList"
        :key="index"
        class="data-card"
        :style="{ '--card-color': item.color }"
      >
        <div class="card-number">
          <span>{{ item.num }}</span>
          <a-tooltip
            v-if="item.hasTooltip"
            placement="top"
            :mouseEnterDelay="0"
          >
            <template #title>
              <div v-html="getTooltipContent(item.label)"></div>
            </template>
            <span class="participation-help-icon">?</span>
          </a-tooltip>
        </div>
        <div class="card-title">
          {{ item.label }}
        </div>
      </a-card>
    </div>

    <!-- 图表区域 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">学员动作分布</div>
        <v-chart
          id="teacherStudentActionChart"
          :option="studentActionOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">学员情绪分布</div>
        <v-chart
          id="teacherStudentEmotionChart"
          :option="studentEmotionOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>
    </div>

    <!-- 发言次数前十课程柱状图和教员行为分布图 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">发言次数前十课程</div>
        <v-chart
          id="teacherClassSpeakingChart"
          :option="classSpeakingOptions"
          style="height: 350px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">教员行为分布</div>
        <v-chart
          id="teacherBehaviorChart"
          :option="teacherBehaviorOptions"
          style="height: 350px"
        ></v-chart>
      </a-card>
    </div>

    <!-- 学员类型分析柱状图 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">学员类型分析</div>
        <v-chart
          id="studentTypeAnalysisChart"
          :option="studentTypeAnalysisOptions"
          style="height: 350px"
        ></v-chart>
      </a-card>
    </div>

    <!-- 课堂类型图、课堂类型占比图和我的行为动作分布图 -->
    <div class="chart-grid-three">
      <a-card class="chart-card">
        <div class="chart-title">课堂类型</div>
        <v-chart
          id="teacherCourseScatterChart"
          :option="courseScatterOptions"
          style="height: 350px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">课堂类型占比</div>
        <v-chart
          id="teacherClassroomTypePieChart"
          :option="classroomTypePieOptions"
          style="height: 350px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">我的行为动作分布</div>
        <v-chart
          id="myBehaviorChart"
          :option="myBehaviorOptions"
          style="height: 350px"
        ></v-chart>
      </a-card>
    </div>

  </div>
</template>

<script>
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import moment from 'moment'
import service from '@/utils/fetch'
import { getTeacher, getTeacherDetail, getTeacherHeadupRate, getTeacherStudentAction, getTeacherStudentEmotion } from '@/api/aiClass'
import { colorList } from '../services/mockData'
import * as echarts from "echarts"
import VChart from "vue-echarts"
import { getClassroomType, calculateClassroomTypeDistribution, createClassroomTypePieOptions } from '@/utils/classroomTypeUtils'

export default {
  name: 'TeacherData',
  components: {
    ArrowLeftOutlined,
    VChart
  },
  data() {
    return {
      h,
      // 筛选相关数据
      startDate: null,
      endDate: null,
      teacher: null,
      teacherList: [],
      teacherMapping: {}, // 存储教员名到teacherId的映射
      teacherSearchLoading: false, // 教员搜索加载状态
      originalTeacherList: [], // 存储完整的教员列表
      originalTeacherMapping: {}, // 存储完整的教员映射
      teacherListKey: 0, // 用于强制重新渲染 Select 组件
      // 教员详情数据
      teacherDetail: {},
      // 教员抬头率数据
      headupRate: 0,
      // 教员教授班级列表
      teacherClassList: [],
      // 图表相关数据
      studentActionOptions: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "学员动作分布",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
      studentEmotionOptions: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "学员情绪分布",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
      classSpeakingOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0,
            rotate: 45,
            fontSize: 12,
          },
        },
        yAxis: {
          type: "value",
          name: "发言次数",
          nameTextStyle: {
            fontSize: 12,
          },
        },
        series: [
          {
            name: "发言次数",
            type: "bar",
            data: [],
            itemStyle: {
              color: "#1890ff",
            },
            emphasis: {
              itemStyle: {
                color: "#40a9ff",
              },
            },
          },
        ],
      },
      courseScatterOptions: {
        title: {
          text: "课堂类型分布图",
          left: "center",
          top: "5%",
          textStyle: {
            fontSize: 16,
            fontWeight: "bold",
            color: "#333"
          },
        },
        xAxis: {
          name: "(RT)",
          nameLocation: "middle",
          nameGap: 25,
          nameTextStyle: {
            fontSize: 12,
            color: "#666",
            fontWeight: "bold"
          },
          min: 0,
          max: 1,
          type: "value",
          axisLabel: { 
            show: true,
            fontSize: 10,
            color: "#666"
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#ddd"
            }
          },
          splitLine: { 
            show: true,
            lineStyle: {
              color: "#f0f0f0",
              type: "dashed"
            }
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (params.seriesType === 'scatter') {
              return `课程：${params.data.courseName}<br/>上课时间：${params.data.classDate}<br/>RT: ${params.value[0].toFixed(2)}<br/>CH: ${params.value[1].toFixed(2)}`;
            }
            return '';
          },
        },
        yAxis: {
          name: "(Ch)",
          nameLocation: "middle",
          nameGap: 35,
          nameTextStyle: {
            fontSize: 12,
            color: "#666",
            fontWeight: "bold"
          },
          min: 0,
          max: 1,
          type: "value",
          axisLabel: { 
            show: true,
            fontSize: 10,
            color: "#666"
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#ddd"
            }
          },
          splitLine: { 
            show: true,
            lineStyle: {
              color: "#f0f0f0",
              type: "dashed"
            }
          },
        },
        grid: {
          left: "8%",
          right: "5%",
          bottom: "12%",
          top: "15%",
          containLabel: true,
        },
        series: [
          {
            type: "scatter",
            data: [],
            symbolSize: 12,
            label: {
              show: true,
              formatter: function(params) {
                return params.data.courseName;
              },
              position: "top",
            },
            itemStyle: {
              color: "#ff8800",
            },
          },
          // === 主三角形边框 ===
          {
            type: "line",
            data: [
              [0, 0],
              [0.5, 1],
              [1, 0],
            ],
            lineStyle: {
              color: "green",
              width: 2,
            },
            symbol: "none",
            tooltip: { show: false }
          },
          // === 左侧分界线 ===
          {
            type: "line",
            data: [
              [0.3, 0],
              [0.3, 0.6],
            ],
            lineStyle: {
              color: "green",
              width: 2,
            },
            symbol: "none",
            tooltip: { show: false }
          },
          // === 右侧分界线 ===
          {
            type: "line",
            data: [
              [0.7, 0],
              [0.7, 0.6],
            ],
            lineStyle: {
              color: "green",
              width: 2,
            },
            symbol: "none",
            tooltip: { show: false }
          },
          // === 中间横线 ===
          {
            type: "line",
            data: [
              [0.3, 0.5],
              [0.7, 0.5],
            ],
            lineStyle: {
              color: "green",
              width: 2,
            },
            symbol: "none",
            tooltip: { show: false }
          },
        ],
        graphic: [
          // === 区域文字 ===
          {
            type: "text",
            left: "22%",
            top: "72%",
            style: {
              text: "练习型",
              fill: "#333",
              fontSize: 14,
            },
          },
          {
            type: "text",
            left: "50%",
            top: "72%",
            style: {
              text: "混合型",
              fill: "#333",
              fontSize: 14,
            },
          },
          {
            type: "text",
            left: "72%",
            top: "72%",
            style: {
              text: "讲授型",
              fill: "#333",
              fontSize: 14,
            },
          },
          {
            type: "text",
            left: "50%",
            top: "40%",
            style: {
              text: "对话型",
              fill: "#333",
              fontSize: 14,
            },
          },
        ],
      },
      // 教员行为分布图表
      teacherBehaviorOptions: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "教员行为分布",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
      // 我的行为动作分布图表
      myBehaviorOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0,
            rotate: 45,
            fontSize: 12,
          },
        },
        yAxis: {
          type: "value",
          name: "次数",
          nameTextStyle: {
            fontSize: 12,
          },
        },
        series: [
          {
            name: "行为次数",
            type: "bar",
            data: [],
            itemStyle: {
              color: "#52c41a",
            },
            emphasis: {
              itemStyle: {
                color: "#73d13d",
              },
            },
          },
        ],
      },
      // 学员类型分析柱状图配置
      studentTypeAnalysisOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0,
            rotate: 45,
            fontSize: 12,
          },
        },
        yAxis: {
          type: "value",
          name: "次数",
          nameTextStyle: {
            fontSize: 12,
          },
        },
        series: [
          {
            name: "行为次数",
            type: "bar",
            data: [],
            itemStyle: {
              color: "#1890ff",
            },
            emphasis: {
              itemStyle: {
                color: "#40a9ff",
              },
            },
          },
        ],
      },
      // 课堂类型占比饼状图配置
      classroomTypePieOptions: createClassroomTypePieOptions(),
      // 兴奋度提示信息
      excitementTooltip: '',
      excitementTooltipHtml: '',
    }
  },
  computed: {
    canSelectTeacher() {
      return this.startDate && this.endDate
    },
    displayTeacherClassNames() {
      if (!this.teacherClassList || this.teacherClassList.length === 0) {
        return ''
      }
      
      // 最多显示10个班级名
      const displayClasses = this.teacherClassList.slice(0, 10)
      let result = displayClasses.join('小班、')
      
      // 如果超过10个，添加省略号
      if (this.teacherClassList.length > 10) {
        result += '小班等'
      } else {
        result += '小班'
      }
      
      return result
    },
    numList() {
      return [
        {
          label: "学员参与度",
          num: this.teacherDetail && this.teacherDetail.studentEngagementRate !== null && this.teacherDetail.studentEngagementRate !== undefined
            ? `${Number(this.teacherDetail.studentEngagementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[1],
        },
        {
          label: "学员活跃度",
          num: this.teacherDetail && this.teacherDetail.studentActivationRate !== null && this.teacherDetail.studentActivationRate !== undefined
            ? `${Number(this.teacherDetail.studentActivationRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[4],
        },
        {
          label: "学员兴奋度",
          num: this.teacherDetail && this.teacherDetail.studentExcitementRate !== null && this.teacherDetail.studentExcitementRate !== undefined
            ? `${Number(this.teacherDetail.studentExcitementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[2],
          hasTooltip: true,
        },
        {
          label: "学员抬头率",
          num: this.headupRate !== null && this.headupRate !== undefined 
            ? `${Number(this.headupRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[3],
        },
      ];
    },
  },
  async mounted() {
    // 设置默认时间范围：开始时间为180天前，结束时间为今天
    this.startDate = moment().subtract(180, 'days')
    this.endDate = moment()
    
    // 获取教员列表并自动选择教员
    await this.fetchTeacherList()
    if (this.teacherList.length > 0) {
      // 优先选择吴萌，否则选择第一个
      const wumengIndex = this.teacherList.findIndex(teacher => teacher === '吴萌')
      this.teacher = wumengIndex !== -1 ? this.teacherList[wumengIndex] : this.teacherList[0]
      
      // 选择教员后获取教员数据
      await this.fetchTeacherData()
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    // 日期选择相关方法
    onStartDateChange(date) {
      this.startDate = date
      // 如果开始日期晚于结束日期，清空结束日期
      if (this.endDate && date && moment(date).isAfter(moment(this.endDate))) {
        this.endDate = null
        this.teacher = null
        this.teacherList = []
        this.teacherMapping = {}
        // 清空图表数据
        this.clearChartData()
      } else if (this.startDate && this.endDate) {
        // 如果两个日期都存在，重新获取教员列表
        this.fetchTeacherList()
      }
    },
    onEndDateChange(date) {
      this.endDate = date
      // 当两个日期都选择后，获取教员列表
      if (this.startDate && this.endDate) {
        this.fetchTeacherList()
      } else {
        this.teacher = null
        this.teacherList = []
        this.teacherMapping = {}
        // 清空图表数据
        this.clearChartData()
      }
    },
    onTeacherChange(value) {
      this.teacher = value
      console.log('选择的教员:', value)
      // 清空提示信息
      this.excitementTooltip = ''
      this.excitementTooltipHtml = ''
      
      // 如果清空选择，恢复完整列表
      if (!value && this.canSelectTeacher && this.originalTeacherList.length > 0) {
        this.teacherList = [...this.originalTeacherList]
        this.teacherMapping = { ...this.originalTeacherMapping }
        // 强制重新渲染 Select 组件
        this.teacherListKey++
      }
      
      // 选择教员后可以在这里添加获取教员数据的逻辑
      if (value) {
        this.fetchTeacherData()
      }
    },
    // 禁用结束日期（不能早于开始日期）
    disabledEndDate(current) {
      if (!this.startDate) {
        return false
      }
      return current && moment(current).isBefore(moment(this.startDate).startOf('day'))
    },
    // 获取教员列表
    async fetchTeacherList() {
      if (!this.startDate || !this.endDate) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        
        const response = await service({
          method: 'get',
          url: '/aiClass/queryTeacher',
          params: {
            startDate: startDateStr,
            endDate: endDateStr
          }
        })
        
        // 处理响应格式：{"teacherId":"{teacherName}","teacherId":"{teacherName}"}
        if (response && typeof response === 'object') {
          this.teacherList = Object.values(response) || []
          // 保存教员名到teacherId的映射
          this.teacherMapping = {}
          Object.entries(response).forEach(([teacherId, teacherName]) => {
            this.teacherMapping[teacherName] = teacherId
          })
          // 保存完整的教员列表和映射
          this.originalTeacherList = [...this.teacherList]
          this.originalTeacherMapping = { ...this.teacherMapping }
        } else {
          this.teacherList = []
          this.teacherMapping = {}
          this.originalTeacherList = []
          this.originalTeacherMapping = {}
        }
        
        // 检查当前选中的教员是否需要重新获取数据
        if (this.teacher && this.teacherList.includes(this.teacher)) {
          // 如果当前选中的教员在新列表中，重新获取数据
          await this.fetchTeacherData()
        } else if (this.teacher && !this.teacherList.includes(this.teacher)) {
          // 如果当前选中的教员不在新列表中，清空选择并清空数据
          this.teacher = null
          this.clearChartData()
        }
      } catch (error) {
        console.error('获取教员列表出错:', error)
        this.teacherList = []
      }
    },
    // 教员搜索方法
    async onTeacherSearch(value) {
      if (!value || value.trim() === '' || !this.canSelectTeacher) {
        // 如果搜索值为空或不能选择教员，恢复完整列表
        if (this.originalTeacherList.length > 0) {
          this.teacherList = [...this.originalTeacherList]
          this.teacherMapping = { ...this.originalTeacherMapping }
        } else {
          // 如果没有缓存，重新获取完整列表
          await this.fetchTeacherList()
        }
        return
      }
      
      this.teacherSearchLoading = true
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        
        const response = await service({
          method: 'get',
          url: '/aiClass/queryTeacher',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            search: value // 添加搜索参数
          }
        })
        
        // 处理响应格式：{"teacherId":"{teacherName}","teacherId":"{teacherName}"}
        if (response && typeof response === 'object') {
          // 过滤包含搜索关键词的教员
          const filteredTeachers = Object.entries(response).filter(([teacherId, teacherName]) => 
            teacherName.toLowerCase().includes(value.toLowerCase())
          )
          
          this.teacherList = filteredTeachers.map(([teacherId, teacherName]) => teacherName)
          // 保存教员名到teacherId的映射
          this.teacherMapping = {}
          filteredTeachers.forEach(([teacherId, teacherName]) => {
            this.teacherMapping[teacherName] = teacherId
          })
        } else {
          this.teacherList = []
          this.teacherMapping = {}
        }
      } catch (error) {
        console.error('搜索教员出错:', error)
        this.teacherList = []
      } finally {
        this.teacherSearchLoading = false
      }
    },
    // 教员清空搜索方法
    async onTeacherClear() {
      this.teacher = null
      // 清空后恢复完整的教员列表
      if (this.canSelectTeacher && this.originalTeacherList.length > 0) {
        this.teacherList = [...this.originalTeacherList]
        this.teacherMapping = { ...this.originalTeacherMapping }
        // 强制重新渲染 Select 组件
        this.teacherListKey++
      } else if (this.canSelectTeacher) {
        // 如果没有缓存，重新获取完整列表
        await this.fetchTeacherList()
      }
    },
    // 获取tooltip内容
    getTooltipContent(label) {
      if (label === '学员兴奋度') {
        return this.excitementTooltipHtml
      }
      return ''
    },
    
    // 获取教员数据
    async fetchTeacherData() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/thirtyEight',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 更新教员详情数据，使用Vue.set确保响应式更新
        this.$set(this, 'teacherDetail', response || {})
        console.log('更新教员详情数据:', this.teacherDetail)
        
        // 获取教员抬头率数据
        await this.fetchTeacherHeadupRate()
        
        // 获取教员教授班级列表
        await this.fetchTeacherClassList()
        
        // 获取学员动作分布数据
        await this.fetchTeacherStudentActionData()
        
        // 获取学员情绪分布数据
        await this.fetchTeacherStudentEmotionData()
        
        // 获取发言次数前十课程数据
        await this.fetchTeacherClassSpeakingData()
        
        // 获取课程散点图数据
        await this.fetchTeacherCourseScatterData()
        
        // 获取教员行为分布数据
        await this.fetchTeacherBehaviorData()
        
        // 获取学员类型分析数据
        await this.fetchStudentTypeAnalysisData()
        
        // 获取我的行为动作分布数据（次数）
        await this.fetchMyBehaviorCountData()
        
        // 获取兴奋度统计数据
        await this.loadExcitementData()
        
      } catch (error) {
        console.error('获取教员数据出错:', error)
        this.$set(this, 'teacherDetail', {})
      }
    },
    // 获取教员抬头率数据
    async fetchTeacherHeadupRate() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortyOne',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 更新教员抬头率数据，使用Vue.set确保响应式更新
        this.$set(this, 'headupRate', response || 0)
        console.log('更新教员抬头率数据:', this.headupRate)
        
      } catch (error) {
        console.error('获取教员抬头率出错:', error)
        this.$set(this, 'headupRate', 0)
      }
    },
    // 获取教员教授班级列表
    async fetchTeacherClassList() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortyTwo',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 更新教员教授班级列表数据，使用Vue.set确保响应式更新
        this.$set(this, 'teacherClassList', Array.isArray(response) ? response : [])
        console.log('更新教员班级列表数据:', this.teacherClassList)
        
      } catch (error) {
        console.error('获取教员教授班级列表出错:', error)
        this.$set(this, 'teacherClassList', [])
      }
    },
    // 获取教员学员动作分布数据
    async fetchTeacherStudentActionData() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortyFour',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 处理响应数据，过滤掉null值的动作
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 更新图表数据，使用Vue.set确保响应式更新
        this.$set(this.studentActionOptions.series[0], 'data', filteredData)
        console.log('更新教员学员动作分布图表数据:', filteredData)
        
        // 强制重新渲染图表
        this.$nextTick(() => {
          this.$forceUpdate()
        })
        
      } catch (error) {
        console.error('获取教员学员动作分布数据出错:', error)
        this.$set(this.studentActionOptions.series[0], 'data', [])
      }
    },
    // 获取教员学员情绪分布数据
    async fetchTeacherStudentEmotionData() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortyThree',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 处理响应数据，过滤掉null值的情绪
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 更新图表数据，使用Vue.set确保响应式更新
        this.$set(this.studentEmotionOptions.series[0], 'data', filteredData)
        console.log('更新教员学员情绪分布图表数据:', filteredData)
        
        // 强制重新渲染图表
        this.$nextTick(() => {
          this.$forceUpdate()
        })
        
      } catch (error) {
        console.error('获取教员学员情绪分布数据出错:', error)
        this.$set(this.studentEmotionOptions.series[0], 'data', [])
      }
    },
    // 获取教员发言次数前十课程数据
    async fetchTeacherClassSpeakingData() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortyFive',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 处理响应数据：{"计算机科学导论":0,"【研】数学与艺术":0,"控制系统计算机仿真":0,"非线性动力学":0}
        let chartData = []
        if (response && typeof response === 'object') {
          // 将对象转换为数组并按发言次数从高到低排序
          chartData = Object.entries(response)
            .map(([className, speakingCount]) => ({
              name: className,
              value: speakingCount || 0
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10) // 取前10个
        }
        
        // 更新图表数据，使用Vue.set确保响应式更新
        const classNames = chartData.map(item => item.name)
        const speakingCounts = chartData.map(item => item.value)
        
        this.$set(this.classSpeakingOptions.xAxis, 'data', classNames)
        this.$set(this.classSpeakingOptions.series[0], 'data', speakingCounts)
        console.log('更新发言次数前十课程图表数据:', { classNames, speakingCounts })
        
        // 强制重新渲染图表
        this.$nextTick(() => {
          this.$forceUpdate()
        })
        
      } catch (error) {
        console.error('获取教员发言次数前十课程数据出错:', error)
        this.$set(this.classSpeakingOptions.xAxis, 'data', [])
        this.$set(this.classSpeakingOptions.series[0], 'data', [])
      }
    },
    // 获取教员课程散点图数据
    async fetchTeacherCourseScatterData() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortySix',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 处理响应数据：[["医用化学",0.0,0.0,"2025-03-05"],["医用化学",0.0,0.0,"2025-03-07"],...]
        let scatterData = []
        if (Array.isArray(response)) {
          scatterData = response.map(item => {
            // item格式：[课程名, RT, CH, 上课日期]
            const [courseName, rt, ch, classDate] = item
            return {
              courseName: courseName,
              classDate: classDate,
              value: [Number(rt), Number(ch)]
            }
          })
        }
        
        // 更新图表数据，使用Vue.set确保响应式更新
        this.$set(this.courseScatterOptions.series[0], 'data', scatterData)
        console.log('更新课程散点图数据:', scatterData)
        
        // 计算课堂类型占比
        this.calculateTeacherClassroomTypeDistribution(scatterData)
        
        // 强制重新渲染图表
        this.$nextTick(() => {
          this.$forceUpdate()
        })
        
      } catch (error) {
        console.error('获取教员课程散点图数据出错:', error)
        this.$set(this.courseScatterOptions.series[0], 'data', [])
      }
    },
    // 获取教员行为分布数据
    async fetchTeacherBehaviorData() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortyNine',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 处理响应数据，过滤掉null值的行为
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 更新教员行为分布图表数据，使用Vue.set确保响应式更新
        this.$set(this.teacherBehaviorOptions.series[0], 'data', filteredData)
        console.log('更新教员行为分布图表数据:', filteredData)
        
        // 强制重新渲染图表
        this.$nextTick(() => {
          this.$forceUpdate()
        })
        
      } catch (error) {
        console.error('获取教员行为分布数据出错:', error)
        this.$set(this.teacherBehaviorOptions.series[0], 'data', [])
      }
    },
    // 计算教员课堂类型分布
    calculateTeacherClassroomTypeDistribution(scatterData) {
      // 将散点图数据转换为计算函数需要的格式
      const dataPoints = scatterData.map(item => ({
        rt: item.value[0],
        ch: item.value[1]
      }))
      
      // 使用通用函数计算分布
      const pieData = calculateClassroomTypeDistribution(dataPoints)
      
      // 更新饼状图数据，使用Vue.set确保响应式更新
      this.$set(this.classroomTypePieOptions.series[0], 'data', pieData)
      console.log('更新教员课堂类型饼状图数据:', pieData)
      
      // 强制重新渲染图表
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    // 获取学员类型分析数据
    async fetchStudentTypeAnalysisData() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortyEight',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 处理响应数据，过滤掉null值的行为
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 提取行为名称和数值
        const behaviorNames = filteredData.map(item => item.name)
        const behaviorValues = filteredData.map(item => Number(item.value))
        
        // 更新图表数据，使用Vue.set确保响应式更新
        this.$set(this.studentTypeAnalysisOptions.xAxis, 'data', behaviorNames)
        this.$set(this.studentTypeAnalysisOptions.series[0], 'data', behaviorValues)
        console.log('更新学员类型分析图表数据:', { behaviorNames, behaviorValues })
        
        // 强制重新渲染图表
        this.$nextTick(() => {
          this.$forceUpdate()
        })
        
      } catch (error) {
        console.error('获取学员类型分析数据出错:', error)
        this.$set(this.studentTypeAnalysisOptions.xAxis, 'data', [])
        this.$set(this.studentTypeAnalysisOptions.series[0], 'data', [])
      }
    },
    // 获取我的行为动作分布数据（次数）
    async fetchMyBehaviorCountData() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fifty',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        // 处理响应数据，过滤掉null值的行为
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 提取行为名称和次数
        const behaviorNames = filteredData.map(item => item.name)
        const behaviorCounts = filteredData.map(item => Number(item.value))
        
        // 更新我的行为动作分布图表数据，使用Vue.set确保响应式更新
        this.$set(this.myBehaviorOptions.xAxis, 'data', behaviorNames)
        this.$set(this.myBehaviorOptions.series[0], 'data', behaviorCounts)
        console.log('更新我的行为动作分布图表数据:', { behaviorNames, behaviorCounts })
        
        // 强制重新渲染图表
        this.$nextTick(() => {
          this.$forceUpdate()
        })
        
      } catch (error) {
        console.error('获取我的行为动作分布数据出错:', error)
        this.$set(this.myBehaviorOptions.xAxis, 'data', [])
        this.$set(this.myBehaviorOptions.series[0], 'data', [])
      }
    },
    
    // 加载兴奋度数据
    async loadExcitementData() {
      if (!this.startDate || !this.endDate || !this.teacher) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const teacherId = this.teacherMapping[this.teacher]
        
        if (!teacherId) {
          console.error('未找到对应的teacherId:', this.teacher)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/teacherData/fortySeven',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            teacherId: teacherId
          }
        })
        
        if (response) {
          // 格式化提示信息
          this.excitementTooltip = `${startDateStr} 日-${endDateStr} 日期间, ${this.teacher}老师 共开展了 ${response.count} 节课, 其中课程兴奋度最高的一节课发生在 ${response.maxDate} 日, 兴奋度为${response.maxRate}%, 兴奋度最低的一节课发生在 ${response.minDate} 日, 兴奋度为 ${response.minRate}%`;
          
          // 生成带样式的HTML提示信息
          this.excitementTooltipHtml = `
            <div style="line-height: 1.6; font-size: 13px;">
              <span style="color: #666;">${startDateStr} 日-${endDateStr} 日期间</span>, 
              <span style="color: #1890ff; font-weight: bold;">${this.teacher}老师</span> 
              共开展了 <span style="color: #ff4d4f; font-weight: bold;">${response.count}</span> 节课, 
              其中课程兴奋度最高的一节课发生在 
              <span style="color: #52c41a; font-weight: bold;">${response.maxDate}</span> 日, 
              兴奋度为<span style="color: #52c41a; font-weight: bold;">${response.maxRate}%</span>, 
              兴奋度最低的一节课发生在 
              <span style="color: #ff7875; font-weight: bold;">${response.minDate}</span> 日, 
              兴奋度为 <span style="color: #ff7875; font-weight: bold;">${response.minRate}%</span>
            </div>
          `;
        }
      } catch (error) {
        console.error('获取兴奋度数据失败:', error)
      }
    },
    
    // 清空图表数据的方法
    clearChartData() {
      // 清空所有图表数据，使用Vue.set确保响应式更新
      this.$set(this.studentActionOptions.series[0], 'data', [])
      this.$set(this.studentEmotionOptions.series[0], 'data', [])
      this.$set(this.classSpeakingOptions.xAxis, 'data', [])
      this.$set(this.classSpeakingOptions.series[0], 'data', [])
      this.$set(this.courseScatterOptions.series[0], 'data', [])
      this.$set(this.teacherBehaviorOptions.series[0], 'data', [])
      this.$set(this.studentTypeAnalysisOptions.xAxis, 'data', [])
      this.$set(this.studentTypeAnalysisOptions.series[0], 'data', [])
      this.$set(this.myBehaviorOptions.xAxis, 'data', [])
      this.$set(this.myBehaviorOptions.series[0], 'data', [])
      this.$set(this.classroomTypePieOptions.series[0], 'data', [])
      
      // 清空教员详情数据
      this.$set(this, 'teacherDetail', {})
      this.$set(this, 'headupRate', 0)
      this.$set(this, 'teacherClassList', [])
      
      // 清空提示信息
      this.$set(this, 'excitementTooltip', '')
      this.$set(this, 'excitementTooltipHtml', '')
      
      console.log('清空所有教员图表数据')
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

/* 筛选框样式 */
.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  min-width: 80px;
}

.date-picker {
  width: 180px;
}

.teacher-select {
  min-width: 200px;
}

/* 教员班级信息区域样式 */
.teacher-info-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #1890ff;
}

.teacher-info-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.teacher-overview-title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  width: fit-content;
}

.title-text {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

.highlight {
  color: #1890ff;
  font-weight: bold;
}

.class-names {
  color: #666;
  font-weight: 500;
}

/* 图表网格样式 */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-grid-three {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .chart-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .chart-grid-three {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
  .chart-grid-three {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: #f7f8fa;
  border-radius: 10px;
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
  content: "";
  position: absolute;
  height: 100%;
  width: 4px;
  border-radius: 2px;
  background: #1890ff;
  left: 0;
  top: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .filter-item {
    width: 100%;
    justify-content: space-between;
  }
  
  .date-picker,
  .teacher-select {
    width: 100%;
    max-width: 300px;
  }
}

/* 数据网格样式 */
.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .data-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .data-grid {
    grid-template-columns: 1fr;
  }
}

.data-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.data-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(5, 109, 232, 0.15);
}

.data-card::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--card-color);
}

.card-number {
  color: var(--card-color);
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-title {
  font-size: 16px;
  color: #7c7c7c;
}

.old-data-card {
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

/* 参与度帮助图标样式 */
.participation-help-icon {
  display: inline-block !important;
  width: 16px !important;
  height: 16px !important;
  line-height: 16px !important;
  text-align: center !important;
  border-radius: 50% !important;
  background-color: #409eff !important;
  color: white !important;
  font-size: 12px !important;
  font-weight: bold !important;
  margin-left: 6px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  vertical-align: middle !important;
  position: relative !important;
  z-index: 10 !important;
}

.participation-help-icon:hover {
  background-color: #66b1ff !important;
  transform: scale(1.1) !important;
}

.card-number {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>


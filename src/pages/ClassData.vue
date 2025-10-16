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
          <label class="filter-label">课程：</label>
          <a-select
            v-model:value="course"
            placeholder="请先选择日期"
            :disabled="!canSelectCourse"
            @change="onCourseChange"
            class="course-select"
            style="width: 200px"
          >
            <a-select-option
              v-for="courseName in courseList"
              :key="courseName"
              :value="courseName"
            >
              {{ courseName }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>

    <!-- 班级信息区域 -->
    <div class="class-info-section" v-if="course">
      <div class="class-info-content">
        <div class="class-overview-title">
          <span class="title-text">班级概况</span>
        </div>
        <span v-if="classList.length > 0">
          当前时间段内，<span class="highlight">{{ course }}</span>班次共<span class="highlight">{{ classList.length }}</span>个小班参与，
          参与班级为: <span class="class-names">{{ displayClassNames }}</span>
        </span>
        <span v-else>
          当前时间段内，<span class="highlight">{{ course }}</span>班次无小班参与
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
          <span v-if="item.label1">{{ item.num1 }} / </span>
          {{ item.num }}
        </div>
        <div class="card-title">
          <span v-if="item.label1">{{ item.label1 }} / </span>
          {{ item.label }}
        </div>
      </a-card>
    </div>

    <!-- 对比表格区域 -->
    <div class="comparison-tables">
      <div class="table-row">
        <a-card class="comparison-table-card">
          <div class="table-title">发言次数前十对比</div>
          <a-table
            :columns="speakingColumns"
            :data-source="speakingTopTenData"
            :pagination="false"
            size="small"
            :scroll="{ x: 400 }"
          >
          </a-table>
        </a-card>
        
        <a-card class="comparison-table-card">
          <div class="table-title">参与度前十对比</div>
          <a-table
            :columns="participationColumns"
            :data-source="participationTopTenData"
            :pagination="false"
            size="small"
            :scroll="{ x: 400 }"
          >
          </a-table>
        </a-card>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">学员动作分布</div>
        <v-chart
          id="studentActionChart"
          :option="studentActionOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">学员情绪分布</div>
        <v-chart
          id="studentEmotionChart"
          :option="studentEmotionOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">教员行为分布</div>
        <v-chart
          id="teacherBehaviorChart"
          :option="teacherBehaviorOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>
    </div>

    <!-- 第二行图表区域 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">学员类型分析</div>
        <v-chart
          id="studentTypeChart"
          :option="studentTypeOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">课堂类型</div>
        <v-chart
          id="classroomTypeChart"
          :option="classroomTypeOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>
    </div>

    <!-- 第三行图表区域 - 课堂占比饼状图 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">课堂类型占比</div>
        <v-chart
          id="classroomTypePieChart"
          :option="classroomTypePieOptions"
          style="height: 280px"
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
import { colorList } from "../services/mockData";
import * as echarts from "echarts";
import VChart from "vue-echarts";
import { thirtyOne, thirtyTwo, getClassroomAttendance } from "@/api/dayData";

export default {
  name: 'ClassData',
  components: {
    ArrowLeftOutlined,
    VChart
  },
  data() {
    return {
      h,
      loading: false,
      classData: {},
      studentData: {},
      headupRate: 0, // 学员抬头率
      classList: [], // 班级列表
      teacherCount: 0, // 教员人数
      studentCount: 0, // 学员人数
      // 筛选相关数据
      startDate: null,
      endDate: null,
      course: null,
      courseList: [],
      courseMapping: {}, // 存储课程名到courseId的映射
      // 对比表格数据
      speakingTopTenData: [], // 发言次数前十对比数据
      participationTopTenData: [], // 参与度前十对比数据
      lastTimeRange: null, // 记录上次的时间范围，用于判断是否需要重新渲染
      // 表格列配置
      speakingColumns: [
        { title: '课程名称', dataIndex: 'courseName', key: 'courseName', width: 300 },
        { 
          title: '发言次数', 
          dataIndex: 'count', 
          key: 'count', 
          width: 150, 
          align: 'right',
        }
      ],
      participationColumns: [
        { title: '课程名称', dataIndex: 'courseName', key: 'courseName', width: 300 },
        { 
          title: '参与度', 
          dataIndex: 'rate', 
          key: 'rate', 
          width: 150, 
          align: 'right',
        }
      ],
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
      // 学员情绪分布图表
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
      // 学员类型分析柱状图
      studentTypeOptions: {
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          axisLabel: {
            interval: 0, // 强制显示所有标签
            rotate: 45, // 倾斜45°
            fontSize: 12,
          },
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "bar",
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
      // 课堂类型图表
      classroomTypeOptions: {
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
            return `课程：${params.name}<br/> RT: ${params.value[0].toFixed(2)}<br/>CH: ${params.value[1].toFixed(2)}`;
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
              formatter: "{b}",
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
      // 课堂类型占比饼状图配置
      classroomTypePieOptions: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "课堂类型占比",
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
  computed: {
    canSelectCourse() {
      return this.startDate && this.endDate
    },
    displayClassNames() {
      if (!this.classList || this.classList.length === 0) {
        return ''
      }
      
      // 最多显示10个班级名
      const displayClasses = this.classList.slice(0, 10)
      let result = displayClasses.join('小班、')
      
      // 如果超过10个，添加省略号
      if (this.classList.length > 10) {
        result += '小班等'
      } else {
        result += '小班'
      }
      
      return result
    },
    numList() {
      return [
        {
          label: "学员人数",
          num: this.studentCount || 0,
          label1: "教员人数",
          num1: this.teacherCount || 0,
          color: colorList[0],
        },
        {
          label: "学员参与度",
          num: this.classData && this.classData.studentEngagementRate !== null && this.classData.studentEngagementRate !== undefined
            ? `${Number(this.classData.studentEngagementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[1],
        },
        {
          label: "学员兴奋度",
          num: this.classData && this.classData.studentExcitementRate !== null && this.classData.studentExcitementRate !== undefined
            ? `${Number(this.classData.studentExcitementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[2],
        },
        {
          label: "学员抬头率",
          num: this.headupRate !== null && this.headupRate !== undefined 
            ? `${Number(this.headupRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[3],
        },
        {
          label: "学员活跃度",
          num: this.classData && this.classData.studentActivationRate !== null && this.classData.studentActivationRate !== undefined
            ? `${Number(this.classData.studentActivationRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[4],
        },
      ];
    },
  },
  async mounted() {
    // 设置默认时间范围：开始时间为180天前，结束时间为今天
    this.startDate = moment().subtract(180, 'days')
    this.endDate = moment()
    
    // 加载默认数据
    await this.loadClassData()
    
    // 获取课程列表并自动选择第一个课程
    await this.fetchCourseList()
    if (this.courseList.length > 0) {
      this.course = this.courseList[0]
      // 选择课程后获取班级数据
      await this.fetchClassData()
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
        this.course = null
        this.courseList = []
        this.courseMapping = {}
      } else if (this.startDate && this.endDate) {
        // 如果两个日期都存在，重新获取课程列表
        this.fetchCourseList()
      }
    },
    onEndDateChange(date) {
      this.endDate = date
      // 当两个日期都选择后，获取课程列表
      if (this.startDate && this.endDate) {
        this.fetchCourseList()
      } else {
        this.course = null
        this.courseList = []
        this.courseMapping = {}
        this.headupRate = 0
        this.classList = []
        this.studentActionOptions.series[0].data = []
        this.studentEmotionOptions.series[0].data = []
        this.studentTypeOptions.xAxis.data = []
        this.studentTypeOptions.series[0].data = []
        this.teacherBehaviorOptions.series[0].data = []
        this.classroomTypeOptions.series[0].data = []
      }
    },
    onCourseChange(value) {
      this.course = value
      console.log('选择的课程:', value)
      // 重置抬头率和班级列表
      this.headupRate = 0
      this.classList = []
      this.studentActionOptions.series[0].data = []
      this.studentEmotionOptions.series[0].data = []
      this.studentTypeOptions.xAxis.data = []
      this.studentTypeOptions.series[0].data = []
      this.teacherBehaviorOptions.series[0].data = []
      this.classroomTypeOptions.series[0].data = []
      // 选择课程后获取班级数据
      if (value) {
        this.fetchClassData()
      }
    },
    // 禁用结束日期（不能早于开始日期）
    disabledEndDate(current) {
      if (!this.startDate) {
        return false
      }
      return current && moment(current).isBefore(moment(this.startDate).startOf('day'))
    },
    // 获取课程列表
    async fetchCourseList() {
      if (!this.startDate || !this.endDate) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        
        const response = await service({
          method: 'get',
          url: '/aiClass/queryCourse',
          params: {
            startDate: startDateStr,
            endDate: endDateStr
          }
        })
        
        // 处理新的响应格式：{"courseId":"{courseName}","courseId":"{courseName}"}
        // 提取所有的 courseName 值，并保存映射关系
        if (response && typeof response === 'object') {
          this.courseList = Object.values(response) || []
          // 保存课程名到courseId的映射
          this.courseMapping = {}
          Object.entries(response).forEach(([courseId, courseName]) => {
            this.courseMapping[courseName] = courseId
          })
        } else {
          this.courseList = []
          this.courseMapping = {}
        }
        
        // 获取对比表格数据（只在时间改变时调用）
        await this.fetchComparisonData()
      } catch (error) {
        console.error('获取课程列表出错:', error)
        this.courseList = []
      }
    },
    
    // 获取对比表格数据
    async fetchComparisonData() {
      if (!this.startDate || !this.endDate) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const currentTimeRange = `${startDateStr}_${endDateStr}`
        
        // 检查时间是否改变，只有时间改变时才重新获取数据
        if (this.lastTimeRange === currentTimeRange) {
          return
        }
        
        this.lastTimeRange = currentTimeRange
        
        // 获取发言次数前十对比数据
        const speakingResponse = await thirtyOne({
          startDate: startDateStr,
          endDate: endDateStr
        })
        
        // 获取参与度前十对比数据
        const participationResponse = await thirtyTwo({
          startDate: startDateStr,
          endDate: endDateStr
        })
        
        console.log('发言次数接口返回:', speakingResponse)
        console.log('参与度接口返回:', participationResponse)
        
        // 处理发言次数数据
        if (speakingResponse && typeof speakingResponse === 'object') {
          this.speakingTopTenData = Object.entries(speakingResponse)
            .map(([courseName, count]) => ({
              courseName,
              count: Number(count)
            }))
          console.log('处理后的发言次数数据:', this.speakingTopTenData)
        } else {
          console.log('发言次数数据格式不正确:', speakingResponse)
          this.speakingTopTenData = []
        }
        
        // 处理参与度数据
        if (participationResponse && typeof participationResponse === 'object') {
          this.participationTopTenData = Object.entries(participationResponse)
            .map(([courseName, rate]) => ({
              courseName,
              rate: Number(rate).toFixed(1) + '%' // 保持数值类型
            }))
          console.log('处理后的参与度数据:', this.participationTopTenData)
        } else {
          console.log('参与度数据格式不正确:', participationResponse)
          this.participationTopTenData = []
        }
        
      } catch (error) {
        console.error('获取对比数据出错:', error)
        this.speakingTopTenData = []
        this.participationTopTenData = []
      }
    },
    // 获取班级数据
    async fetchClassData() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/twentyFive',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 更新班级数据
        this.classData = response || {}
        
        // 获取教员人数和学员人数
        await this.fetchClassroomAttendance()
        
        // 获取学员抬头率
        await this.fetchHeadupRate()
        
        // 获取班级列表
        await this.fetchClassList()
        
        // 获取学员动作分布数据
        await this.fetchStudentActionData()
        
        // 获取学员情绪分布数据
        await this.fetchStudentEmotionData()
        
        // 获取学员类型分析数据
        await this.fetchStudentTypeData()
        
        // 获取教员行为分布数据
        await this.fetchTeacherBehaviorData()
        
        // 获取课堂类型数据
        await this.fetchClassroomTypeData()
        
      } catch (error) {
        console.error('获取班级数据出错:', error)
        this.classData = {}
      }
    },
    // 获取教员人数和学员人数
    async fetchClassroomAttendance() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        // 构建时间范围，模仿今日数据的格式
        const startTime = `${startDateStr} 00:00:00`
        const endTime = `${endDateStr} 23:59:59`
        
        const response = await getClassroomAttendance({
          startTime: startTime,
          endTime: endTime,
          courseId: courseId
        })
        
        if (response && response.code === 200 && response.result) {
          this.teacherCount = response.result.teaCount || 0
          this.studentCount = response.result.stuCount || 0
        }
        
      } catch (error) {
        console.error('获取教员/学员人数出错:', error)
        this.teacherCount = 0
        this.studentCount = 0
      }
    },
    // 获取学员抬头率
    async fetchHeadupRate() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/twentySix',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 更新学员抬头率数据
        this.headupRate = response || 0
        
      } catch (error) {
        console.error('获取学员抬头率出错:', error)
        this.headupRate = 0
      }
    },
    // 获取班级列表
    async fetchClassList() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/twentySeven',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 更新班级列表数据
        this.classList = Array.isArray(response) ? response : []
        
      } catch (error) {
        console.error('获取班级列表出错:', error)
        this.classList = []
      }
    },
    // 获取学员动作分布数据
    async fetchStudentActionData() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/twentyNine',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 处理响应数据，过滤掉null值的动作
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 更新图表数据
        this.studentActionOptions.series[0].data = filteredData
        
        // 手动更新图表
        this.$nextTick(() => {
          const chart = echarts.init(document.getElementById('studentActionChart'))
          if (chart) {
            chart.setOption(this.studentActionOptions)
          }
        })
        
      } catch (error) {
        console.error('获取学员动作分布数据出错:', error)
        this.studentActionOptions.series[0].data = []
      }
    },
    // 获取学员情绪分布数据
    async fetchStudentEmotionData() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/thirty',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 处理响应数据，过滤掉null值的情绪
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 更新图表数据
        this.studentEmotionOptions.series[0].data = filteredData
        
        // 手动更新图表
        this.$nextTick(() => {
          const chart = echarts.init(document.getElementById('studentEmotionChart'))
          if (chart) {
            chart.setOption(this.studentEmotionOptions)
          }
        })
        
      } catch (error) {
        console.error('获取学员情绪分布数据出错:', error)
        this.studentEmotionOptions.series[0].data = []
      }
    },
    // 获取学员类型分析数据
    async fetchStudentTypeData() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/thirtyFive',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 处理响应数据，过滤掉null值并提取name和value
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 提取x轴数据（name）和y轴数据（value）
        const xData = filteredData.map(item => item.name)
        const yData = filteredData.map(item => Number(item.value))
        
        // 更新图表数据
        this.studentTypeOptions.xAxis.data = xData
        this.studentTypeOptions.series[0].data = yData
        
        // 手动更新图表
        this.$nextTick(() => {
          const chart = echarts.init(document.getElementById('studentTypeChart'))
          if (chart) {
            chart.setOption(this.studentTypeOptions)
          }
        })
        
      } catch (error) {
        console.error('获取学员类型分析数据出错:', error)
        this.studentTypeOptions.xAxis.data = []
        this.studentTypeOptions.series[0].data = []
      }
    },
    // 获取教员行为分布数据
    async fetchTeacherBehaviorData() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/thirtySeven',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 处理响应数据，过滤掉null值的行为
        const filteredData = (response || []).filter(item => item.name !== null)
        
        // 更新图表数据
        this.teacherBehaviorOptions.series[0].data = filteredData
        
        // 手动更新图表
        this.$nextTick(() => {
          const chart = echarts.init(document.getElementById('teacherBehaviorChart'))
          if (chart) {
            chart.setOption(this.teacherBehaviorOptions)
          }
        })
        
      } catch (error) {
        console.error('获取教员行为分布数据出错:', error)
        this.teacherBehaviorOptions.series[0].data = []
      }
    },
    // 根据RT和CH值判断课堂类型
    getClassroomType(rt, ch) {
      // 检查是否在三角形外面
      if (rt < 0 || rt > 1 || ch < 0 || ch > 1) {
        return '其他'
      }
      
      // 检查是否在三角形内部
      // 三角形边界：y = 2x (x <= 0.5) 和 y = -2x + 2 (x >= 0.5)
      const leftBoundary = 2 * rt 
      const rightBoundary = -2 * rt + 2 

      console.log("left: ", leftBoundary, "right: ", rightBoundary, "ch: ", ch)
      
      if (ch > leftBoundary || ch > rightBoundary) {
        return '其他'
      }
      
      // 在三角形内部，根据区域判断类型
      if (ch > 0.5) {
        // 上半部分：对话型
        return '对话型'
      } else {
        // 下半部分，根据x坐标判断
        if (rt <= 0.3) {
          return '练习型'
        } else if (rt <= 0.7) {
          return '混合型'
        } else {
          return '讲授型'
        }
      }
    },
    // 计算课堂类型分布
    calculateClassroomTypeDistribution(dataPoints) {
      const typeCount = {
        '对话型': 0,
        '练习型': 0,
        '混合型': 0,
        '讲授型': 0,
        '其他': 0
      }
      
      // 统计每个类型的数量
      dataPoints.forEach(point => {
        const type = this.getClassroomType(point.rt, point.ch)
        typeCount[type]++
      })
      
      // 计算百分比并生成饼状图数据
      const total = dataPoints.length
      const pieData = []
      
      Object.keys(typeCount).forEach(type => {
        if (typeCount[type] > 0) {
          const percentage = ((typeCount[type] / total) * 100).toFixed(1)
          pieData.push({
            name: type,
            value: typeCount[type],
            percentage: percentage
          })
        }
      })
      
      // 更新饼状图数据
      this.classroomTypePieOptions.series[0].data = pieData
      
      // 手动更新饼状图
      this.$nextTick(() => {
        const pieChart = echarts.init(document.getElementById('classroomTypePieChart'))
        if (pieChart) {
          pieChart.setOption(this.classroomTypePieOptions)
        }
      })
    },
    // 获取课堂类型数据
    async fetchClassroomTypeData() {
      if (!this.startDate || !this.endDate || !this.course) {
        return
      }
      
      try {
        const startDateStr = moment(this.startDate).format('YYYY-MM-DD')
        const endDateStr = moment(this.endDate).format('YYYY-MM-DD')
        const courseId = this.courseMapping[this.course]
        
        if (!courseId) {
          console.error('未找到对应的courseId:', this.course)
          return
        }
        
        const response = await service({
          method: 'get',
          url: '/classData/twentyEight',
          params: {
            startDate: startDateStr,
            endDate: endDateStr,
            courseId: courseId
          }
        })
        
        // 处理响应数据，创建散点图数据
        if (response && response.rt !== undefined && response.ch !== undefined) {
          const scatterData = [{
            name: this.course, // 使用选择的课程名
            value: [response.rt, response.ch] // [RT值, CH值]
          }]
          
          // 更新图表数据
          this.classroomTypeOptions.series[0].data = scatterData
          
          // 计算课堂类型占比
          this.calculateClassroomTypeDistribution([{ rt: response.rt, ch: response.ch }])
          
          // 手动更新图表
          this.$nextTick(() => {
            const chart = echarts.init(document.getElementById('classroomTypeChart'))
            if (chart) {
              chart.setOption(this.classroomTypeOptions)
            }
          })
        } else {
          // 如果没有数据，显示空图表
          this.classroomTypeOptions.series[0].data = []
          this.classroomTypePieOptions.series[0].data = []
          this.$nextTick(() => {
            const chart = echarts.init(document.getElementById('classroomTypeChart'))
            const pieChart = echarts.init(document.getElementById('classroomTypePieChart'))
            if (chart) {
              chart.setOption(this.classroomTypeOptions)
            }
            if (pieChart) {
              pieChart.setOption(this.classroomTypePieOptions)
            }
          })
        }
        
      } catch (error) {
        console.error('获取课堂类型数据出错:', error)
        this.classroomTypeOptions.series[0].data = []
      }
    },
    async loadClassData() {
      this.loading = true
      try {
        // 初始化时加载一些默认数据
        this.studentData = {
          totalStudents: 0,
          totalTeachers: 0,
          courses: 0
        }
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


/* 对比表格样式 */
.comparison-tables {
  margin-bottom: 20px;
}

.table-row {
  display: flex;
  gap: 20px;
}

.comparison-table-card {
  flex: 1;
  min-width: 0;
}

.table-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
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

.course-select {
  min-width: 200px;
}

/* 班级信息区域样式 */
.class-info-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #1890ff;
}

.class-info-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.class-overview-title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  width: fit-content;
}

.title-icon {
  font-size: 18px;
  margin-right: 8px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
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
  .course-select {
    width: 100%;
    max-width: 300px;
  }
}

/* 图表网格样式 */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .chart-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .chart-grid {
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
</style>

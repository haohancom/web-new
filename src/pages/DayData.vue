<template>
  <div class="page-container">
    <div class="header">
      <a-button type="primary" @click="goHome" class="back-button">
        返回首页
      </a-button>
      <h1 class="title">今日数据</h1>
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

    <!-- 图表区域 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">学员动作分布</div>
        <v-chart
          id="chart1"
          :option="studentActionOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">教员动作分布</div>
        <v-chart
          id="chart2"
          :option="teacherActionOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card" style="margin-bottom: 20px">
        <div class="chart-title">课程发言次数分布</div>
        <v-chart
          id="chart3"
          :option="speakingOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>
    </div>

    <!-- 底部图表区域 -->
    <div class="chart-grid">
      <a-card class="chart-card">
        <div class="chart-title">发言次数前十课程</div>
        <v-chart
          id="chart4"
          :option="speakingOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">参与度前十班级动作分布</div>
        <v-chart
          :option="actionDistributionOptions"
           id="chart5"
          style="height: 280px"
        ></v-chart>
      </a-card>

      <a-card class="chart-card">
        <div class="chart-title">兴奋度前十班级情绪分布</div>
        <v-chart
         id="chart6"
          :option="actionDistributionOptions"
          style="height: 280px"
        ></v-chart>
      </a-card>

      <!-- <a-card class="chart-card">
        <div class="chart-title">参与度前十班级对比</div>
      </a-card> -->
    </div>

    <!-- 概况区域 -->
    <div class="overview-grid">
      <a-card class="overview-card">
        <div class="overview-title">班级概况</div>
         <v-chart
          id="chart7"
          :option="speakingOptions"
          style="height: 280px"
        ></v-chart>
        <!-- <div class="item-grid" style="grid-template-columns: repeat(3, 1fr)">
          <div
            v-for="(item, index) in classOverview"
            :key="index"
            class="overview-item"
            :style="{ background: 'green' }"
          >
            <div class="item-number">{{ item.num }}</div>
            <div class="item-title">{{ item.title }}</div>
          </div>
        </div> -->
      </a-card>

      <a-card class="overview-card">
        <div class="overview-title">课堂概况</div>、
      
        <div class="item-grid" style="grid-template-columns: repeat(2, 1fr)">
          <div
            v-for="(item, index) in classroomOverview"
            :key="index"
            class="overview-item"
            :style="{background :'#1890ff'}"
          >
            <div class="item-number">{{ item.num }}</div>
            <div class="item-title">{{ item.label }}</div>
          </div>
        </div>
      </a-card>

      <a-card class="overview-card">
        <div class="overview-title">课堂类型</div>
        <div style="padding: 20px">
          <v-chart id="typeChart" :option="TypeOptions" style="height:300px;width:100%"/>        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import * as echarts from "echarts";
import { h } from "vue";
import VChart from "vue-echarts";
import { colorList } from "../services/mockData";
import { dzfb, jydz, fycs, fyqs, cydz,jrgk,bjgk,xfqx } from "@/api/dayData";
import { xscq } from "../api/dayData";

export default {
  name: "DayData",
  components: {
    VChart,
    ArrowLeftOutlined,
  },
  data() {
    return {
      headupRate:0,
     stAttRate:50,
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
            name: "Access From",
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
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
          },
        ],
      },
      teacherActionOptions: {},
      teacherEmotionOptions: {},
      speakingOptions: {
        xAxis: {
          axisLabel: {
            interval: 0, // 强制显示所有标签
            rotate: 45, // 倾斜45°
            fontSize: 12,
          },
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
          },
        ],
      },
      engagementOptions: {},
      actionDistributionOptions: {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["快乐", "悲伤", "惊讶", "厌恶"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          axisLabel: {
            interval: 0, // 强制显示所有标签
            rotate: 45, // 倾斜45°
            fontSize: 12,
          },
          type: "category",
          boundaryGap: false,
          data: ["课程1", "课程2", "课程3", "课程4"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "快乐",
            type: "line",

            data: [120, 132, 101, 134],
          },
          {
            name: "悲伤",
            type: "line",

            data: [220, 182, 191, 234, 290],
          },
          {
            name: "惊讶",
            type: "line",

            data: [150, 232, 201, 154, 190],
          },
          {
            name: "厌恶",
            type: "line",

            data: [320, 332, 301, 334, 390],
          },
        ],
      },
      emotionDistributionOptions: {},
      courseTypeOptions: {},
      TypeOptions: {
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
          trigger: 'item', // 触发类型：item表示对单个点触发
          formatter: function (params) {
            // params.value 是 [x, y]
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
            tooltip: { show: false } // 关闭此系列的 tooltip
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
            tooltip: { show: false } // 关闭此系列的 tooltip
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
            tooltip: { show: false } // 关闭此系列的 tooltip
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
            tooltip: { show: false } // 关闭此系列的 tooltip
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
      todayData: {},
      studentData: {},
      teacherData: {},
      classOverview: [
        { num: 11, title: "前排就坐率" },
        { num: "22", title: "出勤率" },
      ],
      courseTypes: {},
      topSpeakingCourses: {},
      topEngagementClasses: {},
      classActionDistribution: {},
      classEmotionDistribution: {},
      h,
    };
  },
  created() {
    this.getData();
  },
  computed: {
    numList() {
      return [
        {
          label: "学员人数",
          num: this.studentData?.totalStudents || 0,
          label1: "教员人数",
          num1: this.studentData?.totalTeachers || 0,
          color: colorList[0],
        },
        {
          label: "学员参与度",
          num: this.todayData
            ? `${Number(this.todayData.studentEngagementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[1],
        },
        {
          label: "学员兴奋度",
          num: this.todayData
            ? `${Number(this.todayData.studentExcitementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[2],
        },
        {
          label: "学员抬头率",
          num: this.headupRate,
          
          color: colorList[3],
        },
        {
          label: "学员活跃度",
          num: this.todayData
            ? `${Number(this.todayData.studentActivationRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[4],
        },
        {
          label: "课程数",
          num: this.studentData?.courses || 0,
          color: colorList[5],
        },
      ];
    },
    classroomOverview(){
       return [
            {
          label: "学员出勤率",
          num: this.stAttRate
            ? `${Number(this.stAttRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[1],
        },
          {
          label: "学员参与度",
          num: this.todayData
            ? `${Number(this.todayData.studentEngagementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[1],
        },
        {
          label: "学员兴奋度",
          num: this.todayData
            ? `${Number(this.todayData.studentExcitementRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[2],
        },
  
        {
          label: "学员活跃度",
          num: this.todayData
            ? `${Number(this.todayData.studentActivationRate).toFixed(1)}%`
            : "0.0%",
          color: colorList[4],
        },
      
       ]
    },
    // studentActionOptions() {
    //   if (!this.studentData?.actions) return {}
    //   return {
    //     tooltip: { trigger: 'item' },
    //     legend: {
    //       orient: 'vertical',
    //       top: 'center',
    //       right: 0,
    //       data: this.studentData.actions.map(item => item.name)
    //     },
    //     series: [{
    //       type: 'pie',
    //       radius: ['70%', '96%'],
    //       left: 'center',
    //       center: [40, 'center'],
    //       data: this.studentData.actions,
    //       label: { show: false },
    //       labelLine: { show: false },
    //       emphasis: {
    //         itemStyle: {
    //           shadowBlur: 10,
    //           shadowOffsetX: 0,
    //           shadowColor: 'rgba(0, 0, 0, 0.5)'
    //         }
    //       }
    //     }]
    //   }
    // },
    // teacherActionOptions() {
    //   if (!this.teacherData?.actions) return {}
    //   return {
    //     tooltip: { trigger: 'item' },
    //     legend: {
    //       orient: 'vertical',
    //       top: 'center',
    //       right: 0,
    //       data: this.teacherData.actions.map(item => item.name)
    //     },
    //     series: [{
    //       type: 'pie',
    //       radius: ['70%', '96%'],
    //       left: 'center',
    //       center: [40, 'center'],
    //       data: this.teacherData.actions,
    //       label: { show: false },
    //       labelLine: { show: false },
    //       emphasis: {
    //         itemStyle: {
    //           shadowBlur: 10,
    //           shadowOffsetX: 0,
    //           shadowColor: 'rgba(0, 0, 0, 0.5)'
    //         }
    //       }
    //     }]
    //   }
    // },
    // teacherEmotionOptions() {
    //   if (!this.studentData?.emotions) return {}
    //   return {
    //     tooltip: { trigger: 'item' },
    //     legend: {
    //       orient: 'vertical',
    //       top: 'center',
    //       right: 0,
    //       data: this.studentData.emotions.map(item => item.name)
    //     },
    //     series: [{
    //       type: 'pie',
    //       radius: ['70%', '96%'],
    //       left: 'center',
    //       center: [40, 'center'],
    //       data: this.studentData.emotions,
    //       label: { show: false },
    //       labelLine: { show: false },
    //       emphasis: {
    //         itemStyle: {
    //           shadowBlur: 10,
    //           shadowOffsetX: 0,
    //           shadowColor: 'rgba(0, 0, 0, 0.5)'
    //         }
    //       }
    //     }]
    //   }
    // },
    // speakingOptions() {
    //   if (!this.topSpeakingCourses) return {}
    //   return {
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {
    //         type: 'line',
    //         lineStyle: {
    //           width: 26,
    //           color: 'rgba(150,150,150,0.3)'
    //         }
    //       }
    //     },
    //     color: ['#71D1FD'],
    //     xAxis: {
    //       type: 'category',
    //       name: '课程名',
    //       nameGap: 1,
    //       data: this.topSpeakingCourses.map(item => item.title),
    //       axisLabel: {
    //         rotate: 20,
    //         interval: 0
    //       }
    //     },
    //     yAxis: {
    //       type: 'value',
    //       name: '发言次数',
    //       minInterval: 1,
    //       min: 0
    //     },
    //     series: [{
    //       data: this.topSpeakingCourses.map(item => item.num),
    //       type: 'bar',
    //       barWidth: 20
    //     }]
    //   }
    // },
    // engagementOptions() {
    //   if (!this.topEngagementClasses) return {}
    //   return {
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {
    //         type: 'line',
    //         lineStyle: {
    //           width: 26,
    //           color: 'rgba(150,150,150,0.3)'
    //         }
    //       }
    //     },
    //     color: ['#71D1FD'],
    //     xAxis: {
    //       type: 'category',
    //       name: '班级名',
    //       nameGap: 1,
    //       data: this.topEngagementClasses.map(item => item.title),
    //       axisLabel: {
    //         rotate: 20,
    //         interval: 0
    //       }
    //     },
    //     yAxis: {
    //       type: 'value',
    //       name: '参与度/%',
    //       minInterval: 1,
    //       min: 0
    //     },
    //     series: [{
    //       data: this.topEngagementClasses.map(item => parseFloat(item.num)),
    //       type: 'bar',
    //       barWidth: 20
    //     }]
    //   }
    // },
    // actionDistributionOptions() {
    //   if (!this.classActionDistribution) return {}
    //   return {
    //     tooltip: { trigger: 'axis' },
    //     legend: {
    //       data: this.classActionDistribution.data.map(item => item.name)
    //     },
    //     xAxis: {
    //       type: 'category',
    //       data: this.classActionDistribution.classList,
    //       axisLabel: {
    //         rotate: 20,
    //         interval: 0
    //       }
    //     },
    //     yAxis: {
    //       type: 'value',
    //       splitNumber: 8
    //     },
    //     series: this.classActionDistribution.data
    //   }
    // },
    // emotionDistributionOptions() {
    //   if (!this.classEmotionDistribution) return {}
    //   return {
    //     tooltip: { trigger: 'axis' },
    //     legend: {
    //       data: this.classEmotionDistribution.data.map(item => item.name)
    //     },
    //     xAxis: {
    //       type: 'category',
    //       data: this.classEmotionDistribution.classList,
    //       axisLabel: {
    //         rotate: 20,
    //         interval: 0
    //       }
    //     },
    //     yAxis: {
    //       type: 'value',
    //       splitNumber: 8
    //     },
    //     series: this.classEmotionDistribution.data
    //   }
    // },
    // courseTypeOptions() {
    //   if (!this.courseTypes) return {}
    //   return {
    //     tooltip: { trigger: "item" },
    //     legend: {
    //       top: "5%",
    //       left: "center",
    //       textStyle: { color: "#333" }
    //     },
    //     series: [{
    //       name: "学习类型",
    //       type: "pie",
    //       radius: ["45%", "60%"],
    //       center: ['50%', '55%'],
    //       avoidLabelOverlap: false,
    //       label: {
    //         show: true,
    //         position: "outside",
    //         formatter: (params) => `${params.name}: ${params.percent.toFixed(1)}%`,
    //         color: '#333'
    //       },
    //       data: this.courseTypes
    //     }],
    //     color: ["#4a90e2", "#50e3c2", "#f5a623", "#ff4c4c"]
    //   }
    // }
  },
  async mounted() {
    // await this.initData();
    this.showLessonsType();
  },
  methods: {
    showChart() {},
    getData() {
      //今日数据概况
      jrgk({}).then((res) =>{
                   this.todayData = res
      })


      //学员动作分布
      dzfb({}).then((res) => {
        if (res) {
          this.studentActionOptions.series[0].data = res;
          var chart1 = echarts.init(document.getElementById("chart1"));
          chart1.setOption(this.studentActionOptions);

              // 需要排除的类型
const exclude = ["玩手机", "低头", "趴桌子"];

// 过滤数据
const filtered = res.filter(item => !exclude.includes(item.name));
console.log(filtered)
// 计算平均值
const avg = filtered.reduce((sum, item) => sum + parseFloat(item.value), 0) / filtered.length;

// 输出结果
console.log("抬头率:", avg.toFixed(2));
this.headupRate = avg.toFixed(2) + "%"
          
        } else {
          this.$message.warning("请稍后重试");
        }
        this.loading = false;
      });

      //教员动作分布
      jydz({}).then((res) => {
        this.studentActionOptions.series[0].data = res;
        var chart2 = echarts.init(document.getElementById("chart2"));
        chart2.setOption(this.studentActionOptions);

    
      }
    );

      //发言次数分布
      fycs({}).then((res) => {
        const xData = [];
        const yData = [];

        for (const [key, value] of Object.entries(res)) {
          xData.push(key); // 课程名
          yData.push(Number(value)); // 数量，确保转成数字
        }
        this.speakingOptions.xAxis.data = xData;
        this.speakingOptions.series[0].data = yData;
        var chart3 = echarts.init(document.getElementById("chart3"));
        chart3.setOption(this.speakingOptions);
      });


      //发言次数前十课程
      fyqs({}).then((res) => {
        const xData = [];
        const yData = [];

        for (const [key, value] of Object.entries(res)) {
          xData.push(key); // 课程名
          yData.push(Number(value)); // 数量，确保转成数字
        }
        this.speakingOptions.xAxis.data = xData;
        this.speakingOptions.series[0].data = yData;
        var chart4 = echarts.init(document.getElementById("chart4"));
        chart4.setOption(this.speakingOptions);
      });

       //参与度前十动作分布
      cydz({}).then((res) => {
        const courseNames = Object.keys(res); // 

        // 2️⃣ 动作名（假设各课程动作一致）
        const actions = res[courseNames[0]].map((item) => item.action);

        // 3️⃣ 生成 series 数组
        const seriesData = actions.map((action) => {
          return {
            name: action,
            type: "line",
            data: courseNames.map((course) => {
              const found = res[course].find((i) => i.action === action);
              return found ? found.count : 0;
            }),
          };
        });
        this.actionDistributionOptions.xAxis.data = courseNames
        this.actionDistributionOptions.series = seriesData
         var chart5 = echarts.init(document.getElementById("chart5"));
        chart5.setOption(this.actionDistributionOptions);
      });

      
       //兴奋度前十情绪分布
      xfqx({}).then((res) => {
        const courseNames = Object.keys(res); // 

        // 2️⃣ 动作名（假设各课程动作一致）
        const emotion = res[courseNames[0]].map((item) => item.emotion);

        // 3️⃣ 生成 series 数组
        const seriesData = emotion.map((emotion) => {
          return {
            name: emotion,
            type: "line",
            data: courseNames.map((course) => {
              const found = res[course].find((i) => i.emotion === emotion);
              return found ? found.count : 0;
            }),
          };
        });
        this.actionDistributionOptions.xAxis.data = courseNames
        this.actionDistributionOptions.series = seriesData
         var chart6 = echarts.init(document.getElementById("chart6"));
        chart6.setOption(this.actionDistributionOptions);
      });

      
      //发言次数分布
      bjgk({}).then((res) => {
        const xData = [];
        const yData = [];

        for (const [key, value] of Object.entries(res)) {
          xData.push(key); // 课程名
          yData.push(Number(value)); // 数量，确保转成数字
        }
        this.speakingOptions.xAxis.data = xData;
        this.speakingOptions.series[0].data = yData;
        var chart7 = echarts.init(document.getElementById("chart7"));
        chart7.setOption(this.speakingOptions);
      });

      //学生出勤率
         xscq({}).then((res) =>{
          this.stAttRate = res
         })

    },
    goHome() {
      this.$router.push("/");
    },
    showLessonsType() {
      const chart = echarts.init(document.getElementById("typeChart"));

      const rawData = [
        ["数学", 0.1, 0.3],
        ["语文", 0.3, 0.4],
        ["物理", 0.6, 0.7],
        ["化学", 0.8, 0.6],
        ["生物", 0.4, 0.5],
        ["历史", 0.2, 0.3],
        ["地理", 0.5, 0.4],
        ["政治", 0.7, 0.9],
        ["英语", 0.5, 0.8],
      ];
      const scatterData = rawData.map((item) => ({
        name: item[0],
        value: [item[1], item[2]],
      }));
      console.log(scatterData);
      this.TypeOptions.series[0].data = scatterData;

      chart.setOption(this.TypeOptions);
    },
    async initData() {
      try {
        this.todayData = {
          ...this.todayData,
          ...((await this.ten()) || {}),
        };
        this.studentData = studentData;
        this.teacherData = teacherData;
        this.classOverview = classOverview;
        this.classroomOverview = classroomOverview;
        this.courseTypes = courseTypes;
        this.topSpeakingCourses = topSpeakingCourses;
        this.topEngagementClasses = topEngagementClasses;
        this.classActionDistribution = classActionDistribution;
        this.classEmotionDistribution = classEmotionDistribution;
      } catch (error) {
        console.error("初始化数据失败:", error);
      }
    },


  },
};
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

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1200px) {
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

.overview-card {
  padding: 0;
}

.overview-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  position: relative;
  margin-bottom: 20px;
  padding: 10px 20px 0;
}

.overview-title::after {
  content: "";
  position: absolute;
  height: 100%;
  width: 4px;
  border-radius: 2px;
  background: #1890ff;
  left: 14px;
  top: 0;
}

.item-grid {
  display: grid;
  gap: 20px;
  padding: 20px;
}

.overview-item {
  border-radius: 8px;
  height: 120px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-number {
  color: #fff;
  font-size: 26px;
  line-height: 42px;
  margin-bottom: 5px;
}

.item-title {
  color: #333;
  font-weight: bold;
  font-size: 20px;
}
</style>

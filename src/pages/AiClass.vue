<template>
  <div class="page-container">
    <div class="header">
      <a-button type="primary" @click="goHome" class="back-button">
        返回首页
      </a-button>
      <h1 class="title">AI课堂</h1>
    </div>

    <!-- 筛选框区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-label">日期范围：</label>

          <el-date-picker
            v-model="dateRange"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>

        <div class="filter-item">
          <label class="filter-label">教室：</label>
          <el-select v-model="siteId" filterable clearable placeholder="全部">
            <el-option
              v-for="item in siteList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <label class="filter-label">课程：</label>
          <el-select v-model="courseId" filterable clearable placeholder="全部">
            <el-option
              v-for="item in courseList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="filter-item">
          <label class="filter-label">教师：</label>
          <el-select
            v-model="teacherId"
            filterable
            clearable
            placeholder="全部"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="filter-item">
          <label class="filter-label">班级：</label>
          <el-select
            v-model="studentClassId"
            filterable
            clearable
            placeholder="全部"
          >
            <el-option
              v-for="item in classList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <a-button type="primary" @click="handleQuery" class="back-button">
          查询
        </a-button>
        <a-button
          type="primary"
          @click="showCompare"
          class="back-button"
          :disabled="compareList.length < 2"
        >
          对比
        </a-button>
      </div>
    </div>

    <a-card class="data-card">
      <div class="card-title">课堂数据</div>
      <el-table
        :data="tableData"
        stripe
        height="700"
        style="width: 100%; color: black"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="classDate"
          label="上课日期"
          align="center"
          show-overflow-tooltip
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="site"
          label="教室"
          align="center"
          show-overflow-tooltip
          min-width="240"
        >
        </el-table-column>
        <el-table-column
          prop="classTime"
          label="上课时间"
          align="center"
          show-overflow-tooltip
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="studentClassName"
          label="班级"
          align="center"
          show-overflow-tooltip
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="course"
          label="课程"
          align="center"
          show-overflow-tooltip
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="teacherName"
          label="老师"
          align="center"
          show-overflow-tooltip
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="lookupRate"
          label="抬头率"
          align="center"
          show-overflow-tooltip
          min-width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.lookupRate || '0' }}%
          </template>
        </el-table-column>
        <el-table-column
          prop="attentionRate"
          label="兴奋度"
          align="center"
          show-overflow-tooltip
          min-width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.attentionRate || '0' }}%
          </template>
        </el-table-column>
        <el-table-column
          prop="participationRate"
          label="参与度"
          align="center"
          show-overflow-tooltip
          min-width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.participationRate || '0' }}%
          </template>
        </el-table-column>
        <el-table-column
          prop="activityRate"
          label="活跃度"
          align="center"
          show-overflow-tooltip
          min-width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.activityRate || '0' }}%
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          show-overflow-tooltip
          min-width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              circle
              size="mini"
              plain
              @click="showDetail(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handCurrentChange"
          @size-change="handSizeChange"
          background
          layout="sizes, prev, pager, next,total"
        >
        </el-pagination>
      </div>
    </a-card>
    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      height="100px"
      top="50px"
    >
      <div
        style="
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        "
      >
        <div style="display: flex; flex-direction: column; align-items: center">
          <div style="margin-top: 10px">学生动作</div>
          <div
            id="chart1"
            style="width: 400px; height: 400px; background-color: #f0f0f0"
          ></div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center">
          <div style="margin-top: 10px">教师动作</div>
          <div
            id="chart2"
            style="width: 400px; height: 400px; background-color: #f0f0f0"
          ></div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center">
          <div style="margin-top: 10px">学生情绪</div>
          <div
            id="chart3"
            style="width: 400px; height: 400px; background-color: #f0f0f0"
          ></div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center">
          <div style="margin-top: 10px">情绪分布分析</div>
          <div
            id="chart4"
            style="width: 400px; height: 400px; background-color: #f0f0f0"
          ></div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="compareVisible"
      width="60%"
      height="500px"
      top="50px"
    >
      <vxe-grid class="reverse-table" v-bind="gridOptions"></vxe-grid>
    </el-dialog>
  </div>
</template>

<script>
import { ArrowLeftOutlined } from "@ant-design/icons-vue";

import {
  getClass,
  getCourse,
  getTeacher,
  getStudentClass,
  getClassroom,
  getStudentAction,
  getStudentEmotion,
  getTeacherAction,
  getClassCount,
  getDetailList,
} from "@/api/aiClass";
import * as echarts from "echarts";
import { h } from "vue";
import moment from "moment";

export default {
  name: "AiClass",
  components: {
    ArrowLeftOutlined,
  },
  data() {
    return {
      gridOptions: {
        border: true,
        showOverflow: true,
        height: 600,
        showHeader: false,
        columns: [
          { field: "col1", width: 100 },
          { field: "col2", minWidth: 160 },
          { field: "col3", minWidth: 160 },
          { field: "col4", minWidth: 160 },
          { field: "col5", minWidth: 160 },
          { field: "col6", minWidth: 160 },
          { field: "col7", minWidth: 160 },
        ],
        data: [
          {
            col1: "Name",
            col2: "Test1",
            col3: "Test2",
            col4: "Test3",
            col5: "Test4",
            col6: "Test5",
            col7: "Test6",
          },
          {
            col1: "Role",
            col2: "Develop",
            col3: "PM",
            col4: "Designer",
            col5: "Test",
            col6: "Designer",
            col7: "Develop",
          },
          {
            col1: "Sex",
            col2: "Man",
            col3: "Women",
            col4: "Man",
            col5: "Women",
            col6: "Man",
            col7: "Women",
          },
          {
            col1: "Age",
            col2: "28",
            col3: "18",
            col4: "22",
            col5: "30",
            col6: "26",
            col7: "34",
          },
          {
            col1: "Rate",
            col2: "1",
            col3: "4",
            col4: "5",
            col5: "2",
            col6: "0",
            col7: "4",
          },
          {
            col1: "Date",
            col2: "2024-11-01",
            col3: "2024-01-19",
            col4: "2022-09-01",
            col5: "2024-01-01",
            col6: "2024-10-09",
            col7: "2024-12-20",
          },
          {
            col1: "Address",
            col2: "Shenzhen",
            col3: "Guangzhou",
            col4: "Shanghai Guangzhou Shanghai Guangzhou",
            col5: "Shenzhen",
            col6: "Shanghai",
            col7: "Guangzhou",
          },
          {
            col1: "UpdateTime",
            col2: "2024-08-01",
            col3: "2023-06-18",
            col4: "2022-11-11",
            col5: "2024-11-15",
            col6: "2024-11-05",
            col7: "2024-11-28",
          },
          {
            col1: "CreateTime",
            col2: "2026-11-03",
            col3: "2024-05-01",
            col4: "2024-11-22",
            col5: "2023-05-09",
            col6: "2024-11-25",
            col7: "2025-11-07",
          },
        ],
      },
      compareVisible: false,
      total: 0,

      direction: "rtl",
      currentPage: 1,
      pageSize: 10,
      studentClassId: "",
      dateRange: null,
      teacherId: "",
      h,
      tableData: [],
      loading: false,
      classData: [],
      // 筛选相关数据
      dialogVisible: false,
      siteId: "",
      courseId: "",
      compareList: [],
      compareColumns: [
        { title: "上课日期", field: "classDate" },
        { title: "教室", field: "site" },
        { title: "上课时间", field: "classTime" },
        { title: "班级", field: "studentClassName" },
        { title: "课程", field: "course" },
        { title: "老师", field: "teacherName" },
        { title: "抬头率", field: "lookupRate" },
        { title: "兴奋度", field: "attentionRate" },
        { title: "参与度", field: "participationRate" },
        { title: "活跃度", field: "activityRate" },
      ],
      siteList: [
        { value: "101", label: "101教室" },
        { value: "102", label: "102教室" },
        { value: "103", label: "103教室" },
        { value: "104", label: "104教室" },
        { value: "105", label: "105教室" },
      ],
      classList: [
        {
          value: "1班",
          key: 111,
        },
        {
          value: "2班",
          key: 222,
        },
        {
          value: "3班",
          key: 333,
        },
      ],
      courseList: [
        {
          lable: "语文",
          value: "111",
        },
      ],
      teacherList: [
        {
          name: "老王",
          id: "111",
        },
        {
          name: "老李",
          id: "222",
        },
      ],
      columns: [
        {
          title: "上课日期",
          dataIndex: "classDate",
          key: "classDate",
        },
        {
          title: "教室",
          dataIndex: "site",
          key: "site",
        },
        {
          title: "上课时间",
          dataIndex: "classTime",
          key: "classTime",
        },
        {
          title: "班级",
          dataIndex: "studentClassName",
          key: "studentClassName",
        },
        {
          title: "课程",
          dataIndex: "course",
          key: "course",
        },
        {
          title: "老师",
          dataIndex: "teacherName",
          key: "teacherName",
        },
      ],
      actionOptions: {
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
              { value: 1048, name: "学生动作1" },
              { value: 735, name: "学生动作2" },
              { value: 580, name: "学生动作3" },
              { value: 484, name: "学生动作4" },
            ],
          },
        ],
      },
    };
  },
  computed: {},
  async mounted() {
    getCourse().then((res) => {
      const newList = Object.entries(res).map(([value, label]) => ({
        value: value,
        label: label,
      }));
      console.log(newList);
      this.courseList = newList;
    });
    getClassroom().then((res) => {
      const newList = Object.entries(res).map(([value, label]) => ({
        value: value,
        label: label,
      }));
      console.log(newList);
      this.siteList = newList;
    });
    getTeacher().then((res) => {
      const newList = Object.entries(res).map(([value, label]) => ({
        value: value,
        label: label,
      }));

      this.teacherList = newList;
    });

    getStudentClass().then((res) => {
      const newList = Object.entries(res).map(([value, label]) => ({
        value: value,
        label: label,
      }));

      this.classList = newList;
    });

    this.getTable();
  },
  methods: {
    getTable() {
      let params = {
        startDate: this.dateRange ? this.dateRange[0] : null,
        endDate: this.dateRange ? this.dateRange[1] : null,
        teacherId: this.teacherId,
        studentClassId: this.studentClassId,
        courseId: this.courseId,
        siteId: this.siteId, // 修复：添加siteId参数
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      };
      
      // 获取总数的参数（不包含分页参数）
      let countParams = {
        startDate: this.dateRange ? this.dateRange[0] : null,
        endDate: this.dateRange ? this.dateRange[1] : null,
        teacherId: this.teacherId,
        studentClassId: this.studentClassId,
        courseId: this.courseId,
        siteId: this.siteId, // 修复：添加siteId参数
      };
      
      console.log(params);
      
      // 同时调用获取数据和获取总数的接口
      Promise.all([
        getClass(params),
        getClassCount(countParams)
      ]).then(([dataRes, countRes]) => {
        if (dataRes && dataRes.length !== 0) {
          // 提取curriculumId列表
          const curriculumIds = dataRes.map(item => item.curriculumId).join(',');
          
          // 如果有curriculumId，则调用详情接口
          if (curriculumIds) {
            getDetailList({ curriculumIdList: curriculumIds }).then((detailRes) => {
              // 使用详情数据更新表格数据
              this.tableData = this.updateTableWithDetails(dataRes, detailRes);
              this.total = countRes || 0;
              this.$message.success("查询成功");
            }).catch((detailError) => {
              console.error("获取详情数据失败:", detailError);
              // 即使详情接口失败，也显示基础数据
              this.tableData = dataRes;
              this.total = countRes || 0;
              this.$message.success("查询成功（详情数据获取失败）");
            });
          } else {
            this.tableData = dataRes;
            this.total = countRes || 0;
            this.$message.success("查询成功");
          }
        } else {
          this.tableData = [];
          this.total = 0;
          this.$message.warning("暂无数据");
        }
      }).catch((error) => {
        console.error("查询失败:", error);
        this.$message.error("查询失败，请稍后重试");
      });
    },
    // 根据详情数据更新表格数据
    updateTableWithDetails(tableData, detailData) {
      // 创建详情数据的映射，以curriculumId为key
      const detailMap = {};
      if (detailData && detailData.length > 0) {
        detailData.forEach(item => {
          detailMap[item.curriculumId] = item;
        });
      }

      // 格式化数值，处理0值和null值
      const formatValue = (value) => {
        if (value === null || value === undefined || value === '') {
          return '0';
        }
        // 确保数字类型，并保留一位小数
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          return '0';
        }
        return numValue.toFixed(1);
      };

      // 更新表格数据
      return tableData.map(row => {
        const detail = detailMap[row.curriculumId];
        if (detail) {
          return {
            ...row,
            // 映射详情数据到表格字段，如果没有值则默认显示0
            lookupRate: formatValue(detail.studentFocusRate || row.lookupRate), // 抬头率对应studentFocusRate
            attentionRate: formatValue(detail.studentExcitementRate || row.attentionRate || 0), // 兴奋度对应studentExcitementRate，默认0
            participationRate: formatValue(detail.studentEngagementRate || row.participationRate || 0), // 参与度对应studentEngagementRate，默认0
            activityRate: formatValue(detail.studentActivationRate || row.activityRate || 0), // 活跃度对应studentActivationRate，默认0
          };
        }
        return {
          ...row,
          // 如果没有详情数据，确保默认值
          lookupRate: formatValue(row.lookupRate),
          attentionRate: formatValue(row.attentionRate || 0),
          participationRate: formatValue(row.participationRate || 0),
          activityRate: formatValue(row.activityRate || 0),
        };
      });
    },
    handleQuery() {
      this.currentPage = 1; // 重置到第一页
      this.getTable();
    },
    goHome() {
      this.$router.push("/");
    },
    
    // 情绪分类和汇总处理函数
    processEmotionData(emotionData) {
      // 定义情绪分类规则
      const normalEmotions = ['普通/正常', '正常', '平静'];
      const positiveEmotions = ['微笑', '大笑', '高兴'];
      const negativeEmotions = ['未知', '愤怒', '悲伤', '厌恶', '害怕', '惊讶', '困惑', '尖叫'];
      
      // 初始化汇总数据
      const summary = {
        '正常': 0,
        '积极': 0,
        '消极': 0
      };
      
      // 遍历原始数据并进行分类汇总
      emotionData.forEach(item => {
        const emotionName = item.name;
        const value = parseInt(item.value) || 0;
        
        if (normalEmotions.includes(emotionName)) {
          summary['正常'] += value;
        } else if (positiveEmotions.includes(emotionName)) {
          summary['积极'] += value;
        } else if (negativeEmotions.includes(emotionName)) {
          summary['消极'] += value;
        } else {
          // 如果情绪名称不在预定义列表中，归类为消极
          summary['消极'] += value;
        }
      });
      
      // 转换为图表数据格式
      return Object.keys(summary).map(key => ({
        name: key,
        value: summary[key]
      })).filter(item => item.value > 0); // 只显示有数据的分类
    },
    showCompare() {
      if (this.compareList.length > 20) {
        this.$message.warning("最多选择20条");
        return;
      }
      const buildData = this.compareColumns.map((column) => {
        const item = { col0: column.title };
        this.compareList.forEach((row, index) => {
          item[`col${index + 1}`] = row[column.field];
        });
        return item;
      });
      const buildColumns = [{ field: "col0", fixed: "left", width: 100 }];
      this.compareList.forEach((item, index) => {
        buildColumns.push({
          field: `col${index + 1}`,
          minWidth: 200,
        });
      });
      this.gridOptions.data = buildData;
      this.gridOptions.columns = buildColumns;
      this.compareVisible = true;
    },
    showDetail(row) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        // 学生动作数据
        getStudentAction({ curriculumId: row.curriculumId }).then((res) => {
          if (!res || res.length === 0) {
            this.$message.warning("暂无学生动作数据");
            return;
          }
          // 过滤掉name为null的数据，并转换为正确的格式
          const data = res
            .filter(item => item.name !== null)
            .map((item) => ({
              value: parseInt(item.value),
              name: item.name,
            }));
          
          const studentActionOptions = {
            tooltip: {
              trigger: "item",
            },
            legend: {
              top: "5%",
              left: "center",
            },
            series: [
              {
                name: "学生动作",
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
                data: data,
              },
            ],
          };
          
          var chart1 = echarts.init(document.getElementById("chart1"));
          chart1.setOption(studentActionOptions);
        });

        // 教师动作数据
        getTeacherAction({ curriculumId: row.curriculumId }).then((res) => {
          if (!res || res.length === 0) {
            this.$message.warning("暂无教师数据");
            return;
          }
          // 过滤掉name为null的数据，并转换为正确的格式
          const data = res
            .filter(item => item.name !== null)
            .map((item) => ({
              value: parseInt(item.value),
              name: item.name,
            }));
          
          const teacherActionOptions = {
            tooltip: {
              trigger: "item",
            },
            legend: {
              top: "5%",
              left: "center",
            },
            series: [
              {
                name: "教师动作",
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
                data: data,
              },
            ],
          };
          
          var chart2 = echarts.init(document.getElementById("chart2"));
          chart2.setOption(teacherActionOptions);
        });

        // 学生情绪数据
        getStudentEmotion({ curriculumId: row.curriculumId }).then((res) => {
          if (!res || res.length === 0) {
            this.$message.warning("暂无学生情绪数据");
            return;
          }
          // 过滤掉name为null的数据，并转换为正确的格式
          const data = res
            .filter(item => item.name !== null)
            .map((item) => ({
              value: parseInt(item.value),
              name: item.name,
            }));
          
          const studentEmotionOptions = {
            tooltip: {
              trigger: "item",
            },
            legend: {
              top: "5%",
              left: "center",
            },
            series: [
              {
                name: "学生情绪",
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
                data: data,
              },
            ],
          };
          
          var chart3 = echarts.init(document.getElementById("chart3"));
          chart3.setOption(studentEmotionOptions);
          
          // 处理情绪分布分析数据
          const emotionAnalysisData = this.processEmotionData(data);
          
          const emotionAnalysisOptions = {
            tooltip: {
              trigger: "item",
            },
            legend: {
              top: "5%",
              left: "center",
            },
            series: [
              {
                name: "情绪分布分析",
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
                data: emotionAnalysisData,
              },
            ],
          };
          
          var chart4 = echarts.init(document.getElementById("chart4"));
          chart4.setOption(emotionAnalysisOptions);
        });
      });
    },
    handleSelectionChange(val) {
      this.compareList = val;
      console.log(this.compareList);
    },
    handCurrentChange(val) {
      this.currentPage = val;
      this.getTable();
    },
    handSizeChange(val) {
      this.pageSize = val;
      this.getTable();
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
  content: "";
  position: absolute;
  height: 100%;
  width: 4px;
  border-radius: 2px;
  background: #1890ff;
  left: 0;
  top: 0;
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

/* Element UI Date Picker 修复样式 */
.el-date-editor {
  width: 280px !important;
  min-width: 280px !important;
}

.el-date-editor .el-range-separator {
  width: auto !important;
  min-width: 20px !important;
  text-align: center !important;
  display: inline-block !important;
  visibility: visible !important;
  color: #606266 !important;
  font-size: 14px !important;
}

.el-date-editor .el-range-input {
  width: auto !important;
  min-width: 100px !important;
  flex: 1 !important;
}

.el-date-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #e4e7ed;
}

.el-date-picker__header-label {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}

.el-picker-panel__icon-btn {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  color: #606266;
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.el-picker-panel__icon-btn:hover {
  color: #409eff;
  background-color: #f5f7fa;
}

.el-date-picker__header-btn {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  color: #606266;
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.el-date-picker__header-btn:hover {
  color: #409eff;
  background-color: #f5f7fa;
}

.el-date-picker__prev-btn,
.el-date-picker__next-btn {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  color: #606266;
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.el-date-picker__prev-btn:hover,
.el-date-picker__next-btn:hover {
  color: #409eff;
  background-color: #f5f7fa;
}

/* 确保箭头图标显示 */
.el-date-picker__prev-btn::before {
  content: "❮";
  font-size: 14px;
  font-weight: bold;
}

.el-date-picker__next-btn::before {
  content: "❯";
  font-size: 14px;
  font-weight: bold;
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

  .el-date-editor {
    width: 100% !important;
    max-width: 320px;
    min-width: 280px;
  }
}
</style>

<style lang="less" scoped>
.box {
  width: 100%;
  height: 40px;
  display: flex;
  .content1 {
    width: 130px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #e7f2fd;
    border-right: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    border-left: 1px solid #409eff;
    color: #252525;
    font-size: 14px;
    font-weight: 700;
    position: absolute; //表头固定
  }
  .content2:nth-child(odd) {
    //对奇数列样式进行设置
    min-width: 200px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #f4f8fc;
    color: #666666;
    border-right: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    font-size: 14px;
  }
  .content2:nth-child(2) {
    margin-left: 130px !important; //表头固定后，数据内容的第一列需要设置左边距空出表头的宽度
  }
  .content2:nth-child(even) {
    //对偶数列样式进行设置
    min-width: 200px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #fff;
    color: #666666;
    border-right: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    font-size: 14px;
  }
}
</style>

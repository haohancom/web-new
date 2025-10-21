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
        <a-button
          type="primary"
          @click="showAddClassDialog"
          class="back-button"
        >
          新增课堂
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
    
    <!-- 新增课堂模态框 -->
    <el-dialog
      :visible.sync="addClassDialogVisible"
      title="新增教学设计"
      width="600px"
      @close="resetAddClassForm"
    >
      <el-form :model="addClassForm" :rules="addClassRules" ref="addClassForm" label-width="100px">
        <!-- 教学模式 -->
        <el-form-item label="教学模式:" prop="faceTeachType">
          <el-select v-model="addClassForm.faceTeachType" placeholder="请选择教学模式" style="width: 100%">
            <el-option label="交互(研讨)教学" :value="1"></el-option>
            <el-option label="混合教学" :value="2"></el-option>
            <el-option label="案例/战例教学" :value="3"></el-option>
            <el-option label="想定作业教学" :value="4"></el-option>
            <el-option label="专题研究" :value="5"></el-option>
            <el-option label="综合演练" :value="6"></el-option>
          </el-select>
        </el-form-item>
        
        <!-- 教师选择 -->
        <el-form-item label="教师:" prop="teacherId">
          <el-select
            v-model="addClassForm.teacherId"
            filterable
            remote
            reserve-keyword
            placeholder="请搜索并选择教师"
            :remote-method="searchTeachers"
            :loading="teacherSearchLoading"
            @change="onTeacherChange"
            style="width: 100%"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="teacher in teacherOptions"
              :key="teacher.teaId"
              :label="teacher.teaName"
              :value="teacher.teaId"
            ></el-option>
          </el-select>
          <!-- 教师分页控件 -->
          <div v-if="teacherPagination.totalPages > 1" style="margin-top: 10px; text-align: center;">
            <el-pagination
              :current-page="teacherPagination.curPage"
              :page-size="teacherPagination.pageSize"
              :total="teacherPagination.totalCount"
              layout="prev, pager, next"
              @current-change="handleTeacherPageChange"
              small
            ></el-pagination>
          </div>
        </el-form-item>
        
        <!-- 课程选择 -->
        <el-form-item label="*课程:" prop="courseId">
          <el-select v-model="addClassForm.courseId" placeholder="请选择课程" :disabled="!addClassForm.teacherId" @change="onCourseChange" style="width: 100%">
            <el-option
              v-for="course in courseOptions"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <!-- 开课选择 -->
        <el-form-item label="*开课:" prop="openCourseId">
          <el-select v-model="addClassForm.openCourseId" placeholder="请选择开课" :disabled="!addClassForm.courseId" @change="onOpenCourseChange" style="width: 100%">
            <el-option
              v-for="openCourse in openCourseOptions"
              :key="openCourse.openCourseId"
              :label="openCourse.openCourseName"
              :value="openCourse.openCourseId"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <!-- 班级选择 -->
        <el-form-item label="*班级:" prop="classIds">
          <div style="display: flex; align-items: center; gap: 10px;">
            <el-select
              v-model="addClassForm.classIds"
              multiple
              placeholder="请选择班级"
              :disabled="!addClassForm.openCourseId"
              style="flex: 1"
            >
              <el-option
                v-for="classItem in classOptions"
                :key="classItem.id"
                :label="classItem.name"
                :value="classItem.id"
              ></el-option>
            </el-select>
            <el-checkbox
              v-model="selectAllClasses"
              @change="handleSelectAllClasses"
              :disabled="!addClassForm.openCourseId"
            >
              全选
            </el-checkbox>
          </div>
        </el-form-item>
        
        <!-- 日期选择 -->
        <el-form-item label="*日期:" prop="date">
          <el-date-picker
            v-model="addClassForm.date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        
        <!-- 时间选择 -->
        <el-form-item label="时间:" prop="timeRange" class="time-range-form-item">
          <div class="time-picker-container">
            <el-time-picker
              v-model="addClassForm.startTime"
              placeholder="开始时间"
              value-format="HH:mm:ss"
              class="time-picker-item"
              :popper-append-to-body="false"
            ></el-time-picker>
            <span class="time-separator">-</span>
            <el-time-picker
              v-model="addClassForm.endTime"
              placeholder="结束时间"
              value-format="HH:mm:ss"
              class="time-picker-item"
              :popper-append-to-body="false"
            ></el-time-picker>
          </div>
        </el-form-item>
        
        <!-- 节次选择 -->
        <el-form-item label="*节次:" prop="classSection">
          <el-select v-model="addClassForm.classSection" placeholder="请选择节次" @change="onClassSectionChange" style="width: 100%">
            <el-option label="1,2" value="1,2"></el-option>
            <el-option label="3,4" value="3,4"></el-option>
            <el-option label="5,6" value="5,6"></el-option>
            <el-option label="7,8" value="7,8"></el-option>
            <el-option label="9,10" value="9,10"></el-option>
            <el-option label="自定义" value="custom"></el-option>
          </el-select>
        </el-form-item>
        
        <!-- 自定义节次输入 -->
        <el-form-item v-if="addClassForm.classSection === 'custom'" label="自定义节次:" prop="customSection">
          <div style="display: flex; align-items: center; gap: 10px;">
            <el-input-number
              v-model="addClassForm.customStartSection"
              :min="1"
              :max="20"
              placeholder="开始节次"
            ></el-input-number>
            <span>-</span>
            <el-input-number
              v-model="addClassForm.customEndSection"
              :min="1"
              :max="20"
              placeholder="结束节次"
            ></el-input-number>
          </div>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClassDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddClass">确定</el-button>
      </div>
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
      // 新增课堂相关数据
      addClassDialogVisible: false,
      addClassForm: {
        faceTeachType: null,
        teacherId: '',
        courseId: '',
        openCourseId: '',
        classIds: [],
        date: '',
        startTime: '',
        endTime: '',
        classSection: '',
        customStartSection: null,
        customEndSection: null
      },
      addClassRules: {
        faceTeachType: [{ required: true, message: '请选择教学模式', trigger: 'change' }],
        teacherId: [{ required: true, message: '请选择教师', trigger: 'change' }],
        courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
        openCourseId: [{ required: true, message: '请选择开课', trigger: 'change' }],
        classIds: [{ required: true, message: '请选择班级', trigger: 'change' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        classSection: [{ required: true, message: '请选择节次', trigger: 'change' }]
      },
      // 教师搜索相关
      teacherOptions: [],
      teacherSearchLoading: false,
      teacherPagination: {
        curPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0
      },
      lastSearchQuery: '',
      // 课程相关
      courseOptions: [],
      openCourseOptions: [],
      classOptions: [],
      selectAllClasses: false
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
    
    // 新增课堂相关方法
    showAddClassDialog() {
      this.addClassDialogVisible = true;
      // 初始化教师搜索
      this.searchTeachers('');
    },
    
    resetAddClassForm() {
      this.addClassForm = {
        faceTeachType: null,
        teacherId: '',
        courseId: '',
        openCourseId: '',
        classIds: [],
        date: '',
        startTime: '',
        endTime: '',
        classSection: '',
        customStartSection: null,
        customEndSection: null
      };
      this.courseOptions = [];
      this.openCourseOptions = [];
      this.classOptions = [];
      this.selectAllClasses = false;
      if (this.$refs.addClassForm) {
        this.$refs.addClassForm.resetFields();
      }
    },
    
    // 教师搜索相关方法
    async searchTeachers(query) {
      this.teacherSearchLoading = true;
      try {
        // 如果是新的搜索查询，重置到第一页
        if (query !== this.lastSearchQuery) {
          this.teacherPagination.curPage = 1;
          this.lastSearchQuery = query;
        }
        
        const response = await fetch(`/qt/course/dock/getSchoolTeaList?name=${encodeURIComponent(query)}&page=${this.teacherPagination.curPage}&pageSize=${this.teacherPagination.pageSize}`);
        const data = await response.json();
        
        if (data.code === 200) {
          this.teacherOptions = data.result.list;
          this.teacherPagination = {
            curPage: data.result.curPage,
            pageSize: data.result.pageSize,
            totalCount: data.result.totalCount,
            totalPages: data.result.totalPages
          };
        }
      } catch (error) {
        console.error('搜索教师失败:', error);
        this.$message.error('搜索教师失败');
      } finally {
        this.teacherSearchLoading = false;
      }
    },
    
    handleTeacherPageChange(page) {
      this.teacherPagination.curPage = page;
      this.searchTeachers(this.lastSearchQuery);
    },
    
    onTeacherChange(teacherId) {
      if (teacherId) {
        this.loadCourses(teacherId);
        // 清空后续选择
        this.addClassForm.courseId = '';
        this.addClassForm.openCourseId = '';
        this.addClassForm.classIds = [];
        this.courseOptions = [];
        this.openCourseOptions = [];
        this.classOptions = [];
      }
    },
    
    // 课程相关方法
    async loadCourses(teacherId) {
      try {
        const response = await fetch(`/qt/course/dock/getAllCourseData?teaId=${teacherId}`);
        const data = await response.json();
        
        if (data.code === 200) {
          this.courseOptions = data.result;
        }
      } catch (error) {
        console.error('获取课程失败:', error);
        this.$message.error('获取课程失败');
      }
    },
    
    onCourseChange(courseId) {
      if (courseId && this.addClassForm.teacherId) {
        this.loadOpenCourses(courseId, this.addClassForm.teacherId);
        // 清空后续选择
        this.addClassForm.openCourseId = '';
        this.addClassForm.classIds = [];
        this.openCourseOptions = [];
        this.classOptions = [];
      }
    },
    
    async loadOpenCourses(courseId, teacherId) {
      try {
        const response = await fetch(`/qt/course/dock/getOpenCourseCrumbsPage?courseId=${courseId}&teaId=${teacherId}`);
        const data = await response.json();
        
        if (data.code === 200) {
          this.openCourseOptions = data.result.list;
        }
      } catch (error) {
        console.error('获取开课失败:', error);
        this.$message.error('获取开课失败');
      }
    },
    
    onOpenCourseChange(openCourseId) {
      if (openCourseId && this.addClassForm.courseId && this.addClassForm.teacherId) {
        this.loadClasses(this.addClassForm.courseId, this.addClassForm.teacherId, openCourseId);
        // 清空班级选择
        this.addClassForm.classIds = [];
        this.selectAllClasses = false;
      }
    },
    
    async loadClasses(courseId, teacherId, openCourseId) {
      try {
        const response = await fetch(`/qt/course/dock/getFaceClassById?courseId=${courseId}&teaId=${teacherId}&openCourseId=${openCourseId}`);
        const data = await response.json();
        
        if (data.code === 200) {
          this.classOptions = data.result;
        }
      } catch (error) {
        console.error('获取班级失败:', error);
        this.$message.error('获取班级失败');
      }
    },
    
    // 班级全选功能
    handleSelectAllClasses(checked) {
      if (checked) {
        this.addClassForm.classIds = this.classOptions.map(item => item.id);
      } else {
        this.addClassForm.classIds = [];
      }
    },
    
    // 节次相关方法
    onClassSectionChange(value) {
      if (value !== 'custom') {
        this.addClassForm.customStartSection = null;
        this.addClassForm.customEndSection = null;
      }
    },
    
    // 提交新增课堂
    async submitAddClass() {
      try {
        await this.$refs.addClassForm.validate();
        
        // 构建提交数据
        const submitData = {
          courseId: this.addClassForm.courseId,
          openCourseId: this.addClassForm.openCourseId,
          startDate: this.formatDateTime(this.addClassForm.date, this.addClassForm.startTime),
          endDate: this.formatDateTime(this.addClassForm.date, this.addClassForm.endTime),
          classSection: this.getFinalClassSection(),
          classIds: this.addClassForm.classIds,
          faceTeachType: this.addClassForm.faceTeachType,
          teaId: this.addClassForm.teacherId
        };
        
        // 验证必填字段
        const requiredFields = {
          courseId: '课程',
          openCourseId: '开课',
          classIds: '班级',
          faceTeachType: '教学模式',
          teaId: '教师'
        };
        
        for (const [key, name] of Object.entries(requiredFields)) {
          if (!submitData[key] || (Array.isArray(submitData[key]) && submitData[key].length === 0)) {
            this.$message.error(`请选择${name}`);
            return;
          }
        }
        
        if (!submitData.classSection) {
          this.$message.error('请选择节次');
          return;
        }
        
        // 发送请求
        const response = await fetch('/qt/course/dock/addFaceTeach', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData)
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
          this.$message.success('新增课堂成功');
          this.addClassDialogVisible = false;
          this.resetAddClassForm();
          // 刷新表格数据
          this.getTable();
        } else {
          this.$message.error(result.msg || '新增课堂失败');
        }
        
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('提交失败，请检查表单');
      }
    },
    
    formatDateTime(date, time) {
      if (!date) return '';
      if (!time) {
        // 如果没有时间，使用默认时间
        return `${date} 00:00:00`;
      }
      return `${date} ${time}`;
    },
    
    getFinalClassSection() {
      if (this.addClassForm.classSection === 'custom') {
        if (this.addClassForm.customStartSection && this.addClassForm.customEndSection) {
          return `${this.addClassForm.customStartSection},${this.addClassForm.customEndSection}`;
        }
        return '';
      }
      return this.addClassForm.classSection;
    }
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

/* 新增课堂模态框样式优化 */
.el-dialog {
  .el-form-item {
    margin-bottom: 18px;
  }
  
  /* 时间选择器容器样式 */
  .time-picker-container {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  
  .time-picker-item {
    flex: 1;
    min-width: 0;
    max-width: 160px;
  }
  
  .time-separator {
    flex-shrink: 0;
    font-weight: 500;
    color: #606266;
    margin: 0 4px;
  }
  
  /* 时间选择器样式优化 */
  .el-form-item:has(.el-time-picker) {
    .el-form-item__content {
      position: relative;
    }
    
    /* 确保时间选择器下拉面板不会超出对话框 */
    .el-time-picker__popper {
      position: fixed !important;
      z-index: 2000 !important;
    }
  }
  
  /* 教师选择器分页样式 */
  .el-form-item:has(.el-pagination) {
    .el-form-item__content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  
  /* 班级选择器样式 */
  .el-form-item:has(.el-select[multiple]) {
    .el-form-item__content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .el-select {
      flex: 1;
      min-width: 0;
    }
    
    .el-checkbox {
      flex-shrink: 0;
    }
  }
  
  /* 自定义节次输入样式 */
  .el-form-item:has(.el-input-number) {
    .el-form-item__content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .el-input-number {
      flex: 1;
      max-width: 120px;
    }
  }
}

/* 全局时间选择器下拉面板样式 */
.el-time-panel {
  max-height: 200px;
  overflow-y: auto;
}

.el-time-picker__popper {
  position: fixed !important;
  z-index: 2000 !important;
}

/* 新增课堂模态框特定样式 */
.el-dialog[aria-label="新增教学设计"] {
  width: 600px !important;
  max-width: 90vw;
  
  .el-dialog__body {
    padding: 20px 20px 10px 20px;
  }
  
  .el-form {
    .el-form-item__label {
      width: 100px !important;
      text-align: right;
      padding-right: 12px;
    }
    
    .el-form-item__content {
      margin-left: 100px !important;
    }
  }
}

/* 响应式设计 - 小屏幕优化 */
@media (max-width: 768px) {
  .el-dialog[aria-label="新增教学设计"] {
    width: 95vw !important;
    margin: 0 auto;
    
    .el-form {
      .el-form-item__label {
        width: 80px !important;
      }
      
      .el-form-item__content {
        margin-left: 80px !important;
      }
    }
    
    .time-picker-item {
      max-width: 120px;
    }
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

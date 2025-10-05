import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import styled from 'styled-components';
import {
  getTodayData,
  getStudentData,
  getTeacherData,
  getClassOverview,
  getClassroomOverview,
  getCourseTypes,
  getTopSpeakingCourses,
  getTopEngagementClasses,
  getClassActionDistribution,
  getClassEmotionDistribution,
  colorList,
  globalDataUpdater
} from '../services/mockData';

const PageContainer = styled.div`
  padding: 20px;
  min-height: 100vh;
  background: var(--background-color);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  .back-button {
    margin-right: 16px;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: var(--primary-color);
  font-size: 24px;
  font-weight: bold;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DataCard = styled(Card)<{ color: string }>`
  .ant-card-body {
    padding: 20px;
    background: #F7F8FA;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: ${props => props.color};
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(5, 109, 232, 0.15);
    }
  }
  
  .card-number {
    color: ${props => props.color};
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .card-title {
    font-size: 16px;
    color: #7c7c7c;
  }
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(Card)`
  .ant-card-body {
    background: #f7f8fa;
    padding: 10px 20px;
    border-radius: 10px;
  }
  
  .chart-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    position: relative;
    margin-bottom: 20px;
    
    &::after {
      content: '';
      position: absolute;
      height: 100%;
      width: 4px;
      border-radius: 2px;
      background: #1890ff;
      left: -14px;
      top: 0px;
    }
  }
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OverviewCard = styled(Card)`
  .ant-card-body {
    padding: 0;
  }
`;

const OverviewTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  position: relative;
  margin-bottom: 20px;
  padding: 10px 20px 0;
  
  &::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 4px;
    border-radius: 2px;
    background: #1890ff;
    left: 14px;
    top: 0px;
  }
`;

const ItemGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: 20px;
  padding: 20px;
`;

const OverviewItem = styled.div<{ background: string }>`
  border-radius: 8px;
  height: 120px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${props => props.background};
  
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
`;

const DayData: React.FC = () => {
  const navigate = useNavigate();
  const [todayData, setTodayData] = useState(getTodayData());
  const [studentData, setStudentData] = useState(getStudentData());
  const [teacherData, setTeacherData] = useState(getTeacherData());
  const [classOverview, setClassOverview] = useState(getClassOverview());
  const [classroomOverview, setClassroomOverview] = useState(getClassroomOverview());
  const [courseTypes, setCourseTypes] = useState(getCourseTypes());
  const [topSpeakingCourses, setTopSpeakingCourses] = useState(getTopSpeakingCourses());
  const [topEngagementClasses, setTopEngagementClasses] = useState(getTopEngagementClasses());
  const [classActionDistribution, setClassActionDistribution] = useState(getClassActionDistribution());
  const [classEmotionDistribution, setClassEmotionDistribution] = useState(getClassEmotionDistribution());

  // 数据更新函数
  const updateData = () => {
    setTodayData(getTodayData());
    setStudentData(getStudentData());
    setTeacherData(getTeacherData());
    setClassOverview(getClassOverview());
    setClassroomOverview(getClassroomOverview());
    setCourseTypes(getCourseTypes());
    setTopSpeakingCourses(getTopSpeakingCourses());
    setTopEngagementClasses(getTopEngagementClasses());
    setClassActionDistribution(getClassActionDistribution());
    setClassEmotionDistribution(getClassEmotionDistribution());
  };

  useEffect(() => {
    // 订阅数据更新
    const unsubscribe = globalDataUpdater.subscribe(updateData);
    
    // 启动数据更新器
    globalDataUpdater.start(3000); // 每3秒更新一次

    return () => {
      unsubscribe();
      globalDataUpdater.stop();
    };
  }, []);

  // 数字卡片数据
  const numList = [
    { 
      label: '学员人数', 
      num: studentData.totalStudents, 
      label1: '教员人数', 
      num1: studentData.totalTeachers,
      color: colorList[0]
    },
    { 
      label: '学员参与度', 
      num: `${todayData.studentEngagementRate.toFixed(1)}%`,
      color: colorList[1]
    },
    { 
      label: '学员兴奋度', 
      num: `${todayData.studentExcitementRate.toFixed(1)}%`,
      color: colorList[2]
    },
    { 
      label: '学员抬头率', 
      num: `${todayData.studentFocusRate.toFixed(1)}%`,
      color: colorList[3]
    },
    { 
      label: '学员活跃度', 
      num: `${todayData.studentActivationRate.toFixed(1)}%`,
      color: colorList[4]
    },
    { 
      label: '课程数', 
      num: studentData.courses,
      color: colorList[5]
    }
  ];

  // 学员动作分布图表配置
  const studentActionOptions = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      top: 'center',
      right: 0,
      data: studentData.actions.map(item => item.name)
    },
    series: [{
      type: 'pie',
      radius: ['70%', '96%'],
      left: 'center',
      center: [40, 'center'],
      data: studentData.actions,
      label: { show: false },
      labelLine: { show: false },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // 教员动作分布图表配置
  const teacherActionOptions = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      top: 'center',
      right: 0,
      data: teacherData.actions.map(item => item.name)
    },
    series: [{
      type: 'pie',
      radius: ['70%', '96%'],
      left: 'center',
      center: [40, 'center'],
      data: teacherData.actions,
      label: { show: false },
      labelLine: { show: false },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // 教员情绪分布图表配置
  const teacherEmotionOptions = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      top: 'center',
      right: 0,
      data: studentData.emotions.map(item => item.name)
    },
    series: [{
      type: 'pie',
      radius: ['70%', '96%'],
      left: 'center',
      center: [40, 'center'],
      data: studentData.emotions,
      label: { show: false },
      labelLine: { show: false },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // 课程发言次数分布图表配置
  const speakingOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          width: 26,
          color: 'rgba(150,150,150,0.3)'
        }
      }
    },
    color: ['#71D1FD'],
    xAxis: {
      type: 'category',
      name: '课程名',
      nameGap: 1,
      data: topSpeakingCourses.map(item => item.title),
      axisLabel: {
        rotate: 20,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '发言次数',
      minInterval: 1,
      min: 0
    },
    series: [{
      data: topSpeakingCourses.map(item => item.num),
      type: 'bar',
      barWidth: 20
    }]
  };

  // 参与度前十班级对比图表配置
  const engagementOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          width: 26,
          color: 'rgba(150,150,150,0.3)'
        }
      }
    },
    color: ['#71D1FD'],
    xAxis: {
      type: 'category',
      name: '班级名',
      nameGap: 1,
      data: topEngagementClasses.map(item => item.title),
      axisLabel: {
        rotate: 20,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '参与度/%',
      minInterval: 1,
      min: 0
    },
    series: [{
      data: topEngagementClasses.map(item => parseFloat(item.num)),
      type: 'bar',
      barWidth: 20
    }]
  };

  // 参与度前十班级动作分布图表配置
  const actionDistributionOptions = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: classActionDistribution.data.map(item => item.name)
    },
    xAxis: {
      type: 'category',
      data: classActionDistribution.classList,
      axisLabel: {
        rotate: 20,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      splitNumber: 8
    },
    series: classActionDistribution.data
  };

  // 兴奋度前十班级情绪分布图表配置
  const emotionDistributionOptions = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: classEmotionDistribution.data.map(item => item.name)
    },
    xAxis: {
      type: 'category',
      data: classEmotionDistribution.classList,
      axisLabel: {
        rotate: 20,
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      splitNumber: 8
    },
    series: classEmotionDistribution.data
  };

  // 课堂类型图表配置
  const courseTypeOptions = {
    tooltip: { trigger: "item" },
    legend: {
      top: "5%",
      left: "center",
      textStyle: { color: "#333" }
    },
    series: [{
      name: "学习类型",
      type: "pie",
      radius: ["45%", "60%"],
      center: ['50%', '55%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: "outside",
        formatter: (params: any) => `${params.name}: ${params.percent.toFixed(1)}%`,
        color: '#333'
      },
      data: courseTypes
    }],
    color: ["#4a90e2", "#50e3c2", "#f5a623", "#ff4c4c"]
  };

  return (
    <PageContainer>
      <Header>
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          className="back-button"
        >
          返回首页
        </Button>
        <Title>今日数据</Title>
      </Header>

      {/* 顶部数据卡片 */}
      <DataGrid>
        {numList.map((item, index) => (
          <DataCard key={index} color={item.color}>
            <div className="card-number">
              {item.label1 && <span>{item.num1} / </span>}
              {item.num}
            </div>
            <div className="card-title">
              {item.label1 && <span>{item.label1} / </span>}
              {item.label}
            </div>
          </DataCard>
        ))}
      </DataGrid>

      {/* 图表区域 */}
      <ChartGrid>
        <ChartCard>
          <div className="chart-title">学员动作分布</div>
          <ReactECharts option={studentActionOptions} style={{ height: '280px' }} />
        </ChartCard>
        
        <ChartCard>
          <div className="chart-title">教员动作分布</div>
          <ReactECharts option={teacherActionOptions} style={{ height: '280px' }} />
        </ChartCard>
        
        <ChartCard>
          <div className="chart-title">教员情绪分布</div>
          <ReactECharts option={teacherEmotionOptions} style={{ height: '280px' }} />
        </ChartCard>
      </ChartGrid>

      {/* 发言次数前十课程 */}
      <ChartCard style={{ marginBottom: '20px' }}>
        <div className="chart-title">课程发言次数分布</div>
        <ReactECharts option={speakingOptions} style={{ height: '280px' }} />
      </ChartCard>

      {/* 底部图表区域 */}
      <ChartGrid>
        <ChartCard>
          <div className="chart-title">发言次数前十课程</div>
          <ReactECharts option={speakingOptions} style={{ height: '280px' }} />
        </ChartCard>
        
        <ChartCard>
          <div className="chart-title">参与度前十班级动作分布</div>
          <ReactECharts option={actionDistributionOptions} style={{ height: '280px' }} />
        </ChartCard>
        
        <ChartCard>
          <div className="chart-title">兴奋度前十班级情绪分布</div>
          <ReactECharts option={emotionDistributionOptions} style={{ height: '280px' }} />
        </ChartCard>
        
        <ChartCard>
          <div className="chart-title">参与度前十班级对比</div>
          <ReactECharts option={engagementOptions} style={{ height: '280px' }} />
        </ChartCard>
      </ChartGrid>

      {/* 概况区域 */}
      <OverviewGrid>
        <OverviewCard>
          <OverviewTitle>班级概况</OverviewTitle>
          <ItemGrid columns={3}>
            {classOverview.map((item, index) => (
              <OverviewItem key={index} background={item.background}>
                <div className="item-number">{item.num}</div>
                <div className="item-title">{item.title}</div>
              </OverviewItem>
            ))}
          </ItemGrid>
        </OverviewCard>
        
        <OverviewCard>
          <OverviewTitle>课堂概况</OverviewTitle>
          <ItemGrid columns={2}>
            {classroomOverview.map((item, index) => (
              <OverviewItem key={index} background={item.background}>
                <div className="item-number">{item.num}</div>
                <div className="item-title">{item.title}</div>
              </OverviewItem>
            ))}
          </ItemGrid>
        </OverviewCard>
        
        <OverviewCard>
          <OverviewTitle>课堂类型</OverviewTitle>
          <div style={{ padding: '20px' }}>
            <ReactECharts option={courseTypeOptions} style={{ height: '280px' }} />
          </div>
        </OverviewCard>
      </OverviewGrid>
    </PageContainer>
  );
};

export default DayData;

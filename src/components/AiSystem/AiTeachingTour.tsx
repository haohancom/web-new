import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import styled from 'styled-components';
import { globalDataUpdater } from '../../services/mockData';

const Container = styled.div`
  padding: 20px;
`;

const StatCard = styled(Card)<{ color: string }>`
  margin-bottom: 16px;
  
  .ant-card-body {
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
`;

const ChartCard = styled(Card)`
  margin-bottom: 20px;
  
  .ant-card-body {
    background: #f7f8fa;
    padding: 20px;
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

const AiTeachingTour: React.FC = () => {
  const [tourData, setTourData] = useState({
    totalClasses: 0,
    activeClasses: 0,
    aiDetections: 0,
    alertCount: 0
  });

  const [classroomData, setClassroomData] = useState<any[]>([]);

  const generateClassroomData = () => {
    const classes = [
      '2022级潜艇观通班', '2022级舰艇指挥班', '2023级通信工程班',
      '2023级计算机班', '2022级电子班', '2023级软件班',
      '2022级网络班', '2023级数据班', '2022级AI班', '2023级物联网班'
    ];

    return classes.map((className, index) => ({
      key: index,
      className,
      teacher: `教师${index + 1}`,
      status: Math.random() > 0.2 ? '正常' : Math.random() > 0.5 ? '需关注' : '异常',
      studentCount: Math.floor(Math.random() * 30) + 20,
      engagement: Math.floor(Math.random() * 30) + 60,
      focus: Math.floor(Math.random() * 25) + 65,
      alerts: Math.floor(Math.random() * 5)
    }));
  };

  const updateData = () => {
    setTourData({
      totalClasses: Math.floor(Math.random() * 20) + 80,
      activeClasses: Math.floor(Math.random() * 15) + 60,
      aiDetections: Math.floor(Math.random() * 1000) + 5000,
      alertCount: Math.floor(Math.random() * 10) + 5
    });
    setClassroomData(generateClassroomData());
  };

  useEffect(() => {
    updateData();
    const unsubscribe = globalDataUpdater.subscribe(updateData);
    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '正常': return 'success';
      case '需关注': return 'warning';
      case '异常': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: '班级名称',
      dataIndex: 'className',
      key: 'className',
      width: 200,
    },
    {
      title: '任课教师',
      dataIndex: 'teacher',
      key: 'teacher',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: '学生人数',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: 100,
    },
    {
      title: '参与度(%)',
      dataIndex: 'engagement',
      key: 'engagement',
      width: 120,
      render: (value: number) => (
        <Progress 
          percent={value} 
          size="small" 
          status={value > 80 ? 'success' : value > 60 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '专注度(%)',
      dataIndex: 'focus',
      key: 'focus',
      width: 120,
      render: (value: number) => (
        <Progress 
          percent={value} 
          size="small" 
          status={value > 80 ? 'success' : value > 60 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '预警次数',
      dataIndex: 'alerts',
      key: 'alerts',
      width: 100,
      render: (value: number) => (
        <span style={{ 
          color: value > 3 ? '#ff4d4f' : value > 1 ? '#faad14' : '#52c41a' 
        }}>
          {value}
        </span>
      ),
    },
  ];

  const statsData = [
    { title: '总班级数', value: tourData.totalClasses, color: '#1890ff' },
    { title: '活跃班级', value: tourData.activeClasses, color: '#52c41a' },
    { title: 'AI检测次数', value: tourData.aiDetections.toLocaleString(), color: '#faad14' },
    { title: '预警数量', value: tourData.alertCount, color: '#ff4d4f' }
  ];

  const realTimeOptions = {
    title: {
      text: '实时课堂监控',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['参与度', '专注度', '活跃度'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 12 }, (_, i) => `${i * 5}分钟`)
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: '参与度',
        type: 'line',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 30) + 60),
        smooth: true,
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '专注度',
        type: 'line',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 25) + 65),
        smooth: true,
        itemStyle: { color: '#52c41a' }
      },
      {
        name: '活跃度',
        type: 'line',
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 35) + 55),
        smooth: true,
        itemStyle: { color: '#faad14' }
      }
    ]
  };

  const behaviorOptions = {
    title: {
      text: '课堂行为分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: Math.floor(Math.random() * 20) + 30, name: '认真听讲' },
        { value: Math.floor(Math.random() * 15) + 20, name: '举手发言' },
        { value: Math.floor(Math.random() * 10) + 15, name: '做笔记' },
        { value: Math.floor(Math.random() * 8) + 10, name: '讨论交流' },
        { value: Math.floor(Math.random() * 5) + 5, name: '其他行为' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  return (
    <Container>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {statsData.map((stat, index) => (
          <Col span={6} key={index}>
            <StatCard color={stat.color}>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ 
                  color: stat.color,
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}
              />
            </StatCard>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <ChartCard>
            <div className="chart-title">实时课堂监控</div>
            <ReactECharts option={realTimeOptions} style={{ height: '300px' }} />
          </ChartCard>
        </Col>
        
        <Col span={12}>
          <ChartCard>
            <div className="chart-title">课堂行为分布</div>
            <ReactECharts option={behaviorOptions} style={{ height: '300px' }} />
          </ChartCard>
        </Col>
      </Row>

      <ChartCard>
        <div className="chart-title">课堂巡课实时数据</div>
        <Table
          columns={columns}
          dataSource={classroomData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          size="middle"
        />
      </ChartCard>
    </Container>
  );
};

export default AiTeachingTour;

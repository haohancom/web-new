import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
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

const SystemHome: React.FC = () => {
  const [systemStats, setSystemStats] = useState({
    totalClasses: 0,
    activeTeachers: 0,
    onlineStudents: 0,
    systemHealth: 0,
    aiAccuracy: 0,
    dataProcessed: 0
  });

  const updateStats = () => {
    setSystemStats({
      totalClasses: Math.floor(Math.random() * 50) + 100,
      activeTeachers: Math.floor(Math.random() * 20) + 80,
      onlineStudents: Math.floor(Math.random() * 100) + 2500,
      systemHealth: Math.floor(Math.random() * 10) + 90,
      aiAccuracy: Math.floor(Math.random() * 5) + 95,
      dataProcessed: Math.floor(Math.random() * 10000) + 50000
    });
  };

  useEffect(() => {
    updateStats();
    const unsubscribe = globalDataUpdater.subscribe(updateStats);
    return () => unsubscribe();
  }, []);

  const statsData = [
    { title: '总班级数', value: systemStats.totalClasses, color: '#1890ff' },
    { title: '活跃教师', value: systemStats.activeTeachers, color: '#52c41a' },
    { title: '在线学生', value: systemStats.onlineStudents, color: '#faad14' },
    { title: '系统健康度', value: `${systemStats.systemHealth}%`, color: '#722ed1' },
    { title: 'AI准确率', value: `${systemStats.aiAccuracy}%`, color: '#eb2f96' },
    { title: '数据处理量', value: systemStats.dataProcessed.toLocaleString(), color: '#13c2c2' }
  ];

  const performanceOptions = {
    title: {
      text: '系统性能监控',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['CPU使用率', '内存使用率', '网络带宽'],
      top: 30
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`)
    },
    yAxis: {
      type: 'value',
      max: 100
    },
    series: [
      {
        name: 'CPU使用率',
        type: 'line',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 30) + 40),
        smooth: true
      },
      {
        name: '内存使用率',
        type: 'line',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 20) + 60),
        smooth: true
      },
      {
        name: '网络带宽',
        type: 'line',
        data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 30),
        smooth: true
      }
    ]
  };

  const activityOptions = {
    title: {
      text: '课堂活跃度分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: Math.floor(Math.random() * 20) + 30, name: '高活跃' },
        { value: Math.floor(Math.random() * 30) + 40, name: '中等活跃' },
        { value: Math.floor(Math.random() * 20) + 20, name: '低活跃' },
        { value: Math.floor(Math.random() * 10) + 5, name: '不活跃' }
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
          <Col span={4} key={index}>
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

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ChartCard>
            <div className="chart-title">系统性能监控</div>
            <ReactECharts option={performanceOptions} style={{ height: '300px' }} />
          </ChartCard>
        </Col>
        
        <Col span={12}>
          <ChartCard>
            <div className="chart-title">课堂活跃度分布</div>
            <ReactECharts option={activityOptions} style={{ height: '300px' }} />
          </ChartCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ChartCard>
            <div className="chart-title">实时数据流</div>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Statistic
                  title="今日处理数据量"
                  value={Math.floor(Math.random() * 10000) + 50000}
                  suffix="条"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="AI识别准确率"
                  value={Math.floor(Math.random() * 5) + 95}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="系统响应时间"
                  value={Math.floor(Math.random() * 100) + 50}
                  suffix="ms"
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="在线设备数"
                  value={Math.floor(Math.random() * 50) + 200}
                  suffix="台"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </ChartCard>
        </Col>
      </Row>
    </Container>
  );
};

export default SystemHome;

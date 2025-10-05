import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Table, Tag } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { globalDataUpdater } from '../services/mockData';

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

const DataCard = styled(Card)`
  margin-bottom: 20px;
  
  .ant-card-body {
    background: #f7f8fa;
    padding: 20px;
    border-radius: 10px;
  }
  
  .card-title {
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

const StudentCard = styled(Card)<{ color: string }>`
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

const StudentData: React.FC = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 生成学生数据
  const generateStudentData = () => {
    const students = [
      '张三', '李四', '王五', '赵六', '孙七',
      '周八', '吴九', '郑十', '王十一', '李十二',
      '张十三', '刘十四', '陈十五', '杨十六', '黄十七',
      '林十八', '何十九', '罗二十', '高二十一', '梁二十二'
    ];

    const classes = [
      '2022级潜艇观通（电子信息工程）指挥班',
      '2022级舰艇指挥班',
      '2023级通信工程班',
      '2023级计算机科学与技术班',
      '2022级电子信息工程班'
    ];

    return students.map((studentName, index) => ({
      key: index,
      studentName,
      studentId: `S${String(index + 1).padStart(4, '0')}`,
      className: classes[Math.floor(Math.random() * classes.length)],
      grade: Math.floor(Math.random() * 40) + 60,
      attendance: Math.floor(Math.random() * 10) + 90,
      engagement: (Math.random() * 30 + 60).toFixed(1),
      focus: (Math.random() * 25 + 65).toFixed(1),
      excitement: (Math.random() * 15 + 5).toFixed(1),
      behaviorScore: Math.floor(Math.random() * 20) + 80,
      status: ['正常', '优秀', '良好', '需关注'][Math.floor(Math.random() * 4)],
    }));
  };

  // 数据更新函数
  const updateData = () => {
    setLoading(true);
    setTimeout(() => {
      setStudentData(generateStudentData());
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    updateData();
    
    // 订阅数据更新
    const unsubscribe = globalDataUpdater.subscribe(updateData);
    
    return () => {
      unsubscribe();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '优秀': return 'success';
      case '良好': return 'processing';
      case '正常': return 'default';
      case '需关注': return 'warning';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      key: 'studentName',
      width: 120,
      fixed: 'left' as const,
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {text}
        </div>
      ),
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
    },
    {
      title: '班级',
      dataIndex: 'className',
      key: 'className',
      width: 250,
      ellipsis: true,
    },
    {
      title: '成绩',
      dataIndex: 'grade',
      key: 'grade',
      width: 80,
      sorter: (a: any, b: any) => a.grade - b.grade,
      render: (value: number) => (
        <span style={{ 
          color: value > 90 ? '#52c41a' : value > 80 ? '#faad14' : value > 70 ? '#1890ff' : '#ff4d4f' 
        }}>
          {value}
        </span>
      ),
    },
    {
      title: '出勤率(%)',
      dataIndex: 'attendance',
      key: 'attendance',
      width: 100,
      sorter: (a: any, b: any) => a.attendance - b.attendance,
      render: (value: number) => (
        <span style={{ 
          color: value > 95 ? '#52c41a' : value > 90 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}%
        </span>
      ),
    },
    {
      title: '参与度(%)',
      dataIndex: 'engagement',
      key: 'engagement',
      width: 100,
      sorter: (a: any, b: any) => parseFloat(a.engagement) - parseFloat(b.engagement),
      render: (value: string) => (
        <span style={{ 
          color: parseFloat(value) > 80 ? '#52c41a' : parseFloat(value) > 70 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}%
        </span>
      ),
    },
    {
      title: '专注度(%)',
      dataIndex: 'focus',
      key: 'focus',
      width: 100,
      sorter: (a: any, b: any) => parseFloat(a.focus) - parseFloat(b.focus),
      render: (value: string) => (
        <span style={{ 
          color: parseFloat(value) > 80 ? '#52c41a' : parseFloat(value) > 70 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}%
        </span>
      ),
    },
    {
      title: '兴奋度(%)',
      dataIndex: 'excitement',
      key: 'excitement',
      width: 100,
      sorter: (a: any, b: any) => parseFloat(a.excitement) - parseFloat(b.excitement),
      render: (value: string) => (
        <span style={{ 
          color: parseFloat(value) > 15 ? '#52c41a' : parseFloat(value) > 10 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}%
        </span>
      ),
    },
    {
      title: '行为评分',
      dataIndex: 'behaviorScore',
      key: 'behaviorScore',
      width: 100,
      sorter: (a: any, b: any) => a.behaviorScore - b.behaviorScore,
      render: (value: number) => (
        <span style={{ 
          color: value > 90 ? '#52c41a' : value > 80 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}
        </span>
      ),
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
  ];

  // 统计卡片数据
  const statsData = [
    { title: '总学生数', value: studentData.length, color: '#1890ff' },
    { title: '平均成绩', value: studentData.length > 0 ? (studentData.reduce((sum, s) => sum + s.grade, 0) / studentData.length).toFixed(1) : '0', color: '#52c41a' },
    { title: '平均出勤率', value: studentData.length > 0 ? (studentData.reduce((sum, s) => sum + s.attendance, 0) / studentData.length).toFixed(1) + '%' : '0%', color: '#faad14' },
    { title: '平均参与度', value: studentData.length > 0 ? (studentData.reduce((sum, s) => sum + parseFloat(s.engagement), 0) / studentData.length).toFixed(1) + '%' : '0%', color: '#722ed1' },
  ];

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
        <Title>学员数据</Title>
      </Header>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {statsData.map((stat, index) => (
          <Col span={6} key={index}>
            <StudentCard color={stat.color}>
              <div style={{ 
                color: stat.color, 
                fontSize: '24px', 
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: '16px', 
                color: '#666'
              }}>
                {stat.title}
              </div>
            </StudentCard>
          </Col>
        ))}
      </Row>

      <DataCard>
        <div className="card-title">学员数据统计</div>
        <Table
          columns={columns}
          dataSource={studentData}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          size="middle"
        />
      </DataCard>
    </PageContainer>
  );
};

export default StudentData;

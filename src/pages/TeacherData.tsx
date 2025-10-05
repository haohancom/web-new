import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Table, Progress } from 'antd';
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

const TeacherCard = styled(Card)<{ color: string }>`
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

const TeacherData: React.FC = () => {
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 生成教师数据
  const generateTeacherData = () => {
    const teachers = [
      '张教授', '李老师', '王主任', '刘博士', '陈老师',
      '杨教授', '赵老师', '孙主任', '周博士', '吴老师',
      '郑教授', '钱老师', '冯主任', '褚博士', '卫老师'
    ];

    return teachers.map((teacherName, index) => ({
      key: index,
      teacherName,
      teacherId: `T${String(index + 1).padStart(3, '0')}`,
      department: ['计算机学院', '通信学院', '自动化学院', '电子工程学院'][Math.floor(Math.random() * 4)],
      courseCount: Math.floor(Math.random() * 8) + 3,
      studentCount: Math.floor(Math.random() * 200) + 50,
      teachingQuality: Math.floor(Math.random() * 20) + 80,
      studentRating: (Math.random() * 1 + 4).toFixed(1),
      attendance: Math.floor(Math.random() * 10) + 90,
      engagement: (Math.random() * 15 + 75).toFixed(1),
      focus: (Math.random() * 10 + 80).toFixed(1),
    }));
  };

  // 数据更新函数
  const updateData = () => {
    setLoading(true);
    setTimeout(() => {
      setTeacherData(generateTeacherData());
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

  const columns = [
    {
      title: '教师姓名',
      dataIndex: 'teacherName',
      key: 'teacherName',
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
      title: '工号',
      dataIndex: 'teacherId',
      key: 'teacherId',
      width: 100,
    },
    {
      title: '所属学院',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: '授课数量',
      dataIndex: 'courseCount',
      key: 'courseCount',
      width: 100,
      sorter: (a: any, b: any) => a.courseCount - b.courseCount,
    },
    {
      title: '学生数量',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: 100,
      sorter: (a: any, b: any) => a.studentCount - b.studentCount,
    },
    {
      title: '教学质量',
      dataIndex: 'teachingQuality',
      key: 'teachingQuality',
      width: 120,
      sorter: (a: any, b: any) => a.teachingQuality - b.teachingQuality,
      render: (value: number) => (
        <Progress 
          percent={value} 
          size="small" 
          status={value > 90 ? 'success' : value > 80 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '学生评分',
      dataIndex: 'studentRating',
      key: 'studentRating',
      width: 100,
      sorter: (a: any, b: any) => parseFloat(a.studentRating) - parseFloat(b.studentRating),
      render: (value: string) => (
        <span style={{ 
          color: parseFloat(value) > 4.5 ? '#52c41a' : parseFloat(value) > 4.0 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}/5.0
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
      title: '学生参与度(%)',
      dataIndex: 'engagement',
      key: 'engagement',
      width: 130,
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
      title: '学生专注度(%)',
      dataIndex: 'focus',
      key: 'focus',
      width: 130,
      sorter: (a: any, b: any) => parseFloat(a.focus) - parseFloat(b.focus),
      render: (value: string) => (
        <span style={{ 
          color: parseFloat(value) > 85 ? '#52c41a' : parseFloat(value) > 75 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}%
        </span>
      ),
    },
  ];

  // 统计卡片数据
  const statsData = [
    { title: '总教师数', value: teacherData.length, color: '#1890ff' },
    { title: '平均教学质量', value: teacherData.length > 0 ? (teacherData.reduce((sum, t) => sum + t.teachingQuality, 0) / teacherData.length).toFixed(1) + '%' : '0%', color: '#52c41a' },
    { title: '平均学生评分', value: teacherData.length > 0 ? (teacherData.reduce((sum, t) => sum + parseFloat(t.studentRating), 0) / teacherData.length).toFixed(1) : '0.0', color: '#faad14' },
    { title: '平均出勤率', value: teacherData.length > 0 ? (teacherData.reduce((sum, t) => sum + t.attendance, 0) / teacherData.length).toFixed(1) + '%' : '0%', color: '#722ed1' },
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
        <Title>教员数据</Title>
      </Header>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        {statsData.map((stat, index) => (
          <Col span={6} key={index}>
            <TeacherCard color={stat.color}>
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
            </TeacherCard>
          </Col>
        ))}
      </Row>

      <DataCard>
        <div className="card-title">教员数据统计</div>
        <Table
          columns={columns}
          dataSource={teacherData}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
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

export default TeacherData;

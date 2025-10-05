import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Table } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
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

const ClassData: React.FC = () => {
  const navigate = useNavigate();
  const [classData, setClassData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 生成班级数据
  const generateClassData = () => {
    const classes = [
      '2022级潜艇观通（电子信息工程）指挥班',
      '2022级舰艇指挥班',
      '2023级通信工程班',
      '2023级计算机科学与技术班',
      '2022级电子信息工程班',
      '2023级软件工程班',
      '2022级网络工程班',
      '2023级数据科学与大数据技术班',
      '2022级人工智能班',
      '2023级物联网工程班',
      '2023级信息安全班',
      '2022级自动化班'
    ];

    return classes.map((className, index) => ({
      key: index,
      className,
      totalStudents: Math.floor(Math.random() * 50) + 30,
      attendance: Math.floor(Math.random() * 10) + 40,
      engagement: (Math.random() * 20 + 70).toFixed(1),
      focus: (Math.random() * 15 + 75).toFixed(1),
      excitement: (Math.random() * 10 + 5).toFixed(1),
      courseCount: Math.floor(Math.random() * 10) + 15,
      teacherCount: Math.floor(Math.random() * 5) + 3
    }));
  };

  // 数据更新函数
  const updateData = () => {
    setLoading(true);
    setTimeout(() => {
      setClassData(generateClassData());
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
      title: '班级名称',
      dataIndex: 'className',
      key: 'className',
      width: 300,
      fixed: 'left' as const,
    },
    {
      title: '总人数',
      dataIndex: 'totalStudents',
      key: 'totalStudents',
      width: 100,
      sorter: (a: any, b: any) => a.totalStudents - b.totalStudents,
    },
    {
      title: '出勤人数',
      dataIndex: 'attendance',
      key: 'attendance',
      width: 100,
      sorter: (a: any, b: any) => a.attendance - b.attendance,
    },
    {
      title: '参与度(%)',
      dataIndex: 'engagement',
      key: 'engagement',
      width: 120,
      sorter: (a: any, b: any) => parseFloat(a.engagement) - parseFloat(b.engagement),
      render: (value: string) => (
        <span style={{ 
          color: parseFloat(value) > 80 ? '#52c41a' : parseFloat(value) > 60 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}%
        </span>
      ),
    },
    {
      title: '专注度(%)',
      dataIndex: 'focus',
      key: 'focus',
      width: 120,
      sorter: (a: any, b: any) => parseFloat(a.focus) - parseFloat(b.focus),
      render: (value: string) => (
        <span style={{ 
          color: parseFloat(value) > 80 ? '#52c41a' : parseFloat(value) > 60 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}%
        </span>
      ),
    },
    {
      title: '兴奋度(%)',
      dataIndex: 'excitement',
      key: 'excitement',
      width: 120,
      sorter: (a: any, b: any) => parseFloat(a.excitement) - parseFloat(b.excitement),
      render: (value: string) => (
        <span style={{ 
          color: parseFloat(value) > 10 ? '#52c41a' : parseFloat(value) > 5 ? '#faad14' : '#ff4d4f' 
        }}>
          {value}%
        </span>
      ),
    },
    {
      title: '课程数量',
      dataIndex: 'courseCount',
      key: 'courseCount',
      width: 100,
      sorter: (a: any, b: any) => a.courseCount - b.courseCount,
    },
    {
      title: '任课教师数',
      dataIndex: 'teacherCount',
      key: 'teacherCount',
      width: 120,
      sorter: (a: any, b: any) => a.teacherCount - b.teacherCount,
    },
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
        <Title>班级数据</Title>
      </Header>

      <DataCard>
        <div className="card-title">班级数据统计</div>
        <Table
          columns={columns}
          dataSource={classData}
          loading={loading}
          scroll={{ x: 1000 }}
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

export default ClassData;

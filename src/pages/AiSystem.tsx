import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Button, Card, Row, Col, Menu } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, EyeOutlined, HistoryOutlined, UserOutlined, BarChartOutlined, TrophyOutlined, UserSwitchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import SystemHome from '../components/AiSystem/SystemHome';
import AiTeachingTour from '../components/AiSystem/AiTeachingTour';
import AiHisAnalysis from '../components/AiSystem/AiHisAnalysis';
import Attendance from '../components/AiSystem/Attendance';
import BehaviorAnalysis from '../components/AiSystem/BehaviorAnalysis';
import TeachQuality from '../components/AiSystem/TeachQuality';
import PortraitDiagnosis from '../components/AiSystem/PortraitDiagnosis';
import ClassroomWarning from '../components/AiSystem/ClassroomWarning';

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

const ContentContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .ant-menu {
    border-radius: 8px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 600px;
`;

const AiSystem: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('systemHome');

  const menuItems = [
    {
      key: 'systemHome',
      icon: <HomeOutlined />,
      label: '首页',
      component: SystemHome
    },
    {
      key: 'aiTeachingTour',
      icon: <EyeOutlined />,
      label: 'AI教学巡课',
      component: AiTeachingTour
    },
    {
      key: 'aiHisAnalysis',
      icon: <HistoryOutlined />,
      label: 'AI历史分析',
      component: AiHisAnalysis
    },
    {
      key: 'attendance',
      icon: <UserOutlined />,
      label: '课堂考勤',
      component: Attendance
    },
    {
      key: 'behaviorAnalysis',
      icon: <BarChartOutlined />,
      label: '课堂行为分析',
      component: BehaviorAnalysis
    },
    {
      key: 'teachQuality',
      icon: <TrophyOutlined />,
      label: '教学质量分析',
      component: TeachQuality
    },
    {
      key: 'portraitDiagnosis',
      icon: <UserSwitchOutlined />,
      label: '教师画像及诊改',
      component: PortraitDiagnosis
    },
    {
      key: 'classroomWarning',
      icon: <ExclamationCircleOutlined />,
      label: '课堂预警',
      component: ClassroomWarning
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
  };

  const renderContent = () => {
    const currentItem = menuItems.find(item => item.key === selectedKey);
    if (currentItem) {
      const Component = currentItem.component;
      return <Component />;
    }
    return <SystemHome />;
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
        <Title>智能中心</Title>
      </Header>

      <ContentContainer>
        <Sidebar>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: item.label
            }))}
          />
        </Sidebar>
        
        <MainContent>
          {renderContent()}
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default AiSystem;

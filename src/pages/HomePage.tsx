import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import { CalendarOutlined, TeamOutlined, UserOutlined, ContactsOutlined, RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 60px 20px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
`;

const NavContainer = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const NavButton = styled(Button)`
  height: 120px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  .anticon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const navButtons = [
    {
      key: 'dayData',
      icon: <CalendarOutlined />,
      text: '今日数据',
      route: '/dayData'
    },
    {
      key: 'classData',
      icon: <TeamOutlined />,
      text: '班级数据',
      route: '/classData'
    },
    {
      key: 'teacherData',
      icon: <UserOutlined />,
      text: '教员数据',
      route: '/teacherData'
    },
    {
      key: 'studentData',
      icon: <ContactsOutlined />,
      text: '学员数据',
      route: '/studentData'
    },
    {
      key: 'aiSystem',
      icon: <RobotOutlined />,
      text: '智能中心',
      route: '/aiSystem'
    }
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#1890ff' }}>
        数据中心管理系统
      </h1>
      <HomeContainer>
        <NavContainer>
          <Row gutter={[16, 16]} justify="center">
            {navButtons.map(button => (
              <Col span={4} key={button.key}>
                <NavButton
                  type="primary"
                  size="large"
                  block
                  onClick={() => handleNavigate(button.route)}
                  className="move-up"
                >
                  {button.icon}
                  {button.text}
                </NavButton>
              </Col>
            ))}
          </Row>
        </NavContainer>
      </HomeContainer>
    </div>
  );
};

export default HomePage;

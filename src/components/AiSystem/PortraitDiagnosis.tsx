import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
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

const PortraitDiagnosis: React.FC = () => {
  return (
    <Container>
      <ChartCard>
        <div className="chart-title">教师画像及诊改</div>
        <p>教师画像及诊改功能正在开发中...</p>
      </ChartCard>
    </Container>
  );
};

export default PortraitDiagnosis;

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
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

const AiHisAnalysis: React.FC = () => {
  const historyOptions = {
    title: {
      text: '历史数据分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 132, 101, 134, 90, 230, 210],
      type: 'line',
      smooth: true
    }]
  };

  return (
    <Container>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ChartCard>
            <div className="chart-title">AI历史分析</div>
            <ReactECharts option={historyOptions} style={{ height: '400px' }} />
          </ChartCard>
        </Col>
      </Row>
    </Container>
  );
};

export default AiHisAnalysis;

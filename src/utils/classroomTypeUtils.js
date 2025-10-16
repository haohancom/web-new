/**
 * 课堂类型计算工具函数
 */

/**
 * 根据RT和CH值判断课堂类型
 * @param {number} rt - RT值 (0-1)
 * @param {number} ch - CH值 (0-1)
 * @returns {string} 课堂类型
 */
export function getClassroomType(rt, ch) {
  // 检查是否在三角形外面
  if (rt < 0 || rt > 1 || ch < 0 || ch > 1) {
    return '其他'
  }
  
  // 检查是否在三角形内部
  // 三角形边界：y = 2x (x <= 0.5) 和 y = -2x + 2 (x >= 0.5)
  const leftBoundary = 2 * rt 
  const rightBoundary = -2 * rt + 2 

  console.log("left: ", leftBoundary, "right: ", rightBoundary, "ch: ", ch)
  
  if (ch > leftBoundary || ch > rightBoundary) {
    return '其他'
  }
  
  // 在三角形内部，根据区域判断类型
  if (ch > 0.5) {
    // 上半部分：对话型
    return '对话型'
  } else {
    // 下半部分，根据x坐标判断
    if (rt <= 0.3) {
      return '练习型'
    } else if (rt <= 0.7) {
      return '混合型'
    } else {
      return '讲授型'
    }
  }
}

/**
 * 计算课堂类型分布
 * @param {Array} dataPoints - 数据点数组，每个元素包含 {rt, ch} 属性
 * @returns {Array} 饼状图数据数组
 */
export function calculateClassroomTypeDistribution(dataPoints) {
  const typeCount = {
    '对话型': 0,
    '练习型': 0,
    '混合型': 0,
    '讲授型': 0,
    '其他': 0
  }
  
  // 统计每个类型的数量
  dataPoints.forEach(point => {
    const type = getClassroomType(point.rt, point.ch)
    typeCount[type]++
  })
  
  // 计算百分比并生成饼状图数据
  const total = dataPoints.length
  const pieData = []
  
  Object.keys(typeCount).forEach(type => {
    if (typeCount[type] > 0) {
      const percentage = ((typeCount[type] / total) * 100).toFixed(1)
      pieData.push({
        name: type,
        value: typeCount[type],
        percentage: percentage
      })
    }
  })
  
  return pieData
}

/**
 * 创建课堂类型占比饼状图配置
 * @returns {Object} ECharts配置对象
 */
export function createClassroomTypePieOptions() {
  return {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "课堂类型占比",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [],
      },
    ],
  }
}

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  InputNumber,
  Slider,
  Typography,
  Divider,
  Space,
  Progress,
  Table,
  Button,
  Statistic,
  Tag,
  Alert,
  Select
} from 'antd';

const { Title, Text } = Typography;

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [periods, setPeriods] = useState('12'); // Default to monthly
  const [emiData, setEmiData] = useState({});
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);

  // Calculate EMI and other loan details
  const calculateEMI = () => {
    console.log("Calculating EMI with values:", {
      loanAmount,
        interestRate,
        loanTenure,
        periods
    });
    const principal = loanAmount;
    const monthlyRate = interestRate / (12 * 100);
    const totalMonths = loanTenure * 12;
    const total_Interest = ((loanAmount * interestRate) / 100 * loanTenure) / Number(periods);
    let emi = (loanAmount + total_Interest) / loanTenure;
    console.log("EMI Calculation:", {total_Interest, emi});
    console.log(totalMonths); 

    return {
        emi: emi.toFixed(2),
        totalAmount: (emi * totalMonths).toFixed(2),
        totalInterest: total_Interest.toFixed(2),
        monthlyRate: monthlyRate,
        totalMonths: totalMonths
    }
    // if (monthlyRate === 0) {
    //   const emi = principal / totalMonths;
    //   return {
    //     emi: emi,
    //     totalAmount: principal,
    //     totalInterest: total_Interest,
    //     monthlyRate: 0,
    //     totalMonths: totalMonths
    //   };
    // }

    // const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
    //             (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    // const totalAmount = emi * totalMonths;
    // const totalInterest = totalAmount - principal;

    // return {
    //   emi: emi,
    //   totalAmount: totalAmount,
    //   totalInterest: totalInterest,
    //   monthlyRate: monthlyRate,
    //   totalMonths: totalMonths
    // };
  };

  // Generate amortization schedule
  const generateAmortizationSchedule = (emiDetails) => {
    const { emi, monthlyRate, totalMonths } = emiDetails;
    let remainingPrincipal = loanAmount;
    const schedule = [];
    console.log(Math.min(totalMonths, 60));
    for (let month = 1; month <= Math.min(totalMonths, 60); month++) { // Show max 60 months for performance
      const interestPayment = remainingPrincipal * monthlyRate;
      const principalPayment = emi - interestPayment;
      remainingPrincipal = remainingPrincipal - principalPayment;

      schedule.push({
        key: month,
        month: month,
        emi: emi,
        principalPayment: principalPayment,
        interestPayment: interestPayment,
        remainingPrincipal: Math.max(0, remainingPrincipal)
      });

      if (remainingPrincipal <= 0) break;
    }

    return schedule;
  };

  useEffect(() => {
    const calculatedEMI = calculateEMI();
    setEmiData(calculatedEMI);
    setAmortizationSchedule(generateAmortizationSchedule(calculatedEMI));
  }, [loanAmount, interestRate, loanTenure]);

  useEffect(()=>{
      console.log(amortizationSchedule,' amortizationSchedule')
  },[amortizationSchedule])

  // Data for pie chart
  const pieChartData = [
    { name: 'Principal', value: loanAmount, color: '#52c41a' },
    { name: 'Interest', value: emiData.totalInterest || 0, color: '#ff4d4f' }
  ];

  // Data for bar chart (yearly breakdown)
  const getYearlyBreakdown = () => {
    const yearlyData = [];
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;

    for (let year = 1; year <= loanTenure; year++) {
      const yearlyPrincipal = amortizationSchedule
        .filter(item => item.month > (year - 1) * 12 && item.month <= year * 12)
        .reduce((sum, item) => sum + item.principalPayment, 0);
      
      const yearlyInterest = amortizationSchedule
        .filter(item => item.month > (year - 1) * 12 && item.month <= year * 12)
        .reduce((sum, item) => sum + item.interestPayment, 0);

      cumulativePrincipal += yearlyPrincipal;
      cumulativeInterest += yearlyInterest;

      yearlyData.push({
        year: `Year ${year}`,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        cumulative: cumulativePrincipal + cumulativeInterest
      });
    }

    return yearlyData;
  };

  // Table columns for amortization schedule
  const columns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      width: 80,
    },
    {
      title: 'EMI',
      dataIndex: 'emi',
      key: 'emi',
      render: (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    },
    {
      title: 'Principal',
      dataIndex: 'principalPayment',
      key: 'principal',
      render: (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    },
    {
      title: 'Interest',
      dataIndex: 'interestPayment',
      key: 'interest',
      render: (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    },
    {
      title: 'Remaining Balance',
      dataIndex: 'remainingPrincipal',
      key: 'remaining',
      render: (value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
    },
  ];

  const interestPercentage = ((emiData.totalInterest || 0) / (emiData.totalAmount || 1)) * 100;
  const principalPercentage = 100 - interestPercentage;

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px', color: '#1890ff' }}>
          🏠 Loan EMI Calculator
        </Title>

        <Row gutter={[24, 24]}>
          {/* Input Section */}
          <Col xs={24} lg={8}>
            <Card title="Loan EMI Details" style={{ height: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                  <Text strong>Principal Amount</Text>
                  <InputNumber
                    style={{ width: '100%', marginTop: 8 }}
                    value={loanAmount}
                    onChange={setLoanAmount}
                    formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value?.replace(/₹\s?|(,*)/g, '')}
                    min={5000}
                    max={500000000}
                    step={50000}
                  />
                  <Slider
                    style={{ marginTop: 16 }}
                    min={100000}
                    max={50000000}
                    value={loanAmount}
                    onChange={setLoanAmount}
                    step={50000}
                    tooltip={{ formatter: value => `₹${value?.toLocaleString('en-IN')}` }}
                  />
                </div>
                

                <div>
                  <Text strong>Interest Rate (%)</Text>
                  <InputNumber
                    style={{ width: '100%', marginTop: 8 }}
                    value={interestRate}
                    onChange={setInterestRate}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    min={5}
                    max={20}
                    step={0.1}
                    precision={1}
                  />
                  <Slider
                    style={{ marginTop: 16 }}
                    min={5}
                    max={20}
                    value={interestRate}
                    onChange={setInterestRate}
                    step={0.1}
                    tooltip={{ formatter: value => `${value}%` }}
                  />
                </div>

                <div>
                    <Text strong>Mode</Text>
                     <Select
                        name="mode"
                        value={periods}
                        onChange={(value) => setPeriods(value)}
                        placeholder="Select a mode"
                    >
                        <Select.Option key={'12'} value={'12'}>Monthly</Select.Option>
                        <Select.Option key={'7'} value={'7'}>Weekly</Select.Option>
                    </Select>
                </div>    

                <div>
                  <Text strong>Periods ({periods == '12' ? 'Monthly' : 'Weekly'})</Text>
                  <InputNumber
                    style={{ width: '100%', marginTop: 8 }}
                    value={loanTenure}
                    onChange={setLoanTenure}
                    min={1}
                    max={60}
                    step={1}
                  />
                  <Slider
                    style={{ marginTop: 16 }}
                    min={1}
                    max={60}
                    value={loanTenure}
                    onChange={setLoanTenure}
                    tooltip={{ formatter: value => `${value} ${periods == '12' ? ' Month' : " Week"}` }}
                  />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Results Section */}
          <Col xs={24} lg={16}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card>
                  <Statistic
                    title="Monthly EMI"
                    value={emiData.emi || 0}
                    precision={0}
                    prefix="₹"
                    valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card>
                  <Statistic
                    title="Total Interest"
                    value={emiData.totalInterest || 0}
                    precision={0}
                    prefix="₹"
                    valueStyle={{ color: '#ff4d4f', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              {/* <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Total Amount"
                    value={emiData.totalAmount || 0}
                    precision={0}
                    prefix="₹"
                    valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                  />
                </Card>
              </Col> */}
            </Row>

            {/* Progress Bars */}
            {/* <Card title="Loan Breakdown" style={{ marginTop: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Principal Amount</Text>
                  <Progress
                    percent={principalPercentage}
                    strokeColor="#52c41a"
                    format={() => `${principalPercentage.toFixed(1)}%`}
                  />
                  <Text type="secondary">₹{loanAmount?.toLocaleString('en-IN')}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Monthly EMI</Text>
                  <Progress
                    percent={interestPercentage}
                    strokeColor="#ff4d4f"
                    format={() => `${interestPercentage?.toFixed(1)}%`}
                  />
                  <Text type="secondary">₹{(emiData ? (emiData.emi || 0) : 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
                </Col>
              </Row>
            </Card> */}
          </Col>
        </Row>
        </div>
    </div>
    )

}

export default EMICalculator;
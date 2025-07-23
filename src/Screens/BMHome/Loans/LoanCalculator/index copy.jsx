// import React from 'react'
import Sidebar from '../../../../Components/Sidebar'
import { Card, Select } from 'antd'
import * as Yup from "yup"
import { useFormik } from 'formik';
import { Form, Input, Button } from 'antd';
const loanCalculatorEMIScheme = Yup.object().shape({
  principal: Yup.number().required("Principal is required"),
  mode: Yup.string().required("Mode is required"),
  period: Yup.number().required("Period is required"),
  roi: Yup.number().required("ROI is required"),
  totalInterest: Yup.number().optional().default(0),
  totalEMI: Yup.number().optional().default(0),
});
const LoanCalculatorIndex = () => {


     const onSubmit = (values) => {
            console.log(values);
            const { principal, mode, period, roi } = values;
            const tot_interest = (((principal * roi) / 100)* period) / Number(mode);
            console.log("Total Interest: ", tot_interest);
            formik.setFieldValue("totalInterest", tot_interest.toFixed(2));
            const total_emi = (Number(principal) + tot_interest) / period;
            formik.setFieldValue("totalEMI", total_emi.toFixed(2));
    }

    const formik = useFormik({
        initialValues: {
            principal: 0,
            mode: '12',
            period: 0,
            roi: 0,
            totalInterest: 0,
            totalEMI: 0,
        },
        onSubmit,
        validationSchema:loanCalculatorEMIScheme,
        validateOnChange: true,
        validateOnBlur: true,
        enableReinitialize: true,
        validateOnMount: true,
    })

   

  return (
    <div>
      <Sidebar mode={2} />
        <section className="dark:bg-[#001529] flex justify-center align-middle p-5">
            <div className="p-5 w-4/5 min-h-screen rounded-3xl">
            <Card className="w-full ">
                <h1 className="text-2xl font-bold mb-4">Loan EMI Calculator</h1>
                {/* <p className="text-gray-600 mb-6">Calculate your loan EMI easily.</p> */}
                <div className='grid grid-cols-12 gap-6 place-items-center'>
                        <div className='md:col-span-6 col-span-12 place-self-center'>
                             <Form layout="vertical" onFinish={formik.handleSubmit}>
                                <Form.Item
                                    label="Principle Amount"
                                    validateStatus={formik.touched.principal && formik.errors.principal ? 'error' : ''}
                                    help={formik.touched.principal && formik.errors.principal ? formik.errors.principal : ''}
                                >
                                    <Input
                                    name="principal"
                                    value={formik.values.principal}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter principal amount"
                                    />
                                </Form.Item>
                                <div className='grid grid-cols-12 gap-4'>
                                    <div className='md:col-span-6 col-span-12'>
                                          <Form.Item
                                                label="Mode"
                                                validateStatus={formik.touched.mode && formik.errors.mode ? 'error' : ''}
                                                help={formik.touched.mode && formik.errors.mode ? formik.errors.mode : ''}
                                            >
                                            <Select
                                                name="mode"
                                                value={formik.values.mode}
                                                onChange={(value) => formik.setFieldValue('mode', value)}
                                                onBlur={() => formik.setFieldTouched('mode', true)}
                                                placeholder="Select a mode"
                                            >
                                            <Select.Option key={'12'} value={'12'}>Monthly</Select.Option>
                                            <Select.Option key={'7'} value={'7'}>Weekly</Select.Option>
                                                </Select>
                                        </Form.Item>
                                    </div>  
                                      <div className='md:col-span-6 col-span-12'>
                                    
                                              <Form.Item
                                    label={`Period ${formik.values.mode == '12' ? '(in months)' : '(in weeks)'}`}
                                    validateStatus={formik.touched.period && formik.errors.period ? 'error' : ''}
                                    help={formik.touched.period && formik.errors.period ? formik.errors.period : ''}
                                >
                                    <Input
                                    type='number'
                                   
                                    name="period"
                                    value={formik.values.period}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder={`Enter period in ${formik.values.mode == '12' ? 'months' : 'weeks'}`}
                                    />
                                </Form.Item>
                                    </div>  
                                </div>
                               
                               
                                 <Form.Item
                                    label="ROI(%)"
                                    validateStatus={formik.touched.roi && formik.errors.roi ? 'error' : ''}
                                    help={formik.touched.roi && formik.errors.roi ? formik.errors.roi : ''}
                                >
                                    <Input
                                    type='number'
                                    name="roi"
                                    value={formik.values.roi}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter ROI(%)"
                                    />
                                </Form.Item>
                                 <div className='grid grid-cols-12 gap-4'>

                                    <div className='md:col-span-6 col-span-12'>
                                                     <Form.Item
                                                        label="Total Interest"
                                                        validateStatus={formik.touched.totalInterest && formik.errors.totalInterest ? 'error' : ''}
                                                        help={formik.touched.totalInterest && formik.errors.totalInterest ? formik.errors.totalInterest : ''}
                                                    >
                                                        <Input
                                                        disabled
                                                        name="totalInterest"
                                                        value={formik.values.totalInterest}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        placeholder="Total interest"
                                                        />
                                                    </Form.Item>

                                    </div>
                                     <div className='md:col-span-6 col-span-12'>
                                                       <Form.Item
                                    label="Total EMI"
                                    validateStatus={formik.touched.totalEMI && formik.errors.totalEMI ? 'error' : ''}
                                    help={formik.touched.totalEMI && formik.errors.totalEMI ? formik.errors.totalEMI : ''}
                                >
                                    <Input
                                    disabled
                                    name="totalEMI"
                                    value={formik.values.totalEMI}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Total EMI"
                                    />
                                </Form.Item>

                                     </div>
                                 </div>
                                
                             
                                  <Button block htmlType='submit' type="primary">Calculate EMI</Button>
                            </Form>
                        </div>     
                   
                 
                 </div>   
               
            </Card>
            </div>
            </section>
    </div>
  )
}

export default LoanCalculatorIndex

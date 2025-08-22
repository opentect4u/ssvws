import React, { useEffect, useRef, useState } from 'react'
import { Formik } from 'formik';
import { Input, Button, Form, Spin, DatePicker, Select, Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Sidebar from '../../../Components/Sidebar';
import FormHeader from '../../../Components/FormHeader';
import dayjs from 'dayjs';
import moment from 'moment';
import * as Yup from 'yup';
import { motion } from "framer-motion"
// import { createStyles } from 'antd-style';
import axios from 'axios';
import { url } from '../../../Address/BaseUrl';
import { Message } from '../../../Components/Message';
import { Download } from 'lucide-react';
import { exportToExcel } from '../../../Utils/exportToExcel';
const validationSchema = Yup.object().shape({
  range_date: Yup.array()
    .min(2, 'Please select both start and end dates')
    .required('Date range is required'),
  emp_id: Yup.string().required('Employee is required'),
  branch_id: Yup.string().required('Branch is required'),
});
const { RangePicker } = DatePicker;
const { Item: FormItem } = Form;
const columns = [
  {
    title: 'Employee Id',
    dataIndex: 'emp_id',
    sorter: (a, b) => a.emp_id - b.emp_id, // numeric sorting
  },
  {
    title: 'Branch',
    dataIndex: 'branch_name',
    sorter: (a, b) => a.branch_name.localeCompare(b.branch_name), // alphabetical sorting
  },
  {
    title: 'Operation Date',
    dataIndex: 'operation_dt',
    render: (_, record) => ` ${record?.operation_dt ? moment(record?.operation_dt).format('DD/MM/YYYY hh:mm a') : ''}`,
    sorter: (a, b) =>
      dayjs(a.operation_dt).unix() - dayjs(b.operation_dt).unix(), // sorts by date
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Device',
    dataIndex: 'device_type',
    // render: (_, record) => ` ${record?.device_type == 'Web' ? 'Web' : 'App'}`,
    sorter: (a, b) => a.device_type.localeCompare(b.device_type), // alphabetical sorting
  },
  {
    title: 'Activity',
    dataIndex: 'in_out_flag',
    // render: (_, record) => ` ${record?.in_out_flag == 'Out' ? 'Sign Out' : 'Sign In'}`,
    sorter: (a, b) => a.in_out_flag.localeCompare(b.in_out_flag), // alphabetical sorting

  }

];
const AuditReport = () => {
  // const { styles } = useStyle();
  const [loading,setLoading] = useState(false);
  const [md_employee,setEmployee] = useState([]);
  const [md_audit_trial,setAuditTrial] = useState([]);
  const [md_branch,setBranch] = useState([]);
  const [isEMployeePending,setEMployeePending] = useState(false);
  const [isBranchPedning,setBranchPending] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("user_details")) || "";
  const formikRef = useRef(null);
  useEffect(() =>{
      // fetchEmployee();
      // console.log(userDetails?.brn_code);
      fetchBranch();
      // console.log(moment('2025-08-20T14:04:23.000Z').format('DD/MM/YYYY hh:mm a'))
  },[])

  const fetchEmployeeAccordingToBranch = async (brn_id) =>{
        try{
           formikRef?.current?.setFieldValue('emp_id','');
          setEmployee([]);
          setEMployeePending(true);
          let emp_dt = [];
           axios.post(`${url}/fetch_employee_fr_branch`,{
            branch_id:brn_id
           }).then(res =>{
              setEMployeePending(false);
              if(res?.data?.suc == 1){
                if(res?.data?.msg?.length > 0){
                  emp_dt.push({
                    emp_name:"All Employee",
                    emp_id:"A"
                  })
                  emp_dt = [...emp_dt,...res?.data?.msg];
                  console.log(emp_dt)
                  setEmployee(emp_dt);
                  formikRef?.current?.setFieldValue('emp_id','A');
                }
              }
              else{
                Message('error',res?.data?.msg);
              }
           }).catch(err =>{
              console.log(err.message);
              Message('error',err.message);
              setEMployeePending(false);
           })
        }
        catch(err){
            console.log(err);
            setEMployeePending(false);
            Message('error',err.message);
        }
  }

  const fetchBranch = async () =>{
        try{
            setBranch([]);
            let dt = [];
            axios.get(`${url}/fetch_all_branch_dt`).then(res =>{    
                  if(res?.data?.suc == 1){ 
                     dt.push({
                          branch_name:"All Branch",
                          branch_code:"A"
                     });
                     dt= [...dt,...res?.data?.msg];
                      setBranch(dt);
                      if(Number(userDetails?.brn_code) != 100){
                            fetchEmployeeAccordingToBranch(Number(userDetails?.brn_code))
                      }
                  }
                  else{
                    Message('error',res?.data?.msg);
                  }
            }).catch(err=>{
              Message('error',err.message)
            })
        }
        catch(err){
          Message('error',err.message)
        }
  }

  const generateReport  = async (payLoad) =>{
      try{
          setAuditTrial([]);
          axios.post(`${url}/admin/generate_audit_trial_report`,payLoad).then(res =>{
                if(res?.data?.suc == 1){
                    setAuditTrial(res?.data?.msg)
                }
                else{
                    Message('error',res?.data.msg);
                }
          })
          .catch(err =>{
              console.log(err);
              Message('error',err.message);
          })
      }
      catch(err){
        console.log(err);
      }
  }

  


  return (
    <>
    <Sidebar mode={2} />
			<section className="dark:bg-[#001529] flex justify-center align-middle p-5">
				<div className="px-1 py-5 w-4/5 min-h-screen rounded-3xl">
					<div className="w-auto mx-14 my-4">
						<FormHeader text="Audit Trail" mode={2} />
					</div>
          <Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-blue-800 dark:text-gray-400"
						spinning={loading}
					>
						<div className="card shadow-lg bg-white border-2 p-5 px-10 py-10 mx-16  rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
							<Formik
                innerRef={formikRef}
                initialValues={{ range_date: [],emp_id:'',branch_id:Number(userDetails?.brn_code) != 100 && Number(userDetails?.brn_code)}}
               validationSchema={validationSchema}
                onSubmit={(values) => {
                  const rangeDate =  values.range_date.map((d) => d.format('YYYY-MM-DD'));
                  const creds = {
                      from_date:rangeDate[0],
                      to_date:rangeDate[1],
                      emp_id:values?.emp_id,
                      branch_code:values?.branch_id
                  }
                  // console.log(creds)
                  generateReport(creds)
                }}
              >
                {({ handleSubmit, handleChange, handleBlur,setFieldValue, values, touched, errors }) => (
                  <Form onFinish={handleSubmit} layout="vertical" className='grid grid-cols-12 gap-3'>
                    <FormItem
                      label="From - To"
                      className='col-span-4'
                      validateStatus={touched.range_date && errors.range_date ? 'error' : ''}
                      help={touched.range_date && errors.range_date ? errors.range_date : ''}
                    >
                      {/* <Input
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your username"
                      /> */}
                    <RangePicker
                     onChange={(dates) => {
                      setFieldValue('range_date', dates || []);
                    }}
                    format="YYYY-MM-DD"
                    allowClear
                      //  defaultValue={[dayjs(moment().format('YYYY-MM-DD'), dateFormat), dayjs(moment().format('YYYY-MM-DD'), dateFormat)]}
                       value={values?.range_date}
                  />
                    </FormItem>

                      <FormItem
                      className='col-span-4'
                      label="Branch"
                      validateStatus={touched.branch_id && errors.branch_id ? 'error' : ''}
                      help={touched.branch_id && errors.branch_id ? errors.branch_id : ''}
                    >
                      <Select
                      showSearch
                      onChange={(e) => {
                        setFieldValue('branch_id',e)
                        setFieldValue('emp_id','');
                        if(e){
                          fetchEmployeeAccordingToBranch(e)
                        }
                      }}
                      disabled={Number(userDetails?.brn_code) != 100}
                      value={values?.branch_id}
                      placeholder="Select Branch"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={md_branch.map(el =>{
                        return {
                          label:el.branch_name,
                          value:el.branch_code
                        }  
                      })}
                    />
                    </FormItem>


                    <FormItem
                      className='col-span-4'
                      label="Employee"
                      validateStatus={touched.emp_id && errors.emp_id ? 'error' : ''}
                      help={touched.emp_id && errors.emp_id ? errors.emp_id : ''}
                    >
                      <Select
                      loading={isEMployeePending}
                      showSearch
                      onChange={(e) => {
                        setFieldValue('emp_id',e)
                      }}
                      value={values?.emp_id || ''}
                      placeholder="Select Employee"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={md_employee.map(el =>{
                        return {
                          label:el.emp_name,
                          value:el.emp_id
                        }  
                      })}
                    />
                    </FormItem>

                    

                    <FormItem
                      className='col-span-12 place-content-end place-self-end'
                    
                    >
                      <Button type="primary" htmlType="submit">
                        Search
                      </Button>
                    </FormItem>
                  </Form>
                )}
              </Formik>
						</div>
            <div className='card  border-2 my-2  mx-16   surface-border border-round surface-ground flex-auto font-medium'>
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
            >
              <Table
                caption={<div className='flex items-center justify-between p-3'>
                      <h2 className='fon-Bold text-lg'>
                        Audit Trail Report
                      </h2>
                      <Button
                        type='primary'
                          icon={<Download/>}
                          onClick={() =>{
                            const dt = md_audit_trial.map(el =>{
                                el.operation_dt = el.operation_dt ? moment(el.operation_dt).format('DD/MM/YYYY hh:mm a') : '';
                                // el.in_out_flag = el.in_out_flag == 'Out' ? 'Sign Out' : 'Sign In';
                                return el;
                            });

                            const headerMap = {
                              emp_id:'Employee ID',
                              branch_name:"Branch",
                              operation_dt:"Operation Date",
                              device_type:"Device Type",
                              in_out_flag:'Activity'
                            };
                            exportToExcel(dt,headerMap,'AuditTrailReport.xlsx',[0])
                          }}
                      >
                          Download Excel
                      </Button>
                </div>}
                // className={styles.customTable}
                columns={columns}
                dataSource={md_audit_trial}
                pagination={{ 
                  pageSize: 5,
                  pageSizeOptions: ['10', '20', '30', '50', '100'],
                // showSizeChanger: true, // enables the dropdown to change page size
                // showQuickJumper: true, // enables "Go to page" input
                }}
                // size='small'
                bordered
                size="middle"
              />
            
            </motion.section>   
            </div>
					</Spin>
          </div>
          
      </section>
    </>
   
  )
}
// const useStyle = createStyles(({ css, token }) => {
//   const { antCls } = token;
//   return {
//     customTable: css`
//       ${antCls}-table {
//         ${antCls}-table-container {
//           ${antCls}-table-body,
//           ${antCls}-table-content {
//             scrollbar-width: thin;
//             scrollbar-color: #eaeaea transparent;
//             scrollbar-gutter: stable;
//           }
//         }
//       }
//     `,
//   };
// });
export default AuditReport

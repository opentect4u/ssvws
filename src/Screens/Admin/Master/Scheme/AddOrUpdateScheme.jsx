// import React from 'react'

import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { apiName } from "../../../../Address/Api"
import { FieldArray, Formik, useFormik } from "formik"
import * as Yup from "yup"
import Sidebar from "../../../../Components/Sidebar"
import FormHeader from "../../../../Components/FormHeader"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import TDInputTemplateBr from "../../../../Components/TDInputTemplateBr"
import BtnComp from "../../../../Components/BtnComp"
import { url } from "../../../../Address/BaseUrl"
import axios from "axios"
import VError from "../../../../Components/VError"
import { Message } from "../../../../Components/Message"
import moment from "moment"
const schemeValidationSchema = Yup.object().shape({
    scheme_id: Yup.number().required("Scheme ID is required").default(0),
    scheme_name: Yup.string().required("Scheme name is required"),
    effective_from: Yup.date().required("Effective from date is required"),
    min_amt: Yup.string().required("Minimum amount is required").matches(/^\d+(\.\d{1,5})?$/, 'Must be a valid number with up to 2 decimal places'),
    max_amt: Yup.string().required("Maximum amount is required").matches(/^\d+(\.\d{1,5})?$/, 'Must be a valid number with up to 2 decimal places'),
    min_period: Yup.string().required("Minimum period is required"),
    max_period: Yup.string().required("Maximum period is required"),
    min_period_week: Yup.string().required("Minimum period weeks is required"),
    max_period_week: Yup.string().required("Maximum period weeks is required"),
    payment_mode: Yup.string().required("Payment mode is required"),
    roi: Yup.string().required("Rate of interest is required").matches(/^\d+(\.\d{1,5})?$/, 'Must be a valid number with up to 2 decimal places'),
    active_flag: Yup.string().required("Active flag is required"),
    created_by: Yup.number().required("Created by is required"),
    modified_by: Yup.number().required("Modified by is required").default(0),
  });

const AddOrUpdateScheme = () => {
    const params = useParams()
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const { active_flag } = location.state || {}
    const navigate = useNavigate()
    const userDetails = JSON.parse(localStorage.getItem("user_details"))



    useEffect(() => {
        // console.log("Params:", params);
        // console.log("Active Flag:", active_flag);
        fetchSchemeDataDependOnStatus(params);
    }, [params]);

    const fetchSchemeDataDependOnStatus = async (params) => {
          if(params?.scheme_id != 0 && isNaN(params?.scheme_id) === false){
                const response = await axios.get(`${url}${apiName.getSchemeByStatus}`, {
                    params: {
                    scheme_id:params?.scheme_id || 0,
                    status: active_flag
                  }
                });
                if(response.request.status === 200) {
                    if(response?.data?.suc === 1){
                        formik.setValues({
                            scheme_id: response.data.msg[0].scheme_id,
                            scheme_name: response.data.msg[0].scheme_name,
                            effective_from: response.data.msg[0].effective_from ? moment(response.data.msg[0].effective_from).format('YYYY-MM-DD') : "",
                            min_amt: response.data.msg[0].min_amt,
                            max_amt: response.data.msg[0].max_amt,
                            min_period: response.data.msg[0].min_period,
                            max_period: response.data.msg[0].max_period,
                            min_period_week: response.data.msg[0].min_period_week,
                            max_period_week: response.data.msg[0].max_period_week,
                            payment_mode: response.data.msg[0].payment_mode,
                            roi: response.data.msg[0].roi,
                            active_flag: response.data.msg[0].active_flag || "A",
                            created_by: userDetails?.emp_id,
                            modified_by: userDetails?.emp_id
                        });
                    }
                }
          }
          else{
            // Fetch 
          }

    }

    const onSubmit = async (values) => {
      // console.log("Form Values:", values);
      try{
            // console.log(formik.errors);
            setLoading(true);
            // console.log("Submitting form with values:", values);
            const res = await axios.post(`${url}${apiName.addorupdateScheme}`, values);
            if(res?.request?.status === 200){
              setLoading(false);
                Message(res?.data?.suc == 1 ? "success" : "error", res?.data?.msg);
               if(res?.data?.suc === 1){
                    navigate(window.history.length > 1 ? -1 : '/homeadmin/masterschemes');
                }
            }
            else{
              setLoading(false);
              Message("error", "We are unable to process your request at the moment. Please try again later.");
            }
      }
      catch(err){
        console.error("Error submitting form:", err);
        Message("error", "Failed to submit scheme data.");
        setLoading(false);
      }
    }

     const formik = useFormik({
            initialValues: {
                scheme_id: params?.scheme_id || 0,
                scheme_name: "",
                effective_from: "",
                min_amt: "",
                max_amt: "",
                min_period: "",
                max_period: "",
                min_period_week: "",
                max_period_week: "",
                payment_mode: "",
                roi: "",
                active_flag: active_flag || "A",
                created_by: userDetails?.emp_id,
                modified_by: params == 0 ? 0 : userDetails?.emp_id,
            },
            // formValues : initialValues,
            onSubmit,
            validationSchema:schemeValidationSchema,
            validateOnChange: true,
            validateOnBlur: true,
            enableReinitialize: true,
            validateOnMount: true,
            validateOnSubmit: true,
            // isInitialValid:true
        })
    
        useEffect(()=>{
            console.log(formik.errors);
        },[formik.errors])

  const onReset = () =>{
    console.log("Form Reset");
    formik.resetForm();
  }
  return (
    <div>
        <Sidebar mode={2} />
        <section className="dark:bg-[#001529] flex justify-center align-middle p-5">
				<div className="px-1 py-5 w-4/5 min-h-screen rounded-3xl">
					<div className="w-auto mx-14 my-4">
						<FormHeader text="Add/Edit Scheme Master" mode={2} />
					</div>
					<Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-blue-800 dark:text-gray-400"
						spinning={loading}
					>
						<div className="card shadow-lg bg-white border-2 p-5 mx-16  rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <div className="grid grid-cols-12 gap-4 ">
                          <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              placeholder="Scheme..."
                              type="text"
                              required={true}
                              label="Scheme"
                              name="scheme_name"
                              formControlName={formik.values.scheme_name}
                              handleChange={formik.handleChange}
                              mode={1}
                            />
                             {formik.errors.scheme_name && formik.touched.scheme_name ? (
                                <VError title={formik.errors.scheme_name} />
                            ) : null}
                          </div>
                          <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              type="date"
                              required={true}
                              label="Effective From"
                              name="effective_from"
                              formControlName={formik.values.effective_from}
                              handleChange={formik.handleChange}
                              mode={1}
                            />
                             {formik.errors.effective_from && formik.touched.effective_from ? (
                                <VError title={formik.errors.effective_from} />
                            ) : null}
                          </div>
                          <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              type="text"
                              required={true}
                              label="Minimum Amount"
                              placeholder="Minimum Amount"
                              name="min_amt"
                              formControlName={formik.values.min_amt}
                              handleChange={formik.handleChange}
                              mode={1}
                            />
                             {formik.errors.min_amt && formik.touched.min_amt ? (
                                <VError title={formik.errors.min_amt} />
                            ) : null}
                          </div>
                           <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              type="text"
                              required={true}
                              placeholder="Maximum Amount"
                              label="Maximum Amount"
                              name="max_amt"
                              formControlName={formik.values.max_amt}
                              handleChange={formik.handleChange}
                              mode={1}
                            />
                             {formik.errors.max_amt && formik.touched.max_amt ? (
                                <VError title={formik.errors.max_amt} />
                            ) : null}
                          </div>
                          <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              type="text"
                              required={true}
                              label="Minimum Period"
                              placeholder="Minimum Period"
                              name="min_period"
                              formControlName={formik.values.min_period}
                              handleChange={formik.handleChange}
                              mode={1}
                            />
                             {formik.errors.min_period && formik.touched.min_period ? (
                                <VError title={formik.errors.min_period} />
                            ) : null}
                          </div>
                           <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              type="text"
                              required={true}
                              label="Maximum Period"
                              placeholder="Maximum Period"
                              name="max_period"
                              formControlName={formik.values.max_period}
                              handleChange={formik.handleChange}
                              mode={1}
                            />
                             {formik.errors.max_period && formik.touched.max_period ? (
                                <VError title={formik.errors.max_period} />
                            ) : null}
                          </div>

                          <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              type="text"
                              required={true}
                              label="Minimum Week Period"
                              placeholder="Minimum Week Period"
                              name="min_period_week"
                              formControlName={formik.values.min_period_week}
                              handleChange={formik.handleChange}
                              mode={1}
                            />
                             {formik.errors.min_period_week && formik.touched.min_period_week ? (
                                <VError title={formik.errors.min_period_week} />
                            ) : null}
                          </div>
                           <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              type="text"
                              required={true}
                              label="Maximum Week Period"
                              placeholder="Maximum Week Period"
                              name="max_period_week"
                              formControlName={formik.values.max_period_week}
                              handleChange={formik.handleChange}
                              mode={1}
                            />
                             {formik.errors.max_period_week && formik.touched.max_period_week ? (
                                <VError title={formik.errors.max_period_week} />
                            ) : null}
                          </div>
                          <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              required={true}
                              label="Payment Mode"
                              placeholder="Select Payment Mode"
                              name="payment_mode"
                              formControlName={formik.values.payment_mode}
                              handleChange={formik.handleChange}
                              mode={2}
                              data={[
                                { code: "Weekly", name: "Weekly" },
                                { code: "Monthly", name: "Monthly" }
                              ]}
                            />
                             {formik.errors.payment_mode && formik.touched.payment_mode ? (
                                <VError title={formik.errors.payment_mode} />
                            ) : null}
                          </div>
                          <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              type="text"
                              required={true}
                              label="ROI(%)"
                              placeholder="ROI(%)"
                              name="roi"
                              formControlName={formik.values.roi}
                              handleChange={formik.handleChange}
                              mode={1}
                            />
                             {formik.errors.roi && formik.touched.roi ? (
                                <VError title={formik.errors.roi} />
                            ) : null}
                          </div>
                          <div className="col-span-12 md:col-span-4">
                            <TDInputTemplateBr
                              label="Status"
                              required={true}
                              placeholder="Select Status"
                              name="active_flag"
                              formControlName={formik.values.active_flag}
                              handleChange={formik.handleChange}
                              mode={2}
                              data={[
                                { code: "A", name: "Active" },
                                { code: "D", name: "Inactive" }
                              ]}
                            />
                             {formik.errors.active_flag && formik.touched.active_flag ? (
                                <VError title={formik.errors.active_flag} />
                            ) : null}
                          </div>
                        </div>
                        <div className="mt-10">
                          <BtnComp mode="A" onReset={onReset} />
                        </div>
                    </div>
                  </form>
						</div>
					</Spin>
				</div>
			</section>
    </div>
  )
}

export default AddOrUpdateScheme

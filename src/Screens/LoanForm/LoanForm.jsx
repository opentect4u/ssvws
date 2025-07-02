import React, { useEffect, useState } from "react"
import "./LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../Components/BtnComp"
import VError from "../../Components/VError"
import TDInputTemplate from "../../Components/TDInputTemplate"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Message } from "../../Components/Message"
import { url } from "../../Address/BaseUrl"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import FormHeader from "../../Components/FormHeader"
import { routePaths } from "../../Assets/Data/Routes"
import { numberToWords } from "../../Utils/numberToWords"

function LoanForm() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const [count, setCount] = useState(() => 0)
	const [branches, setBranches] = useState(() => [])
	const [loanTypes, setLoanTypes] = useState(() => [])
	const [applicationId, setApplicationId] = useState(() => "")

	console.log(params, "params")

	const [formValues, setValues] = useState({
		l_member_id: "",
		l_membership_date: "",
		l_name: "",
		l_father_husband_name: "",
		l_gender: "",
		l_dob: "",
		l_email: "",
		l_mobile_no: "",
		l_address: "",
		l_loan_through_branch: "",
		l_applied_for: "",
		l_loan_amount: "",
		l_duration: "",
	})

	const initialValues = {
		l_member_id: "",
		l_membership_date: "",
		l_name: "",
		l_father_husband_name: "",
		l_gender: "",
		l_dob: "",
		l_email: "",
		l_mobile_no: "",
		l_address: "",
		l_loan_through_branch: "",
		l_applied_for: "",
		l_loan_amount: "",
		l_duration: "",
	}

	const validationSchema = Yup.object({
		l_member_id: Yup.string().required("Member ID is required"),
		l_membership_date: Yup.string().required("Membership Date is required"),
		l_name: Yup.string()
			.max(60, "Name should always be less than 61 characters.")
			.required("Name is required"),
		l_father_husband_name: Yup.string()
			.max(60, "Father/Husband name should always be less than 61 characters.")
			.required("Father/Husband is required"),
		l_gender: Yup.string().required("Gender is required"),
		l_dob: Yup.string().required("DOB is required"),
		l_email: Yup.string().email("Enter valid email").optional(),
		l_mobile_no: Yup.string()
			.matches(/^[0-9]+$/, "Must be only digits")
			.min(10, "Number should exactly be 10 digits")
			.max(10, "Number should exactly be 10 digits")
			.required("Mobile Numeber is required"),
		l_address: Yup.string()
			.max(500, "Address length should always be less than 500 characters")
			.required("Address is required"),
		l_loan_through_branch: Yup.string().required(
			"Loan Through Branch is required"
		),
		l_applied_for: Yup.string().required("Applied For is required"),
		l_loan_amount: Yup.number()
			.integer("Only integers are allowed")
			.min(1, "Loan Amount should always be greater than 0")
			.max(1000000000, "Max loan amount is 1000000000")
			.required("Loan Amount is required"),
		l_duration: Yup.number()
			.min(0, "Duration should always be greater than equal 0")
			.required("Duration is required"),
	})

	useEffect(() => {
		console.log("Calls when onSubmit api axios success changes...")
	}, [count])

	const fetchBranches = async () => {
		await axios
			.get(`${url}/sql/branch_dtls`)
			.then((res) => {
				if (res?.data?.suc === 1) {
					setBranches(res?.data?.msg)
				} else {
					Message("error", "Data not found!")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching Branches.")
			})
	}

	const fetchLoanTypes = async () => {
		await axios
			.get(`${url}/sql/loan_type_dtls`)
			.then((res) => {
				if (res?.data?.suc === 1) {
					setLoanTypes(res?.data?.msg)
				} else {
					Message("error", "Data not found!")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching Loan Types.")
			})
	}

	useEffect(() => {
		fetchBranches()
		fetchLoanTypes()
	}, [])

	const onSubmit = async (values) => {
		console.log("onsubmit called")
		console.log(values, "onsubmit vendor")
		setLoading(true)

		const creds = {
			application_no: +params?.id,
			member_id: +values?.l_member_id,
			member_name: values?.l_name,
			father_name: values?.l_father_husband_name,
			gender: values?.l_gender,
			dob: values?.l_dob,
			member_dt: values?.l_membership_date,
			email: values?.l_email,
			mobile_no: values?.l_mobile_no,
			memb_address: values?.l_address,
			branch_code: values?.l_loan_through_branch,
			loan_type: values?.l_applied_for,
			loan_amt: values?.l_loan_amount,
			loan_period: values?.l_duration,
			created_by: values?.l_name,
		}

		await axios
			.post(`${url}/sql/insert_loan_dtls`, creds)
			.then((res) => {
				if (res?.data?.suc === 1) {
					setApplicationId(res?.data?.app_id)

					console.log("IIIIIIIIIAAAAAAAAAAAAAAAAAA", res?.data)

					navigate(`${routePaths.LOAN_VIEW}`, {
						state: {
							loanFormValues: values,
							loanType: loanTypes?.filter(
								(loantype) => +values?.l_applied_for === +loantype?.sl_no
							)[0]?.loan_type,
							loanBranch: branches?.filter(
								(loanBr) => +values?.l_loan_through_branch === +loanBr?.sl_no
							)[0]?.branch_name,
							gender:
								values.l_gender === "M"
									? "Male"
									: values.l_gender === "F"
									? "Female"
									: values.l_gender === "L"
									? "LGBTQA+"
									: "Error occurred!",
							applicationId: res?.data?.app_id,
						},
					})
				} else {
					Message("error", "Data not found!")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while submitting loan details!")
			})

		setLoading(false)
	}

	const formik = useFormik({
		initialValues: formValues,
		onSubmit,
		validationSchema,
		validateOnChange: true,
		validateOnBlur: true,
		enableReinitialize: true,
		validateOnMount: true,
	})

	const handleMemberIdBlur = async (event) => {
		if (!formik.values.l_member_id || +formik.values.l_member_id === 0) {
			Message("warning", "Please fill the Member ID.")
			return
		}
		setLoading(true)
		console.log("Member ID blurred:", event.target.value)

		formik.handleBlur(event)

		const creds = { cust_id: +formik.values.l_member_id }
		await axios
			.post(`${url}/oracle/select_cust_dtls`, creds)
			.then((res) => {
				if (res?.data?.suc === 1) {
					const fetchedValues = {
						l_member_id: formik.values.l_member_id || formValues.l_member_id,
						l_membership_date:
							new Date(res?.data?.msg?.CUST_DT)?.toISOString()?.split("T")[0] ||
							"",
						l_name: res?.data?.msg?.CUST_NAME || "",
						l_father_husband_name: res?.data?.msg?.GUARDIAN_NAME || "",
						l_gender: res?.data?.msg?.SEX || "",
						l_dob:
							new Date(res?.data?.msg?.DT_OF_BIRTH)
								?.toISOString()
								?.split("T")[0] || "",
						l_email: res?.data?.msg?.EMAIL || "",
						l_mobile_no: res?.data?.msg?.PHONE || "",
						l_address: res?.data?.msg?.PRESENT_ADDRESS || "",
					}

					// Merge the fetched values with the existing form values
					setValues((prevValues) => ({
						...prevValues,
						...fetchedValues,
					}))
				} else {
					Message("error", "Data not found!")
					// Reset all form values if data not found
					setValues(initialValues)
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching customer details.")
			})
		setLoading(false)
	}

	return (
		<section className="bg-red-50 dark:bg-[#001529] flex justify-center align-middle p-5">
			{/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
			{/* <HeadingTemplate
				text={params.id > 0 ? "Update vendor" : "Add vendor"}
				mode={params.id > 0 ? 1 : 0}
				title={"Vendor"}
				data={params.id && data ? data : ""}
			/> */}
			<div className=" bg-white p-5 w-4/5 min-h-screen rounded-3xl">
				<div className="w-auto mx-14 my-4">
					<FormHeader text="Loan Application Form" />
				</div>
				<Spin
					indicator={<LoadingOutlined spin />}
					size="large"
					className="text-red-800 dark:text-gray-400"
					spinning={loading}
				>
					<form onSubmit={formik.handleSubmit}>
						<div className="card flex flex-col justify-center px-16 py-5">
							<div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
								<div className="sm:col-span-2">
									<TDInputTemplate
										placeholder="Type Member ID..."
										type="text"
										label="Member ID"
										name="l_member_id"
										formControlName={formik.values.l_member_id}
										handleChange={formik.handleChange}
										handleBlur={handleMemberIdBlur}
										mode={1}
									/>
									{formik.errors.l_member_id && formik.touched.l_member_id ? (
										<VError title={formik.errors.l_member_id} />
									) : null}
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplate
										placeholder="Type Membership Date..."
										type="date"
										label="Membership Date"
										name="l_membership_date"
										formControlName={formik.values.l_membership_date}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										min={"1900-12-31"}
										mode={1}
									/>
									{formik.errors.l_membership_date &&
									formik.touched.l_membership_date ? (
										<VError title={formik.errors.l_membership_date} />
									) : null}
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplate
										placeholder="Type name..."
										type="text"
										label="Name"
										name="l_name"
										formControlName={formik.values.l_name}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										mode={1}
									/>
									{formik.errors.l_name && formik.touched.l_name ? (
										<VError title={formik.errors.l_name} />
									) : null}
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2 sm:gap-6 pt-5">
								<div>
									<TDInputTemplate
										placeholder="Type Father's/Husband's Name..."
										type="text"
										label="Father's/Husband's Name"
										name="l_father_husband_name"
										formControlName={formik.values.l_father_husband_name}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										mode={1}
									/>
									{formik.errors.l_father_husband_name &&
									formik.touched.l_father_husband_name ? (
										<VError title={formik.errors.l_father_husband_name} />
									) : null}
								</div>
								<div>
									<TDInputTemplate
										placeholder="Select Gender..."
										type="text"
										label="Gender"
										name="l_gender"
										formControlName={formik.values.l_gender}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										data={[
											{ code: "M", name: "Male" },
											{ code: "F", name: "Female" },
											{ code: "L", name: "LGBTQA+" },
										]}
										mode={2}
									/>
									{formik.errors.l_gender && formik.touched.l_gender ? (
										<VError title={formik.errors.l_gender} />
									) : null}
								</div>
								<div>
									<TDInputTemplate
										placeholder="Type DOB..."
										type="date"
										label="Date of Birth (DOB)"
										name="l_dob"
										formControlName={formik.values.l_dob}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										max={formik.values.l_membership_date}
										mode={1}
									/>
									{formik.errors.l_dob && formik.touched.l_dob ? (
										<VError title={formik.errors.l_dob} />
									) : null}
								</div>
								<div>
									<TDInputTemplate
										placeholder="Type Email..."
										type="email"
										label="Email"
										name="l_email"
										formControlName={formik.values.l_email}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										mode={1}
									/>
									{formik.errors.l_email && formik.touched.l_email ? (
										<VError title={formik.errors.l_email} />
									) : null}
								</div>
								<div>
									<TDInputTemplate
										placeholder="Type Address..."
										type="text"
										label={`Address`}
										name="l_address"
										formControlName={formik.values.l_address}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										mode={3}
									/>
									{formik.errors.l_address && formik.touched.l_address ? (
										<VError title={formik.errors.l_address} />
									) : null}
								</div>
								<div>
									<TDInputTemplate
										placeholder="Type Mobile Number..."
										type="number"
										label="Mobile Number"
										name="l_mobile_no"
										formControlName={formik.values.l_mobile_no}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										mode={1}
									/>
									{formik.errors.l_mobile_no && formik.touched.l_mobile_no ? (
										<VError title={formik.errors.l_mobile_no} />
									) : null}
								</div>
								<div>
									<TDInputTemplate
										placeholder="Type Loan Through Branch..."
										type="text"
										label="Loan Through Branch"
										name="l_loan_through_branch"
										formControlName={formik.values.l_loan_through_branch}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										data={branches?.map((branch) => ({
											code: branch?.sl_no,
											name: branch?.branch_name,
										}))}
										mode={2}
									/>
									{formik.errors.l_loan_through_branch &&
									formik.touched.l_loan_through_branch ? (
										<VError title={formik.errors.l_loan_through_branch} />
									) : null}
								</div>
								<div>
									<TDInputTemplate
										placeholder="Type Applied For..."
										type="text"
										label="Applied For"
										name="l_applied_for"
										formControlName={formik.values.l_applied_for}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										data={loanTypes?.map((loan) => ({
											code: loan?.sl_no,
											name: loan?.loan_type,
										}))}
										mode={2}
									/>
									{formik.errors.l_applied_for &&
									formik.touched.l_applied_for ? (
										<VError title={formik.errors.l_applied_for} />
									) : null}
								</div>
								<div>
									<TDInputTemplate
										placeholder="Type Loan Amount..."
										type="number"
										label="Loan Amount"
										name="l_loan_amount"
										formControlName={formik.values.l_loan_amount}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										mode={1}
									/>
									{formik.errors.l_loan_amount &&
									formik.touched.l_loan_amount ? (
										<VError title={formik.errors.l_loan_amount} />
									) : null}
									<VError
										title={numberToWords(+formik.values.l_loan_amount)}
										color="purple"
									/>
								</div>
								<div>
									<TDInputTemplate
										placeholder="Type Duration..."
										type="number"
										label="Duration (In Months)"
										name="l_duration"
										formControlName={formik.values.l_duration}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										mode={1}
									/>
									{formik.errors.l_duration && formik.touched.l_duration ? (
										<VError title={formik.errors.l_duration} />
									) : null}
								</div>
							</div>

							<div className="mt-20">
								<BtnComp mode="A" onReset={formik.handleReset} />
							</div>
						</div>
					</form>
				</Spin>
			</div>
		</section>
	)
}

export default LoanForm

import React, { useEffect, useRef, useState } from "react"
import "../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../Components/BtnComp"
import VError from "../../Components/VError"
import TDInputTemplate from "../../Components/TDInputTemplate"
import { useNavigate } from "react-router-dom"
import { FieldArray, Formik, useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Message } from "../../Components/Message"
import { url } from "../../Address/BaseUrl"
import { Spin, Button, Popconfirm, Tag, Timeline, Divider, Modal } from "antd"
import {
	LoadingOutlined,
	DeleteOutlined,
	PlusOutlined,
	MinusOutlined,
	FilePdfOutlined,
	MinusCircleOutlined,
	ClockCircleOutlined,
	ArrowRightOutlined,
	UserOutlined,
	EyeOutlined,
	EyeFilled,
} from "@ant-design/icons"
import FormHeader from "../../Components/FormHeader"
import { routePaths } from "../../Assets/Data/Routes"
import { useLocation } from "react-router"
import Sidebar from "../../Components/Sidebar"
import DialogBox from "../../Components/DialogBox"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import TimelineComp from "../../Components/TimelineComp"
import DynamicTailwindTable from "../../Components/Reports/DynamicTailwindTable"
import { disbursementDetailsHeader } from "../../Utils/Reports/headerMap"
import { getOrdinalSuffix } from "../../Utils/ordinalSuffix"
import AlertComp from "../../Components/AlertComp"
import moment from "moment"
const formatINR = (num) =>
	new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 2,
	}).format(num || 0)
function ViewLoanForm({ groupDataArr }) {
	const [loanDtls,setLoanDtls] = useState([]);
	const [isOverdue, setIsOverdue] = useState('N');
	const [overDueAmt, setOverDueAmt] = useState(0);
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const { loanAppData } = location.state || {}
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))
	const [count, setCount] = useState(0)
	const [groupData, setGroupData] = useState(() => [])
	const [openModal, setOpenModal] = useState(false)
	const [branches, setBranches] = useState(() => [])
	const [branch, setBranch] = useState(() => "")

	const [blocks, setBlocks] = useState(() => [])
	const [block, setBlock] = useState(() => "")

	const [groupDetails, setGroupDetails] = useState(() => [])
	const [memberDetails, setMemberDetails] = useState(() => [])
	const [visible, setVisible] = useState(() => false)
	const [period_mode, setPeriodMode] = useState("")
	const [period_mode_val, setPeriodModeVal] = useState(0)

	const containerRef = useRef(null)

	const [isHovered, setIsHovered] = useState(false)

	const handleWheel = (event) => {
		if (isHovered && containerRef.current) {
			containerRef.current.scrollLeft += event.deltaY
			event.preventDefault()
		}
	}

	const handleMouseEnter = () => {
		setIsHovered(true)
	}

	const handleMouseLeave = () => {
		setIsHovered(false)
	}

	{
		/* purpose,scheme name,interest rate,period,period mode,fund name,total applied amount,total disbursement amount,disbursement date,current outstanding */
	}
	const WEEKS = [
		{
			code: "1",
			name: "Sunday",
		},
		{
			code: "2",
			name: "Monday",
		},
		{
			code: "3",
			name: "Tuesday",
		},
		{
			code: "4",
			name: "Wednesday",
		},
		{
			code: "5",
			name: "Thursday",
		},
		{
			code: "6",
			name: "Friday",
		},
		{
			code: "7",
			name: "Saturday",
		},
	]
	const initialValues = {
		g_co_name: "",
		g_group_name: "",
		g_group_type: "",
		g_address: "",
		g_pin: "",
		g_group_block: "",
		g_phone1: "",
		g_phone2: "",
		g_email: "",
		g_bank_name: "",
		g_bank_branch: "",
		g_ifsc: "",
		g_micr: "",
		g_acc1: "",
		g_acc2: "",
		g_branch_name: "",
		g_total_outstanding: "",

		// disbursement details
		g_purpose: "",
		g_scheme_name: "",
		g_interest_rate: "",
		g_period: "",
		g_period_mode: "",
		g_fund_name: "",
		g_total_applied_amt: "",
		g_total_disbursement_amt: "",
		g_disbursement_date: "",
		g_current_outstanding: "",
	}
	const [formValues, setValues] = useState(initialValues)

	const validationSchema = Yup.object({
		g_group_name: Yup.string().required("Group name is required"),
		g_group_type: Yup.string().required("Group type is required"),
		g_address: Yup.string().required("Group address is required"),
		g_pin: Yup.string().required("PIN No. is required"),
		// g_group_block: Yup.string().required("Group block is required"),
		g_phone1: Yup.string().required("Phone 1 is required"),
		// g_phone2: Yup.string(),
		// g_email: Yup.string(),
		// g_bank_name: Yup.string(),
		// g_bank_branch: Yup.string(),
		// g_ifsc: Yup.string(),
		// g_micr: Yup.string(),
		// g_acc1: Yup.string(),
		// g_acc2: Yup.string().optional(),
	})

	const fetchGroupDetails = async () => {
		setLoading(true)
		const creds = {
			group_code: params?.id,
			branch_code: userDetails?.brn_code,
		}
		await axios
			.post(`${url}/admin/fetch_search_grp_view`, creds)
			.then((res) => {
				setValues({
					g_co_name: res?.data?.msg[0]?.emp_name,
					g_group_name: res?.data?.msg[0]?.group_name,
					g_group_type: res?.data?.msg[0]?.group_type,
					g_address:
						res?.data?.msg[0]?.grp_addr + ", " + res?.data?.msg[0]?.pin_no,
					g_pin: res?.data?.msg[0]?.pin_no,
					// g_group_block: res?.data?.msg[0]?.block,
					g_group_block: res?.data?.msg[0]?.block_name,
					g_phone1: res?.data?.msg[0]?.phone1,
					g_phone2: res?.data?.msg[0]?.phone2,
					g_email: res?.data?.msg[0]?.email_id,
					g_bank_name: res?.data?.msg[0]?.bank_name?.trim(),
					g_bank_branch: res?.data?.msg[0]?.branch_name?.trim(),
					g_ifsc: res?.data?.msg[0]?.ifsc,
					g_micr: res?.data?.msg[0]?.micr,
					g_acc1: res?.data?.msg[0]?.acc_no1?.trim(),
					g_acc2: res?.data?.msg[0]?.acc_no2?.trim(),
					g_branch_name: res?.data?.msg[0]?.brn_name,
					g_total_outstanding: res?.data?.msg[0]?.total_outstanding,

					// disb dtls
					g_purpose: res?.data?.msg[0]?.disb_details[0]?.purpose_id,
					g_scheme_name: res?.data?.msg[0]?.disb_details[0]?.scheme_name,
					g_interest_rate: res?.data?.msg[0]?.disb_details[0]?.curr_roi,
					g_period: res?.data?.msg[0]?.disb_details[0]?.period,
					g_period_mode: res?.data?.msg[0]?.disb_details[0]?.period_mode,
					g_fund_name: res?.data?.msg[0]?.disb_details[0]?.fund_name,
					g_total_applied_amt: res?.data?.msg[0]?.disb_details[0]?.applied_amt,
					g_total_disbursement_amt:
						res?.data?.msg[0]?.disb_details[0]?.disburse_amt,
					g_disbursement_date: res?.data?.msg[0]?.disb_details[0]?.disb_dt
						? new Date(
								res?.data?.msg[0]?.disb_details[0]?.disb_dt
						  ).toLocaleDateString("en-GB")
						: "",
					g_current_outstanding:
						res?.data?.msg[0]?.disb_details[0]?.curr_outstanding,
				})
				setGroupData(res?.data?.msg)
				setPeriodMode(res?.data?.msg[0].disb_details[0]?.period_mode)
				setPeriodModeVal(res?.data?.msg[0].disb_details[0]?.recovery_day)
				setBranch(
					res?.data?.msg[0]?.disctrict + "," + res?.data?.msg[0]?.branch_code
				)
				setBlock(res?.data?.msg[0]?.block)
				setIsOverdue(res?.data?.msg[0]?.overdue_flag);
				setOverDueAmt(res?.data?.msg[0]?.overdue_amt);
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching group form")
			})
		setLoading(false)
	}

	useEffect(() => {
		fetchGroupDetails()
	}, [count])

	// const fetchGroupAndMembersDetails = async () => {
	// 	setLoading(true)
	// 	const creds = {
	// 		prov_grp_code: params?.id,
	// 		user_type: userDetails?.id,
	// 		branch_code: userDetails?.brn_code,
	// 	}
	// 	await axios
	// 		.post(`${url}/admin/fetch_bmfwd_dtls_web`, creds)
	// 		.then((res) => {
	// 			console.log("TETETETETTETETETTETE", res?.data)
	// 			setValues({
	// 				g_group_name: res?.data?.msg[0]?.group_name,
	// 				g_group_type: res?.data?.msg[0]?.group_type,
	// 				g_address: res?.data?.msg[0]?.grp_addr,
	// 				g_pin: res?.data?.msg[0]?.pin_no,
	// 				g_group_block: res?.data?.msg[0]?.block,
	// 				g_phone1: res?.data?.msg[0]?.phone1,
	// 				g_phone2: res?.data?.msg[0]?.phone2,
	// 				g_email: res?.data?.msg[0]?.email_id,
	// 				g_bank_name: res?.data?.msg[0]?.bank_name,
	// 				g_bank_branch: res?.data?.msg[0]?.branch_name,
	// 				g_ifsc: res?.data?.msg[0]?.ifsc,
	// 				g_micr: res?.data?.msg[0]?.micr,
	// 				g_acc1: res?.data?.msg[0]?.acc_no1,
	// 				g_acc2: res?.data?.msg[0]?.acc_no2,
	// 			})
	// 			setGroupDetails(res?.data?.msg[0])
	// 			setMemberDetails(res?.data?.msg[0]?.memb_dt)
	// 		})
	// 		.catch((err) => {
	// 			console.log("ERRRRRRPPPPEEEE", err)
	// 		})
	// 	setLoading(false)
	// }

	// useEffect(() => {
	// 	fetchGroupAndMembersDetails()
	// }, [])

	// const handleFetchBranches = async () => {
	// 	setLoading(true)
	// 	await axios
	// 		.get(`${url}/admin/branch_name_mis?branch_code=${userDetails?.brn_code}`)
	// 		.then((res) => {
	// 			console.log("QQQQQQQQQQQQQQQQ", res?.data)
	// 			setBranches(res?.data?.msg)
	// 		})
	// 		.catch((err) => {
	// 			console.log("?????????????????????", err)
	// 		})

	// 	setLoading(false)
	// }

	// useEffect(() => {
	// 	handleFetchBranches()
	// }, [])

	// const handleFetchBlocks = async (brn) => {
	// 	setLoading(true)
	// 	await axios
	// 		.get(`${url}/get_block?dist_id=${brn}`)
	// 		.then((res) => {
	// 			console.log("******************", res?.data)
	// 			setBlocks(res?.data?.msg)
	// 		})
	// 		.catch((err) => {
	// 			console.log("!!!!!!!!!!!!!!!!", err)
	// 		})
	// 	setLoading(false)
	// }

	// useEffect(() => {
	// 	handleFetchBlocks(branch)
	// }, [branch])

	const onSubmit = async (values) => {
		console.log("onsubmit called")
		console.log(values, "onsubmit vendor")
		setLoading(true)

		setVisible(true)

		setLoading(false)
	}

	const formik = useFormik({
		initialValues: +params.id > 0 ? formValues : initialValues,
		onSubmit,
		validationSchema,
		validateOnChange: true,
		validateOnBlur: true,
		enableReinitialize: true,
		validateOnMount: true,
	})

	// const editGroup = async () => {
	// 	setLoading(true)
	// 	const creds = {
	// 		branch_code: branch?.split(",")[1],
	// 		group_name: formik.values.g_group_name,
	// 		group_type: formik.values.g_group_type,
	// 		// co_id: userDetails?.id,
	// 		phone1: formik.values.g_phone1,
	// 		phone2: formik.values.g_phone2,
	// 		email_id: formik.values.g_email,
	// 		grp_addr: formik.values.g_address,
	// 		// disctrict: groupDetails?.disctrict,
	// 		// block: formik.values.g_group_block,
	// 		pin_no: formik.values.g_pin,
	// 		bank_name: formik.values.g_bank_name,
	// 		branch_name: formik.values.g_bank_branch,
	// 		ifsc: formik.values.g_ifsc,
	// 		micr: formik.values.g_micr,
	// 		acc_no1: formik.values.g_acc1,
	// 		acc_no2: formik.values.g_acc2,
	// 		modified_by: userDetails?.emp_id,
	// 		// modified_at: formik.values.g_group_name,
	// 		group_code: params?.id,
	// 		district: branch?.split(",")[0], // this is dist_code, stored in selection of branch
	// 		block: block,
	// 		co_id: userDetails?.emp_id,
	// 	}
	// 	await axios
	// 		.post(`${url}/admin/edit_group_web`, creds)
	// 		.then((res) => {
	// 			Message("success", "Updated successfully.")
	// 			console.log("IIIIIIIIIIIIIIIIIIIIIII", res?.data)
	// 		})
	// 		.catch((err) => {
	// 			Message("error", "Some error occurred while updating.")
	// 			console.log("LLLLLLLLLLLLLLLLLLLLLLLL", err)
	// 		})
	// 	console.log("VVVVVVVVVVVVVVVVVVVVVVVV", creds)
	// 	setLoading(false)
	// }

	const callAPi = (item) =>{
			console.log(item);
			setLoading(true);
			setLoanDtls([]);
			try{
					const payload = {
						branch_code: userDetails?.brn_code,
						loan_id: item?.loan_id,
					}
					axios.post(`${url}/admin/look_overdue_details`,payload)
					.then((res) => {
						// console.log("API response:", res.data);
						setOpenModal(true);
						setLoanDtls(res?.data?.msg || []);
						setLoading(false);
					})
					.catch((err) => {
						setLoading(false);
						console.log("Error occurred while calling API:", err);
					});
			}
			catch(err){
				setLoading(false);
				console.log("Error occurred while calling API:", err);
			}
	}

	return (
		<>
		{
					isOverdue === 'Y' && <AlertComp 
					
					msg={<p className="text-2xl font-normal"><span className="text-lg ">Loan Overdue Amount is </span>{formatINR(overDueAmt)}</p>} />
				}
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<form onSubmit={formik.handleSubmit} className={`${isOverdue == 'Y' ? 'mt-5' : ''}`}>
					<div className="flex flex-col justify-start gap-5">
						<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
							{/* {params?.id > 0 && (
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Form filled by / CO Name"
										type="text"
										label="Form filled by / CO Name"
										name="co_name"
										formControlName={groupData[0]?.emp_name}
										mode={1}
										disabled
									/>
								</div>
							)} */}
							<div className="sm:col-span-1">
								<TDInputTemplateBr
									placeholder="Group Code"
									type="text"
									label="Group Code"
									name="g_code"
									// handleChange={formik.handleChange}
									// handleBlur={formik.handleBlur}
									// formControlName={formik.values.g_co_name}
									formControlName={params.id}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_group_name && formik.touched.g_group_name ? (
									<VError title={formik.errors.g_group_name} />
								) : null} */}
							</div>
							<div className="sm:col-span-1">
								<TDInputTemplateBr
									placeholder="CO Name"
									type="text"
									label="CO Name"
									name="g_co_name"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_co_name}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_group_name && formik.touched.g_group_name ? (
									<VError title={formik.errors.g_group_name} />
								) : null} */}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Group Name"
									type="text"
									label="Group Name"
									name="g_group_name"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_group_name}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_group_name && formik.touched.g_group_name ? (
									<VError title={formik.errors.g_group_name} />
								) : null} */}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Group Type"
									type="text"
									label="Group Type"
									name="g_group_type"
									formControlName={formik.values.g_group_type}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										{
											code: "S",
											name: "SHG",
										},
										{
											code: "J",
											name: "JLG",
										},
									]}
									mode={2}
									disabled
								/>
								{/* {formik.errors.g_group_type && formik.touched.g_group_type ? (
									<VError title={formik.errors.g_group_type} />
								) : null} */}
							</div>

							{/* {userDetails?.id === 3 && ( */}
							<>
								<div>
									{/* <TDInputTemplateBr
										placeholder="Choose Branch"
										type="text"
										label="Branch"
										name="g_branch"
										formControlName={branch}
										handleChange={(e) => {
											setBranch(e.target.value)
											console.log(e.target.value)
										}}
										data={branches?.map((item, i) => ({
											code: item?.disctrict + "," + item?.branch_code,
											name: item?.branch_name,
										}))}
										mode={2}
										disabled
									/> */}
									<TDInputTemplateBr
										placeholder="Branch Name"
										type="text"
										label="Branch Name"
										name="g_branch_name"
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										formControlName={formik.values.g_branch_name}
										mode={1}
										disabled
									/>
								</div>
								{/* <div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Group Block"
										type="text"
										label="Group Block"
										name="g_block"
										formControlName={block}
										handleChange={(e) => setBlock(e.target.value)}
										data={blocks?.map((item, i) => ({
											code: item?.block_id,
											name: item?.block_name,
										}))}
										mode={2}
									/>
								</div> */}
							</>
							{/* )} */}

							<div>
								<TDInputTemplateBr
									placeholder="Type Block..."
									type="text"
									label={`Block`}
									name="g_group_block"
									formControlName={formik.values.g_group_block}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_address && formik.touched.g_address ? (
									<VError title={formik.errors.g_address} />
								) : null} */}
							</div>

							<div className="sm:col-span-2">
								<TDInputTemplateBr
									placeholder="Type Address..."
									type="text"
									label={`Address and PIN`}
									name="g_address"
									formControlName={formik.values.g_address}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={3}
									disabled
								/>
								{/* {formik.errors.g_address && formik.touched.g_address ? (
									<VError title={formik.errors.g_address} />
								) : null} */}
							</div>

							{/* <div>
								<TDInputTemplateBr
									placeholder="PIN No."
									type="number"
									label="PIN No."
									name="g_pin"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_pin}
									mode={1}
								/>
								{formik.errors.g_pin && formik.touched.g_pin ? (
									<VError title={formik.errors.g_pin} />
								) : null}
							</div> */}

							<div>
								<TDInputTemplateBr
									placeholder="Mobile No. 1"
									type="number"
									label="Mobile No. 1"
									name="g_phone1"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_phone1}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_phone1 && formik.touched.g_phone1 ? (
									<VError title={formik.errors.g_phone1} />
								) : null} */}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Mobile No. 2"
									type="number"
									label="Mobile No. 2"
									name="g_phone2"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_phone2}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_phone2 && formik.touched.g_phone2 ? (
									<VError title={formik.errors.g_phone2} />
								) : null} */}
							</div>

							{/* <div>
								<TDInputTemplateBr
									placeholder="Email"
									type="email"
									label="Email"
									name="g_email"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_email}
									mode={1}
								/>
								{formik.errors.g_email && formik.touched.g_email ? (
									<VError title={formik.errors.g_email} />
								) : null}
							</div> */}

							<div>
								<TDInputTemplateBr
									placeholder="Bank Name"
									type="text"
									label="Bank Name"
									name="g_bank_name"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_bank_name}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_bank_name && formik.touched.g_bank_name ? (
									<VError title={formik.errors.g_bank_name} />
								) : null} */}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Bank Branch"
									type="text"
									label="Bank Branch"
									name="g_bank_branch"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_bank_branch}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_bank_branch && formik.touched.g_bank_branch ? (
									<VError title={formik.errors.g_bank_branch} />
								) : null} */}
							</div>

							{/* <div>
								<TDInputTemplateBr
									placeholder="IFSC"
									type="text"
									label="IFSC Code"
									name="g_ifsc"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_ifsc}
									mode={1}
								/>
								{formik.errors.g_ifsc && formik.touched.g_ifsc ? (
									<VError title={formik.errors.g_ifsc} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="MICR"
									type="text"
									label="MICR Code"
									name="g_micr"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_micr}
									mode={1}
								/>
								{formik.errors.g_micr && formik.touched.g_micr ? (
									<VError title={formik.errors.g_micr} />
								) : null}
							</div> */}

							<div>
								<TDInputTemplateBr
									placeholder="SB Account"
									type="text"
									label="SB Account"
									name="g_acc1"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_acc1}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_acc1 && formik.touched.g_acc1 ? (
									<VError title={formik.errors.g_acc1} />
								) : null} */}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Loan Account"
									type="text"
									label="Loan Account"
									name="g_acc2"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_acc2}
									mode={1}
									disabled
								/>
								{/* {formik.errors.g_acc2 && formik.touched.g_acc2 ? (
									<VError title={formik.errors.g_acc2} />
								) : null} */}
							</div>
						</div>
						<Divider
							type="horizontal"
							style={{
								height: 5,
							}}
						/>
						<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
							<div className="sm:col-span-1">
								<TDInputTemplateBr
									placeholder="Select Mode"
									type="text"
									label="Mode"
									name="b_mode"
									formControlName={period_mode}
									// handleChange={handleChangeDisburseDetails}
									data={[
										{
											code: "Monthly",
											name: "Monthly",
										},
										{
											code: "Weekly",
											name: "Weekly",
										},
									]}
									mode={2}
									disabled
									// disabled={
									// 	!disbursementDetailsData.b_scheme || disburseOrNot
									// }
								/>
							</div>
							<div className="sm:col-span-1">
								{period_mode === "Monthly" ? (
									<>
										<div className="sm:col-span-6">
											{!period_mode_val && (
												<span
													style={{ color: "red" }}
													className="right-0 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
												>
													Required!
												</span>
											)}
											<TDInputTemplateBr
												placeholder="Day of Recovery..."
												type="number"
												label={`Day of Recovery ${
													period_mode_val
														? `(${getOrdinalSuffix(
																period_mode_val
														  )} of every month)`
														: ""
												}`}
												name="b_dayOfRecovery"
												formControlName={period_mode_val}
												handleChange={(e) => setPeriodModeVal(e.target.value)}
												mode={1}
												// disabled={
												// 	!disbursementDetailsData?.b_scheme || disburseOrNot
												// }
											/>
											{(period_mode_val < 1 || period_mode_val > 31) && (
												<VError title={`Day should be between 1 to 31`} />
											)}
										</div>
									</>
								) : (
									<>
										<div className="sm:col-span-6">
											{!period_mode_val && (
												<span
													style={{ color: "red" }}
													className="right-0 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
												>
													Required!
												</span>
											)}
											<TDInputTemplateBr
												placeholder="Select Weekday"
												type="text"
												label="Day of Recovery"
												name="b_dayOfRecovery"
												formControlName={period_mode_val}
												handleChange={(e) => setPeriodModeVal(e.target.value)}
												data={WEEKS}
												mode={2}
												// disabled={
												// 	!disbursementDetailsData.b_scheme || disburseOrNot
												// }
											/>
										</div>
									</>
								)}
							</div>
							{userDetails?.id != 3 && <div className="sm:col-span-2 text-center">
								<button
									className="py-2.5 px-5 bg-teal-500 text-slate-50 rounded-full hover:bg-green-500 active:ring-2 active:ring-slate-500"
									type="button"
									// onClick={() => setVisible2(true)}
									onClick={() => {
										const creds = {
											recovery_day: period_mode_val,
											modified_by: userDetails?.emp_id,
											recov_day_dtls: groupData[0]?.disb_details?.map((e) => {
												return { loan_id: e.loan_id }
											}),
										}
										axios
											.post(url + "/admin/change_recovery_day", creds)
											.then((res) => {
												if (res?.data?.suc > 0) {
													setCount((prev) => prev + 1)
													Message(
														"success",
														"Recovery day updated successfully!"
													)
												} else {
													Message("error", "Error while updating!")
												}
											})
											.catch((err) => {
												Message("error", err)
											})
									}}
								>
									Save
								</button>
							</div>}
						</div>
						{/* purpose,scheme name,interest rate,period,period mode,fund name,total applied amount,total disbursement amount,disbursement date,current outstanding */}
						<div className="text-[#DA4167] text-lg font-bold">Loan Details</div>

						<div>
							<DynamicTailwindTable
								data={groupData[0]?.disb_details?.map((el) => {
									//  console.log(el.loan_cycle, ' Loan Cycle');
									 const loanCycle = 'Loan Cycle - '+ el.loan_cycle; 
									 
									//  el.loan_cycle = loanCycle;
									//  console.log(el);
									 return {
										...el,
										loan_cycle:loanCycle
									 };
								})}
								pageSize={50}
								columnTotal={[13, 15, 16]}
								headersMap={disbursementDetailsHeader}
								dateTimeExceptionCols={[14]}
								colRemove={[3, 5, 12, 17]}
							/>
						</div>

						{/* <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
							<div>
								<TDInputTemplateBr
									placeholder="Purpose"
									type="text"
									label="Purpose"
									name="g_purpose"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_purpose}
									mode={1}
									disabled
								/>
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Scheme Name"
									type="text"
									label="Scheme Name"
									name="g_scheme_name"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_scheme_name}
									mode={1}
									disabled
								/>
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Interest Rate"
									type="number"
									label="Interest Rate"
									name="g_interest_rate"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_interest_rate}
									mode={1}
									disabled
								/>
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Period"
									type="number"
									label="Period"
									name="g_period"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_period}
									mode={1}
									disabled
								/>
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Period Mode"
									type="text"
									label="Period Mode"
									name="g_period_mode"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_period_mode}
									mode={1}
									disabled
								/>
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Fund Name"
									type="text"
									label="Fund Name"
									name="g_fund_name"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_fund_name}
									mode={1}
									disabled
								/>
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Total Applied Amount"
									type="number"
									label="Total Applied Amount"
									name="g_total_applied_amt"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_total_applied_amt}
									mode={1}
									disabled
								/>
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Total Disbursement Amount"
									type="number"
									label="Total Disbursement Amount"
									name="g_total_disbursement_amt"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_total_disbursement_amt}
									mode={1}
									disabled
								/>
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Disbursement Date"
									type="text"
									label="Disbursement Date"
									name="g_disbursement_date"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_disbursement_date}
									mode={1}
									disabled
								/>
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Current Outstanding"
									type="number"
									label="Current Outstanding"
									name="g_current_outstanding"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={formik.values.g_current_outstanding}
									mode={1}
									disabled
								/>
							</div>
						</div> */}

						{params?.id > 0 && (
							<div className="gap-3">
								<div className="w-full my-10 border-t-4 border-gray-400 border-dashed"></div>
								<div>
									<div className="text-[#DA4167] text-lg mb-2 font-bold">
										Members in this Group
									</div>


									{/* {groupData[0]?.memb_dt?.map((item, i) => (
										<Tag
											key={i}
											icon={<UserOutlined />}
											color={
												item?.approval_status === "U" ||
												(userDetails?.id == 3 && item?.approval_status === "S")
													? "geekblue"
													: "red"
											}
											className="text-lg cursor-pointer mb-5 rounded-3xl
									"
											onClick={
												userDetails?.id == 2
													? () =>
															navigate(`/homebm/editgrtform/${item?.form_no}`, {
																state: item,
															})
													: () =>
															navigate(`/homeco/editgrtform/${item?.form_no}`, {
																state: item,
															})
											}
										>
											{item?.client_name}
										</Tag>
									))} */}

									<Spin spinning={loading}>
										<div
											ref={containerRef}
											className={`relative overflow-x-auto shadow-md sm:rounded-lg`}
											onWheel={handleWheel}
											onMouseEnter={handleMouseEnter}
											onMouseLeave={handleMouseLeave}
										>
											<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
												<thead className="text-xs text-white uppercase bg-slate-800 dark:bg-gray-700 dark:text-gray-400">
													<tr>
														<th scope="col" className="px-6 py-3 font-semibold">
															Member Name
														</th>
														<th scope="col" className="px-6 py-3 font-semibold">
															Loan ID
														</th>
														<th scope="col" className="px-6 py-3 font-semibold">
															Member Code
														</th>
														<th scope="col" className="px-6 py-3 font-semibold">
															Outstanding
														</th>
														<th scope="col" className="px-6 py-3 font-semibold">
															<span className="sr-only">Action</span>
														</th>
													</tr>
												</thead>
												<tbody>
													{groupData[0]?.memb_dt?.map((item, i) => (
														<tr
															key={i}
															className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600"
														>
															<th
																scope="row"
																className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
															>
																{item?.client_name}
															</th>
															<td className="px-6 py-4">
																{
																	groupData[0]?.overdue_loan_ids?.filter(el => el.loan_id == item?.loan_id).length == 0 ? item?.loan_id :  
																	<Button onClick={() => callAPi(item)} size="small" type="primary">
																	{item?.loan_id}
																</Button>
																}
															
																</td>
															<td className="px-6 py-4">{item?.member_code}</td>
															<td className="px-6 py-4">
																{item?.curr_outstanding}/-
															</td>
															<td className="px-6 py-4 text-right">
																<button
																	onClick={() => {
																		navigate(
																			`/homebm/memberloandetails/${item?.loan_id}`
																		)
																	}}
																	className="font-medium text-teal-500 dark:text-blue-500 hover:underline"
																>
																	<EyeFilled />
																</button>
															</td>
														</tr>
													))}
													<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
														<td className="px-6 py-4 font-semibold" colSpan={3}>
															Total Outstanding
														</td>
														<td
															className="px-6 py-4 text-left font-semibold"
															colSpan={2}
														>
															{formValues?.g_total_outstanding}/-
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</Spin>
								</div>
							</div>
						)}
					</div>
					{/* <BtnComp
						mode="A"
						// rejectBtn={true}
						// onReject={() => {
						// 	setVisibleModal(false)
						// }}
						onReset={formik.resetForm}
						// sendToText="Credit Manager"
						// onSendTo={() => console.log("dsaf")}
						// condition={fetchedFileDetails?.length > 0}
						// showSave
						param={params?.id}
					/> */}
				</form>
			</Spin>

			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					// editGroup()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>

			<Modal
				// width={{
				// 	xs: '90%',
				// 	sm: '80%',
				// 	md: '70%',
				// 	lg: '60%',
				// 	xl: '50%',
				// 	xxl: '40%',
				// 	}}
				title="Overdue Details"
				okButtonProps={null}
				open={openModal}
				onCancel={() => setOpenModal(false)}>
					<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								<thead className="text-xs text-white uppercase bg-slate-800 dark:bg-gray-700 dark:text-gray-400">
									<tr>
										<th scope="col" className="px-6 py-3 font-semibold">
											Overdue Amount
										</th>
										<th scope="col" className="px-6 py-3 font-semibold">
											Overdue Date
										</th>
										
									</tr>
								</thead>
								<tbody>
									{loanDtls.map((item, i) => (
										<tr
											key={i}
											className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600"
										>
											
											<td className="px-6 py-4">{item?.od_amt ? item?.od_amt : '0.00'}</td>
											<td className="px-6 py-4">
												{item?.od_date ? moment(item?.od_date).format("DD-MM-YYYY") : "N/A"}
											</td>
											
										</tr>
									))}
									
								</tbody>
							</table>
			</Modal>
		</>
	)
}

export default ViewLoanForm

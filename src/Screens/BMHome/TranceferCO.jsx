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
import {
	Spin,
	Button,
	Popconfirm,
	Tag,
	Timeline,
	Divider,
	Typography,
	List,
	Select,
} from "antd"
import {
	LoadingOutlined,
	InfoCircleFilled,
	CheckCircleOutlined,
} from "@ant-design/icons"
import FormHeader from "../../Components/FormHeader"
import { routePaths } from "../../Assets/Data/Routes"
import { useLocation } from "react-router"
import Sidebar from "../../Components/Sidebar"
import DialogBox from "../../Components/DialogBox"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import TimelineComp from "../../Components/TimelineComp"
import {
	PendingActionsOutlined,
	DeleteOutline,
	InfoOutlined,
} from "@mui/icons-material"
import { Checkbox } from "antd"
import { DataTable } from "primereact/datatable"
import Column from "antd/es/table/Column"
import { Toast } from "primereact/toast"
import { debounce } from "@mui/material"
import moment from "moment"

function TranceferCO({ groupDataArr }) {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const { loanAppData } = location.state || {}
	const approval_status = location.state?.approval_status || "N"
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const [groupData, setGroupData] = useState(() => [])

	const [get_CO__, setCO__] = useState(() => [])
	// const [branch, setBranch] = useState(() => "")
	const [COPickup, setCOPickup] = useState(() => "")
	const [ToBranchName, setToBranchName] = useState(() => "")

	const [To_COData, setTo_COData] = useState(() => "")

	const [From_COData, setFrom_COData] = useState(() => "")
	const [From_BranchData, setFrom_BranchData] = useState(() => "")

	// const approv_stat = useLocation()
	const [ApprovStatus, setApprovStatus] = useState(() => "")

	const [CEOData_s, setCEOData_s] = useState(() => [])
	const [CEOData, setCEOData] = useState(() => [])

	const [visible2, setVisible2] = useState(() => false)
	const [visible3, setVisible3] = useState(() => false)
	const [visible4, setVisible4] = useState(() => false)

	const [MemberList, setMemberList] = useState(() => [])

	const [MemberListView, setMemberListView] = useState(() => [])
	const [GroupCode, setGroupCode] = useState("")

	// const [COMemList_Show, setCOMemList_Show] = useState()

	// const [COMemList_select, setCOMemList_select] = useState([])

	const [currentPage, setCurrentPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	// const [getloanAppData, setLoanAppData] = useState([])
	// const [expandedRows, setExpandedRows] = useState(null)
	const [COMemList_s, setCOMemList_s] = useState(() => [])
	const [COMemList_select, setCOMemList_select] = useState(null)
	const [COMemList_Store, setCOMemList_Store] = useState([])
	const toast = useRef(null)
	const isMounted = useRef(false)

	const [COAndBranch, setCOAndBranch] = useState(() => [])
	const [block, setBlock] = useState(() => "")

	const [groupDetails, setGroupDetails] = useState(() => [])
	const [memberDetails, setMemberDetails] = useState(() => [])
	const [visible, setVisible] = useState(() => false)
	const [remarksForDelete, setRemarksForDelete] = useState(() => "")

	// const [checkedValues, setCheckedValues] = useState([]);

	// console.log(COMemList_select , "paramsssssssssssssss")
	// console.log(location, "location")

	// const [formValues, setValues] = useState(initialValues)

	const initialValues = {
		// Grp_wit_Co: "",
		Grp_wit_Co: "",
		frm_co: "",
		frm_branch: "",
		to_co: "",
		to_branch: "",
		remarks_: "",
		trxn_date: new Date().toISOString().split("T")[0], // Set current date in YYYY-MM-DD format
		has_un_approve_trxn:false
	}
	const [formValues, setValues] = useState(initialValues)

	const validationSchema = Yup.object({
		// Grp_wit_Co: Yup.string().required("Group Code With CO Name is required"),
		Grp_wit_Co:
			params?.id > 0
				? Yup.string()
				: Yup.string().required("Group Name is required"),
		frm_co: Yup.string(),
		frm_branch: Yup.string(),
		to_branch:
			params?.id > 0
				? Yup.string()
				: Yup.string().required("To Branch is required"),
		to_co:
			params?.id > 0
				? Yup.string()
				: Yup.string().required("To CO is required"),
		remarks_:
			params?.id > 0
				? Yup.string()
				: Yup.string().required("Remarks is required"),
		trxn_date: Yup.date().required('Transaction Date is required').test('has_un_approve_trxn', 'There are unapproved transactions before this date.', function (value) {
			console.log(value, 'value in test');
			 	const { has_un_approve_trxn } = this.parent;
				console.log(has_un_approve_trxn, 'has_un_approve_trxn in test');
				return !has_un_approve_trxn
		}),
		has_un_approve_trxn:Yup.boolean().default(false),
	})

	const [options__Group, setOptions__Group] = useState([
		{ value: "0", label: "Search" },
	])

	const [options__Branch, setOptions__Branch] = useState([
		{ value: "0", label: "Search" },
	])

	const handleFetch_CO = debounce(async (value) => {
		if (!value) return

		// console.log(value, 'valuevaluevaluevaluevalue');

		setLoading(true)

		const creds = {
			branch_code: userDetails?.brn_code,
			grp: value,
		}

		try {
			// Simulating an API call (Replace with your API)
			const response = await axios.post(
				`${url}/fetch_group_name_brnwise`,
				creds
			)

			console.log(response?.data?.msg, "valuevaluevaluevaluevalue")

			const data = await response?.data?.msg

			// Update options dynamically
			setOptions__Group(
				data.map((user) => ({
					//   value: user.id.toString(),
					//   label: user.name,
					// value: user.group_code,
					value: user.branch_code + "," + user.group_code,
					label: user.group_name,
				}))
			)
		} catch (error) {
			console.error("Error fetching data:", error)
		}

		setLoading(false)
	}, 500) // Debounced to prevent excessive API calls

	const handleFetch_Branch = debounce(async (value) => {
		if (!value) return

		// console.log(value, 'valuevaluevaluevaluevalue');

		setLoading(true)

		const creds = {
			branch: value,
		}

		try {
			// Simulating an API call (Replace with your API)
			const response = await axios.post(`${url}/fetch_branch_name`, creds)

			console.log(response?.data?.msg, "valuevaluevaluevaluevalue")

			const data = await response?.data?.msg

			console.log(data, "fetch_branch_name")

			// Update options dynamically
			setOptions__Branch(
				data.map((user) => ({
					//   value: user.id.toString(),
					//   label: user.name,
					// value: user.group_code,
					value: user.branch_code,
					label: user.branch_name,
				}))
			)
		} catch (error) {
			console.error("Error fetching data:", error)
		}

		setLoading(false)
	}, 500) // Debounced to prevent excessive API calls

	const handleFetch_CO_By_Branch = async () => {
		setLoading(true)
		const creds = {
			branch_code: ToBranchName,
		}
		await axios
			.post(`${url}/fetch_co_name_branchwise`, creds)
			.then((res) => {
				console.log("////////////////////////", res?.data?.msg)
				setTo_COData(res?.data?.msg)
			})
			.catch((err) => {
				console.log("?????????????????????", err)
			})

		setLoading(false)
	}

	console.log("=========>>>>>>>>>>> ++++++++++++++", location.state)

	const handleFetchAllFormData = async () => {
		setLoading(true)
		const creds = {
			group_code: params?.id,
			flag: approval_status,
			from_co: location.state.from_co,
			from_brn: location.state.frm_branch,
		}
		// console.log(creds, "hhhhhhhhhhhhhhhhhh", params?.id)
		await axios
			// .post(`${url}/fetch_co_brnwise=${userDetails?.brn_code}`)
			.post(`${url}/transfer_co_view_all_details`, creds)
			.then((res) => {
				// console.log("fetch__data_view", res?.data?.msg)
				console.log("transfer_co_view_all_details", res?.data?.msg)
				// setCEOData_s(res?.data?.msg)
				setValues({
					Grp_wit_Co: res?.data?.msg[0]?.group_name,
					frm_co: res?.data?.msg[0]?.from_co_name,
					frm_branch: res?.data?.msg[0]?.grp_brn_name,
					to_co: res?.data?.msg[0]?.to_co_name,
					to_branch: res?.data?.msg[0]?.to_brn_name,
					remarks_: res?.data?.msg[0]?.remarks,
					group_code_custom: res?.data?.msg[0]?.group_code,

					approved_by: res?.data?.msg[0]?.approved_by,
					approved_at: res?.data?.msg[0]?.approved_at,
					created_by: res?.data?.msg[0]?.created_by,
					created_at: res?.data?.msg[0]?.created_at,
				})
				// console.log(formValues.b_branch_name);

				setGroupCode(res?.data?.msg[0]?.group_code)
			})
			.catch((err) => {
				console.log("?????????????????????", err)
			})

		setLoading(false)
	}

	const handleFetchMemberList = async () => {
		if(COAndBranch.length > 0){
			setLoading(true)
			const creds = {
				group_code: COAndBranch[0]?.group_code,
			}
			await axios
				.post(`${url}/groupwise_mem_details`, creds)
				.then((res) => {
					console.log("ttttttttttttttttttttttttttttttttt", res?.data?.msg)
					setMemberList(res?.data?.msg);
					checkPreviousDisbursement(formik.values.trxn_date);	
				})
				.catch((err) => {
					console.log("?????????????????????", err)
				})

			setLoading(false)
		}
		else{
			setMemberList([]);
		}
		
	}

	const handleFetchMemberListView = async () => {
		setLoading(true)
		const creds = {
			group_code: params?.id,
		}
		await axios
			.post(`${url}/groupwise_mem_details`, creds)
			.then((res) => {
				console.log(formValues, "groupwise_mem_details", res?.data?.msg)
				setMemberListView(res?.data?.msg)
			})
			.catch((err) => {
				console.log("?????????????????????", err)
			})

		setLoading(false)
	}

	useEffect(() => {
		// console.log("////////////////////////", ToBranchName)
		if(ToBranchName){
			handleFetch_CO_By_Branch()
		}
		else{
			setTo_COData("");
		}
	}, [ToBranchName])

	useEffect(() => {
		handleFetchMemberList()
	}, [COAndBranch])

	useEffect(() => {
		console.log(
			COAndBranch[0]?.group_code,
			"ttttttttttttttttttt",
			params?.id,
			"tttttttttttttt",
			GroupCode
		)

		if (params?.id > 0) {
			handleFetchMemberListView()
		}
	}, [])

	const handleSelectionChange = (e) => {
		if (e.value.length <= 4) {
			// Update the selected products setPaymentDate
			console.log(e.value, "kkkkkkkkkkkkkkkkkkkk")

			// Perform any additional logic here, such as enabling a button or triggering another action
			setCOMemList_select(e.value)

			function transformData(inputArray) {
				return inputArray.map(({ form_no, member_code }) => ({
					form_no,
					member_code,
				}))
			}

			const output = transformData(e.value)
			setCOMemList_Store(output)
			console.log(output, "kkkkkkkkkkkkkkkkkkkk")
		}
	}

	useEffect(() => {
		if (params?.id > 0) {
			handleFetchAllFormData()
		}
	}, [])

	const handleFetchCOBranch = async (group_code) => {
		setLoading(true)
		const creds = {
			branch_code: userDetails?.brn_code,
			group_code: group_code?.split(",")[1],
		}
		console.log(creds, "fetch_grp_co_dtls_for_transfer")
		await axios
			.post(`${url}/fetch_grp_co_dtls_for_transfer`, creds)
			.then((res) => {
				console.log(res?.data?.msg, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
				setCOAndBranch(res?.data?.msg)
			})
			.catch((err) => {
				console.log("!!!!!!!!!!!!!!!!", err)
			})
		setLoading(false)
	}

	

	useEffect(() => {
		console.log("COPickup", COPickup)
		if(COPickup){
			handleFetchCOBranch(COPickup)
		}
	}, [COPickup])

	const onSubmit = async (values) => {
		console.log(values, "VVVVVVVVVVVVVVVVVVVVVVVV", "hhhh")
		setLoading(true)

		setVisible(true)

		setLoading(false)
		// }
	}

	const formik = useFormik({
		initialValues: +params.id > 0 ? formValues : initialValues,
		// formValues : initialValues,
		onSubmit,
		validationSchema,
		validateOnChange: true,
		validateOnBlur: true,
		enableReinitialize: true,
		validateOnMount: true,
	})

	// useEffect(()=>{
	// 	console.log(formik.values, "formik.values")
	// },[formik.values])
	const editGroup = async () => {
		try{	
					formik.setFieldValue("has_un_approve_trxn", false);
					const payload = {
						branch_code:userDetails?.brn_code,
						transaction_date: formik.values.trxn_date,
					}
						axios.post(`${url}/admin/fetch_unapprove_dtls_before_trns_dt`, payload).then((res) => {
											// console.log(res);
											if(res?.data?.suc === 1){
												if(res?.data?.msg?.length > 0){
													const hasNonZero = res?.data?.msg.some(item =>Object.values(item).some(value => value != 0));
													formik.setFieldValue("has_un_approve_trxn", hasNonZero);
													if(hasNonZero){
														Message("error", <>
																<ul class="list-disc">
																	{res?.data?.msg[0]?.transactions > 0 && <li>There are unapproved transactions before this date. Please check and try again.</li>}
																	{res?.data?.msg[0]?.group_migrate > 0 && <li>There are unapproved group migrate transactions before this date. Please check and try again.</li>}
																	{res?.data?.msg[0]?.member_migrate > 0 && <li>There are unapproved member migrate transactions before this date. Please check and try again.</li>}
																</ul>
														</>);
													}
													else{
															const time = moment().format('HH:mm:ss')
															const creds = {
																group_code: formik.values.Grp_wit_Co?.split(",")[1],
																from_co: COAndBranch[0].co_id,
																from_brn: COAndBranch[0].grp_brn,
																to_co: formik.values.to_co,
																to_brn: ToBranchName,
																remarks: formik.values.remarks_,
																created_by: userDetails?.emp_id,
																modified_by: userDetails?.emp_id,
																trf_date:  moment(`${formik.values.trxn_date} ${time}`).format(),
															}
															// console.log(, "approveDataaftersubmit");
															// console.log(new Date(`${formik.values.trxn_date}T${(new Date()).toTimeString().split(' ')[0]}`), "approveDataaftersubmit");
															axios.post(`${url}/transfer_co`, creds)
																.then((response) => {
																	setLoading(false)
																	if(response?.data?.suc == 1) {
																		Message("success", "Group Transfer CO updated successfully.")
																	}
																	else{
																		Message("error", "We are unable to process your request right now!! Please try again later.")
																	}

																	// if (params?.id < 1) {
																	// 	navigate(`/homebm/tranceferco/`)
																	// }
																	// navigate(-1);
																	// navigate(`/homebm/trancefercofromapprove-unic`);
																	setTimeout(() => {
																		window.location.reload()
																	}, 500)
																})
																.catch((err) => {
																	setLoading(false)
																	Message("error", "Some error occurred while updating.")
																})
													}
												}
											}
											else{
													Message("error", "Something went wrong while checking previous disbursement date. Please try again.");
											}
											
									}).catch((err) => {
										console.log("Error in checking previous disbursement date", err)
										Message("error", "Error in checking previous disbursement date");
									})
			}
			catch(err){
				console.log("Error in checking previous disbursement date", err)
				Message("error", "Error in checking previous disbursement date")
			}
		
	}

	// const cancel = (e) => {
	// 	console.log(e)
	// 	// message.error('Click on No');
	// }
		const checkPreviousDisbursement = (date) => {
			try{	
					// formik.setFieldValue("has_un_approve_trxn", false);
					const payload = {
						branch_code:userDetails?.brn_code,
						transaction_date: date,
					}
						axios.post(`${url}/admin/fetch_unapprove_dtls_before_trns_dt`, payload).then((res) => {
											// console.log(res);
											if(res?.data?.suc === 1){
												if(res?.data?.msg?.length > 0){
													const hasNonZero = res?.data?.msg.some(item =>Object.values(item).some(value => value != 0));
													console.log(hasNonZero, "hasNonZero");
													formik.setFieldValue("has_un_approve_trxn", hasNonZero);
													if(hasNonZero){
														Message("error", <>
																<ul class="list-disc">
																	{res?.data?.msg[0]?.transactions > 0 && <li>There are unapproved transactions before this date. Please check and try again.</li>}
																	{res?.data?.msg[0]?.group_migrate > 0 && <li>There are unapproved group migrate transactions before this date. Please check and try again.</li>}
																	{res?.data?.msg[0]?.member_migrate > 0 && <li>There are unapproved member migrate transactions before this date. Please check and try again.</li>}
																</ul>
														</>);
													}
												}
											}
											else{
													Message("error", "Something went wrong while checking previous disbursement date. Please try again.");
											}
											
									}).catch((err) => {
										console.log("Error in checking previous disbursement date", err)
										Message("error", "Error in checking previous disbursement date");
									})
			}
			catch(err){
				console.log("Error in checking previous disbursement date", err)
				Message("error", "Error in checking previous disbursement date")
			}
		}

	return (
		<>
			<section className="dark:bg-[#001529] flex justify-center align-middle p-5">
				<div className=" p-5 w-4/5 min-h-screen rounded-3xl">
					<div className="w-auto mx-14 my-4">
						<FormHeader
							text={`${
								params?.id == 0 ? "Transfer Group" : "View Group Transfer"
							}`}
							mode={2}
						/>
					</div>
					<Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-blue-800 dark:text-gray-400"
						spinning={loading}
					>
						{/* <main className="px-4 pb-5 bg-slate-50 rounded-lg shadow-lg h-auto my-10 mx-32"> */}
						<div className="card bg-white border-2 p-5 mx-16 shadow-lg rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
							{/* <div className="flex flex-row gap-3 mt-0  py-3 rounded-xl">
						<div className="text-3xl text-slate-700 font-bold">
							Transfer CO
						</div>
					</div> */}
							<form onSubmit={formik.handleSubmit}>
								{/* <div className="flex justify-start gap-5"> */}

								<div className="grid grid-cols-3 gap-5 mt-5">
									{params?.id > 0 && (
										<>
											<div>
												<TDInputTemplateBr
													// placeholder="From CO"
													type="text"
													label="Created By "
													formControlName={formValues.created_by}
													value={formValues.created_by}
													disabled={true}
													mode={1}
												/>
											</div>

											<div>
												<TDInputTemplateBr
													type="text"
													label="Created Date & Time"
													// formControlName={formValues.created_at ? new Date(formValues.created_at).toLocaleDateString("en-GB") : ""}
													// value={formValues.created_at ? new Date(formValues.created_at).toLocaleDateString("en-GB") : ""}
													formControlName={
														formValues.approved_at
															? new Date(formValues.created_at).toLocaleString(
																	"en-GB",
																	{
																		day: "2-digit",
																		month: "2-digit",
																		year: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																		hour12: false, // Use 24-hour format
																	}
															  )
															: ""
													}
													value={
														formValues.approved_at
															? new Date(formValues.created_at).toLocaleString(
																	"en-GB",
																	{
																		day: "2-digit",
																		month: "2-digit",
																		year: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																		hour12: false, // Use 24-hour format
																	}
															  )
															: ""
													}
													disabled={true}
													mode={1}
												/>
											</div>

											<div>
												<TDInputTemplateBr
													// placeholder="From CO"
													type="text"
													label="Approved By "
													formControlName={formValues.approved_by}
													value={formValues.approved_by}
													disabled={true}
													mode={1}
												/>
											</div>

											<div>
												<TDInputTemplateBr
													type="text"
													label="Approved Date & Time"
													formControlName={
														formValues.approved_at
															? new Date(formValues.approved_at).toLocaleString(
																	"en-GB",
																	{
																		day: "2-digit",
																		month: "2-digit",
																		year: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																		hour12: false, // Use 24-hour format
																	}
															  )
															: ""
													}
													value={
														formValues.approved_at
															? new Date(formValues.approved_at).toLocaleString(
																	"en-GB",
																	{
																		day: "2-digit",
																		month: "2-digit",
																		year: "numeric",
																		hour: "2-digit",
																		minute: "2-digit",
																		second: "2-digit",
																		hour12: false, // Use 24-hour format
																	}
															  )
															: ""
													}
													disabled={true}
													mode={1}
												/>
											</div>
										</>
									)}
								</div>
								<div className="grid grid-cols-3 gap-5 mt-5">
									<div>
										{/* <TDInputTemplateBr
										placeholder="Search Name Code or Group"
                    label="Group Code With Name"
										type="text"
										name="Grp_wit_Co"
										formControlName={COPickup}
										handleChange={(e) => {
											setCOPickup(e.target.value)
											formik.handleChange(e)
											console.log(e.target.value,'VVVVVVVVVVVVVVVVVVVVVVVV')
										}}
										handleBlur={formik.handleBlur}
										handleChange={formik.handleChange}
										data={get_CO__?.map((item, i) => ({
											code: item?.branch_code + "," + item?.group_code,
											name: item?.group_name + ' ('+item?.group_code+')',
										}))}
										mode={2}
										disabled={params.id > 0 ? true : false}
									/> */}

										{params?.id < 1 && (
											<>
												<label
													for="frm_co"
													className="block mb-2 text-sm capitalize font-bold text-slate-800
				 dark:text-gray-100"
												>
													Search Group Name or Code
												</label>
												<Select
													showSearch
													placeholder={
														formValues.Grp_wit_Co
															? formValues.Grp_wit_Co
															: "Search Name Code or Group"
													}
													label="Group Code With Name"
													name="Grp_wit_Co"
													filterOption={false} // Disable default filtering to use API search
													onSearch={handleFetch_CO} // Call API on typing
													notFoundContent={
														loading ? <Spin size="small" /> : "No results found"
													}
													formControlName={COPickup}
													// formControlName={formValues.Grp_wit_Co ? formValues.Grp_wit_Co : COPickup}
													//   handleChange={(e) => {
													// 	// setCOPickup(e.target.value)
													// 	// formik.handleChange(e)
													// 	console.log(e.target.value,'valuevaluevaluevaluevalue')
													// }}
													// value={formValues.Grp_wit_Co ? formValues.Grp_wit_Co : COPickup} // Controlled value
													onChange={(value) => {
														setCOPickup(value)
														formik.setFieldValue("Grp_wit_Co", value)
													}}
													options={options__Group}
													//   style={{ width: 250 }}
													mode={2}
													// disabled={location?.state.approval_status == "A" ? true : false} //location?.state.approval_status == null ? '': location?.state.approval_status
												/>
											</>
										)}

										{params?.id > 0 && (
											<TDInputTemplateBr
												// placeholder="From CO"
												type="text"
												label="Search Group Name or Code"
												name="Grp_wit_Co"
												handleChange={formik.handleChange}
												handleBlur={formik.handleBlur}
												value={formValues.Grp_wit_Co}
												// formControlName={formik.values.frm_co}
												formControlName={formik.values.Grp_wit_Co}
												disabled={true}
												mode={1}
											/>
										)}

										{formik.errors.Grp_wit_Co && formik.touched.Grp_wit_Co ? (
											<VError title={formik.errors.Grp_wit_Co} />
										) : null}
									</div>

									<div>
										<TDInputTemplateBr
											placeholder="From CO"
											type="text"
											label="From CO"
											name="frm_co"
											handleChange={formik.handleChange}
											handleBlur={formik.handleBlur}
											// formControlName={formik.values.frm_co}
											formControlName={
												COAndBranch.length > 0
													? COAndBranch[0].co_name
													: formik.values.frm_co
											}
											disabled={true}
											mode={1}
										/>
										{formik.errors.frm_co && formik.touched.frm_co ? (
											<VError title={formik.errors.frm_co} />
										) : null}
									</div>

									<div>
										{/* {COAndBranch[0]?.co_brn_name} */}
										<TDInputTemplateBr
											placeholder="From Branch"
											type="text"
											label="From Branch"
											name="frm_branch"
											handleChange={formik.handleChange}
											handleBlur={formik.handleBlur}
											// formControlName={formik.values.frm_branch}
											formControlName={
												COAndBranch.length > 0
													? COAndBranch[0].grp_brn_name
													: formik.values.frm_branch
											}
											mode={1}
											// disabled={params.id > 0 ? true : false}
											disabled={true}
										/>
										{formik.errors.frm_branch && formik.touched.frm_branch ? (
											<VError title={formik.errors.frm_branch} />
										) : null}
									</div>
									{/* {JSON.stringify(COAndBranch, 2)} */}
									<div>
										{params?.id < 1 && (
											<>
												<label
													for="frm_co"
													className="block mb-2 text-sm capitalize font-bold text-slate-800
				 dark:text-gray-100"
												>
													To Branch
												</label>

												<Select
													showSearch
													placeholder="Search Branch Name Or Code"
													//   label="Branch  With Name"
													name="to_branch"
													filterOption={false} // Disable default filtering to use API search
													onSearch={handleFetch_Branch} // Call API on typing
													notFoundContent={
														loading ? <Spin size="small" /> : "No results found"
													}
													formControlName={ToBranchName}
													// value={formValues.to_branch ? formValues.to_branch : ToBranchName}
													onChange={(value) => {
														setToBranchName(value)
														console.log(value, "jjjj")

														formik.setFieldValue("to_branch", value)
													}}
													options={options__Branch}
													//   style={{ width: 250 }}
													mode={2}
													// disabled={location?.state.approval_status == "A" ? true : false}
													disabled={false}
												/>
											</>
										)}

										{/* {JSON.stringify(ToBranchName, 2)}  jjj {JSON.stringify(COAndBranch, 2)} */}
										{params?.id > 0 && (
											<TDInputTemplateBr
												placeholder="To Branch"
												type="text"
												label="To Branch"
												name="to_branch"
												handleChange={formik.handleChange}
												handleBlur={formik.handleBlur}
												// formControlName={formik.values.frm_branch}
												formControlName={formik.values.to_branch}
												value={formValues.to_branch}
												mode={1}
												// disabled={params.id > 0 ? true : false}
												disabled={true}
											/>
										)}

										{formik.errors.to_branch && formik.touched.to_branch ? (
											<VError title={formik.errors.to_branch} />
										) : null}
										{/* {JSON.stringify(ToBranchName, 2)}  // 
// {JSON.stringify(formik.values.to_branch, 2)} */}
									</div>

									<div>
										{/* disabled={location?.state.approval_status == "A" ? true : false} */}
										{params?.id < 1 && (
											<TDInputTemplateBr
												placeholder="Select CO"
												label="To CO"
												name="to_co"
												// formControlName={CEOData} // Default to SHG
												// formControlName={formik.values.to_co}
												// formControlName={To_COData?.length > 0 ? To_COData[0]?.to_co_name : formik.values.to_co}
												// formControlName={To_COData[0]?.to_co_name}
												formControlName={formik.values.to_co}
												// handleChange={formik.handleChange}
												// value={formik.values.to_co || ""} // Controlled value
												// value={formValues.to_co ? formValues.to_co : To_COData[0]?.to_co_name}
												handleChange={(e) => {
													setCEOData(e.target.value)
													formik.handleChange(e)
													console.log(
														e.target.value,
														"VVVVVVVVVVVVVVVVVVVVVVVV"
													)
												}}
												// handleBlur={formik.handleBlur}
												data={
													To_COData && To_COData.length > 0
														? To_COData.map((item) => ({
																code: item?.to_co_id,
																name: item?.to_co_name,
														  }))
														: [{ code: "", name: "No Data Available" }] // Fallback option
												}
												mode={2}
											/>
										)}

										{params?.id > 0 && (
											<TDInputTemplateBr
												// placeholder="To CO"
												type="text"
												label="To CO"
												name="to_co"
												handleChange={formik.handleChange}
												handleBlur={formik.handleBlur}
												// formControlName={formik.values.frm_branch}
												formControlName={formik.values.to_co}
												value={formValues.to_co}
												mode={1}
												// disabled={params.id > 0 ? true : false}
												disabled={true}
											/>
										)}

										{formik.errors.to_co && formik.touched.to_co ? (
											<VError title={formik.errors.to_co} />
										) : null}
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Transaction Date"
											type="date"
											name="trxn_date"
											label="Transaction Date"
											handleChange={formik.handleChange}
											handleBlur={(e) =>{
												formik.handleBlur(e);
												if(e.target.value) {
													// formik.setFieldValue('trxn_date', e.target.value);
													checkPreviousDisbursement(e.target.value);
												}
												else{
													formik.setFieldValue('has_un_approve_trxn', false);
												}
											}}
											formControlName={formik.values.trxn_date}
											value={formValues.trxn_date}
											mode={1}
												
											// disabled={params.id > 0 ? true : false}
										/>
										{/* <div> */}
											{formik.errors.trxn_date && formik.touched.trxn_date ? (
												<VError title={formik.errors.trxn_date} />
											) : null}
										{/* </div> */}
									</div>
									<div className="sm:col-span-3">
										<TDInputTemplateBr
											placeholder="Remarks..."
											type="text"
											label={`Remarks`}
											name="remarks_"
											formControlName={formik.values.remarks_}
											handleChange={formik.handleChange}
											handleBlur={formik.handleBlur}
											mode={3}
											disabled={params.id > 0 ? true : false}
										/>
										{formik.errors.remarks_ && formik.touched.remarks_ ? (
											<VError title={formik.errors.remarks_} />
										) : null}
									</div>
								</div>

								{/* </div> */}

								{/* {params.id > 0 && (
							<Divider
								type="vertical"
								style={{
									height: 650,
								}}
							/>
						)} */}

								{/* {JSON.stringify(MemberList, 2)} kkkkkkkkkkk
{JSON.stringify(MemberListView, 2)} */}

								{MemberList.length > 0 && (
									<div className="sm:col-span-2 mt-5">
										<div>
											<label
												className="block mb-2 text-sm capitalize font-bold text-slate-800
					dark:text-gray-100"
											>
												{" "}
												Member List
												{/* <span style={{color:'red'}} className="ant-tag ml-2 ant-tag-error ant-tag-borderless text-[12.6px] my-2">
					(You can Select Maxmimum 4 Member)</span> */}
											</label>

											<Toast ref={toast} />

											<DataTable
												value={MemberList?.map((item, i) => [
													{ ...item, id: i },
												]).flat()}
												// expandedRows={expandedRows}
												// onRowToggle={(e) => setExpandedRows(e.data)}
												// onRowExpand={onRowExpand}
												// onRowCollapse={onRowCollapse}
												selectionMode="checkbox"
												// selection={COMemList_select}
												// onSelectionChange={(e) => setSelectedProducts(e.value)}
												// onSelectionChange={(e) => handleSelectionChange(e)}
												tableStyle={{ minWidth: "50rem" }}
												// rowExpansionTemplate={rowExpansionTemplate}
												dataKey="id"
												// paginator
												// rows={rowsPerPage}
												// first={currentPage}
												// onPage={onPageChange}
												// rowsPerPageOptions={[5, 10, 20]} // Add options for number of rows per page
												tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
											>
												<Column
													header="Sl No."
													body={(rowData) => (
														<span style={{ fontWeight: "bold" }}>
															{rowData?.id + 1}
														</span>
													)}
												></Column>

												<Column
													field="member_code"
													header="Member Code"
												></Column>

												<Column
													field="client_name"
													header="Member Name"
												></Column>
												<Column
													field="outstanding"
													header="Outstanding"
												></Column>
											</DataTable>
										</div>
									</div>
								)}

								{MemberListView?.length > 0 && (
									<div className="sm:col-span-2 mt-5">
										<div>
											<label
												className="block mb-2 text-sm capitalize font-bold text-slate-800
					dark:text-gray-100"
											>
												{" "}
												Member List
												{/* <span style={{color:'red'}} className="ant-tag ml-2 ant-tag-error ant-tag-borderless text-[12.6px] my-2">
					(You can Select Maxmimum 4 Member)</span> */}
											</label>

											<Toast ref={toast} />

											<DataTable
												value={MemberListView?.map((item, i) => [
													{ ...item, id: i },
												]).flat()}
												// expandedRows={expandedRows}
												// onRowToggle={(e) => setExpandedRows(e.data)}
												// onRowExpand={onRowExpand}
												// onRowCollapse={onRowCollapse}
												selectionMode="checkbox"
												// selection={COMemList_select}
												// onSelectionChange={(e) => setSelectedProducts(e.value)}
												onSelectionChange={(e) => handleSelectionChange(e)}
												tableStyle={{ minWidth: "50rem" }}
												// rowExpansionTemplate={rowExpansionTemplate}
												dataKey="id"
												// paginator
												// rows={rowsPerPage}
												// first={currentPage}
												// onPage={onPageChange}
												// rowsPerPageOptions={[5, 10, 20]} // Add options for number of rows per page
												tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
											>
												<Column
													header="Sl No."
													body={(rowData) => (
														<span style={{ fontWeight: "bold" }}>
															{rowData?.id + 1}
														</span>
													)}
												></Column>

												<Column
													field="member_code"
													header="Member Code"
												></Column>

												<Column
													field="client_name"
													header="Member Name"
												></Column>
												<Column
													field="outstanding"
													header="Outstanding"
												></Column>
											</DataTable>
										</div>
									</div>
								)}

								{/* {params?.id > 0 && () */}
								{params?.id < 1 && ( //previously 3
									<div className="mt-10">
										<BtnComp
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
											// param={params?.id}
										/>
									</div>
								)}
							</form>
							{/* </main> */}
						</div>
					</Spin>
				</div>
			</section>

			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					editGroup()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>

			{/* <DialogBox
				flag={4}
				onPress={() => setVisible2(!visible2)}
				visible={visible2}
				onPressYes={() => {
					// editGroup()
					setVisible2(!visible2)
				}}
				onPressNo={() => setVisible2(!visible2)}
			/> */}
		</>
	)
}

export default TranceferCO

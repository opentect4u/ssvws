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
// const members = [
// 	{ client_name: "Soumyadeep Mondal", form_no: 2025000154, member_code: 1202880324 },
// 	{ client_name: "Soumyadeep Mondal hhh", form_no: 202458800014, member_code: 120777280324 },
// 	{ client_name: "Soumyadeep Mondaluuu", form_no: 2025700014, member_code: 1207280324 },
// 	{ client_name: "Soumyadeep Mondalttt", form_no: 202500014, member_code: 1270280324 },
// 	{ client_name: "Soumyadeep Mondalrr", form_no: 2027500014, member_code: 1202780324 },
// 	// { form_no: 202500015, member_code: 120280325, client_name: "Somnath Thakur" },
// 	// { form_no: 202500016, member_code: 120280326, client_name: "Subham Samanta" },
// 	// { form_no: 202500017, member_code: 120280327, client_name: "Suvrajit Banerjee" },
// 	// { form_no: 202500019, member_code: 120280329, client_name: "Tanmoy" },
// 	// { form_no: 202500021, member_code: 120280331, client_name: "Tanmoy" },
// 	// { form_no: 202500022, member_code: 120280332, client_name: "Utsab" },
// 	// { form_no: 202500023, member_code: 120280333, client_name: "Lokesh" },
// 	// { form_no: 202500024, member_code: 120280334, client_name: "Sayantika" },
//   ];

function GroupExtendedForm({ groupDataArr }) {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const { loanAppData } = location.state || {}
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const [groupData, setGroupData] = useState(() => [])

	const [branches, setBranches] = useState(() => [])
	const [branch, setBranch] = useState(() => "")

	const [CEOData_s, setCEOData_s] = useState(() => [])
	const [CEOData, setCEOData] = useState(() => [])

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

	const [flag, setFlag] = useState(4)

	const [group_code, setGroupCode] = useState(0)

	const [blocks, setBlocks] = useState(() => [])
	const [block, setBlock] = useState("")

	const [groupDetails, setGroupDetails] = useState(() => [])
	const [memberDetails, setMemberDetails] = useState(() => [])
	const [visible, setVisible] = useState(() => false)
	const [remarksForDelete, setRemarksForDelete] = useState(() => "")

	var groupMemberRequirList = 4

	// const [checkedValues, setCheckedValues] = useState([]);

	// console.log(COMemList_select , "paramsssssssssssssss")
	console.log(location, "location")

	const initialValues = {
		g_group_name: "",
		g_group_type: "J",

		g_branch: "",
		g_ceo: "",
		g_block: "",

		g_address: "",
		g_pin: "",
		// g_group_block: "",
		g_phone1: "",
		g_phone2: "",
		g_email: "",
		g_bank_name: "",
		g_bank_branch: "",
		g_ifsc: "",
		g_micr: "",
		g_acc1: "",
		g_acc2: "",
	}
	const [formValues, setValues] = useState(initialValues)

	const validationSchema = Yup.object({
		g_group_name: Yup.string().required("Group name is required"),
		g_group_type: Yup.string().required("Group type is required"),

		g_branch:
			params?.id > 0
				? Yup.string()
				: Yup.string().required("Branch is required"),
		g_ceo:
			params?.id > 0 ? Yup.string() : Yup.string().required("CO is required"),
		g_block:
			params?.id > 0
				? Yup.string()
				: Yup.string().required("Block is required"),

		g_address: Yup.string().required("Group address is required"),
		g_pin: Yup.string().required("PIN No. is required"),
		// g_group_block: Yup.string().required("Group block is required"),
		g_phone1: Yup.string().required("Phone 1 is required"),
		// g_phone2: Yup.string(),
		// g_email: Yup.string(),
		// g_bank_name:  Yup.string().required("Bank is required"),
		// g_bank_branch: Yup.string(),
		// g_ifsc: Yup.string(),
		// g_micr: Yup.string(),
		// g_acc1: Yup.string(),
		// g_acc2: Yup.string().optional(),
	})

	const fetchGroupDetails = async () => {
		const creds = {
			group_code: params?.id,
			branch_code: userDetails?.brn_code,
		}
		await axios
			.post(`${url}/admin/fetch_search_group_web`, creds)
			.then((res) => {
				console.log("fetch_search_group_web", res?.data?.msg[0].brn_name)
				setValues({
					g_group_name: res?.data?.msg[0]?.group_name,
					g_group_type: res?.data?.msg[0]?.group_type,
					g_address: res?.data?.msg[0]?.grp_addr,
					g_pin: res?.data?.msg[0]?.pin_no,
					g_group_block: res?.data?.msg[0]?.block,
					g_phone1: res?.data?.msg[0]?.phone1,
					g_phone2: res?.data?.msg[0]?.phone2,
					g_email: res?.data?.msg[0]?.email_id,
					g_bank_name: res?.data?.msg[0]?.bank_name,
					g_bank_branch: res?.data?.msg[0]?.branch_name,
					g_ifsc: res?.data?.msg[0]?.ifsc,
					g_micr: res?.data?.msg[0]?.micr,
					g_acc1: res?.data?.msg[0]?.acc_no1?.toString(),
					g_acc2: res?.data?.msg[0]?.acc_no2?.toString(),
					brn_name: res?.data?.msg[0]?.brn_name,
				})
				setGroupData(res?.data?.msg)
				setBranch(
					res?.data?.msg[0]?.disctrict + "," + res?.data?.msg[0]?.branch_code
				)
				setCEOData(res?.data?.msg[0]?.co_id)
				setBlock(res?.data?.msg[0]?.block)
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching group form")
			})
	}

	useEffect(() => {
		if (params?.id > 0) {
			fetchGroupDetails()
		}
	}, [])

	const handleFetchBranches = async () => {
		setLoading(true)
		await axios
			.get(`${url}/admin/branch_name_mis?branch_code=${userDetails?.brn_code}`)
			.then((res) => {
				console.log(userDetails?.brn_code, "QQQQQQQQQQQQQQQQ", res?.data)
				setBranches(res?.data?.msg)
			})
			.catch((err) => {
				console.log("?????????????????????", err)
			})

		setLoading(false)
	}

	const handleFetchCEO = async () => {
		setLoading(true)
		const creds_CEO = {
			brn_code: userDetails?.brn_code,
		}
		await axios
			// .post(`${url}/fetch_co_brnwise=${userDetails?.brn_code}`)
			.post(`${url}/fetch_co_brnwise`, creds_CEO)
			.then((res) => {
				// console.log("QQQQQrrrrQQQQQQQQQQQ", res?.data?.msg)
				setCEOData_s(res?.data?.msg)
			})
			.catch((err) => {
				console.log("?????????????????????", err)
			})

		setLoading(false)
	}

	const handleFetchMemberDetailsCowise = async () => {
		setLoading(true)
		const creds_MemberListCo = {
			branch_code: userDetails?.brn_code,
			// co_id: userDetails?.emp_id
			co_id: CEOData,
			// co_id: 10157
		}
		await axios
			.post(`${url}/fetch_member_dtls_cowise`, creds_MemberListCo)
			.then((res) => {
				console.log(creds_MemberListCo, "QQQQQrrrrQQQQQQQQQQQ", res?.data?.msg)
				setCOMemList_s(res?.data?.msg)
			})
			.catch((err) => {
				console.log("?????????????????????", err)
			})

		setLoading(false)
	}

	// userDetails?.emp_id

	useEffect(() => {
		handleFetchMemberDetailsCowise()
	}, [CEOData])

	useEffect(() => {
		// const loanAppData = [{
		// 	"transaction_date": "2025-02-05T18:30:00.000Z",
		// 	"debit_amt": 10000,
		// 	"group_code": 12027176,
		// 	"created_code": "10228",
		// 	"status": "U",
		// 	"branch_code": 120,
		// 	"purpose": 10002,
		// 	"scheme_id": 10011,
		// 	"fund_id": 10009,
		// 	"period": 12,
		// 	"period_mode": "Monthly",
		// 	"curr_roi": 13.6,
		// 	"group_name": "test_thursday",
		// 	"created_by": "BABAI DAS",
		// 	"purpose_id": "Agriculture",
		// 	"scheme_name": "UB Loan (48 Week @13.60%)"
		//   }]
		// setLoanAppData(loanAppData)
	}, [])

	const handleSelectionChange = (e) => {
		if (e.value.length <= groupMemberRequirList) {
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
			console.log(output, "outputoutputoutputoutputoutput")
		}
	}

	const handleSelectionChange_approve = (e) => {
		if (
			e.value.length <=
			groupMemberRequirList - groupData[0]?.memb_dt.length
		) {
			setCOMemList_select(e.value)
			function transformData(inputArray) {
				return inputArray.map(({ form_no, member_code }) => ({
					form_no,
					member_code,
				}))
			}
			const output = transformData(e.value)
			setCOMemList_Store(output)
			console.log(output, "outputoutputoutputoutputoutput")
		}
	}

	const onPageChange = (event) => {
		setCurrentPage(event.first)
		setRowsPerPage(event.rows)
	}

	useEffect(() => {
		handleFetchCEO()
		handleFetchBranches()
	}, [])

	const handleFetchBlocks = async (brn) => {
		setLoading(true)
		await axios
			.get(`${url}/get_block?dist_id=${brn.split(',')[0]}`)
			.then((res) => {
				// console.log("******************", res?.data)
				setBlocks(res?.data?.msg)
			})
			.catch((err) => {
				console.log("!!!!!!!!!!!!!!!!", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		console.log(branch);
		if(branch){
			handleFetchBlocks(branch)
		}
	}, [branch])

	const onSubmit = async (values) => {
		console.log(COMemList_Store, "COMemList_Store", COMemList_s.length)
		console.log(
			COMemList_Store.length,
			groupMemberRequirList - groupData[0]?.memb_dt.length
		)
		// var groupMemberExistList = groupData[0]?.memb_dt.length;
		// var restOfList = groupMemberRequirList - groupData[0]?.memb_dt.length
		// console.log(restOfList, "groupMember")

		if (params?.id < 1 && COMemList_s.length) {
			if (COMemList_Store.length < 1) {
				Message("error", "Please Assign Group Member")
			}

			if (COMemList_Store.length > groupMemberRequirList) {
				Message("error", "Please Assign Group Member Maxmimum 4")
			}

			if (COMemList_Store.length > 0) {
				setLoading(true)
				setFlag(4)
				setVisible(true)

				setLoading(false)
			}
		}

		if (params?.id < 1 && COMemList_s.length === 0) {
			setLoading(true)
			setFlag(4)
			setVisible(true)

			setLoading(false)
		}

		if (params?.id > 0 && COMemList_s.length) {
			// if(COMemList_Store.length < 1){
			// 	Message("error", "Please Assign Group Member")
			// }

			if (COMemList_Store.length > 4) {
				Message("error", "Please Assign Group Member Maxmimum 4")
			}

			if (
				COMemList_Store.length <=
				groupMemberRequirList - groupData[0]?.memb_dt.length
			) {
				setLoading(true)
				setFlag(4)
				setVisible(true)

				setLoading(false)
			}

			// console.log(values, "VVVVVVVVVVVVVVVVVVVVVVVV", 'hhhh')
			// setLoading(true)
			// setVisible(true)
			// setLoading(false)
		}

		if (params?.id > 0 && COMemList_s.length === 0) {
			setLoading(true)
			setFlag(4)
			setVisible(true)

			setLoading(false)
		}
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

	const editGroup = async () => {
		if (params?.id < 1) {
			setLoading(true)
			console.log(
				formik.values.g_bank_branch,
				formik.values.g_bank_name,
				formik.values.g_acc1,
				formik.values.g_acc2
			)

			const creds = {
				branch_code: branch?.split(",")[1],
				prov_grp_code: COMemList_Store,
			}
			// console.log("verify_four_mem_assign_grp", creds)

			await axios
				.post(`${url}/admin/verify_four_mem_assign_grp`, creds)
				.then((res) => {
					setLoading(false)

					// Message("success", "Updated successfully.")
					saveGroupData()
				})
				.catch((err) => {
					setLoading(false)

					Message("error", "Please Assign Group Member Maxmimum 4")
					console.log("LLLLLLLLLLLLLLLLLLLLLLLL", err)
				})
		}

		if (params?.id > 0) {
			setLoading(true)
			saveGroupData()
		}

		// }
		// else{
		// setLoading(false)

		// Message("warning","Please fill up all bank related data!")
		// }
	}

	const saveGroupData = async () => {
		const creds = {
			branch_code: branch?.split(",")[1],
			group_name: formik.values.g_group_name,
			group_type: initialValues.g_group_type,
			phone1: formik.values.g_phone1,
			phone2: formik.values.g_phone2,
			email_id: formik.values.g_email,
			grp_addr: formik.values.g_address,
			pin_no: formik.values.g_pin,
			bank_name: formik.values.g_bank_name,
			branch_name: formik.values.g_bank_branch,
			ifsc: formik.values.g_ifsc,
			micr: formik.values.g_micr,
			acc_no1: formik.values.g_acc1?.toString(),
			acc_no2: formik.values.g_acc2?.toString(),
			modified_by: userDetails?.emp_id,
			group_code: params?.id,
			district: branch?.split(",")[0],
			block: block,
			co_id: CEOData,
			grp_memberdtls: COMemList_Store,
		}

		await axios
			.post(`${url}/admin/edit_group_web`, creds)
			.then((res) => {
				setLoading(false)

				Message("success", "Updated successfully.")
				console.log("IIIIIIIIIIIIIIIIIIIIIII", res?.data)
				if (params.id == 0) {
					setFlag(5)
					setGroupCode(res?.data?.group_code)
					setVisible(true)
				}
				// if(params?.id < 1){
				// navigate(`/homebm/searchgroup/`)
				// }

				// if(params?.id > 0){
				// 	navigate(`/homebm/searchgroup/`)
				// 	}
			})
			.catch((err) => {
				setLoading(false)

				Message("error", "Some error occurred while updating.")
				console.log("LLLLLLLLLLLLLLLLLLLLLLLL", err)
			})
	}

	const removeMemberFromGroup = async (member) => {
		const creds = {
			remove_remarks: remarksForDelete,
			rejected_by: userDetails?.emp_id,
			branch_code: userDetails?.brn_code,
			form_no: member?.form_no,
			member_code: member?.member_code,
		}
		await axios
			.post(`${url}/admin/remove_member_from_group`, creds)
			.then((res) => {
				console.log("MEMBER DELETEDDDDDD APIII", res)
				Message("success", "")
			})
			.catch((err) => {
				console.log("**888***888***888", err)
			})
	}

	const confirm = async (itemToDelete) => {
		setLoading(true)
		if (remarksForDelete) {
			const updatedGroupData = groupData.map((group) => {
				return {
					...group,
					memb_dt: group.memb_dt.filter(
						(item) => item.member_code !== itemToDelete.member_code
					),
				}
			})

			setGroupData(updatedGroupData)
			await removeMemberFromGroup(itemToDelete)
			setRemarksForDelete(() => "")
		} else {
			Message("warning", "Please write remarks.")
		}
		setLoading(false)
	}

	const cancel = (e) => {
		console.log(e)
		// message.error('Click on No');
	}

	return (
		<>
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<form onSubmit={formik.handleSubmit}>
					<div className="flex justify-start gap-5">
						<div
							// className={
							// 	params.id > 0
							// 		? "grid gap-4 sm:grid-cols-2 sm:gap-6 w-1/2"
							// 		: "grid gap-4 sm:grid-cols-2 sm:gap-6 w-full"
							// }
							className={
								params.id > 0
									? "grid gap-4 sm:grid-cols-2 sm:gap-6 w-full"
									: "grid gap-4 sm:grid-cols-2 sm:gap-6 w-full"
							}
						>
							{params?.id > 0 && (
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
							)}
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
								/>
								{formik.errors.g_group_name && formik.touched.g_group_name ? (
									<VError title={formik.errors.g_group_name} />
								) : null}
							</div>

							<div>
								{/* <TDInputTemplateBr
									// placeholder="Group Type"
									type="text"
									label="Group Type"
									name="g_group_type"
									formControlName={formik.values.g_group_type}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										// {
										// 	code: "S",
										// 	name: "SHG",
										// },
										{
											code: "J",
											name: "JLG",
										},
									]}
									mode={2}
								/> */}

								<TDInputTemplateBr
									placeholder="Group Type"
									type="text"
									label="Group Type"
									name="g_group_type"
									formControlName={formik.values.g_group_type || "J"} // Default to SHG
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										// {
										//   code: "S",
										//   name: "SHG",
										// },
										{
											code: "J",
											name: "JLG",
										},
									]}
									mode={2}
									disabled={true}
								/>

								{formik.errors.g_group_type && formik.touched.g_group_type ? (
									<VError title={formik.errors.g_group_type} />
								) : null}
							</div>

							{/* {userDetails?.id === 3 && ( */}
							<>
								<div>
									{params.id > 0 && (
										<TDInputTemplateBr
											placeholder="Branch"
											type="text"
											label="Branch"
											// name="g_group_name"
											// handleChange={formik.handleChange}
											// handleBlur={formik.handleBlur}
											formControlName={formValues.brn_name}
											disabled={true}
											mode={1}
										/>
									)}

									{params.id < 1 && (
										<>
											<TDInputTemplateBr
												placeholder="Choose Branch"
												type="text"
												label="Branch"
												name="g_branch"
												// formControlName={branch}
												formControlName={branch}
												handleChange={(e) => {
													setBranch(e.target.value)
													formik.handleChange(e)
													console.log(
														e.target.value,
														"VVVVVVVVVVVVVVVVVVVVVVVV"
													)
												}}
												// handleBlur={formik.handleBlur}
												// handleChange={formik.handleChange}
												data={branches?.map((item, i) => ({
													code: item?.dist_code + "," + item?.branch_code,
													name: item?.branch_name,
												}))}
												mode={2}
												disabled={params.id > 0 ? true : false}
											/>
											{formik.errors.g_branch && formik.touched.g_branch ? (
												<VError title={formik.errors.g_branch} />
											) : null}
										</>
									)}

									{/* {JSON.stringify(branch, 2)} //// {JSON.stringify(formValues.brn_name, 2)}  */}
								</div>

								{params?.id < 1 && (
									<div>
										<TDInputTemplateBr
											placeholder="Choose CO"
											label="Choose CO"
											name="g_ceo"
											formControlName={CEOData} // Default to SHG
											// handleChange={formik.handleChange}
											handleChange={(e) => {
												setCEOData(e.target.value)
												formik.handleChange(e)
												console.log(e.target.value, "VVVVVVVVVVVVVVVVVVVVVVVV")
											}}
											// handleBlur={formik.handleBlur}
											data={CEOData_s?.map((item, i) => ({
												code: item?.emp_id,
												name: item?.emp_name,
											}))}
											mode={2}
										/>

										{formik.errors.g_ceo && formik.touched.g_ceo ? (
											<VError title={formik.errors.g_ceo} />
										) : null}
									</div>
								)}

								<div className={params.id > 0 ? "" : "sm:col-span-2"}>
									{/* <TDInputTemplateBr
										placeholder="Group Block"
										type="text"
										label="Group Block"
										name="g_block"
										formControlName={block}
										handleChange={(e) => {
											setBlock(e.target.value)
											formik.handleChange(e)
										}}
										data={blocks?.map((item, i) => ({
											code: item?.block_id,
											name: item?.block_name,
										}))}
										mode={2}
									/> */}
									<label
										htmlFor="g_block"
										className={`block mb-2 text-sm capitalize font-bold text-slate-800
										dark:text-gray-100`}
									>
										Group Block
									</label>
									<Select
										showSearch
										placeholder={"Choose Group Block"}
											filterOption={(input, option) =>
												(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
										}
										id="g_block"
										label="Group Block"
										name="g_block"
										notFoundContent={
											loading ? <Spin size="small" /> : "No results found"
										}
										// value={formik.values.g_block}
										value={block}
										onChange={(value) => {
											console.log(value)
											setBlock(value)
											formik.setFieldValue("g_block", value)
										}}
										options={blocks?.map((item, _) => ({
											value: item?.block_id,
											label: `${item?.block_name}`,
										}))}
									/>
									{formik.errors.g_block && formik.touched.g_block ? (
										<VError title={formik.errors.g_block} />
									) : null}
								</div>
							</>
							{/* )} */}

							<div className="sm:col-span-2">
								<TDInputTemplateBr
									placeholder="Type Address..."
									type="text"
									label={`Address`}
									name="g_address"
									formControlName={formik.values.g_address}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={3}
								/>
								{formik.errors.g_address && formik.touched.g_address ? (
									<VError title={formik.errors.g_address} />
								) : null}
							</div>

							<div>
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
							</div>

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
								/>
								{formik.errors.g_phone1 && formik.touched.g_phone1 ? (
									<VError title={formik.errors.g_phone1} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Mobile No. 2"
									type="number"
									label="Mobile No. 2"
									name="g_phone2"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={
										formik.values.g_phone2 == "0" ? "" : formik.values.g_phone2
									}
									mode={1}
								/>
								{formik.errors.g_phone2 && formik.touched.g_phone2 ? (
									<VError title={formik.errors.g_phone2} />
								) : null}
							</div>

							<div>
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
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Bank Name"
									type="text"
									label="Bank Name"
									name="g_bank_name"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={
										formik.values.g_bank_name == "null"
											? ""
											: formik.values.g_bank_name
									}
									mode={1}
								/>
								{/* {JSON.stringify(formik.values.g_bank_name, null, 2)} */}
								{formik.errors.g_bank_name && formik.touched.g_bank_name ? (
									<VError title={formik.errors.g_bank_name} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Bank Branch"
									type="text"
									label="Bank Branch"
									name="g_bank_branch"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={
										formik.values.g_bank_branch == "null"
											? ""
											: formik.values.g_bank_branch
									}
									mode={1}
								/>
								{formik.errors.g_bank_branch && formik.touched.g_bank_branch ? (
									<VError title={formik.errors.g_bank_branch} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="IFSC"
									type="text"
									label="IFSC Code"
									name="g_ifsc"
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									formControlName={
										formik.values.g_ifsc == "0" ? "" : formik.values.g_ifsc
									}
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
									formControlName={
										formik.values.g_micr == "0" ? "" : formik.values.g_micr
									}
									mode={1}
								/>
								{formik.errors.g_micr && formik.touched.g_micr ? (
									<VError title={formik.errors.g_micr} />
								) : null}
							</div>

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
								/>
								{formik.errors.g_acc1 && formik.touched.g_acc1 ? (
									<VError title={formik.errors.g_acc1} />
								) : null}
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
								/>
								{formik.errors.g_acc2 && formik.touched.g_acc2 ? (
									<VError title={formik.errors.g_acc2} />
								) : null}
							</div>
						</div>
					</div>

					{/* {params.id > 0 && (
							<Divider
								type="vertical"
								style={{
									height: 650,
								}}
							/>
						)} */}
					{params?.id > 0 && (
						<>
							{/* // <div className="w-1/2 gap-3 space-x-7"> */}
							<div className="sm:col-span-2 mt-5">
								<div>
									<Tag color="#DA4167" className="text-white mb-2 font-bold">
										Assign Group Member
									</Tag>

									{/* {console.log("+++++++++++++++++++++++++++++", memberDetails)} */}

									<div className="relative overflow-x-auto">
										<table className="w-full text-sm shadow-lg text-left rtl:text-right text-gray-500 dark:text-gray-400">
											<thead className="text-xs text-white uppercase bg-slate-800 dark:text-gray-400">
												<tr>
													<th scope="col" className="px-6 py-3">
														Name
													</th>

													<th scope="col" className="px-6 py-3">
														{/* Price */}
													</th>
													<th scope="col" className="px-6 py-3">
														{/* Price */}
													</th>
												</tr>
											</thead>
											<tbody>
												{groupData[0]?.memb_dt?.map((item, i) => (
													<tr
														// onClick={
														// 	userDetails?.id == 2
														// 		? () =>
														// 				navigate(
														// 					`/homebm/editgrtform/${item?.form_no}`,
														// 					{
														// 						state: item,
														// 					}
														// 				)
														// 		: () =>
														// 				navigate(
														// 					`/homeco/editgrtform/${item?.form_no}`,
														// 					{
														// 						state: item,
														// 					}
														// 				)
														// }
														className="bg-white hover:bg-slate-100 ease-linear transition-all cursor-pointer dark:bg-gray-800 border-b-slate-200 border-2"
													>
														<th
															scope="row"
															className="px-6 py-3 font-bold whitespace-nowrap dark:text-white text-slate-800"
														>
															{item.client_name}
														</th>
														<td
															className={`px-6 py-3 ${
																item?.approval_status === "U" ||
																(userDetails?.id == 3 &&
																	item?.approval_status === "S")
																	? "bg-teal-50"
																	: "bg-yellow-50"
															}  text-center`}
															onClick={
																userDetails?.id == 2
																	? () =>
																			navigate(
																				`/homebm/editgrtform/${item?.form_no}`,
																				{
																					state: item,
																				}
																			)
																	: () =>
																			navigate(
																				`/homeco/editgrtform/${item?.form_no}`,
																				{
																					state: item,
																				}
																			)
															}
														>
															{item?.approval_status === "U" ||
															(userDetails?.id == 3 &&
																item?.approval_status === "S") ? (
																<InfoOutlined className="text-teal-500" />
															) : (
																<InfoOutlined className="text-yellow-400" />
															)}
														</td>
														<td
															className={`px-6 py-4 font-bold ${
																item?.tot_outstanding > 0
																	? "bg-slate-50"
																	: "bg-red-50"
															} text-center`}
															// onClick={() => {
															// 	// setVisible2(!visible2)
															// 	console.log(
															// 		`---- MEMBER ${item?.client_name} DELETE CLICK ----`
															// 	)
															// 	console.log(`----XX----`, groupData[0]?.memb_dt)
															// }}
														>
															{/* <DeleteOutline className="text-red-500 text-2xl" /> */}
															{/* `Are you sure to delete member ${item?.client_name} from this group?` */}
															<Popconfirm
																title={`Delete Member ${item?.client_name}`}
																description={
																	<>
																		<div>
																			Are you sure to delete member{" "}
																			{item?.client_name} from this group?
																		</div>
																		<TDInputTemplateBr
																			placeholder="Type Remarks for delete..."
																			type="text"
																			label="Reason for Delete*"
																			name="remarksForDelete"
																			formControlName={remarksForDelete}
																			handleChange={(e) =>
																				setRemarksForDelete(e.target.value)
																			}
																			mode={3}
																		/>
																	</>
																}
																onConfirm={() => confirm(item)}
																onCancel={cancel}
																okText="Delete"
																cancelText="No"
																disabled={item?.tot_outstanding > 0}
															>
																<DeleteOutline
																	className={`${
																		item?.tot_outstanding > 0
																			? "text-slate-400"
																			: "text-red-500"
																	} text-2xl`}
																/>
															</Popconfirm>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>

							{/* groupData[0]?.memb_dt */}
							{/* {JSON.stringify(groupData[0]?.memb_dt.length, null, 2)} pppppppppppp {groupMemberRequirList - groupData[0]?.memb_dt.length}
							yyyyyyyyyy {JSON.stringify(COMemList_s, null, 2)} */}

							{COMemList_s.length > 0 && (
								<div className="sm:col-span-2 mt-5">
									<div>
										<label
											className="block mb-2 text-sm capitalize font-bold text-slate-800
							dark:text-gray-100"
										>
											{" "}
											Assign Group Member
											<span
												style={{ color: "red" }}
												className="ant-tag ml-2 ant-tag-error ant-tag-borderless text-[12.6px] my-2"
											>
												(You can Select Maxmimum 4 Member)
											</span>
										</label>

										<Toast ref={toast} />
										<DataTable
											value={COMemList_s?.map((item, i) => [
												{ ...item, id: i },
											]).flat()}
											selectionMode="checkbox"
											selection={COMemList_select}
											onSelectionChange={(e) =>
												handleSelectionChange_approve(e)
											}
											tableStyle={{ minWidth: "50rem" }}
											dataKey="id"
											paginator
											rows={rowsPerPage}
											first={currentPage}
											onPage={onPageChange}
											rowsPerPageOptions={[5, 10, 20]} // Add options for number of rows per page
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
												selectionMode="multiple"
												headerStyle={{ pointerEvents: "none" }} // Disable "Select All"
											></Column>
											<Column field="client_name" header="Name "></Column>

											<Column field="form_no" header="Form No."></Column>
										</DataTable>
									</div>
								</div>
							)}
						</>
					)}

					{params?.id < 1 && (
						<>
							{COMemList_s.length > 0 && (
								<div className="sm:col-span-2 mt-5">
									<div>
										<label
											className="block mb-2 text-sm capitalize font-bold text-slate-800
					dark:text-gray-100"
										>
											{" "}
											Assign Group Member
											<span
												style={{ color: "red" }}
												className="ant-tag ml-2 ant-tag-error ant-tag-borderless text-[12.6px] my-2"
											>
												(You can Select Maxmimum 4 Member)
											</span>
										</label>

										{/* <Checkbox.Group
					options={options_Member}
					value={COMemList_select}
					onChange={onChange}
					style={{ display: "grid", fontSize:13 }}
					/> */}
										{/* {JSON.stringify(COMemList_Store, 2)}
{JSON.stringify(visible, 2)} */}
										<Toast ref={toast} />
										<DataTable
											value={COMemList_s?.map((item, i) => [
												{ ...item, id: i },
											]).flat()}
											// expandedRows={expandedRows}
											// onRowToggle={(e) => setExpandedRows(e.data)}
											// onRowExpand={onRowExpand}
											// onRowCollapse={onRowCollapse}
											selectionMode="checkbox"
											selection={COMemList_select}
											// onSelectionChange={(e) => setSelectedProducts(e.value)}
											onSelectionChange={(e) => handleSelectionChange(e)}
											tableStyle={{ minWidth: "50rem" }}
											// rowExpansionTemplate={rowExpansionTemplate}
											dataKey="id"
											paginator
											rows={rowsPerPage}
											first={currentPage}
											onPage={onPageChange}
											rowsPerPageOptions={[5, 10, 20]} // Add options for number of rows per page
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
											{/* <Column
					selectionMode="multiple"
					headerStyle={{ width: "3rem" }}
					></Column> */}
											<Column
												selectionMode="multiple"
												headerStyle={{ pointerEvents: "none" }} // Disable "Select All"
											></Column>
											<Column
												field="client_name"
												header="Name "
												// body={(rowData) =>
												// new Date(rowData?.transaction_date).toLocaleDateString("en-GB")
												// }
											></Column>

											<Column
												field="form_no"
												header="Form No."
												// footer={<span style={{ fontWeight: "bold" }}>Total Amount:</span>}
											></Column>
										</DataTable>
									</div>
								</div>
							)}
						</>
					)}

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
						param={params?.id}
					/>
				</form>
			</Spin>

			<DialogBox
				flag={flag}
				data={flag == 5 ? group_code : ""}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					if (flag == 4) editGroup()
					else {
						if (params?.id < 1) {
							navigate(`/homebm/searchgroup/`)
						}

						if (params?.id > 0) {
							navigate(`/homebm/searchgroup/`)
						}
					}
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

export default GroupExtendedForm

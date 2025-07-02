import React, { useEffect, useState } from "react"
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
import { Spin, Button, Popconfirm, Tag, Timeline } from "antd"
import {
	LoadingOutlined,
	DeleteOutlined,
	PlusOutlined,
	MinusOutlined,
	FilePdfOutlined,
	MinusCircleOutlined,
	ClockCircleOutlined,
	ArrowRightOutlined,
} from "@ant-design/icons"
import FormHeader from "../../Components/FormHeader"
import { routePaths } from "../../Assets/Data/Routes"
import { useLocation } from "react-router"
import Sidebar from "../../Components/Sidebar"
import DialogBox from "../../Components/DialogBox"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import TimelineComp from "../../Components/TimelineComp"

const MAX_FILE_SIZE = 200000

function EditLoanFormMis() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const [selectedFiles, setSelectedFile] = useState([])
	const location = useLocation()
	const { loanAppData } = location.state || {}
	const navigate = useNavigate()

	const [count, setCount] = useState(() => 0)
	const [branches, setBranches] = useState(() => [])
	const [loanTypes, setLoanTypes] = useState(() => [])
	const [applicationId, setApplicationId] = useState(() => "")
	const [pdfFiles, setPdfFiles] = useState(() => [])
	const [singlePdfFile, setSinglePdfFile] = useState(() => null)
	const [fileArray, setFileArray] = useState(() => [])
	const [loanApproveStatus, setLoanApproveStatus] = useState(() => "")
	// const [branchIdForForwarding, setBranchIdForForwarding] = useState(() => "")
	const [visibleModal, setVisibleModal] = useState(() => false)
	const [visibleModal2, setVisibleModal2] = useState(() => false)
	const [fetchedFileDetails, setFetchedFileDetails] = useState(() => [])
	const [appraiserForwardedDate, setAppraiserForwardedDate] = useState("")
	const [forwardedByName, setForwardedByName] = useState("")
	const [fetchedRemarks, setFetchedRemarks] = useState("")

	const [forwardedById, setForwardedById] = useState()
	const [commentsBranchManager, setCommentsBranchManager] = useState("")
	const [rejectReasonsArray, setRejectReasonsArray] = useState(() => [])

	const [creditManagers, setCreditManagers] = useState(() => [])
	const [creditManagerId, setCreditManagerId] = useState()
	const [creditManagerBranch, setCreditManagerBranch] = useState()

	console.log(params, "params")
	console.log(location, "location")

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
		l_documents: [{ l_file_name: "", l_file: "" }],
	}
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
		l_documents: [{ l_file_name: "", l_file: "" }],
	})

	const getExtension = (fileName) => {
		if (!fileName) return ""
		const lastDotIndex = fileName.lastIndexOf(".")
		return lastDotIndex !== -1
			? fileName.slice(lastDotIndex + 1).toLowerCase()
			: ""
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
		// l_documents: Yup.mixed(),

		l_documents: Yup.array().of(
			Yup.object().shape({
				l_file_name: Yup.string(),
				l_file: Yup.mixed(),
			})
		),
		// .test("fileSize", "File too large", (files) =>
		// 	files ? Array.from(files).every((file) => file.size <= 200000000) : true
		// )
		// .test("fileType", "Unsupported File Format", (files) =>
		// 	files
		// 		? Array.from(files).every((file) => file.type === "application/pdf")
		// 		: true
		// ),
		// .test(
		// 	"fileSize",
		// 	"Only documents up to 2MB are permitted.",
		// 	(files) =>
		// 		!files || // Check if `files` is defined
		// 		files.length === 0 || // Check if `files` is not an empty list
		// 		Array.from(files).every((file) => file.size <= 2_000_000_00)
		// )
	})

	var fileList = []

	const handleFilesChange = (event, index) => {
		console.log("HHHHHHHHHHHHHHHHHHHHHHHHHH", fileList.length)
		formik.handleChange(event)
		console.log(event)
		console.log(event.target.files[0])
		// selectedFiles.push({
		// 	name: formik.values.l_documents[index].l_file_name,
		// 	file: event.target.files[0],
		// })
		// setSelectedFile(selectedFiles)
		setSelectedFile(...selectedFiles, {
			name: formik.values.l_documents[index].l_file_name,
			file: event.target.files[0],
		})

		console.log(selectedFiles)
		// const files = event.currentTarget.files
		const files = event.target.files[0]

		const pdfFilteredFiles = Array.from(files)?.filter(
			(file) => getExtension(file?.name) === "pdf"
		)

		console.log("iurhgbvfvfrr", event.currentTarget.files)
		console.log("iurhgbvfvfrr================", pdfFilteredFiles)

		setSinglePdfFile(event.currentTarget.files[0])
		// const newFiles = Array.from(pdfFilteredFiles)
		// setPdfFiles([...pdfFiles, ...newFiles])

		fileList.push({ file: event.currentTarget.files }) // Store the selected files in state
		setPdfFiles(fileList)

		console.log("+===========================++++++++", fileList)
		// setPdfFiles(event.currentTarget.files) // Store the selected files in state
		// setFieldValue("files", files) // Set Formik value

		console.log("iurhgbvfvfrr================++++", pdfFiles)
		// setValues({...prev, l_documents: [
		// 	{ sl_no: 0, l_file_name: "", l_file:  }
		// ]})

		// setValues({
		// 	...formValues,
		// 	l_documents: [
		// 		{
		// 			sl_no: 0,
		// 			l_file_name: event.currentTarget.files[0].name,
		// 			l_file: event.currentTarget.files[0],
		// 		},
		// 	],
		// })

		console.log("LLLLL", formValues.l_documents)
	}

	// const handleFilesChange = (event) => {
	// 	formik.handleChange(event) // Handle formik change if needed

	// 	const files = event.currentTarget.files
	// 	const pdfFilteredFiles = Array.from(files)?.filter(
	// 		(file) => getExtension(file?.name) === "pdf" // Filter only PDF files
	// 	)

	// 	// Log selected files
	// 	console.log("All Files:", files)
	// 	console.log("Filtered PDF Files:", pdfFilteredFiles)

	// 	// Handle single file selection (if required)
	// 	setSinglePdfFile(files[0]) // Set the first file for single selection

	// 	// Update the list of files in state (appending new files to the existing list)
	// 	setPdfFiles((prevFiles) => [...prevFiles, ...pdfFilteredFiles])

	// 	// Optionally, you can set Formik field value if needed
	// 	// formik.setFieldValue("files", [...prevFiles, ...pdfFilteredFiles]);
	// }

	const handleRemove = (index, setFieldValue) => {
		const updatedFiles = pdfFiles.filter((_, i) => i !== index) // Remove file by index
		setPdfFiles(updatedFiles)
		// setFieldValue('files', updatedFiles);  // Update Formik field value after removal
	}

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

	const fetchCreditManagers = async () => {
		await axios
			.get(
				`${url}/brn/get_credit_manager?brn_code=${+JSON.parse(
					localStorage.getItem("br_mgr_details")
				).branch_code}`
			)
			.then((res) => {
				if (res?.data?.suc === 1) {
					setCreditManagers(res?.data?.msg)
					console.log("LLLLLLLLLL", res?.data?.msg)
				} else {
					Message("warning", "No Credit Managers Found!")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching Credit Managers.")
			})
	}

	useEffect(() => {
		fetchBranches()
		fetchLoanTypes()
		fetchCreditManagers()
	}, [])

	// const handleReset = () => {
	// 	setPdfFiles(() => [])
	// 	setValues(initialValues)
	// }

	const onSubmit = async (values) => {
		console.log("onsubmit called")
		console.log(values, "onsubmit vendor")
		setLoading(true)

		var data = new FormData()

		data.append("application_no", +params?.id)
		data.append(
			"user_id",
			+JSON.parse(localStorage.getItem("br_mgr_details"))?.id
		)
		data.append("member_id", +values?.l_member_id)
		data.append("member_name", values?.l_name)
		data.append("father_name", values?.l_father_husband_name)
		data.append("gender", values?.l_gender)
		data.append("dob", values?.l_dob)
		data.append("member_dt", values?.l_membership_date)
		data.append("email", values?.l_email)
		data.append("mobile_no", values?.l_mobile_no)
		data.append("memb_address", values?.l_address)
		data.append("branch_code", values?.l_loan_through_branch)
		data.append("loan_type", values?.l_applied_for)
		data.append("loan_amt", values?.l_loan_amount)
		data.append("loan_period", values?.l_duration)
		data.append(
			"created_by",
			JSON.parse(localStorage.getItem("br_mgr_details"))?.created_by
		)

		// data.append("application_no", params.id)
		// data.append("member_id", values?.l_member_id)

		data.append("file_name", JSON.stringify(values?.l_documents))

		// pdfFiles?.forEach((pdf, i) => {
		// 	let file = new File([pdf], `File_Application_${i}` + ".pdf")
		// 	data.append("file_path", file)
		// })

		fileArray?.forEach((item, i) => {
			let file = new File([item], `File_Application_${i}` + ".pdf")
			data.append("file_path", item)
		})

		// data.append("file_path", file)

		console.log("FORM DATA", data)

		await axios
			.post(`${url}/sql/insert_loan_dtls`, data)
			.then((res) => {
				console.log("API RESPONSE", res)

				if (res?.data?.suc === 1) {
					Message("success", res?.data?.msg)
					navigate(routePaths.BRANCH_MANAGER_HOME)
				}
			})
			.catch((err) => {
				console.log("EERRRRRRRRRR", err)
			})

		setLoading(false)
	}

	const fetchUploadedFiles = async () => {
		const creds = {
			application_no: +params?.id,
		}
		await axios
			.post(`${url}/sql/file_details`, creds)
			.then((res) => {
				if (res?.data?.suc === 1) {
					setFetchedFileDetails(res?.data?.msg)
				} else {
					Message("error", "No Files Uploaded.")
				}
			})
			.catch((err) => {
				Message("error", "Error occurred while fetching uploaded files.")
			})
	}

	// const handleRemoveFileModal = () => {
	// 	setVisibleModal2(!visibleModal2)
	// }

	// const onPressYesRemoveFileModal = (e, i, slNo) => {
	// 	handleRemoveFile(e, i, slNo)
	// }

	const handleRemoveFile = async (e, id, slNo) => {
		setLoading(true)
		e.preventDefault()

		const creds = {
			application_no: +params?.id,
			sl_no: +slNo,
		}

		await axios
			.post(`${url}/sql/update_file`, creds)
			.then((res) => {
				if (res?.data?.suc === 1) {
					setFetchedFileDetails((prev) =>
						prev.filter((_, index) => index !== id)
					)
					Message("success", res?.data?.msg)
				} else {
					Message("error", "Not deleted!")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while deleting a file.")
			})
		setLoading(false)
	}

	const fetchApplicationDetails = async () => {
		setLoading(true)
		await axios
			.get(
				`${url}/brn/fetch_brn_pen_dtls?user_id=${+JSON.parse(
					localStorage.getItem("br_mgr_details")
				)?.id}&application_no=${params?.id}`
			)
			.then((res) => {
				if (res?.data?.suc === 1) {
					setValues({
						l_member_id: res?.data?.msg[0]?.pending_dtls[0]?.member_id,
						l_membership_date:
							new Date(res?.data?.msg[0]?.pending_dtls[0]?.member_dt)
								?.toISOString()
								?.split("T")[0] || "",
						l_name: res?.data?.msg[0]?.pending_dtls[0]?.member_name,
						l_father_husband_name:
							res?.data?.msg[0]?.pending_dtls[0]?.father_name,
						l_gender: res?.data?.msg[0]?.pending_dtls[0]?.gender,
						l_dob:
							new Date(res?.data?.msg[0]?.pending_dtls[0]?.dob)
								?.toISOString()
								?.split("T")[0] || "",
						l_email: res?.data?.msg[0]?.pending_dtls[0]?.email,
						l_mobile_no: res?.data?.msg[0]?.pending_dtls[0]?.mobile_no,
						l_address: res?.data?.msg[0]?.pending_dtls[0]?.memb_address,
						l_loan_through_branch:
							res?.data?.msg[0]?.pending_dtls[0]?.branch_code,
						l_applied_for: res?.data?.msg[0]?.pending_dtls[0]?.loan_type,
						l_loan_amount: res?.data?.msg[0]?.pending_dtls[0]?.loan_amt,
						l_duration: res?.data?.msg[0]?.pending_dtls[0]?.loan_period,
						l_documents: [{ l_file_name: "", l_file: "" }],
					})

					console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB", res?.data)
					setAppraiserForwardedDate(
						res?.data?.msg[0]?.pending_dtls[0]?.forwarded_dt
					)
					setFetchedRemarks(res?.data?.msg[0]?.pending_dtls[0]?.remarks)
					// setForwardedByName(res?.data?.msg[0]?.forward_appr_name)
					setLoanApproveStatus(
						res?.data?.msg[0]?.pending_dtls[0]?.application_status
					)
					setForwardedById(res?.data?.msg[0]?.pending_dtls[0]?.forwarded_by)
					setRejectReasonsArray(res?.data?.msg[0]?.reject_dt)
				} else {
					Message("warning", "No data found!")
				}
			})
			.catch((err) => {
				console.log("Error loan", err)
				Message("error", "Some error occurred while fetching loan details.")
			})
		await fetchUploadedFiles()
		setLoading(false)
	}

	const handleReject = async (appStatus, e) => {
		e.preventDefault()
		// AppStatus -> A/R
		setLoading(true)
		const creds = {
			brn_code: formik.values.l_loan_through_branch,
			application_no: +params.id,
			user_id: JSON.parse(localStorage.getItem("br_mgr_details")).id,
			fwd_brn: JSON.parse(localStorage.getItem("br_mgr_details")).branch_code,
			loan_appr_id: forwardedById,
			brn_remarks: commentsBranchManager,
			application_status: appStatus,
			brn_mgr_id: JSON.parse(localStorage.getItem("br_mgr_details")).id,
			created_by:
				JSON.parse(localStorage.getItem("br_mgr_details")).first_name +
				" " +
				JSON.parse(localStorage.getItem("br_mgr_details")).last_name,
		}

		console.log(
			"ooooooooooooooo------------------",
			+JSON.parse(localStorage.getItem("br_mgr_details"))?.user_type
		)

		await axios
			.post(`${url}/brn/brn_manager_reject`, creds)
			.then((res) => {
				Message("error", "Application Rejected.")
				// setVisibleModal2(!visibleModal2)
				navigate(routePaths.BRANCH_MANAGER_HOME)
			})
			.catch((err) => {
				Message(
					"error",
					"Something went wrong while sending to Credit Manager!"
				)
			})

		setLoading(false)
	}

	const sendToCreditManager = async (appStatus) => {
		// AppStatus -> A/R
		setLoading(true)
		const creds = {
			credit_brn_code: JSON.parse(localStorage.getItem("br_mgr_details"))
				.branch_code,
			application_no: +params.id,
			mng_user_id: JSON.parse(localStorage.getItem("br_mgr_details")).id,
			mng_brn_code: JSON.parse(localStorage.getItem("br_mgr_details"))
				.branch_code,
			credit_mgr_id: creditManagerId,
			remarks: commentsBranchManager,
			application_status: appStatus,
		}

		console.log(
			"ooooooooooooooo------------------",
			+JSON.parse(localStorage.getItem("br_mgr_details"))?.user_type
		)

		await axios
			.post(`${url}/brn/forward_credit_manager`, creds)
			.then((res) => {
				// if (res?.data?.suc === 1) {
				setVisibleModal(!visibleModal)
				navigate(routePaths.BRANCH_MANAGER_HOME)
				Message("success", "E-Files sent to Credit Manager.")
				// } else {
				// 	Message("error", "Some error occurred!")
				// }
			})
			.catch((err) => {
				Message(
					"error",
					"Something went wrong while sending to Credit Manager!"
				)
			})

		setLoading(false)
	}

	useEffect(() => {
		fetchApplicationDetails()
	}, [])

	const formik = useFormik({
		initialValues: formValues,
		onSubmit,
		validationSchema,
		validateOnChange: true,
		validateOnBlur: true,
		enableReinitialize: true,
		validateOnMount: true,
	})

	const filePush = (file) => {
		setFileArray((prev) => [...prev, file])
	}

	const filePop = (index) => {
		setFileArray(fileArray.filter((_, i) => i !== index))
	}

	// console.log("======================================", +branchIdForForwarding)

	return (
		<>
			<Sidebar mode={1} />
			<section className="bg-blue-50 dark:bg-[#001529] flex justify-center align-middle p-5">
				{/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
				{/* <HeadingTemplate
				text={params.id > 0 ? "Update vendor" : "Add vendor"}
				mode={params.id > 0 ? 1 : 0}
				title={"Vendor"}
				data={params.id && data ? data : ""}
			/> */}
				{/* {JSON.stringify(loanAppData)} */}
				<div className=" bg-white p-5 w-4/5 min-h-screen rounded-3xl">
					<div className="flex justify-between ml-14 mr-12">
						{/* <Tag
							color="purple"
							className="p-1 px-2 text-sm rounded-full font-bold"
						>
							<ArrowRightOutlined /> From Appraiser: {forwardedByName}
						</Tag> */}
						<Tag
							color="orange"
							className="p-1 px-2 text-sm rounded-full font-bold"
						>
							<ClockCircleOutlined /> Forwarded on:{" "}
							{new Date(appraiserForwardedDate)?.toLocaleString("en-GB")}
						</Tag>
					</div>
					<div className="w-auto mx-14 my-4">
						<FormHeader text="Pending Application Preview & Edit" mode={1} />
					</div>
					<Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-blue-800 dark:text-gray-400"
						spinning={loading}
					>
						<Formik
							initialValues={formValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
							validateOnMount={true}
							enableReinitialize={true}
						>
							{({
								values,
								handleReset,
								handleChange,
								handleBlur,
								handleSubmit,
								errors,
								touched,
							}) => (
								<form onSubmit={handleSubmit}>
									<div className="card flex flex-col justify-center px-16 py-5">
										<div className="mb-4">
											<TDInputTemplateBr
												placeholder="Application Number"
												type="text"
												label="Application Number"
												name="app_no"
												formControlName={params.id}
												mode={1}
												disabled
											/>
										</div>
										<div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
											<div className="sm:col-span-2">
												<TDInputTemplateBr
													placeholder="Type Member ID..."
													type="text"
													label="Member ID"
													name="l_member_id"
													formControlName={values.l_member_id}
													handleChange={handleChange}
													handleBlur={handleBlur}
													mode={1}
													disabled
												/>
												{errors.l_member_id && touched.l_member_id ? (
													<VError title={errors.l_member_id} />
												) : null}
											</div>
											<div className="sm:col-span-2">
												<TDInputTemplateBr
													placeholder="Type Membership Date..."
													type="date"
													label="Membership Date"
													name="l_membership_date"
													formControlName={values.l_membership_date}
													handleChange={handleChange}
													handleBlur={handleBlur}
													min={"1900-12-31"}
													mode={1}
													disabled
												/>
												{errors.l_membership_date &&
												touched.l_membership_date ? (
													<VError title={errors.l_membership_date} />
												) : null}
											</div>
											<div className="sm:col-span-2">
												<TDInputTemplateBr
													placeholder="Type name..."
													type="text"
													label="Name"
													name="l_name"
													formControlName={values.l_name}
													handleChange={handleChange}
													handleBlur={handleBlur}
													mode={1}
													disabled
												/>
												{errors.l_name && touched.l_name ? (
													<VError title={errors.l_name} />
												) : null}
											</div>
										</div>

										<div className="grid gap-4 sm:grid-cols-2 sm:gap-6 pt-5">
											<div>
												<TDInputTemplateBr
													placeholder="Type Father's/Husband's Name..."
													type="text"
													label="Father's/Husband's Name"
													name="l_father_husband_name"
													formControlName={values.l_father_husband_name}
													handleChange={handleChange}
													handleBlur={handleBlur}
													mode={1}
													disabled
												/>
												{errors.l_father_husband_name &&
												touched.l_father_husband_name ? (
													<VError title={errors.l_father_husband_name} />
												) : null}
											</div>
											<div>
												<TDInputTemplateBr
													placeholder="Select Gender..."
													type="text"
													label="Gender"
													name="l_gender"
													formControlName={values.l_gender}
													handleChange={handleChange}
													handleBlur={handleBlur}
													data={[
														{ code: "M", name: "Male" },
														{ code: "F", name: "Female" },
														{ code: "L", name: "LGBTQA+" },
													]}
													mode={2}
													disabled
												/>
												{errors.l_gender && touched.l_gender ? (
													<VError title={errors.l_gender} />
												) : null}
											</div>
											<div>
												<TDInputTemplateBr
													placeholder="Type DOB..."
													type="date"
													label="Date of Birth (DOB)"
													name="l_dob"
													formControlName={values.l_dob}
													handleChange={handleChange}
													handleBlur={handleBlur}
													max={values.l_membership_date}
													mode={1}
													disabled
												/>
												{errors.l_dob && touched.l_dob ? (
													<VError title={errors.l_dob} />
												) : null}
											</div>
											<div>
												<TDInputTemplateBr
													placeholder="Type Email..."
													type="email"
													label="Email"
													name="l_email"
													formControlName={values.l_email}
													handleChange={handleChange}
													handleBlur={handleBlur}
													mode={1}
													disabled
												/>
												{errors.l_email && touched.l_email ? (
													<VError title={errors.l_email} />
												) : null}
											</div>
											<div>
												<TDInputTemplateBr
													placeholder="Type Address..."
													type="text"
													label={`Address`}
													name="l_address"
													formControlName={values.l_address}
													handleChange={handleChange}
													handleBlur={handleBlur}
													mode={3}
													disabled
												/>
												{errors.l_address && touched.l_address ? (
													<VError title={errors.l_address} />
												) : null}
											</div>
											<div>
												<TDInputTemplateBr
													placeholder="Type Mobile Number..."
													type="number"
													label="Mobile Number"
													name="l_mobile_no"
													formControlName={values.l_mobile_no}
													handleChange={handleChange}
													handleBlur={handleBlur}
													mode={1}
													disabled
												/>
												{errors.l_mobile_no && touched.l_mobile_no ? (
													<VError title={errors.l_mobile_no} />
												) : null}
											</div>

											{/* {loanApproveStatus !== "A" &&
												loanApproveStatus !== "R" && (
													<div className="col-span-2">
														<TDInputTemplateBr
															placeholder="Remarks"
															type="text"
															label={`Remarks from ${forwardedByName}`}
															// name="l_address"
															formControlName={fetchedRemarks}
															// handleChange={handleChange}
															// handleBlur={handleBlur}
															mode={3}
															disabled
														/>
														{errors.l_address && touched.l_address ? (
															<VError title={errors.l_address} />
														) : null}
													</div>
												)} */}

											<div>
												<TDInputTemplateBr
													placeholder="Type Loan Through Branch..."
													type="text"
													label="Loan Through Branch"
													name="l_loan_through_branch"
													formControlName={values.l_loan_through_branch}
													handleChange={handleChange}
													handleBlur={handleBlur}
													data={branches?.map((branch) => ({
														code: branch?.sl_no,
														name: branch?.branch_name,
													}))}
													mode={2}
													disabled={
														loanApproveStatus === "A" ||
														loanApproveStatus === "R"
													}
												/>
												{errors.l_loan_through_branch &&
												touched.l_loan_through_branch ? (
													<VError title={errors.l_loan_through_branch} />
												) : null}
											</div>
											<div>
												<TDInputTemplateBr
													placeholder="Type Applied For..."
													type="text"
													label="Applied For"
													name="l_applied_for"
													formControlName={values.l_applied_for}
													handleChange={handleChange}
													handleBlur={handleBlur}
													data={loanTypes?.map((loan) => ({
														code: loan?.sl_no,
														name: loan?.loan_type,
													}))}
													mode={2}
													disabled={
														loanApproveStatus === "A" ||
														loanApproveStatus === "R"
													}
												/>
												{errors.l_applied_for && touched.l_applied_for ? (
													<VError title={errors.l_applied_for} />
												) : null}
											</div>
											<div>
												<TDInputTemplateBr
													placeholder="Type Loan Amount..."
													type="number"
													label="Loan Amount"
													name="l_loan_amount"
													formControlName={values.l_loan_amount}
													handleChange={handleChange}
													handleBlur={handleBlur}
													mode={1}
													disabled={
														loanApproveStatus === "A" ||
														loanApproveStatus === "R"
													}
												/>
												{errors.l_loan_amount && touched.l_loan_amount ? (
													<VError title={errors.l_loan_amount} />
												) : null}
											</div>
											<div>
												<TDInputTemplateBr
													placeholder="Type Duration..."
													type="number"
													label="Duration (In Months)"
													name="l_duration"
													formControlName={values.l_duration}
													handleChange={handleChange}
													handleBlur={handleBlur}
													mode={1}
													disabled={
														loanApproveStatus === "A" ||
														loanApproveStatus === "R"
													}
												/>
												{errors.l_duration && touched.l_duration ? (
													<VError title={errors.l_duration} />
												) : null}
											</div>
										</div>

										<Spin
											indicator={<LoadingOutlined spin />}
											size="large"
											className="text-blue-800 dark:text-gray-400"
											spinning={loading}
										>
											<div className="mt-10 text-blue-800">
												<div className="text-lg font-bold">Uploaded Files</div>
												<div className="grid grid-cols-4 gap-4 place-items-start mt-3">
													{fetchedFileDetails?.map((item, i) => (
														<div key={i}>
															<TDInputTemplateBr
																placeholder="Entered File Name..."
																type="text"
																label="File Name"
																formControlName={item?.file_name}
																disabled
																mode={1}
															/>
															<div className="mt-3 text-blue-500">
																<a
																	href={url + "/" + item?.file_path}
																	target="__blank"
																>
																	<FilePdfOutlined className="text-red-800 text-6xl" />
																</a>
															</div>
															<div className="-mt-6">
																{/* <button
																	className="h-5 w-5"
																	onClick={(e) => {
																		handleRemoveFile(e, i, item?.sl_no)
																	}}
																>
																	<DeleteOutlined className="text-[#5f49cc] text-xl ml-40 hover:animate-pulse hover:text-black delay-50 duration-50" />
																</button> */}
																<Popconfirm
																	title="Delete file?"
																	description="Are you sure to delete this file?"
																	onConfirm={(e) => {
																		handleRemoveFile(e, i, item?.sl_no)
																	}}
																	onCancel={() => null}
																	okText="Delete"
																	cancelText="Cancel"
																	okType="link"
																	okButtonProps={{
																		style: {
																			backgroundColor: "#5f49cc",
																			color: "#ffffff",
																		},
																	}}
																>
																	{loanApproveStatus !== "A" &&
																		loanApproveStatus !== "R" && (
																			<DeleteOutlined className="text-[#5f49cc] text-xl ml-40 hover:animate-pulse hover:text-black delay-50 duration-50" />
																		)}
																</Popconfirm>
															</div>
														</div>
													))}
												</div>
											</div>
										</Spin>

										{loanApproveStatus !== "A" && loanApproveStatus !== "R" && (
											<FieldArray name="l_documents">
												{({ push, remove, insert, unshift }) => (
													<>
														{values.l_documents?.map((item, index) => (
															<React.Fragment key={index}>
																<div className="flex flex-col my-8 border-t-2 border-yellow-200 border-dashed">
																	<div className="mt-4">
																		<TDInputTemplateBr
																			placeholder="Type File Name..."
																			type="text"
																			label="File Name"
																			name={`l_documents[${index}].l_file_name`}
																			formControlName={item.l_file_name}
																			handleChange={handleChange}
																			handleBlur={handleBlur}
																			mode={1}
																		/>
																	</div>
																	<div className="mt-2">
																		<TDInputTemplateBr
																			placeholder="Upload Documents"
																			type="file"
																			// multiple={true}
																			accept="application/pdf"
																			label="Upload Documents"
																			name={`l_documents[${index}].l_file`}
																			handleChange={(event) => {
																				const files = event.target.files
																				if (files) {
																					Array.from(files).forEach((file) => {
																						filePush(file)
																					})
																				}
																			}}
																			handleBlur={handleBlur}
																			mode={1}
																		/>
																		{errors.l_file && touched.l_file ? (
																			<VError title={errors.l_file} />
																		) : null}
																	</div>
																</div>

																<div className="flex flex-row gap-2 justify-end align-middle">
																	{values?.l_documents?.length > 1 && (
																		<div>
																			<Button
																				className="rounded-full text-white bg-red-800 border-red-800"
																				onClick={() => {
																					remove(index)
																					filePop(index)
																				}}
																				icon={<MinusOutlined />}
																			></Button>
																		</div>
																	)}
																	<div>
																		<Button
																			className="rounded-full bg-yellow-400 text-white"
																			onClick={() => {
																				push({
																					l_file_name: "",
																					l_file: "",
																				})
																				console.log(values.l_documents)
																			}}
																			icon={<PlusOutlined />}
																		></Button>
																	</div>
																</div>
															</React.Fragment>
														))}
													</>
												)}
											</FieldArray>
										)}

										{rejectReasonsArray?.length > 0 && (
											<div className="mt-14 bg-blue-50 rounded-xl p-10">
												<div className="text-lg font-bold text-blue-800 mb-4">
													Comments / Rejection Remarks
												</div>
												<TimelineComp data={rejectReasonsArray} />
											</div>
										)}

										{/* <div className="mt-4 grid grid-cols-2 gap-6 border-b-2 border-yellow-200 pb-3 border-dashed">
											<div className="col-span-2">
												<TDInputTemplateBr
													placeholder="Remarks..."
													type="text"
													label={`Remarks from ${forwardedByName}`}
													// name="remarks"
													formControlName={fetchedRemarks}
													// handleChange={(e) =>
													// 	setFetchedRemarks(e.target.value)
													// }
													mode={3}
													disabled
												/>
												{!fetchedRemarks ? (
													<VError title={"Please Enter Remarks"} />
												) : null}
											</div>
										</div> */}

										{loanApproveStatus !== "A" && loanApproveStatus !== "R" && (
											<div className="mt-7">
												<div>
													<TDInputTemplateBr
														placeholder="Credit Managers"
														type="text"
														label="Choose Credit Manager"
														formControlName={creditManagerId}
														handleChange={(e) => {
															setCreditManagerId(e.target.value)
															// setCreditManagerBranch(
															// 	e.target.value?.branch_code
															// )

															console.log(
																".................>>>",
																// JSON.parse(e.target.value)?.id,
																// JSON.parse(e.target.value)?.branch_code
																e
															)
														}}
														// handleBlur={handleBlur}
														data={creditManagers?.map((c) => ({
															code: c?.id,
															name: c?.first_name + " " + c?.last_name,
														}))}
														mode={2}
														// disabled={
														// 	loanApproveStatus === "A" ||
														// 	loanApproveStatus === "R"
														// }
													/>
													{/* {errors.l_applied_for && touched.l_applied_for ? (
														<VError title={errors.l_applied_for} />
													) : null} */}
												</div>
												<div className="mt-7">
													<TDInputTemplateBr
														placeholder="Write comments..."
														type="text"
														label={`Comments`}
														name="comments"
														formControlName={commentsBranchManager}
														handleChange={(e) =>
															setCommentsBranchManager(e.target.value)
														}
														mode={3}
													/>
													{!commentsBranchManager ? (
														<VError
															title={
																"Please Enter Comments Before Forwarding or Rejecting"
															}
														/>
													) : null}
												</div>
											</div>
										)}

										{loanApproveStatus !== "A" && loanApproveStatus !== "R" ? (
											<div className="mt-10">
												<BtnComp
													mode="S"
													rejectBtn={true}
													onReject={() => {
														setVisibleModal2(true)
													}}
													sendToText="Credit Manager"
													onSendTo={() => setVisibleModal(true)}
													condition={fetchedFileDetails?.length > 0}
													showSave
												/>
											</div>
										) : loanApproveStatus === "A" ? (
											<Tag
												color="purple"
												className="mt-10 p-5 rounded-lg text-xl font-bold self-center"
											>
												E-Files forwarded to Credit Manager.
											</Tag>
										) : loanApproveStatus === "R" ? (
											<Tag
												color="orange"
												className="mt-10 p-5 rounded-lg text-xl font-bold self-center"
											>
												E-Files rejected and sent to Loan Appraiser.
											</Tag>
										) : (
											<Tag
												color="red"
												className="mt-10 p-5 rounded-lg text-xl font-bold self-center"
											>
												Some error occurred. [Status is not b/w P/A/R]
											</Tag>
										)}
									</div>
								</form>
							)}
						</Formik>

						{/* </form> */}
					</Spin>
				</div>
			</section>

			<DialogBox
				flag={4}
				onPress={() => setVisibleModal(!visibleModal)}
				visible={visibleModal}
				onPressYes={() => {
					if (commentsBranchManager) {
						setVisibleModal(!visibleModal)
						sendToCreditManager("A")
					} else {
						Message("error", "Write Comments.")
						setVisibleModal(!visibleModal)
					}
				}}
				onPressNo={() => {
					setVisibleModal(!visibleModal)
					Message("warning", "User cancelled operation.")
				}}
			/>

			<DialogBox
				flag={4}
				onPress={() => setVisibleModal2(!visibleModal2)}
				visible={visibleModal2}
				onPressYes={(e) => {
					if (commentsBranchManager && creditManagerId) {
						setVisibleModal2(!visibleModal2)
						handleReject("R", e)
					} else {
						Message("error", "Write Comments.")
						setVisibleModal2(!visibleModal2)
					}
				}}
				onPressNo={() => {
					setVisibleModal2(!visibleModal2)
					Message("warning", "User cancelled operation.")
				}}
			/>
			{/* <DialogBox
				flag={4}
				onPress={() => setVisibleModal2(!visibleModal2)}
				visible={visibleModal2}
				onPressYes={() => {
					setVisibleModal2(!visibleModal2)
				}}
				onPressNo={() => {
					setVisibleModal2(!visibleModal2)
				}}
			/> */}
		</>
	)
}

export default EditLoanFormMis

import React, { useEffect, useState } from "react"
import "../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../Components/BtnComp"
import VError from "../../Components/VError"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Message } from "../../Components/Message"
import { url } from "../../Address/BaseUrl"
import { Button, Checkbox, Image, Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../Utils/formateDate"
import DialogBox from "../../Components/DialogBox"
// import { disableInputArray } from "./disableInputArray"
import { disableCondition } from "./disableCondition"
import { Eye } from "lucide-react"

function BasicDetailsForm({ memberDetails }) {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	// const { loanAppData } = location.state || {}
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))
	const [uploadedImage,setUploadedImage] = useState('');
	const [ imageVisible,setImageVisible] = useState(false);
	const [branches, setBranches] = useState(() => [])
	const [loanTypes, setLoanTypes] = useState(() => [])
	const [visible, setVisible] = useState(() => false)
	const [visible2, setVisible2] = useState(() => false)

	const [isPhoneVerified, setIsPhoneVerified] = useState(false)
	const [isAadhaarVerified, setIsAadhaarVerified] = useState(false)
	const [isPanVerified, setIsPanVerified] = useState(false)

	const [groups, setGroups] = useState(() => [])
	const [religions, setReligions] = useState(() => [])
	const [castes, setCastes] = useState(() => [])
	const [educations, setEducations] = useState(() => [])

	// const formattedDob = formatDateToYYYYMMDD(memberDetails?.dob)

	console.log(params, "params")
	console.log(location, "location")
	console.log(
		memberDetails?.branch_name,
		"memberDetails_______________",
		memberDetails
	)

	const initialValues = {
		b_clientName: "",
		b_clientGender: "",
		b_clientMobile: "",
		b_clientEmail: "",
		b_guardianName: "",
		b_guardianMobile: "",
		b_clientAddress: "",
		b_clientPin: "",
		b_aadhaarNumber: "",
		b_panNumber: "",
		b_religion: "",
		b_caste: "",
		b_education: "",
		b_otherReligion: "",
		b_otherCaste: "",
		b_otherEducation: "",
		b_groupCode: "",
		b_groupCodeName: "",
		b_dob: "",
		b_grtDate: "",
	}
	const [formValues, setValues] = useState({
		b_clientName: "",
		b_branch_name: "",
		b_clientGender: "",
		b_clientMobile: "",
		b_clientEmail: "",
		b_guardianName: "",
		b_guardianMobile: "",
		b_clientAddress: "",
		b_clientPin: "",
		b_aadhaarNumber: "",
		b_panNumber: "",
		b_voterNumber: "",
		b_religion: "",
		b_caste: "",
		b_education: "",
		b_otherReligion: "",
		b_otherCaste: "",
		b_otherEducation: "",
		b_groupCode: "",
		b_groupCodeName: "",
		b_dob: "",
		b_grtDate: "",
		// b_previewImg:""
	})

	const validationSchema = Yup.object({
		b_clientName: Yup.string().required("Client name is required"),
		b_clientGender: Yup.string().required("Gender is required"),
		b_clientMobile: Yup.string()
			.matches(/^[0-9]+$/, "Must be only digits")
			.min(10, "Number should exactly be 10 digits")
			.max(10, "Number should exactly be 10 digits")
			.required("Mobile Numeber is required"),
		b_clientEmail: Yup.string(),
		b_guardianName: Yup.string()
			.max(60, "Guardian name should always be less than 61 characters.")
			.required("Guardian name is required"),
		b_guardianMobile: Yup.string().matches(/^[0-9]+$/, "Must be only digits"),
		b_clientAddress: Yup.string()
			.max(500, "Address length should always be less than 500 characters")
			.required("Address is required"),
		b_clientPin: Yup.number()
			.integer("Only integers are allowed")
			.min(1, "PIN should always be greater than 0")
			.max(1000000, "Max loan amount is 10000000")
			.required("PIN is required"),
		b_aadhaarNumber: Yup.number()
			.integer("Only integers are allowed")
			.required("Aadhaar is required"),
		b_panNumber: Yup.string().required("PAN Number is required"),
		b_religion: Yup.string().required("Religion is required"),
		b_caste: Yup.string().required("Caste is required"),
		b_education: Yup.string().required("Education is required"),
		// b_otherReligion: Yup.string().optional(),
		// b_otherCaste: Yup.string().optional(),
		// b_otherEducation: Yup.string().optional(),
		b_groupCode: Yup.string().required("Group code is required"),
		b_dob: Yup.string().required("DOB is required"),
		b_grtDate: Yup.string().required("GRT Date is required"),
		// b_previewImg: Yup.string().optional().default('')
	})

	const onSubmit = async (values) => {
		console.log("onsubmit called")
		console.log(values, "onsubmit vendor")
		setLoading(true)

		setVisible(true)

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

	// useEffect(() => {
	// 	setValues({
	// 		b_clientName: memberDetails?.client_name,
	// 		b_clientGender: memberDetails?.gender,
	// 		b_clientMobile: memberDetails?.client_mobile,
	// 		b_clientEmail: memberDetails?.client_email,
	// 		b_guardianName: memberDetails?.gurd_name,
	// 		b_guardianMobile: memberDetails?.gurd_mobile,
	// 		b_clientAddress: memberDetails?.client_addr,
	// 		b_clientPin: memberDetails?.pin_no,
	// 		b_aadhaarNumber: memberDetails?.aadhar_no,
	// 		b_panNumber: memberDetails?.pan_no,
	// 		b_religion: memberDetails?.religion,
	// 		b_caste: memberDetails?.caste,
	// 		b_education: memberDetails?.education,
	// 		b_groupCode: memberDetails?.prov_grp_code,
	// 		b_groupCodeName: "",
	// 		b_dob: formatDateToYYYYMMDD(memberDetails?.dob),
	// 	})
	// }, [])

	const handleFetchBasicDetails = async () => {
		setLoading(true)
		const creds = {
			branch_code: userDetails?.brn_code,
			form_no: params?.id,
			approval_status: memberDetails?.approval_status,
		}
		await axios
			.post(`${url}/admin/fetch_basic_dtls_web`, creds)
			.then((res) => {
				// setUploadedImage(res?.data?)
				// console.log("++--++--++--", res?.data?)
				setValues({
					b_clientName: res?.data?.msg[0]?.client_name,
					b_branch_name: res?.data?.msg[0]?.branch_name,
					b_clientGender: res?.data?.msg[0]?.gender,
					b_clientMobile: res?.data?.msg[0]?.client_mobile,
					b_clientEmail: res?.data?.msg[0]?.email_id,
					b_guardianName: res?.data?.msg[0]?.gurd_name,
					b_husbandName: res?.data?.msg[0]?.husband_name,
					b_guardianMobile: res?.data?.msg[0]?.gurd_mobile,
					b_clientAddress: res?.data?.msg[0]?.client_addr,
					b_clientPin: res?.data?.msg[0]?.pin_no,
					b_aadhaarNumber: res?.data?.msg[0]?.aadhar_no,
					b_panNumber: res?.data?.msg[0]?.pan_no,
					b_voterNumber: res?.data?.msg[0]?.voter_id,
					b_religion: res?.data?.msg[0]?.religion,
					b_caste: res?.data?.msg[0]?.caste,
					b_education: res?.data?.msg[0]?.education,
					b_otherReligion: res?.data?.msg[0]?.other_religion,
					b_otherCaste: res?.data?.msg[0]?.other_caste,
					b_otherEducation: res?.data?.msg[0]?.other_education,
					b_groupCode: res?.data?.msg[0]?.prov_grp_code,
					b_groupCodeName: "",
					b_dob: formatDateToYYYYMMDD(res?.data?.msg[0]?.dob),
					b_grtDate: formatDateToYYYYMMDD(res?.data?.msg[0]?.grt_date),
				})

				console.log(
					{
						b_clientName: res?.data?.msg[0]?.client_name,
						b_branch_name: res?.data?.msg[0]?.branch_name,
						b_clientGender: res?.data?.msg[0]?.gender,
						b_clientMobile: res?.data?.msg[0]?.client_mobile,
						b_clientEmail: res?.data?.msg[0]?.email_id,
						b_guardianName: res?.data?.msg[0]?.gurd_name,
						b_husbandName: res?.data?.msg[0]?.husband_name,
						b_guardianMobile: res?.data?.msg[0]?.gurd_mobile,
						b_clientAddress: res?.data?.msg[0]?.client_addr,
						b_clientPin: res?.data?.msg[0]?.pin_no,
						b_aadhaarNumber: res?.data?.msg[0]?.aadhar_no,
						b_panNumber: res?.data?.msg[0]?.pan_no,
						b_voterNumber: res?.data?.msg[0]?.voter_id,
						b_religion: res?.data?.msg[0]?.religion,
						b_caste: res?.data?.msg[0]?.caste,
						b_education: res?.data?.msg[0]?.education,
						b_otherReligion: res?.data?.msg[0]?.other_religion,
						b_otherCaste: res?.data?.msg[0]?.other_caste,
						b_otherEducation: res?.data?.msg[0]?.other_education,
						b_groupCode: res?.data?.msg[0]?.prov_grp_code,
						b_groupCodeName: "",
						b_dob: formatDateToYYYYMMDD(res?.data?.msg[0]?.dob),
						b_grtDate: formatDateToYYYYMMDD(res?.data?.msg[0]?.grt_date),
					},
					"memberDetails_______________",
					res?.data.msg
				)
			})
			.catch((err) => {
				console.log("--------------", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		handleFetchBasicDetails()
	}, [])

	const updateBasicDetails = async () => {
		setLoading(true)
		const creds = {
			form_no: params?.id,
			branch_code: userDetails?.brn_code,
			prov_grp_code: "",
			gender: formik.values.b_clientGender,
			client_name: formik.values.b_clientName,
			client_mobile: formik.values.b_clientMobile,
			gurd_name: formik.values.b_guardianName,
			husband_name: formik.values.b_husbandName,
			gurd_mobile: formik.values.b_guardianMobile,
			client_addr: formik.values.b_clientAddress,
			pin_no: formik.values.b_clientPin,
			aadhar_no: formik.values.b_aadhaarNumber,
			pan_no: formik.values.b_panNumber,
			voter_id: formik.values.b_voterNumber,
			religion: formik.values.b_religion,
			caste: formik.values.b_caste,
			education: formik.values.b_education,
			dob: formik.values.b_dob,
			bm_lat_val: memberDetails?.co_lat_val || "",
			bm_long_val: memberDetails?.co_long_val || "",
			bm_gps_address: memberDetails?.co_gps_address || "",
			modified_by: userDetails?.emp_name,
			member_code: memberDetails?.member_code,
			email_id: formik.values.b_clientEmail,
			other_religion: formik.values.b_otherReligion || "",
			other_caste: formik.values.b_otherCaste || "",
			other_education: formik.values.b_otherEducation || "",
			grt_date: formik.values.b_grtDate,
		}
		// console.log(creds, 'credscredscredscredscredscredscreds');

		await axios
			.post(`${url}/admin/edit_basic_dtls_web`, creds)
			.then((res) => {
				console.log("*******************", res?.data)
				Message("success", "Updated Successfully.")
			})
			.catch((err) => {
				console.log("BASIC ERRRRRRR", err)
			})
		setLoading(false)
	}

	const handleFetchGroups = async () => {
		await axios
			.get(`${url}/get_group?branch_code=${userDetails?.brn_code}`)
			.then((res) => {
				console.log("GROUPSSSS====", res?.data)
				setGroups(res?.data?.msg)
			})
			.catch((err) => {
				console.log("Some err")
			})
	}

	const handleFetchReligions = async () => {
		await axios
			.get(`${url}/get_religion`)
			.then((res) => {
				console.log("RELIIGIONSSSS====", res?.data)
				setReligions(res?.data)
			})
			.catch((err) => {
				console.log("Some err")
			})
	}

	const handleFetchCastes = async () => {
		await axios
			.get(`${url}/get_caste`)
			.then((res) => {
				console.log("CASETEEEEEEWSSSSS====", res?.data)
				setCastes(res?.data)
			})
			.catch((err) => {
				console.log("Some err")
			})
	}

	const handleFetchEducations = async () => {
		await axios
			.get(`${url}/get_education`)
			.then((res) => {
				console.log("EDUCATIONSSSSSS====", res?.data)
				setEducations(res?.data)
			})
			.catch((err) => {
				console.log("Some err")
			})
	}

	useEffect(() => {
		handleFetchGroups()
		handleFetchReligions()
		handleFetchCastes()
		handleFetchEducations()
	}, [])

	const fetchVerificationDetails = async () => {
		await axios
			.get(
				`${url}/admin/fetch_verify_flag?member_code=${memberDetails?.member_code}`
			)
			.then((res) => {
				const { phone_verify_flag, aadhar_verify_flag, pan_verify_flag } =
					res.data?.msg[0]

				console.log(
					"!!!!!!@@@@@@@@@@########",
					phone_verify_flag,
					aadhar_verify_flag,
					pan_verify_flag
				)

				setIsPhoneVerified(phone_verify_flag === "Y")
				setIsAadhaarVerified(aadhar_verify_flag === "Y")
				setIsPanVerified(pan_verify_flag === "Y")
			})
			.catch((err) => {
				console.error("Failed to fetch verification details:", err)
			})
	}

	useEffect(() => {
		fetchVerificationDetails()
	}, [])

	const handleVerification = async (flag, val) => {
		setLoading(true)
		const creds = {
			flag: flag,
			verify_value: val,
			// form_no: params?.id,
			member_id: memberDetails?.member_code,
		}

		await axios
			.post(`${url}/admin/verify_by_mis`, creds)
			.then((res) => {
				Message("success", "Verification checked.")
				console.log(">>>>>>>>>>>", res?.data)
			})
			.catch((err) => {
				Message("error", "Verification failed.")
				console.log("MMMMMMMMM", err)
			})
		setLoading(false)
	}

	const onChangeCheck1 = async (e) => {
		const isChecked = e.target.checked
		setIsPhoneVerified(isChecked)
		await handleVerification("PH", isChecked ? "Y" : "N")
	}

	const onChangeCheck2 = async (e) => {
		const isChecked = e.target.checked
		setIsAadhaarVerified(isChecked)
		await handleVerification("A", isChecked ? "Y" : "N")
	}

	const onChangeCheck3 = async (e) => {
		const isChecked = e.target.checked
		setIsPanVerified(isChecked)
		await handleVerification("P", isChecked ? "Y" : "N")
	}

	const fetchUploadedImage = async () =>{
			console.log(memberDetails);
			setLoading(true);
			try{
					const creds = {
							member_code:memberDetails?.member_code
					}
					axios.post(`${url}/admin/preview_image_web`,creds).then(res =>{
						if(res?.data?.msg.length > 0){
							const timestamp = new Date().getTime();
							setUploadedImage(`${url}/uploads/${res.data?.msg[0].img_path}`)
							setImageVisible(true);
						}
						else{
							Message('warning','No image uploaded yet')
						}
						setLoading(false);
						
					}).catch(err =>{
						setLoading(false);
						Message('error','We are unable to process your request')
					})
			}
			catch(err){
				console.log(err.message)
				setLoading(false);
			}
	}	
	return (
		<>
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				{/* <Formik
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
					}) => ( */}
				<form onSubmit={formik.handleSubmit}>
					<div>
						<div className="flex justify-between items-center">
									<Button type="primary"
										onClick={() =>{
											fetchUploadedImage()
										}}
								 		size={'middle'}>
										View Image
								 	</Button>
							</div>	
						<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
							
							<div className="mb-4">
								<TDInputTemplateBr
									placeholder="Form Number"
									type="text"
									label="Form Number"
									name="form_no"
									formControlName={params.id}
									mode={1}
									disabled
								/>
							</div>
							<div className="mb-4">
								<TDInputTemplateBr
									placeholder="Branch"
									type="text"
									label="Branch Name"
									name="branch_name"
									formControlName={
										memberDetails?.branch_name == undefined
											? formValues.b_branch_name
											: memberDetails?.branch_name
									}
									mode={1}
									disabled
								/>
							</div>
						</div>
						<div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
							<div>
								<TDInputTemplateBr
									placeholder="Member Code"
									type="text"
									label="Member Code"
									name="mem_code"
									formControlName={memberDetails?.member_code}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled
								/>
								{/* {formik.errors.l_member_id && formik.touched.l_member_id ? (
									<VError title={formik.errors.l_member_id} />
								) : null} */}
							</div>

							{/* <div>
								<TDInputTemplateBr
									placeholder="Choose Group..."
									type="text"
									label="Group"
									name="b_groupCode"
									formControlName={formik.values.b_groupCode}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={groups?.map((grp) => ({
										code: grp?.group_code,
										name: grp?.group_name,
									}))}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_groupCode && formik.touched.b_groupCode ? (
									<VError title={formik.errors.b_groupCode} />
								) : null}
							</div> */}

							<div>
								<TDInputTemplateBr
									placeholder="Type member name..."
									type="text"
									label="Member Name"
									name="b_clientName"
									formControlName={formik.values.b_clientName}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_clientName && formik.touched.b_clientName ? (
									<VError title={formik.errors.b_clientName} />
								) : null}
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Type GRT Date..."
									type="date"
									label="GRT Date"
									name="b_grtDate"
									formControlName={formik.values.b_grtDate}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									// disabled={disableCondition(
									// 	userDetails?.id,
									// 	memberDetails?.approval_status
									// )}
									disabled={true}
								/>
								{formik.errors.b_grtDate && formik.touched.b_grtDate ? (
									<VError title={formik.errors.b_grtDate} />
								) : null}
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Type DOB..."
									type="date"
									label="Date of Birth"
									name="b_dob"
									formControlName={formik.values.b_dob}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									min={"1900-12-31"}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_dob && formik.touched.b_dob ? (
									<VError title={formik.errors.b_dob} />
								) : null}
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2 sm:gap-6 pt-5">
							<div>
								<TDInputTemplateBr
									placeholder="Select Gender..."
									type="text"
									label="Gender"
									name="b_clientGender"
									formControlName={formik.values.b_clientGender}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										{ code: "M", name: "Male" },
										{ code: "F", name: "Female" },
										{ code: "O", name: "Others" },
									]}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_clientGender &&
								formik.touched.b_clientGender ? (
									<VError title={formik.errors.b_clientGender} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Type Address..."
									type="text"
									label={`Member Address`}
									name="b_clientAddress"
									formControlName={formik.values.b_clientAddress}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={3}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_clientAddress &&
								formik.touched.b_clientAddress ? (
									<VError title={formik.errors.b_clientAddress} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Type PIN..."
									type="number"
									label="PIN No."
									name="b_clientPin"
									formControlName={formik.values.b_clientPin}
									// handleChange={formik.handleChange}
									handleChange={(e) => {
										const value = e.target.value
										if (value.length <= 6) {
											// Ensuring max length of 6 digits
											formik.setFieldValue("b_clientPin", value)
										}
									}}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_clientPin && formik.touched.b_clientPin ? (
									<VError title={formik.errors.b_clientPin} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Type Mobile Number..."
									type="number"
									label="Member Mobile Number"
									name="b_clientMobile"
									formControlName={formik.values.b_clientMobile}
									// handleChange={formik.handleChange}
									handleChange={(e) => {
										const value = e.target.value
										if (value.length <= 10) {
											// Ensuring max length of 6 digits
											formik.setFieldValue("b_clientMobile", value)
										}
									}}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_clientMobile &&
								formik.touched.b_clientMobile ? (
									<VError title={formik.errors.b_clientMobile} />
								) : null}
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Type Email..."
									type="email"
									label="Member Email"
									name="b_clientEmail"
									formControlName={formik.values.b_clientEmail}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_clientEmail && formik.touched.b_clientEmail ? (
									<VError title={formik.errors.b_clientEmail} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Type Father's Name..."
									type="text"
									label="Father's Name"
									name="b_guardianName"
									formControlName={formik.values.b_guardianName}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_guardianName &&
								formik.touched.b_guardianName ? (
									<VError title={formik.errors.b_guardianName} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Type Father's/Husband Mobile Number..."
									type="number"
									label="Father's/Husband Mobile Number"
									name="b_guardianMobile"
									formControlName={formik.values.b_guardianMobile}
									// handleChange={formik.handleChange}
									handleChange={(e) => {
										const value = e.target.value
										if (value.length <= 10) {
											// Ensuring max length of 6 digits
											formik.setFieldValue("b_guardianMobile", value)
										}
									}}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_guardianMobile &&
								formik.touched.b_guardianMobile ? (
									<VError title={formik.errors.b_guardianMobile} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Type Husband Name..."
									type="text"
									label="Husband Name"
									name="b_husbandName"
									formControlName={formik.values.b_husbandName}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{/* {formik.errors.b_guardianMobile &&
								formik.touched.b_guardianMobile ? (
									<VError title={formik.errors.b_guardianMobile} />
								) : null} */}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Type Aadhaar No..."
									type="number"
									label="Aadhaar No."
									name="b_aadhaarNumber"
									formControlName={formik.values.b_aadhaarNumber}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_aadhaarNumber &&
								formik.touched.b_aadhaarNumber ? (
									<VError title={formik.errors.b_aadhaarNumber} />
								) : null}
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Type PAN No..."
									type="text"
									label="PAN No."
									name="b_panNumber"
									formControlName={formik.values.b_panNumber}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_panNumber && formik.touched.b_panNumber ? (
									<VError title={formik.errors.b_panNumber} />
								) : null}
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Type Voter No..."
									type="text"
									label="Voter ID"
									name="b_voterNumber"
									formControlName={formik.values.b_voterNumber}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_voterNumber && formik.touched.b_voterNumber ? (
									<VError title={formik.errors.b_voterNumber} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Type Religion..."
									type="text"
									label="Religion"
									name="b_religion"
									formControlName={formik.values.b_religion}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={religions?.map((religion) => ({
										code: religion?.id,
										name: religion?.name,
									}))}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_religion && formik.touched.b_religion ? (
									<VError title={formik.errors.b_religion} />
								) : null}
							</div>

							{formik.values.b_religion === "Others" && (
								<div>
									<TDInputTemplateBr
										placeholder="Type Other Religion..."
										type="text"
										label="Other Religion"
										name="b_otherReligion"
										formControlName={formik.values.b_otherReligion}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										mode={1}
										disabled={disableCondition(
											userDetails?.id,
											memberDetails?.approval_status
										)}
									/>
									{formik.errors.b_otherReligion &&
									formik.touched.b_otherReligion ? (
										<VError title={formik.errors.b_otherReligion} />
									) : null}
								</div>
							)}

							<div>
								<TDInputTemplateBr
									placeholder="Choose Caste..."
									type="text"
									label="Caste"
									name="b_caste"
									formControlName={formik.values.b_caste}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={castes?.map((caste) => ({
										code: caste?.id,
										name: caste?.name,
									}))}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_caste && formik.touched.b_caste ? (
									<VError title={formik.errors.b_caste} />
								) : null}
							</div>

							{formik.values.b_caste === "Others" && (
								<div>
									<TDInputTemplateBr
										placeholder="Type Other Caste..."
										type="text"
										label="Other Caste"
										name="b_otherCaste"
										formControlName={formik.values.b_otherCaste}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										mode={1}
										disabled={disableCondition(
											userDetails?.id,
											memberDetails?.approval_status
										)}
									/>
									{formik.errors.b_otherCaste && formik.touched.b_otherCaste ? (
										<VError title={formik.errors.b_otherCaste} />
									) : null}
								</div>
							)}

							<div>
								<TDInputTemplateBr
									placeholder="Choose Education..."
									type="text"
									label="Education"
									name="b_education"
									formControlName={formik.values.b_education}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={educations?.map((edu) => ({
										code: edu?.id,
										name: edu?.name,
									}))}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.b_education && formik.touched.b_education ? (
									<VError title={formik.errors.b_education} />
								) : null}
							</div>

							{formik.values.b_education === "Others" && (
								<div>
									<TDInputTemplateBr
										placeholder="Type Other Education..."
										type="text"
										label="Other Education"
										name="b_otherEducation"
										formControlName={formik.values.b_otherEducation}
										handleChange={formik.handleChange}
										handleBlur={formik.handleBlur}
										mode={1}
										disabled={disableCondition(
											userDetails?.id,
											memberDetails?.approval_status
										)}
									/>
									{formik.errors.b_otherEducation &&
									formik.touched.b_otherEducation ? (
										<VError title={formik.errors.b_otherEducation} />
									) : null}
								</div>
							)}

							
							 <Image
								width={200}
								style={{ display: 'none' }}
								src={uploadedImage}
								preview={{
								visible:imageVisible,
								src: uploadedImage,
								width:300,
								height:500,
								onVisibleChange: (value) => {
									setImageVisible(value);
								},
								}}
							/>

							{userDetails?.id === 3 && (
								<div>
									<div className="block mb-2 text-sm capitalize font-bold text-blue-800 dark:text-gray-100">
										Verification
									</div>
									<div className="flex justify-between gap-5">
										<Checkbox
											className="text-lg uppercase text-slate-800"
											onChange={onChangeCheck1}
											value={"PH"}
											checked={isPhoneVerified}
											disabled={disableCondition(
												userDetails?.id,
												memberDetails?.approval_status
											)}
										>
											Mobile Number
										</Checkbox>
										<Checkbox
											className="text-lg uppercase text-slate-800"
											onChange={onChangeCheck2}
											value={"A"}
											checked={isAadhaarVerified}
											disabled={disableCondition(
												userDetails?.id,
												memberDetails?.approval_status
											)}
										>
											Aadhaar Card
										</Checkbox>
										<Checkbox
											className="text-lg uppercase text-slate-800"
											onChange={onChangeCheck3}
											value={"P"}
											checked={isPanVerified}
											disabled={disableCondition(
												userDetails?.id,
												memberDetails?.approval_status
											)}
										>
											PAN Card
										</Checkbox>
									</div>
								</div>
							)}
						</div>
							{/* {userDetails.id} */}
							{/* {memberDetails?.approval_status} */}
						{/* {loanApproveStatus !== "A" && loanApproveStatus !== "R" ? ( */}
						{!disableCondition(
							userDetails?.id,
							memberDetails?.approval_status
						) && (
							<div className="mt-10">
								{(userDetails.id == 10 || (userDetails.id == 13 && formik.values?.b_groupCode != 0 && memberDetails?.approval_status == 'U')) ? (
									<BtnComp mode="A" onReset={formik.resetForm} />
								) : null}
							</div>
						)}

						{/* {
								(userDetails.id  == 2 && formik.values?.b_groupCode != 0 && memberDetails?.approval_status == 'U') && <BtnComp mode="A" onReset={formik.resetForm} />
						} */}
						{/* ) : loanApproveStatus === "A" ? (
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
						)} */}
					</div>
				</form>
			</Spin>

			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					// editGroup()
					updateBasicDetails()
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
					onChangeCheck1()
					setVisible2(!visible2)
				}}
				onPressNo={() => setVisible2(!visible2)}
			/> */}
		</>
	)
}

export default BasicDetailsForm

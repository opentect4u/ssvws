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
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import DialogBox from "../../Components/DialogBox"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import { disableCondition } from "./disableCondition"
import { routePaths } from "../../Assets/Data/Routes"

function HouseholdDetailsForm({ memberDetails }) {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const { loanAppData } = location.state || {}
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))
	const [visible, setVisible] = useState(() => false)
	const [visible2, setVisible2] = useState(() => false)
	const [visible3, setVisible3] = useState(() => false)
	const [visible4, setVisible4] = useState(() => false)

	const [remarks, setRemarks] = useState(() => "")

	console.log(params, "params")
	console.log(location, "location")

	const initialValues = {
		h_no_of_rooms: "",
		h_parental_address: "",
		h_parental_phone: "",
		h_house_type: "",
		h_own_rent: "",
		h_total_land: "0",
		h_politically_active: "",
		h_tv: "",
		h_bike: "",
		h_fridge: "",
		h_washing_machine: "",
		// remarks : RemarkValues.remarks 
		// remarks : 'ghfgh' 
	}

	const [formValues, setValues] = useState({
		h_no_of_rooms: "",
		h_parental_address: "",
		h_parental_phone: "",
		h_house_type: "",
		h_own_rent: "",
		h_total_land: "",
		h_politically_active: "",
		h_tv: "",
		h_bike: "",
		h_fridge: "",
		h_washing_machine: "",
	})

	// const [RemarkValues, setRemarkValues] = useState({
	// 	remarks: "",
	// })

	const validationSchema = Yup.object({
		h_no_of_rooms: Yup.string().required("Required"),
		h_parental_address: Yup.string().required("Required"),
		// h_parental_phone: Yup.string().optional(),
		h_house_type: Yup.string().required("Required"),
		h_own_rent: Yup.string().required("Required"),
		h_total_land: Yup.string(),
		h_politically_active: Yup.string().required("Required"),
		h_tv: Yup.string().required("Required"),
		h_bike: Yup.string().required("Required"),
		h_fridge: Yup.string().required("Required"),
		h_washing_machine: Yup.string().required("Required"),
	})

	const handleFetchBasicDetails_forRemarks = async () => {
		setLoading(true)
		const creds = {
			branch_code: userDetails?.brn_code,
			form_no: params?.id,
			approval_status: memberDetails?.approval_status,
		}
		await axios
			.post(`${url}/admin/fetch_basic_dtls_web`, creds)
			.then((res) => {
				console.log("++--++--++--", res?.data)
				setRemarks(res?.data?.msg[0]?.remarks)

				console.log("memberDetails_______________", 'remark' , res?.data.msg)
			})
			.catch((err) => {
				console.log("--------------", err)
			})
		setLoading(false)
	}

	const fetchHouseholdDetails = async () => {
		await axios
			.get(
				`${url}/admin/fetch_household_dt_web?form_no=${params?.id}&branch_code=${userDetails?.brn_code}`
			)
			.then((res) => {
				console.log("HOuSEHOLD DAT", res?.data)
				setValues({
					h_no_of_rooms: res?.data?.msg[0]?.no_of_rooms,
					h_parental_address: res?.data?.msg[0]?.parental_addr,
					h_parental_phone: res?.data?.msg[0]?.parental_phone,
					h_house_type: res?.data?.msg[0]?.house_type,
					h_own_rent: res?.data?.msg[0]?.own_rent,
					h_total_land: res?.data?.msg[0]?.land,
					h_politically_active: res?.data?.msg[0]?.poltical_flag,
					h_tv: res?.data?.msg[0]?.tv_flag,
					h_bike: res?.data?.msg[0]?.bike_flag,
					h_fridge: res?.data?.msg[0]?.fridge_flag,
					h_washing_machine: res?.data?.msg[0]?.wm_flag,
				})
			})
			.catch((err) => {
				console.log("ERRR HOUSEHOLD", err)
			})
	}

	useEffect(() => {
		handleFetchBasicDetails_forRemarks()
		console.log("KKKKKKKKKKKKKKKKKKKKKKKKK")
		fetchHouseholdDetails()
	}, [])

	const onSubmit = async (values) => {
		console.log("onsubmit called")
		console.log(values, "onsubmit vendor")
		setLoading(true)

		setVisible(!visible)

		setLoading(false)
	}

	const formik = useFormik({
		initialValues: params?.id > 0 ? formValues : initialValues,
		onSubmit,
		validationSchema,
		validateOnChange: true,
		validateOnBlur: true,
		enableReinitialize: true,
		validateOnMount: true,
	})

	const editHouseholdDetails = async () => {
		setLoading(true)
		const creds = {
			form_no: params?.id,
			house_type: formik.values.h_house_type,
			own_rent: formik.values.h_own_rent,
			no_of_rooms: formik.values.h_no_of_rooms,
			land: formik.values.h_total_land,
			tv_flag: formik.values.h_tv,
			bike_flag: formik.values.h_bike,
			fridge_flag: formik.values.h_fridge,
			wm_flag: formik.values.h_washing_machine,
			poltical_flag: formik.values.h_politically_active,
			parental_addr: formik.values.h_parental_address,
			parental_phone: formik.values.h_parental_phone,
			modified_by: userDetails?.emp_id,
			// remarks: remarks
		}
		// console.log(creds, 'Approve Application 1', 'editHouseholdDetails');
		await axios
			.post(`${url}/admin/edit_household_dtls_web`, creds)
			.then((res) => {
				console.log("HOUSEE DDTTTTTTD", res?.data)
				Message("success", "Updated successfully.")
			})
			.catch((err) => {
				console.log("HOUSEEE ERRRR", err)
			})
		setLoading(false)
	}

	// important Reject Application
	const handleRejectApplication = async () => {
		setLoading(true)
		const creds = {
			approval_status: "R",
			form_no: params?.id,
			remarks: remarks,
			member_code: memberDetails?.member_code,
			rejected_by: userDetails?.emp_id,
		}
		// console.log(creds, 'Reject Application 1', 'handleRejectApplication');
		await axios
			.post(`${url}/admin/delete_member_mis`, creds)
			.then((res) => {
				Message("success", "Application rejected!")
				// navigate(routePaths.MIS_ASSISTANT_HOME)
				navigate(-1)
			})
			.catch((err) => {
				Message("error", "Some error occurred while rejecting application.")
			})
		setLoading(false)
	}

	// important Send To BM
	const handleForwardApplicationMis = async () => {
		setLoading(true)
		await editHouseholdDetails()
		const creds = {
			form_no: params?.id,
			approved_by: userDetails?.emp_id,
			remarks: remarks,
			member_id: memberDetails?.member_code,
		}
		// console.log(creds, 'Approve Application 1', 'handleForwardApplicationMis');
		await axios
			.post(`${url}/admin/forward_mis_asst`, creds)
			.then((res) => {
				Message("success", "Application forwarded!")
				// navigate(routePaths.MIS_ASSISTANT_HOME)
				navigate(-1)
			})
			.catch((err) => {
				Message("error", "Some error occurred while forwarding application.")
			})
		setLoading(false)
	}

	// important Approve Application
	const handleForwardApplicationBM = async () => {
		setLoading(true)
		// await editHouseholdDetails()
		const creds = {
			modified_by: userDetails?.emp_id,
			form_no: params?.id,
			branch_code: userDetails?.brn_code,
			remarks: remarks,
		}
		// console.log(creds, 'Approve Application 1', 'handleForwardApplicationBM');
		await axios
			.post(`${url}/final_submit`, creds)
			.then((res) => {
				Message("success", "Application forwarded!")
				// navigate(routePaths.BM_HOME)
				navigate(-1)
			})
			.catch((err) => {
				Message("error", "Some error occurred while forwarding application.")
			})
		setLoading(false)
	}

	const sendingBackToBM = async () => {
		setLoading(true)
		const creds = {
			remarks: remarks,
			modified_by: userDetails?.emp_id,
			form_no: memberDetails?.form_no,
			member_id: memberDetails?.member_code,
		}
		// console.log(creds, 'Send To BM 1', 'sendingBackToBM');
		await axios
			.post(`${url}/admin/back_to_bm`, creds)
			.then((res) => {
				Message("success", "Sending back to BM successsfully.")
				console.log("Sending back to BM", res?.data)
				// navigate(routePaths.MIS_ASSISTANT_HOME)
				navigate(-1)
			})
			.catch((err) => {
				Message("error", "Error while sending back to bm")
				console.log("Error while sending back to bm")
			})
		setLoading(false)
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
					<div className="">
						<div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
							{/* <div>
								<TDInputTemplateBr
									placeholder="No. of rooms"
									type="number"
									label="No. of rooms"
									name="h_no_of_rooms"
									formControlName={formik.values.h_no_of_rooms}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.h_no_of_rooms && formik.touched.h_no_of_rooms ? (
									<VError title={formik.errors.h_no_of_rooms} />
								) : null}
							</div> */}
							<div>
								<TDInputTemplateBr
									placeholder="Type Parental Address..."
									type="text"
									label={`Parental Address`}
									name="h_parental_address"
									formControlName={formik.values.h_parental_address}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={3}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.h_parental_address &&
								formik.touched.h_parental_address ? (
									<VError title={formik.errors.h_parental_address} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="House Type"
									type="text"
									label="House Type"
									name="h_house_type"
									formControlName={formik.values.h_house_type}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										{
											code: "Abestor",
											name: "Asbestos",
										},
										{
											code: "Concrete Roof",
											name: "Concrete Roof",
										},
										{
											code: "Kaccha",
											name: "Kaccha",
										},
									]}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.h_house_type && formik.touched.h_house_type ? (
									<VError title={formik.errors.h_house_type} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Own or Rent"
									type="text"
									label="Own or Rent"
									name="h_own_rent"
									formControlName={formik.values.h_own_rent}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										{
											code: "Own",
											name: "OWN",
										},
										{
											code: "Rent",
											name: "RENT",
										},
									]}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.h_own_rent && formik.touched.h_own_rent ? (
									<VError title={formik.errors.h_own_rent} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Total Land"
									type="number"
									label="Total Land (In Kathas)"
									name="h_total_land"
									formControlName={formik.values.h_total_land}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									mode={1}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.h_total_land && formik.touched.h_total_land ? (
									<VError title={formik.errors.h_total_land} />
								) : null}
							</div>

							<div>
								<TDInputTemplateBr
									placeholder="Politically Active"
									type="text"
									label="Politically Active"
									name="h_politically_active"
									formControlName={formik.values.h_politically_active}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										{
											code: "Y",
											name: "YES",
										},
										{
											code: "N",
											name: "NO",
										},
									]}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.h_politically_active &&
								formik.touched.h_politically_active ? (
									<VError title={formik.errors.h_politically_active} />
								) : null}
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Own a TV?"
									type="text"
									label="Own a TV?"
									name="h_tv"
									formControlName={formik.values.h_tv}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										{
											code: "Y",
											name: "YES",
										},
										{
											code: "N",
											name: "NO",
										},
									]}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.h_tv && formik.touched.h_tv ? (
									<VError title={formik.errors.h_tv} />
								) : null}
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Own a Bike?"
									type="text"
									label="Own a Bike?"
									name="h_bike"
									formControlName={formik.values.h_bike}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										{
											code: "Y",
											name: "YES",
										},
										{
											code: "N",
											name: "NO",
										},
									]}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.h_bike && formik.touched.h_bike ? (
									<VError title={formik.errors.h_bike} />
								) : null}
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Own a Fridge?"
									type="text"
									label="Own a Fridge?"
									name="h_fridge"
									formControlName={formik.values.h_fridge}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										{
											code: "Y",
											name: "YES",
										},
										{
											code: "N",
											name: "NO",
										},
									]}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.h_fridge && formik.touched.h_fridge ? (
									<VError title={formik.errors.h_fridge} />
								) : null}
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="Own a Washing Machine?"
									type="text"
									label="Own a Washing Machine?"
									name="h_washing_machine"
									formControlName={formik.values.h_washing_machine}
									handleChange={formik.handleChange}
									handleBlur={formik.handleBlur}
									data={[
										{
											code: "Y",
											name: "YES",
										},
										{
											code: "N",
											name: "NO",
										},
									]}
									mode={2}
									disabled={disableCondition(
										userDetails?.id,
										memberDetails?.approval_status
									)}
								/>
								{formik.errors.h_washing_machine &&
								formik.touched.h_washing_machine ? (
									<VError title={formik.errors.h_washing_machine} />
								) : null}
							</div>

							
						</div>

						<div className="mt-10">
							<TDInputTemplateBr
								placeholder="Type Remarks..."
								type="text"
								label={`Remarks`}
								name="remarks"
								// formControlName={remarks}
								formControlName={remarks}
								// formControlName={remarks == null ? RemarkValues.remarks : remarks}
								handleChange={(e) => setRemarks(e.target.value)}
								mode={3}
								// disabled={
								// 	userDetails?.id !== 10 &&
								// 	memberDetails?.approval_status === "S"
								// }
								disabled={disableCondition(
									userDetails?.id,
									memberDetails?.approval_status
								)}
								
							/>
						</div>

						{userDetails?.id == 10 && memberDetails?.approval_status === "S" && (   //previously 3
							<div className="mt-10">
								<BtnComp
									mode="B"
									showUpdateAndReset={false}
									showReject={true}
									onRejectApplication={() => setVisible2(true)}
									showForward={true}
									onForwardApplication={() => setVisible3(true)}
									showSendToBM={false}
									onSendBackToBM={() => setVisible4(true)}
								/>
							</div>
						)}
						{/* {userDetails?.id == 2 && memberDetails?.approval_status === "R" && (
							<div className="mt-10">
								<BtnComp
									mode="B"
									showUpdateAndReset={false}
									showReject={true}
									onRejectApplication={() => setVisible2(true)}
									showForward={true}
									onForwardApplication={() => setVisible3(true)}
								/>
							</div>
						)} */}
						{/* {userDetails?.id == 2  && memberDetails?.approval_status === "U" && (
							<div className="mt-10">
								<BtnComp
									mode="B"
									showUpdateAndReset={false}
									showReject={true}
									onRejectApplication={() => setVisible2(true)}
									showForward={true}
									onForwardApplication={() => setVisible3(true)}
								/>
							</div>
						)} */}

						{/* {!disableCondition(
							userDetails?.id,
							memberDetails?.approval_status
						) && (
							<div className="mt-10">
								<BtnComp mode="A" onReset={formik.resetForm} />
							</div>
						)} */}

						{/* {loanApproveStatus !== "A" && loanApproveStatus !== "R" ? (
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
						)} */}
					</div>
				</form>
			</Spin>

			{/* <DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					editHouseholdDetails()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/> */}

			{/* Approve Popup */}
			<DialogBox
				flag={4}
				onPress={() => setVisible3(!visible3)}
				visible={visible3}
				onPressYes={() => {
					if (!remarks) {
						Message("error", "Please write remarks!")
						setVisible3(!visible3)
						return
					}
					setVisible3(!visible3)
					if (userDetails?.id == 2) {
						handleForwardApplicationBM()
					}
					if (userDetails?.id == 10) {     //previously 3
 						handleForwardApplicationMis()
					}
				}}
				onPressNo={() => setVisible3(!visible3)}
			/>

			{/* Reject Popup */}
			<DialogBox
				flag={4}
				onPress={() => setVisible2(!visible2)}
				visible={visible2}
				onPressYes={() => {
					if (!remarks) {
						Message("error", "Please write remarks!")
						setVisible2(!visible2)
						return
					}
					setVisible2(!visible2)
					handleRejectApplication()
				}}
				onPressNo={() => setVisible2(!visible2)}
			/>

			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					editHouseholdDetails()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>

			{/* Send To BM Popup */}
			<DialogBox
				flag={4}
				onPress={() => setVisible4(!visible4)}
				visible={visible4}
				onPressYes={() => {
					sendingBackToBM()
					setVisible4(!visible4)
				}}
				onPressNo={() => setVisible4(!visible4)}
			/>
			
		</>
	)
}

export default HouseholdDetailsForm

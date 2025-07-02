import React, { useEffect, useState } from "react"
import "../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../Components/BtnComp"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Message } from "../../Components/Message"
import { url } from "../../Address/BaseUrl"
import { Spin, Button, Tag } from "antd"
import { LoadingOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import DialogBox from "../../Components/DialogBox"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import { routePaths } from "../../Assets/Data/Routes"
import { disableInputArray } from "./disableInputArray"
import { disableCondition } from "./disableCondition"
import { calculateAge } from "../../Utils/calculateAge"

function FamilyMemberDetailsForm({ memberDetails }) {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const { loanAppData } = location.state || {}
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const [remarks, setRemarks] = useState(() => "")
	const [educations, setEducations] = useState(() => [])
	const [visible, setVisible] = useState(() => false)
	const [visible2, setVisible2] = useState(() => false)
	const [visible3, setVisible3] = useState(() => false)
	const [visible4, setVisible4] = useState(() => false)

	const [metadataArray, setMetadataArray] = useState(() => [])

	console.log(params, "params")
	console.log(location, "location")
	console.log(memberDetails, "memberDetails")

	const [formArray, setFormArray] = useState([
		{
			sl_no: 0,
			name: "",
			relation: "",
			familyDob: new Date().toLocaleDateString(),
			age: "",
			sex: "",
			education: "",
			studyingOrWorking: "",
			monthlyIncome: "0",
		},
	])

	const handleFormAdd = () => {
		setFormArray((prev) => [
			...prev,
			{
				sl_no: 0,
				name: "",
				relation: "",
				familyDob: new Date().toLocaleDateString(),
				age: "",
				sex: "",
				education: "",
				studyingOrWorking: "",
				monthlyIncome: "0",
			},
		])
	}

	const handleFormRemove = (index) => {
		setFormArray((prev) => prev.filter((_, i) => i !== index))
	}

	const handleInputChange = (index, field, value) => {
		if (formArray[index]) {
			const updatedForm = [...formArray]
			updatedForm[index][field] = value

			if (field === "familyDob") {
				const calculatedAge = calculateAge(value)
				updatedForm[index]["age"] = calculatedAge?.toString() || ""
			}

			setFormArray(updatedForm)

			console.log("Updated formArray:", updatedForm)
		} else {
			console.error(`No form item found at index ${index}`)
		}
	}

	const handleFetchEducations = async () => {
		await axios
			.get(`${url}/get_education`)
			.then((res) => {
				console.log("EDUCATIONSSSSSS====", res?.data)
				setEducations(res?.data)
			})
			.catch((err) => {
				console.log("Some error educations", err)
			})
	}

	useEffect(() => {
		handleFetchEducations()
	}, [])

	const fetchFamilyMemberDetails = async () => {
		setLoading(true)
		await axios
			.get(
				`${url}/admin/fetch_family_dt_web?form_no=${params?.id}&branch_code=${userDetails?.brn_code}`
			)
			.then((res) => {
				console.log("FAMILYYYY DATT", res?.data)
				if (res?.data?.suc === 1) {
					let familyDetailsArray = res?.data?.msg || []

					if (familyDetailsArray?.length > 0) {
						const transformedData = familyDetailsArray.map((member, index) => ({
							sl_no: member.sl_no || index + 1,
							name: member.name || "",
							relation: member.relation || "",
							familyDob:
								new Date(member.family_dob).toISOString().slice(0, 10) || "",
							age: member.age?.toString() || "",
							sex: member.sex || "",
							education: member.education || "",
							studyingOrWorking: member.studyingOrWorking || "",
							monthlyIncome: member.monthlyIncome?.toString() || "",
						}))
						setFormArray(transformedData)
					}
					setRemarks(memberDetails?.remarks)
				}
			})
			.catch((err) => {
				console.log("FAMILYY ERRR", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		fetchFamilyMemberDetails()
	}, [])

	const editFamilyMemberDetails = async () => {
		setLoading(true)
		const creds = {
			form_no: params?.id,
			branch_code: userDetails?.brn_code,
			created_by: userDetails?.emp_name,
			modified_by: userDetails?.emp_id,
			memberdtls: formArray,
			///////
		}
		await axios
			.post(`${url}/admin/edit_family_dtls_web`, creds)
			.then((res) => {
				console.log("FAMILYYYY DTTT", res?.data)
				Message("success", "Updated successfully.")
			})
			.catch((err) => {
				console.log("FAMILYTY ERRR", err)
				Message("error", "Some error occurred while submitting family details.")
			})
		setLoading(false)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
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
		await axios
			.post(`${url}/admin/delete_member_mis`, creds)
			.then((res) => {
				Message("success", "Application rejected!")
				navigate(routePaths.MIS_ASSISTANT_HOME)
			})
			.catch((err) => {
				Message("error", "Some error occurred while rejecting application.")
			})
		setLoading(false)
	}

	// important Send To BM
	const handleForwardApplicationMis = async () => {
		setLoading(true)
		await editFamilyMemberDetails()
		const creds = {
			form_no: params?.id,
			approved_by: userDetails?.emp_id,
			remarks: remarks,
			member_id: memberDetails?.member_code,
		}
		await axios
			.post(`${url}/admin/forward_mis_asst`, creds)
			.then((res) => {
				Message("success", "Application forwarded!")
				navigate(routePaths.MIS_ASSISTANT_HOME)
			})
			.catch((err) => {
				Message("error", "Some error occurred while forwarding application.")
			})
		setLoading(false)
	}

	// important Approve Application
	const handleForwardApplicationBM = async () => {
		setLoading(true)
		await editFamilyMemberDetails()
		const creds = {
			modified_by: userDetails?.emp_id,
			form_no: params?.id,
			branch_code: userDetails?.brn_code,
			remarks: remarks,
		}
		await axios
			.post(`${url}/final_submit`, creds)
			.then((res) => {
				Message("success", "Application forwarded!")
				navigate(routePaths.BM_HOME)
			})
			.catch((err) => {
				Message("error", "Some error occurred while forwarding application.")
			})
		setLoading(false)
	}

	const fetchMetaData = async () => {
		const creds = {
			form_no: params?.id,
			// member_code: memberDetails?.member_code,
			user_type: userDetails?.id,
			approval_status: memberDetails?.approval_status,
		}
		await axios
			.post(`${url}/admin/approved_dtls`, creds)
			.then((res) => {
				console.log("___---___---___---", res?.data)
				setMetadataArray(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRRR fetching metadata", err)
			})
	}

	useEffect(() => {
		fetchMetaData()
	}, [])

	const sendingBackToBM = async () => {
		setLoading(true)
		const creds = {
			remarks: remarks,
			modified_by: userDetails?.emp_id,
			form_no: memberDetails?.form_no,
			member_id: memberDetails?.member_code,
		}
		await axios
			.post(`${url}/admin/back_to_bm`, creds)
			.then((res) => {
				Message("success", "Sending back to BM successsfully.")
				console.log("Sending back to BM", res?.data)
				navigate(routePaths.MIS_ASSISTANT_HOME)
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
				<form onSubmit={handleSubmit}>
					<div className="">
						{formArray?.map((item, i) => (
							<React.Fragment key={i}>
								<div className="grid gap-4 sm:grid-cols-3 sm:gap-6 my-5 justify-center items-center">
									<div>
										<TDInputTemplateBr
											placeholder="Name"
											type="text"
											label="Name"
											name={`${item?.name}_${i}`}
											formControlName={item?.name}
											handleChange={(txt) =>
												handleInputChange(i, "name", txt.target.value)
											}
											mode={1}
											disabled={disableCondition(
												userDetails?.id,
												memberDetails?.approval_status
											)}
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Relation"
											type="text"
											label="Relation"
											name={`${item?.relation}_${i}`}
											formControlName={item?.relation}
											handleChange={(txt) =>
												handleInputChange(i, "relation", txt.target.value)
											}
											mode={1}
											disabled={disableCondition(
												userDetails?.id,
												memberDetails?.approval_status
											)}
										/>
									</div>

									<div>
										<TDInputTemplateBr
											placeholder="Type DOB..."
											type="date"
											label="Date of Birth"
											name={`${item?.familyDob}_${i}`}
											formControlName={item?.familyDob}
											handleChange={(txt) =>
												handleInputChange(i, "familyDob", txt.target.value)
											}
											min={"1900-12-31"}
											mode={1}
											disabled={disableCondition(
												userDetails?.id,
												memberDetails?.approval_status
											)}
										/>
									</div>

									<div>
										{console.log(
											">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
											calculateAge(item?.familyDob)
										)}
										<TDInputTemplateBr
											placeholder="Age"
											type="number"
											label="Age"
											name={`${
												calculateAge(item?.familyDob) || item?.age
											}_${i}`}
											formControlName={
												calculateAge(item?.familyDob) || item?.age
											}
											handleChange={(txt) =>
												handleInputChange(
													i,
													"age",
													calculateAge(item?.familyDob) || txt.target.value
												)
											}
											mode={1}
											disabled={
												calculateAge(item?.familyDob) > 0 ||
												disableCondition(
													userDetails?.id,
													memberDetails?.approval_status
												)
											}
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Choose Gender"
											type="text"
											label="Choose Gender"
											name={`${item?.sex}_${i}`}
											formControlName={item?.sex}
											handleChange={(txt) =>
												handleInputChange(i, "sex", txt.target.value)
											}
											data={[
												{
													code: "M",
													name: "MALE",
												},
												{
													code: "F",
													name: "FEMALE",
												},
												{
													code: "O",
													name: "OTHERS",
												},
											]}
											mode={2}
											disabled={disableCondition(
												userDetails?.id,
												memberDetails?.approval_status
											)}
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Choose Education"
											type="text"
											label="Choose Education"
											name={`${item?.education}_${i}`}
											formControlName={item?.education}
											handleChange={(txt) =>
												handleInputChange(i, "education", txt.target.value)
											}
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
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Study/Work"
											type="text"
											label="Study/Work"
											name={`${item?.studyingOrWorking}_${i}`}
											formControlName={item?.studyingOrWorking}
											handleChange={(txt) =>
												handleInputChange(
													i,
													"studyingOrWorking",
													txt.target.value
												)
											}
											data={[
												{
													code: "Studying",
													name: "STUDYING",
												},
												{
													code: "Working",
													name: "WORKING",
												},
												{
													code: "None",
													name: "NONE",
												},
											]}
											mode={2}
											disabled={disableCondition(
												userDetails?.id,
												memberDetails?.approval_status
											)}
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Monthly Income"
											type="number"
											label="Monthly Income"
											name={`${item?.monthlyIncome}_${i}`}
											formControlName={item?.monthlyIncome}
											handleChange={(txt) =>
												handleInputChange(i, "monthlyIncome", txt.target.value)
											}
											mode={1}
											disabled={disableCondition(
												userDetails?.id,
												memberDetails?.approval_status
											)}
										/>
									</div>
								</div>
								{formArray.length > 1 && (
									<div>
										<Button
											disabled={disableCondition(
												userDetails?.id,
												memberDetails?.approval_status
											)}
											className="rounded-full bg-red-700 text-white"
											onClick={() => handleFormRemove(i)}
											icon={<MinusOutlined />}
										></Button>
									</div>
								)}
								{/* <hr /> */}
							</React.Fragment>
						))}

						<div className="pt-1">
							<Button
								disabled={disableCondition(
									userDetails?.id,
									memberDetails?.approval_status
								)}
								className="rounded-full bg-yellow-400 text-white"
								onClick={handleFormAdd}
								icon={<PlusOutlined />}
							></Button>
						</div>

						<div className="mt-10">
							<TDInputTemplateBr
								placeholder="Type Remarks..."
								type="text"
								label={`Remarks`}
								name="remarks"
								formControlName={remarks}
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
									showSendToBM={true}
									onSendBackToBM={() => setVisible4(true)}
								/>
							</div>
						)}
						{userDetails?.id == 2 && memberDetails?.approval_status === "R" && (
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
						)}
						{userDetails?.id == 2  && memberDetails?.approval_status === "U" && (
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
						)}
					</div>
				</form>
			</Spin>

			{/* <div className="flex flex-col justify-start items-start gap-2">
				{metadataArray?.map((item, i) => (
					<div key={i} className="mt-5">
						<Tag className="text-sm" bordered={false} color="cyan">
							Modified By: {item?.modified_by}
						</Tag>
						<Tag className="text-sm" bordered={false} color="blue">
							Location: {item?.bm_gps_address}
						</Tag>
					</div>
				))}
			</div> */}
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
					editFamilyMemberDetails()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>

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

export default FamilyMemberDetailsForm

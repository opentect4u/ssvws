import React, { useEffect, useState, useRef } from "react"
import "../LoanForm/LoanForm.css"
import "./EditLoanFormMisStyles.css"
import { useParams } from "react-router"
import { useNavigate } from "react-router-dom"
import { FieldArray, Formik, useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Message } from "../../Components/Message"
import { url } from "../../Address/BaseUrl"
import { Spin, Tag } from "antd"
import {
	LoadingOutlined,
	ArrowLeftOutlined,
	ArrowRightOutlined,
} from "@ant-design/icons"
import FormHeader from "../../Components/FormHeader"
import { routePaths } from "../../Assets/Data/Routes"
import { useLocation } from "react-router"
import Sidebar from "../../Components/Sidebar"
import DialogBox from "../../Components/DialogBox"
import { Stepper } from "primereact/stepper"
import { StepperPanel } from "primereact/stepperpanel"
import { Button } from "primereact/button"
import BasicDetailsForm from "../Forms/BasicDetailsForm"
import OccupationDetailsForm from "../Forms/OccupationDetailsForm"
import HouseholdDetailsForm from "../Forms/HouseholdDetailsForm"
import FamilyMemberDetailsForm from "../Forms/FamilyMemberDetailsForm"

const MAX_FILE_SIZE = 200000

function EditGRTFormMis() {
	const params = useParams()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const memberDetailsData = location.state || {}
	const navigate = useNavigate()

	const [metadataArray, setMetadataArray] = useState(() => [])

	console.log(params, "params")
	console.log(location, "location")

	const stepperRef = useRef(null)

	const fetchMetaData = async () => {
		const creds = {
			form_no: params?.id,
			// member_code: memberDetails?.member_code,
			user_type: userDetails?.id,
			approval_status: memberDetailsData?.approval_status,
			branch_code: userDetails?.brn_code,
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

	return (
		<>
			<Sidebar mode={1} />
			<section className=" dark:bg-[#001529] flex justify-center align-middle p-5">
				<div className=" p-5 w-4/5 min-h-screen rounded-3xl">
					{(userDetails?.id === 2 ||
						userDetails?.id === 4 ||
						userDetails?.id === 10 ||
						userDetails?.id === 11) &&
						memberDetailsData?.approval_status === "S" && (
							<div className="flex justify-between">
								{metadataArray?.map((item, i) => (
									<div
										key={i}
										className="ml-14 mt-5 flex flex-col justify-start align-middle items-start gap-2"
									>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											CO: {item?.created_by || "Nil"}, AT:{" "}
											{item?.created_at
												? new Date(item?.created_at).toLocaleString("en-GB")
												: "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											CO Location: {item?.co_gps_address || "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											BM: {item?.modified_by || "Nil"}, AT:{" "}
											{item?.modified_at
												? new Date(item?.modified_at).toLocaleString("en-GB")
												: "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											BM Location: {item?.bm_gps_address || "Nil"}
										</div>
									</div>
								))}

								<div className="mr-14 mt-5">
									<div className="text-sm text-wrap w-96 text-right text-green-600 p-2 flex flex-col justify-center items-end align-middle">
										Approval Status: Sanctioned
										<div className="text-sm text-wrap w-96 italic text-right text-green-600">
											Forwarded from BM to MIS Assistant
										</div>
									</div>
								</div>
							</div>
						)}

					{(userDetails?.id === 2 ||
						userDetails?.id === 4 ||
						userDetails?.id === 10 ||
						userDetails?.id === 11) &&
						memberDetailsData?.approval_status === "A" && (
							<div className="flex justify-between">
								{metadataArray?.map((item, i) => (
									<div
										key={i}
										className="ml-14 mt-5 flex flex-col justify-start align-middle items-start gap-2"
									>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											CO: {item?.created_by || "Nil"}, AT:{" "}
											{item?.created_at
												? new Date(item?.created_at).toLocaleString("en-GB")
												: "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											CO Location: {item?.co_gps_address || "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											BM: {item?.modified_by || "Nil"}, AT:{" "}
											{item?.modified_at
												? new Date(item?.modified_at).toLocaleString("en-GB")
												: "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											BM Location: {item?.bm_gps_address || "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											Approved By: {item?.approved_by || "Nil"}, AT:{" "}
											{item?.approved_at
												? new Date(item?.approved_at).toLocaleString("en-GB")
												: "Nil"}
										</div>
									</div>
								))}

								<div className="mr-14 mt-5">
									<div className="text-sm text-wrap w-96 italic text-right text-purple-600 p-2 flex flex-col justify-center items-end align-middle">
										Approval Status: Approved
										<div className="text-sm text-wrap w-96 italic text-right text-purple-600">
											Approved by MIS Assistant
										</div>
									</div>
								</div>
							</div>
						)}

					{(userDetails?.id === 2 ||
						userDetails?.id === 4 ||
						userDetails?.id === 10 ||
						userDetails?.id === 11) &&
						memberDetailsData?.approval_status === "R" && (
							<div className="flex justify-between">
								{metadataArray?.map((item, i) => (
									<div
										key={i}
										className="ml-14 mt-5 flex flex-col justify-start align-middle items-start gap-2"
									>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											CO: {item?.created_by || "Nil"}, AT:{" "}
											{item?.created_at
												? new Date(item?.created_at).toLocaleString("en-GB")
												: "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											CO Location: {item?.co_gps_address || "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											BM: {item?.modified_by || "Nil"}, AT:{" "}
											{item?.modified_at
												? new Date(item?.modified_at).toLocaleString("en-GB")
												: "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											BM Location: {item?.bm_gps_address || "Nil"}
										</div>
										<div className="text-sm text-wrap w-96 italic text-blue-800">
											Rejected By: {item?.rejected_by || "Nil"}, AT:{" "}
											{item?.rejected_at
												? new Date(item?.rejected_at).toLocaleString("en-GB")
												: "Nil"}
										</div>
									</div>
								))}

								<div className="mr-14 mt-5">
									<div className="text-sm text-wrap w-96 italic text-right text-red-600 p-2 flex flex-col justify-center items-end align-middle">
										Approval Status: Rejected
										<div className="text-sm text-wrap w-96 italic text-right text-red-600">
											Rejected by Mis Assistant
										</div>
									</div>
								</div>
							</div>
						)}

					<div className="w-auto mx-14 my-4">
						<FormHeader text="Pending GRT Preview & Edit" mode={1} />
					</div>
					<Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-blue-800 dark:text-gray-400"
						spinning={loading}
					>
						<div className="card bg-white w-10/12 rounded-3xl p-3 pt-5 mx-auto">
							<Stepper
								ref={stepperRef}
								style={{ flexBasis: "50rem" }}
								orientation="vertical"
								linear={true}
								className="mx-14"
							>
								<StepperPanel header="Basic Details">
									<div className="flex flex-column">
										<div className="border-2 p-5 border-dashed rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
											<BasicDetailsForm memberDetails={memberDetailsData} />
										</div>
									</div>
									<div className="flex py-4">
										<Button
											className="rounded-full p-5 text-white bg-teal-500 border-teal-500 hover:bg-green-600 hover:border-green-600 gap-2 ring-blue-500"
											onClick={() => stepperRef.current.nextCallback()}
										>
											<ArrowRightOutlined />
										</Button>
									</div>
								</StepperPanel>
								<StepperPanel header="Occupation Details">
									<div className="flex flex-column h-12rem">
										<div className="border-2 p-5 border-dashed rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
											<OccupationDetailsForm
												memberDetails={memberDetailsData}
											/>
										</div>
									</div>
									<div className="flex py-4 gap-2">
										<Button
											className="rounded-full p-5 text-white bg-[#DA4167]  border-[#DA4167] hover:bg-[#ac3246] hover:border-[#ac3246] gap-2 ring-red-500"
											onClick={() => stepperRef.current.prevCallback()}
										>
											<ArrowLeftOutlined />
										</Button>
										<Button
											className="rounded-full p-5 text-white bg-teal-500 border-teal-500 hover:bg-green-600 hover:border-green-600 gap-2 ring-blue-500"
											onClick={() => stepperRef.current.nextCallback()}
										>
											<ArrowRightOutlined />
										</Button>
									</div>
								</StepperPanel>
								<StepperPanel header="Household Details">
									<div className="flex flex-column h-12rem">
										<div className="border-2 p-5 border-dashed rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
											<HouseholdDetailsForm memberDetails={memberDetailsData} />
										</div>
									</div>
									<div className="flex py-4 gap-2">
										<Button
											className="rounded-full p-5 text-white bg-[#DA4167]  border-[#DA4167] hover:bg-[#ac3246] hover:border-[#ac3246] gap-2 ring-red-500"
											onClick={() => stepperRef.current.prevCallback()}
										>
											<ArrowLeftOutlined />
										</Button>
										{/* <Button
											className="rounded-full p-5 text-white bg-teal-500 border-teal-500 hover:bg-green-600 hover:border-green-600 gap-2 ring-blue-500"
											onClick={() => stepperRef.current.nextCallback()}
										>
											<ArrowRightOutlined />
										</Button> */}
									</div>
								</StepperPanel>
								{/* <StepperPanel header="Family Member Details">
									<div className="flex flex-column h-12rem">
										<div className="border-2 p-5 border-dashed rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
											<FamilyMemberDetailsForm
												memberDetails={memberDetailsData}
											/>
										</div>
									</div>
									<div className="flex py-4">
										<Button
											className="rounded-full p-5 text-white bg-[#DA4167]  border-[#DA4167] hover:bg-[#ac3246] hover:border-[#ac3246] gap-2 ring-red-500"
											onClick={() => stepperRef.current.prevCallback()}
										>
											<ArrowLeftOutlined />
										</Button>
									</div>
								</StepperPanel> */}
							</Stepper>
						</div>
					</Spin>
				</div>
			</section>

			{/* <DialogBox
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
			/> */}
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

export default EditGRTFormMis

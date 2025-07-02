import React, { useEffect, useState } from "react"
import "../LoanForm/LoanForm.css"
import "./EditLoanFormBMStyles.css"
import { useParams } from "react-router"
import { useNavigate } from "react-router-dom"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import FormHeader from "../../Components/FormHeader"
import { useLocation } from "react-router"
import Sidebar from "../../Components/Sidebar"
import GroupExtendedForm from "../Forms/GroupExtendedForm"
import DisbursmentForm from "../Forms/DisbursmentForm"
import RecoveryForm from "../Forms/RecoveryForm"
import { formatDateToYYYYMMDD } from "../../Utils/formateDate"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import MemberLoanDetailsForm from "../Forms/MemberLoanDetailsForm"

function MemberLoanDetailsBM() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const { loanAppData } = location.state || {}
	const navigate = useNavigate()

	return (
		<>
			<Sidebar mode={2} />
			<section className=" dark:bg-[#001529] flex justify-center align-middle p-5">
				<div className="  p-5 w-4/5 min-h-screen rounded-3xl">
					{/* <div className="ml-14 mt-5 flex flex-col justify-start align-middle items-start gap-2">
						<div className="text-sm text-wrap w-96 italic text-blue-800">
							CO: {recoveryDetailsData?.b_coName || "Nil"}, AT:{" "}
							{new Date(
								recoveryDetailsData?.b_coCreatedAt || "Nil"
							).toLocaleString("en-GB")}
						</div>
						<div className="text-sm text-wrap w-96 italic text-blue-800">
							CO Location: {recoveryDetailsData?.b_coLocation || "Nil"}
						</div>
					</div> */}
					<div className="w-auto mx-14 my-4">
						<FormHeader text="Loan Details Form" mode={2} />
					</div>
					<Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-blue-800 dark:text-gray-400"
						spinning={loading}
					>
						<div className="card border-2 p-5 mx-16 bg-white shadow-lg rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
							<MemberLoanDetailsForm />
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
			/> */}

			{/* <DialogBox
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

export default MemberLoanDetailsBM

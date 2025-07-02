import React, { useEffect, useState } from "react"
import "../LoanForm/LoanForm.css"
import "./EditLoanFormBMStyles.css"
import { useParams } from "react-router"
import { useNavigate } from "react-router-dom"
import { Spin, Tag } from "antd"
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

function EditRecoveryApproveFormBM() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const { loanAppData } = location.state || {}
	const navigate = useNavigate()

	const [recoveryDetailsData, setRecoveryDetailsData] = useState({
		b_loanId: "",
		b_roi: "",
		b_outstanding: "",
		b_period: "",
		b_periodMode: "",
		b_installmentEndDate: "",
		b_installmentPaid: "",
		b_emi: "",
		b_tnxDate: formatDateToYYYYMMDD(new Date()),
		b_amount: "",
		b_principalRecovery: "",
		b_interestRecovery: "",
		b_balance: "",
		b_coName: "",
		b_coLocation: "",
		b_coCreatedAt: "",
	})

	const fetchRecoveryDetails = async () => {
		const creds = {
			group_code: params?.id,
		}
		await axios
			.post(`${url}/admin/view_unapprove_recovery_dtls`, creds)
			.then((res) => {
				console.log("=========Q-out-Q=========", res?.data)

				setRecoveryDetailsData({
					b_loanId: params?.id,
					b_roi: "",
					b_outstanding: "",
					b_period: "",
					b_periodMode: "",
					b_installmentEndDate: "",
					b_installmentPaid: "",
					b_emi: "",
					b_tnxDate: res?.data?.msg[0]?.txn_date,
					b_amount: "",
					b_principalRecovery: res?.data?.msg[0]?.principal_recovery,
					b_interestRecovery: res?.data?.msg[0]?.interest_recovery,
					b_balance: res?.data?.msg[0]?.balance,
					b_coName: res?.data?.msg[0]?.created_by,
					b_coLocation: res?.data?.msg[0]?.trn_addr,
					b_coCreatedAt: res?.data?.msg[0]?.created_at,
				})
			})
			.catch((err) => {
				console.log("QQQQQQQQQQQQQQQ", err)
			})
	}

	useEffect(() => {
		fetchRecoveryDetails()
	}, [])

	return (
		<>
			<Sidebar mode={2} />
			<section className=" dark:bg-[#001529] flex justify-center align-middle p-5">
				{/* {params.id>0 && data && <PrintComp toPrint={data} title={'Department'}/>} */}
				{/* <HeadingTemplate
				text={params.id > 0 ? "Update vendor" : "Add vendor"}
				mode={params.id > 0 ? 1 : 0}
				title={"Vendor"}
				data={params.id && data ? data : ""}
			/> */}
				{/* {JSON.stringify(loanAppData)} */}
				<div className=" p-2 mt-7 w-4/5 min-h-screen rounded-3xl">
					{/* <div className=" mt-5 gap-4 -ml-5 flex flex-col justify-end  items-end">
					<Tag color="#DA4167" className=" p-1 -ml-5">
					
							CO: {recoveryDetailsData?.b_coName || "Nil"}, AT:{" "}
							{new Date(
								recoveryDetailsData?.b_coCreatedAt || "Nil"
							).toLocaleString("en-GB")}
					{" "}|{" "}
						{"  "}	CO Location: {recoveryDetailsData?.b_coLocation || "Nil"}
						</Tag>
					</div> */}
					<div className="w-auto mx-14 my-4">
						<FormHeader text="Recovery Form" mode={2} />
					</div>
					<div className=" mt-5 gap-4 -ml-5 -mb-1 flex flex-col justify-end  items-end">
					<Tag color="#0694A2" className=" py-1 px-3 mr-[6.6%] rounded-t-2xl ">
					
							CO: {recoveryDetailsData?.b_coName || "Nil"}, AT:{" "}
							{new Date(
								recoveryDetailsData?.b_coCreatedAt || "Nil"
							).toLocaleString("en-GB")}
					{" "}|{" "}
						{"  "}	CO Location: {recoveryDetailsData?.b_coLocation || "Nil"}
						</Tag>
					</div>
					<Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-blue-800 dark:text-gray-400"
						spinning={loading}
					>
						<div className="card border-2 p-5 mx-16  rounded-l-3xl rounded-br-3xl rounded-tr-none surface-border bg-white shadow-lg border-round surface-ground flex-auto font-medium">
							<RecoveryForm />
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

export default EditRecoveryApproveFormBM

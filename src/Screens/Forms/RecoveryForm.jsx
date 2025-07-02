import React, { useEffect, useState } from "react"
import "../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../Components/BtnComp"
import VError from "../../Components/VError"
import { useNavigate } from "react-router-dom"
// import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Message } from "../../Components/Message"
import { url } from "../../Address/BaseUrl"
import { Badge, Spin, Card } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../Utils/formateDate"
import DialogBox from "../../Components/DialogBox"
// import { disableInputArray } from "./disableInputArray"
import { disableCondition } from "./disableCondition"
import { getOrdinalSuffix } from "../../Utils/ordinalSuffix"

function RecoveryForm() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const personalDetails = location.state[0] || {}
	const loanType = location.state[1] || "R"
    const [memb_recov_details,setMembRecovDetails] = useState([])
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const [visible, setVisible] = useState(() => false)
	const [visible2, setVisible2] = useState(() => false)
	const [visible3, setVisible3] = useState(() => false)

	const [disburseOrNot, setDisburseOrNot] = useState(() => false)
	const [maxDisburseAmountForAScheme, setMaxDisburseAmountForAScheme] =
		useState(() => "")

	const [purposeOfLoan, setPurposeOfLoan] = useState(() => [])
	const [subPurposeOfLoan, setSubPurposeOfLoan] = useState(() => [])

	const [schemes, setSchemes] = useState(() => [])
	const [funds, setFunds] = useState(() => [])
	const [tnxTypes, setTnxTypes] = useState(() => [])
	const [tnxModes, setTnxModes] = useState(() => [])
	const [banks, setBanks] = useState(() => [])
    
	const [fetchedLoanData, setFetchedLoanData] = useState(() => Object)
	const [fetchedTnxData, setFetchedTnxData] = useState(() => Object)

	// const formattedDob = formatDateToYYYYMMDD(memberDetails?.dob)

	console.log(params, "params")
	console.log(location, "location")
	// console.log(memberDetails, "memberDetails")
	console.log("U/A", loanType)

	const [personalDetailsData, setPersonalDetailsData] = useState({
		b_memCode: "",
		b_clientName: "",
		b_groupName: "",
		b_acc1: "",
		b_acc2: "",
		b_formNo: "",
		b_grtApproveDate: "",
		b_branch: "",
		b_purpose: "",
		b_purposeId: "",
		b_subPurpose: "",
		b_subPurposeId: "",
		b_applicationDate: "",
		b_appliedAmt: "",
	})

	const handleChangePersonalDetails = (e) => {
		const { name, value } = e.target
		setPersonalDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const [disbursementDetailsData, setDisbursementDetailsData] = useState({
		b_scheme: "",
		b_fund: "",
		b_period: "",
		b_roi: "",
		b_mode: "",
		b_disburseAmt: "",
		b_bankCharges: 0,
		b_processingCharges: 0,
		b_dayOfRecovery: "",
	})

	const handleChangeDisburseDetails = (e) => {
		const { name, value } = e.target
		setDisbursementDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const [transactionDetailsData, setTransactionDetailsData] = useState({
		b_tnxDate: formatDateToYYYYMMDD(new Date()),
		b_bankName: "",
		b_chequeOrRefNo: "",
		b_chequeOrRefDate: formatDateToYYYYMMDD(new Date()),
		b_tnxType: "D",
		b_tnxMode: "",
		b_remarks: "",
	})

	const handleChangeTnxDetailsDetails = (e) => {
		const { name, value } = e.target
		setTransactionDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const [installmentDetailsData, setInstallmentDetailsData] = useState({
		b_isntallmentStartDate: "",
		b_isntallmentEndDate: "",
		b_interestAmount: "",
		// b_isntallmentCalculatedAmount: "",
		b_interestEMIAmount: "",
		// b_principleAmount: "",
		b_principleDisbursedAmount: "",
		b_principleEMIAmount: "",
		b_totalEMIAmount: "",
		b_receivable: "",
	})

	const handleChangeInstallmentDetails = (e) => {
		const { name, value } = e.target
		setInstallmentDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

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
		b_credit: "",
		b_currOutstanding: "",
		b_prevOutstanding: "",
		b_tnxID: "",
	})

	const handleChangeRecoveryDetails = (e) => {
		const { name, value } = e.target
		setRecoveryDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
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

	const getBanks = async () => {
		await axios
			.get(`${url}/get_bank`)
			.then((res) => {
				setBanks(res?.data?.msg)
			})
			.catch((err) => {
				Message("error", "Some error while fetching banks.")
				console.log("******", err)
			})
	}

	useEffect(() => {
		getBanks()
	}, [])

	// useEffect(() => {
	// 	if (!disburseOrNot)
	// 		setPersonalDetailsData({
	// 			b_memCode: personalDetails?.member_code || "",
	// 			b_clientName: personalDetails?.client_name || "",
	// 			b_groupName: personalDetails?.group_name || "",
	// 			b_acc1: personalDetails?.acc_no1 || "",
	// 			b_acc2: personalDetails?.acc_no2 || "",
	// 			b_formNo: personalDetails?.form_no || "",
	// 			b_grtApproveDate: personalDetails?.grt_approve_date || "",
	// 			b_branch: personalDetails?.branch_name || "",
	// 			b_purpose: personalDetails?.purpose_id || "",
	// 			b_subPurpose: personalDetails?.sub_pupose || "",
	// 			b_purposeId: personalDetails?.loan_purpose || "",
	// 			b_subPurposeId: personalDetails?.sub_pupose || "",
	// 			b_applicationDate: personalDetails?.application_date || "",
	// 			b_appliedAmt: personalDetails?.applied_amt || "",
	// 		})

	// 	console.log("?????????????????????", personalDetails)
	// }, [])

	const getSchemes = async () => {
		setLoading(true)
		await axios
			.get(`${url}/get_scheme`)
			.then((res) => {
				console.log("==============", res?.data)
				setSchemes(res?.data?.msg)
			})
			.catch((err) => {
				console.log("err", err)
			})
		setLoading(false)
	}

	const getFunds = async () => {
		setLoading(true)
		await axios
			.get(`${url}/get_fund`)
			.then((res) => {
				console.log("--------------", res?.data)
				setFunds(res?.data?.msg)
			})
			.catch((err) => {
				console.log("err", err)
			})
		setLoading(false)
	}

	// const getTnxTypes = async () => {
	// 	await axios.get(`${url}/get_tr_type`).then((res) => {
	// 		console.log("777 --- 777 --- 777", res?.data)
	// 		setTnxTypes(res?.data)
	// 	})
	// }

	// const getTnxModes = async () => {
	// 	await axios.get(`${url}/get_tr_mode`).then((res) => {
	// 		console.log("888 --- 888 --- 888", res?.data)
	// 		setTnxModes(res?.data)
	// 	})
	// }

	useEffect(() => {
		getSchemes()
		getFunds()
		// getTnxTypes()
		// getTnxModes()
	}, [])

	// const getParticularScheme = async (schemeId) => {
	// 	setLoading(true)
	// 	const creds = {
	// 		scheme_id: schemeId,
	// 	}
	// 	await axios
	// 		.post(`${url}/admin/scheme_dtls`, creds)
	// 		.then((res) => {
	// 			console.log("PPP", res?.data)
	// 			setDisbursementDetailsData((prevData) => ({
	// 				...prevData,
	// 				b_scheme: prevData.b_scheme,
	// 				b_fund: prevData.b_fund,
	// 				b_period:
	// 					disbursementDetailsData.b_mode === "Monthly"
	// 						? res?.data?.msg[0]?.max_period
	// 						: disbursementDetailsData.b_mode === "Weekly"
	// 						? res?.data?.msg[0]?.max_period_week
	// 						: "",
	// 				b_roi: res?.data?.msg[0]?.roi,
	// 				// b_mode: res?.data?.msg[0]?.payment_mode,
	// 				b_mode: disbursementDetailsData.b_mode || "",

	// 				b_disburseAmt: prevData.b_disburseAmt || "",
	// 				b_bankCharges: prevData.b_bankCharges || "",
	// 				b_processingCharges: prevData.b_processingCharges || "",
	// 			}))
	// 			setMaxDisburseAmountForAScheme(res?.data?.msg[0]?.max_amt)
	// 		})
	// 		.catch((err) => {
	// 			console.log("errrr", err)
	// 		})
	// 	setLoading(false)
	// }

	// useEffect(() => {
	// 	if (!disburseOrNot) {
	// 		getParticularScheme(disbursementDetailsData.b_scheme)
	// 	}
	// }, [disbursementDetailsData.b_scheme, disbursementDetailsData.b_mode])

	// const getPurposeOfLoan = async () => {
	// 	setLoading(true)
	// 	await axios
	// 		.get(`${url}/get_purpose`)
	// 		.then((res) => {
	// 			console.log("------------", res?.data)
	// 			setPurposeOfLoan(res?.data?.msg)
	// 		})
	// 		.catch((err) => {
	// 			console.log("+==========+", err)
	// 		})
	// 	setLoading(false)
	// }

	// useEffect(() => {
	// 	getPurposeOfLoan()
	// }, [])

	// const getSubPurposeOfLoan = async (purpId) => {
	// 	setLoading(true)
	// 	await axios
	// 		.get(`${url}/get_sub_purpose?purp_id=${purpId}`)
	// 		.then((res) => {
	// 			console.log("------------", res?.data)
	// 			setSubPurposeOfLoan(res?.data?.msg)
	// 		})
	// 		.catch((err) => {
	// 			console.log("+==========+", err)
	// 		})
	// 	setLoading(false)
	// }

	// useEffect(() => {
	// 	getSubPurposeOfLoan(personalDetailsData?.b_purposeId)
	// }, [personalDetailsData?.b_purposeId])

	// const fetchSearchedApplication = async () => {
	// 	setLoading(true)
	// 	const creds = {
	// 		member_dtls: personalDetails?.member_code,
	// 	}
	// 	await axios
	// 		.post(`${url}/admin/fetch_loan_application_dtls`, creds)
	// 		.then((res) => {
	// 			console.log("KKKKKKKKkkkkkKKKKKkkkkKKKK", res?.data)
	// 			// setLoanApplications(res?.data?.msg)
	// 			setPersonalDetailsData({
	// 				b_memCode: res?.data?.msg[0]?.member_code,
	// 				b_clientName: res?.data?.msg[0]?.client_name,
	// 				b_groupName: res?.data?.msg[0]?.group_name,
	// 				b_acc1: res?.data?.msg[0]?.acc_no1,
	// 				b_acc2: res?.data?.msg[0]?.acc_no2,
	// 				b_formNo: res?.data?.msg[0]?.form_no,
	// 				b_grtApproveDate: res?.data?.msg[0]?.grt_approve_date,
	// 				b_branch: res?.data?.msg[0]?.branch_name,
	// 				b_purpose: res?.data?.msg[0]?.purpose_id,
	// 				b_purposeId: res?.data?.msg[0]?.loan_purpose,
	// 				b_subPurpose: res?.data?.msg[0]?.sub_pupose,
	// 				b_subPurposeId: res?.data?.msg[0]?.sub_pupose,
	// 				b_applicationDate: res?.data?.msg[0]?.application_date,
	// 				b_appliedAmt: res?.data?.msg[0]?.applied_amt,
	// 			})
	// 		})
	// 		.catch((err) => {
	// 			Message("error", "Some error occurred while searching...")
	// 		})
	// 	setLoading(false)
	// }

	const fetchRecoveryDetails = async () => {
		const creds = {
			group_code: params?.id,
		}
		await axios
			.post(`${url}/admin/view_unapprove_recovery_dtls`, creds)
			.then((res) => {
				console.log("=========QQ=========", res?.data)
                setMembRecovDetails(res?.data?.memb_dtls_recov)
				setPersonalDetailsData({
					b_memCode: res?.data?.msg[0]?.member_code,
					b_clientName: res?.data?.msg[0]?.client_name,
					b_groupName: res?.data?.msg[0]?.group_name,
					b_acc1: "",
					b_acc2: "",
					b_formNo: "",
					b_grtApproveDate: "",
					b_branch: res?.data?.msg[0]?.branch_name,
					b_purpose: "",
					b_purposeId: "",
					b_subPurpose: "",
					b_subPurposeId: "",
					b_applicationDate: "",
					b_appliedAmt: "",
				})

				setDisbursementDetailsData({
					b_scheme: res?.data?.msg[0]?.scheme_id,
					b_fund: res?.data?.msg[0]?.fund_id,
					b_period: res?.data?.msg[0]?.period,
					b_roi: res?.data?.msg[0]?.curr_roi,
					b_mode: res?.data?.msg[0]?.period_mode,
					b_disburseAmt: res?.data?.msg[0]?.disburse_amount,
					b_bankCharges: "0",
					b_processingCharges: "0",
					b_dayOfRecovery: "",
				})

				setInstallmentDetailsData({
					b_isntallmentStartDate: res?.data?.msg[0]?.instl_start_dt,
					b_isntallmentEndDate: res?.data?.msg[0]?.instl_end_dt,
					b_interestAmount: res?.data?.msg[0]?.interest_amount,
					// b_isntallmentCalculatedAmount: "",
					b_interestEMIAmount: res?.data?.msg[0]?.interest_emi,
					// b_principleAmount: "",
					b_principleDisbursedAmount: res?.data?.msg[0]?.principal_amt,
					b_principleEMIAmount: res?.data?.msg[0]?.principle_emi_amount,
					b_totalEMIAmount: res?.data?.msg[0]?.total_emi_amount,
					b_receivable: "",
				})

				setRecoveryDetailsData({
					b_loanId: params?.id,
					b_roi: "",
					b_outstanding: "",
					b_period: "",
					b_periodMode: "",
					b_installmentEndDate: "",
					b_installmentPaid: "",
					b_emi: "",
					b_tnxDate: res?.data?.msg[0]?.transaction_date,
					b_amount: "",
					b_principalRecovery: res?.data?.msg[0]?.principal_recovery,
					b_interestRecovery: res?.data?.msg[0]?.interest_recovery,
					b_balance: res?.data?.msg[0]?.balance,
					b_coName: res?.data?.msg[0]?.created_by,
					b_coLocation: res?.data?.msg[0]?.trn_addr,
					b_coCreatedAt: res?.data?.msg[0]?.created_at,
					b_credit: res?.data?.msg[0]?.credit,
					b_currOutstanding: res?.data?.msg[0]?.balance,
					b_prevOutstanding: res?.data?.msg[0]?.interest_total,
					b_tnxID: res?.data?.msg[0]?.payment_id,
				})
			})
			.catch((err) => {
				console.log("QQQQQQQQQQQQQQQ", err)
			})
	}

	const checkDisbursedOrNot = async () => {
		setLoading(true)
		const creds = {
			form_no: personalDetails?.form_no,
			// form_no: personalDetails?.grt_form_no,
		}
		await axios
			.post(`${url}/admin/fetch_existing_loan`, creds)
			.then((res) => {
				console.log("checkDisbursedOrNot --------+++++++", res?.data)
				if (loanType === "R") {
					fetchRecoveryDetails(res?.data?.loan_dt?.loan_id)
				}
				setDisburseOrNot(res?.data?.msg)
				setFetchedLoanData(res?.data?.loan_dt)
				setFetchedTnxData(res?.data?.loan_trans)

				// setDisbursementDetailsData({
				// 	b_scheme: res?.data?.loan_dt?.scheme_id || "",
				// 	b_fund: res?.data?.loan_dt?.fund_id || "",
				// 	b_period: res?.data?.loan_dt?.period || "",
				// 	b_roi: res?.data?.loan_dt?.curr_roi || "",
				// 	b_mode: res?.data?.loan_dt?.period_mode || "",
				// 	b_disburseAmt: res?.data?.loan_dt?.prn_disb_amt || "",
				// 	b_dayOfRecovery: res?.data?.loan_dt?.recovery_day || "",
				// 	b_bankCharges: res?.data?.loan_trans?.bank_charge || 0,
				// 	b_processingCharges: res?.data?.loan_trans?.proc_charge || 0,
				// })

				// setTransactionDetailsData({
				// 	b_tnxDate: res?.data?.loan_dt?.last_trn_dt
				// 		? formatDateToYYYYMMDD(new Date(res?.data?.loan_dt?.last_trn_dt))
				// 		: formatDateToYYYYMMDD(new Date()),
				// 	b_bankName: res?.data?.loan_trans?.bank_name || "",
				// 	b_chequeOrRefNo: res?.data?.loan_trans?.cheque_id || "",
				// 	b_chequeOrRefDate: res?.data?.loan_trans?.chq_dt
				// 		? formatDateToYYYYMMDD(new Date(res?.data?.loan_trans?.chq_dt))
				// 		: formatDateToYYYYMMDD(new Date()),
				// 	b_tnxType: res?.data?.loan_trans?.tr_type || "D",
				// 	b_tnxMode: res?.data?.loan_trans?.tr_mode || "",
				// 	b_remarks: res?.data?.loan_trans?.particulars || "",
				// })

				// if (res?.data?.msg) {
				// 	fetchSearchedApplication()
				// 	setInstallmentDetailsData({
				// 		b_isntallmentStartDate: res?.data?.loan_dt?.instl_start_dt || "",
				// 		b_isntallmentEndDate: res?.data?.loan_dt?.instl_end_dt || "",
				// 		b_interestAmount: res?.data?.loan_dt?.intt_amt || "",
				// 		b_interestEMIAmount: res?.data?.loan_dt?.intt_emi || "",
				// 		b_principleDisbursedAmount: res?.data?.loan_dt?.prn_disb_amt || "",
				// 		b_principleEMIAmount: res?.data?.loan_dt?.prn_emi || "",
				// 		b_totalEMIAmount: res?.data?.loan_dt?.tot_emi || "",
				// 		b_receivable:
				// 			Math.round(
				// 				+res?.data?.loan_dt?.prn_disb_amt +
				// 					+res?.data?.loan_dt?.intt_amt
				// 			).toFixed(2) || "",
				// 	})
				// }
			})
			.catch((err) => {
				Message("error", "Some error during fetching the status of the form.")
			})
		setLoading(false)
	}

	useEffect(() => {
		checkDisbursedOrNot()
	}, [])

	// useEffect(() => {
	// 	if (approvalStat === "A") {
	// 		fetchRecoveryDetails()
	// 	}
	// }, [])

	const recoveryLoanApprove = async () => {
		setLoading(true)
		const creds = {
			approved_by: userDetails?.emp_id,
			// loan_id: params?.id,
			loan_id: memb_recov_details.map(e=>e.loan_id),
		}
		console.log(creds)
		await axios
			.post(`${url}/admin/approve_recovery_loan`, creds)
			.then((res) => {
				console.log("*************^&^^^^^", res?.data)
				Message("success", res?.data?.msg)
				navigate(-1)
			})
			.catch((err) => {
				console.log("ggggggggggggggg", err)
			})
		setLoading(false)
	}

	const recoveryLoanReject = async () => {
		setLoading(true)
		const creds = {
			loan_id: params?.id,
			payment_id: recoveryDetailsData?.b_tnxID,
		}
		await axios
			.post(`${url}/admin/delete_recov_trans`, creds)
			.then((res) => {
				console.log("RESSSS DELELTEEE LOANNNNN TNXXXX", res?.data)

				Message("success", res?.data?.msg)
				navigate(-1)
			})
			.catch((err) => {
				console.log("ERRRR TNXXX DEL", err)
			})
		setLoading(false)
	}

	//////////////////////////////////////////////////
	//////////////////////////////////////////////////

	const onSubmit = (e) => {
		e.preventDefault()

		setVisible(true)
	}

	return (
		<>
			
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<form onSubmit={onSubmit}>
					<div>
					

						{/* ////////////////////////////////////////////////////// */}

						{loanType === "R" && (
							<div>
								{/* <div className="w-full my-10 border-t-4 border-gray-500 border-dashed"></div> */}
								<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
									<div className="text-xl mb-2 text-[#DA4167] font-semibold underline">
										Recovery Details
									</div>
								</div>
								<div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
									{/* <div>
										<TDInputTemplateBr
											placeholder="Loan ID..."
											type="text"
											label="Loan ID"
											name="b_loanId"
											formControlName={recoveryDetailsData?.b_loanId || ""}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div> */}
									{/* <div>
										<TDInputTemplateBr
											placeholder="Rate of Interest..."
											type="number"
											label="Rate of Interest"
											name="b_roi"
											formControlName={recoveryDetailsData?.b_roi || ""}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div> */}
									{/* <div>
										<TDInputTemplateBr
											placeholder="Outstanding..."
											type="number"
											label="Outstanding"
											name="b_outstanding"
											formControlName={recoveryDetailsData?.b_outstanding || ""}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Period..."
											type="number"
											label="Period"
											name="b_period"
											formControlName={recoveryDetailsData?.b_period || ""}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Period Mode..."
											type="text"
											label="Period Mode"
											name="b_periodMode"
											formControlName={recoveryDetailsData?.b_periodMode || ""}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div> */}
									<div className="sm:col-span-4">
										<TDInputTemplateBr
											placeholder="Transaction Date..."
											type="text"
											label="Transaction Date"
											name="b_tnxDate"
											formControlName={
												recoveryDetailsData?.b_tnxDate
													? new Date(
															recoveryDetailsData?.b_tnxDate
													  )?.toLocaleDateString("en-GB")
													: ""
											}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div>
									{/* <div>
										<TDInputTemplateBr
											placeholder="Principal Recovery..."
											type="text"
											label="Principal Recovery"
											name="b_principalRecovery"
											formControlName={
												recoveryDetailsData?.b_principalRecovery || ""
											}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Interest Recovery..."
											type="text"
											label="Interest Recovery"
											name="b_interestRecovery"
											formControlName={
												recoveryDetailsData?.b_interestRecovery || ""
											}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div> */}
									{/* ================Somnath====================== */}
									{/* <div>
										<TDInputTemplateBr
											placeholder="Previous Outstanding..." // Previous Outstanding
											type="text"
											label="Previous Outstanding"
											name="b_prevOutstanding"
											formControlName={
												recoveryDetailsData?.b_prevOutstanding || ""
											}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Credit..."
											type="text"
											label="Credit"
											name="b_credit"
											formControlName={recoveryDetailsData?.b_credit || ""}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div> */}
									{/* =======================Somnath=============== */}
									{/* <div>
										<TDInputTemplateBr
											placeholder="Installment End Date..."
											type="text"
											label="Installment End Date"
											name="b_installmentEndDate"
											formControlName={
												recoveryDetailsData?.b_installmentEndDate || ""
											}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Installment Paid..."
											type="text"
											label="Installment Paid"
											name="b_installmentPaid"
											formControlName={
												recoveryDetailsData?.b_installmentPaid || ""
											}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div> */}
									{/* ==============Somnath================================= */}
									{/* <div>
										<TDInputTemplateBr
											placeholder="Current Outstanding..."
											type="text"
											label="Current Outstanding"
											name="b_currOutstanding"
											formControlName={
												recoveryDetailsData?.b_currOutstanding || ""
											}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div> */}
									{/* =====================Somnath================================ */}
									



									{/* <div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Collected Amount..."
											type="text"
											label="Collected Amount"
											name="b_amount"
											formControlName={recoveryDetailsData?.b_amount || ""}
											handleChange={handleChangeRecoveryDetails}
											mode={1}
											disabled
										/>
									</div> */}
								</div>
								<div class="relative overflow-x-auto">
    <table class="w-full text-sm  rounded-t-md my-3 text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-[12px] rounded-t-md text-gray-200 uppercase bg-slate-800 dark:bg-gray-700 dark:text-gray-400">
            <tr>
			<th scope="col" class="px-6 py-3">
                    Member
                </th>
               
                <th scope="col" class="px-6 py-3">
                    Previous Outstanding
                </th>
                <th scope="col" class="px-6 py-3">
                    Principle
                </th>
                <th scope="col" class="px-6 py-3">
                    Interest
                </th>
				<th scope="col" class="px-6 py-3">
                    Current Outstanding
                </th>
            </tr>
        </thead>
        <tbody>
           {memb_recov_details.map(item=> <tr class="bg-white border-2 border-b-pink-200 dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-3 font-bold text-[#DA4167] whitespace-nowrap dark:text-white">
                    {item.client_name}
                </th>
                <td class="px-6 py-3">
                    {item.prev_outstanding}
                </td>
                <td class="px-6 py-3">
                    {item.prn_amt}
                </td>
                <td class="px-6 py-3">
                    {item.intt_amt}
                </td>
				<td class="px-6 py-3">
                    {item.curr_outstanding}
                </td>
            </tr>)}
            {/* <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Microsoft Surface Pro
                </th>
                <td class="px-6 py-4">
                    White
                </td>
                <td class="px-6 py-4">
                    Laptop PC
                </td>
                <td class="px-6 py-4">
                    $1999
                </td>
            </tr>
            <tr class="bg-white dark:bg-gray-800">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Magic Mouse 2
                </th>
                <td class="px-6 py-4">
                    Black
                </td>
                <td class="px-6 py-4">
                    Accessories
                </td>
                <td class="px-6 py-4">
                    $99
                </td>
            </tr> */}
        </tbody>
    </table>
</div>
								{loanType === "R" && (
									<div className="mt-10">
										<BtnComp
											mode="N"
											showUpdateAndReset={false}
											showReject={true}
											onRejectApplication={() => setVisible2(true)}
											showForward={true}
											onForwardApplication={() => setVisible(true)}
										/>
									</div>
								)}
							</div>
						)}
					</div>
				</form>
			</Spin>

			{/* For Approve */}
			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					recoveryLoanApprove()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>

			{/* For Reject */}
			<DialogBox
				flag={4}
				onPress={() => setVisible2(!visible2)}
				visible={visible2}
				onPressYes={() => {
					// handleApproveLoanDisbursement()
					recoveryLoanReject()
					setVisible2(!visible2)
				}}
				onPressNo={() => setVisible2(!visible2)}
			/>

			{/* <DialogBox
				flag={4}
				onPress={() => setVisible3(!visible3)}
				visible={visible3}
				onPressYes={() => {
					// handleRejectLoanDisbursement()
					setVisible3(!visible3)
				}}
				onPressNo={() => setVisible3(!visible3)}
			/> */}
		</>
	)
}

export default RecoveryForm

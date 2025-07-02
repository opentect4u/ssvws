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

function DisbursmentForm() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const personalDetails = location.state || {}

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

	const [fetchedLoanData, setFetchedLoanData] = useState(() => Object)
	const [fetchedTnxData, setFetchedTnxData] = useState(() => Object)

	// const formattedDob = formatDateToYYYYMMDD(memberDetails?.dob)

	console.log(params, "params")
	console.log(location, "location")
	// console.log(memberDetails, "memberDetails")

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

	useEffect(() => {
		setPersonalDetailsData({
			b_memCode: personalDetails?.member_code || "",
			b_clientName: personalDetails?.client_name || "",
			b_groupName: personalDetails?.group_name || "",
			b_acc1: personalDetails?.acc_no1 || "",
			b_acc2: personalDetails?.acc_no2 || "",
			b_formNo: personalDetails?.form_no || "",
			b_grtApproveDate: personalDetails?.grt_approve_date || "",
			b_branch: personalDetails?.branch_name || "",
			b_purpose: personalDetails?.purpose_id || "",
			b_subPurpose: personalDetails?.sub_purp_name || "",
			b_purposeId: personalDetails?.loan_purpose || "",
			b_subPurposeId: personalDetails?.sub_pupose || "",
			b_applicationDate: personalDetails?.application_date || "",
			b_appliedAmt: personalDetails?.applied_amt || "",
		})

		console.log("?????????????????????", personalDetails)
	}, [])

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

	const getTnxTypes = async () => {
		await axios.get(`${url}/get_tr_type`).then((res) => {
			console.log("777 --- 777 --- 777", res?.data)
			setTnxTypes(res?.data)
		})
	}

	const getTnxModes = async () => {
		await axios.get(`${url}/get_tr_mode`).then((res) => {
			console.log("888 --- 888 --- 888", res?.data)
			setTnxModes(res?.data)
		})
	}

	useEffect(() => {
		getSchemes()
		getFunds()
		getTnxTypes()
		getTnxModes()
	}, [])

	const getParticularScheme = async (schemeId) => {
		setLoading(true)
		const creds = {
			scheme_id: schemeId,
		}
		await axios
			.post(`${url}/admin/scheme_dtls`, creds)
			.then((res) => {
				console.log("PPP", res?.data)
				// setDisbursementDetailsData({
				// 	b_scheme: disbursementDetailsData.b_scheme,
				// 	b_fund: disbursementDetailsData.b_fund,
				// 	b_period: res?.data?.msg[0]?.max_period,
				// 	b_roi: res?.data?.msg[0]?.roi,
				// 	b_mode: res?.data?.msg[0]?.payment_mode,
				// 	b_disburseAmt: "",
				// 	b_bankCharges: "",
				// 	b_processingCharges: "",
				// })

				setDisbursementDetailsData((prevData) => ({
					...prevData,
					b_scheme: prevData.b_scheme,
					b_fund: prevData.b_fund,
					b_period: res?.data?.msg[0]?.max_period,
					b_roi: res?.data?.msg[0]?.roi,
					b_mode: res?.data?.msg[0]?.payment_mode,

					b_disburseAmt: prevData.b_disburseAmt || "",
					b_bankCharges: prevData.b_bankCharges || "",
					b_processingCharges: prevData.b_processingCharges || "",
				}))
				setMaxDisburseAmountForAScheme(res?.data?.msg[0]?.max_amt)
			})
			.catch((err) => {
				console.log("errrr", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		getParticularScheme(disbursementDetailsData.b_scheme)
	}, [disbursementDetailsData.b_scheme])

	const getPurposeOfLoan = async () => {
		setLoading(true)
		await axios
			.get(`${url}/get_purpose`)
			.then((res) => {
				console.log("------------", res?.data)
				setPurposeOfLoan(res?.data?.msg)
			})
			.catch((err) => {
				console.log("+==========+", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		getPurposeOfLoan()
	}, [])

	const getSubPurposeOfLoan = async (purpId) => {
		setLoading(true)
		await axios
			.get(`${url}/get_sub_purpose?purp_id=${purpId}`)
			.then((res) => {
				console.log("------------", res?.data)
				setSubPurposeOfLoan(res?.data?.msg)
			})
			.catch((err) => {
				console.log("+==========+", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		getSubPurposeOfLoan(personalDetailsData?.b_purposeId)
	}, [personalDetailsData?.b_purposeId])

	const fetchSearchedApplication = async () => {
		setLoading(true)
		const creds = {
			member_dtls: personalDetails?.member_code,
		}
		await axios
			.post(`${url}/admin/fetch_loan_application_dtls`, creds)
			.then((res) => {
				console.log("KKKKKKKKkkkkkKKKKKkkkkKKKK", res?.data)
				// setLoanApplications(res?.data?.msg)
				setPersonalDetailsData({
					b_memCode: res?.data?.msg[0]?.member_code,
					b_clientName: res?.data?.msg[0]?.client_name,
					b_groupName: res?.data?.msg[0]?.group_name,
					b_acc1: res?.data?.msg[0]?.acc_no1,
					b_acc2: res?.data?.msg[0]?.acc_no2,
					b_formNo: res?.data?.msg[0]?.form_no,
					b_grtApproveDate: res?.data?.msg[0]?.grt_approve_date,
					b_branch: res?.data?.msg[0]?.branch_name,
					b_purpose: res?.data?.msg[0]?.purpose_id,
					b_purposeId: res?.data?.msg[0]?.loan_purpose,
					b_subPurpose: res?.data?.msg[0]?.sub_purp_name,
					b_subPurposeId: res?.data?.msg[0]?.sub_pupose,
					b_applicationDate: res?.data?.msg[0]?.application_date,
					b_appliedAmt: res?.data?.msg[0]?.applied_amt,
				})
			})
			.catch((err) => {
				Message("error", "Some error occurred while searching...")
			})
		setLoading(false)
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
				setDisburseOrNot(res?.data?.msg)
				setFetchedLoanData(res?.data?.loan_dt)
				setFetchedTnxData(res?.data?.loan_trans)

				setDisbursementDetailsData({
					b_scheme: res?.data?.loan_dt?.scheme_id || "",
					b_fund: res?.data?.loan_dt?.fund_id || "",
					b_period: res?.data?.loan_dt?.period || "",
					b_roi: res?.data?.loan_dt?.curr_roi || "",
					b_mode: res?.data?.loan_dt?.period_mode || "",
					b_disburseAmt: res?.data?.loan_dt?.prn_disb_amt || "",
					b_bankCharges: res?.data?.loan_trans?.bank_charge || 0,
					b_processingCharges: res?.data?.loan_trans?.proc_charge || 0,
				})

				setTransactionDetailsData({
					b_tnxDate: res?.data?.loan_dt?.last_trn_dt
						? formatDateToYYYYMMDD(new Date(res?.data?.loan_dt?.last_trn_dt))
						: formatDateToYYYYMMDD(new Date()),
					b_bankName: res?.data?.loan_trans?.bank_name || "",
					b_chequeOrRefNo: res?.data?.loan_trans?.cheque_id || "",
					b_chequeOrRefDate: res?.data?.loan_trans?.chq_dt
						? formatDateToYYYYMMDD(new Date(res?.data?.loan_trans?.chq_dt))
						: formatDateToYYYYMMDD(new Date()),
					b_tnxType: res?.data?.loan_trans?.tr_type || "D",
					b_tnxMode: res?.data?.loan_trans?.tr_mode || "",
					b_remarks: res?.data?.loan_trans?.particulars || "",
				})

				if (res?.data?.msg) {
					fetchSearchedApplication()
					setInstallmentDetailsData({
						b_isntallmentStartDate: res?.data?.loan_dt?.instl_start_dt || "",
						b_isntallmentEndDate: res?.data?.loan_dt?.instl_end_dt || "",
						b_interestAmount: res?.data?.loan_dt?.intt_amt || "",
						b_interestEMIAmount: res?.data?.loan_dt?.intt_emi || "",
						b_principleDisbursedAmount: res?.data?.loan_dt?.prn_disb_amt || "",
						b_principleEMIAmount: res?.data?.loan_dt?.prn_emi || "",
						b_totalEMIAmount: res?.data?.loan_dt?.tot_emi || "",
						b_receivable:
							Math.round(
								+res?.data?.loan_dt?.prn_disb_amt +
									+res?.data?.loan_dt?.intt_amt
							).toFixed(2) || "",
					})
				}
			})
			.catch((err) => {
				Message("error", "Some error during fetching the status of the form.")
			})
		setLoading(false)
	}

	useEffect(() => {
		checkDisbursedOrNot()
	}, [])

	//////////////////////////////////////////////////
	//////////////////////////////////////////////////

	const onSubmit = (e) => {
		e.preventDefault()

		setVisible(true)
	}

	const onReset = async () => {
		console.log("onreset called")
		setDisbursementDetailsData({
			b_scheme: "",
			b_fund: "",
			b_period: "",
			b_roi: "",
			b_mode: "",
			b_disburseAmt: "",
			b_bankCharges: "",
			b_processingCharges: "",
		})
		setTransactionDetailsData({
			b_tnxDate: "",
			b_bankName: "",
			b_chequeOrRefNo: "",
			b_chequeOrRefDate: "",
			b_tnxType: "",
			b_tnxMode: "",
			b_remarks: "",
		})
	}

	const handleSubmitDisbursementForm = async () => {
		setLoading(true)
		const creds = {
			branch_code: personalDetails?.branch_code || "",
			group_code: personalDetails?.prov_grp_code || "",
			member_code: personalDetails?.member_code || "",
			grt_form_no: personalDetails?.form_no || "",
			purpose: personalDetailsData?.b_purposeId || "",
			sub_purpose: personalDetailsData?.b_subPurposeId || "",
			applied_amt: personalDetails?.applied_amt || "",
			scheme_id: disbursementDetailsData?.b_scheme || "",
			fund_id: disbursementDetailsData?.b_fund || "",
			period: disbursementDetailsData?.b_period || "",
			curr_roi: disbursementDetailsData?.b_roi || "",
			od_roi: "0",
			prn_disb_amt: disbursementDetailsData?.b_disburseAmt || "",
			old_prn_amt: "0",
			od_intt_amt: "0",
			period_mode: disbursementDetailsData?.b_mode || "",
			created_by: userDetails?.emp_id || "",
			loan_code: params?.id || "",
			trans_date: transactionDetailsData?.b_tnxDate || "",
			particulars: transactionDetailsData?.b_remarks || "",
			bank_name: transactionDetailsData?.b_bankName || "",
			bank_charge: disbursementDetailsData?.b_bankCharges || "",
			proc_charge: disbursementDetailsData?.b_processingCharges || "",
			tr_type: transactionDetailsData?.b_tnxType || "",
			tr_mode: transactionDetailsData?.b_tnxMode || "",
			cheque_id: transactionDetailsData?.b_chequeOrRefNo || "",
			chq_dt: transactionDetailsData?.b_chequeOrRefDate || "",
			// deposit_by: "",
			// bill_no: "",
			// trn_lat: "",
			// trn_long: "",
		}
		await axios
			.post(`${url}/admin/save_loan_transaction`, creds)
			.then((res) => {
				console.log("Disbursement initiated successfully", res?.data)
				Message("success", "Submitted successfully.")
				navigate(-1)
			})
			.catch((err) => {
				Message(
					"error",
					"Some error occurred while submitting disbursement form!"
				)
				console.log("DDEEERRR", err)
			})
		setLoading(false)
	}

	const handleApproveLoanDisbursement = async () => {
		setLoading(true)
		const creds = {
			approved_by: userDetails?.emp_id || "",
			loan_id: personalDetails?.loan_id || "",
		}
		await axios
			.post(`${url}/admin/approve_loan_disbursement`, creds)
			.then((res) => {
				console.log("&&&&&&&&&&&&", res?.data)
				Message("success", "Loan approved.")
				navigate(-1)
			})
			.catch((err) => {
				console.log("ERRR - APPROVE", err)
			})
		setLoading(false)
	}

	const handleRejectLoanDisbursement = async () => {
		setLoading(true)
		const creds = {
			loan_id: personalDetails?.loan_id || "",
		}
		await axios
			.post(`${url}/admin/delete_apply_loan`, creds)
			.then((res) => {
				console.log("@@@@@@@@@@@@", res?.data)
				Message("success", "Loan deleted successfullly.")
				navigate(-1)
			})
			.catch((err) => {
				console.log("ERRR - REJECT", err)
			})
		setLoading(false)
	}

	return (
		<>
			{disburseOrNot && (
				<Badge.Ribbon
					className="bg-slate-500 absolute top-10 z-10"
					text={"Disbursement Initiated"}
					style={{
						fontSize: 17,
						width: 200,
						height: 25,
						justifyContent: "start",
						alignItems: "center",
						textAlign: "center",
					}}
				></Badge.Ribbon>
			)}
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<form onSubmit={onSubmit}>
					<div>
						<div>
							<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
								<div className="text-xl mb-2 text-lime-800 font-semibold underline">
									1. Personal Details
								</div>
							</div>
							<div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
								<div className="sm:col-span-4 bg-slate-200 border-slate-200 text-lime-900 p-5 rounded-2xl grid grid-cols-4 gap-5">
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Group name..."
											type="text"
											label="Group Name"
											name="b_groupName"
											formControlName={personalDetailsData?.b_groupName}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Account No. 1..."
											type="text"
											label="Account No. 1"
											name="b_acc1"
											formControlName={personalDetailsData?.b_acc1}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Account No. 2..."
											type="text"
											label="Account No. 2"
											name="b_acc2"
											formControlName={personalDetailsData?.b_acc2}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Member Code"
										type="text"
										label="Member Code"
										name="b_memCode"
										formControlName={personalDetailsData?.b_memCode}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Type member name..."
										type="text"
										label="Member Name"
										name="b_clientName"
										formControlName={personalDetailsData?.b_clientName}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Form Number"
										type="text"
										label="Form Number"
										name="b_formNo"
										formControlName={personalDetailsData?.b_formNo}
										mode={1}
										disabled
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="GRT Approve date..."
										type="text"
										label="GRT Approve Date"
										name="b_grtApproveDate"
										formControlName={personalDetailsData?.b_grtApproveDate}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Branch..."
										type="text"
										label="Branch"
										name="b_branch"
										formControlName={personalDetailsData?.b_branch}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>
								{/* <div>
									<TDInputTemplateBr
										placeholder="Purpose..."
										type="text"
										label="Purpose"
										name="b_purpose"
										formControlName={personalDetailsData?.b_purpose}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div> */}
								<div>
									<TDInputTemplateBr
										placeholder="Select Purpose"
										type="text"
										label="Purpose"
										name="b_purpose"
										formControlName={personalDetailsData?.b_purpose}
										handleChange={handleChangePersonalDetails}
										data={purposeOfLoan?.map((item, _) => ({
											code: item?.loan_purpose,
											name: item?.purpose_id,
										}))}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div>
								{/* <div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Sub Purpose..."
										type="text"
										label="Sub Purpose"
										name="b_subPurpose"
										formControlName={personalDetailsData?.b_subPurpose}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div> */}
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Select Sub Purpose"
										type="text"
										label="Sub Purpose"
										name="b_subPurpose"
										formControlName={personalDetailsData?.b_subPurpose}
										handleChange={handleChangePersonalDetails}
										data={subPurposeOfLoan?.map((item, _) => ({
											code: item?.sub_pupose,
											name: item?.sub_purp_name,
										}))}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Application Date..."
										type="text"
										label="Application Date"
										name="b_applicationDate"
										formControlName={personalDetailsData?.b_applicationDate}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Applied Amount..."
										type="text"
										label="Applied Amount"
										name="b_appliedAmt"
										formControlName={personalDetailsData?.b_appliedAmt}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>
							</div>
						</div>

						{/* ///////////////////////// */}

						<div>
							<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
								<div className="text-xl mb-2 mt-5 text-lime-800 font-semibold underline">
									2. Disbursement Details
								</div>
							</div>
							<div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
								<div>
									<TDInputTemplateBr
										placeholder="Select Scheme..."
										type="text"
										label="Scheme"
										name="b_scheme"
										formControlName={disbursementDetailsData.b_scheme}
										handleChange={handleChangeDisburseDetails}
										data={schemes?.map((item, _) => ({
											code: item?.scheme_id,
											name: item?.scheme_name,
										}))}
										// data={[
										// 	{ code: "S1", name: "Scheme 1" },
										// 	{ code: "S1", name: "Scheme 2" },
										// 	{ code: "S3", name: "Scheme 3" },
										// ]}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Select Fund..."
										type="text"
										label="Fund"
										name="b_fund"
										formControlName={disbursementDetailsData.b_fund}
										handleChange={handleChangeDisburseDetails}
										data={funds?.map((item, _) => ({
											code: item?.fund_id,
											name: item?.fund_name,
										}))}
										// data={[
										// 	{ code: "F1", name: "Fund 1" },
										// 	{ code: "F2", name: "Fund 2" },
										// 	{ code: "F3", name: "Fund 3" },
										// ]}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Period..."
										type="text"
										label="Period"
										name="b_period"
										formControlName={disbursementDetailsData.b_period}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="R.O.I..."
										type="text"
										label="Rate of Interest"
										name="b_roi"
										formControlName={disbursementDetailsData.b_roi}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Mode..."
										type="text"
										label="Mode"
										name="b_mode"
										formControlName={disbursementDetailsData.b_mode}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Disburse Amount..."
										type="number"
										label={`Disburse Amount`}
										name="b_disburseAmt"
										formControlName={disbursementDetailsData.b_disburseAmt}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled={
											!disbursementDetailsData?.b_scheme || disburseOrNot
										}
									/>
									{+disbursementDetailsData.b_disburseAmt >
									+maxDisburseAmountForAScheme ? (
										<VError
											title={`Disburse amount must be less than ${maxDisburseAmountForAScheme}`}
										/>
									) : null}
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Bank charges..."
										type="number"
										label="Bank Charges"
										name="b_bankCharges"
										formControlName={disbursementDetailsData.b_bankCharges}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled={
											!disbursementDetailsData?.b_scheme || disburseOrNot
										}
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Processing charges..."
										type="number"
										label="Processing Charges"
										name="b_processingCharges"
										formControlName={
											disbursementDetailsData.b_processingCharges
										}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled={
											!disbursementDetailsData?.b_scheme || disburseOrNot
										}
									/>
								</div>
							</div>
						</div>

						{/* ///////////////////////// */}

						<div>
							<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
								<div className="text-xl mb-2 mt-5 text-lime-800 font-semibold underline">
									3. Transaction Details
								</div>
							</div>
							<div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Bank Name..."
										type="text"
										label="Bank Name"
										name="b_bankName"
										formControlName={transactionDetailsData.b_bankName}
										handleChange={handleChangeTnxDetailsDetails}
										mode={1}
										disabled={disburseOrNot}
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Transaction date..."
										type="date"
										label="Transaction Date"
										name="b_tnxDate"
										formControlName={transactionDetailsData.b_tnxDate}
										handleChange={handleChangeTnxDetailsDetails}
										min={"1900-12-31"}
										max={formatDateToYYYYMMDD(new Date())}
										mode={1}
										disabled={disburseOrNot}
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Cheque/Ref. no..."
										type="text"
										label="Cheque/Ref. No."
										name="b_chequeOrRefNo"
										formControlName={transactionDetailsData.b_chequeOrRefNo}
										handleChange={handleChangeTnxDetailsDetails}
										mode={1}
										disabled={disburseOrNot}
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Cheque/Ref. Date..."
										type="date"
										label="Cheque/Ref. Date"
										name="b_chequeOrRefDate"
										formControlName={transactionDetailsData.b_chequeOrRefDate}
										handleChange={handleChangeTnxDetailsDetails}
										min={"1900-12-31"}
										max={formatDateToYYYYMMDD(new Date())}
										mode={1}
										disabled={disburseOrNot}
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Select Transaction Type..."
										type="text"
										label="Transaction Type"
										name="b_tnxType"
										formControlName={transactionDetailsData.b_tnxType}
										handleChange={handleChangeTnxDetailsDetails}
										data={tnxTypes?.map((item, _) => ({
											code: item?.id,
											name: item?.name,
										}))}
										mode={2}
										disabled
									/>
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Select Transaction Mode..."
										type="text"
										label="Transaction Mode"
										name="b_tnxMode"
										formControlName={transactionDetailsData.b_tnxMode}
										handleChange={handleChangeTnxDetailsDetails}
										data={tnxModes?.map((item, _) => ({
											code: item?.id,
											name: item?.name,
										}))}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div>

								<div className="sm:col-span-4">
									<TDInputTemplateBr
										placeholder="Type Remarks..."
										type="text"
										label="Remarks"
										name="b_remarks"
										formControlName={transactionDetailsData.b_remarks}
										handleChange={handleChangeTnxDetailsDetails}
										mode={3}
										disabled={disburseOrNot}
									/>
								</div>
							</div>
						</div>

						{!disburseOrNot && (
							<div className="mt-10">
								<BtnComp mode="A" onReset={onReset} />
							</div>
						)}

						{disburseOrNot && params?.id > 0 && (
							<div>
								<div className="w-full my-10 border-t-4 border-gray-500 border-dashed"></div>
								<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
									<div className="text-xl mb-2 text-lime-800 font-semibold underline">
										4. Installment Details
									</div>
								</div>
								<div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Installment Start Date..."
											type="text"
											label="Installment Start Date"
											name="b_isntallmentStartDate"
											formControlName={
												installmentDetailsData?.b_isntallmentStartDate
													? new Date(
															installmentDetailsData?.b_isntallmentStartDate
													  ).toLocaleDateString("en-GB")
													: ""
											}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Installment End Date..."
											type="text"
											label="Installment End Date"
											name="b_isntallmentEndDate"
											formControlName={
												installmentDetailsData?.b_isntallmentEndDate
													? new Date(
															installmentDetailsData?.b_isntallmentEndDate
													  ).toLocaleDateString("en-GB")
													: ""
											}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Principle Amount..."
											type="text"
											label="Principle Amount"
											name="b_principleDisbursedAmount"
											formControlName={
												installmentDetailsData?.b_principleDisbursedAmount
											}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Interest Amount..."
											type="text"
											label="Interest Amount"
											name="b_interestAmount"
											formControlName={installmentDetailsData?.b_interestAmount}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Receivable..."
											type="text"
											label="Receivable"
											name="b_receivable"
											formControlName={installmentDetailsData?.b_receivable}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Principle EMI Amount..."
											type="text"
											label="Principle EMI Amount"
											name="b_principleEMIAmount"
											formControlName={
												installmentDetailsData?.b_principleEMIAmount
											}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Interest EMI..."
											type="text"
											label="Interest EMI"
											name="b_interestEMIAmount"
											formControlName={
												installmentDetailsData?.b_interestEMIAmount
											}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Total EMI Amount..."
											type="text"
											label="Total EMI Amount"
											name="b_totalEMIAmount"
											formControlName={installmentDetailsData?.b_totalEMIAmount}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
								</div>
								<div className="mt-10">
									<BtnComp
										mode="N"
										showUpdateAndReset={false}
										showReject={true}
										onRejectApplication={() => setVisible3(true)}
										showForward={true}
										onForwardApplication={() => setVisible2(true)}
									/>
								</div>
							</div>
						)}
					</div>
				</form>
			</Spin>

			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					if (
						!personalDetailsData.b_memCode ||
						!personalDetailsData.b_clientName ||
						!personalDetailsData.b_groupName ||
						!personalDetails.acc_no1 ||
						!+personalDetails.acc_no1 === 0 ||
						!personalDetails.acc_no2 ||
						!+personalDetails.acc_no2 === 0 ||
						!personalDetailsData.b_formNo ||
						!personalDetailsData.b_grtApproveDate ||
						!personalDetailsData.b_branch ||
						!personalDetailsData.b_purpose ||
						!personalDetailsData.b_subPurpose ||
						!personalDetailsData.b_applicationDate ||
						!personalDetailsData.b_appliedAmt ||
						!disbursementDetailsData.b_scheme ||
						!disbursementDetailsData.b_fund ||
						!disbursementDetailsData.b_period ||
						!disbursementDetailsData.b_roi ||
						!disbursementDetailsData.b_mode ||
						!disbursementDetailsData.b_disburseAmt ||
						!disbursementDetailsData.b_bankCharges ||
						!disbursementDetailsData.b_processingCharges ||
						!transactionDetailsData.b_tnxDate ||
						!transactionDetailsData.b_bankName ||
						!transactionDetailsData.b_chequeOrRefNo ||
						!transactionDetailsData.b_chequeOrRefDate ||
						!transactionDetailsData.b_tnxMode ||
						!transactionDetailsData.b_remarks
					) {
						Message(
							"warning",
							"Fill all the values properly OR Update the Account Numbers from Group!"
						)
						setVisible(false)
						return
					}
					handleSubmitDisbursementForm()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>

			{/* For Approve */}
			<DialogBox
				flag={4}
				onPress={() => setVisible2(!visible2)}
				visible={visible2}
				onPressYes={() => {
					handleApproveLoanDisbursement()
					setVisible2(!visible2)
				}}
				onPressNo={() => setVisible2(!visible2)}
			/>

			{/* For Reject */}
			<DialogBox
				flag={4}
				onPress={() => setVisible3(!visible3)}
				visible={visible3}
				onPressYes={() => {
					handleRejectLoanDisbursement()
					setVisible3(!visible3)
				}}
				onPressNo={() => setVisible3(!visible3)}
			/>
		</>
	)
}

export default DisbursmentForm

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

function MemberLoanDetailsForm() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const personalDetails = {}
	const loanType = "R"

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
	const [tnxDetails, setTnxDetails] = useState([])
	const [changedPayment, setChangedPayment] = useState(null)

	// const formattedDob = formatDateToYYYYMMDD(memberDetails?.dob)

	console.log(params, "params")
	console.log(location, "location")
	// console.log(memberDetails, "memberDetails")
	console.log("U/A", loanType)

	const [memberLoanDetailsData, setMemberLoanDetailsData] = useState({
		loanId: "",
		memberName: "",
		memberCode: "",
		groupName: "",
		purposeId: "",
		purpose: "",
		subPurposeId: "",
		// subPurpose: "",
		disbursementDate: "",
		disburseAmount: "",
		schemeName: "",
		fundId: "",
		fundName: "",
		principalBalance: "",
		period: "",
		periodMode: "",
		principalAmount: "",
		principalEMI: "",
		interestAmount: "",
		interestEMI: "",
		totalEMI: "",
	})

	const handleChangeMemberLoanDetails = (e) => {
		const { name, value } = e.target
		setMemberLoanDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	// const [memberTxnDetailsData, setMemberTxnDetailsData] = useState([
	// 	{
	// 		payment_id: "",
	// 		txn_date: "",
	// 	},
	// ])

	const handleChangeTxnDetails = (index, e) => {
		const { name, value } = e.target
		setTnxDetails((prevData) => {
			const updatedData = [...prevData]
			updatedData[index][name] = value
			return updatedData
		})

		// If the changed field is "payment_date", capture the new date and the payment_id.
		if (name === "payment_date") {
			// Note: payment_id is assumed to be already present in tnxDetails.
			setChangedPayment({
				payment_date: value,
				payment_id: tnxDetails[index]?.payment_id,
				tr_type: tnxDetails[index]?.tr_type,
			})
		}
	}

	const handleFetchMemberLoanDetails = async () => {
		setLoading(true)
		const creds = {
			loan_id: params?.id,
			branch_code: userDetails?.brn_code,
		}

		await axios
			.post(`${url}/admin/view_loan_dtls`, creds)
			.then((res) => {
				console.log("PPPPPPP::::::", res?.data)

				setMemberLoanDetailsData({
					loanId: res?.data?.msg[0]?.loan_id || "",
					memberName: res?.data?.msg[0]?.client_name || "",
					memberCode: res?.data?.msg[0]?.member_code || "",
					groupName: res?.data?.msg[0]?.group_name || "",
					purposeId: res?.data?.msg[0]?.purpose || "",
					purpose: res?.data?.msg[0]?.purpose_id || "",
					subPurposeId: res?.data?.msg[0]?.sub_purpose || "",
					// subPurpose: res?.data?.msg[0]?.sub_purp_name || "",
					disbursementDate: res?.data?.msg[0]?.disb_dt || "",
					disburseAmount: res?.data?.msg[0]?.prn_disb_amt || "",
					schemeName: res?.data?.msg[0]?.scheme_name || "",
					fundId: res?.data?.msg[0]?.fund_id || "",
					fundName: res?.data?.msg[0]?.fund_name || "",
					principalBalance: res?.data?.msg[0]?.prn_amt || "",
					period: res?.data?.msg[0]?.period || "",
					periodMode: res?.data?.msg[0]?.period_mode || "",
					principalAmount: res?.data?.msg[0]?.prn_disb_amt || "",
					principalEMI: res?.data?.msg[0]?.prn_emi || "",
					interestAmount: res?.data?.msg[0]?.intt_amt || "",
					interestEMI: res?.data?.msg[0]?.intt_emi || "",
					totalEMI: res?.data?.msg[0]?.tot_emi || "",
				})
				setTnxDetails(res?.data?.msg[0]?.trans_dtls)
				// setMemberTxnDetailsData(
				// 	res?.data?.msg[0]?.trans_dtls?.map((it, i) => ({
				// 		txn_id: it?.payment_id,
				// 		txn_date: formatDateToYYYYMMDD(it?.txnDate),
				// 	}))
				// )
			})
			.catch((err) => {
				console.log("&&& ERR", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		handleFetchMemberLoanDetails()
	}, [])

	const getPurposeOfLoan = async () => {
		setLoading(true)
		await axios
			.get(`${url}/get_purpose`)
			.then((res) => {
				console.log("------XXXX------", res?.data)
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
	// 	getSubPurposeOfLoan(memberLoanDetailsData?.purposeId)
	// }, [memberLoanDetailsData?.purposeId])

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

	useEffect(() => {
		getFunds()
	}, [])

	const saveLoanDetails = async () => {
		const creds = {
			purpose: memberLoanDetailsData?.purposeId,
			// sub_purpose: memberLoanDetailsData?.subPurposeId,
			// sub_purpose: 0,
			// fund_id: memberLoanDetailsData?.fundId,
			// tot_emi: memberLoanDetailsData?.totalEMI,
			disb_dt: formatDateToYYYYMMDD(memberLoanDetailsData?.disbursementDate),
			modified_by: userDetails?.emp_id,
			loan_id: params?.id,
		}
		console.log("DSDS", creds)
		await axios
			.post(`${url}/admin/save_loan_details`, creds)
			.then((res) => {
				console.log("SAVE LOAN DTLSSSS", res?.data)
				Message("success", res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRR:S:S:S", err)
			})
	}

	// const saveTxnDetails = async () => {
	// 	const creds = {
	// 		modified_by: userDetails?.emp_id,
	// 		loan_id: params?.id,

	// 		trans_dt: tnxDetails?.map((item, i) => ({
	// 			payment_date: formatDateToYYYYMMDD(item?.payment_date),
	// 			payment_id: item?.payment_id,
	// 		})),
	// 	}

	// 	console.log("DSDS", creds)
	// 	await axios
	// 		.post(`${url}/admin/change_loan_trans_date`, creds)
	// 		.then((res) => {
	// 			console.log("SAVE TXN DTLSSSS", res?.data)
	// 			Message("success", res?.data?.msg)
	// 		})
	// 		.catch((err) => {
	// 			console.log("ERRR:S:S:S", err)
	// 		})
	// }

	// Save the transaction details by calling the API.
	const saveTxnDetails = async (payment_date, payment_id, tr_type) => {
		setLoading(true)
		const creds = {
			payment_date,
			payment_id,
			loan_id: params?.id,
			modified_by: userDetails?.emp_id,
			tr_type,
		}

		console.log("Saving transaction details:", creds)
		try {
			const res = await axios.post(`${url}/admin/change_loan_trans_date`, creds)
			console.log("Transaction details saved:", res?.data)
			Message("success", res?.data?.msg)
		} catch (err) {
			console.log("Error saving transaction details:", err)
		}
		setLoading(false)
	}

	useEffect(() => {
		if (changedPayment) {
			saveTxnDetails(
				changedPayment.payment_date,
				changedPayment.payment_id,
				changedPayment.tr_type
			)

			setChangedPayment(null)
		}
	}, [changedPayment])

	//////////////////////////////////////////////////
	//////////////////////////////////////////////////

	const onSubmit = (e) => {
		e.preventDefault()

		setVisible(true)
	}

	let totalCredit = 0
	let totalDebit = 0

	const disableCondition = () => {
		return userDetails?.id === 4
	}

	return (
		<>
			{/* {disburseOrNot && (
				<Badge.Ribbon
					className="bg-slate-500 absolute top-10 z-10"
					text={<div className="font-bold">Recovery Initiated</div>}
					style={{
						fontSize: 17,
						width: 200,
						height: 28,
						justifyContent: "start",
						alignItems: "center",
						textAlign: "center",
					}}
				></Badge.Ribbon>
			)} */}
			{/* <div className="ml-14 mt-5 flex flex-col justify-start align-middle items-start gap-2">
				<div className="text-sm text-wrap w-96 italic text-blue-800">
					CO: {recoveryDetailsData?.b_coName || "Nil"}, AT:{" "}
					{new Date(recoveryDetailsData?.b_coCreatedAt || "Nil").toLocaleString(
						"en-GB"
					)}
				</div>
				<div className="text-sm text-wrap w-96 italic text-blue-800">
					CO Location: {recoveryDetailsData?.b_coLocation || "Nil"}
				</div>
			</div> */}
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<form onSubmit={onSubmit}>
					<div>
						{/* ///////////////////////// */}

						<div>
							<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
								<div className="text-xl mb-2 mt-5 text-[#DA4167] font-semibold underline">
									1. Full Loan Details
								</div>
							</div>
							<div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Loan ID..."
										type="text"
										label="Loan ID"
										name="loanId"
										formControlName={memberLoanDetailsData.loanId}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Member Name..."
										type="text"
										label="Member Name"
										name="memberName"
										formControlName={memberLoanDetailsData.memberName}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Member Code..."
										type="text"
										label="Member Code"
										name="memberCode"
										formControlName={memberLoanDetailsData.memberCode}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Group Name..."
										type="text"
										label="Group Name"
										name="groupName"
										formControlName={memberLoanDetailsData.groupName}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								{/* <div>
									<TDInputTemplateBr
										placeholder="Purpose..."
										type="text"
										label="Purpose"
										name="purpose"
										formControlName={memberLoanDetailsData.purpose}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div> */}
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Select Purpose"
										type="text"
										label="Purpose"
										name="purposeId"
										formControlName={memberLoanDetailsData?.purposeId}
										handleChange={handleChangeMemberLoanDetails}
										data={purposeOfLoan?.map((item, _) => ({
											code: item?.purp_id,
											name: item?.purpose_id,
										}))}
										mode={2}
										disabled
									/>
								</div>
								{/* <div>
									<TDInputTemplateBr
										placeholder="Sub Purpose..."
										type="text"
										label="Sub Purpose"
										name="subPurpose"
										formControlName={memberLoanDetailsData.subPurpose}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div> */}
								{/* <div>
									<TDInputTemplateBr
										placeholder="Select Sub Purpose"
										type="text"
										label="Sub Purpose"
										name="subPurposeId"
										formControlName={memberLoanDetailsData?.subPurposeId}
										handleChange={handleChangeMemberLoanDetails}
										data={subPurposeOfLoan?.map((item, _) => ({
											code: item?.sub_purp_id,
											name: item?.sub_purp_name,
										}))}
										mode={2}
									/>
								</div> */}
								<div>
									<TDInputTemplateBr
										placeholder="Disbursement Date..."
										type="date"
										label="Disbursement Date"
										name="disbursementDate"
										formControlName={formatDateToYYYYMMDD(
											new Date(memberLoanDetailsData.disbursementDate)
										)}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Disbursement Amount..."
										type="text"
										label="Disbursement Amount"
										name="disburseAmount"
										formControlName={memberLoanDetailsData.disburseAmount || ""}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Scheme Name..."
										type="text"
										label="Scheme Name"
										name="schemeName"
										formControlName={memberLoanDetailsData.schemeName}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								{/* <div>
									<TDInputTemplateBr
										placeholder="Fund Name..."
										type="text"
										label="Fund Name"
										name="fundName"
										formControlName={memberLoanDetailsData.fundName}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div> */}
								<div>
									<TDInputTemplateBr
										placeholder="Select Fund..."
										type="text"
										label="Fund"
										name="fundId"
										formControlName={memberLoanDetailsData.fundId}
										handleChange={handleChangeMemberLoanDetails}
										data={funds?.map((item, _) => ({
											code: item?.fund_id,
											name: item?.fund_name,
										}))}
										mode={2}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Period Mode..."
										type="text"
										label="Period Mode"
										name="periodMode"
										formControlName={memberLoanDetailsData.periodMode}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Balance..."
										type="text"
										label="Balance"
										name="principalBalance"
										formControlName={memberLoanDetailsData.principalBalance}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Period..."
										type="text"
										label="Period"
										name="period"
										formControlName={memberLoanDetailsData.period}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								{/* <div>
									<TDInputTemplateBr
										placeholder="Principal Amount..."
										type="text"
										label="Principal Amount"
										name="principalAmount"
										formControlName={memberLoanDetailsData.principalAmount}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Principal EMI..."
										type="text"
										label="Principal EMI"
										name="principalEMI"
										formControlName={memberLoanDetailsData.principalEMI}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Interest Amount..."
										type="text"
										label="Interest Amount"
										name="interestAmount"
										formControlName={memberLoanDetailsData.interestAmount}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Interest EMI..."
										type="text"
										label="Interest EMI"
										name="interestEMI"
										formControlName={memberLoanDetailsData.interestEMI}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div> */}
								<div>
									<TDInputTemplateBr
										placeholder="Total EMI..."
										type="text"
										label="Total EMI"
										name="totalEMI"
										formControlName={memberLoanDetailsData.totalEMI}
										handleChange={handleChangeMemberLoanDetails}
										mode={1}
										disabled
									/>
								</div>
							</div>
							{/* {disableCondition() && (
								<div className="text-center mt-6">
									<button
										className="p-2 px-6 bg-teal-500 text-slate-50 rounded-xl hover:bg-green-500 active:ring-2 active:ring-slate-500"
										type="button"
										onClick={() => setVisible(true)}
									>
										UPDATE
									</button>
								</div>
							)} */}
						</div>

						{/* ///////////////////////// */}

						<div>
							<div className="w-full my-10 border-t-4 border-gray-500 border-dashed"></div>
							<div className="text-xl mb-2 mt-5 text-[#DA4167] font-semibold underline">
								2. Transaction Details
							</div>
						</div>

						<div>
							<Spin spinning={loading}>
								<div
									className={`relative overflow-x-auto shadow-md sm:rounded-lg`}
								>
									<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
										<thead className="text-xs text-slate-50 uppercase bg-slate-700 dark:bg-gray-700 dark:text-gray-400">
											<tr>
												<th scope="col" className="px-6 py-3 font-semibold">
													Sl. No.
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Date
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Tnx. ID.
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Tnx. Type
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Debit
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Credit
												</th>
												{/* <th scope="col" className="px-6 py-3 font-semibold">
													Balance
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Interest Balance
												</th> */}
												<th scope="col" className="px-6 py-3 font-semibold">
													Outstanding
												</th>

												{/* <th scope="col" className="px-6 py-3 font-semibold">
													Chq. ID.
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Chq. Date
												</th> */}
												<th scope="col" className="px-6 py-3 font-semibold">
													Mode
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Particulars
												</th>
												<th scope="col" className="px-6 py-3 font-semibold">
													Status
												</th>
												{/* <th scope="col" className="px-6 py-3 font-semibold">
													<span className="sr-only">Action</span>
												</th> */}
											</tr>
										</thead>
										<tbody>
											{tnxDetails?.map((item, i) => {
												totalCredit += item?.credit
												totalDebit += item?.debit

												if (item?.tr_type === "I" && userDetails?.id !== 4) {
													return null
												}

												return (
													<>
														<tr
															key={i}
															className={`bg-slate-50 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600`}
														>
															<th
																scope="row"
																className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
															>
																{i + 1}
															</th>
															<td className="px-6 py-4">
																{/* {new Date(item?.payment_date).toLocaleDateString(
																"en-GB"
															) || ""} */}

																<div>
																	<TDInputTemplateBr
																		placeholder="Payment Date..."
																		type="date"
																		name="payment_date"
																		formControlName={formatDateToYYYYMMDD(
																			new Date(item?.payment_date)
																		)}
																		handleChange={(e) =>
																			handleChangeTxnDetails(i, e)
																		}
																		mode={1}
																		disabled={
																			// !(
																			// 	item?.tr_type === "I" ||
																			// 	item?.tr_type === "R" ||
																			// 	item?.tr_type === "D"
																			// ) || userDetails?.id !== 4
																			true
																		}
																	/>
																</div>
															</td>
															<td className="px-6 py-4">{item?.payment_id}</td>
															<td className="px-6 py-4">
																{item?.tr_type === "D"
																	? "Disbursement"
																	: item?.tr_type === "I"
																	? "Interest"
																	: item?.tr_type === "R"
																	? "Recovery"
																	: item?.tr_type === "O"
																	? "Overdue"
																	: "Error"}
															</td>
															<td className="px-6 py-4">
																{item?.debit || 0}/-
															</td>
															<td className="px-6 py-4">
																{item?.credit || 0}/-
															</td>
															{/* <td className="px-6 py-4">
																{item?.prn_bal || 0}/-
															</td>
															<td className="px-6 py-4">
																{item?.intt_balance || 0}/-
															</td> */}
															<td className="px-6 py-4">
																{item?.outstanding || 0}/-
															</td>

															{/* <td className="px-6 py-4">
														{new Date(item?.payment_date).toLocaleDateString(
															"en-GB"
														) || ""}
													</td> */}
															{/* <td className="px-6 py-4">
															{item?.cheque_id || 0}
														</td>
														<td className="px-6 py-4">
															{new Date(item?.chq_dt).toLocaleDateString(
																"en-GB"
															) || ""}
														</td> */}
															<td className="px-6 py-4">
																{item?.tr_mode === "B"
																	? "Bank"
																	: item?.tr_mode === "C"
																	? "Cash"
																	: "Error"}
															</td>
															<td className="px-6 py-4">{item?.particulars}</td>
															<td
																className={`px-6 py-4 ${
																	item?.status === "A"
																		? "text-green-600"
																		: item?.status === "U"
																		? "text-red-600"
																		: ""
																}`}
															>
																{item?.status === "A"
																	? "Approved"
																	: item?.status === "U"
																	? "Unapproved"
																	: "Error"}
															</td>
															{/* <td className="px-6 py-4 text-right">
														<button
															onClick={() => {
																navigate(
																	`/homebm/memberloandetails/${item?.loan_id}`
																)
															}}
															className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
														>
															Edit
														</button>
													</td> */}
														</tr>
													</>
												)
											})}
											{/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
												<td className="px-6 py-4 font-medium" colSpan={3}>
													Total Outstanding
												</td>
												<td className="px-6 py-4 text-left" colSpan={2}>
													564654
												</td>
											</tr> */}
											<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600">
												<td colSpan={4} className="px-6 py-4 font-semibold">
													Total
												</td>
												<td
													colSpan={1}
													className="px-6 py-4 text-left font-semibold"
												>
													{totalDebit?.toFixed(2)}/-
												</td>
												<td
													colSpan={5}
													className="px-6 py-4 text-left font-semibold"
												>
													{totalCredit?.toFixed(2)}/-
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</Spin>
						</div>

						{/* {!disableCondition() && (
							<div className="text-center mt-6">
								<button
									className="p-2 px-6 bg-teal-500 text-slate-50 rounded-xl hover:bg-green-500 active:ring-2 active:ring-slate-500"
									type="button"
									onClick={() => setVisible2(true)}
								>
									SAVE TRANSACTION DETAILS
								</button>
							</div>
						)} */}

						{/* ////////////////////////////////////////////////////// */}
					</div>
				</form>
			</Spin>

			{/* For Approve */}
			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={async () => {
					// recoveryLoanApprove()
					await saveLoanDetails()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>

			{/* For Reject */}
			<DialogBox
				flag={4}
				onPress={() => setVisible2(!visible2)}
				visible={visible2}
				onPressYes={async () => {
					// handleApproveLoanDisbursement()
					// recoveryLoanReject()
					await saveTxnDetails()
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

export default MemberLoanDetailsForm

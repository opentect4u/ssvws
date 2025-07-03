import React, { useEffect, useState } from "react"
import Sidebar from "../../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../../Address/BaseUrl"
import { Message } from "../../../../Components/Message"
import { Spin, Button, Modal, Tooltip, DatePicker } from "antd"
import {
	LoadingOutlined,
	SearchOutlined,
	PrinterOutlined,
	FileExcelOutlined,
} from "@ant-design/icons"
import Radiobtn from "../../../../Components/Radiobtn"
import TDInputTemplateBr from "../../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../../Utils/formateDate"

import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { printTableLoanStatement } from "../../../../Utils/printTableLoanStatement"

// const { RangePicker } = DatePicker
// const dateFormat = "YYYY/MM/DD"

const options = [
	{
		label: "Memberwise",
		value: "M",
	},
	{
		label: "Groupwise",
		value: "G",
	},
]

function ALoanStatementMain() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	const [openModal, setOpenModal] = useState(false)
	// const [approvalStatus, setApprovalStatus] = useState("S")
	const [searchType, setSearchType] = useState(() => "M")

	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [reportData, setReportData] = useState(() => [])
	const [reportTxnData, setReportTxnData] = useState(() => [])
	// const [tot_sum, setTotSum] = useState(0)
	const [search, setSearch] = useState("")
	const [branch, setBranch] = useState(() => "")
	const [branches, setBranches] = useState(() => [])

	const [metadataDtls, setMetadataDtls] = useState(() => null)

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setSearchType(e)
	}

	const handleFetchBranches = async () => {
		setLoading(true)
		await axios
			.get(`${url}/fetch_all_branch_dt`)
			.then((res) => {
				console.log("QQQQQQQQQQQQQQQQ", res?.data)
				setBranches(res?.data?.msg)
			})
			.catch((err) => {
				console.log("?????????????????????", err)
			})

		setLoading(false)
	}

	useEffect(() => {
		handleFetchBranches()
	}, [])

	const handleFetchReportMemberwise = async () => {
		setLoading(true)
		const creds = {
			memb: search,
			branch_code: userDetails?.brn_code,
		}

		console.log("::::::::::::>>>>>>>>>>>>", creds)

		await axios
			.post(`${url}/adminreport/loan_statement_memb_dtls_admin`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
				// setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const handleFetchReportGroupwise = async () => {
		setLoading(true)
		const creds = {
			grp: search,
			// branch_code: userDetails?.brn_code,
		}

		console.log(">>>>>>>>>>>>::::::::::::", creds)

		await axios
			.post(`${url}/adminreport/loan_statement_group_dtls_admin`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
				// setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const handleFetchLoanViewMemberwise = async (loanId) => {
		setLoading(true)
		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			to_dt: formatDateToYYYYMMDD(toDate),
			loan_id: loanId || "",
			branch_id:userDetails.brn_code
		}

		await axios
			.post(`${url}/adminreport/loan_statement_report_admin`, creds)
			.then((res) => {
				console.log("RESSSSS XX======>>>>", res?.data)
				setReportTxnData(res?.data?.msg)
				// setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
			})
			.catch((err) => {
				console.log("ERRRR>>>>>>>", err)
			})

		setLoading(false)
	}

	const handleFetchLoanViewGroupwise = async (grpCode) => {
		setLoading(true)
		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			to_dt: formatDateToYYYYMMDD(toDate),
			group_code: grpCode || "",
		}

		await axios
			.post(`${url}/adminreport/loan_statement_group_report_admin`, creds)
			.then((res) => {
				console.log("RESSSSS XX======>>>>", res?.data)
				setReportTxnData(res?.data?.msg)
				// setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
			})
			.catch((err) => {
				console.log("ERRRR>>>>>>>", err)
			})

		setLoading(false)
	}

	// useEffect(() => {
	// 	if (searchType === "M" && search.length > 2) {
	// 		handleFetchReportMemberwise()
	// 	} else if (searchType === "G" && search.length > 2) {
	// 		handleFetchReportGroupwise()
	// 	}
	// }, [searchType, search])

	const handleSubmit = async () => {
		if (!search) {
			Message("warning", "Fill the necesary details")
			return
		}

		if (searchType === "M") {
			await handleFetchReportMemberwise()
		} else if (searchType === "G") {
			await handleFetchReportGroupwise()
		}
	}

	useEffect(() => {
		setReportData(() => [])
		setReportTxnData(() => [])
		setMetadataDtls(() => null)
	}, [searchType])

	const exportToExcel = (data) => {
		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.json_to_sheet(data)
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
		const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" })
		const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" })
		saveAs(blob, "loan_statement_report.xlsx")
	}

	const s2ab = (s) => {
		const buf = new ArrayBuffer(s.length)
		const view = new Uint8Array(buf)
		for (let i = 0; i < s.length; i++) {
			view[i] = s.charCodeAt(i) & 0xff
		}
		return buf
	}

	let totalRecovery = 0
	let totalCredit = 0
	let totalDebit = 0
	let totalCreditGrpwise = 0
	let totalDebitGrpwise = 0

	return (
		<div>
			<Sidebar mode={2} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-slate-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 pb-5 bg-slate-50 rounded-lg shadow-lg h-auto my-10 mx-32">
					<div className="flex flex-row gap-3 mt-20  py-3 rounded-xl">
						<div className="text-3xl text-slate-700 font-bold">
							LOAN STATEMENTS
						</div>
					</div>

					<div className="mb-2">
						<Radiobtn
							data={options}
							val={searchType}
							onChangeVal={(value) => {
								onChange(value)
							}}
						/>
					</div>

					<div className="flex justify-center gap-5 mt-5">
						<div className="w-full">
							<TDInputTemplateBr
								placeholder={
									searchType === "M" ? `Member Name / ID` : `Group Name / ID`
								}
								type="text"
								label={
									searchType === "M" ? `Member Name / ID` : `Group Name / ID`
								}
								name="search_val"
								handleChange={(txt) => setSearch(txt.target.value)}
								formControlName={search}
								mode={1}
							/>
						</div>
						{/* <div>
							<TDInputTemplateBr
								placeholder="Branch..."
								type="text"
								label="Branch"
								name="branch"
								formControlName={branch}
								handleChange={(e) => setBranch(e.target.value)}
								mode={2}
								data={branches?.map((item, i) => ({
									code: item?.branch_code,
									name: item?.branch_name,
								}))}
							/>
						</div> */}
					</div>

					{reportData.length > 0 && (
						<div className="grid grid-cols-2 gap-5 mt-5">
							<div>
								<TDInputTemplateBr
									placeholder="From Date"
									type="date"
									label="From Date"
									name="fromDate"
									formControlName={fromDate}
									handleChange={(e) => setFromDate(e.target.value)}
									min={"1900-12-31"}
									mode={1}
								/>
							</div>
							<div>
								<TDInputTemplateBr
									placeholder="To Date"
									type="date"
									label="To Date"
									name="toDate"
									formControlName={toDate}
									handleChange={(e) => setToDate(e.target.value)}
									min={"1900-12-31"}
									mode={1}
								/>
							</div>

							{/* R.I.P Sweet bro */}

							{/* <RangePicker
								className="p-2 shadow-md"
								format={dateFormat}
								onChange={(dates, dateStrings) => {
									console.log("-------dates", dates)
									console.log("-------dateStrings", dateStrings)
									setFromDate(dateStrings[0])
									setToDate(dateStrings[1])
								}}
							/> */}
						</div>
					)}

					<div className="mt-5 flex justify-center">
						<button
							className="w-24 h-9 bg-teal-500 hover:bg-green-600 text-white rounded-full"
							onClick={() => {
								handleSubmit()
							}}
						>
							Submit
						</button>
					</div>

					{/* For memberwise search */}

					{reportData.length > 0 && searchType === "M" && (
						<div
							className={`relative overflow-x-auto shadow-md sm:rounded-lg mt-5 max-h-96
                                [&::-webkit-scrollbar]:w-1
                                [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                dark:[&::-webkit-scrollbar-track]:bg-transparent
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                            `}
						>
							<div
								className={`w-full text-xs dark:bg-gray-700 dark:text-gray-400`}
							>
								<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
									<thead className="w-full text-xs uppercase text-slate-50 bg-slate-800 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
										<tr>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Member Code
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Member Name
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Loan ID
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Action
											</th>
										</tr>
									</thead>
									<tbody>
										{reportData?.map((item, i) => {
											return (
												<tr
													key={i}
													className={
														i % 2 === 0 ? "bg-slate-200 text-slate-900" : ""
													}
												>
													<td className="px-6 py-3">{item?.member_code}</td>
													<td className="px-6 py-3">{item?.client_name}</td>
													<td className="px-6 py-3">{item?.loan_id}</td>
													<td className="px-6 py-3">
														<button
															onClick={async () => {
																await handleFetchLoanViewMemberwise(
																	item?.loan_id
																)
																setMetadataDtls(item)
																setOpenModal(true)
															}}
															className="text-pink-600 disabled:text-pink-400 disabled:cursor-not-allowed"
															disabled={!fromDate || !toDate}
														>
															View
														</button>
													</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* For Groupwise search */}

					{reportData.length > 0 && searchType === "G" && (
						<div
							className={`relative overflow-x-auto shadow-md sm:rounded-lg mt-5 max-h-96
                                [&::-webkit-scrollbar]:w-1
                                [&::-webkit-scrollbar-track]:rounded-full
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-thumb]:bg-gray-300
                                dark:[&::-webkit-scrollbar-track]:bg-transparent
                                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                            `}
						>
							<div
								className={`w-full text-xs dark:bg-gray-700 dark:text-gray-400`}
							>
								<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
									<thead className="w-full text-xs uppercase text-slate-50 bg-slate-800 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
										<tr>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Branch Code
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Group Code
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Group Name
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Outstanding
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Branch Name
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Action
											</th>
										</tr>
									</thead>
									<tbody>
										{reportData?.map((item, i) => {
											return (
												<tr
													key={i}
													className={
														i % 2 === 0 ? "bg-slate-200 text-slate-900" : ""
													}
												>
													<td className="px-6 py-3">{item?.branch_code}</td>
													<td className="px-6 py-3">{item?.group_code}</td>
													<td className="px-6 py-3">{item?.group_name}</td>
													<td className="px-6 py-3">{item?.outstanding}</td>
													<td className="px-6 py-3">{item?.branch_name}</td>
													<td className="px-6 py-3">
														<button
															onClick={async () => {
																await handleFetchLoanViewGroupwise(
																	item?.group_code
																)
																setMetadataDtls(item)
																setOpenModal(true)
															}}
															className="text-pink-600 disabled:text-pink-400 disabled:cursor-not-allowed"
															disabled={!fromDate || !toDate}
														>
															View
														</button>
													</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* ///////////////////////////////////////////////////////////////// */}

					<Modal
						title="Loan Statement"
						centered
						open={openModal}
						onOk={() => {
							setOpenModal(false)
						}}
						onCancel={async () => {
							// await exportToExcel(reportTxnData)
							setOpenModal(false)
						}}
						width={1500}
						// okButtonProps={{
						// 	icon: <PrinterOutlined />,
						// }}
						okText={"OK"}
						cancelText={"Cancel"}
						// cancelButtonProps={{
						// 	icon: <FileExcelOutlined />,
						// }}
						// onClose={() => {
						// 	setOpenModal(false)
						// }}
					>
						{searchType === "M" && (
							<div className="text-sm text-slate-700">
								<div className="italic">
									Member: {metadataDtls?.client_name},{" "}
									{metadataDtls?.member_code}
								</div>
								<div className="italic">
									Branch: {metadataDtls?.branch_name},{" "}
									{metadataDtls?.branch_code}
								</div>
								<div className="italic">
									Group: {metadataDtls?.group_name}, {metadataDtls?.group_code}
								</div>
								<div className="italic">
									Showing results from{" "}
									{new Date(fromDate)?.toLocaleDateString("en-GB")} to{" "}
									{new Date(toDate)?.toLocaleDateString("en-GB")}
								</div>
								<div className="italic">Loan ID: {metadataDtls?.loan_id}</div>
							</div>
						)}
						{searchType === "G" && (
							<div className="text-sm text-slate-700">
								<div className="italic">
									Group: {metadataDtls?.group_name}, {metadataDtls?.group_code}
								</div>
								<div className="italic">
									Showing results from{" "}
									{new Date(fromDate)?.toLocaleDateString("en-GB")} to{" "}
									{new Date(toDate)?.toLocaleDateString("en-GB")}
								</div>
								<div className="italic">
									Branch: {metadataDtls?.branch_name},{" "}
									{metadataDtls?.branch_code}
								</div>
							</div>
						)}
						{/* For memberwise */}

						{searchType === "M" && reportTxnData.length > 0 && (
							<div
								className={`relative overflow-x-auto shadow-md sm:rounded-lg mt-5 max-h-96
                                    [&::-webkit-scrollbar]:w-1
                                    [&::-webkit-scrollbar-track]:rounded-full
                                    [&::-webkit-scrollbar-track]:bg-transparent
                                    [&::-webkit-scrollbar-thumb]:rounded-full
                                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                                    dark:[&::-webkit-scrollbar-track]:bg-transparent
                                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                                `}
							>
								<div
									className={`w-full text-xs dark:bg-gray-700 dark:text-gray-400`}
								>
									<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
										<thead className="w-full text-xs uppercase text-slate-50 bg-slate-800 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
											<tr>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Txn. Date
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Txn. No.
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Txn. Type
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Debit
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Principal Credit
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Interest Credit
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Total Credit
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Bank Charge
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Processing Charge
												</th>
												{/* <th scope="col" className="px-6 py-3 font-semibold ">
													Balance
												</th> */}
												<th scope="col" className="px-6 py-3 font-semibold ">
													Principal Balance
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Interest Balance
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Total Balance
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Txn. Mode
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Current R.O.I
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Period
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Period Mode
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Total EMI
												</th>
											</tr>
										</thead>
										<tbody>
											{reportTxnData?.map((item, i) => {
												totalCredit += +item?.credit
												totalDebit += +item?.debit

												return (
													<tr
														key={i}
														className={
															i % 2 === 0 ? "bg-slate-200 text-slate-900" : ""
														}
													>
														<td className="px-6 py-3">
															{new Date(item?.trans_date)?.toLocaleDateString(
																"en-GB"
															)}
														</td>
														<td className="px-6 py-3">{item?.trans_no}</td>
														<td className="px-6 py-3">
															{item?.tr_type === "D"
																? "Disbursement"
																: item?.tr_type === "R"
																? "Recovery"
																: item?.tr_type === "I"
																? "Interest"
																: "Error"}
														</td>
														<td className="px-6 py-3">{item?.debit}</td>
														<td className="px-6 py-3">{item?.prn_recov}</td>
														<td className="px-6 py-3">{item?.intt_recov}</td>
														<td className="px-6 py-3">{item?.credit}</td>
														<td className="px-6 py-3">{item?.bank_charge}</td>
														<td className="px-6 py-3">{item?.proc_charge}</td>
														{/* <td className="px-6 py-3">{item?.balance}</td> */}
														<td className="px-6 py-3">{item?.prn_bal}</td>
														<td className="px-6 py-3">{item?.intt_bal}</td>
														<td className="px-6 py-3">{item?.total}</td>
														<td className="px-6 py-3">
															{/* {item?.tr_mode === "C"
																? "Cash"
																: item?.tr_mode === "U"
																? "Bank"
																: "Error"} */}
															{item?.tr_type === "D"
																? "---"
																: item?.tr_mode === "C"
																? "Cash"
																: item?.tr_mode === "U"
																? "Bank"
																: "Error"}
														</td>
														<td className="px-6 py-3">
															{item?.curr_roi || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.period || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.period_mode || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.tot_emi || "---"}
														</td>
													</tr>
												)
											})}
											<tr
												className={"text-slate-50 bg-slate-700 sticky bottom-0"}
											>
												<td className="px-6 py-3" colSpan={3}>
													Total:
												</td>
												<td className="px-6 py-3" colSpan={1}>
													{totalDebit?.toFixed(2)}
												</td>
												<td className="px-6 py-3" colSpan={2}></td>
												<td className="px-6 py-3" colSpan={1}>
													{totalCredit?.toFixed(2)}
												</td>
												<td className="px-6 py-3" colSpan={10}>
													Total Recovery:{" "}
													{
														reportTxnData?.filter(
															(item, i) => item?.tr_type === "R"
														)?.length
													}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						)}

						{/* For Groupwise */}

						{searchType === "G" && reportTxnData.length > 0 && (
							<div
								className={`relative overflow-x-auto shadow-md sm:rounded-lg mt-5 max-h-96
                                    [&::-webkit-scrollbar]:w-1
                                    [&::-webkit-scrollbar-track]:rounded-full
                                    [&::-webkit-scrollbar-track]:bg-transparent
                                    [&::-webkit-scrollbar-thumb]:rounded-full
                                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                                    dark:[&::-webkit-scrollbar-track]:bg-transparent
                                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
                                `}
							>
								<div
									className={`w-full text-xs dark:bg-gray-700 dark:text-gray-400`}
								>
									<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
										<thead className="w-full text-xs uppercase text-slate-50 bg-slate-800 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
											<tr>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Txn. Date
												</th>
												{/* <th scope="col" className="px-6 py-3 font-semibold ">
													Txn. No.
												</th> */}
												<th scope="col" className="px-6 py-3 font-semibold ">
													Txn. Type
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Debit
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Credit
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Bank Charge
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Processing Charge
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Balance
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Particulars
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Current R.O.I
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Period
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Period Mode
												</th>
												<th scope="col" className="px-6 py-3 font-semibold ">
													Total EMI
												</th>

												{/* "curr_roi": 13.6,
												"period": 24,
												"period_mode": "Monthly",
												"tot_emi": 2650 */}
											</tr>
										</thead>
										<tbody>
											{reportTxnData?.map((item, i) => {
												totalCredit += +item?.credit
												totalDebit += +item?.debit

												return (
													<tr
														key={i}
														className={
															i % 2 === 0 ? "bg-slate-200 text-slate-900" : ""
														}
													>
														<td className="px-6 py-3">
															{new Date(item?.trans_date)?.toLocaleDateString(
																"en-GB"
															)}
														</td>
														{/* <td className="px-6 py-3">{item?.trans_id}</td> */}
														<td className="px-6 py-3">
															{item?.tr_type === "D"
																? "Disbursement"
																: item?.tr_type === "R"
																? "Recovery"
																: item?.tr_type === "I"
																? "Interest"
																: "Err"}
														</td>
														<td className="px-6 py-3">
															{item?.debit || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.credit || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.bank_charge || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.proc_charge || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.balance || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.particulars || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.curr_roi || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.period || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.period_mode || "---"}
														</td>
														<td className="px-6 py-3">
															{item?.tot_emi || "---"}
														</td>
													</tr>
												)
											})}
											<tr
												className={"text-slate-50 bg-slate-700 sticky bottom-0"}
											>
												<td className="px-6 py-3" colSpan={2}>
													Total:
												</td>
												<td className="px-6 py-3" colSpan={1}>
													{totalDebit?.toFixed(2)}
												</td>
												<td className="px-6 py-3" colSpan={4}>
													{totalCredit?.toFixed(2)}
												</td>
												<td className="px-6 py-3" colSpan={5}>
													Total Recovery:{" "}
													{
														reportTxnData?.filter(
															(item, i) => item?.tr_type === "R"
														)?.length
													}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						)}
						{reportTxnData.length !== 0 && (
							<div className="flex gap-4">
								<Tooltip title="Export to Excel">
									<button
										onClick={() => exportToExcel(reportTxnData)}
										className="mt-5 justify-center items-center rounded-full text-green-900"
									>
										<FileExcelOutlined
											style={{
												fontSize: 30,
											}}
										/>
									</button>
								</Tooltip>
								<Tooltip title="Print">
									<button
										onClick={() =>
											printTableLoanStatement(
												reportTxnData,
												"Loan Statement",
												searchType,
												metadataDtls,
												fromDate,
												toDate
											)
										}
										className="mt-5 justify-center items-center rounded-full text-pink-600"
									>
										<PrinterOutlined
											style={{
												fontSize: 30,
											}}
										/>
									</button>
								</Tooltip>
							</div>
						)}

						{reportTxnData.length === 0 && "No data found."}
					</Modal>
				</main>
			</Spin>
		</div>
	)
}

export default ALoanStatementMain

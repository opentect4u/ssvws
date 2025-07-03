import React, { useEffect, useState } from "react"
import Sidebar from "../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../Address/BaseUrl"
import { Message } from "../../../Components/Message"
import { Spin, Button, Modal, Tooltip, DatePicker, Progress } from "antd"
import dayjs from "dayjs"
import {
	LoadingOutlined,
	SearchOutlined,
	PrinterOutlined,
	FileExcelOutlined,
} from "@ant-design/icons"
import Radiobtn from "../../../Components/Radiobtn"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"

import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { printTableLoanStatement } from "../../../Utils/printTableLoanStatement"
import { printTableLoanTransactions } from "../../../Utils/printTableLoanTransactions"
import { printTableOutstandingReport } from "../../../Utils/printTableOutstandingReport"

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

function OutstaningReportMain() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	// const [openModal, setOpenModal] = useState(false)
	// const [approvalStatus, setApprovalStatus] = useState("S")
	const [searchType, setSearchType] = useState(() => "M")

	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [reportData, setReportData] = useState(() => [])
	// const [reportTxnData, setReportTxnData] = useState(() => [])
	// const [tot_sum, setTotSum] = useState(0)
	// const [search, setSearch] = useState("")
	const [progress, setProgress] = useState(0)

	const [metadataDtls, setMetadataDtls] = useState(() => null)

	const [breakFromLoop, setBreakFromLoop] = useState(() => false)

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setSearchType(e)
	}

	const handleFetchReportOutstandingMemberwise = async () => {
		let min = 0
		const maxBatchSize = 50

		const increment = 5

		setLoading(true)

		// while (true) {
		// 	const creds = {
		// 		os_dt: formatDateToYYYYMMDD(fromDate),
		// 		branch_code: userDetails?.brn_code,
		// 		min: min,
		// 		max: min + maxBatchSize,
		// 	}

		// 	console.log("--------------- WHILE CREDS ---------------", creds)

		// 	try {
		// 		const res = await axios.post(
		// 			`${url}/loan_outstanding_report_memberwise`,
		// 			creds
		// 		)
		// 		const data = res?.data?.msg || []
		// 		if (data?.length === 0) {
		// 			console.log(
		// 				"--------------- LOOP BREAKS ---------------",
		// 				data?.length
		// 			)
		// 			setProgress(100)
		// 			break
		// 		}

		// 		console.log("---------- DATA MEMWISE -----------", data)

		// 		// setReportData((prev) => [...prev, ...data])
		// 		setReportData(res?.data?.msg)
		// 		min += maxBatchSize

		// 		setProgress((prev) => Math.min(100, prev + increment))

		// 		setLoading(false)
		// 	} catch (err) {
		// 		console.log("ERRRR>>>", err)
		// 		break
		// 	}
		// }

		const creds = {
			os_dt: formatDateToYYYYMMDD(fromDate),
			branch_code: userDetails?.brn_code,
			min: min,
			max: min + maxBatchSize,
		}

		await axios
			.post(`${url}/loan_outstanding_report_memberwise`, creds)
			.then((res) => {
				const data = res?.data?.msg || []
				if (data?.length === 0) {
					console.log(
						"--------------- LOOP BREAKS ---------------",
						data?.length
					)
					setProgress(100)
					// break
				}

				console.log("---------- DATA MEMWISE -----------", data)

				// setReportData((prev) => [...prev, ...data])
				setReportData(data)
				// min += maxBatchSize

				// setProgress((prev) => Math.min(100, prev + increment))
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const handleFetchReportOutstandingGroupwise = async () => {
		let min = 0
		const maxBatchSize = 50

		const increment = 5

		setLoading(true)

		// while (true) {
		// 	const creds = {
		// 		os_dt: formatDateToYYYYMMDD(fromDate),
		// 		branch_code: userDetails?.brn_code,
		// 		min: min,
		// 		max: min + maxBatchSize,
		// 	}

		// 	console.log("--------------- WHILE CREDS ---------------", creds)

		// 	try {
		// 		const res = await axios.post(
		// 			`${url}/loan_outstanding_report_groupwise`,
		// 			creds
		// 		)
		// 		const data = res?.data?.msg || []
		// 		if (data.length === 0) {
		// 			console.log(
		// 				"--------------- LOOP BREAKS ---------------",
		// 				data?.length
		// 			)
		// 			setProgress(100)
		// 			break
		// 		}

		// 		console.log("---------- DATA GROUPWISE -----------", data)

		// 		setReportData((prev) => [...prev, ...data])
		// 		min += maxBatchSize

		// 		setProgress((prev) => Math.min(100, prev + increment))

		// 		setLoading(false)
		// 	} catch (err) {
		// 		console.log("ERRRR>>>", err)
		// 		break
		// 	}
		// }

		const creds = {
			os_dt: formatDateToYYYYMMDD(fromDate),
			branch_code: userDetails?.brn_code,
			min: min,
			max: min + maxBatchSize,
		}

		await axios
			.post(`${url}/loan_outstanding_report_groupwise`, creds)
			.then((res) => {
				const data = res?.data?.msg || []
				if (data.length === 0) {
					console.log(
						"--------------- LOOP BREAKS ---------------",
						data?.length
					)
				}

				console.log("---------- DATA GROUPWISE -----------", res?.data)

				setReportData(data)

				console.log("RESSS approveRecoveryTransaction", res?.data)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	// useEffect(() => {
	// 	if (searchType === "M" && fromDate) {
	// 		handleFetchReportOutstandingMemberwise()
	// 	} else if (searchType === "G" && fromDate) {
	// 		handleFetchReportOutstandingGroupwise()
	// 	}
	// }, [searchType, fromDate])

	const handleSubmit = () => {
		if (searchType === "M" && fromDate) {
			handleFetchReportOutstandingMemberwise()
		} else if (searchType === "G" && fromDate) {
			handleFetchReportOutstandingGroupwise()
		}
	}

	useEffect(() => {
		setReportData(() => [])
		setMetadataDtls(() => null)
		totalBal = 0
		totalODBal = 0
		totalInterestBal = 0
		totalOutstandingBal = 0
		setProgress(0)
		// setBreakFromLoop(true)
	}, [searchType])

	const exportToExcel = (data) => {
		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.json_to_sheet(data)
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
		const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" })
		const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" })
		saveAs(blob, "outstanding_report.xlsx")
	}

	const s2ab = (s) => {
		const buf = new ArrayBuffer(s.length)
		const view = new Uint8Array(buf)
		for (let i = 0; i < s.length; i++) {
			view[i] = s.charCodeAt(i) & 0xff
		}
		return buf
	}

	let totalBal = 0
	let totalODBal = 0
	let totalInterestBal = 0
	let totalOutstandingBal = 0

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
					{/* <div>
						<Progress
							type="line"
							percent={progress}
							size="default"
							strokeColor={"#0694a2"}
							strokeWidth={5}
							showInfo={false}
						/>
					</div> */}
					<div className="flex flex-row gap-3 mt-20  py-3 rounded-xl">
						<div className="text-3xl text-slate-700 font-bold">
							Outstanding Report
						</div>
					</div>

					<div className="text-slate-800 italic">
						Branch: {userDetails?.branch_name}
					</div>

					<div className="mb-2 flex justify-between items-center">
						<div>
							<Radiobtn
								data={options}
								val={searchType}
								onChangeVal={(value) => {
									onChange(value)
								}}
							/>
						</div>

						{/* R.I.P Sweet bro */}

						{/* <div>
							<div className="text-slate-800">Choose Date:</div>
							<RangePicker
								className="p-2 shadow-md"
								format={dateFormat}
								onChange={(dates, dateStrings) => {
									console.log("-------dates", dates)
									console.log("-------dateStrings", dateStrings)
									setFromDate(dateStrings[0])
									setToDate(dateStrings[1])
								}}
							/>
						</div> */}
					</div>

					{/* {reportData?.length !== 0 && (
						<div className="flex justify-center items-center">
							<Progress
								type="dashboard"
								percent={progress}
								size="default"
								strokeColor={"#0694a2"}
								strokeWidth={10}
							/>
						</div>
					)} */}
					{/* <div className="my-4 mx-auto">
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
					</div> */}

					{/* <RangePicker
						format={dateFormat}
						onChange={(dates, dateStrings) => {
							console.log("-------dates", dates)
							console.log("-------dateStrings", dateStrings)
							setFromDate(dateStrings[0])
							setToDate(dateStrings[1])
						}}
					/> */}

					{/* <div className="grid grid-cols-2 gap-5 mt-5 align-middle items-center"> */}
					<div className="grid grid-cols-3 gap-5 mt-5 items-end">
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
							<button
								className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
								onClick={() => {
									handleSubmit()
								}}
							>
								<SearchOutlined /> <spann className={`ml-2`}>Search</spann>
							</button>
						</div>
						{/* <div>
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
						</div> */}
						{/* <div>
							<Progress
								type="dashboard"
								percent={progress}
								size="default"
								strokeColor={"#0694a2"}
								strokeWidth={10}
							/>
						</div> */}
					</div>

					{/* For Memberwise Results */}

					{searchType === "M" && reportData.length > 0 && (
						<div
							className={`relative overflow-x-auto shadow-md sm:rounded-lg mt-5 max-h-[500px]
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
												Sl. No.
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Member Code
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Member Name
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Group Code
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Group Name
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Loan ID
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Disbursement Date
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Current R.O.I
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Period Mode
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Total EMI
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Period
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Installment End Date
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Balance
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												OD Balance
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Interest Balance
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Total Outstanding
											</th>
										</tr>
									</thead>
									<tbody>
										{reportData?.map((item, i) => {
											totalBal += item?.balance
											totalODBal += item?.od_balance
											totalInterestBal += item?.intt_balance
											totalOutstandingBal += item?.total_outstanding
											return (
												<tr
													key={i}
													className={
														i % 2 === 0 ? "bg-slate-200 text-slate-900" : ""
													}
												>
													<td className="px-6 py-3">{i + 1}</td>
													<td className="px-6 py-3">
														{item?.member_code || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.client_name || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.group_code || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.group_name || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.loan_id || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.disb_dt
															? new Date(item?.disb_dt)?.toLocaleDateString(
																	"en-GB"
															  )
															: "---"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.curr_roi)?.toFixed(2) || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.period_mode || "---"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.tot_emi)?.toFixed(2) || "---"}
													</td>
													<td className="px-6 py-3">{item?.period || "---"}</td>
													<td className="px-6 py-3">
														{item?.instl_end_dt
															? new Date(
																	item?.instl_end_dt
															  )?.toLocaleDateString("en-GB")
															: "---"}
													</td>
													<td className="px-6 py-3">{item?.balance || "0"}</td>
													<td className="px-6 py-3">
														{parseFloat(item?.od_balance)?.toFixed(2) || "0"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.intt_balance)?.toFixed(2) || "0"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(+item?.total_outstanding)?.toFixed(2) ||
															"---"}
													</td>
												</tr>
											)
										})}
										<tr
											className={"text-slate-50 bg-slate-700 sticky bottom-0"}
										>
											<td className="px-6 py-3" colSpan={12}>
												Total:
											</td>
											<td className="px-6 py-3" colSpan={1}>
												{parseFloat(totalBal)?.toFixed(2)}
											</td>
											<td className="px-6 py-3" colSpan={1}>
												{parseFloat(totalODBal)?.toFixed(2)}
											</td>
											<td className="px-6 py-3" colSpan={1}>
												{parseFloat(totalInterestBal)?.toFixed(2)}
											</td>
											<td className="px-6 py-3" colSpan={1}>
												{parseFloat(totalOutstandingBal)?.toFixed(2)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* For Groupwise Results */}

					{searchType === "G" && reportData.length > 0 && (
						<div
							className={`relative overflow-x-auto shadow-md sm:rounded-lg mt-5 max-h-[500px]
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
												Sl. No.
											</th>
											{/* <th scope="col" className="px-6 py-3 font-semibold ">
												Loan ID
											</th> */}
											<th scope="col" className="px-6 py-3 font-semibold ">
												Group Code
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Group Name
											</th>
											{/* <th scope="col" className="px-6 py-3 font-semibold ">
												Loan ID
											</th> */}
											<th scope="col" className="px-6 py-3 font-semibold ">
												Purpose
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Sub Purpose
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Scheme
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Fund
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Applied Date
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Applied Amount
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Principal Disbursement Amount
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Disbursement Date
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Current R.O.I
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Installment Start Date
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Period Mode
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Total EMI
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Installment End Date
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Total Balance
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Total OD Balance
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Total Interest Balance
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Total Outstanding
											</th>
										</tr>
									</thead>
									<tbody>
										{reportData?.map((item, i) => {
											totalBal += item?.balance
											totalODBal += +item?.od_balance
											totalInterestBal += +item?.intt_balance
											totalOutstandingBal += +item?.total_outstanding
											return (
												<tr
													key={i}
													className={
														i % 2 === 0 ? "bg-slate-200 text-slate-900" : ""
													}
												>
													<td className="px-6 py-3">{i + 1}</td>
													{/* <td className="px-6 py-3">
														{item?.loan_id || "---"}
													</td> */}
													<td className="px-6 py-3">
														{item?.group_code || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.group_name || "---"}
													</td>
													{/* <td className="px-6 py-3">
														{item?.loan_id || "---"}
													</td> */}
													<td className="px-6 py-3">
														{item?.purpose_name || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.sub_purp_name || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.scheme_name || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.fund_name || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.applied_dt
															? new Date(item?.applied_dt)?.toLocaleDateString(
																	"en-GB"
															  )
															: "---"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.applied_amt)?.toFixed(2) || "---"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.prn_disb_amt)?.toFixed(2) ||
															"---"}
													</td>
													<td className="px-6 py-3">
														{item?.disb_dt
															? new Date(item?.disb_dt)?.toLocaleDateString(
																	"en-GB"
															  )
															: "---"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.curr_roi)?.toFixed(2) || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.instl_start_dt
															? new Date(
																	item?.instl_start_dt
															  )?.toLocaleDateString("en-GB")
															: "---"}
													</td>
													<td className="px-6 py-3">
														{item?.period_mode || "---"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.tot_emi)?.toFixed(2) || "---"}
													</td>
													<td className="px-6 py-3">
														{item?.instl_end_dt
															? new Date(
																	item?.instl_end_dt
															  )?.toLocaleDateString("en-GB")
															: "---"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.balance)?.toFixed(2) || "0"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.od_balance)?.toFixed(2) || "0"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.intt_balance)?.toFixed(2) || "0"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.total_outstanding)?.toFixed(2) ||
															"---"}
													</td>
												</tr>
											)
										})}
										<tr
											className={"text-slate-50 bg-slate-700 sticky bottom-0"}
										>
											<td className="px-6 py-3" colSpan={16}>
												Total:
											</td>
											<td className="px-6 py-3" colSpan={1}>
												{parseFloat(totalBal)?.toFixed(2)}
											</td>
											<td className="px-6 py-3" colSpan={1}>
												{parseFloat(totalODBal)?.toFixed(2)}
											</td>
											<td className="px-6 py-3" colSpan={1}>
												{parseFloat(totalInterestBal)?.toFixed(2)}
											</td>
											<td className="px-6 py-3" colSpan={1}>
												{parseFloat(+totalOutstandingBal)?.toFixed(2)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* ///////////////////////////////////////////////////////////////// */}

					{reportData.length !== 0 && (
						<div className="flex gap-4">
							<Tooltip title="Export to Excel">
								<button
									onClick={() => exportToExcel(reportData)}
									className="mt-5 justify-center items-center rounded-full text-green-900 disabled:text-green-300"
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
										printTableOutstandingReport(
											reportData,
											"Outstanding Report",
											searchType,
											userDetails?.branch_name,
											fromDate,
											toDate
										)
									}
									className="mt-5 justify-center items-center rounded-full text-pink-600 disabled:text-pink-300"
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
				</main>
			</Spin>
		</div>
	)
}

export default OutstaningReportMain

import React, { useEffect, useState } from "react"
import Sidebar from "../../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../../Address/BaseUrl"
import { Message } from "../../../../Components/Message"
import { Spin, Button, Modal, Tooltip, DatePicker } from "antd"
import dayjs from "dayjs"
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
import { printTableDemandReport } from "../../../../Utils/printTableDemandReport"

// const { RangePicker } = DatePicker
// const dateFormat = "YYYY/MM/DD"

const options = [
	{
		label: "Disbursement",
		value: "D",
	},
	{
		label: "Collection",
		value: "R",
	},
]

function ADemandReportsMain() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	// const [openModal, setOpenModal] = useState(false)
	// const [approvalStatus, setApprovalStatus] = useState("S")
	const [searchType, setSearchType] = useState(() => "D")

	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [reportData, setReportData] = useState(() => [])
	const [branch, setBranch] = useState(() => "")
	const [branches, setBranches] = useState(() => [])
	// const [reportTxnData, setReportTxnData] = useState(() => [])
	// const [tot_sum, setTotSum] = useState(0)
	// const [search, setSearch] = useState("")

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

	const handleFetchReportDemand = async () => {
		setLoading(true)
		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			to_dt: formatDateToYYYYMMDD(toDate),
			branch_code: branch,
		}

		await axios
			.post(`${url}/loan_demand_report`, creds)
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

	// useEffect(() => {
	// 	// setMetadataDtls(
	// 	// 	JSON.parse({
	// 	// 		branchName: userDetails?.branch_name,
	// 	// 	})
	// 	// )
	// }, [])

	// useEffect(() => {
	// 	console.log("AAAAAAAAAAAAAAAAAAAAAAA", fromDate, toDate)
	// 	if (
	// 		fromDate &&
	// 		toDate
	// 		// &&
	// 		// new Date(fromDate)?.toLocaleDateString()?.length === 10 &&
	// 		// new Date(toDate)?.toLocaleDateString()?.length === 10
	// 	) {
	// 		handleFetchReportDemand()
	// 	}
	// 	// else if (searchType === "D" && fromDate && toDate) {
	// 	// 	handleFetchReportDisbursement()
	// 	// }
	// }, [fromDate, toDate])

	const searchData = () => {
		if (
			fromDate &&
			toDate
			// &&
			// new Date(fromDate)?.toLocaleDateString()?.length === 10 &&
			// new Date(toDate)?.toLocaleDateString()?.length === 10
		) {
			handleFetchReportDemand()
		}
	}

	useEffect(() => {
		setReportData(() => [])
		setMetadataDtls(() => null)
	}, [searchType])

	const exportToExcel = (data) => {
		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.json_to_sheet(data)
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
		const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" })
		const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" })
		saveAs(blob, "loan_transaction_report.xlsx")
	}

	const s2ab = (s) => {
		const buf = new ArrayBuffer(s.length)
		const view = new Uint8Array(buf)
		for (let i = 0; i < s.length; i++) {
			view[i] = s.charCodeAt(i) & 0xff
		}
		return buf
	}

	// let totalRecovery = 0
	// let totalCredit = 0
	// let totalDebit = 0
	// let totalCreditGrpwise = 0
	let totalDemand = 0

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
							DEMAND REPORT
						</div>
					</div>

					<div className="mb-2 flex justify-between items-center">
						{/* <div>
							<Radiobtn
								data={options}
								val={searchType}
								onChangeVal={(value) => {
									onChange(value)
								}}
							/>
						</div> */}

						{/* R.I.P Sweet bro */}

						{/* <div className="mt-5">
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
					{/* <div className="text-slate-800 italic">
						Branch: {userDetails?.branch_name}
					</div> */}

					<div className="grid grid-cols-4 gap-5 mt-5 items-end">
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
						<div>
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
						</div>
						<div>
							<button
								className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
								onClick={() => {
									searchData()
								}}
							>
								<SearchOutlined /> <spann className={`ml-2`}>Search</spann>
							</button>
						</div>
					</div>

					{/* For Demand Results */}

					{reportData.length > 0 && (
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
												Loan ID
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
											{/* <th scope="col" className="px-6 py-3 font-semibold ">
												Loan ID
											</th> */}
											<th scope="col" className="px-6 py-3 font-semibold ">
												Disbursement Date
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Current R.O.I
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Period
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Installment End Date
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Period Mode
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Total EMI
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Balance
											</th>
											<th scope="col" className="px-6 py-3 font-semibold ">
												Demand
											</th>
										</tr>
									</thead>
									<tbody>
										{reportData?.map((item, i) => {
											totalDemand += +item?.demand
											return (
												<tr
													key={i}
													className={
														i % 2 === 0 ? "bg-slate-200 text-slate-900" : ""
													}
												>
													<td className="px-6 py-3">{i++}</td>
													<td className="px-6 py-3">
														{item?.loan_id || "---"}
													</td>
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
													{/* <td className="px-6 py-3">
														{item?.loan_id || "---"}
													</td> */}
													<td className="px-6 py-3">
														{item?.disb_dt
															? new Date(item?.disb_dt)?.toLocaleDateString(
																	"en-GB"
															  )
															: "---"}
													</td>

													<td className="px-6 py-3">
														{item?.curr_roi || "---"}
													</td>
													<td className="px-6 py-3">{item?.period || "---"}</td>
													<td className="px-6 py-3">
														{item?.instl_end_dt
															? new Date(
																	item?.instl_end_dt
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
														{item?.balance_dt || "---"}
													</td>
													<td className="px-6 py-3">
														{parseFloat(item?.demand)?.toFixed(2) || "---"}
													</td>
												</tr>
											)
										})}
										<tr
											className={"text-slate-50 bg-slate-700 sticky bottom-0"}
										>
											<td className="px-6 py-3" colSpan={13}>
												Total Demand:
											</td>
											<td className="px-6 py-3" colSpan={1}>
												{parseFloat(totalDemand)?.toFixed(2)}
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
										printTableDemandReport(
											reportData,
											"Loan Demand Report",
											searchType,
											userDetails?.branch_name,
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
				</main>
			</Spin>
		</div>
	)
}

export default ADemandReportsMain

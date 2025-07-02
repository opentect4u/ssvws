import React, { useEffect, useState } from "react"
import Sidebar from "../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../Address/BaseUrl"
import { Message } from "../../../Components/Message"
import { Spin, Button, Modal, Tooltip, DatePicker } from "antd"
import {
	LoadingOutlined,
	SearchOutlined,
	PrinterOutlined,
	FileExcelOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons"
import Radiobtn from "../../../Components/Radiobtn"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"

import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { printTableLoanStatement } from "../../../Utils/printTableLoanStatement"
import {
	loanStatementHeader,
	loanStatementHeaderGroupwise,
} from "../../../Utils/Reports/headerMap"
import { exportToExcel } from "../../../Utils/exportToExcel"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import { printTableReport } from "../../../Utils/printTableReport"

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

function LoanStatementMain() {
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

	const [metadataDtls, setMetadataDtls] = useState(() => null)
	const [branches, setBranches] = useState(() => [])
	const [branch, setBranch] = useState(() =>
		+userDetails?.brn_code !== 100
			? `${userDetails?.brn_code},${userDetails?.branch_name}`
			: ""
	)

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
			branch_code:
				+userDetails?.brn_code === 100
					? branch.split(",")[0]
					: userDetails?.brn_code,
		}

		await axios
			.post(`${url}/loan_statement_memb_dtls`, creds)
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
			branch_code:
				+userDetails?.brn_code === 100
					? branch.split(",")[0]
					: userDetails?.brn_code,
		}

		await axios
			.post(`${url}/loan_statement_group_dtls`, creds)
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
			branch_id:
				+userDetails?.brn_code === 100
					? branch.split(",")[0]
					: userDetails?.brn_code,
		}

		await axios
			.post(`${url}/loan_statement_report`, creds)
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
			branch_code:
				+userDetails?.brn_code === 100
					? branch.split(",")[0]
					: userDetails?.brn_code,
		}

		await axios
			.post(`${url}/loan_statement_group_report`, creds)
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
	// if (searchType === "M" && search.length > 2) {
	// 	handleFetchReportMemberwise()
	// } else if (searchType === "G" && search.length > 2) {
	// 	handleFetchReportGroupwise()
	// }
	// }, [searchType, search])

	const searchData = () => {
		if (searchType === "M" && search.length > 2) {
			handleFetchReportMemberwise()
		} else if (searchType === "G" && search.length > 2) {
			handleFetchReportGroupwise()
		}
	}

	useEffect(() => {
		setReportData(() => [])
		setReportTxnData(() => [])
		setMetadataDtls(() => null)
	}, [searchType])

	const fetchSearchTypeName = (searchType) => {
		if (searchType === "M") {
			return "Memberwise"
		} else if (searchType === "G") {
			return "Groupwise"
		} else if (searchType === "F") {
			return "Fundwise"
		} else if (searchType === "C") {
			return "CO-wise"
		} else if (searchType === "B") {
			return "Branchwise"
		} else if (searchType === "D") {
			return "Disbursement"
		} else if (searchType === "R") {
			return "Recovery"
		}
	}

	const dataToExport = reportTxnData

	const headersToExport =
		searchType === "M" ? loanStatementHeader : loanStatementHeaderGroupwise

	const fileName = `Loan_Statement_${fetchSearchTypeName(
		searchType
	)}_${new Date().toLocaleString("en-GB")}.xlsx`

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

					{+userDetails?.brn_code === 100 && (
						<div>
							<TDInputTemplateBr
								placeholder="Branch..."
								type="text"
								label="Branch"
								name="branch"
								formControlName={branch?.split(",")[0]}
								handleChange={(e) => {
									console.log("***********========", e)
									setBranch(
										e.target.value +
											"," +
											[
												// { branch_code: "A", branch_name: "All Branches" },
												...branches,
											].filter((i) => i.branch_code == e.target.value)[0]
												?.branch_name
									)
									console.log(branches)
									console.log(
										e.target.value +
											"," +
											[
												// { branch_code: "A", branch_name: "All Branches" },
												...branches,
											].filter((i) => i.branch_code == e.target.value)[0]
												?.branch_name
									)
								}}
								mode={2}
								data={[
									// { code: "A", name: "All Branches" },
									...branches?.map((item, i) => ({
										code: item?.branch_code,
										name: item?.branch_name,
									})),
								]}
							/>
						</div>
					)}

					{/* <div class="my-4 mx-auto"> */}
					<div class="w-full gap-5 mt-5 items-end">
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
						<div className="flex justify-center my-3">
							<button
								className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
								onClick={() => {
									searchData()
								}}
							>
								<SearchOutlined /> <spann class={`ml-2`}>Search</spann>
							</button>
						</div>
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
							<DynamicTailwindTable
								data={reportTxnData}
								dateTimeExceptionCols={[0]}
								colRemove={[5]}
								columnTotal={[2, 3]}
								headersMap={loanStatementHeader}
								indexing
							/>
						)}

						{/* For Groupwise */}

						{searchType === "G" && reportTxnData.length > 0 && (
							<DynamicTailwindTable
								data={reportTxnData}
								dateTimeExceptionCols={[0]}
								columnTotal={[1, 2]}
								colRemove={[4]}
								headersMap={loanStatementHeaderGroupwise}
								indexing
							/>
						)}
						{reportTxnData.length !== 0 && (
							<div className="flex gap-4 -mt-14">
								<Tooltip title="Export to Excel">
									<button
										onClick={() =>
											exportToExcel(dataToExport, headersToExport, fileName, [
												0,
											])
										}
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
										// onClick={() =>
										// 	printTableLoanStatement(
										// 		reportTxnData,
										// 		"Loan Statement",
										// 		searchType,
										// 		metadataDtls,
										// 		fromDate,
										// 		toDate
										// 	)
										// }
										onClick={() =>
											printTableReport(
												dataToExport,
												headersToExport,
												fileName?.split(",")[0],
												[0]
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

export default LoanStatementMain

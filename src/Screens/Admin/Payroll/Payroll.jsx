import React, { useEffect, useMemo, useState } from "react"
import Sidebar from "../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../Address/BaseUrl"
import { Message } from "../../../Components/Message"
import { Spin, Button, Modal, Tooltip, DatePicker, Popconfirm, Tag } from "antd"
import {
	LoadingOutlined,
	SearchOutlined,
	PrinterOutlined,
	FileExcelOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"

import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { printTableRegular } from "../../../Utils/printTableRegular"
import { exportToExcel } from "../../../Utils/exportToExcel"
import {
	absenteesReportHeader,
	attendanceReportHeader,
} from "../../../Utils/Reports/headerMap"
import DynamicTailwindAccordion from "../../../Components/Reports/DynamicTailwindAccordion"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import Radiobtn from "../../../Components/Radiobtn"
import { printTableReport } from "../../../Utils/printTableReport"

// const { RangePicker } = DatePicker
// const dateFormat = "YYYY/MM/DD"

const options = [
	{
		label: "All",
		value: "",
	},
	{
		label: "Late In",
		value: "L",
	},
	{
		label: "Early Out",
		value: "E",
	},
	// {
	// 	label: "Absent",
	// 	value: "A",
	// },
]

const options2 = [
	{
		label: "Normal",
		value: "N",
	},
	{
		label: "Absent",
		value: "A",
	},
]

function Payroll({ branchCode = 100 }) {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	const [searchType, setSearchType] = useState(() => "")
	const [searchType2, setSearchType2] = useState(() => "N")

	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [reportData, setReportData] = useState(() => [])
	const [absentListData, setAbsentListData] = useState(() => [])
	const [branch, setBranch] = useState(() =>
		+branchCode !== 100
			? `${userDetails?.brn_code},${userDetails?.branch_name}`
			: ""
	)
	const [branches, setBranches] = useState(() => [])
	const [employees, setEmployees] = useState(() => [])
	const [employee, setEmployee] = useState(() => "")
	const [tot_present, setTotPresent] = useState(() => 0)
	const [tot_early_out, setTotEarlyOut] = useState(() => 0)
	const [tot_late_in, setTotLateIn] = useState(() => 0)
	const [tot_hours, setTothours] = useState(() => 0)

	const [metadataDtls, setMetadataDtls] = useState(() => "")

	const filteringData = [
		{
			header_name: "late_in",
			value: "L",
		},
		{
			header_name: "late_in",
			value: "E",
		},
	]

	console.log("+branchCode !== 100", +branchCode !== 100)

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setSearchType(e)
	}

	const onChange2 = (e) => {
		console.log("radio1 checked", e)
		setSearchType2(e)
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
	const handleFetchEmployees = async () => {
		setLoading(true)
		await axios
			.post(`${url}/fetch_employee_fr_branch`, {
				branch_id: branch?.split(",")[0],
			})
			.then((res) => {
				console.log("QQQQQQQQQQQQQQQQ", res?.data)
				setEmployees(res?.data?.msg)
			})
			.catch((err) => {
				console.log("?????????????????????", err)
			})

		setLoading(false)
	}

	useEffect(() => {
		handleFetchBranches()
	}, [])

	useEffect(() => {
		handleFetchEmployees()
	}, [branch])

	const handleFetchReport = async () => {
		setLoading(true)
		const creds = {
			from_date: formatDateToYYYYMMDD(fromDate),
			to_date: formatDateToYYYYMMDD(toDate),
			// branch_id: userDetails?.brn_code,
			branch_id: branch.split(",")[0],
			emp_id: employee,
		}
		console.log("KKKKKKKKKKKKKKKKKKK======", branch)
		await axios
			.post(`${url}/attendance_report_brnwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
				setMetadataDtls(
					userDetails?.brn_code +
						"," +
						branches.filter((e) => +e.branch_code == +userDetails?.brn_code)[0]
							?.branch_name
				)
				console.log(
					userDetails?.brn_code +
						"," +
						branches.filter((e) => +e.branch_code == +userDetails?.brn_code)[0]
							?.branch_name
				)
				if (res?.data?.msg?.length == 0) Message("error", "No Data!")
				console.log("KKKKKKKKKKKKKKKKKKK", branch)
				// setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const handleFetchAbsentList = async () => {
		setLoading(true)
		const creds = {
			absent_data: [
				{
					from_date: formatDateToYYYYMMDD(fromDate),
					to_date: formatDateToYYYYMMDD(toDate),
					branch_id: branch.split(",")[0],
				},
			],
		}

		await axios
			.post(`${url}/fetch_absent_list`, creds)
			.then((res) => {
				setReportData([])
				console.log("ABSENT LIST======>>>>", res?.data)
				setAbsentListData(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		if (searchType2 === "A") {
			// setToDate(formatDateToYYYYMMDD(new Date()))
			setAbsentListData([])
			setReportData([])
		}
	}, [searchType2, branch])

	const filteredReportData = useMemo(() => {
		if (searchType === "L" || searchType === "E") {
			const f = filteringData.find((f) => f.value === searchType)
			return reportData.filter((row) => row[f.header_name] === f.value)
		}
		return reportData
	}, [reportData, searchType])

	const dataToExport = searchType2 === "A" ? absentListData : filteredReportData

	const headersToExport =
		searchType2 === "A" ? absenteesReportHeader : attendanceReportHeader

	const fileName =
		searchType2 === "A"
			? `Absent_List_${new Date().toLocaleString("en-GB")}.xlsx`
			: `Attendance_Report_${new Date().toLocaleString("en-GB")}.xlsx`

	const handleSubmit = () => {
		if (fromDate && toDate && employee) {
			handleFetchReport()
			if (employee != "A" && employee) handleEmpDetails()
		}
	}

	const handleEmpDetails = () => {
		setLoading(true)
		const creds = {
			from_date: formatDateToYYYYMMDD(fromDate),
			to_date: formatDateToYYYYMMDD(toDate),
			branch_id: branch.split(",")[0],
			emp_id: employee,
		}
		axios.post(`${url}/show_per_emp_detls_per_brn`, creds).then((res) => {
			console.log("RESSSSS======>>>>", res?.data)
			setTotPresent(res?.data?.msg[0]?.tot_present)
			setTotEarlyOut(res?.data?.msg[0]?.early_out[0]?.tot_early_out)
			setTotLateIn(res?.data?.msg[0]?.late_in[0]?.tot_late_in)
			setTothours(res?.data?.msg[0]?.tot_work[0]?.total_work_hours)
		})
	}

	// const [activeDescriptionId, setActiveDescriptionId] = useState(null)

	// const toggleDescription = (userId) => {
	// 	setActiveDescriptionId((prevId) => (prevId === userId ? null : userId))
	// }

	const [remarksForDelete, setRemarksForDelete] = useState(() => "")

	const handleRejectAttendance = async (empId, inDateTime) => {
		setLoading(true)
		const creds = {
			emp_id: empId,
			in_date_time: inDateTime,
			attn_reject_remarks: remarksForDelete,
			rejected_by: userDetails?.emp_id,
		}

		await axios
			.post(`${url}/reject_atten_emp`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				Message("success", "Attendance Rejected Successfully")
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const confirm = async (empId, inDateTime) => {
		if (!remarksForDelete) {
			Message("error", "Please provide remarks for rejection")
			return
		}

		await handleRejectAttendance(empId, inDateTime)
			.then(() => {
				// fetchLoanApplications("R")
				setRemarksForDelete("")
			})
			.catch((err) => {
				console.log("Err in RecoveryMemberApproveTable.jsx", err)
			})
	}

	const cancel = (e) => {
		console.log(e)
		setRemarksForDelete("")
	}

	// ///////////////////////////////////////
	const renderCell = (key, val) => {
		if (key === "in_date_time") {
			return (
				<Tag color="green">
					{val
						? new Date(val)
								.toLocaleTimeString("en-GB", {
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
								})
								.toUpperCase()
						: ""}
				</Tag>
			)
		}
		if (key === "out_date_time") {
			return (
				<Tag color="red">
					{val
						? new Date(val)
								.toLocaleTimeString("en-GB", {
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
								})
								.toUpperCase()
						: ""}
				</Tag>
			)
		}
		if (key === "entry_dt") {
			return new Date(val).toLocaleDateString("en-GB")
		}
		// if (key === "late_in") {
		// 	const isLate = val === "L"
		// 	return (
		// 		<span
		// 			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
		// 				isLate ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
		// 			}`}
		// 		>
		// 			{isLate ? "Late In" : "Timely In"}
		// 		</span>
		// 	)
		// }
		// default
		return val
	}

	const renderRowDetails = (user) => (
		<div className="m-4 mx-auto w-full p-6 bg-white rounded-2xl shadow-md">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
				{/* Clock In */}
				<div>
					<h4 className="font-medium text-lg text-teal-500 mb-2">Clock In</h4>
					<Tag color="green" className="mb-2">
						{user.in_date_time
							? new Date(user.in_date_time)
									.toLocaleTimeString("en-GB", {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true,
									})
									.toUpperCase()
							: ""}
					</Tag>
					<p className="text-sm text-gray-700">{user.in_addr}</p>
				</div>
				{/* Clock Out */}
				<div>
					<h4 className="font-medium text-lg text-teal-500 mb-2">Clock Out</h4>
					<Tag color="red" className="mb-2">
						{user.out_date_time
							? new Date(user.out_date_time)
									.toLocaleTimeString("en-GB", {
										hour: "2-digit",
										minute: "2-digit",
										hour12: true,
									})
									.toUpperCase()
							: ""}
					</Tag>
					<p className="text-sm text-gray-700">{user.out_addr}</p>
				</div>
				{/* Attendance Status */}
				<div>
					<h4 className="font-medium text-lg text-teal-500 mb-2">
						Attendance Status
					</h4>
					<p
						className={`text-sm ${
							user.attan_status === "A"
								? "text-green-500"
								: user.attan_status === "R"
								? "text-red-500"
								: "text-gray-700"
						}`}
					>
						{user.attan_status === "A"
							? "Approved"
							: user.attan_status === "R"
							? "Rejected"
							: "Pending"}
					</p>
				</div>
				{/* Rejection Remarks */}
				<div>
					<h4 className="font-medium text-lg text-teal-500 mb-2">
						Rejection Remarks
					</h4>
					<p className="text-sm text-gray-700">
						{user.attn_reject_remarks || "N/A"}
					</p>
				</div>
				<div>
					<h4 className="font-medium text-lg text-teal-500 mb-2">
						Late Status
					</h4>
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
							user?.late_in === "L"
								? "bg-red-100 text-red-800"
								: "bg-green-100 text-green-800"
						}`}
					>
						{user?.late_in === "L"
							? "Late In"
							: user?.late_in === "E"
							? "Early Out"
							: "Timely In"}
					</span>
				</div>
				{/* Reject Button */}
				{(user.attan_status !== "R" && userDetails?.id != 3) && (
					<div className="col-span-5 flex justify-center items-center">
						<Popconfirm
							title={`Reject Attendance for ${user.emp_name}`}
							description={
								<div>
									<p>Are you sure you want to reject this attendance?</p>
									{/* your TDInputTemplateBr for remarks */}
								</div>
							}
							onConfirm={() =>
								confirm(
									user.emp_id,
									`${user.in_date_time.split("T")[0]} ${new Date(
										user.in_date_time
									).toLocaleTimeString("en-GB", {
										hour12: false,
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
									})}`
								)
							}
							onCancel={cancel}
							okText="Reject"
							cancelText="Cancel"
						>
							<button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition">
								<CheckCircleOutlined />
								<span className="ml-2">Reject Attendance</span>
							</button>
						</Popconfirm>
					</div>
				)}
			</div>
		</div>
	)

	return (
		<div>
			{/* <Sidebar mode={2} /> */}
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-slate-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 pb-5 bg-slate-50 rounded-lg shadow-lg h-auto my-10 mx-32">
					<div className="flex flex-row gap-3 py-3 rounded-xl">
						<div className="text-3xl text-slate-700 font-bold">
							ATTENDANCE REPORT
						</div>
					</div>

					<div className="mb-2">
						<Radiobtn
							data={options2}
							val={searchType2}
							onChangeVal={(value) => {
								onChange2(value)
							}}
						/>
					</div>

					<div className="grid grid-cols-3 gap-5 mt-5">
						{/* {searchType2 !== "A" && ( */}
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
						{/* )} */}
						<div>
							<TDInputTemplateBr
								placeholder="To Date"
								type="date"
								label="To Date"
								name="toDate"
								formControlName={toDate}
								handleChange={(e) => {
									setToDate(e.target.value)
								}}
								min={"1900-12-31"}
								mode={1}
								// disabled={searchType2 === "A"}
							/>
						</div>

						<div>
							<TDInputTemplateBr
								placeholder="Branch..."
								type="text"
								label="Branch"
								name="branch"
								formControlName={branch?.split(",")[0]}
								handleChange={(e) => {
									console.log("***********========", e)
									// setBranch(
									// 	e.target.value +
									// 		"," +
									// 		branches.filter((i) => i.branch_code == e.target.value)[0]
									// 			?.branch_name
									// )
									setBranch(
										e.target.value +
											"," +
											[
												{ branch_code: "A", branch_name: "All Branches" },
												...branches,
											].filter((i) => i.branch_code == e.target.value)[0]
												?.branch_name
									)
									console.log(branches)
									console.log(
										e.target.value +
											"," +
											[
												{ branch_code: "A", branch_name: "All Branches" },
												...branches,
											].filter((i) => i.branch_code == e.target.value)[0]
												?.branch_name
									)
								}}
								mode={2}
								disabled={+branchCode !== 100}
								// data={branches?.map((item, i) => ({
								// 	code: item?.branch_code,
								// 	name: item?.branch_name,
								// }))}
								data={[
									{ code: "A", name: "All Branches" },
									...branches?.map((item, i) => ({
										code: item?.branch_code,
										name: item?.branch_name,
									})),
								]}
							/>
						</div>
						{searchType2 !== "A" && (
							<div className="col-span-3">
								<TDInputTemplateBr
									placeholder="Employees..."
									type="text"
									label="Employees"
									name="employee"
									formControlName={employee}
									handleChange={(e) => {
										console.log("***********========", e)
										setEmployee(e.target.value)
										console.log(branches)
									}}
									mode={2}
									data={[
										{ code: "A", name: "All Employees" },
										...employees?.map((item, i) => ({
											code: item?.emp_id,
											name: item?.emp_name,
										})),
									]}
								/>
							</div>
						)}

						<div className="flex justify-center col-span-3">
							<button
								className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
								onClick={() => {
									if (searchType2 !== "A") {
										handleSubmit()
									} else {
										handleFetchAbsentList()
									}
								}}
							>
								<SearchOutlined /> <span className={`ml-2`}>Search</span>
							</button>
						</div>
					</div>

					{employee != "A" && employee && reportData.length > 0 && (
						<div className="grid grid-cols-3 mt-5 place-items-center">
							<div className="max-w-sm p-6  col-span-1  bg-white border border-teal-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
								<a href="#">
									<p className="mb-3 text-5xl font-light flex justify-center items-center my-2 text-teal-500 dark:text-gray-400">
										{tot_present || 0}
									</p>

									<h5 className="mb-2 text-2xl font-semibold flex justify-center tracking-tight text-slate-700 dark:text-white">
										No. of day(s) present
									</h5>
								</a>
							</div>

							<div className="max-w-sm p-6 col-span-1 bg-white border border-pink-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
								<a href="#">
									<p className="mb-3 text-5xl font-light flex justify-center items-center my-2 text-pink-500 dark:text-gray-400">
										{tot_hours || 0}
									</p>

									<h5 className="mb-2 text-2xl font-semibold flex justify-center tracking-tight text-slate-700 dark:text-white">
										Total hours worked
									</h5>
								</a>
							</div>

							<div className="max-w-sm p-6 col-span-1 bg-white border border-teal-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
								<a href="#">
									<div className="flex justify-around items-center gap-2">
										<p className="mb-3 text-5xl font-light flex justify-center items-center my-2 text-teal-500 dark:text-gray-400">
											{tot_late_in || 0}
										</p>
										<p className="mb-3 text-5xl font-light flex justify-center items-center my-2 text-teal-500 dark:text-gray-400">
											{tot_early_out || 0}
										</p>
									</div>

									<div className="flex justify-around items-center gap-2">
										<h5 className="mb-2 text-2xl font-semibold flex justify-center tracking-tight text-slate-700 dark:text-white">
											Late-In(s)
										</h5>
										<h5 className="mb-2 text-2xl font-semibold flex justify-center tracking-tight text-slate-700 dark:text-white">
											Early-Out(s)
										</h5>
									</div>
								</a>
							</div>
						</div>
					)}

					{/* For Recovery/Collection Results MR */}

					{reportData?.length > 0 && (
						<div className="mb-2">
							<Radiobtn
								data={options}
								val={searchType}
								onChangeVal={(value) => {
									onChange(value)
								}}
							/>
						</div>
					)}

					{reportData?.length > 0 && searchType !== "A" && (
						<DynamicTailwindAccordion
							indexing
							data={reportData}
							headerMap={attendanceReportHeader}
							pageSize={20}
							renderCell={renderCell}
							renderRowDetails={renderRowDetails}
							deleteCols={[7, 8, 9, 10, 11]}
							filter={
								searchType === "L"
									? filteringData[0]
									: searchType === "E"
									? filteringData[1]
									: searchType === ""
							}
						/>
					)}
					{absentListData?.length > 0 && searchType2 === "A" && (
						<DynamicTailwindTable
							data={absentListData}
							headersMap={absenteesReportHeader}
							pageSize={20}
							indexing
							dateTimeExceptionCols={[4]}
						/>
					)}

					{/* ///////////////////////////////////////////////////////////////// */}

					{(reportData.length !== 0 || absentListData.length !== 0) && (
						<div className="flex justify-end gap-4">
							<Tooltip title="Export to Excel">
								<button
									onClick={() =>
										exportToExcel(dataToExport, headersToExport, fileName, [0])
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
									onClick={() => {
										// console.log(metadataDtls)
										// printTableRegular(
										// 	reportData,
										// 	"Attendance Report",
										// 	metadataDtls,
										// 	fromDate,
										// 	toDate
										// )
										printTableReport(
											dataToExport,
											headersToExport,
											fileName?.split(",")[0],
											[0]
										)
									}}
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

export default Payroll

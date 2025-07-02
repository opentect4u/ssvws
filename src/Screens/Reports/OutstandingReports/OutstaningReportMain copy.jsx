import React, { useEffect, useState } from "react"
import Sidebar from "../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../Address/BaseUrl"
import { Spin, Tooltip } from "antd"
import {
	LoadingOutlined,
	SearchOutlined,
	PrinterOutlined,
	FileExcelOutlined,
} from "@ant-design/icons"
import { RefreshOutlined, Search } from "@mui/icons-material"
import Radiobtn from "../../../Components/Radiobtn"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"

import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { printTableOutstandingReport } from "../../../Utils/printTableOutstandingReport"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import {
	branchwiseOutstandingHeader,
	cowiseOutstandingHeader,
	fundwiseOutstandingHeader,
	groupwiseOutstandingHeader,
} from "../../../Utils/Reports/headerMap"
import Select from "react-select"

const options = [
	{
		label: "Groupwise",
		value: "G",
	},
	{
		label: "Fundwise",
		value: "F",
	},
	{
		label: "CO-wise",
		value: "C",
	},
	{
		label: "Memberwise",
		value: "M",
	},
	{
		label: "Branchwise",
		value: "B",
	},
]

function OutstaningReportMain() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)
	const [searchType, setSearchType] = useState("G")
	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [reportData, setReportData] = useState([])
	const [metadataDtls, setMetadataDtls] = useState(null)
	const [fetchedReportDate, setFetchedReportDate] = useState(() => "")
	const [funds, setFunds] = useState([])
	const [selectedFund, setSelectedFund] = useState("")
	const [cos, setCOs] = useState([])
	const [branches, setBranches] = useState([])
	const [selectedCO, setSelectedCO] = useState("")
	const [selectedOptions, setSelectedOptions] = useState([])
	const [selectedCOs, setSelectedCOs] = useState([])

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setSearchType(e)
	}

	const handleFetchReportOutstandingMemberwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? userDetails?.brn_code : branchCodes,
			supply_date: formatDateToYYYYMMDD(fromDate),
		}

		await axios
			.post(`${url}/loan_outstanding_report_memberwise`, creds)
			.then((res) => {
				const data = res?.data?.outstanding_member_data?.msg || []
				if (data.length === 0) {
					console.log("--------------- NO DATA ---------------", data?.length)
				}

				console.log("---------- DATA MEMBERWISE -----------", res?.data)
				setFetchedReportDate(
					new Date(res?.data?.balance_date).toLocaleDateString("en-GB")
				)
				setReportData(data)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const handleFetchReportOutstandingBranchwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			supply_date: formatDateToYYYYMMDD(fromDate),
		}

		await axios
			.post(`${url}/loan_outstanding_report_branchwise`, creds)
			.then((res) => {
				const data = res?.data?.outstanding_branch_data?.msg || []
				if (data.length === 0) {
					console.log("--------------- NO DATA ---------------", data?.length)
				}

				console.log("---------- DATA BRN WISE -----------", res?.data)
				setFetchedReportDate(
					new Date(res?.data?.balance_date).toLocaleDateString("en-GB")
				)
				setReportData(data)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const handleFetchReportOutstandingGroupwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		console.log("BRNADHIKUDUSTYSTUDGF", branchCodes)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			supply_date: formatDateToYYYYMMDD(fromDate),
		}

		await axios
			.post(`${url}/loan_outstanding_report_groupwise`, creds)
			.then((res) => {
				const data = res?.data?.outstanding_data?.msg || []
				if (data.length === 0) {
					console.log(
						"--------------- LOOP BREAKS ---------------",
						data?.length
					)
				}

				console.log("---------- DATA GROUPWISE -----------", res?.data)
				setFetchedReportDate(
					new Date(res?.data?.balance_date).toLocaleDateString("en-GB")
				)
				setReportData(data)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const getFunds = () => {
		setLoading(true)
		axios
			.get(`${url}/get_fund`)
			.then((res) => {
				console.log("FUNDSSSS ======>", res?.data)
				setFunds(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
				setLoading(false)
			})
		setLoading(false)
	}

	const handleFundChange = (e) => {
		const selectedId = e.target.value
		setSelectedFund(selectedId)
	}

	const handleFetchReportOutstandingFundwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			supply_date: formatDateToYYYYMMDD(fromDate),
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			fund_id: selectedFund,
		}

		await axios
			.post(`${url}/loan_outstanding_report_fundwise`, creds)
			.then((res) => {
				const data = res?.data?.outstanding_fund_data?.msg || []
				if (data.length === 0) {
					console.log("--------------- NO DATA ---------------", data?.length)
				}

				console.log("---------- DATA FUNDWISE -----------", res?.data)
				setFetchedReportDate(
					new Date(res?.data?.balance_date).toLocaleDateString("en-GB")
				)
				setReportData(data)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const getCOs = () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
		}
		axios
			.post(`${url}/fetch_brn_co`, creds)
			.then((res) => {
				console.log("COs ======>", res?.data)
				setCOs(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
				setLoading(false)
			})
		setLoading(false)
	}

	const handleCOChange = (e) => {
		const selectedId = e.target.value
		setSelectedCO(selectedId)
	}

	const handleFetchReportOutstandingCOwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const coCodes = selectedCOs?.map((item, i) => item?.value)

		const creds = {
			supply_date: formatDateToYYYYMMDD(fromDate),
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			co_id: coCodes?.length === 0 ? [selectedCO] : coCodes,
		}

		await axios
			.post(`${url}/loan_outstanding_report_cowise`, creds)
			.then((res) => {
				const data = res?.data?.outstanding_co_data?.msg || []
				if (data.length === 0) {
					console.log("--------------- NO DATA ---------------", data?.length)
				}

				console.log("---------- DATA CO-wise -----------", res?.data)
				setFetchedReportDate(
					new Date(res?.data?.balance_date).toLocaleDateString("en-GB")
				)
				setReportData(data)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const getBranches = () => {
		setLoading(true)
		const creds = {
			emp_id: userDetails?.emp_id,
			user_type: userDetails?.id,
		}
		axios
			.post(`${url}/fetch_branch_name_based_usertype`, creds)
			.then((res) => {
				console.log("Branches ======>", res?.data)
				setBranches(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
				setLoading(false)
			})
		setLoading(false)
	}

	useEffect(() => {
		getBranches()
	}, [])

	const runProcedureReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => ({
			branch_code: item?.value,
		}))
		// const coCodes = selectedCOs?.map((item, i) => item?.value)

		// const creds = {
		// 	supply_date: formatDateToYYYYMMDD(fromDate),
		// 	branch_code:
		// 		branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
		// 	co_id: coCodes?.length === 0 ? [selectedCO] : coCodes,
		// }

		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			branches:
				branchCodes?.length === 0
					? [{ branch_code: userDetails?.brn_code }]
					: branchCodes,
		}

		await axios
			.post(`${url}/call_outstanding_proc`, creds)
			.then((res) => {
				console.log("Procedure called", res?.data)
			})
			.catch((err) => {
				console.log("Some error while running procedure.", err)
			})

		setLoading(false)
	}

	const handleSubmit = () => {
		if (searchType === "M" && fromDate) {
			handleFetchReportOutstandingMemberwise()
		} else if (searchType === "G" && fromDate) {
			handleFetchReportOutstandingGroupwise()
		} else if (searchType === "F" && fromDate) {
			handleFetchReportOutstandingFundwise()
		} else if (searchType === "C" && fromDate) {
			handleFetchReportOutstandingCOwise()
		} else if (searchType === "B" && fromDate) {
			handleFetchReportOutstandingBranchwise()
		}
	}

	// Reset states when searchType changes
	useEffect(() => {
		setReportData([])
		setSelectedOptions([])
		setSelectedCOs([])
		setMetadataDtls(null)
		if (searchType === "F") {
			getFunds()
		}
		if (searchType === "C") {
			getCOs()
		}
	}, [searchType])

	useEffect(() => {
		setSelectedCOs([])
		if (searchType === "C") {
			getCOs()
		}
	}, [selectedOptions])

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
		}
	}

	const exportToExcel = (data) => {
		const wb = XLSX.utils.book_new()
		const ws = XLSX.utils.json_to_sheet(data)
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
		const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" })
		const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" })
		saveAs(
			blob,
			`Outstanding_Report_${fetchSearchTypeName(searchType)}_${
				userDetails?.branch_name
			}_${fetchedReportDate}.xlsx`
		)
	}

	const s2ab = (s) => {
		const buf = new ArrayBuffer(s.length)
		const view = new Uint8Array(buf)
		for (let i = 0; i < s.length; i++) {
			view[i] = s.charCodeAt(i) & 0xff
		}
		return buf
	}

	const dropdownOptions = branches?.map((branch) => ({
		value: branch.branch_assign_id,
		label: `${branch.branch_name} - ${branch.branch_assign_id}`,
	}))

	const displayedOptions =
		selectedOptions.length === dropdownOptions.length
			? [{ value: "all", label: "All" }]
			: selectedOptions

	const handleMultiSelectChange = (selected) => {
		if (selected.some((option) => option.value === "all")) {
			setSelectedOptions(dropdownOptions)
		} else {
			setSelectedOptions(selected)
		}
	}

	const dropdownCOs = cos?.map((branch) => ({
		value: branch.co_id,
		label: `${branch.emp_name} - ${branch.co_id}`,
	}))

	const displayedCOs =
		selectedCOs.length === dropdownCOs.length
			? [{ value: "all", label: "All" }]
			: selectedCOs

	const handleMultiSelectChangeCOs = (selected) => {
		if (selected.some((option) => option.value === "all")) {
			// If "All" is selected, select all options
			setSelectedCOs(dropdownCOs)
		} else {
			setSelectedCOs(selected)
		}
	}

	console.log("selectedOptions", selectedOptions)
	console.log("selectedCOs", selectedCOs)

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
					<div className="flex flex-row gap-3 mt-20 py-3 rounded-xl">
						<div className="text-3xl text-slate-700 font-bold">
							Outstanding Report
						</div>
					</div>

					<div className="text-slate-800 italic">
						Branch:{" "}
						{(userDetails?.id === 3 ||
							userDetails?.id === 4 ||
							userDetails?.id === 11) &&
						userDetails?.brn_code == 100
							? displayedOptions?.map((item, _) => `${item?.label}, `)
							: userDetails?.branch_name}{" "}
						as on {fetchedReportDate}
					</div>

					{/* <div className="flex justify-between gap-3 items-center align-middle">
						<div>
							<Radiobtn
								data={options}
								val={searchType}
								onChangeVal={(value) => onChange(value)}
							/>
						</div>
					</div> */}
					{(userDetails?.id === 3 ||
						userDetails?.id === 4 ||
						userDetails?.id === 11) &&
						userDetails?.brn_code == 100 && (
							<div className="w-full">
								<Select
									options={[{ value: "all", label: "All" }, ...dropdownOptions]}
									isMulti
									value={displayedOptions}
									onChange={handleMultiSelectChange}
									placeholder="Select branches..."
									className="basic-multi-select"
									classNamePrefix="select"
									styles={{
										control: (provided) => ({
											...provided,
											borderRadius: "8px",
										}),
										valueContainer: (provided) => ({
											...provided,
											borderRadius: "8px",
										}),
										singleValue: (provided) => ({
											...provided,
											color: "black",
										}),
										multiValue: (provided) => ({
											...provided,
											padding: "0.1rem",
											backgroundColor: "#da4167",
											color: "white",
											borderRadius: "8px",
										}),
										multiValueLabel: (provided) => ({
											...provided,
											color: "white",
										}),
										multiValueRemove: (provided) => ({
											...provided,
											color: "white",
											"&:hover": {
												backgroundColor: "red",
												color: "white",
												borderRadius: "8px",
											},
										}),
										placeholder: (provided) => ({
											...provided,
											fontSize: "0.9rem",
										}),
									}}
								/>
							</div>
						)}

					<div className="grid grid-cols-2 gap-5 mt-5 items-end">
						{searchType === "F" && (
							<div>
								<TDInputTemplateBr
									placeholder="Select Fund..."
									type="text"
									label="Fundwise"
									name="fund_id"
									handleChange={handleFundChange}
									data={funds.map((dat) => ({
										code: dat.fund_id,
										name: `${dat.fund_name}`,
									}))}
									mode={2}
									disabled={false}
								/>
							</div>
						)}

						{searchType === "C" &&
						(userDetails?.id === 3 ||
							userDetails?.id === 4 ||
							userDetails?.id === 11) &&
						userDetails?.brn_code == 100 ? (
							// <div>
							// 	<TDInputTemplateBr
							// 		placeholder="Select CO..."
							// 		type="text"
							// 		label="CO-wise"
							// 		name="co_id"
							// 		handleChange={handleCOChange}
							// 		data={cos.map((dat) => ({
							// 			code: dat.co_id,
							// 			name: `${dat.emp_name}`,
							// 		}))}
							// 		mode={2}
							// 		disabled={false}
							// 	/>
							// </div>
							<div className="col-span-3 w-auto">
								<Select
									options={[{ value: "all", label: "All" }, ...dropdownCOs]}
									isMulti
									value={displayedCOs}
									onChange={handleMultiSelectChangeCOs}
									placeholder="Select COs'..."
									className="basic-multi-select"
									classNamePrefix="select"
									styles={{
										control: (provided) => ({
											...provided,
											borderRadius: "8px",
										}),
										valueContainer: (provided) => ({
											...provided,
											borderRadius: "8px",
										}),
										singleValue: (provided) => ({
											...provided,
											color: "black",
										}),
										multiValue: (provided) => ({
											...provided,
											padding: "0.1rem",
											backgroundColor: "#da4167",
											color: "white",
											borderRadius: "8px",
										}),
										multiValueLabel: (provided) => ({
											...provided,
											color: "white",
										}),
										multiValueRemove: (provided) => ({
											...provided,
											color: "white",
											"&:hover": {
												backgroundColor: "red",
												color: "white",
												borderRadius: "8px",
											},
										}),
										placeholder: (provided) => ({
											...provided,
											fontSize: "0.9rem",
										}),
									}}
								/>
							</div>
						) : (
							searchType === "C" && (
								<div>
									<TDInputTemplateBr
										placeholder="Select CO..."
										type="text"
										label="CO-wise"
										name="co_id"
										handleChange={handleCOChange}
										data={cos.map((dat) => ({
											code: dat.co_id,
											name: `${dat.emp_name}`,
										}))}
										mode={2}
										disabled={false}
									/>
								</div>
							)
						)}

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
								className="inline-flex items-center px-4 py-2 text-sm font-small text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full"
								onClick={runProcedureReport}
							>
								<RefreshOutlined /> <span className="ml-2">Process Report</span>
							</button>
						</div>
					</div>

					<div className="flex gap-6 items-center align-middle">
						<div>
							<Radiobtn
								data={options}
								val={searchType}
								onChangeVal={(value) => onChange(value)}
							/>
						</div>
						<div className="mt-3">
							<button
								className="inline-flex items-center px-4 py-2 text-sm font-small text-white border hover:border-pink-600 border-pink-500 bg-pink-500 transition ease-in-out hover:bg-pink-700 duration-300 rounded-full"
								onClick={handleSubmit}
							>
								<Search /> <span className="ml-2">Fetch</span>
							</button>
						</div>
					</div>

					{/* Memberwise Results */}
					{searchType === "M" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[35, 36, 37]}
								dateTimeExceptionCols={[8]}
							/>
						</>
					)}

					{/* Groupwise Results with Pagination */}
					{searchType === "G" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[10, 11, 12]}
								headersMap={groupwiseOutstandingHeader}
							/>
						</>
					)}

					{/* Fundwise Results with Pagination */}
					{searchType === "F" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[7, 8, 9]}
								headersMap={fundwiseOutstandingHeader}
							/>
						</>
					)}

					{/* COwise Results with Pagination */}
					{searchType === "C" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[6, 7, 8]}
								headersMap={cowiseOutstandingHeader}
							/>
						</>
					)}

					{/* Branchwise Results with Pagination */}
					{searchType === "B" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[2, 3, 4, 5]}
								headersMap={branchwiseOutstandingHeader}
							/>
						</>
					)}

					{reportData.length !== 0 && (
						<div className="flex gap-4">
							<Tooltip title="Export to Excel">
								<button
									onClick={() => exportToExcel(reportData)}
									className="mt-5 justify-center items-center rounded-full text-green-900 disabled:text-green-300"
								>
									<FileExcelOutlined style={{ fontSize: 30 }} />
								</button>
							</Tooltip>
							<Tooltip title="Print">
								<button
									onClick={() =>
										printTableOutstandingReport(
											reportData,
											"Outstanding Report",
											searchType,
											(userDetails?.id === 3 ||
												userDetails?.id === 4 ||
												userDetails?.id === 11) &&
												userDetails?.brn_code == 100
												? selectedOptions?.map((item, _) => `${item?.label}, `)
												: userDetails?.branch_name,
											fromDate,
											toDate
										)
									}
									className="mt-5 justify-center items-center rounded-full text-pink-600 disabled:text-pink-300"
								>
									<PrinterOutlined style={{ fontSize: 30 }} />
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

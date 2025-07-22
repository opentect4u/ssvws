import { useCallback, useEffect, useState } from "react"
import Sidebar from "../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../Address/BaseUrl"
import { Spin, Tooltip } from "antd"
import {
	LoadingOutlined,
	PrinterOutlined,
	FileExcelOutlined,
} from "@ant-design/icons"
import { RefreshOutlined, Search } from "@mui/icons-material"
import Radiobtn from "../../../Components/Radiobtn"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import {
	portfolioReportHeaderBranchwise,
	portfolioReportHeaderCOwise,
	portfolioReportHeaderFundwise,
	portfolioReportHeaderGroupwise,
	portfolioReportHeaderMemberwise,
} from "../../../Utils/Reports/headerMap"
import Select from "react-select"
import { exportToExcel } from "../../../Utils/exportToExcel"
import { printTableReport } from "../../../Utils/printTableReport"
import { useCtrlP } from "../../../Hooks/useCtrlP"

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

function PortfolioReport() {
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
	const [procedureSuccessFlag, setProcedureSuccessFlag] = useState("0")

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setSearchType(e)
	}

	useEffect(() => {
			console.log(reportData, ' reportData');
	},[reportData])

	const handleFetchReportPortfolioMemberwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? userDetails?.brn_code : branchCodes,
			// supply_date: formatDateToYYYYMMDD(fromDate),
		}

		await axios
			.post(`${url}/memberwise_portfolio_report`, creds)
			.then((res) => {
				const data = res?.data?.msg?.msg || []
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

	const handleFetchReportPortfolioBranchwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			// supply_date: formatDateToYYYYMMDD(fromDate),
		}

		await axios
			.post(`${url}/branchwise_portfolio_report`, creds)
			.then((res) => {
				const data = res?.data?.msg?.msg || []
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

	const handleFetchReportPortfolioGroupwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		console.log("BRNADHIKUDUSTYSTUDGF", branchCodes)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? [Number(userDetails?.brn_code)] : branchCodes,
			// supply_date: formatDateToYYYYMMDD(fromDate),
		}

		await axios
			.post(`${url}/groupwise_portfolio_report`, creds)
			.then((res) => {
				const data = res?.data?.suc == 0 ? [] : (res?.data?.msg?.msg || [])
				if (data.length === 0) {
					console.log(
						"--------------- LOOP BREAKS ---------------",
						data?.length
					)
				}

				console.log("---------- DATA GROUPWISE -----------", res?.data)
				// setFetchedReportDate(
				// 	new Date(res?.data?.balance_date).toLocaleDateString("en-GB")
				// )
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

	const handleFetchReportPortfolioFundwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const selectedFunds = funds?.map((item, i) => item?.fund_id)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			fund_id: selectedFund === "F" ? selectedFunds : [selectedFund],
		}

		await axios
			.post(`${url}/fundwise_portfolio_report`, creds)
			.then((res) => {
				const data = res?.data?.msg?.msg || []
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

	const handleFetchReportPortfolioCOwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const coCodes = selectedCOs?.map((item, i) => item?.value)
		const allCos = cos?.map((item, i) => item?.co_id)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			co_id:
				coCodes?.length === 0
					? selectedCO === "AC"
						? allCos
						: [selectedCO]
					: coCodes,
		}

		await axios
			.post(`${url}/cowise_portfolio_report`, creds)
			.then((res) => {
				const data = res?.data?.msg?.msg || []
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

		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			to_dt: formatDateToYYYYMMDD(toDate),
			branches:
				branchCodes?.length === 0
					? [{ branch_code: userDetails?.brn_code }]
					: branchCodes,
		}

		await axios
			.post(`${url}/call_proc_portfolio`, creds)
			.then((res) => {
				console.log("Procedure called", res?.data)
				setProcedureSuccessFlag(res?.data?.suc)
			})
			.catch((err) => {
				console.log("Some error while running procedure.", err)
			})

		setLoading(false)
	}

	const handleSubmit = () => {
		if (searchType === "M" && fromDate) {
			handleFetchReportPortfolioMemberwise()
		} else if (searchType === "G" && fromDate) {
			handleFetchReportPortfolioGroupwise()
		} else if (searchType === "F" && fromDate) {
			handleFetchReportPortfolioFundwise()
		} else if (searchType === "C" && fromDate) {
			handleFetchReportPortfolioCOwise()
		} else if (searchType === "B" && fromDate) {
			handleFetchReportPortfolioBranchwise()
		}
	}

	// Reset states when searchType changes
	useEffect(() => {
		setReportData([])
		// setSelectedOptions([])
		// setSelectedCOs([])
		setMetadataDtls(null)
		// setProcedureSuccessFlag("0")
		if (searchType === "F") {
			getFunds()
		}
		if (searchType === "C") {
			getCOs()
		}
	}, [searchType])

	useEffect(() => {
		// setSelectedCOs([])
		// setProcedureSuccessFlag("0")
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

	const dataToExport = reportData

	const headersToExport =
		searchType === "G"
			? portfolioReportHeaderGroupwise
			: searchType === "F"
			? portfolioReportHeaderFundwise
			: searchType === "C"
			? portfolioReportHeaderCOwise
			: searchType === "M"
			? portfolioReportHeaderMemberwise
			: portfolioReportHeaderBranchwise

	const fileName = `Portfolio_Report_${fetchSearchTypeName(
		searchType
	)}_${new Date().toLocaleString("en-GB")}.xlsx`

	const dropdownOptions = branches?.map((branch) => ({
		value: branch.branch_assign_id,
		label: `${branch.branch_name} - ${branch.branch_assign_id}`,
	}))

	const displayedOptions = selectedOptions

	const handleMultiSelectChange = (selected) => {
		if (selected && selected.length > 4) {
			return
		}
		setSelectedOptions(selected)
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

	const handlePrint = useCallback(() => {
		printTableReport(
			dataToExport,
			headersToExport,
			fileName?.split(",")[0],
			[29, 31]
		)
	}, [dataToExport, headersToExport, fileName, printTableReport])

	useCtrlP(handlePrint)

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
							Portfolio Report
						</div>
					</div>

					<div className="text-slate-800 italic">
						Branch:{" "}
						{(userDetails?.id === 3 ||
							userDetails?.id === 4 ||
							userDetails?.id === 11) &&
						userDetails?.brn_code == 100
							? displayedOptions?.map((item, _) => `${item?.label}, `)
							: userDetails?.branch_name}
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
									options={dropdownOptions}
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

					<div className="grid grid-cols-3 gap-5 mt-4">
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
						<div className="mt-6">
							<button
								className="inline-flex items-center px-4 py-2 text-sm font-small text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full disabled:cursor-not-allowed"
								onClick={runProcedureReport}
								// disabled={selectedOptions?.length == 0}
							>
								<RefreshOutlined /> <span className="ml-2">Process Report</span>
							</button>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-5 mt-5 items-end">
						{searchType === "F" && +procedureSuccessFlag === 1 && (
							<div>
								<TDInputTemplateBr
									placeholder="Select Fund..."
									type="text"
									label="Fundwise"
									name="fund_id"
									handleChange={handleFundChange}
									data={[
										{ code: "F", name: "All funds" },
										...funds.map((dat) => ({
											code: dat.fund_id,
											name: `${dat.fund_name}`,
										})),
									]}
									mode={2}
									disabled={false}
								/>
							</div>
						)}

						{searchType === "C" &&
						+procedureSuccessFlag === 1 &&
						(userDetails?.id === 3 ||
							userDetails?.id === 4 ||
							userDetails?.id === 11) &&
						userDetails?.brn_code == 100 ? (
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
							searchType === "C" &&
							+procedureSuccessFlag === 1 && (
								<div>
									<TDInputTemplateBr
										placeholder="Select CO..."
										type="text"
										label="CO-wise"
										name="co_id"
										handleChange={handleCOChange}
										data={[
											{ code: "AC", name: "All COs" },
											...cos.map((dat) => ({
												code: dat.co_id,
												name: `${dat.emp_name}`,
											})),
										]}
										mode={2}
										disabled={false}
									/>
								</div>
							)
						)}
					</div>

					<div className="flex gap-6 items-center align-middle">
						{+procedureSuccessFlag === 1 && (
							<>
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
							</>
						)}
					</div>	
					{searchType === "M" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[31, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]}
								dateTimeExceptionCols={[0, 1, 13, 24, 26, 46, 47, 48, 49]}
								headersMap={portfolioReportHeaderMemberwise}
							/>
						</>
					)}

					{searchType === "G" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[
									14, 15, 17, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
								]}
								dateTimeExceptionCols={[0, 1, 10, 12, 32, 33, 34, 35]}
								headersMap={portfolioReportHeaderGroupwise}
							/>
						</>
					)}

					{searchType === "F" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[11, 15, 16, 17, 18, 19, 20, 21, 22]}
								dateTimeExceptionCols={[0, 1, 6, 8, 23, 24, 25, 26]}
								headersMap={portfolioReportHeaderFundwise}
							/>
						</>
					)}

					{searchType === "C" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[11, 14, 15, 16, 17, 18, 19, 20, 21]}
								dateTimeExceptionCols={[0, 1, 6, 8, 22, 23, 24, 25]}
								headersMap={portfolioReportHeaderCOwise}
							/>
						</>
					)}

					{/* Branchwise Results with Pagination */}
					{searchType === "B" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								dateTimeExceptionCols={[0, 1]}
								headersMap={portfolioReportHeaderBranchwise}
							/>
						</>
					)}

					{reportData.length !== 0 && (
						<div className="flex gap-4">
							<Tooltip title="Export to Excel">
								<button
									onClick={() =>
										exportToExcel(
											dataToExport,
											headersToExport,
											fileName,
											[29, 31]
										)
									}
									className="mt-5 justify-center items-center rounded-full text-green-900 disabled:text-green-300"
								>
									<FileExcelOutlined style={{ fontSize: 30 }} />
								</button>
							</Tooltip>
							<Tooltip title="Print">
								<button
									onClick={() =>
										// printTableOutstandingReport(
										// 	reportData,
										// 	"Outstanding Report",
										// 	searchType,
										// 	(userDetails?.id === 3 ||
										// 		userDetails?.id === 4 ||
										// 		userDetails?.id === 11) &&
										// 		userDetails?.brn_code == 100
										// 		? selectedOptions?.map((item, _) => `${item?.label}, `)
										// 		: userDetails?.branch_name,
										// 	fromDate,
										// 	toDate
										// )
										printTableReport(
											dataToExport,
											headersToExport,
											fileName?.split(",")[0],
											[29, 31]
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

export default PortfolioReport

import { useEffect, useState } from "react"
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
import Radiobtn from "../../../Components/Radiobtn"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"
// import { saveAs } from "file-saver"
// import * as XLSX from "xlsx"
// import { printTableLoanTransactions } from "../../../Utils/printTableLoanTransactions"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import {
	// branchwiseTxnReportHeader,
	// memberwiseOutstandingHeader,
	overdueBranchReportHeader,
	overdueCOReportHeader,
	overdueFundReportHeader,
	overdueGroupReportHeader,
	overdueMemberReportHeader,
	// overduereport,
	// overduereportheader,
} from "../../../Utils/Reports/headerMap"
import Select from "react-select"
import { exportToExcel } from "../../../Utils/exportToExcel"
import { printTableReport } from "../../../Utils/printTableReport"

const options = [
	{
		label: "Disbursement",
		value: "D",
	},
	{
		label: "Recovery",
		value: "R",
	},
]

const options2 = [
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

const options3 = [
	{
		label: "Monthly",
		value: "Monthly",
	},
	{
		label: "Weekly",
		value: "Weekly",
	},
]

function OverdueReport() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	const [searchType, setSearchType] = useState(() => "D")
	const [searchType2, setSearchType2] = useState(() => "G")
	const [searchType3, setSearchType3] = useState(() => "Monthly")

	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [reportData, setReportData] = useState(() => [])

	const [funds, setFunds] = useState([])
	const [selectedFund, setSelectedFund] = useState("")
	const [cos, setCOs] = useState([])
	const [selectedCO, setSelectedCO] = useState("")
	const [branches, setBranches] = useState([])
	const [selectedOptions, setSelectedOptions] = useState([])
	const [selectedCOs, setSelectedCOs] = useState([])
	const [metadataDtls, setMetadataDtls] = useState(() =>
		(userDetails?.id === 3 ||
			userDetails?.id === 4 ||
			userDetails?.id === 11) &&
		userDetails?.brn_code == 100
			? selectedOptions?.map((item, _) => `${item?.label}, `)
			: userDetails?.branch_name
	)

	const [fromDay, setFromDay] = useState(() => "")
	const [toDay, setToDay] = useState(() => "")
	const [fromTouched, setFromTouched] = useState(false)
	const [toTouched, setToTouched] = useState(false)

	const maxDay = searchType3 === "Monthly" ? 31 : 7

	const isValidRange =
		fromDay !== "" &&
		toDay !== "" &&
		+fromDay >= 1 &&
		+toDay <= maxDay &&
		+fromDay <= +toDay

	const showError = (fromTouched || toTouched) && !isValidRange

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setSearchType(e)
	}

	const onChange2 = (e) => {
		console.log("radio1 checked", e)
		setSearchType2(e)
	}

	const onChange3 = (e) => {
		console.log("radio1 checked", e)
		setSearchType3(e)
		setFromDay("")
		setToDay("")
		setFromTouched(false)
		setToTouched(false)
	}

	const handleFetchTxnReportGroupwise = async () => {
		setLoading(true)

		// const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const branchCodes = selectedOptions?.map((item, i) => {
			return { branch_code: item.value }
		})

		// const creds = {
		// 	from_dt: formatDateToYYYYMMDD(fromDate),
		// 	to_dt: formatDateToYYYYMMDD(toDate),
		// 	branch_code:
		// 		branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
		// 	tr_type: searchType,
		// }
		const creds = {
			send_date: formatDateToYYYYMMDD(fromDate),
			search_brn_id:
				branchCodes?.length === 0
					? [{ branch_code: userDetails.brn_code }]
					: branchCodes,
		}

		await axios
			.post(`${url}/loan_overdue_report_groupwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
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

	const handleFetchTxnReportFundwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => {
			return { branch_code: item?.value }
		})
		const selectedFunds = funds?.map((item, i) => item?.fund_id)

		const creds = {
			send_date: formatDateToYYYYMMDD(fromDate),
			// to_dt: formatDateToYYYYMMDD(toDate),
			search_brn_id:
				branchCodes?.length === 0
					? [{ branch_code: userDetails?.brn_code }]
					: branchCodes,
			fund_id: selectedFund === "F" ? selectedFunds : [selectedFund],
			// tr_type: searchType,
		}

		await axios
			.post(`${url}/loan_overdue_report_fundwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
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

	const handleFetchTxnReportCOwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => {
			return { branch_code: item?.value }
		})
		const coCodes = selectedCOs?.map((item, i) => item?.value)
		const allCos = cos?.map((item, i) => item?.co_id)

		const creds = {
			send_date: formatDateToYYYYMMDD(fromDate),
			// to_dt: formatDateToYYYYMMDD(toDate),
			search_brn_id:
				branchCodes?.length === 0
					? [{ branch_code: userDetails?.brn_code }]
					: branchCodes,
			co_id:
				coCodes?.length === 0
					? selectedCO === "AC"
						? allCos
						: [selectedCO]
					: coCodes,
			// tr_type: searchType,
		}

		await axios
			.post(`${url}/loan_overdue_report_cowise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const handleFetchTxnReportBranchwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => {
			return { branch_code: item?.value }
		})

		const creds = {
			send_date: formatDateToYYYYMMDD(fromDate),
			// to_dt: formatDateToYYYYMMDD(toDate),
			search_brn_id:
				branchCodes?.length === 0
					? [{ branch_code: userDetails?.brn_code }]
					: branchCodes,
			// tr_type: searchType,
		}

		await axios
			.post(`${url}/loan_overdue_report_branchwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	const handleFetchTxnReportMemberwise = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => {
			return { branch_code: item?.value }
		})

		const creds = {
			// from_dt: formatDateToYYYYMMDD(fromDate),
			// to_dt: formatDateToYYYYMMDD(toDate),
			// branch_code:
			// 	branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			// tr_type: searchType,
			send_date: formatDateToYYYYMMDD(fromDate),
			// to_dt: formatDateToYYYYMMDD(toDate),
			search_brn_id:
				branchCodes?.length === 0
					? [{ branch_code: userDetails?.brn_code }]
					: branchCodes,
		}

		await axios
			.post(`${url}/loan_overdue_report_memberwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
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
			.post(`${url}/fetch_usertypeWise_branch_name`, creds)
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

	const handleFetchGroupwiseDayReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => {
			return { branch_code: item.value }
		})

		const creds = {
			// demand_date: fetchedReportDate,
			// send_year: choosenYear,
			// send_month: choosenMonth,
			send_date: formatDateToYYYYMMDD(fromDate),
			search_brn_id:
				branchCodes?.length === 0
					? [{ branch_code: userDetails.brn_code }]
					: branchCodes,
			period_mode: searchType3,
			from_day: fromDay,
			to_day: toDay,
		}
		await axios
			.post(`${url}/filter_daywise_overdue_report_groupwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	const handleFetchFundwiseDayReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => {
			return { branch_code: item.value }
		})
		const selectedFunds = funds?.map((item, i) => item?.fund_id)

		const creds = {
			// demand_date: fetchedReportDate,
			// send_year: choosenYear,
			// send_month: choosenMonth,
			send_date: formatDateToYYYYMMDD(fromDate),
			search_brn_id:
				branchCodes?.length === 0
					? [{ branch_code: userDetails.brn_code }]
					: branchCodes,
			period_mode: searchType3,
			from_day: fromDay,
			to_day: toDay,
			fund_id: selectedFund === "F" ? selectedFunds : [selectedFund],
		}
		await axios
			.post(`${url}/filter_daywise_overdue_report_fundwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	const handleFetchCOwiseDayReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => {
			return { branch_code: item.value }
		})
		const coCodes = selectedCOs?.map((item, i) => item?.value)
		const allCos = cos?.map((item, i) => item?.co_id)

		const creds = {
			// demand_date: fetchedReportDate,
			// send_year: choosenYear,
			// send_month: choosenMonth,
			send_date: formatDateToYYYYMMDD(fromDate),
			search_brn_id:
				branchCodes?.length === 0
					? [{ branch_code: userDetails.brn_code }]
					: branchCodes,
			period_mode: searchType3,
			from_day: fromDay,
			to_day: toDay,
			co_id:
				coCodes?.length === 0
					? selectedCO === "AC"
						? allCos
						: [selectedCO]
					: coCodes,
		}
		await axios
			.post(`${url}/filter_dayawise_overdue_report_cowise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	const handleFetchMemberwiseDayReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => {
			return { branch_code: item.value }
		})

		const creds = {
			// demand_date: fetchedReportDate,
			// send_year: choosenYear,
			// send_month: choosenMonth,
			send_date: formatDateToYYYYMMDD(fromDate),
			search_brn_id:
				branchCodes?.length === 0
					? [{ branch_code: userDetails.brn_code }]
					: branchCodes,
			period_mode: searchType3,
			from_day: fromDay,
			to_day: toDay,
		}
		await axios
			.post(`${url}/filter_dayawise_overdue_report_membwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	const handleSubmitDaywise = () => {
		if (searchType2 === "G") {
			handleFetchGroupwiseDayReport()
		} else if (searchType2 === "F") {
			handleFetchFundwiseDayReport()
		} else if (searchType2 === "C") {
			handleFetchCOwiseDayReport()
		} else if (searchType2 === "M") {
			handleFetchMemberwiseDayReport()
		}
	}

	useEffect(() => {
		getBranches()
	}, [])

	const searchData = async () => {
		if (searchType2 === "G" && fromDate) {
			await handleFetchTxnReportGroupwise()
		} else if (searchType2 === "F" && fromDate) {
			await handleFetchTxnReportFundwise()
		} else if (searchType2 === "C" && fromDate) {
			await handleFetchTxnReportCOwise()
		} else if (searchType2 === "M" && fromDate) {
			await handleFetchTxnReportMemberwise()
		} else if (searchType2 === "B" && fromDate) {
			await handleFetchTxnReportBranchwise()
		}
	}

	useEffect(() => {
		setReportData([])
		setSelectedOptions([])
		// setMetadataDtls(null)
		if (searchType2 === "F") {
			getFunds()
		}
		if (searchType2 === "C") {
			getCOs()
		}
	}, [searchType, searchType2])

	useEffect(() => {
		// setSelectedCOs([])
		if (searchType2 === "C") {
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
		} else if (searchType === "D") {
			return "Disbursement"
		} else if (searchType === "R") {
			return "Recovery"
		}
	}

	const dataToExport = reportData

	const headersToExport =
		searchType2 === "G"
			? overdueGroupReportHeader
			: searchType2 === "F"
			? overdueFundReportHeader
			: searchType2 === "C"
			? overdueCOReportHeader
			: searchType2 === "M"
			? overdueMemberReportHeader
			: overdueBranchReportHeader

	const fileName = `Overdue_Report_${fetchSearchTypeName(
		searchType2
	)}_${new Date().toLocaleString("en-GB")}.xlsx`

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
			setSelectedCOs(dropdownCOs)
		} else {
			setSelectedCOs(selected)
		}
	}

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
							Overdue Report
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
						from {fromDate}
					</div>

					<div className="mb-2 flex justify-start gap-5 items-center">
						<div>
							<Radiobtn
								data={options2}
								val={searchType2}
								onChangeVal={(value) => {
									onChange2(value)
								}}
							/>
						</div>
						{/* <div>
							<Radiobtn
								data={options}
								val={searchType}
								onChangeVal={(value) => {
									onChange(value)
								}}
							/>
						</div> */}
					</div>

					{(userDetails?.id === 3 ||
						userDetails?.id === 4 ||
						userDetails?.id === 11) &&
						userDetails?.brn_code == 100 && (
							<div className="w-[100%]">
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

					{searchType2 === "C" &&
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
						<div className="col-span-3 mx-auto w-[100%] pt-5">
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
						searchType2 === "C" && (
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

					<div className="grid grid-cols-2 gap-5 mt-5 items-end">
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

						{searchType2 === "F" && (
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

						<div>
							<button
								className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
								onClick={() => {
									searchData()
								}}
							>
								<SearchOutlined /> <span className={`ml-2`}>Search</span>
							</button>
						</div>
					</div>

					{reportData?.length > 0 && searchType2 !== "B" && (
						<div className="mt-4">
							<div className="text-xl -mb-4 text-slate-700 font-bold">
								Daywise
							</div>
							<div className="mb-2">
								<Radiobtn
									data={options3}
									val={searchType3}
									onChangeVal={(e) => onChange3(e)}
								/>
							</div>

							<div className="grid grid-cols-3 gap-5 mt-5 items-end">
								<div>
									<TDInputTemplateBr
										placeholder="From Day"
										type="number"
										label="From Day"
										name="from_day"
										formControlName={fromDay}
										handleChange={(e) => setFromDay(e.target.value)}
										handleBlur={() => setFromTouched(true)}
										mode={1}
										min={1}
										max={maxDay}
									/>
									{showError && (
										<p className="text-red-500 text-xs mt-1">
											From day must be lower than To day and within 1 to{" "}
											{maxDay}.
										</p>
									)}
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="To Day"
										type="number"
										label="To Day"
										name="to_day"
										formControlName={toDay}
										handleChange={(e) => setToDay(e.target.value)}
										handleBlur={() => setToTouched(true)}
										mode={1}
										min={1}
										max={maxDay}
									/>
									{showError && (
										<p className="text-red-500 text-xs mt-1">
											From day must be lower than To day and within 1 to{" "}
											{maxDay}.
										</p>
									)}
								</div>

								<div>
									<button
										className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
										onClick={() => {
											handleSubmitDaywise()
										}}
										disabled={!isValidRange}
									>
										<SearchOutlined /> <span className="ml-2">Find</span>
									</button>
								</div>
							</div>
						</div>
					)}

					{searchType2 === "M" && reportData?.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[23, 24, 25, 26]}
								dateTimeExceptionCols={[0, 1, 20, 22, 27]}
								headersMap={overdueMemberReportHeader}
								colRemove={[16]}
							/>
						</>
					)}

					{searchType2 === "G" && reportData?.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[16, 17, 18, 19]}
								dateTimeExceptionCols={[0, 1, 15]}
								headersMap={overdueGroupReportHeader}
								colRemove={[12]}
							/>
						</>
					)}

					{searchType2 === "F" && reportData?.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[15, 16, 17, 18]}
								dateTimeExceptionCols={[0, 1, 14]}
								headersMap={overdueFundReportHeader}
								colRemove={[6]}

								// headersMap={fundwiseOutstandingHeader}
							/>
						</>
					)}

					{searchType2 === "C" && reportData?.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[13, 14, 15, 16]}
								dateTimeExceptionCols={[0, 1, 12]}
								headersMap={overdueCOReportHeader}
								colRemove={[6]}
							/>
						</>
					)}

					{/* Branchwise Results with Pagination */}
					{searchType2 === "B" && reportData?.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[3, 4, 5, 6]}
								// dateTimeExceptionCols={[0,1,9,11]}
								headersMap={overdueBranchReportHeader}
								// colRemove={[6]}
							/>
						</>
					)}

					{/* ///////////////////////////////////////////////////////////////// */}

					{reportData?.length !== 0 && (
						<div className="flex gap-4">
							<Tooltip title="Export to Excel">
								<button
									onClick={() =>
										exportToExcel(
											dataToExport,
											headersToExport,
											fileName,
											[0, 1, 9, 11, 14, 15, 20, 22, 27]
										)
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
									onClick={() =>
										// printTableLoanTransactions(
										// 	reportData,
										// 	"Loan Transaction",
										// 	searchType,
										// 	searchType2,
										// 	metadataDtls,
										// 	fromDate,
										// 	toDate
										// )
										printTableReport(
											dataToExport,
											headersToExport,
											fileName?.split(",")[0],
											[0, 1, 9, 11, 14, 15, 20, 22, 27]
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
export default OverdueReport

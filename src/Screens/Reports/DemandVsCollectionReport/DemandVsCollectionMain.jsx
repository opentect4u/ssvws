import React, { useEffect, useState } from "react"
import Sidebar from "../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../Address/BaseUrl"
import { Message } from "../../../Components/Message"
import { Spin, Button, Modal, Tooltip, DatePicker } from "antd"
import dayjs from "dayjs"
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
import { printTableRegular } from "../../../Utils/printTableRegular"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import Select from "react-select"
import {
	branchwiseDemandReportHeader,
	branchwiseDemandVsCollectionHeader,
	cowiseDemandReportHeader,
	cowiseDemandVsCollectionHeader,
	fundwiseDemandReportHeader,
	fundwiseDemandVsCollectionHeader,
	groupwiseDemandReportHeader,
	groupwiseDemandVsCollectionHeader,
	memberwiseDemandReportHeader,
	memberwiseDemandVsCollectionHeader,
} from "../../../Utils/Reports/headerMap"
import { exportToExcel } from "../../../Utils/exportToExcel"
import { printTableReport } from "../../../Utils/printTableReport"

// const { RangePicker } = DatePicker
// const dateFormat = "YYYY/MM/DD"

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

const options2 = [
	{
		label: "Monthly",
		value: "Monthly",
	},
	{
		label: "Weekly",
		value: "Weekly",
	},
]

function DemandVsCollectionMain() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [reportData, setReportData] = useState(() => [])
	const [searchType, setSearchType] = useState(() => "G")
	const [searchType2, setSearchType2] = useState(() => "Monthly")
	const [choosenMonth, setChoosenMonth] = useState(() => "")
	const [choosenYear, setChoosenYear] = useState(() => "")
	const [funds, setFunds] = useState([])
	const [selectedFund, setSelectedFund] = useState("")
	const [co, setCo] = useState(() => "")

	const [cos, setCos] = useState([])
	const [branches, setBranches] = useState([])
	const [selectedCO, setSelectedCO] = useState("")
	const [selectedOptions, setSelectedOptions] = useState([])
	const [selectedCOs, setSelectedCOs] = useState([])
	const [procedureSuccessFlag, setProcedureSuccessFlag] = useState("0")

	// const [reportTxnData, setReportTxnData] = useState(() => [])
	// const [tot_sum, setTotSum] = useState(0)
	// const [search, setSearch] = useState("")
	const [fetchedReportDate, setFetchedReportDate] = useState(() => "")

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

	const maxDay = searchType2 === "Monthly" ? 31 : 7

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
		setFromDay("")
		setToDay("")
		setFromTouched(false)
		setToTouched(false)
	}

	// const handleFetchCO = async () => {
	// 	setLoading(true)
	// 	const creds = {
	// 		branch_code: userDetails?.brn_code,
	// 	}

	// 	await axios
	// 		.post(`${url}/fetch_branch_co`, creds)
	// 		.then((res) => {
	// 			console.log("++++++++++++++", res?.data?.msg)
	// 			setCos(res?.data?.msg)
	// 		})
	// 		.catch((err) => {
	// 			console.log("Some err while fetching Cos...")
	// 		})
	// 	setLoading(false)
	// }

	// useEffect(() => {
	// 	setReportData([])
	// 	if (searchType === "C") {
	// 		handleFetchCO()
	// 	}
	// }, [searchType])
	const runProcedureReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => ({
			branch_code: item?.value,
		}))

		const creds = {
			send_month: choosenMonth,
			send_year: choosenYear,
			branches:
				branchCodes?.length === 0
					? [{ branch_code: userDetails?.brn_code }]
					: branchCodes,
		}

		await axios
			.post(`${url}/call_demand_proc`, creds)
			.then((res) => {
				console.log("Procedure called", res?.data)
				setProcedureSuccessFlag(res?.data?.suc)
			})
			.catch((err) => {
				console.log("Some error while running procedure.", err)
			})

		setLoading(false)
	}
	// "Memberwise"
	const handleFetchMemberwiseReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			send_month: choosenMonth,
			send_year: choosenYear,
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
		}

		await axios
			.post(`${url}/dmd_vs_collec_report_memberwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.member_demand_collec_data?.msg)
				// setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
				setMetadataDtls(`${userDetails?.brn_code}, Memberwise`)
				setFetchedReportDate(res?.data?.dateRange)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	// "Groupwise"
	const handleFetchGroupwiseReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			send_month: choosenMonth,
			send_year: choosenYear,
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
		}

		await axios
			.post(`${url}/dmd_vs_collec_report_groupwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.groupwise_demand_collec_data?.msg)
				// setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
				setMetadataDtls(`${userDetails?.brn_code}, Groupwise`)
				setFetchedReportDate(res?.data?.dateRange)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})

		setLoading(false)
	}

	// "Branchwise"
	const handleFetchBranchwiseReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			send_month: choosenMonth,
			send_year: choosenYear,
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
		}

		await axios
			.post(`${url}/dmd_vs_collec_report_branchwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.branch_demand_collec_data?.msg)
				// setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
				setMetadataDtls(`${userDetails?.brn_code}, Groupwise`)
				setFetchedReportDate(res?.data?.dateRange)
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

	// "Fundwise"
	const handleFetchFundwiseReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const selectedFunds = funds?.map((item, i) => item?.fund_id)

		const creds = {
			send_month: choosenMonth,
			send_year: choosenYear,
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			fund_id: selectedFund === "F" ? selectedFunds : [selectedFund],
		}
		console.log(creds)
		await axios
			.post(`${url}/dmd_vs_collec_report_fundwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.fund_demand_collec_data?.msg)
				// setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
				setMetadataDtls(`${userDetails?.brn_code}, Groupwise`)
				setFetchedReportDate(res?.data?.dateRange)
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
			.post(`${url}/fetch_brn_co_demand`, creds)
			.then((res) => {
				console.log("COs ======>", res?.data)
				setCos(res?.data?.msg)
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

	// "COwise"
	const handleFetchCOwiseReport = async () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const coCodes = selectedCOs?.map((item, i) => item?.value)
		const allCos = cos?.map((item, i) => item?.co_id)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			send_month: choosenMonth,
			send_year: choosenYear,
			co_id:
				coCodes?.length === 0
					? selectedCO === "AC"
						? allCos
						: [selectedCO]
					: coCodes,
		}

		await axios
			.post(`${url}/dmd_vs_collec_report_cowise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.co_demand_collec_data?.msg)
				// setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
				setMetadataDtls(`${userDetails?.brn_code}, COwise`)
				setFetchedReportDate(res?.data?.dateRange)
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

	const handleFetchGroupwiseDayReport = async () => {
		setLoading(true)
		const creds = {
			// demand_date: fetchedReportDate,
			send_year: choosenYear,
			send_month: choosenMonth,
			period_mode: searchType2,
			from_day: fromDay,
			to_day: toDay,
			branch_code: userDetails?.brn_code,
		}
		await axios
			.post(`${url}/filter_dayawise_coll_report_groupwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.groupwise_demand_collec_data_day?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	const handleFetchFundwiseDayReport = async () => {
		setLoading(true)
		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const selectedFunds = funds?.map((item, i) => item?.fund_id)
		const creds = {
			// demand_date: fetchedReportDate,
			send_year: choosenYear,
			send_month: choosenMonth,
			period_mode: searchType2,
			from_day: fromDay,
			to_day: toDay,
			branch_code:branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			fund_id: selectedFund === "F" ? selectedFunds : [selectedFund],
		}
		await axios
			.post(`${url}/filter_dayawise_coll_report_fundwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.fund_demand_collec_data_day?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	const handleFetchCOwiseDayReport = async () => {
		setLoading(true)
		
		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const coCodes = selectedCOs?.map((item, i) => item?.value)
		const allCos = cos?.map((item, i) => item?.co_id)

		const creds = {
			// demand_date: fetchedReportDate,
			send_year: choosenYear,
			send_month: choosenMonth,
			period_mode: searchType2,
			from_day: fromDay,
			to_day: toDay,
			co_id:coCodes?.length === 0
					? selectedCO === "AC"
						? allCos
						: [selectedCO]
					: coCodes,
			branch_code:branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
		}
		await axios
			.post(`${url}/filter_dayawise_coll_report_cowise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.co_demand_collec_data_day?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	const handleFetchMemberwiseDayReport = async () => {
		setLoading(true)
		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const creds = {
			// demand_date: fetchedReportDate,
			send_year: choosenYear,
			send_month: choosenMonth,
			period_mode: searchType2,
			from_day: fromDay,
			to_day: toDay,
			// branch_code: branchCodes
			branch_code:branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
		}
		await axios
			.post(`${url}/filter_dayawise_coll_report_membwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.member_demand_collec_data_day?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	const handleSubmitDaywise = () => {
		if (searchType === "G") {
			handleFetchGroupwiseDayReport()
		} else if (searchType === "F") {
			handleFetchFundwiseDayReport()
		} else if (searchType === "C") {
			handleFetchCOwiseDayReport()
		} else if (searchType === "M") {
			handleFetchMemberwiseDayReport()
		}
	}

	useEffect(() => {
		getBranches()
	}, [])

	useEffect(() => {
		setFetchedReportDate("")
		setReportData([])
		// setSelectedOptions([])
		setSelectedCOs([])
		if (searchType === "F") {
			getFunds()
		}
		if (searchType === "C") {
			getCOs()
		}
	}, [searchType])

	useEffect(() => {
		setFetchedReportDate("")
		setReportData([])
		if (searchType === "C") {
			getCOs()
		}
	}, [selectedOptions])

	const handleSubmit = () => {
		if (!searchType || !choosenMonth || !choosenYear) {
			Message("warning", "Please fill all details")
			return
		}

		if (searchType === "M" && choosenMonth && choosenYear) {
			handleFetchMemberwiseReport()
		}

		if (searchType === "B" && choosenMonth && choosenYear) {
			handleFetchBranchwiseReport()
		}

		if (searchType === "G" && choosenMonth && choosenYear) {
			handleFetchGroupwiseReport()
		}

		if (searchType === "F" && choosenMonth && choosenYear && selectedFund) {
			handleFetchFundwiseReport()
		}

		if (searchType === "C" && choosenMonth && choosenYear) {
			handleFetchCOwiseReport()
		}
	}

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
			? groupwiseDemandVsCollectionHeader
			: searchType === "M"
			? memberwiseDemandVsCollectionHeader
			: searchType === "F"
			? fundwiseDemandVsCollectionHeader
			: searchType === "C"
			? cowiseDemandVsCollectionHeader
			: branchwiseDemandVsCollectionHeader

	const fileName = `Demand_Vs_Collection_${fetchSearchTypeName(
		searchType
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
		console.log(selected, displayedOptions)
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
		selectedCOs.length === dropdownCOs.length && selectedCOs.length !== 0
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

	const months = Array.from({ length: 12 }, (_, i) => ({
		code: i + 1,
		name: new Date(0, i).toLocaleString("en", { month: "long" }),
	}))

	const years = Array.from({ length: 61 }, (_, i) => ({
		code: 2025 + i,
		name: (2025 + i).toString(),
	}))

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
							DEMAND VS COLLECTION REPORT
						</div>
					</div>

					{/* <div className="text-slate-800 italic">
						Branch:{" "}
						{(userDetails?.id === 3 ||
							userDetails?.id === 4 ||
							userDetails?.id === 11) &&
						userDetails?.brn_code == 100
							? selectedOptions?.map((item, _) => `${item?.label}, `)
							: userDetails?.branch_name}{" "}
						as on {fetchedReportDate}
					</div> */}

					{/* <div className="mb-2">
						<Radiobtn
							data={options}
							val={searchType}
							onChangeVal={(value) => {
								onChange(value)
							}}
						/>
					</div> */}

					<div>
						{(userDetails?.id === 3 ||
							userDetails?.id === 4 ||
							userDetails?.id === 11) &&
							userDetails?.brn_code == 100 && (
								<div className="w-full">
									<Select
										options={[
											{ value: "all", label: "All" },
											...dropdownOptions,
										]}
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

						{/* {searchType === "F" && (
							<div className="pt-4">
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
						)} */}
					</div>

					{searchType === "C" && (
						<div className="mb-2 w-full flex justify-center gap-5">
							{/* <div className="w-full">
								<TDInputTemplateBr
									placeholder="Choose CO..."
									type="text"
									label="Credit Officers"
									name="co"
									formControlName={co.split(",")[0]}
									handleChange={(e) => {
										console.log("***********========", e)
										setCo(
											e.target.value +
												"," +
												cos.filter((i) => i.emp_id == e.target.value)[0]
													?.emp_name
										)
									}}
									mode={2}
									data={cos?.map((item, i) => ({
										code: item?.emp_id,
										name: `${item?.emp_name} - (${item?.emp_id})`,
									}))}
								/>
							</div> */}
						</div>
					)}

					<div className="mb-2 flex justify-start gap-5 items-center">
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

					<div className="grid grid-cols-2 gap-5 mt-5 items-end">
						<div>
							{/* <TDInputTemplateBr
								placeholder="From Date"
								type="date"
								label="From Date"
								name="fromDate"
								formControlName={fromDate}
								handleChange={(e) => setFromDate(e.target.value)}
								min={"1900-12-31"}
								mode={1}
							/> */}
							<TDInputTemplateBr
								placeholder="Month"
								type="text"
								label="Month"
								name="month"
								formControlName={choosenMonth}
								handleChange={(e) => setChoosenMonth(e.target.value)}
								mode={2}
								data={months}
							/>
						</div>
						<div>
							{/* <TDInputTemplateBr
								placeholder="To Date"
								type="date"
								label="To Date"
								name="toDate"
								formControlName={toDate}
								handleChange={(e) => setToDate(e.target.value)}
								min={"1900-12-31"}
								mode={1}
							/> */}
							<TDInputTemplateBr
								placeholder="Year"
								type="text"
								label="Year"
								name="year"
								formControlName={choosenYear}
								handleChange={(e) => setChoosenYear(e.target.value)}
								mode={2}
								data={years}
							/>
						</div>
					</div>
					<div className="flex justify-center my-3">
						<button
							className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full dark:focus:ring-primary-900`}
							onClick={() => {
								// handleSubmit()
								runProcedureReport()
							}}
						>
							<SearchOutlined /> <span className={`ml-2`}>Process Report</span>
						</button>
					</div>
					{searchType === "F" && (
						<div className="pt-4">
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
					{/* {searchType === "C" && (
						<div className="w-full">
							<TDInputTemplateBr
								placeholder="Choose CO..."
								type="text"
								label="Credit Officers"
								name="co"
								formControlName={co.split(",")[0]}
								handleChange={(e) => {
									console.log("***********========", e)
									setCo(
										e.target.value +
											"," +
											cos.filter((i) => i.co_id == e.target.value)[0]?.emp_name
									)
								}}
								mode={2}
								data={[
									{ code: "AC", name: "All COs" },
									...cos?.map((item, i) => ({
										code: item?.co_id,
										name: `${item?.emp_name} - (${item?.co_id})`,
									})),
								]}
							/>
						</div>
					)} */}
					{searchType === "C" &&
					(userDetails?.id === 3 ||
						userDetails?.id === 4 ||
						userDetails?.id === 11) &&
					userDetails?.brn_code == 100 ? (
						<div className="w-full pt-4">
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
									label="CO Name"
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
					{+procedureSuccessFlag === 1 && (
						<div className="flex gap-6 items-center align-middle">
							<Radiobtn
								data={options}
								val={searchType}
								onChangeVal={(value) => {
									onChange(value)
								}}
							/>
							<div className="mt-3">
								<button
									className="inline-flex items-center px-4 py-2 text-sm font-small text-white border hover:border-pink-600 border-pink-500 bg-pink-500 transition ease-in-out hover:bg-pink-700 duration-300 rounded-full"
									onClick={handleSubmit}
								>
									<Search /> <span className="ml-2">Fetch</span>
								</button>
							</div>
						</div>
					)}

					{reportData?.length > 0 && searchType !== "B" && (
						<div>
							<div className="text-xl -mb-4 text-slate-700 font-bold">
								Daywise
							</div>
							<div className="mb-2">
								<Radiobtn
									data={options2}
									val={searchType2}
									onChangeVal={(e) => onChange2(e)}
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

					{/* "Groupwise" */}

					{reportData.length > 0 && searchType === "G" && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[8, 15, 16, 17, 18]}
								// colRemove={[13]}
								dateTimeExceptionCols={[8, 13, 14, 15]}
								headersMap={groupwiseDemandVsCollectionHeader}
							/>
						</>
					)}

					{/* "Fundwise" */}

					{reportData.length > 0 && searchType === "F" && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[11, 12, 13, 14]}
								// dateTimeExceptionCols={[8]}
								headersMap={fundwiseDemandVsCollectionHeader}
							/>
						</>
					)}

					{/* "COwise" */}

					{reportData.length > 0 && searchType === "C" && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[10, 11, 12, 13]}
								// dateTimeExceptionCols={[8]}
								headersMap={cowiseDemandVsCollectionHeader}
							/>
						</>
					)}

					{/* "Memberwise" */}

					{reportData.length > 0 && searchType === "M" && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[12, 20, 21, 22, 23]}
								dateTimeExceptionCols={[11, 16, 17, 18, 19]}
								// colRemove={[16]}
								headersMap={memberwiseDemandVsCollectionHeader}
							/>
						</>
					)}

					{/* "Branchwise" */}

					{reportData.length > 0 && searchType === "B" && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[3, 4,5,6]}
								dateTimeExceptionCols={[8]}
								headersMap={branchwiseDemandVsCollectionHeader}
							/>
						</>
					)}

					{/* ///////////////////////////////////////////////////////////////// */}

					{reportData.length !== 0 && (
						<div className="flex gap-4">
							<Tooltip title="Export to Excel">
								<button
									onClick={() =>{
										console.log(dataToExport);
										const exportData = dataToExport;
											const tot_disb_amt = dataToExport.reduce( ( sum , cur ) => sum + Number(cur.disb_amt) , 0);
											const tot_emi_amt = dataToExport.reduce( ( sum , cur ) => sum + Number(cur.tot_emi) , 0);
											const tot_coll_amt = dataToExport.reduce( ( sum , cur ) => sum + Number(cur.coll_amt) , 0);
											const tot_demand_amt = dataToExport.reduce( ( sum , cur ) => sum + Number(cur.demand_amt) , 0);
											const tot_curr_outstanding = dataToExport.reduce( ( sum , cur ) => sum + Number(cur.curr_outstanding) , 0);
											exportData.push({
													"demand_date": "",
													"collec between": "",
													"branch_code": "",
													"branch_name": "",
													"group_code": "",
													"group_name": "",
													"co_id": "",
													"emp_name": "",
													"disb_dt": "",
													"disb_amt": tot_disb_amt.toFixed(2),
													"curr_roi": "",
													"loan_period": "",
													"period_mode": "",
													"recovery_day": "",
													"instl_start_dt": "",
													"instl_end_dt": "",
													"tot_emi": tot_emi_amt.toFixed(2),
													"coll_amt": tot_coll_amt.toFixed(2),
													"demand_amt": tot_demand_amt.toFixed(2),
													"curr_outstanding": tot_curr_outstanding.toFixed(2)
										})
										exportToExcel(exportData, headersToExport, fileName, [0])
									}}
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
										// printTableRegular(
										// 	reportData,
										// 	"Demand Report",
										// 	metadataDtls,
										// 	fromDate,
										// 	toDate
										// )
										printTableReport(
											dataToExport,
											headersToExport,
											fileName?.split(",")[0],
											[0, 8, 13, 14, 15]
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

export default DemandVsCollectionMain

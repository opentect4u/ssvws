import React, { useState, useEffect, useCallback } from "react"
import Sidebar from "../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../Address/BaseUrl"
import { Message } from "../../../Components/Message"
import { Spin, Popconfirm } from "antd"
import Select from "react-select"
import {
	LoadingOutlined,
	CheckCircleOutlined,
	SaveOutlined,
	SearchOutlined,
} from "@ant-design/icons"
import debounce from "lodash.debounce"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import { rejectTransFieldNames } from "../../../Utils/Reports/headerMap"
import Radiobtn from "../../../Components/Radiobtn"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"

const RejectTransaction = () => {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || {}

	const [loading, setLoading] = useState(false)
	const [searchKeywords, setSearchKeywords] = useState("")
	const [data, setData] = useState([])
	const [selectedRowIndices, setSelectedRowIndices] = useState([])
	const [suggestions, setSuggestions] = useState([])
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [searchType, setSearchType] = useState(() => "R")
	const [fromDate, setFromDate] = useState("")
	const [toDate, setToDate] = useState("")
	const [selectedOptions, setSelectedOptions] = useState([])
	const [branches, setBranches] = useState([])
	const [rej_res, setRejRes] = useState("")

	const options2 = [
		{
			label: "Reject Transaction(s)",
			value: "R",
		},
		{
			label: "Search Rejected Transaction(s)",
			value: "S",
		},
	]
	useEffect(() => {
		getBranches()
		setData([])
	}, [searchType])
	const onChange2 = (e) => {
		console.log("radio1 checked", e)
		setSearchType(e)
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
		if (data.length > 0) {
			setSelectedRowIndices(data.map((_, idx) => idx))
		} else {
			setSelectedRowIndices([])
		}
	}, [data])

	const fetchGroupNames = async (query) => {
		setLoading(true)
		try {
			const creds = {
				branch_code: userDetails?.brn_code,
				grps: query,
			}
			const res = await axios.post(`${url}/fetch_group_name`, creds)
			if (res?.data?.suc === 1 && Array.isArray(res?.data?.msg)) {
				setSuggestions(res?.data?.msg)
				setShowSuggestions(true)
			} else {
				setSuggestions([])
				setShowSuggestions(false)
			}
		} catch (err) {
			console.error(err)
			setSuggestions([])
			setShowSuggestions(false)
		}
		setLoading(false)
	}

	const search_reject_loan_trans = () => {
		if (fromDate && toDate) {
			setLoading(true)

			const branchCodes = selectedOptions?.map((item, i) => ({
				branch_code: item?.value,
			}))

			// const creds = {
			// 	send_month: choosenMonth,
			// 	send_year: choosenYear,
			// 	branches:
			// 		branchCodes?.length === 0
			// 			? [{ branch_code: userDetails?.brn_code }]
			// 			: branchCodes,
			// }
			const creds = {
				branch_code:
					branchCodes?.length === 0
						? [userDetails?.brn_code]
						: branchCodes.map((item) => {
								return item.branch_code
						  }),
				from_dt: formatDateToYYYYMMDD(fromDate),
				to_dt: formatDateToYYYYMMDD(toDate),
			}
			axios.post(url + "/search_reject_loan_trans", creds).then((res) => {
				console.log(res)
				if (res?.data?.search_reject_data?.suc > 0)
					setData(res.data?.search_reject_data?.msg || [])
				else Message("error", "No Data")
				setLoading(false)
			})
		}
	}

	const debouncedFetchGroups = useCallback(
		debounce((nextValue) => {
			fetchGroupNames(nextValue)
		}, 500),
		[]
	)

	const handleSearchChange = (e) => {
		const value = e.target.value
		setSearchKeywords(value)
		if (value.length >= 1) {
			debouncedFetchGroups(value)
		} else {
			debouncedFetchGroups.cancel()
			setSuggestions([])
			setShowSuggestions(false)
		}
	}

	const handleSuggestionClick = (grp) => {
		setSearchKeywords(grp?.group_code || grp?.group_name)
		setSuggestions([])
		setShowSuggestions(false)
		// Optionally, trigger the main search here
		// fetchSearchedGroups()
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
		console.log(dropdownOptions, displayedOptions)
		console.log(selected)
		if (selected?.some((option) => option.value === "all")) {
			setSelectedOptions(dropdownOptions)
		} else {
			setSelectedOptions(selected)
		}
	}
	const fetchSearchedGroups = async () => {
		setLoading(true)
		const creds = {
			group_code: searchKeywords,
			branch_code: userDetails.brn_code,
		}

		try {
			const res = await axios.post(
				`${url}/fetch_reject_loan_transactions_data`,
				creds
			)
			if (res.data.suc === 0) {
				Message("warning", res.data.msg)
				setLoading(false)
				return
			}
			setData(res.data.data || [])
		} catch (err) {
			console.error(err)
			Message("error", "Some error occurred while searching...")
		} finally {
			setLoading(false)
		}
	}

	const rejectTnx = async () => {
		setLoading(true)

		const modifiedArr = data
			.filter((_, i) => selectedRowIndices.includes(i))
			.map((txn) => ({
				payment_date: txn.transaction_date,
				loan_id: txn.loan_id,
				payment_id: txn.transaction_id,
				tr_type: txn.tr_type,
			}))

		const creds = {
			reject_trans: modifiedArr,
			reject_remarks: rej_res,
			rejected_by: userDetails.emp_id,
		}

		try {
			const res = await axios.post(`${url}/reject_loan_transactions`, creds)
			// console.log("RES", res?.data)
			if(res?.data?.suc == 1){
				Message("success", "Loan Txns rejected.")
			}
			else{
				Message("error", res?.data?.msg)
			}
		} catch (err) {
			Message("error", "Some error occurred.")
			console.log("ERRR", err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex">
			<Sidebar mode={2} />
			<div className="flex-1">
				<Spin
					indicator={<LoadingOutlined spin />}
					spinning={loading}
					className="text-slate-800 dark:text-gray-400"
				>
					<main className="px-4 my-10 mx-32">
						{/* Search Section */}
						<Radiobtn
							data={options2}
							val={searchType}
							onChangeVal={(value) => {
								onChange2(value)
							}}
						/>
						{searchType == "R" && (
							<div className="mt-4">
								<label htmlFor="default-search" className="sr-only">
									Search
								</label>
								<div className="relative mt-10">
									<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
										<svg
											className="w-4 h-4 text-gray-500 dark:text-gray-400"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 20 20"
										>
											<path
												stroke="currentColor"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
											/>
										</svg>
									</div>
									<input
										type="search"
										id="default-search"
										className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
										placeholder="Search by Group Code/Group Name"
										value={searchKeywords}
										onChange={handleSearchChange}
									/>
									<button
										type="button"
										className="text-white absolute end-2.5 bottom-2.5 bg-[#DA4167] hover:bg-[#C33157] disabled:bg-[#ee7c98] disabled:cursor-not-allowed font-medium rounded-md text-sm px-4 py-2 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
										onClick={fetchSearchedGroups}
										disabled={!searchKeywords}
									>
										Search
									</button>
								</div>
							</div>
						)}
						{searchType == "S" && (
							<div className="grid grid-cols-2 gap-5 p-5 bg-gray-50 shadow-lg rounded-lg">
								<div className="sm:col-span-2">
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
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="From "
										type="date"
										label="From"
										name="fromDate"
										formControlName={fromDate}
										handleChange={(e) => setFromDate(e.target.value)}
										min={"1900-12-31"}
										mode={1}
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="To "
										type="date"
										label="To"
										name="toDate"
										formControlName={toDate}
										handleChange={(e) => setToDate(e.target.value)}
										min={"1900-12-31"}
										mode={1}
									/>
								</div>

								<div className="sm:col-span-2 flex justify-center">
									<button
										onClick={() => search_reject_loan_trans()}
										type="submit"
										className=" disabled:bg-gray-400 disabled:dark:bg-gray-400 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-teal-500 transition ease-in-out hover:bg-teal-600 duration-300  rounded-full focus:ring-gray-600  dark:focus:ring-primary-900 dark:bg-[#92140C] dark:hover:bg-gray-600"
									>
										<SearchOutlined className="mr-2" />
										Search
									</button>
								</div>
							</div>
						)}

						{showSuggestions && suggestions?.length > 0 && (
							<ul className="absolute w-96 left-36 right-0 mt-1 z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
								{suggestions?.map((grp, idx) => (
									<li
										key={idx}
										className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b-2"
										onClick={() => handleSuggestionClick(grp)}
									>
										{grp?.group_code} - {grp?.group_name}
									</li>
								))}
							</ul>
						)}

						{/* Title */}
						<div className="grid grid-cols-2">
							<div className="sm:col-span-2">
								<div className="w-full bg-slate-800 text-slate-50 p-3 pl-5 mt-5 rounded-lg font-bold text-xl">
									{searchType == "S"
										? "Search Rejected Transaction"
										: "Rejected Transactions"}
								</div>

								{/* Dynamic Table */}
								<div className="mt-5 p-5 bg-gray-50 rounded-lg shadow-lg">
									<DynamicTailwindTable
										data={data}
										pageSize={50}
										indexing
										dateTimeExceptionCols={[0]}
										showCheckbox={searchType == "R"}
										// disableAllCheckbox
										selectedRowIndices={selectedRowIndices}
										onRowSelectionChange={setSelectedRowIndices}
										headersMap={rejectTransFieldNames}
										colRemove={[3, 6, 10, 13, 16, 19, 22]}
										columnTotal={[8]}
									/>
								</div>
								{(data?.length > 0 && userDetails?.id != 3) &&
									selectedRowIndices?.length !== 0 &&
									searchType == "R" && (
										<div>
											<Popconfirm
												title={`Reject Transaction?`}
												description={
													<>
														<div>
															<TDInputTemplateBr
																placeholder="Please give a reason behind rejecting this item"
																type="date"
																label="Please give a reason behind rejecting this item"
																name="fromDate"
																formControlName={rej_res}
																handleChange={(e) => setRejRes(e.target.value)}
																min={"1900-12-31"}
																mode={3}
															/>
														</div>
													</>
												}
												onConfirm={async () => {
													await rejectTnx()
													setData([])
													// Message("success", "Transaction Rejected.")
												}}
												onCancel={() => null}
												okText="Reject"
												cancelText="No"
												disabled={selectedRowIndices?.length === 0}
											>
												<button
													className={`items-center -mt-16 px-6 py-3 text-sm font-medium text-center text-white border border-[#DA4167] bg-[#DA4167] transition ease-in-out hover:bg-[#ac3246] hover:border-[#ac3246] duration-300 rounded-full dark:focus:ring-primary-900`}
												>
													<CheckCircleOutlined />{" "}
													<span className="ml-2">Reject</span>
												</button>
											</Popconfirm>
										</div>
									)}
							</div>
						</div>
					</main>
				</Spin>
			</div>
		</div>
	)
}

export default RejectTransaction

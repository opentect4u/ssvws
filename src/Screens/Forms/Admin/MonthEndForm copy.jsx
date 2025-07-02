import React, { useEffect, useState } from "react"
import "../../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../../Components/BtnComp"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Message } from "../../../Components/Message"
import { url } from "../../../Address/BaseUrl"
import { Spin } from "antd"
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import DialogBox from "../../../Components/DialogBox"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"

function MonthEndForm() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [selectedData, setSelectedData] = useState([])
	const [searchQuery, setSearchQuery] = useState("")
	const location = useLocation()
	const userMasterDetails = location.state || {}
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))
	const [visible, setVisible] = useState(false)
	const [topAlertMessage, setTopAlertMessage] = useState(() => "")

	console.log(params, "params")
	console.log(location, "location")

	// Fetch month end branch details from the API
	const handleFetchMonthEnd = async () => {
		setLoading(true)
		try {
			const res = await axios.post(
				`${url}/admin/fetch_monthend_branch_details`,
				{}
			)
			console.log("Fetched Month End Details:", res?.data)
			setData(res?.data?.msg || [])
		} catch (err) {
			console.error(err)
			Message("error", "Some error occurred while fetching Month End Details")
		}
		setLoading(false)
	}

	useEffect(() => {
		handleFetchMonthEnd()
	}, [])

	// Filter the data based on the search query
	const filteredData = data.filter((item) =>
		item.branch_name.toLowerCase().includes(searchQuery.toLowerCase())
	)

	// Handle individual checkbox change
	const handleCheckboxChange = (event, item) => {
		if (event.target.checked) {
			setSelectedData((prev) => [...prev, item])
		} else {
			setSelectedData((prev) =>
				prev.filter((d) => d.branch_code !== item.branch_code)
			)
		}
	}

	// Handle "Select All" checkbox
	const handleSelectAll = (event) => {
		if (event.target.checked) {
			// Select all filtered items
			setSelectedData(filteredData)
		} else {
			// Deselect all items
			setSelectedData([])
		}
	}

	// Determine if all filtered rows are selected
	const isAllSelected =
		filteredData.length > 0 &&
		filteredData.every((item) =>
			selectedData.some((selected) => selected.branch_code === item.branch_code)
		)

	// This function is called after confirmation (via DialogBox) to send the payload
	const handleUpdateForm = async () => {
		setLoading(true)
		try {
			const payload = {
				closed_by: userDetails?.emp_id,
				month_end_dt: selectedData.map((item) => ({
					branch_code: item?.branch_code,
					closed_upto: formatDateToYYYYMMDD(item?.closed_upto),
				})),
			}
			const res = await axios.post(
				`${url}/admin/update_month_end_data`,
				payload
			)
			Message("success", "Month end details updated successfully")
			console.log("API response:", res.data)
			handleFetchMonthEnd()
			setSelectedData(() => [])
		} catch (err) {
			console.error(err)
			Message("error", "Some error occurred while updating Month End Details")
		}
		setLoading(false)
	}

	const handleFetchUnapprovedLoanBranches = async () => {
		setLoading(true)
		try {
			const payload = {
				month_end_dtls: selectedData.map((item) => ({
					branch_code: item?.branch_code,
					payment_date: formatDateToYYYYMMDD(item?.closed_upto),
				})),
			}

			const res = await axios.post(
				`${url}/admin/fetch_unapproved_dtls_before_monthend`,
				payload
			)

			if (res?.data?.details?.length > 0) {
				// const unapprovedLoans = res?.data?.details.map((item) => item.loan_id)
				// const branchName = selectedData.find(
				// 	(item, idx) => item.branch_code === res?.data?.details[idx]
				// )?.branch_name

				console.log(
					"============ fetch_unapproved_dtls_before_monthend =============",
					res?.data
				)

				Message(
					"warning",
					`The following loans are not approved for the month end for : ${res?.data?.details?.map(
						(item, i) => `${item?.branch_id}`
					)}`
				)
				setTopAlertMessage(
					`Following branches have unapproved transactions. Please approve them before proceeding : ${res?.data?.details?.map(
						(item, i) => `${item?.branch_id}, `
					)}`
				)
				setLoading(false)
				return
			} else {
				await handleUpdateForm()
			}

			console.log("API response handleFetchUnapprovedLoanBranches:", res?.data)

			setSelectedData(() => [])
		} catch (err) {
			console.error(err)
			Message("error", "Some error occurred while updating Month End Details")
		}
		setLoading(false)
	}

	const onSubmit = (e) => {
		e.preventDefault()
		setVisible(true)
	}

	console.log("SELECTED DATA", selectedData)

	return (
		<>
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<form onSubmit={onSubmit}>
					<div>
						{/* Search Input */}
						<div className="pb-4 bg-white dark:bg-gray-900">
							<div>
								{topAlertMessage && (
									<div className="text-red-500 dark:text-red-400 text-lg py-2">
										● {topAlertMessage}
									</div>
								)}
							</div>
							<label htmlFor="table-search" className="sr-only">
								Search
							</label>
							<div className="relative mt-1">
								<div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
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
									type="text"
									id="table-search"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="Search for branch"
								/>
							</div>
						</div>

						{/* Scrollable table container */}
						<div
							className="relative overflow-x-auto shadow-md sm:rounded-lg custom-scroll"
							style={{ maxHeight: "500px", overflowY: "auto" }}
						>
							<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								<thead className="text-xs font-bold text-slate-50 uppercase bg-slate-700 dark:bg-gray-700 dark:text-gray-400">
									<tr>
										<th scope="col" className="p-4">
											<div className="flex items-center">
												<input
													type="checkbox"
													id="select-all"
													onChange={handleSelectAll}
													checked={isAllSelected}
													className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
												/>
												<label htmlFor="select-all" className="sr-only">
													Select All
												</label>
											</div>
										</th>
										<th scope="col" className="px-6 py-3">
											Branch name
										</th>
										<th scope="col" className="px-6 py-3">
											Branch code
										</th>
										<th scope="col" className="px-6 py-3">
											Closing date
										</th>
									</tr>
								</thead>
								<tbody>
									{filteredData.map((item) => (
										<tr
											key={item.branch_code}
											className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
										>
											<td className="w-4 p-4">
												<div className="flex items-center">
													<input
														id={`checkbox-${item.branch_code}`}
														type="checkbox"
														className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
														onChange={(e) => handleCheckboxChange(e, item)}
														checked={selectedData.some(
															(d) => d.branch_code === item.branch_code
														)}
													/>
													<label
														htmlFor={`checkbox-${item.branch_code}`}
														className="sr-only"
													>
														checkbox
													</label>
												</div>
											</td>
											<td className="px-6 py-4">{item.branch_name}</td>
											<td className="px-6 py-4">{item.branch_code}</td>
											<td className="px-6 py-4">
												{item.closed_upto
													? new Date(item.closed_upto).toLocaleDateString(
															"en-GB"
													  )
													: "N/A"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="mt-10 justify-center items-center align-middle text-center">
							<button
								type="submit"
								className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white border hover:border-green-600 border-teal-500 disabled:border-slate-300 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full disabled:bg-slate-300 disabled:text-slate-950"
								disabled={!selectedData?.length}
							>
								<SaveOutlined className="mr-2" />
								Submit
							</button>
						</div>
					</div>
				</form>
			</Spin>

			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={async () => {
					// handleUpdateForm()
					setVisible(!visible)
					await handleFetchUnapprovedLoanBranches()
				}}
				onPressNo={() => setVisible(!visible)}
			/>
		</>
	)
}

export default MonthEndForm

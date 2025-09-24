import React, { useEffect, useState } from "react"
import "../../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { Message } from "../../../Components/Message"
import { url } from "../../../Address/BaseUrl"
import { Spin } from "antd"
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons"
import DialogBox from "../../../Components/DialogBox"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import { useSocket } from "../../../Context/SocketContext"

function MonthEndForm() {
	const params = useParams()
	const location = useLocation()
	const navigate = useNavigate()
	const { socket, connectSocket } = useSocket()
	const userMasterDetails = location.state || {}
	const userDetails = JSON.parse(localStorage.getItem("user_details"))
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const [searchQuery, setSearchQuery] = useState("")
	const [visible, setVisible] = useState(false)
	const [topAlertMessage, setTopAlertMessage] = useState("")
	const [selectedRowIndices, setSelectedRowIndices] = useState([])

	// Add effect to ensure socket connection
	useEffect(() => {
		if (!socket && userDetails?.emp_id) {
			console.log("Initializing socket connection...")
			connectSocket(userDetails.emp_id)
		}
	}, [socket, userDetails, connectSocket])

	// Debug socket status changes
	useEffect(() => {
		console.log("Socket connection status:", socket ? "Connected" : "Disconnected")
	}, [socket])

	const handleFetchMonthEnd = async () => {
		setLoading(true)
		try {
			const res = await axios.post(
				`${url}/admin/fetch_monthend_branch_details`,
				{}
			)
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

	const filteredData = data.filter((item) =>{
			item['checkOnce'] = true
			return item.branch_name.toLowerCase().includes(searchQuery.toLowerCase())
		}
	)

	useEffect(() => {
		setSelectedRowIndices((prevIndices) => {
			const pruned = prevIndices.filter(
				(idx) => idx >= 0 && idx < filteredData.length
			)
			if (pruned.length !== prevIndices.length) {
				return pruned
			}
			return prevIndices
		})
	}, [filteredData])

	const onTableSelectionChange = (newSelectedIndices) => {
		setSelectedRowIndices(newSelectedIndices)
	}

	const selectedData = selectedRowIndices.map((idx) => filteredData[idx])

	const handleFetchUnapprovedLoanBranches = async () => {
		if (selectedData.length === 0) return

		setLoading(true)
		try {
			const payload = {
				month_end_dtls: selectedData.map((item) => ({
					branch_code: item.branch_code,
					payment_date: formatDateToYYYYMMDD(item.closed_upto),
				})),
			}

			const res = await axios.post(
				`${url}/admin/fetch_unapproved_dtls_before_monthend`,
				payload
			)

			if (res?.data?.details?.length > 0) {
				const badBranches = res.data.details.map((d) => d.branch_id).join(", ")
				Message(
					"warning",
					`The following branches have unapproved transactions: ${badBranches}`
				)
				setTopAlertMessage(
					`Following branches have unapproved transactions. Please approve them before proceeding: ${badBranches}`
				)
				setLoading(false)
				return
			}

			await handleUpdateForm()
		} catch (err) {
			console.error(err)
			Message("error", "Some error occurred while checking unapproved loans")
		}
		setLoading(false)
	}

	const handleUpdateForm = async () => {
		setLoading(true)
		try {
			const payload = {
				closed_by: userDetails?.emp_id,
				month_end_dt: selectedData.map((item) => ({
					branch_code: item.branch_code,
					closed_upto: formatDateToYYYYMMDD(item.closed_upto),
				})),
			}

			const res = await axios.post(
				`${url}/admin/update_month_end_data`,
				payload
			)
			
			if(res?.data?.suc > 0){
				// console.log(res?.data?.req_data, 'RESSSSS======>>>> ////');
				
				if (!socket) {
					console.warn("Socket not connected, attempting to reconnect...")
					const newSocket = connectSocket(userDetails?.emp_id)
					if (newSocket) {					
						newSocket.emit('month_end_process', {
							data: res?.data?.req_data
						})
					} else {
						console.error("Failed to establish socket connection")
					}
				} else {
					console.log(res?.data, 'RESSSSS======>>>>');
					socket.emit('month_end_process', {
						data: res?.data?.req_data
					})
				}
				Message("success", "Month end details updated successfully")
				handleFetchMonthEnd()
	
				setSelectedRowIndices([])
				setTopAlertMessage("")
			}else{
				Message("error", "Some error occurred while updating Month End Details")
			}
			// Message("success", "Month end details updated successfully")
			// handleFetchMonthEnd()

			// setSelectedRowIndices([])
			// setTopAlertMessage("")
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
						{topAlertMessage && (
							<div className="text-red-500 dark:text-red-400 text-lg py-2">
								● {topAlertMessage}
							</div>
						)}

						<div className="pb-4 bg-white dark:bg-gray-900">
							<label htmlFor="table-search" className="sr-only">
								Search
							</label>
							<div className="relative mt-1">
								<div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
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
									className="block pl-10 pr-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder="Search for branch"
								/>
							</div>
						</div>

						<DynamicTailwindTable
							data={filteredData}
							showCheckbox={true}
							selectedRowIndices={selectedRowIndices}
							onRowSelectionChange={onTableSelectionChange}
							bordered={false}
							colRemove={[3, 4]}
							headersMap={{
								branch_code: "Branch Code",
								branch_name: "Branch Name",
								closed_upto: "Closed Upto",
							}}
							dateTimeExceptionCols={[2]}
						/>

						<div className="flex justify-center">
							<button
								type="submit"
								className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white border border-teal-500 bg-teal-500 hover:bg-green-600 hover:border-green-600 disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-950 rounded-full transition duration-300"
								disabled={selectedRowIndices.length === 0}
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
				visible={visible}
				onPress={() => setVisible(false)}
				onPressYes={async () => {
					setVisible(false)
					await handleFetchUnapprovedLoanBranches()
				}}
				onPressNo={() => setVisible(false)}
			/>
		</>
	)
}

export default MonthEndForm

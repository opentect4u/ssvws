import React, { useState } from "react"
import { routePaths } from "../Assets/Data/Routes"
import { Link } from "react-router-dom"
import Tooltip from "@mui/material/Tooltip"
import { Paginator } from "primereact/paginator"
import { motion } from "framer-motion"
import {
	CheckCircleOutlined,
	LoadingOutlined,
	ClockCircleOutlined,
	EditOutlined,
	FileTextOutlined,
	SyncOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { Tag, Spin } from "antd"
import axios from "axios"
import DialogBox from "./DialogBox"
import { url } from "../Address/BaseUrl"

function RecoveryMemberApproveTable({
	loanAppData,
	setSearch,
	title,
	flag,
	showSearch = true,
	isForwardLoan = false,
	isRejected = false,
	loanType = "R",
	fetchLoanApplications,
}) {
	const navigate = useNavigate()

	const [first, setFirst] = useState(0)
	const [rows, setRows] = useState(10)
	const [visible, setVisible] = useState(() => false)

	const [loading, setLoading] = useState(() => false)
	const [cachedPaymentId, setCachedPaymentId] = useState("")

	const onPageChange = (event) => {
		setFirst(event.first)
		setRows(event.rows)
	}

	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""

	const approveRecoveryTransaction = async (paymentId) => {
		setLoading(true)
		const creds = {
			approved_by: userDetails?.emp_id,
			payment_id: paymentId,
		}
		await axios
			.post(`${url}/admin/approve_recovery_loan`, creds)
			.then((res) => {
				console.log("RESSS approveRecoveryTransaction", res?.data)
			})
			.catch((err) => {
				console.log("ERRR approveRecoveryTransaction", err)
			})
		setLoading(false)
	}

	return (
		<Spin
			indicator={<LoadingOutlined spin />}
			size="large"
			className="text-blue-800 dark:text-gray-400"
			spinning={loading}
		>
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
			>
				<div
					className={`flex flex-col p-1 ${
						flag === "MIS" ? "bg-blue-800" : "bg-slate-800"
					} rounded-lg my-3 ${
						flag === "MIS" ? "dark:bg-blue-800" : "dark:bg-slate-800"
					} md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-1.5`}
				>
					<div className="w-full">
						<div className="flex items-center justify-between">
							<motion.h2
								initial={{ opacity: 0, y: -50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1, type: "just" }}
								className="text-xl w-48 capitalize text-nowrap font-bold text-white dark:text-white sm:block hidden mx-4"
							>
								{title}
							</motion.h2>

							<label htmlFor="simple-search" className="sr-only">
								Search
							</label>
							{showSearch && (
								<div className="relative w-full -right-12 2xl:-right-12">
									<div className="absolute inset-y-0 left-0 flex items-center md:ml-4 pl-3 pointer-events-none">
										<svg
											aria-hidden="true"
											className="w-5 h-5 text-gray-500 dark:text-gray-400"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<motion.input
										type="text"
										id="simple-search"
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: "92%" }}
										transition={{ delay: 1.1, type: "just" }}
										className={`bg-white border rounded-lg ${
											flag === "MIS" ? "border-blue-700" : "border-slate-700"
										} text-gray-800 block w-full h-12 pl-10 dark:bg-gray-800 md:ml-4 duration-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-lg focus:border-blue-600`}
										placeholder="Search"
										required=""
										onChange={(text) => setSearch(text.target.value)}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</motion.section>
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
			>
				<table className="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400">
					<thead
						className={`text-md text-gray-700 capitalize ${
							flag === "MIS" ? "bg-blue-100" : "bg-slate-300"
						} dark:bg-gray-700 dark:text-gray-400`}
					>
						<tr>
							<th scope="col" className="p-4">
								Sl No.
							</th>
							<th scope="col" className="p-4">
								Payment Date
							</th>
							<th scope="col" className="p-4">
								Payment ID
							</th>
							<th scope="col" className="p-4">
								Group - Loan ID (Member)
							</th>
							<th scope="col" className="p-4">
								Total EMI
							</th>
							<th scope="col" className="p-4">
								Amount
							</th>
							<th scope="col" className="p-4">
								Outstanding
							</th>
							<th scope="col" className="p-4">
								Created By
							</th>
							<th scope="col" className="p-4">
								Approve
							</th>
						</tr>
					</thead>
					<tbody>
						{loanAppData &&
							loanAppData?.slice(first, rows + first).map((item, i) => (
								<tr
									className={
										"bg-white border-2 border-b-pink-200 dark:bg-gray-800 dark:border-gray-700"
									}
									key={i}
								>
									<td className="px-4 py-3 font-bold text-slate-800">
										{i + 1}
									</td>
									<td className="px-4 py-3">
										{new Date(item?.transaction_date).toLocaleDateString(
											"en-GB"
										)}
									</td>
									<td className="px-4 py-3">{item?.payment_id}</td>
									{/* <td className="px-4 py-3">{item.group_code}</td>
									<td className="px-4 py-3">
										{item.tr_type == "D"
											? "Disbursement"
											: item.tr_type == "R"
											? "Recovery"
											: item.tr_type == "I"
											? "Interest"
											: "Error"}
									</td> */}
									<td className="px-4 py-3">{`${item.group_name} - ${item.loan_id} (${item?.client_name})`}</td>
									{/* <td className="px-4 py-3">{item.loan_id}</td> */}
									<td className="px-4 py-3">{item.tot_emi}</td>
									<td className="px-4 py-3">{`${item.amt} - (${item?.tr_mode})`}</td>
									<td className="px-4 py-3">{`${item.outstanding}`}</td>
									<td className="px-4 py-3">{item.created_by}</td>
									{/* <td className="px-4 py-3">{item.debit}</td> */}
									{/* <td className="px-4 py-3">{item.member_name}</td> */}
									{/* <td className="px-4 py-3">
										{item.branch_name}
									</td>
									<td className="px-4 py-3">{item.loan_type_name}</td> */}
									{/* <td className="px-4 py-3">{item.member_name}</td> */}
									<td className="px-4 py-3">
										{flag === "BM" && (
											<button
												onClick={() => {
													setCachedPaymentId(item?.payment_id)
													setVisible(true)
												}}
											>
												{/* DA4167 */}
												<CheckCircleOutlined
													className={`text-2xl bg-[#0694a2] w-20 h-10 text-[#ffeaef] rounded-sm flex justify-center items-center`}
												/>
											</button>
										)}
									</td>
								</tr>
							))}
					</tbody>
				</table>
				<Paginator
					first={first}
					rows={rows}
					totalRecords={loanAppData?.length}
					rowsPerPageOptions={[3, 5, 10, 15, 20, 30, loanAppData?.length]}
					onPageChange={onPageChange}
				/>
			</motion.section>

			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={async () => {
					// editGroup()
					await approveRecoveryTransaction(cachedPaymentId)
						.then(() => {
							fetchLoanApplications("R")
						})
						.catch((err) => {
							console.log("Err in RecoveryMemberApproveTable.jsx", err)
						})
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>
		</Spin>
	)
}

export default RecoveryMemberApproveTable

import "./Dashboard.css"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts"
import axios from "axios"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import DashboardCard from "../../../Components/Dashboard/DashboardCard"
import { url } from "../../../Address/BaseUrl"

const dummyUserList = [
	{ emp_name: "John Doe", id: 1 },
	{ emp_name: "Jane Smith", id: 2 },
	{ emp_name: "Alice Johnson", id: 3 },
	{ emp_name: "Bob Brown", id: 4 },
	{ emp_name: "Charlie Davis", id: 5 },
	{ emp_name: "David Wilson", id: 6 },
	{ emp_name: "Eva Martinez", id: 7 },
	{ emp_name: "Frank Garcia", id: 8 },
	{ emp_name: "Grace Lee", id: 9 },
	{ emp_name: "Henry Walker", id: 10 },
	{ emp_name: "Isabella Hall", id: 11 },
	{ emp_name: "Jack Young", id: 12 },
	{ emp_name: "Liam King", id: 13 },
	{ emp_name: "Mia Wright", id: 14 },
	{ emp_name: "Noah Scott", id: 15 },
]

const grtDataToday = [
	{ label: "Pending", value: 1200, color: "bg-orange-300" },
	{ label: "Sent to MIS", value: 450, color: "bg-blue-300" },
	{ label: "Approved", value: 900, color: "bg-green-300" },
	{ label: "Rejected", value: 350, color: "bg-red-300" },
]

const grtDataMonth = [
	{ label: "Pending", value: 5320, color: "bg-orange-300" },
	{ label: "Sent to MIS", value: 1250, color: "bg-blue-300" },
	{ label: "Approved", value: 3580, color: "bg-green-300" },
	{ label: "Rejected", value: 481, color: "bg-red-300" },
]

const collectionMonthly = [
	{ month: "Jan", disbursement: 300, recovery: 250 },
	{ month: "Feb", disbursement: 350, recovery: 300 },
	{ month: "Mar", disbursement: 400, recovery: 360 },
	{ month: "Apr", disbursement: 450, recovery: 410 },
	{ month: "May", disbursement: 380, recovery: 340 },
	{ month: "Jun", disbursement: 420, recovery: 380 },
	{ month: "Jul", disbursement: 500, recovery: 460 },
	{ month: "Aug", disbursement: 430, recovery: 390 },
	{ month: "Sep", disbursement: 410, recovery: 370 },
	{ month: "Oct", disbursement: 480, recovery: 440 },
	{ month: "Nov", disbursement: 460, recovery: 420 },
	{ month: "Dec", disbursement: 470, recovery: 430 },
]

const collectionYearly = [
	{ month: "2019", disbursement: 3000, recovery: 2700 },
	{ month: "2020", disbursement: 3500, recovery: 3200 },
	{ month: "2021", disbursement: 4000, recovery: 3700 },
	{ month: "2022", disbursement: 4500, recovery: 4200 },
	{ month: "2023", disbursement: 4800, recovery: 4500 },
]

export default function Dashboard() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || {}
	const type = userDetails.id === 2 ? "BM" : "Admin 2"
	const branchId = userDetails?.brn_code

	const [loading, setLoading] = useState(() => false)
	const [branches, setBranches] = useState(() => [])
	const [choosenBranch, setChoosenBranch] = useState(() =>
		+branchId === 100 ? "100" : ""
	)

	const [view, setView] = useState("Monthly")
	const data = view === "Monthly" ? collectionMonthly : collectionYearly

	const [grtPeriod, setGrtPeriod] = useState("Today")
	const [choosenGraphYear, setChoosenGraphYear] = useState("A")

	const activeGrtData = grtPeriod === "Today" ? grtDataToday : grtDataMonth

	const fetchBranches = async () => {
		setLoading(true)
		await axios
			.get(`${url}/admin/fetch_branch`)
			.then((res) => {
				setBranches(
					res.data.msg.map((item) => ({
						code: item.branch_code,
						name: `${item.branch_name} (${item.branch_code})`,
					}))
				)
			})
			.catch(console.error)
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		fetchBranches()
	}, [])

	const handleGraphYearChange = (e) => {
		const selectedId = e.target.value
		setChoosenGraphYear(selectedId)
	}

	const handleBranchChange = (e) => {
		const selectedId = e.target.value
		setChoosenBranch(selectedId)
	}

	return (
		<div className="p-8 space-y-6 bg-slate-50 min-h-screen rounded-3xl">
			<div className="flex flex-col md:flex-row justify-between items-center">
				<h1 className="text-2xl font-bold text-slate-700 uppercase">
					Welcome back,{" "}
					<span className="text-slate-600 text-2xl font-thin">
						{userDetails?.emp_name}
					</span>{" "}
					:{" "}
					{/* : <span className="text-slate-600 text-2xl font-thin">{type} </span>:{" "} */}
					<span className="text-slate-600 text-2xl font-thin">
						{userDetails?.branch_name}
					</span>
				</h1>
				<h1 className="text-2xl font-bold text-slate-700 uppercase">
					Date of operation :{" "}
					<span className="text-slate-600 text-2xl font-thin">
						{new Date().toLocaleDateString("en-GB")}
					</span>
				</h1>
			</div>

			{+branchId === 100 && (
				<div className="flex flex-col md:flex-row justify-between items-center">
					<TDInputTemplateBr
						placeholder="Select Branch..."
						type="text"
						formControlName={choosenBranch}
						handleChange={handleBranchChange}
						data={branches}
						mode={2}
					/>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="col-span-1 md:col-span-2 rounded-3xl bg-white shadow-md p-6 space-y-4 overflow-hidden">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-medium text-slate-700">Total GRT</h2>

						<div className="space-x-2">
							{["Today", "This month"].map((option) => (
								<button
									key={option}
									onClick={() => setGrtPeriod(option)}
									className={`px-3 py-1 rounded-full font-medium text-sm ${
										grtPeriod === option
											? "bg-teal-600 text-white"
											: "bg-slate-100 text-slate-600"
									}`}
								>
									{option}
								</button>
							))}
						</div>
					</div>

					{activeGrtData.map((item) => (
						<div key={item.label} className="flex items-center">
							<span className="w-40 text-sm text-slate-600">{item.label}</span>
							<div className="flex-1 bg-slate-100 h-4 rounded-full mx-4 overflow-hidden relative">
								<motion.div
									className={`${item.color} h-4`}
									style={{ clipPath: "inset(0 round 999px)" }}
									initial={{ width: 0 }}
									animate={{ width: `${(item.value / 6000) * 100}%` }}
									transition={{
										duration: 0.6,
										ease: [0.7, 0.0, 0.3, 1.0],
									}}
								/>
							</div>
							<span className="text-slate-800 font-semibold">
								{item.value.toLocaleString()}
							</span>
						</div>
					))}
				</div>

				<div className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center group">
					<h3 className="text-lg font-medium text-slate-700">Active Groups</h3>
					<div className="bg-green-100 rounded-full p-4 my-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-green-600 arrow"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 10l7-7m0 0l7 7m-7-7v18"
							/>
						</svg>
					</div>
					<span className="text-3xl font-bold text-slate-800">2,420</span>
					<span className="text-sm text-slate-600 mt-1">Loan active</span>
				</div>

				{/* <div className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center">
					<h3 className="text-lg font-medium text-slate-800">User Logged in</h3>
					<div className="bg-purple-100 rounded-full p-4 my-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-purple-600"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
							<path
								fillRule="evenodd"
								d="M4 20c0-4 4-6 8-6s8 2 8 6v1H4v-1z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
					<span className="text-3xl font-bold text-slate-800">250</span>
					<span className="text-sm text-slate-600 mt-1">Active users</span>
				</div> */}
				<div className="col-span-1 md:col-span-1 perspective cursor-pointer">
					<div
						className="relative w-full h-full transition-transform duration-500"
						style={{
							transformStyle: "preserve-3d",
						}}
					>
						{/* Front */}
						<div
							className="absolute inset-0 bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center"
							style={{ backfaceVisibility: "hidden" }}
						>
							<h3 className="text-lg font-medium text-slate-700">
								Users Logged In
							</h3>
							<div className="bg-purple-100 rounded-full p-4 my-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-6 w-6 text-purple-600"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
									<path
										fillRule="evenodd"
										d="M4 20c0-4 4-6 8-6s8 2 8 6v1H4v-1z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<span className="text-3xl font-bold text-slate-800">250</span>
							<span className="text-sm text-slate-600 mt-1">Active users</span>
						</div>

						{/* Back */}
						<div
							className="absolute inset-0 bg-purple-50 rounded-3xl shadow-md p-6 flex items-center justify-center"
							style={{
								transform: "rotateY(-180deg)",
								backfaceVisibility: "hidden",
							}}
						>
							<div className="w-full max-h-[150px] overflow-auto">
								<ul className="max-w-md space-y-1 text-slate-600 list-inside dark:text-slate-400">
									{dummyUserList?.map((user, i) => (
										<>
											<li className="flex items-center">
												{i % 2 === 0 ? (
													<svg
														className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 shrink-0"
														aria-hidden="true"
														xmlns="http://www.w3.org/2000/svg"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
													</svg>
												) : i % 3 === 0 ? (
													<svg
														className="w-3.5 h-3.5 me-2 text-slate-500 dark:text-slate-400 shrink-0"
														aria-hidden="true"
														xmlns="http://www.w3.org/2000/svg"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
													</svg>
												) : (
													<svg
														className="w-3.5 h-3.5 me-2 shrink-0"
														aria-hidden="true"
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
													>
														<circle cx="10" cy="10" r="9.5" fill="#ef4444" />
														<path
															fill="#ffffff"
															d="M13.414 6.586a1 1 0 0 0-1.414 0L10 8.586 8 6.586a1 1 0 1 0-1.414 1.414L8.586 10l-1.999 2a1 1 0 1 0 1.414 1.414L10 11.414l2 1.999a1 1 0 0 0 1.414-1.414L11.414 10l2-2a1 1 0 0 0 0-1.414z"
														/>
													</svg>
												)}
												{user.emp_name}
											</li>
											<hr className="border-t border-purple-200 my-2 w-3/4" />
										</>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-6 gap-6">
				<DashboardCard
					title="Loan Disbursed"
					left1Data={{ label: "This Month", value: "1,920" }}
					left2Data={{ label: "Today", value: "22" }}
					right1Data={{ label: "No. of Groups", value: "35" }}
					right2Data={{ label: "No. of Groups", value: "50" }}
					leftColor="#DB2777"
					rightColor="#334155"
				/>

				<DashboardCard
					title="Loan Collected"
					left1Data={{ label: "This Month", value: "1,920" }}
					left2Data={{ label: "Today", value: "22" }}
					right1Data={{ label: "No. of Groups", value: "35" }}
					right2Data={{ label: "No. of Groups", value: "50" }}
					leftColor="#2563EB"
					rightColor="#334155"
				/>

				<DashboardCard
					title="Unapproved Transactions"
					left1Data={{ label: "This Month", value: "1,920" }}
					left2Data={{ label: "Today", value: "62" }}
					right1Data={{ label: "No. of Groups", value: "28" }}
					right2Data={{ label: "No. of Groups", value: "50" }}
					leftColor="#7C3AED"
					rightColor="#334155"
				/>
				{/* <div className="md:col-span-2 bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center">
					<h3 className="text-lg font-medium bg-green-100 text-green-800 px-5 py-2 rounded-full">
						Loan Approval Status
					</h3>
					<div className="flex justify-between items-center w-full px-14 py-5 rounded-3xl bg-white">
						<div className="flex flex-col items-center gap-2">
							<span className="text-4xl font-bold text-emerald-600 mt-4">
								1,240
							</span>
							<span className="text-sm text-slate-600">Monthly</span>
						</div>
						<div className="h-16 w-[2px] rounded bg-slate-300" />
						<div className="flex flex-col items-center gap-2">
							<span className="text-4xl font-bold text-sky-600 mt-4">
								1,240
							</span>
							<span className="text-sm text-slate-600">Daily</span>
						</div>
					</div>
				</div> */}
			</div>

			<div className="col-span-1 md:col-span-4 bg-white rounded-3xl shadow-md p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-medium text-slate-800">
						Loan Collection
					</h2>
					<div>
						{/* {["Monthly", "Yearly"].map((option) => (
							<button
								key={option}
								onClick={() => setView(option)}
								className={`px-3 py-1 rounded-full text-sm ${
									view === option
										? "bg-teal-600 text-white"
										: "bg-slate-100 text-slate-600"
								}`}
							>
								{option}
							</button>
						))} */}
						<TDInputTemplateBr
							placeholder="Select Financial Year..."
							type="text"
							label="Choose Financial Year"
							formControlName={choosenGraphYear}
							handleChange={handleGraphYearChange}
							data={[
								{ code: "A", name: "2025-2026" },
								{ code: "B", name: "2024-2025" },
								{ code: "F", name: "2023-2024" },
							]}
							mode={2}
						/>
					</div>
				</div>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={data}>
						<XAxis dataKey="month" />
						<YAxis />
						<Tooltip />
						<Bar
							dataKey="disbursement"
							name="Disbursement"
							fill="#a684ff"
							barSize={25}
						/>
						<Bar
							dataKey="recovery"
							name="Recovery"
							fill="#ff637e"
							barSize={25}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

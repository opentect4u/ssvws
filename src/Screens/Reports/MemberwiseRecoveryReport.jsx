import React, { useEffect, useState } from "react"
import Sidebar from "../../Components/Sidebar"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { Spin, Button } from "antd"
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons"
import GroupsTableViewBr from "../../Components/GroupsTableViewBr"
import ViewLoanTableBr from "../../Components/ViewLoanTableBr"
import Radiobtn from "../../Components/Radiobtn"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../Utils/formateDate"

const options = [
	{
		label: "Cash",
		value: "C",
	},
	{
		label: "Bank",
		value: "B",
	},
]

function MemberwiseRecoveryReport() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	// const [approvalStatus, setApprovalStatus] = useState("S")
	const [txnMode, setTxnMode] = useState(() => "C")

	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [reportData, setReportData] = useState(() => [])
	const [tot_sum, setTotSum] = useState(0)
	const [search, setSearch] = useState("")

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setTxnMode(e)
	}

	const handleFetchReport = async () => {
		setLoading(true)
		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			to_dt: formatDateToYYYYMMDD(toDate),
			tr_mode: txnMode,
			branch_code: JSON.parse(localStorage.getItem("user_details"))?.brn_code,
			grp_dtls_app: search,
		}
		await axios
			.post(`${url}/admin/member_wise_recov_web`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				setReportData(res?.data?.msg)
				setTotSum(res?.data?.msg.reduce((n, { credit }) => n + credit, 0))
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		if (fromDate && toDate && txnMode && search.length > 2) {
			handleFetchReport()
		}
	}, [fromDate, toDate, txnMode, search])

	return (
		<div>
			<Sidebar mode={2} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-slate-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 bg-slate-50 rounded-lg shadow-lg h-auto my-10 mx-32 pb-5">
					<div className="flex flex-row gap-3 mt-20  py-3 rounded-xl">
						<div className="text-3xl text-slate-800">
							Memberwise Recovery Report
						</div>
					</div>

					<div className="grid grid-cols-2 gap-5 mt-5">
						<div>
							<TDInputTemplateBr
								placeholder="From Date"
								type="date"
								label="From Date"
								name="fromDate"
								formControlName={fromDate}
								handleChange={(e) => setFromDate(e.target.value)}
								// handleBlur={formik.handleBlur}
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
								// handleBlur={formik.handleBlur}
								min={"1900-12-31"}
								mode={1}
							/>
						</div>

						{/* <div className="sm:col-span-2">
							<button
								icon={<SearchOutlined />}
								iconPosition="end"
								className="bg-slate-700 text-white hover:bg-slate-800 p-5 text-center text-sm border-none rounded-lg w-[100%] h-10 flex justify-center items-center align-middle gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed active:ring-2 active:ring-slate-400"
								onClick={() => null}
							>
								<SearchOutlined />
								Search
							</button>
						</div> */}
					</div>
					<div className="my-4 mx-auto">
						<TDInputTemplateBr
							placeholder="Group Name"
							type="text"
							label="Group Name"
							name="g_group_name"
							handleChange={(txt) => setSearch(txt.target.value)}
							formControlName={search}
							mode={1}
						/>
					</div>
					<div className="mb-2">
						<Radiobtn
							data={options}
							val={txnMode}
							onChangeVal={(value) => {
								onChange(value)
							}}
						/>
					</div>

					{/* <Spin spinning={loading}> */}
					{reportData.length > 0 && (
						<div className={`relative overflow-x-auto shadow-md sm:rounded-lg`}>
							{reportData?.map((item, i) => {
								return (
									<div
										key={i}
										className={`w-full text-xs dark:bg-gray-700 dark:text-gray-400`}
									>
										{/* <span
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {i + 1}
                        </span> */}
										{/* <div className="text-slate-50 text-md uppercase p-3 bg-slate-700 w-full">
                        <span className="px-6 py-4 " >{item?.group_name}</span>

                        <span className="px-6 py-4  ">(Code - {item?.group_code})</span>
						</div> */}
										<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
											<thead className="w-full text-xs uppercase bg-slate-700 dark:bg-gray-700 dark:text-gray-400 text-slate-50">
												<th
													scope="col"
													className="px-6 py-3 font-semibold"
													colSpan={1}
												>
													{item?.group_name}
												</th>
												<th
													scope="col"
													className="px-6 py-3 font-semibold"
													colSpan={3}
												>
													{item?.group_code}
												</th>
											</thead>
											<thead className="w-full text-xs uppercase text-slate-700 bg-slate-300 dark:bg-gray-700 dark:text-gray-400">
												<tr>
													<th scope="col" className="px-6 py-3 font-semibold ">
														Member Code
													</th>
													<th scope="col" className="px-6 py-3 font-semibold ">
														Member Name
													</th>
													<th scope="col" className="px-6 py-3 font-semibold ">
														Credit
													</th>
													<th scope="col" className="px-6 py-3 font-semibold ">
														Balance
													</th>
												</tr>
											</thead>
											<tbody>
												{item.memb_dtls_app?.map((mem, i) => (
													<tr>
														<td className="px-6 py-4">{mem?.member_code}</td>
														<td className="px-6 py-4">{mem?.client_name}</td>
														<td className="px-6 py-4">{mem?.credit}/-</td>
														<td className="px-6 py-4">{mem?.balance}/-</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)
							})}
						</div>
					)}

					{/* </Spin> */}

					{/* <ViewLoanTableBr
						flag="BM"
						loanAppData={groups}
						title="Find Loans by Group"
						showSearch={false}
					/> */}
					{/* <DialogBox
					visible={visible}
					flag={flag}
					onPress={() => setVisible(false)}
				/> */}
				</main>
			</Spin>
		</div>
	)
}

export default MemberwiseRecoveryReport

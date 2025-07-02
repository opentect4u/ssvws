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

function DemandReportScreen() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	// const [approvalStatus, setApprovalStatus] = useState("S")
	const [txnMode, setTxnMode] = useState(() => "C")

	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [reportData, setReportData] = useState(() => [])
	const [tot_sum, setTotSum] = useState(0)
	const [group_code, setGroupCode] = useState([])

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setTxnMode(e)
	}

	const handleFetchReport = async () => {
		setLoading(true)
		const creds = {
			get_date: formatDateToYYYYMMDD(fromDate),
			// to_dt: formatDateToYYYYMMDD(toDate),
			// tr_mode: txnMode,
			branch_code: JSON.parse(localStorage.getItem("user_details"))?.brn_code,
		}
		await axios
			.post(`${url}/admin/get_demand_data_web`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				// setReportData(res?.data?.msg)
				// setTotSum(res?.data?.msg.reduce((n, {credit}) => n + credit, 0))
				setGroupCode(Object.keys(res?.data?.msg))
				reportData.length = 0
				setReportData([])
				for (let i of Object.keys(res?.data?.msg)) {
					console.log(i)

					var sum = 0,
						name = "",
						count = 0
					for (let j of res?.data?.msg[i]) {
						sum += j.demand.demand.ld_demand
						name = j.group_name
						console.log(j)
						//   f=Object.keys(j).length
						// t.push({mem_code:j.member_code,demand:j.demand.demand.ld_demand})
						count++
					}

					//   console.log(sum, name);
					//   setReportData((prev) => [
					//     ...prev,
					//     {
					//       code: i,
					//       demand: sum,
					//       name: name,
					//     },
					//   ]);
					reportData.push({
						code: i,
						demand: sum,
						name: name,
					})
					console.log(sum, name)
					setReportData(reportData)
				}
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		if (fromDate) {
			handleFetchReport()
		}
	}, [fromDate])

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
						<div className="text-3xl text-slate-800">Demand Report</div>
					</div>

					<div className="grid grid-cols-2 gap-5">
						<div className="sm:col-span-2 my-3">
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
						{/* <div>
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
						</div> */}
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

					{/* <div className="mb-2">
						<Radiobtn
							data={options}
							val={txnMode}
							onChangeVal={(value) => {
								onChange(value)
							}}
						/>
					</div> */}

					{/* <Spin spinning={loading}> */}
					{reportData.length > 0 && (
						<div className={`relative overflow-x-auto shadow-md sm:rounded-lg`}>
							<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								<thead className="w-full text-xs text-slate-50 uppercase bg-slate-700 dark:bg-gray-700 dark:text-gray-400">
									<tr>
										<th scope="col" className="px-6 py-3 font-semibold">
											Sl. No.
										</th>
										<th scope="col" className="px-6 py-3 font-semibold">
											Group Code
										</th>
										<th scope="col" className="px-6 py-3 font-semibold">
											Group Name
										</th>

										<th scope="col" className="px-6 py-3 font-semibold">
											Demand
										</th>
										{/* <th scope="col" className="px-6 py-3 font-semibold">
											Balance
										</th> */}
									</tr>
								</thead>
								<tbody>
									{reportData?.map((item, i) => {
										return (
											<tr
												key={i}
												className={`bg-slate-50 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-600`}
											>
												<th
													scope="row"
													className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
												>
													{i + 1}
												</th>
												<td className="px-6 py-4">{item?.code}</td>
												<td className="px-6 py-4">{item?.name}</td>
												<td className="px-6 py-4">{item?.demand}/-</td>
											</tr>
										)
									})}
									{/* <tr>
                    <td colSpan={3} className="px-6 py-4 font-bold">
                      {" "}
                      Total Credit:
                    </td>

                    <td colspan="4" className="px-6 py-4 font-bold">
                      {tot_sum}/-
                    </td>
                  </tr> */}
								</tbody>
							</table>
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

export default DemandReportScreen

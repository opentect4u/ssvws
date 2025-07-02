import React, { useEffect, useState } from "react"
import Sidebar from "../../Components/Sidebar"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import Radiobtn from "../../Components/Radiobtn"
import DisburseApproveTable from "../../Components/DisburseApproveTable"
import RecoveryMemberApproveTable from "../../Components/RecoveryMemberApproveTable"
import RecoveryGroupApproveTable from "../../Components/RecoveryGroupApproveTable"
import RecoveryCoApproveTable from "../../Components/RecoveryCoApproveTable"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../Utils/formateDate"
import RecoveryGroupDisbursTable from "../../Components/RecoveryGroupDisbursTable"
import RecoveryCoDisbursTable from "../../Components/RecoveryCoDisbursTable"
import RecoveryMemberDisbursTable from "../../Components/RecoveryMemberDisbursTable"

const options = [
	{
		label: "Groupwise",
		value: "G",
	},
	{
		label: "Collectorwise",
		value: "C",
	},
	{
		label: "Memberwise",
		value: "M",
	},
]

function DisbursedLoanApproveSingleBM() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)
	const [loanApplicationsMember, setLoanApplicationsMember] = useState(() => [])
	const [copyLoanApplicationsMember, setCopyLoanApplicationsMember] = useState(
		() => []
	)

	const [loanApplicationsCo, setLoanApplicationsCo] = useState(() => [])
	const [copyLoanApplicationsCo, setCopyLoanApplicationsCo] = useState(() => [])

	const [loanApplicationsGroup, setLoanApplicationsGroup] = useState(() => [])
	const [copyLoanApplicationsGroup, setCopyLoanApplicationsGroup] = useState(
		() => []
	)
	const [selectedEmployeeId, setSelectedEmployeeId] = useState(() => null)
	const [selectedEmployeeObj, setSelectedEmployeeObj] = useState(() => {})

	const [coListData, setCoListData] = useState(() => [])

	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()

	const [loanType, setLoanType] = useState("G")
	// const [value2, setValue2] = useState("S")


	// const fetchLoanApplications = async (loanType) => {
	const fetchLoanApplicationsGroup = async (loanType) => {
		setLoading(true)

		// const creds = {
		// 	prov_grp_code: 0,
		// 	user_type: userDetails?.id,
		// 	branch_code: userDetails?.brn_code,
		// }

		await axios
			.post(`${url}/fetch_groupwise_disburse_admin`, {
				// tr_type: loanType,
				branch_code: userDetails?.brn_code,
			})
			.then((res) => {
				console.log("PPPPPPPPPPPPPPPPPPPP", res?.data)
				if (res?.data?.suc === 1) {
					// setLoanApplications(res?.data?.msg)
					// setCopyLoanApplications(res?.data?.msg)

					setLoanApplicationsGroup(res?.data?.msg)
					setCopyLoanApplicationsGroup(res?.data?.msg)

					// console.log("dddddddddddddddd", res?.data)
				} else {
					Message("error", "No incoming loan applications found.")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching loans!")
				console.log("ERRR", err)
			})
		setLoading(false)
	}
	

	const fetchLoanApplicationsCo = async () => {
		console.log(
			"setLoanApplicationsCo",
			userDetails?.brn_code,
			formatDateToYYYYMMDD(fromDate),
			formatDateToYYYYMMDD(toDate),
			selectedEmployeeId
		)
		setLoading(true)
		await axios
			.post(`${url}/fetch_cowise_disb_data`, {
				branch_code: userDetails?.brn_code,
				// from_dt : formatDateToYYYYMMDD(fromDate),
				// to_dt : formatDateToYYYYMMDD(toDate),
				co_id: selectedEmployeeId,
			})
			.then((res) => {
				if (res?.data?.suc === 1) {
					// console.log(res?.data?.msg, "xxxxxxxxx")
					setLoanApplicationsCo(res?.data?.msg)
					setCopyLoanApplicationsCo(res?.data?.msg)
				} else {
					Message("error", "No incoming loan applications found.")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching loans!")
				console.log("ERRR", err)
			})
		setLoading(false)
	}

	const fetchLoanApplicationsMember = async () => {
		setLoading(true)
		await axios
			.post(`${url}/fetch_memberwise_disburse_admin`, {
				branch_code: userDetails?.brn_code,
				// from_dt : formatDateToYYYYMMDD(fromDate),
				// to_dt : formatDateToYYYYMMDD(toDate)
			})
			.then((res) => {
				if (res?.data?.suc === 1) {
					console.log(res?.data?.msg, 'uhuhuhuh');
					
					setLoanApplicationsMember(res?.data?.msg)
					setCopyLoanApplicationsMember(res?.data?.msg)
				} else {
					Message("error", "No incoming loan applications found.")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching loans!")
				console.log("ERRR", err)
			})
		setLoading(false)
	}

	const fetchCoList = async () => {
		setLoading(true)
		await axios
			.post(`${url}/fetch_branch_co_disb`, {
				branch_code: userDetails?.brn_code,
			})
			.then((res) => {
				if (res?.data?.suc === 1) {
					console.log("fetchCoList", res?.data?.msg)
					setCoListData(res?.data?.msg)
				} else {
					Message("error", "No incoming loan applications found.")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching loans!")
				console.log("ERRR", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		setSelectedEmployeeId(() => [])
	}, [loanType])

	const setSearch = (word) => {
		// console.log(word, 'wordwordwordword', copyLoanApplicationsMember);
		setLoanApplicationsMember(
			copyLoanApplicationsMember?.filter(
				(e) =>
					e?.loan_id?.toString()?.toLowerCase().includes(word?.toLowerCase()) ||
					e?.group_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase())
			)
		)
	}

	const setSearch_Group = (word) => {
		console.log(word, "wordwordwordword", copyLoanApplicationsGroup)
		setLoanApplicationsGroup(
			copyLoanApplicationsGroup?.filter(
				(e) =>
					e?.group_code
						?.toString()
						?.toLowerCase()
						.includes(word?.toLowerCase()) ||
					e?.group_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase())
			)
		)
	}

	const setSearch_Co = (word) => {
		console.log(word, "wordwordwordword", copyLoanApplicationsCo)
		setLoanApplicationsCo(
			copyLoanApplicationsCo?.filter(
				(e) =>
					e?.group_code
						?.toString()
						?.toLowerCase()
						.includes(word?.toLowerCase()) ||
					e?.group_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase())
			)
		)
	}

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setLoanType(e)
	}

	useEffect(() => {
		fetchCoList()
	}, [])

	const handleEmployeeChange = (e) => {
		// Save the emp_id of the selected employee
		const selectedId = e.target.value
		setSelectedEmployeeId(selectedId) // Save to state
		// console.log(selectedId, 'radio1 checked', 'kkkkkk');
		
		// const [selectedEmployeeObj, setSelectedEmployeeObj] = useState(() => {});

		// console.log("Selected Employee ID:", selectedId); // Log the selected emp_id
	}

	useEffect(() => {

		// console.log(fromDate, "fetchLoanApplicationsDate", toDate)

		if (loanType === "G") {
			fetchLoanApplicationsGroup('D')
		} else if (loanType === "C") {
			fetchLoanApplicationsCo()
		} else if (loanType === "M") {
			fetchLoanApplicationsMember()
		}
	}, [loanType, fromDate, toDate, selectedEmployeeId])

	return (
		<div>
			
			<Sidebar mode={2} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 h-auto my-16 mx-32">
					{/* <Radiobtn data={options} val={"U"} onChangeVal={onChange1} /> */}

					<Radiobtn
						data={options}
						val={loanType}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/>

					{loanType === "G" ? (
						<>
							{/* <div className="grid grid-cols-2 gap-5 mt-5">
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

					</div> */}

							<RecoveryGroupDisbursTable
								flag="BM"
								loanAppData={loanApplicationsGroup}
								title="Approve Transaction"
								setSearch_Group={(data) => setSearch_Group(data)}
								loanType={loanType}
								// fetchLoanApplications={fetchLoanApplications}
								fetchLoanApplicationsDate={{ fromDate, toDate }}
							/>
						</>
					) : loanType === "C" ? (
						<>
							<div className="grid grid-cols-3 gap-5 mt-5">
								{/* <div>
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
						</div> */}

								<div>
									<TDInputTemplateBr
										placeholder="Select Collector Name..."
										type="text"
										label="Collectorwise"
										name="b_clientGender"
										// handleChange={(e) => console.log("Selected Employee:", e.target.value)}
										handleChange={handleEmployeeChange}
										// data={[
										// { code: "M", name: "Male" },
										// { code: "F", name: "Female" },
										// { code: "O", name: "Others" },
										// ]}
										data={coListData.map((emp) => ({
											code: emp.emp_id,
											name: `${emp.emp_name} (${
												emp.user_type == 1 ? "CO" : "BM"
											})`,
										}))}
										mode={2}
										disabled={false} // Static value to make it always disabled
									/>

									{/* {JSON.stringify(selectedEmployeeId, 2)} */}
								</div>
							</div>

							<RecoveryCoDisbursTable
								flag="BM"
								loanAppData={loanApplicationsCo}
								title="Approve Transaction"
								setSearch_Co={(data) => setSearch_Co(data)}
								loanType={loanType}
								// fetchLoanApplications={fetchLoanApplications}
								fetchLoanApplicationsDate={{
									fromDate,
									toDate,
									selectedEmployeeId,
								}}
							/>
						</>
					) : loanType === "M" ? (
						<>
							{/* <div className="grid grid-cols-2 gap-5 mt-5">
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
					</div> */}
							<RecoveryMemberDisbursTable
								flag="BM"
								loanAppData={loanApplicationsMember}
								title="Approve Transaction"
								setSearch={(data) => setSearch(data)}
								loanType={loanType}
								// fetchLoanApplications={fetchLoanApplications}
							/>
						</>
					) : null}
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

export default DisbursedLoanApproveSingleBM

import React, { useEffect, useState } from "react"
import Sidebar from "../../Components/Sidebar"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import LoanApplicationsTableViewBr from "../../Components/LoanApplicationsTableViewBr"
import Radiobtn from "../../Components/Radiobtn"
import LoanRecovApplicationsTableViewBr from "../../Components/LoanRecovApplicationsTableViewBr"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import LoanApprovalApplicationsTableViewBr from "../../Components/LoanApprovalApplicationsTableViewBr"

const options = [
	{
		label: "Pending",
		value: "S",
	},
	{
		label: "Rejected",
		value: "R",
	},
	{
		label: "Approved",
		value: "A",
	}
]

function HomeScreenMis() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)
	const [loanApplications, setLoanApplications] = useState(() => [])
	const [copyLoanApplications, setCopyLoanApplications] = useState(() => [])

	const [loanType, setLoanType] = useState("S")


	const [coListData, setCoListData] = useState(() => [])
	const [selectedEmployeeId, setSelectedEmployeeId] = useState(() => null)

	// const fetchLoanApplications = async () => {
	// 	setLoading(true)
	// 	// const creds = {
	// 	// 	// prov_grp_code: 0,
	// 	// 	// user_type: userDetails?.id,
	// 	// 	// branch_code: userDetails?.brn_code,
	// 	// 	approval_status: loanType,
	// 	// }

	// 	await axios
	// 		.get(
	// 			`${url}/admin/fetch_form_fwd_bm_web?approval_status=${loanType}&branch_code=${userDetails?.brn_code}`
	// 		)
	// 		.then((res) => {
	// 			if (res?.data?.suc === 1) {
	// 				setLoanApplications(res?.data?.msg)
	// 				setCopyLoanApplications(res?.data?.msg)

	// 				console.log("PPPPPPPPPPrrrrPPPPPPPPPP", res?.data)
	// 			} else {
	// 				Message("error", "No incoming loan applications found.")
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			Message("error", "Some error occurred while fetching loans!")
	// 			console.log("ERRR", err)
	// 		})
	// 	setLoading(false)
	// }

	const fetchCoList_ID = async () => {
		setLoading(true)
		await axios
			.post(`${url}/fetch_co_brnwise`, {
				brn_code: userDetails?.brn_code,
			})
			.then((res) => {
				if (res?.data?.suc === 1) {
					// console.log("fetchCoList", res?.data?.msg[0].emp_id)
					// fetchCoList_COList(res?.data?.msg[0].emp_id, loanType)
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

	const fetchCoList_CO_Shorting = async (co_Id) => {
		console.log({
			branch_code: userDetails?.brn_code,
			approval_status: loanType,
			co_id: co_Id,
		}, 'fetchCoList____', co_Id, loanType);
		
		setLoading(true)
		await axios
			.post(`${url}/admin/mis_fetch_dtls_cowise`, {
				branch_code: userDetails?.brn_code,
				approval_status: loanType,
				co_id: co_Id,
			})
			.then((res) => {
				if (res?.data?.suc === 1) {
					console.log("fetchCoList____yyyyyyyyyyyyyyyyyyyyy", res?.data?.msg)
					setLoanApplications(res?.data?.msg)
					setCopyLoanApplications(res?.data?.msg)
					// setCoListData(res?.data?.msg)
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

	const fetchLoanApplications_GroupWise = async (loanType) => {
		setLoading(true)
		// const creds = {
		// 	// prov_grp_code: 0,
		// 	// user_type: userDetails?.id,
		// 	// branch_code: userDetails?.brn_code,
		// 	approval_status: loanType,
		// }

		await axios
			// .get(
			// 	`${url}/admin/fetch_form_fwd_bm_web?approval_status=${loanType}&branch_code=${userDetails?.brn_code}`
			// )
			.post(`${url}/admin/fetch_form_fwd_bm_to_mis_web`, {
						branch_code: userDetails?.brn_code,
						approval_status: loanType
						})
			.then((res) => {
				if (res?.data?.suc === 1) {
					setLoanApplications(res?.data?.msg)
					setCopyLoanApplications(res?.data?.msg)

					// console.log("PPPPPPPPPPPPPPPPPPPP", res?.data?.msg)
				} else {
					Message("error", "No incoming loan applications found.")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching loans!")
				setLoanApplications([])
				setCopyLoanApplications([])
				console.log("ERRR", err)
			})
		setLoading(false)
	}


	const onChange = (e) => {
		console.log("radio1 checked", e)
		setLoanType(e)
	}

	useEffect(() => {
		// fetchLoanApplications()
		fetchCoList_ID()
	}, [])

	// useEffect(() => {
	// 	console.log("radio1 checked")
	// 	// fetchCoList_CO_Short()
	// }, [coListData])


	

	const handleEmployeeChange = (e) => {
		// Save the emp_id of the selected employee
		
		console.log(e.target.value, 'oooooooooooooooo');
		const selectedId = e.target.value
		setSelectedEmployeeId(selectedId) // Save to state
		fetchCoList_CO_Shorting(selectedId)
	}

	// useEffect(() => {
	// 	// fetchLoanApplications()
	// }, [selectedEmployeeId])

	const setSearch = (word) => {
		// if (loanType === "S") {
		setLoanApplications(
			copyLoanApplications?.filter(
				(e) =>
					e?.prov_grp_code
						?.toString()
						?.toLowerCase()
						.includes(word?.toLowerCase()) ||
					e?.group_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase()) ||
					e?.branch_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase())
			)
		)
		// }

	// if (loanType === "R") {
	// 	setLoanApplications(
	// 		copyLoanApplications?.filter(
	// 			(e) =>
	// 				e?.form_no
	// 					?.toString()
	// 					?.toLowerCase()
	// 					.includes(word?.toLowerCase()) ||
	// 				e?.branch_name
	// 					?.toString()
	// 					?.toLowerCase()
	// 					?.includes(word?.toLowerCase()) ||
	// 				e?.member_code
	// 					?.toString()
	// 					?.toLowerCase()
	// 					?.includes(word?.toLowerCase())
	// 		)
	// 	)
	// 	}

	}

	useEffect(() => {
		setCoListData(() => [])
		fetchCoList_ID()
	}, [loanType])

	
		useEffect(() => {
	
			if (loanType === "S") {
				fetchLoanApplications_GroupWise('S')
				setSelectedEmployeeId(() => [])
				console.log('fff', 'SSSSSSSSSSSSSSS');
				
			} else if (loanType === "R") {
				fetchLoanApplications_GroupWise('R')
				console.log('fff', 'RRRRRRRRRRRRRRR');
			} else if (loanType === "A") {
				fetchLoanApplications_GroupWise('A')
				console.log('fff', 'AAAAAAAAAAAAAAAAA');
			}

		}, [loanType])

	return (
		<div>
			<Sidebar mode={1} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 h-auto my-10 mx-32">
					<Radiobtn
						data={options}
						val={loanType}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/>
					{/* <LoanApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
					/> */}

					{loanType === "S" ? (
					<>
							
					<div className="grid grid-cols-3 gap-5 mt-5">
								

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
											name: `${emp.emp_name}`,
										}))}
										mode={2}
										disabled={false} // Static value to make it always disabled
									/>

									{/* {JSON.stringify(selectedEmployeeId, 2)} */}
								</div>
							</div>

					<LoanRecovApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						loanType={loanType}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
						fetchLoanApplicationsDate={{
							selectedEmployeeId
						}}
					/>
					</>
					) : loanType === "R" ? (
						<>
							
					<div className="grid grid-cols-3 gap-5 mt-5">
								

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
											name: `${emp.emp_name}`,
										}))}
										mode={2}
										disabled={false} // Static value to make it always disabled
									/>

									{/* {JSON.stringify(selectedEmployeeId, 2)} */}
								</div>
							</div>

					<LoanApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						loanType={loanType}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
						fetchLoanApplicationsDate={{
							selectedEmployeeId
						}}
					/>

						{/* <LoanApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
						/> */}

						</>
					) : loanType === "A" ? (
						<>
							
					<div className="grid grid-cols-3 gap-5 mt-5">
								

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
											name: `${emp.emp_name}`,
										}))}
										mode={2}
										disabled={false} // Static value to make it always disabled
									/>

									{/* {JSON.stringify(selectedEmployeeId, 2)} */}
								</div>
							</div>

					<LoanApprovalApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						loanType={loanType}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
						fetchLoanApplicationsDate={{
							selectedEmployeeId
						}}
					/>

						{/* <LoanApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
						/> */}

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

export default HomeScreenMis

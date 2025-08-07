import React, { useEffect, useState } from "react"
import Sidebar from "../../Components/Sidebar"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { Spin } from "antd"
import { CheckCircleOutlined, LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons"
import LoanApplicationsTableViewBr from "../../Components/LoanApplicationsTableViewBr"
import Radiobtn from "../../Components/Radiobtn"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import LoanRecovApplicationsTableViewBr from "../../Components/LoanRecovApplicationsTableViewBr"
import LoanApprovalApplicationsTableViewBr from "../../Components/LoanApprovalApplicationsTableViewBr"
import TranceferCOPending from "../../Components/TranceferCOPending"
import TranceferCOApprove from "../../Components/TranceferCOApprove"
import { useNavigate } from "react-router-dom"

const options = [
	// {
	// 	label: "Pending",
	// 	value: "P",
	// },
	{
		label: "Approved",
		value: "A",
	}
	
	
]

function TransferCOScreen() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)
	const [loanApplications, setLoanApplications] = useState(() => [])
	const [copyLoanApplications, setCopyLoanApplications] = useState(() => [])

	const navigate = useNavigate()

	const [radioType, setRadioType] = useState("A")


	const [coListData, setCoListData] = useState(() => [])
	const [selectedEmployeeId, setSelectedEmployeeId] = useState(() => null)

	
	const fetchCoList_ID = async () => {
		setLoading(true)
		await axios
			.post(`${url}/fetch_co_brnwise`, {
				brn_code: userDetails?.brn_code,
			})
			.then((res) => {
				if (res?.data?.suc === 1) {
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
			approval_status: radioType,
			co_id: co_Id,
		}, 'fetchCoList____', co_Id, radioType);
		
		setLoading(true)
		await axios
			.post(`${url}/admin/mis_fetch_dtls_cowise`, {
				branch_code: userDetails?.brn_code,
				approval_status: radioType,
				co_id: co_Id,
			})
			.then((res) => {
				if (res?.data?.suc === 1) {
					console.log("fetchCoList____yyyyyyyyyyyyyyyyyyyyy", res?.data?.msg)
					setLoanApplications(res?.data?.msg)
					setCopyLoanApplications(res?.data?.msg)
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

	const fetchApprove_Tranceferco = async (radioType) => {
		// alert(radioType)
		setLoading(true)

		await axios
			.post(`${url}/trans_co_view`, {
						// branch_code: userDetails?.brn_code,
						flag: radioType,
						branch_code: [userDetails?.brn_code]
						})
			.then((res) => {
				if (res?.data?.suc === 1) {
					setLoanApplications(res?.data?.msg)
					setCopyLoanApplications(res?.data?.msg)

					console.log("PPPPPPPPPPPPPPPPPPPP", res?.data?.msg)
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
		setRadioType(e)
	}

	useEffect(() => {
		// fetchLoanApplications()
		// fetchCoList_ID()
	}, [])




	

	// const handleEmployeeChange = (e) => {
	// 	// Save the emp_id of the selected employee
		
	// 	console.log(e.target.value, 'oooooooooooooooo');
	// 	const selectedId = e.target.value
	// 	setSelectedEmployeeId(selectedId) // Save to state
	// 	fetchCoList_CO_Shorting(selectedId)
	// }



	const setSearch = (word) => {
		// if (radioType === "S") {
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

	

	}

	useEffect(() => {
		setCoListData(() => [])
		fetchCoList_ID()
	}, [radioType])

	
		useEffect(() => {
	
			if (radioType === "A") {
				fetchApprove_Tranceferco('A')
				setSelectedEmployeeId(() => [])
				console.log('fff', 'SSSSSSSSSSSSSSS');
				
			} else if (radioType === "P") {
				fetchApprove_Tranceferco('P')
				console.log('fff', 'RRRRRRRRRRRRRRR');
			}

		}, [radioType])

	return (
		<div>
			<Sidebar mode={1} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 h-auto my-10 mx-32" style={{marginTop:75}}>
				
					{/* <div style={{ display: "block ruby" }}>
					<Radiobtn
						data={options}
						val={radioType}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/>
					
					<button
					className={`inline-flex items-center px-4 py-2 mt-0 ml-5 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
					onClick={() => {
						navigate(`/homebm/trancefercofrom/0`, {
						// state: { approval_status: "N" },
						});
			
						}}

					>
					<PlusCircleOutlined /> <spann className={`ml-2`}>Trancefer CO Form</spann>
					</button>
					</div> */}
					
					{/* <LoanApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
					/> */}

					{radioType === "P" ? (
					<>
							
					{/* <div className="grid grid-cols-3 gap-5 mt-5">
								

								<div>
									<TDInputTemplateBr
										placeholder="Select Collector Name..."
										type="text"
										label="Collectorwise"
										name="b_clientGender"
										handleChange={handleEmployeeChange}
								
										data={coListData.map((emp) => ({
											code: emp.emp_id,
											name: `${emp.emp_name}`,
										}))}
										mode={2}
										disabled={false} // Static value to make it always disabled
									/>

								</div>
							</div> */}

					<TranceferCOPending
						flag="MIS"
						loanAppData={loanApplications}
						radioType={radioType}
						title="Approve Group Transfer"
						setSearch={(data) => setSearch(data)}
						// fetchLoanApplicationsDate={{
						// 	selectedEmployeeId
						// }}
					/>
					</>
					) : radioType === "A" ? (
						<>
							
					{/* <div className="grid grid-cols-3 gap-5 mt-5">
								

								<div>
									<TDInputTemplateBr
										placeholder="Select Collector Name..."
										type="text"
										label="Collectorwise"
										name="b_clientGender"
										handleChange={handleEmployeeChange}
										data={coListData.map((emp) => ({
											code: emp.emp_id,
											name: `${emp.emp_name}`,
										}))}
										mode={2}
										disabled={false} // Static value to make it always disabled
									/>

								</div>
							</div> */}

					<TranceferCOApprove
						flag="MIS"
						loanAppData={loanApplications}
						radioType={radioType}
						title="View Group Transfer"
						setSearch={(data) => setSearch(data)}
						// fetchLoanApplicationsDate={{
						// 	selectedEmployeeId
						// }}
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

export default TransferCOScreen

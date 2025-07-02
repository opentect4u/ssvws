import React, { useEffect, useState } from "react"
import Sidebar from "../../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../../Address/BaseUrl"
import { Message } from "../../../../Components/Message"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import EmployeeMasterTable from "../../../../Components/Master/EmployeeMasterTable"

// const options = [
// 	{
// 		label: "Pending",
// 		value: "U",
// 	},
// 	{
// 		label: "Sent to MIS",
// 		value: "S",
// 	},
// 	{
// 		label: "Approved",
// 		value: "A",
// 	},
// 	{
// 		label: "MIS Rejected",
// 		value: "R",
// 	},
// ]

function MasterEmployees() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)
	const [masterData, setMasterData] = useState(() => [])
	const [copyLoanApplications, setCopyLoanApplications] = useState(() => [])

	const [approvalStatus, setApprovalStatus] = useState("U")
	// const [value2, setValue2] = useState("S")

	const fetchLoanApplications = async (approvalStat) => {
		setLoading(true)

		// const creds = {
		// 	prov_grp_code: 0,
		// 	user_type: userDetails?.id,
		// 	branch_code: userDetails?.brn_code,
		// }

		await axios
			.get(`${url}/show_all_emp`)
			.then((res) => {
				console.log("PPPPPPPPPPPPPPPPPPPP", res?.data)
				if (res?.data?.suc === 1) {
					setMasterData(res?.data?.msg)
					setCopyLoanApplications(res?.data?.msg)

					console.log("PPPPPPPPPPPPPPPPPPPP", res?.data)
				} else {
					Message("error", "No banks found.")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching employees!")
				console.log("ERRR", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		fetchLoanApplications("U")
	}, [])

	const setSearch = (word) => {
		setMasterData(
			copyLoanApplications?.filter(
				(e) =>
					e?.emp_name
						?.toString()
						?.toLowerCase()
						.includes(word?.toLowerCase()) ||
					e?.branch_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase()) ||
					e?.emp_id?.toString()?.toLowerCase()?.includes(word?.toLowerCase()) ||
					e?.branch_id?.toString()?.toLowerCase()?.includes(word?.toLowerCase())
			)
		)
	}

	// const onChange = (e) => {
	// 	console.log("radio1 checked", e)
	// 	setApprovalStatus(e)
	// }

	useEffect(() => {
		fetchLoanApplications(approvalStatus)
	}, [approvalStatus])

	return (
		<div>
			<Sidebar mode={2} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 h-auto my-20 mx-32">
					{/* <Radiobtn data={options} val={"U"} onChangeVal={onChange1} /> */}

					{/* <Radiobtn
						data={options}
						val={approvalStatus}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/> */}
					<EmployeeMasterTable
						flag="BM"
						loanAppData={masterData}
						title="Employee Master"
						setSearch={(data) => setSearch(data)}
					/>
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

export default MasterEmployees

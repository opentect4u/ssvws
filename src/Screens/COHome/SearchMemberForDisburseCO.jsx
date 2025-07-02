import React, { useEffect, useState } from "react"
import Sidebar from "../../Components/Sidebar"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { Spin, Button } from "antd"
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons"
import LoanApplicationsTableViewBr from "../../Components/LoanApplicationsTableViewBr"
import Radiobtn from "../../Components/Radiobtn"
import LoanApplicationsDisburseTable from "../../Components/LoanApplicationsDisburseTable"

// const options = [
// 	{
// 		label: "Received",
// 		value: "S",
// 	},
// 	// {
// 	// 	label: "Approved",
// 	// 	value: "A",
// 	// },
// 	{
// 		label: "Rejected",
// 		value: "R",
// 	},
// ]

function SearchMemberForDisburseCO() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	const [searchKeywords, setSearchKeywords] = useState(() => "")
	const [loanApplications, setLoanApplications] = useState(() => [])
	const [copyLoanApplications, setCopyLoanApplications] = useState(() => [])

	const [approvalStatus, setApprovalStatus] = useState("S")

	// const fetchLoanApplications = async () => {
	// 	setLoading(true)

	// 	await axios
	// 		.get(
	// 			`${url}/admin/fetch_form_fwd_bm_web?approval_status=${approvalStatus}&branch_code=${userDetails?.brn_code}`
	// 		)
	// 		.then((res) => {
	// 			if (res?.data?.suc === 1) {
	// 				setLoanApplications(res?.data?.msg)
	// 				setCopyLoanApplications(res?.data?.msg)

	// 				console.log("PPPPPPPPPPPPPPPPPPPP", res?.data)
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

	const fetchSearchedApplication = async () => {
		setLoading(true)
		const creds = {
			member_dtls: searchKeywords,
			branch_code:userDetails.brn_code
		}
		await axios
			.post(`${url}/admin/fetch_loan_application_dtls`, creds)
			.then((res) => {
				console.log("KKKKKKKKkkkkkKKKKKkkkkKKKK", res?.data)
				setLoanApplications(res?.data?.msg)
			})
			.catch((err) => {
				Message("error", "Some error occurred while searching...")
			})
		setLoading(false)
	}

	// const setSearch = (word) => {
	// 	setLoanApplications(
	// 		copyLoanApplications?.filter(
	// 			(e) =>
	// 				e?.member_code
	// 					?.toString()
	// 					?.toLowerCase()
	// 					.includes(word?.toLowerCase()) ||
	// 				e?.form_no
	// 					?.toString()
	// 					?.toLowerCase()
	// 					?.includes(word?.toLowerCase()) ||
	// 				e?.client_name
	// 					?.toString()
	// 					?.toLowerCase()
	// 					?.includes(word?.toLowerCase())
	// 		)
	// 	)
	// }

	return (
		<div>
			<Sidebar mode={2} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-slate-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 h-auto my-10 mx-32">
					{/* <Radiobtn
						data={options}
						val={approvalStatus}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/> */}

					<div className="flex flex-row gap-3 mt-20">
						<input
							type="text"
							placeholder="Search by Member Name/Member Code/Mobile No."
							className={`bg-white border-1 border-gray-400 text-gray-800 text-sm rounded-lg ${
								userDetails?.id == 3
									? "active:border-slate-600 focus:ring-slate-600 focus:border-slate-800"
									: "active:border-slate-600 focus:ring-slate-600 focus:border-slate-800"
							} focus:border-1 duration-500 block w-full p-2 dark:bg-bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
							onChange={(e) => setSearchKeywords(e.target.value)}
						/>
						<button
							icon={<SearchOutlined />}
							iconPosition="end"
							className="bg-slate-700 text-white hover:bg-slate-800 p-5 text-center text-sm border-none rounded-lg w-36 h-10 flex justify-center items-center align-middle gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed active:ring-2 active:ring-slate-400"
							onClick={fetchSearchedApplication}
							disabled={!searchKeywords}
						>
							<SearchOutlined />
							Search
						</button>
					</div>

					<LoanApplicationsDisburseTable
						flag="CO"
						loanAppData={loanApplications}
						title="Disburse Loan"
						showSearch={false}
						// setSearch={(data) => setSearch(data)}
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

export default SearchMemberForDisburseCO

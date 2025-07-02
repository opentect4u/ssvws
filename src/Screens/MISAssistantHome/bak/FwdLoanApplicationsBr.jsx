import React, { useEffect, useState } from "react"
import { Chart } from "primereact/chart"

import { motion } from "framer-motion"
import { Segmented } from "antd"
import {
	InfoCircleOutlined,
	SettingOutlined,
	CloseOutlined,
	SolutionOutlined,
	ProjectOutlined,
	BellOutlined,
	UserAddOutlined,
	SwapOutlined,
	InboxOutlined,
	UserSwitchOutlined,
	FileSearchOutlined,
	BarChartOutlined,
	ExceptionOutlined,
} from "@ant-design/icons"
import { Flex, Progress } from "antd"
import { WidthFull } from "@mui/icons-material"
import DialogBox from "../../Components/DialogBox"
import { routePaths } from "../../Assets/Data/Routes"
import { Link } from "react-router-dom"
import Sidebar from "../../Components/Sidebar"
import LoanApplicationsTableView from "../../Components/LoanApplicationsTableView"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import LoanApplicationsTableViewBr from "../../Components/LoanApplicationsTableViewBr"

function FwdLoanApplicationsBr() {
	const location = useLocation()
	console.log(
		"LLOOCCAATTIIOONN",
		location.pathname.split("/")[location.pathname.split("/").length - 1]
	)

	var forwardIdentifier =
		location.pathname.split("/")[location.pathname.split("/").length - 1]

	const [loading, setLoading] = useState(false)
	const [loanApplications, setLoanApplications] = useState(() => [])
	const [copyLoanApplications, setCopyLoanApplications] = useState(() => [])

	const fetchLoanApplications = async () => {
		setLoading(true)
		await axios
			.get(
				`${url}/brn/fetch_brn_forward_dtls?user_id=${+JSON.parse(
					localStorage.getItem("br_mgr_details")
				)?.id}`
			)
			.then((res) => {
				if (res?.data?.suc === 1) {
					setLoanApplications(res?.data?.msg)
					setCopyLoanApplications(res?.data?.msg)

					console.log("PPPPPPPPPPPPPPPPPPPP", res?.data)
				} else {
					Message("error", "No incoming loan applications found.")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching loans!")
			})
		setLoading(false)
	}

	useEffect(() => {
		fetchLoanApplications()
	}, [])

	const setSearch = (word) => {
		setLoanApplications(
			copyLoanApplications?.filter(
				(e) =>
					e?.sl_no?.toString()?.toLowerCase().includes(word?.toLowerCase()) ||
					e?.application_no
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase()) ||
					e?.member_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase()) ||
					e?.branch_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase()) ||
					e?.loan_type_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase())
			)
		)
	}

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
					<LoanApplicationsTableViewBr
						loanAppData={loanApplications}
						title="Forward Applications"
						setSearch={(data) => setSearch(data)}
						isForwardLoan={true}
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

export default FwdLoanApplicationsBr

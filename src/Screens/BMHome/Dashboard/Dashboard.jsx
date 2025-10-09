import "./Dashboard.css"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
// import {
// 	BarChart,
// 	Bar,
// 	XAxis,
// 	YAxis,
// 	Tooltip,
// 	ResponsiveContainer,
// } from "recharts"
import axios from "axios"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import DashboardCard from "../../../Components/Dashboard/DashboardCard"
import { url } from "../../../Address/BaseUrl"
import { Alert, Button, Empty, Input, Modal, Spin, Table } from "antd"
// import { Squircle } from "@squircle-js/react"
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined"
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined"
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined"
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined"
import { Message } from "../../../Components/Message"
import { getOrdinalSuffix } from "../../../Utils/ordinalSuffix"
import moment from "moment"
import AlertComp from "../../../Components/AlertComp"

const formatINR = (num) =>
	new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 2,
	}).format(num || 0)

const formatNumber = (num) => new Intl.NumberFormat("en-IN").format(num || 0)

// const collectionMonthly = [
// 	{ month: "Jan", disbursement: 300, recovery: 250 },
// 	{ month: "Feb", disbursement: 350, recovery: 300 },
// 	{ month: "Mar", disbursement: 400, recovery: 360 },
// 	{ month: "Apr", disbursement: 450, recovery: 410 },
// 	{ month: "May", disbursement: 380, recovery: 340 },
// 	{ month: "Jun", disbursement: 420, recovery: 380 },
// 	{ month: "Jul", disbursement: 500, recovery: 460 },
// 	{ month: "Aug", disbursement: 430, recovery: 390 },
// 	{ month: "Sep", disbursement: 410, recovery: 370 },
// 	{ month: "Oct", disbursement: 480, recovery: 440 },
// 	{ month: "Nov", disbursement: 460, recovery: 420 },
// 	{ month: "Dec", disbursement: 470, recovery: 430 },
// ]

// const collectionYearly = [
// 	{ month: "2019", disbursement: 3000, recovery: 2700 },
// 	{ month: "2020", disbursement: 3500, recovery: 3200 },
// 	{ month: "2021", disbursement: 4000, recovery: 3700 },
// 	{ month: "2022", disbursement: 4500, recovery: 4200 },
// 	{ month: "2023", disbursement: 4800, recovery: 4500 },
// ]
const columns = [
  {
    title: 'ID',
    dataIndex: 'co_id',
    key: 'co_id',
	sorter: (a, b) => a.co_id.toString().localeCompare(b.co_id.toString()),
  },
  {
    title: 'Name',
    dataIndex: 'emp_name',
    key: 'emp_name',
	sorter: (a, b) => a.emp_name.localeCompare(b.emp_name),
  },
  {
    title: 'Amount',
    dataIndex: 'od_amt',
    key: 'od_amt',
	sorter: (a, b) => a.od_amt - b.od_amt,
  },
  {
    title: 'No. Of Groups',
    dataIndex: 'group_count',
    key: 'group_count',
	sorter: (a, b) => a.group_count - b.group_count,
   },
  
];

export default function Dashboard() {
	const [monthlyOverdueDemand,setMonthlyOverdueDemand] = useState([])
	const [isOverdueLoadingPending,setOverdueLoadingPendingStatus] = useState(false);
	  const [searchText, setSearchText] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [odDtls,setOdDtls] = useState(() => {})
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || {}
	const type = userDetails.id === 2 ? "BM" : "Admin 2"
	const branchId = userDetails?.brn_code

	const [loading, setLoading] = useState(() => false)
	const [loadingLong, setLoadingLong] = useState(() => false)
	const [loadingOd, setLoadingOd] = useState(() => false)
	const [loadingDmd, setLoadingDmd] = useState(() => false)

	const [loadingDmd_m_d_w, setLoadingDmd_m_d_w] = useState(() => false)
	
	const [branches, setBranches] = useState(() => [])
	const [choosenBranch, setChoosenBranch] = useState(() =>
		+branchId === 100 ? "100" : branchId
	)

	// const [view, setView] = useState("Monthly")
	// const data = view === "Monthly" ? collectionMonthly : collectionYearly
	// const data = collectionMonthly
	const [grtPeriod, setGrtPeriod] = useState("Today")
	const [choosenGraphYear, setChoosenGraphYear] = useState("A")

	const [dateOfOperation, setDateOfOperation] = useState("")
	const [grtDataToday, setGrtDataToday] = useState([
		{ label: "Pending", value: 0, color: "bg-orange-300" },
		{ label: "Sent to MIS", value: 0, color: "bg-blue-300" },
		{ label: "Approved", value: 0, color: "bg-green-300" },
		{ label: "Rejected", value: 0, color: "bg-red-300" },
	])
	const [grtDataMonth, setGrtDataMonth] = useState([...grtDataToday])
	const [activeGroupsCount, setActiveGroupsCount] = useState("")
	const [totalGroupsCount, setTotalGroupsCount] = useState("")
	const [activeUsersCount, setActiveUsersCount] = useState("")
	const [activeUsers, setActiveUsers] = useState([])

	const [disbursedLoanDetailCountsToday, setDisbursedLoanDetailCountsToday] =
		useState({
			data: "",
			noOfGroups: "",
		})
	const [disbursedLoanDetailCountsMonth, setDisbursedLoanDetailCountsMonth] =
		useState({
			data: "",
			noOfGroups: "",
		})

	const [collectedLoanDetailCountsToday, setCollectedLoanDetailCountsToday] =
		useState({
			data: "",
			noOfGroups: "",
		})
	const [collectedLoanDetailCountsMonth, setCollectedLoanDetailCountsMonth] =
		useState({
			data: "",
			noOfGroups: "",
		})

	const [unapprovedTxnsDetailCountsTotal, setUnapprovedTxnsDetailCountsTotal] =
		useState({
			data: "",
			noOfGroups: "",
		})

	const [unapprovedTransfers, setUnapprovedTransfers] = useState({
		noOfMembers: "",
		noOfGroups: "",
	})
	// const [unapprovedTxnsDetailCountsMonth, setUnapprovedTxnsDetailCountsMonth] =
	// 	useState({
	// 		data: "",
	// 		noOfGroups: "",
	// 	})

	// od
	const [odFlags, setOdFlags] = useState({
		id: 0,
		flag: "M",
		recovDay: "",
	}) // M, D, W
	const [odDetails, setOdDetails] = useState({
		data: "",
		noOfGroups: "",
	})

	// dmd
	const [dmdFlags, setDmdFlags] = useState({
		id: 0,
		flag: "M",
		recovDay: "",
	}) // M, D, W
	const [dmdDetails, setDmdDetails] = useState({
		data: "",
		noOfGroups: "",
	})


	const [odDetails_m, setOdDetails_m] = useState({
		data: "",
		noOfGroups: "",
	})

	const [odDetails_d, setOdDetails_d] = useState({
		data: "",
		noOfGroups: "",
	})

	const [odDetails_w, setOdDetails_w] = useState({
		data: "",
		noOfGroups: "",
	})


	const [dmdDetails_m, setDmdDetails_m] = useState({
		data: "",
		noOfGroups: "",
	})
	const [dmdDetails_d, setDmdDetails_d] = useState({
		data: "",
		noOfGroups: "",
	})
	const [dmdDetails_w, setDmdDetails_w] = useState({
		data: "",
		noOfGroups: "",
	})







	const [demandFlag, setDemandFlag] = useState(() => 0)

	const activeGrtData = grtPeriod === "Today" ? grtDataToday : grtDataMonth

	const getBranchCodes = () => {
		if (+choosenBranch === 100) return branches.map((b) => b.code)
		return [+choosenBranch]
	}
	const showModal = () => setIsModalOpen(true);
	const handleOk = () => setIsModalOpen(false);
  	const handleCancel = () => setIsModalOpen(false);
	const fetchBranches = async () => {
		setLoading(true)
		try {
			const res = await axios.get(`${url}/admin/fetch_branch`)
			setBranches(
				res.data.msg.map((item) => ({
					code: item.branch_code,
					name: `${item.branch_name} (${item.branch_code})`,
				}))
			)
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchTotalGrtDetails = async (flag) => {
		setLoading(true)
		try {
			const creds = { flag, branch_code: getBranchCodes() }
			const res = await axios.post(
				`${url}/admin/dashboard_tot_grt_details`,
				creds
			)
			const baseData = [
				{
					label: "Pending",
					value: res.data.data.tot_pending,
					color: "bg-orange-300",
				},
				{
					label: "Sent to MIS",
					value: res.data.data.tot_send_mis,
					color: "bg-blue-300",
				},
				{
					label: "Approved",
					value: res.data.data.tot_approved,
					color: "bg-green-300",
				},
				{
					label: "Rejected",
					value: res.data.data.tot_rejected,
					color: "bg-red-300",
				},
			]
			flag === "Today" ? setGrtDataToday(baseData) : setGrtDataMonth(baseData)
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchActiveGroups = async () => {
		setLoading(true)
		try {
			const creds = { branch_code: getBranchCodes() }
			const res = await axios.post(`${url}/admin/dashboard_active_group`, creds)
			setActiveGroupsCount(res.data.data.tot_active_grp || 0)
			setTotalGroupsCount(res.data.data.tot_group)
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchUserLoggedInDetails = async () => {
		setLoading(true)
		try {
			const creds = { branch_code: getBranchCodes() }
			const res = await axios.post(
				`${url}/admin/dshboard_user_logged_in_details`,
				creds
			)
			setActiveUsersCount(res?.data?.data?.tot_user_active)
			setActiveUsers(res?.data?.data?.active_user)
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchLoanDisbursedDetailsToday = async () => {
		setLoading(true)
		try {
			const creds = { flag: "Today", branch_code: getBranchCodes() }
			const res = await axios.post(
				`${url}/admin/dashboard_tot_loan_disbursed_dtls`,
				creds
			)
			setDisbursedLoanDetailCountsToday({
				data: res?.data?.data?.total_loan_disbursed,
				noOfGroups: res?.data?.data?.total_grp_loan_disbursed,
			})
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchLoanDisbursedDetailsThisMonth = async () => {
		setLoading(true)
		try {
			const creds = { flag: "Month", branch_code: getBranchCodes() }
			const res = await axios.post(
				`${url}/admin/dashboard_tot_loan_disbursed_dtls`,
				creds
			)
			setDisbursedLoanDetailCountsMonth({
				data: res?.data?.data?.total_loan_disbursed,
				noOfGroups: res?.data?.data?.total_grp_loan_disbursed,
			})
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchLoanCollectedDetailsToday = async () => {
		setLoading(true)
		try {
			const creds = { flag: "Today", branch_code: getBranchCodes() }
			const res = await axios.post(
				`${url}/admin/dashboard_tot_loan_recov_dtls`,
				creds
			)
			setCollectedLoanDetailCountsToday({
				data: res?.data?.data?.total_loan_recovery,
				noOfGroups: res?.data?.data?.total_grp_loan_recovery,
			})
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchLoanCollectedDetailsThisMonth = async () => {
		setLoading(true)
		try {
			const creds = { flag: "Month", branch_code: getBranchCodes() }
			const res = await axios.post(
				`${url}/admin/dashboard_tot_loan_recov_dtls`,
				creds
			)
			setCollectedLoanDetailCountsMonth({
				data: res?.data?.data?.total_loan_recovery,
				noOfGroups: res?.data?.data?.total_grp_loan_recovery,
			})
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchUnapprovedTxnsTotal = async () => {
		setLoadingLong(true)
		try {
			const creds = { branch_code: getBranchCodes() }
			const res = await axios.post(
				`${url}/admin/dashboard_tot_loan_unapprove_dtls`,
				creds
			)
			setUnapprovedTxnsDetailCountsTotal({
				data: res?.data?.data?.total_loan_unapprove,
				noOfGroups: res?.data?.data?.total_group_unapprove,
			})
		} catch (err) {
		} finally {
			setLoadingLong(false)
		}
	}

	const fetchUnapprovedTransfers = async () => {
		setLoadingLong(true)
		try {
			const creds = { branch_code: getBranchCodes() }
			const res = await axios.post(
				`${url}/admin/show_unapproved_grp_memb_transfer`,
				creds
			)
			setUnapprovedTransfers({
				noOfGroups: res?.data?.data?.total_unapprove_group_transfer,
				noOfMembers: res?.data?.data?.total_unapprove_member_transfer,
			})
		} catch (err) {
		} finally {
			setLoadingLong(false)
		}
	}

	// const fetchUnapprovedTxnsMonth = async () => {
	// 	setLoading(true)
	// 	try {
	// 		const creds = { flag: "Month", branch_code: getBranchCodes() }
	// 		const res = await axios.post(
	// 			`${url}/admin/dashboard_tot_loan_unapprove_dtls`,
	// 			creds
	// 		)
	// 		setUnapprovedTxnsDetailCountsMonth({
	// 			data: res?.data?.data?.total_loan_unapprove,
	// 			noOfGroups: res?.data?.data?.total_group_unapprove,
	// 		})
	// 	} catch {
	// 	} finally {
	// 		setLoading(false)
	// 	}
	// }

	const fetchDateOfOperation = async () => {
		setLoading(true)
		try {
			const creds = { branch_code: getBranchCodes()[0] }
			const res = await axios.post(`${url}/admin/date_of_operation`, creds)
			console.log(res?.data?.data?.date_of_operation, 'dataaaaaaaa');
			
			setDateOfOperation(res?.data?.data?.date_of_operation)
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const filteredData = monthlyOverdueDemand.filter((item) =>
		Object.values(item).some((value) =>
		String(value).toLowerCase().includes(searchText.toLowerCase())
		)
	);

	// const fetchCODashboardDetails = async (flag) => {
	// 	setLoading(true)
	// 	try {
	// 		const creds = {
	// 			flag,
	// 			branch_code: getBranchCodes()[0],
	// 			emp_id: userDetails?.emp_id,
	// 		}
	// 		const res = await axios.post(`${url}/admin/co_dashboard_dtls`, creds)
	// 		// setDateOfOperation(res?.data?.data?.date_of_operation)
	// 		setDashboardDetailsCO(res?.data?.data?.dashboard_dt)
	// 	} catch {
	// 	} finally {
	// 		setLoading(false)
	// 	}
	// }

	// CO Start
	const fetchCOTotalGrtDetails = async (flag) => {
		setLoading(true)
		try {
			const creds = {
				flag,
				branch_code: getBranchCodes()[0],
				emp_id: userDetails?.emp_id,
			}
			const res = await axios.post(`${url}/admin/co_dashboard_dtls`, creds)
			const baseData = [
				{
					label: "Pending",
					value: res.data.data.tot_pending_co,
					color: "bg-orange-300",
				},
				{
					label: "Sent to MIS",
					value: res.data.data.tot_send_mis_co,
					color: "bg-blue-300",
				},
				{
					label: "Approved",
					value: res.data.data.tot_approved_co,
					color: "bg-green-300",
				},
				{
					label: "Rejected",
					value: res.data.data.tot_rejected_co,
					color: "bg-red-300",
				},
			]
			flag === "Today" ? setGrtDataToday(baseData) : setGrtDataMonth(baseData)
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchActiveGroupsCO = async () => {
		setLoading(true)
		try {
			const creds = {
				co_id: userDetails?.emp_id,
				branch_code: getBranchCodes()[0],
			}
			const res = await axios.post(
				`${url}/admin/co_dashboard_active_group`,
				creds
			)
			setActiveGroupsCount(res.data.data.tot_active_grp || 0)
			setTotalGroupsCount(res.data.data.co_total_group)
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchUserLoggedInDetailsCO = async () => {
		setLoading(true)
		try {
			const creds = {
				branch_code: getBranchCodes()[0],
				co_id: userDetails?.emp_id,
			}
			const res = await axios.post(
				`${url}/admin/co_dashboard_user_logged_in_details`,
				creds
			)
			setActiveUsersCount(res?.data?.data?.co_tot_user_active)
			setActiveUsers(res?.data?.data?.co_active_user)
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchLoanDisbursedDetailsTodayCO = async () => {
		setLoading(true)
		try {
			const creds = {
				flag: "Today",
				branch_code: getBranchCodes()[0],
				co_id: userDetails?.emp_id,
			}
			const res = await axios.post(
				`${url}/admin/co_dashboard_tot_loan_disbursed_dtls`,
				creds
			)
			setDisbursedLoanDetailCountsToday({
				data: res?.data?.data?.co_total_loan_disbursed,
				noOfGroups: res?.data?.data?.co_total_grp_loan_disbursed,
			})
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchLoanDisbursedDetailsThisMonthCO = async () => {
		setLoading(true)
		try {
			const creds = {
				flag: "Today",
				branch_code: getBranchCodes()[0],
				co_id: userDetails?.emp_id,
			}
			const res = await axios.post(
				`${url}/admin/dashboard_tot_loan_disbursed_dtls`,
				creds
			)
			setDisbursedLoanDetailCountsMonth({
				data: res?.data?.data?.co_total_loan_disbursed,
				noOfGroups: res?.data?.data?.co_total_grp_loan_disbursed,
			})
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchLoanCollectedDetailsTodayCO = async () => {
		setLoading(true)
		try {
			const creds = {
				flag: "Today",
				branch_code: getBranchCodes()[0],
				co_id: userDetails?.emp_id,
			}
			const res = await axios.post(
				`${url}/admin/co_dashboard_tot_loan_recov_dtls`,
				creds
			)
			setCollectedLoanDetailCountsToday({
				data: res?.data?.data?.co_total_loan_recovery,
				noOfGroups: res?.data?.data?.co_total_grp_loan_recovery,
			})
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchLoanCollectedDetailsThisMonthCO = async () => {
		setLoading(true)
		try {
			const creds = {
				flag: "Today",
				branch_code: getBranchCodes()[0],
				co_id: userDetails?.emp_id,
			}
			const res = await axios.post(
				`${url}/admin/co_dashboard_tot_loan_recov_dtls`,
				creds
			)
			setCollectedLoanDetailCountsMonth({
				data: res?.data?.data?.co_total_loan_recovery,
				noOfGroups: res?.data?.data?.co_total_grp_loan_recovery,
			})
		} catch {
		} finally {
			setLoading(false)
		}
	}

	const fetchUnapprovedTxnsTotalCO = async () => {
		setLoadingLong(true)
		try {
			const creds = {
				branch_code: getBranchCodes()[0],
				co_id: userDetails?.emp_id,
			}
			const res = await axios.post(
				`${url}/admin/co_dashboard_tot_loan_unapprove_dtls`,
				creds
			)
			setUnapprovedTxnsDetailCountsTotal({
				data: res?.data?.data?.co_total_loan_unapprove,
				noOfGroups: res?.data?.data?.co_total_group_unapprove,
			})
		} catch (err) {
		} finally {
			setLoadingLong(false)
		}
	}

	// useEffect(()=>{
	// 		console.log(odDetails)
	// },[odDetails])

	const fetchOverdueDetails = async () => {
		setLoadingOd(true)
		try {
			const creds = {
				flag: odFlags.flag,
				branch_code: getBranchCodes(),
				recov_day: odFlags.recovDay,
			}
			const res = await axios.post(`${url}/admin/dashboard_overdue_dtls`, creds);
			console.log(res);
			console.log(odFlags.flag, "OD FLAG");
			console.log(res?.data?.data?.total_loan_od, 'll', moment().format("DD-MM-YYYY"), 'dataaaaaaaa');
			
			setOdDetails(
				odFlags.flag === "M"
					? {
							data: res?.data?.data?.total_loan_od,
							noOfGroups: res?.data?.data?.total_overdue_groups,
					  }
					: odFlags.flag === "D"
					? {
							data: res?.data?.data?.monthly_loan_od,
							noOfGroups: res?.data?.data?.monthly_overdue_groups,
					  }
					: odFlags.flag === "W"
					? {
							data: res?.data?.data?.weekly_loan_od,
							noOfGroups: res?.data?.data?.weekly_overdue_groups,
					  }
					: {
							data: "",
							noOfGroups: "",
					  }
			)

			if(odFlags.flag == 'M'){
				setOdDtls({
					data: res?.data?.data?.total_loan_od,
					noOfGroups: res?.data?.data?.total_overdue_groups,
					date: moment().subtract(1, 'M').format("MMM YYYY"),
					// date: dateOfOperation,
				})
			}
			
		} catch {
		} finally {
			setLoadingOd(false)
		}
	}

	const fetchOverdueDetailsForAllBranches = async (para) => {
		setLoadingOd(true)
		try {
			const creds = {
				flag: odFlags.flag,
				branch_code: getBranchCodes(),
				recov_day: odFlags.recovDay,
			}


			const endpoint = para === 'sub' ? `${url}/admin/dashboard_overdue_dtls` : `${url}/admin/dashboard_overdue_amt_fr_allbrn`;

			const res = await axios.post(endpoint, creds)

			
			setOdDetails(
				odFlags.flag === "M"
					? {
							data: res?.data?.data?.total_loan_od,
							noOfGroups: res?.data?.data?.total_overdue_groups,
					  }
					: odFlags.flag === "D"
					? {
							data: res?.data?.data?.monthly_loan_od,
							noOfGroups: res?.data?.data?.monthly_overdue_groups,
					  }
					: odFlags.flag === "W"
					? {
							data: res?.data?.data?.weekly_loan_od,
							noOfGroups: res?.data?.data?.weekly_overdue_groups,
					  }
					: {
							data: "",
							noOfGroups: "",
					  }
					  
			)
			if(odFlags.flag == 'M'){
				setOdDtls({
					data: res?.data?.data?.total_loan_od,
					noOfGroups: res?.data?.data?.total_overdue_groups,
					date: moment().subtract(1, 'M').format("MMM YYYY"),
					// date: dateOfOperation,
				})
			}
		} catch {
		} finally {
			setLoadingOd(false)
		}
	}

	const fetchOverdueDetailsForAllBranches__m = async (para) => {
		setLoadingOd(true)
		try {
			const creds = {
				flag: "M",
				branch_code: getBranchCodes(),
				recov_day: "",
			}

			const endpoint = para === 'sub' ? `${url}/admin/dashboard_overdue_dtls` : `${url}/admin/dashboard_overdue_amt_fr_allbrn`;

			const res = await axios.post(endpoint, creds)

			// const res = await axios.post(
			// 	`${url}/admin/dashboard_overdue_amt_fr_allbrn`,
			// 	creds
			// )

			// console.log(res?.data?.data?.total_loan_od, 'll', res?.data?.data?.total_overdue_groups, 'lll', moment().subtract(1, 'M').format("MMM YYYY"), 'dataaaaaaaa');
			
			setOdDetails_m(
					{
					data: res?.data?.data?.total_loan_od,
					noOfGroups: res?.data?.data?.total_overdue_groups,
					}
					  
			)
			if(odFlags.flag == 'M'){
				setOdDtls({
					data: res?.data?.data?.total_loan_od,
					noOfGroups: res?.data?.data?.total_overdue_groups,
					date: moment().subtract(1, 'M').format("MMM YYYY"),
					// date: dateOfOperation,
				})
			}
		} catch {
		} finally {
			setLoadingOd(false)
		}
	}

	const fetchOverdueDetailsForAllBranches__d = async (para) => {
		setLoadingOd(true)
		try {
			const creds = {
				flag: "D",
				branch_code: getBranchCodes(),
				recov_day: new Date().getDate(),
			}

			const endpoint = para === 'sub' ? `${url}/admin/dashboard_overdue_dtls` : `${url}/admin/dashboard_overdue_amt_fr_allbrn`;

			const res = await axios.post(endpoint, creds)


			// const res = await axios.post(
			// 	`${url}/admin/dashboard_overdue_amt_fr_allbrn`,
			// 	creds
			// )

			console.log(res?.data?.data?.total_loan_od, 'll', res?.data?.data?.total_overdue_groups, 'lll', moment().subtract(1, 'M').format("MMM YYYY"), 'dataaaaaaaa');
			
			setOdDetails_d(
				{
				data: res?.data?.data?.monthly_loan_od,
				noOfGroups: res?.data?.data?.monthly_overdue_groups,
				}
					  
			)
			if(odFlags.flag == 'M'){
				setOdDtls({
					data: res?.data?.data?.total_loan_od,
					noOfGroups: res?.data?.data?.total_overdue_groups,
					date: moment().subtract(1, 'M').format("MMM YYYY"),
					// date: dateOfOperation,
				})
			}
		} catch {
		} finally {
			setLoadingOd(false)
		}
	}

	const fetchOverdueDetailsForAllBranches__w = async (para) => {
		setLoadingOd(true)
		try {
			const creds = {
				flag: "W",
				branch_code: getBranchCodes(),
				recov_day: new Date().getDay() + 1,
			}

			const endpoint = para === 'sub' ? `${url}/admin/dashboard_overdue_dtls` : `${url}/admin/dashboard_overdue_amt_fr_allbrn`;

			const res = await axios.post(endpoint, creds)

			// const res = await axios.post(
			// 	`${url}/admin/dashboard_overdue_amt_fr_allbrn`,
			// 	creds
			// )

			console.log(res?.data?.data?.total_loan_od, 'll', res?.data?.data?.total_overdue_groups, 'lll', moment().subtract(1, 'M').format("MMM YYYY"), 'dataaaaaaaa');
			
			setOdDetails_w(
			{
			data: res?.data?.data?.weekly_loan_od,
			noOfGroups: res?.data?.data?.weekly_overdue_groups,
			}
			)
			if(odFlags.flag == 'M'){
				setOdDtls({
					data: res?.data?.data?.total_loan_od,
					noOfGroups: res?.data?.data?.total_overdue_groups,
					date: moment().subtract(1, 'M').format("MMM YYYY"),
					// date: dateOfOperation,
				})
			}
		} catch {
		} finally {
			setLoadingOd(false)
		}
	}

	const generateDemandData = async (para) => {

		// console.log(getBranchCodes()[0], 'branch changed', 'llll', getBranchCodes(), para);
		
		setLoadingDmd(true)
		setLoadingDmd_m_d_w(true)
		try {
			const creds_sub = {
				branch_code: getBranchCodes()[0],
			}

			const creds_main = {
				branch_code: getBranchCodes(),
			}

			let res;

			// ✅ Conditional API call based on 'para'
			if (para === 'sub') {
			res = await axios.post(`${url}/admin/dashboard_generate_dmd`, creds_sub);
			} else {
			res = await axios.post(`${url}/admin/dashboard_demand_amt_fr_allbrn`, creds_main);
			}

			setDemandFlag(res?.data?.data[0]?.result?.suc)

			if (res?.data?.data[0]?.result?.suc === 1){
				
				fetchDemandDetails__m()
				fetchDemandDetails__d()
				fetchDemandDetails__w()
			}
			
		} catch {
		} finally {
			setLoadingDmd(false)
		}
	}

	const fetchDemandDetails = async () => {
		setLoadingDmd(true)
		// alert(dmdFlags?.flag, dmdFlags?.recovDay)
		console.log(dmdFlags?.flag, 'DEMAND GEN', dmdFlags);
		
		try {
			const creds = {
				flag: dmdFlags.flag,
				branch_code: getBranchCodes(),
				recov_day: dmdFlags.recovDay,
			}
			const res = await axios.post(`${url}/admin/dashboard_demand_dtls`, creds)
			setDmdDetails(
				dmdFlags.flag === "M"
					? {
							data: res?.data?.data?.total_loan_dmd,
							noOfGroups: res?.data?.data?.total_demand_groups,
					  }
					: dmdFlags.flag === "D"
					? {
							data: res?.data?.data?.monthly_loan_dmd,
							noOfGroups: res?.data?.data?.monthly_demand_groups,
					  }
					: dmdFlags.flag === "W"
					? {
							data: res?.data?.data?.weekly_loan_dmd,
							noOfGroups: res?.data?.data?.weekly_demand_groups,
					  }
					: {
							data: "",
							noOfGroups: "",
					  }
			);
		} catch {
		} finally {
			setLoadingDmd(false)
		}
	}


	const fetchDemandDetails__m = async (para) => {
		setLoadingDmd_m_d_w(true)
		
		try {
			const creds = {
				flag: "M",
				branch_code: getBranchCodes(),
				recov_day: "",
			}


			const endpoint = para === 'sub' ? `${url}/admin/dashboard_demand_dtls` : `${url}/admin/dashboard_demand_amt_fr_allbrn`;

			const res = await axios.post(endpoint, creds)

			console.log(res?.data?.data, 'll', res?.data?.data?.total_demand_groups, 'ttttttttttttttttttttt');
			

			setDmdDetails_m(
				      {
							data: res?.data?.data?.total_loan_dmd,
							noOfGroups: res?.data?.data?.total_demand_groups,
					  }
			);
			// fetchDemandDetails__d()
		} catch {
		} finally {
			setLoadingDmd_m_d_w(false)
		}
	}

	const fetchDemandDetails__d = async (para) => {
		setLoadingDmd_m_d_w(true)
		
		try {
			const creds = {
				// flag: dmdFlags.flag,
				flag: "D",
				branch_code: getBranchCodes(),
				// recov_day: dmdFlags.recovDay,
				recov_day: new Date().getDate(),
			}

			const endpoint = para === 'sub' ? `${url}/admin/dashboard_demand_dtls` : `${url}/admin/dashboard_demand_amt_fr_allbrn`;

			const res = await axios.post(endpoint, creds)

			console.log(res?.data?.data, 'll', res?.data?.data?.total_demand_groups, 'ttttttttttttttttttttt');
			
			setDmdDetails_d(
				      {
							data: res?.data?.data?.monthly_loan_dmd,
							noOfGroups: res?.data?.data?.monthly_demand_groups
					  }
			);
			// fetchDemandDetails__w()
		} catch {
		} finally {
			setLoadingDmd_m_d_w(false)
		}
	}

	const fetchDemandDetails__w = async (para) => {
		setLoadingDmd_m_d_w(true)
		
		try {
			const creds = {
				flag: "W",
				branch_code: getBranchCodes(),
				recov_day: new Date().getDay() + 1,
			}

			const endpoint = para === 'sub' ? `${url}/admin/dashboard_demand_dtls` : `${url}/admin/dashboard_demand_amt_fr_allbrn`;

			const res = await axios.post(endpoint, creds)

			console.log(res?.data?.data, 'll', res?.data?.data?.total_demand_groups, 'ttttttttttttttttttttt');

			setDmdDetails_w(
				      {
							data: res?.data?.data?.weekly_loan_dmd,
							noOfGroups: res?.data?.data?.weekly_demand_groups,
					  }
			);
		} catch {
		} finally {
			setLoadingDmd_m_d_w(false)
		}
	}

	useEffect(() => {
		fetchBranches()

	}, [])

	useEffect(() => {
		if (branches.length) {
			fetchDateOfOperation()
			if (+userDetails?.id === 1) {
				fetchCOTotalGrtDetails(grtPeriod !== "Today" ? "Month" : "Today")
				fetchActiveGroupsCO()
				fetchUserLoggedInDetailsCO()
				fetchLoanDisbursedDetailsTodayCO()
				fetchLoanDisbursedDetailsThisMonthCO()
				fetchLoanCollectedDetailsTodayCO()
				fetchLoanCollectedDetailsThisMonthCO()
				fetchUnapprovedTxnsTotalCO()
			} else {
				fetchTotalGrtDetails(grtPeriod !== "Today" ? "Month" : "Today")
				fetchActiveGroups()
				fetchUserLoggedInDetails()
				fetchLoanDisbursedDetailsToday()
				fetchLoanDisbursedDetailsThisMonth()
				fetchLoanCollectedDetailsToday()
				fetchLoanCollectedDetailsThisMonth()
				fetchUnapprovedTxnsTotal()
				fetchUnapprovedTransfers()
				// fetchUnapprovedTxnsMonth()
			}
		}
	}, [grtPeriod, choosenBranch, branches])

	useEffect(() => {
		if (branches.length) {
				console.log(choosenBranch)

			if (+choosenBranch !== 100) {
				// fetchOverdueDetails()
				fetchOverdueDetailsForAllBranches('sub')
				fetchOverdueDetailsForAllBranches__m('sub')
				fetchOverdueDetailsForAllBranches__d('sub')
				fetchOverdueDetailsForAllBranches__w('sub')

				// generateDemandData('sub')

				fetchDemandDetails__m('sub')
				fetchDemandDetails__d('sub')
				fetchDemandDetails__w('sub')

			} else {
				fetchOverdueDetailsForAllBranches('main')

				fetchOverdueDetailsForAllBranches__m('main')
				fetchOverdueDetailsForAllBranches__d('main')
				fetchOverdueDetailsForAllBranches__w('main')

				// generateDemandData('main')

				fetchDemandDetails__m('main')
				fetchDemandDetails__d('main')
				fetchDemandDetails__w('main')
			}
		}
	}, [odFlags, choosenBranch, branches])

	useEffect(() => {
		if (branches.length) {
			if (demandFlag === 1) {
				// fetchDemandDetails()
			}
		}

	}, [dmdFlags])




	const handleBranchChange = (e) => {
		// console.log(e.target.value, 'branch changed');
		setChoosenBranch(e.target.value)
	}
	const handleGraphYearChange = (e) => setChoosenGraphYear(e.target.value)
	const showCoWiseBreadkup = () =>{
			try{
				setOverdueLoadingPendingStatus(true);
				setMonthlyOverdueDemand([]);
				const payLoad = {
					flag: odFlags.flag,
					branch_code: getBranchCodes(),
					recov_day: odFlags.recovDay
				}
				axios.post(`${url}/admin/dashboard_cowise_overdue_amt`,payLoad).then(res =>{
						setOverdueLoadingPendingStatus(false);
						showModal(res?.data?.suc == 1)
						if(res?.data?.suc == 1){
							setMonthlyOverdueDemand(res?.data?.msg)
						}
				}).catch(err=>{
					setOverdueLoadingPendingStatus(false);
					Message('error','We are unable to process your request!! Please try again later')
				})
			}
			catch(err){
				setOverdueLoadingPendingStatus(false);
				Message('error','We are unable to process your request!! Please try again later')
			}
	}
	return (
		<div className="p-8 space-y-6 bg-slate-50 min-h-screen rounded-3xl">
			{
				(odDtls && odDtls?.noOfGroups > 0) && <AlertComp
					msg={<p className="text-3xl font-normal"><span className="text-lg ">Total OD as on 
					{/* {odDtls?.date}  */}
					{' '+ dateOfOperation + ' '} 
					for {odDtls?.noOfGroups} group is </span>{formatINR(odDtls?.data)}</p>}
				/>
			}
			<div className="flex flex-col md:flex-row justify-between items-center">
				<h1 className="text-2xl font-bold text-slate-700 uppercase">
					Welcome back,{" "}
					<span className="text-slate-600 text-2xl font-thin">
						{userDetails?.emp_name}
					</span>{" "}
					:{" "}
					<span className="text-slate-600 text-2xl font-thin">
						{userDetails?.branch_name}
					</span>
				</h1>
				<h1 className="text-2xl font-bold text-slate-700 uppercase">
					<Spin spinning={loading}>
						Date of operation :{" "}
						<span className="text-slate-600 text-2xl font-thin">
							{+choosenBranch === 100
								? new Date().toLocaleDateString("en-GB")
								: dateOfOperation}
						</span>
					</Spin>
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

			{/* {+userDetails?.id !== 1 && ( */}
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
						<Spin spinning={loading}>
							<div key={item.label} className="flex items-center">
								<span className="w-40 text-sm text-slate-600">
									{item.label}
								</span>
								<div className="flex-1 bg-slate-100 h-4 rounded-full mx-4 overflow-hidden relative">
									<motion.div
										className={`${item.color} h-4`}
										style={{ clipPath: "inset(0 round 999px)" }}
										initial={{ width: 0 }}
										animate={{ width: `${(item.value / 300) * 100}%` }}
										transition={{
											duration: 0.6,
											ease: [0.7, 0.0, 0.3, 1.0],
										}}
									/>
								</div>
								<span className="text-slate-800 font-semibold">
									{item.value?.toLocaleString()}
								</span>
							</div>
						</Spin>
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
					<Spin spinning={loading}>
						<span className="text-3xl font-bold text-slate-800">
							{formatNumber(activeGroupsCount)}
						</span>
					</Spin>
					<span className="text-sm text-slate-600 mt-1">
						Total Groups • {formatNumber(totalGroupsCount)}
					</span>
				</div>

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
							<Spin spinning={loading}>
								<span className="text-3xl font-bold text-slate-800">
									{new Intl.NumberFormat("en-IN").format(activeUsersCount || 0)}
								</span>
							</Spin>
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
							{activeUsers.length !== 0 ? (
								<div className="w-full max-h-[160px] overflow-auto">
									<ul className="max-w-md space-y-1 text-slate-600 list-inside dark:text-slate-400">
										{activeUsers?.map((user, i) => (
											<>
												<li className="flex items-center">
													{user?.user_status === "A" ? (
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
													{user?.emp_name} - {user?.emp_id}
												</li>
												<hr className="border-t border-purple-200 my-2 w-3/4" />
											</>
										))}
									</ul>
								</div>
							) : (
								<Empty />
							)}
						</div>
					</div>
				</div>
			</div>
			{/* )} */}

			{/* {+userDetails?.id !== 1 && ( */}
			<div className="grid grid-cols-1 md:grid-cols-6 gap-6">
				<DashboardCard
					titleLeft="Loan Disbursed"
					left1Data={{
						label: "This Month",
						value: formatINR(disbursedLoanDetailCountsMonth.data),
					}}
					left2Data={{
						label: "Today",
						value: formatINR(disbursedLoanDetailCountsToday.data),
					}}
					right1Data={{
						label: "No. of Groups",
						value: formatNumber(disbursedLoanDetailCountsMonth.noOfGroups),
					}}
					right2Data={{
						label: "No. of Groups",
						value: formatNumber(disbursedLoanDetailCountsToday.noOfGroups),
					}}
					leftColor="#DB2777"
					rightColor="#334155"
					loading={loading}
				/>

				<DashboardCard
					titleLeft="Loan Collected"
					left1Data={{
						label: "This Month",
						value: formatINR(collectedLoanDetailCountsMonth.data),
					}}
					left2Data={{
						label: "Today",
						value: formatINR(collectedLoanDetailCountsToday.data),
					}}
					right1Data={{
						label: "No. of Groups",
						value: formatNumber(collectedLoanDetailCountsMonth.noOfGroups),
					}}
					right2Data={{
						label: "No. of Groups",
						value: formatNumber(collectedLoanDetailCountsToday.noOfGroups),
					}}
					leftColor="#2563EB"
					rightColor="#334155"
					loading={loading}
				/>

				<DashboardCard
					titleLeft="Unapproved Txns"
					left1Data={{
						label: "Unapproved",
						value: formatINR(unapprovedTxnsDetailCountsTotal.data),
					}}
					left2Data={{
						label: "No. of Groups",
						value: formatNumber(unapprovedTxnsDetailCountsTotal.noOfGroups),
					}}
					titleRight="Unapproved Transfers"
					right1Data={{
						label: "No. of Groups",
						value: formatNumber(unapprovedTransfers.noOfGroups),
					}}
					right2Data={{
						label: "No. of Members",
						value: formatNumber(unapprovedTransfers.noOfMembers),
					}}
					leftColor="#009966"
					rightColor="#334155"
					loading={loading}
				/>

				{/* <DashboardCard
					title="Unapproved Transactions"
					left1Data={{
						label: "This Month",
						value: formatINR(unapprovedTxnsDetailCountsMonth.data),
					}}
					left2Data={{
						label: "Today",
						value: formatINR(unapprovedTxnsDetailCountsToday.data),
					}}
					right1Data={{
						label: "No. of Groups",
						value: formatNumber(unapprovedTxnsDetailCountsMonth.noOfGroups),
					}}
					right2Data={{
						label: "No. of Groups",
						value: formatNumber(unapprovedTxnsDetailCountsToday.noOfGroups),
					}}
					leftColor="#7C3AED"
					rightColor="#334155"
					loading={loading}
				/> */}

				{/* <div className="md:col-span-2 bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center">
					<h3 className="text-lg font-medium bg-purple-100 text-purple-900 px-5 py-2 rounded-full">
						Unapproved Transactions
					</h3>
					<div className="flex justify-between items-center w-full px-14 py-5 rounded-3xl bg-white">
						<div className="flex flex-col items-center gap-2">
							<Spin spinning={loadingLong}>
								<span className="text-3xl font-bold text-emerald-600 mt-4">
									{formatINR(unapprovedTxnsDetailCountsTotal.data)}
								</span>
							</Spin>
							<span className="text-sm text-slate-600">Unapproved</span>
						</div>
						<div className="h-16 w-[2px] rounded bg-slate-200" />
						<div className="flex flex-col items-center gap-2">
							<Spin spinning={loadingLong}>
								<span className="text-3xl font-bold text-blue-600 mt-4">
									{formatNumber(unapprovedTxnsDetailCountsTotal.noOfGroups)}
								</span>
							</Spin>
							<span className="text-sm text-slate-600">Groups</span>
						</div>
					</div>
				</div> */}

				<div className="md:col-span-3 rounded-3xl bg-white shadow-md pt-3 overflow-hidden">
					{/* <h3 className="text-lg font-medium text-slate-900 py-2 rounded-full">
						Generate Demand
					</h3> */}
					<div className="flex justify-between flex-row pl-5">
						<h3 className="text-lg font-medium text-slate-900 rounded-full">
							Total Demand
						</h3>
						{/* <div className="space-x-2">
							<button
								onClick={() => {
									if (+choosenBranch === 100) {
										Message("warning", "Please select individual branch.")
										return
									}
									generateDemandData()
								}}
								className={`px-3 py-1 rounded-full font-medium text-sm uppercase self-center bg-purple-600 text-white transition-all hover:scale-105 active:scale-95 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed`}
								disabled={loadingDmd}
							>
								<AutoAwesomeOutlinedIcon fontSize="small" /> Generate Demand
							</button>
						</div> */}
						{/* <div className="space-x-2">
							{[
								"Month",
								`${getOrdinalSuffix(new Date().getDate())}\n(Monthly Mode)`,
								`${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
									new Date()
								)}\n(Weekly Mode)`,
							].map((option, i) => (
								<button
									key={option}
									onClick={() =>
										setDmdFlags(
											i === 0
												? {
														id: i,
														flag: "M",
														recovDay: "",
												  }
												: i === 1
												? {
														id: i,
														flag: "D",
														recovDay: new Date().getDate(),
												  }
												: i === 2
												? {
														id: i,
														flag: "W",
														recovDay: new Date().getDay() + 1,
												  }
												: {
														id: i,
														flag: "",
														recovDay: "",
												  }
										)
									}
									className={`px-3 py-1 rounded-full font-medium text-sm ${
										dmdFlags.id === i
											? "bg-teal-600 text-white disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
											: "bg-slate-100 text-slate-600 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
									}`}
									disabled={demandFlag === 0}
								>
									{option}
								</button>
							))}
						</div> */}
					</div>
					{/* <div className="grid grid-cols-2 align-middle bg-white p-6 mt-5 overflow-hidden"> */}
					<div className="grid grid-cols-2 align-middle p-0 bg-white mt-0 overflow-hidden">
					

						<DashboardCard
					// titleLeft="Loan Disbursed"
					left1Data={{
						label: "Month - Demand Amount",
						value: formatINR(dmdDetails_m?.data),
					}}
					left2Data={{
						label: `${getOrdinalSuffix(new Date().getDate())}\n(Monthly Mode) - Demand Amount`,
						value: formatINR(dmdDetails_d?.data),
					}}
					left3Data={{
						label: `${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date())}\n(Weekly Mode) - Demand Amount`,
						value: formatINR(dmdDetails_w?.data),
					}}
					right1Data={{
						label: "Number Of Groups",
						value: formatNumber(dmdDetails_m.noOfGroups),
					}}
					right2Data={{
						label: `Number Of Groups`,
						value: formatNumber(dmdDetails_d.noOfGroups),
					}}
					right3Data={{
						label: `Number Of Groups`,
						value: formatNumber(dmdDetails_w.noOfGroups),
					}}
					leftColor="#2563EB"
					rightColor="#334155"
					loading={loadingDmd_m_d_w}
				/>
				

						{/* <div className="flex flex-col items-center gap-2">
							<Spin spinning={loadingDmd}>
								<span className="text-3xl font-bold text-emerald-600 mt-4">
									{formatINR(dmdDetails.data)}
									<br />
									month: {formatINR(dmdDetails_m?.data)}<br />
									Day: {formatINR(dmdDetails_d?.data)} <br />
									weekly: {formatINR(dmdDetails_w.data)}
								</span>
							</Spin>
							<span className="text-sm text-slate-600">Demand Amount</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<Spin spinning={loadingDmd}>
								<span className="text-3xl font-bold text-blue-600 mt-4">
									{formatNumber(dmdDetails.noOfGroups)}
									<br />
									month: {formatINR(dmdDetails_m.noOfGroups)}<br />
									Day: {formatINR(dmdDetails_d.noOfGroups)} <br />
									weekly: {formatINR(dmdDetails_w.noOfGroups)}
								</span>
							</Spin>
							<span className="text-sm text-slate-600">Groups</span>
						</div> */}

					</div>
				</div>
				<div className="md:col-span-3 rounded-3xl bg-white shadow-md p-6 overflow-hidden">
					<div className="flex justify-between pl-5 flex-row">
						<h3 className="text-lg font-medium text-slate-900 rounded-full">
							Overdue Demand
						</h3>
						{/* <div className="space-x-2">
							{[
								"Month",
								`${getOrdinalSuffix(new Date().getDate())}\n(Monthly Mode)`,
								`${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
									new Date()
								)}\n(Weekly Mode)`,
							].map((option, i) => (
								<button
									key={option}
									onClick={() =>
										setOdFlags(
											i === 0
												? {
														id: i,
														flag: "M",
														recovDay: "",
												  }
												: i === 1
												? {
														id: i,
														flag: "D",
														recovDay: new Date().getDate(),
												  }
												: i === 2
												? {
														id: i,
														flag: "W",
														recovDay: new Date().getDay() + 1,
												  }
												: {
														id: i,
														flag: "",
														recovDay: "",
												  }
										)
									}
									className={`px-3 py-1 rounded-full font-medium text-sm ${
										odFlags.id === i
											? "bg-teal-600 text-white disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
											: "bg-slate-100 text-slate-600 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
									}`}
								>
									{option}
								</button>
							))}
						</div> */}
					</div>
					{/* <div className="grid grid-cols-2 align-middle bg-white p-6 mt-5 overflow-hidden"> */}

					<div className="grid grid-cols-2 align-middle p-0 bg-white mt-0 overflow-hidden">
					

						<DashboardCard
					// titleLeft="Loan Disbursed"
					left1Data={{
						label: "Month - Overdue Amount",
						value: formatINR(odDetails_m?.data),
					}}
					left2Data={{
						label: `${getOrdinalSuffix(new Date().getDate())}\n(Monthly Mode) - Overdue Amount`,
						value: formatINR(odDetails_d?.data),
					}}
					left3Data={{
						label: `${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date())}\n(Weekly Mode) - Overdue Amount`,
						value: formatINR(odDetails_w?.data),
					}}
					right1Data={{
						label: "Number Of Groups",
						value: formatNumber(odDetails_m.noOfGroups),
					}}
					right2Data={{
						label: `Number Of Groups`,
						value: formatNumber(odDetails_d.noOfGroups),
					}}
					right3Data={{
						label: `Number Of Groups`,
						value: formatNumber(odDetails_w.noOfGroups),
					}}
					leftColor="#2563EB"
					rightColor="#334155"
					loading={loadingDmd_m_d_w}
				/>


						{/* <div className="flex flex-col items-center gap-2">
							<Spin spinning={loadingOd}>
								<span className="text-3xl font-bold text-emerald-600 mt-4">
									{formatINR(odDetails.data)} <br />
									month: {formatINR(odDetails_m?.data)} <br />
									Day: {formatINR(odDetails_d?.data)} <br />
									weekly: {formatINR(odDetails_w?.data)}
								</span>
							</Spin>
							<span className="text-sm text-slate-600">Overdue Amount</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<Spin spinning={loadingOd}>
								<span className="text-3xl font-bold text-blue-600 mt-4">
									{formatNumber(odDetails.noOfGroups)} <br />
									month: {formatINR(odDetails_m.noOfGroups)} <br />
									Day: {formatINR(odDetails_d.noOfGroups)} <br />
									weekly: {formatINR(odDetails_w.noOfGroups)}
								</span>
							</Spin>
							<span className="text-sm text-slate-600">Groups</span>
						</div> */}
					</div>
					<div className="flex justify-end items-center border-t pt-2">
								  <Button type="text" size="large"
								  style={{ fontWeight: 'bold' }}
								  loading={isOverdueLoadingPending}
								  onClick={() => {
									showCoWiseBreadkup();
								  }}
								  >View All</Button>
					</div>
				</div>
				{/* <DashboardCard
					title="Overdue Amount"
					left1Data={{
						label: "This Month",
						value: formatINR(collectedLoanDetailCountsMonth.data),
					}}
					left2Data={{
						label: "Today",
						value: formatINR(collectedLoanDetailCountsToday.data),
					}}
					right1Data={{
						label: "No. of Groups",
						value: formatNumber(collectedLoanDetailCountsMonth.noOfGroups),
					}}
					right2Data={{
						label: "No. of Groups",
						value: formatNumber(collectedLoanDetailCountsToday.noOfGroups),
					}}
					leftColor="#e17100"
					rightColor="#1d293d"
					loading={loading}
				/> */}
			</div>
			{/* )} */}

			{/* {+userDetails?.id == 1 && (
				<>
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
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center group">
							<h3 className="text-lg font-medium text-slate-700">Total GRT</h3>
							<div className="bg-teal-100 rounded-full p-4 my-4">
								<ListAltOutlinedIcon className="text-teal-600" />
							</div>
							<Spin spinning={loading}>
								<span className="text-3xl font-bold text-slate-800">
									{formatNumber(dashboardDetailsCO)}
								</span>
							</Spin>
							<span className="text-sm text-slate-600 mt-1 italic">
								({grtPeriod})
							</span>
						</div>

						<div className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center group">
							<h3 className="text-lg font-medium text-slate-700">Total Cash</h3>
							<div className="bg-red-100 rounded-full p-4 my-4">
								<CurrencyRupeeOutlinedIcon className="text-red-600" />
							</div>
							<Spin spinning={loading}>
								<span className="text-3xl font-bold text-slate-800">
									{formatNumber(totalCashRecoveryCO)}
								</span>
							</Spin>
							<span className="text-sm text-slate-600 mt-1 italic">
								({grtPeriod})
							</span>
						</div>

						<div className="bg-white rounded-3xl shadow-md p-6 flex flex-col items-center justify-center group">
							<h3 className="text-lg font-medium text-slate-700">Total UPI</h3>
							<div className="bg-blue-100 rounded-full p-4 my-4">
								<AccountBalanceOutlinedIcon className="text-blue-600" />
							</div>
							<Spin spinning={loading}>
								<span className="text-3xl font-bold text-slate-800">
									{formatNumber(totalBankRecoveryCO)}
								</span>
							</Spin>
							<span className="text-sm text-slate-600 mt-1 italic">
								({grtPeriod})
							</span>
						</div>
					</div>
				</>
			)} */}

			{/* <div className="col-span-1 md:col-span-4 bg-white rounded-3xl shadow-md p-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-medium text-slate-800">
						Loan Collection
					</h2>
					<div>
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
							radius={[100, 100, 0, 0]}
						/>
						<Bar
							dataKey="recovery"
							name="Recovery"
							fill="#ff637e"
							barSize={25}
							radius={[100, 100, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div> */}
			  <Modal
				title="CO Wise Breakup Details"
				open={isModalOpen}
				footer={null}
				onCancel={handleCancel}
				width={700}
			>
				<Input
				placeholder="Search..."
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
				style={{ marginBottom: 16 }}
				allowClear
				/>
				<Table size="small" 
				bordered={true}
				dataSource={filteredData} 
				columns={columns} 
				pagination={false} 
				summary={(pageData) => {
					let totalAmt = 0;
					let totalGrp = 0;
					pageData.forEach(({ od_amt, group_count }) => {
					totalAmt += Number(od_amt);
					totalGrp += group_count;
					});

					return (
					<Table.Summary.Row>
						<Table.Summary.Cell index={0} colSpan={2}><strong>Total</strong></Table.Summary.Cell>
						<Table.Summary.Cell index={1}><strong>{totalAmt}</strong></Table.Summary.Cell>
						<Table.Summary.Cell index={2} ><strong>{totalGrp}</strong></Table.Summary.Cell>
					</Table.Summary.Row>
					);
				}}
				/>
			</Modal>
		</div>
	)
}

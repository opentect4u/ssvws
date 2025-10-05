import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import LOGO from "../Assets/Images/inverted.png"
import { Divider } from "@mui/material"
import { Drawer } from "antd"
import { motion } from "framer-motion"
import MenusBr from "./MenusBr"
import axios from "axios"
import { url } from "../Address/BaseUrl"
import {
	BarChartOutlined,
	UserOutlined,
	BarsOutlined,
	LogoutOutlined,
	ImportOutlined,
	LineChartOutlined,
	ContainerOutlined,
	FileSearchOutlined,
	SearchOutlined,
	DeploymentUnitOutlined,
	PlusCircleOutlined,
	ThunderboltOutlined,
	CheckCircleOutlined,
	DatabaseOutlined,
	EyeOutlined,
	UserAddOutlined,
	SettingOutlined,
	FastForwardOutlined,
	SubnodeOutlined,
	SendOutlined,
	EyeFilled,
	TableOutlined,
} from "@ant-design/icons"

import { useSocket } from "../Context/SocketContext"
import { Message, MessageWithLink } from "./Message"
import { setItem } from "./indexedDB";

import { SwapCallsRounded } from "@mui/icons-material"
function Sidebar({ mode = 0, reportProgress }) {
	const location = useLocation()
	const [current, setCurrent] = React.useState("mail")
	const [theme, setTheme] = useState(localStorage.getItem("col"))
	const paths = location.pathname.split("/")
	const userDetails = JSON.parse(localStorage.getItem("user_details"))
	const [open, setOpen] = useState(false)
	const [permissions, setPermissions] = useState()
	const { socket, connectSocket } = useSocket()
	// useState(() => {
	// 	setTheme(localStorage.getItem("col"))
	// }, [localStorage.getItem("col")])
	useEffect(() => {
		setOpen(false)
	}, [location.pathname])

	// Add effect to ensure socket connection
	useEffect(() => {
		if (!socket && userDetails?.emp_id) {
			console.log("Initializing socket connection...")
			const newSocket = connectSocket(userDetails?.emp_id)
			if (newSocket) {
				console.log(newSocket, 'newSocketnewSocketnewSocket');
				
				newSocket.on('receive_notification', (data) => {
				console.log("Received month end process update:", data)
				// Message("success", "Month end details updated successfully")
				MessageWithLink("success", "Your month end process is complete. To view the report,", "/homebm/overduereport", 'Click Here')
				})
				

				// OLD use LocalStorage
				// newSocket.on('loan_tns_repo_notification', async (data) => {
				// localStorage.setItem("reportData", JSON.stringify(data?.msg?.msg))
				// localStorage.setItem("reportData_Url", JSON.stringify(data?.req_data))
				// localStorage.setItem("reportDataProgress", 'done')
				// MessageWithLink("success", "Your Loan Transactions Reports process is complete. To view the report,", `${data?.req_data?.page_url}`, 'Click Here')
				// })

				newSocket.on("loan_tns_repo_notification", async (data) => {
				try {
				await setItem("reportData", data?.msg?.msg);
				await setItem("reportData_Url", data?.req_data);
				await setItem("reportDataProgress", "done");

				MessageWithLink(
				"success",
				"Your Loan Transactions Reports process is complete. To view the report,",
				`${data?.req_data?.page_url}`,
				"Click Here"
				);
				} catch (err) {
				console.error("Failed saving to IndexedDB", err);
				}
				});


			} else {
				console.error("Failed to establish socket connection")
			}
		}
	}, [socket, userDetails, connectSocket])

	// Debug socket status changes
	useEffect(() => {
		console.log("Socket connection status:", socket ? "Connected" : "Disconnected")
	}, [socket])
	
	useEffect(() => {
		// axios.post(url + "/menu/fetch_menu_permission_dtls", { user_type: userDetails?.id }).then((res) => {
		// 	console.log(res?.data?.msg[0])
		// 	setPermissions(res?.data?.msg[0])
		// })
		axios
			.post(url + "/user_menu/get_menu", { user_type_id: userDetails?.id })
			.then((res) => {
				// console.log(res?.data?.msg)
				var items_all_user1 = [
					{
						key: "sub1",
						icon: <LineChartOutlined />,
						label: <Link to={"/homebm/"}>Dashboard</Link>,
						// hidden: false,
						children: [],
					},
					{
						key: "sub2",
						icon: <ContainerOutlined />,
						label: "GRT",
						// hidden: data?.grt == "Y" ? false : true,
						children: [
							{
								key: "sub2-1",
								icon: <ContainerOutlined />,
								label: <Link to={"/homebm/grtappls/"}>Applications</Link>,
								// hidden: data?.applications == "Y" ? false : true,
							},
							{
								key: "sub2-4",
								icon: <FileSearchOutlined />,
								label: <Link to={"/homemis/searchmember/"}>Search Member</Link>,
								// hidden: data?.search_member == "Y" ? false : true,
							},
						],
					},
					{
						key: "sub3",
						icon: <DeploymentUnitOutlined />,
						label: "Groups",
						// hidden: data?.groups == "Y" ? false : true,
						children: [
							{
								key: "sub3-1",
								icon: <FileSearchOutlined />,
								label: <Link to={"/homebm/searchgroup/"}>Edit Group</Link>,
								// hidden: data?.edit_group == "Y" ? false : true,
							},
							{
								key: "sub3-2",
								icon: <PlusCircleOutlined />,
								label: <Link to={"/homebm/editgroupform/0"}>Add Group</Link>,
								// hidden: data?.add_group == "Y" ? false : true,
							},
							{
								key: "sub3-4",
								icon: <SendOutlined />,
								label: (
									<Link to={"/homebm/trancefercofrom/0"}>Transfer Group</Link>
								),
								// hidden: data?.transfer_group == "Y" ? false : true,
							},
							{
								key: "sub3-5",
								icon: <CheckCircleOutlined />,
								label: (
									<Link to={"/homebm/trancefercofromapprove-unic"}>
										Approve Group Transfer
									</Link>
								),
								// hidden: data?.approve_group_transfer == "Y" ? false : true,
							},
							{
								key: "sub3-6",
								icon: <EyeOutlined />,
								label: (
									<Link to={"/homebm/tranceferco"}>View Group Transfer</Link>
								),
								// hidden: data?.view_group_transfer == "Y" ? false : true,
							},
							{
								key: "sub3-9",
								icon: <EyeFilled />,
								label: (
									<Link to={"/homebm/viewmembertransfer"}>
										View Member Transfer
									</Link>
								),
								// hidden: data?.view_group_transfer == "Y" ? false : true,
							},
							{
								key: "sub3-7",
								icon: <SwapCallsRounded />,
								label: (
									<Link to={"/homebm/transfermember/0"}>Member Transfer</Link>
								),
								// hidden: data?.view_group_transfer == "Y" ? false : true,
							},
							{
								key: "sub3-8",
								icon: <CheckCircleOutlined />,
								label: (
									<Link to={"/homebm/approvemembertransfer"}>
										Approve Member Transfer
									</Link>
								),
								// hidden: data?.view_group_transfer == "Y" ? false : true,
							},

							//    {
							//      key: "sub3-3",
							//      icon: <SubnodeOutlined />,
							//      label: <Link to={"/homemis/assignmember"}>Assign Member</Link>,
							//    },
						],
					},
					{
						key: "sub_att",
						icon: <ImportOutlined />,
						label: "Attendance",
						// hidden: data?.attendance == "Y" ? false : true,
						children: [
							{
								key: "sub_att-1",
								icon: <UserAddOutlined />,
								label: (
									<Link to={"/homebm/attendancebm"}>Attendance Dashboard</Link>
								),
								// hidden: data?.attendance_dashboard == "Y" ? false : true,
							},
						],
					},
					{
						key: "sub4",
						icon: <ThunderboltOutlined />,
						label: "Loans",
						// hidden: data?.loans == "Y" ? false : true,
						children: [
							{
								key: "sub4-1",
								icon: <ThunderboltOutlined />,
								label: <Link to={"/homebm/disburseloan"}>Disburse Loan</Link>,
								// hidden: data?.disburse_loan == "Y" ? false : true,
							},
							{
								key: "sub4-3",
								icon: <EyeOutlined />,
								label: <Link to={"/homebm/viewloan"}>View Loan</Link>,
								// hidden: data?.view_loan == "Y" ? false : true,
							},
							{
								key: "sub4-4",
								icon: <EyeOutlined />,
								label: <Link to={"/homebm/rejecttxn"}>Reject Transaction</Link>,
								// hidden: data?.view_loan == "Y" ? false : true,
							},
							{
								key: "sub4-6",
								icon: <EyeOutlined />,
								label: <Link to={"/homebm/rejecdisbursement"}>Reject Disbursement</Link>,
								// hidden: data?.view_loan == "Y" ? false : true,
							},
							{
								key: "sub4-2",
								icon: <CheckCircleOutlined />,
								label: "Approve Transaction",
								// hidden: data?.approve_transaction == "Y" ? false : true,
								children: [
									{
										key: "sub4-2-1",
										icon: <CheckCircleOutlined />,
										label: (
											<Link to={"/homebm/approvedisbursed"}>Disburse</Link>
										),
										// hidden: data?.approve_transaction == "Y" ? false : true,
									},
									{
										key: "sub4-2-2",
										icon: <CheckCircleOutlined />,
										label: <Link to={"/homebm/approveloan"}>Recovery</Link>,
										// hidden: data?.approve_transaction == "Y" ? false : true,
									},
								],
							},
							{
								key: "sub4-5",
								icon: <DatabaseOutlined />,
								label: <Link to={"/homebm/loancalculator"}>Loan EMI Calculator</Link>,
								// hidden: data?.designation == "Y" ? false : true,
							},
						],
					},
					{
						key: "sub5",
						icon: <DatabaseOutlined />,
						label: "Master",
						// hidden: data?.master == "Y" ? false : true,
						children: [
							{
								key: "sub5-1",
								icon: <DatabaseOutlined />,
								label: <Link to={"/homeadmin/masterbanks"}>Banks</Link>,
								// hidden: data?.banks == "Y" ? false : true,
							},
							{
								key: "sub5-2",
								icon: <DatabaseOutlined />,
								label: <Link to={"/homeadmin/masteremployees"}>Employees</Link>,
								// hidden: data?.employees == "Y" ? false : true,
							},
							{
								key: "sub5-3",
								icon: <DatabaseOutlined />,
								label: (
									<Link to={"/homeadmin/masterdesignations"}>Designations</Link>
								),
								// hidden: data?.designation == "Y" ? false : true,
							},
							{
								key: "sub5-4",
								icon: <DatabaseOutlined />,
								label: <Link to={"/homeadmin/masterdistricts"}>Districts</Link>,
								// hidden: data?.designation == "Y" ? false : true,
							},
							{
								key: "sub5-5",
								icon: <DatabaseOutlined />,
								label: <Link to={"/homeadmin/masterblocks"}>Blocks</Link>,
								// hidden: data?.designation == "Y" ? false : true,
							},
							{
								key: "sub5-6",
								icon: <DatabaseOutlined />,
								label: <Link to={"/homeadmin/masterpurpose"}>Purpose</Link>,
								// hidden: data?.designation == "Y" ? false : true,
							},
							{
								key: "sub5-7",
								icon: <DatabaseOutlined />,
								label: <Link to={"/homeadmin/masterfunds"}>Funds</Link>,
								// hidden: data?.designation == "Y" ? false : true,
							},
							{
								key: "sub5-8",
								icon: <DatabaseOutlined />,
								label: <Link to={"/homeadmin/masterschemes"}>Scheme</Link>,
								// hidden: data?.designation == "Y" ? false : true,
							},
						],
					},
					{
						key: "sub7",
						icon: <ImportOutlined />,
						label: "User Management",
						// hidden: data?.user_management == "Y" ? false : true,
						children: [
							{
								key: "sub7-1",
								icon: <UserAddOutlined />,
								label: <Link to={"/homeadmin/createuser/0"}>Create User</Link>,
								// hidden: data?.create_user == "Y" ? false : true,
							},
							{
								key: "sub7-2",
								icon: <SettingOutlined />,
								label: <Link to={"/homeadmin/manageuser/"}>Manage User</Link>,
								// hidden: data?.manage_user == "Y" ? false : true,
							},
							{
								key: "sub7-3",
								icon: <FastForwardOutlined />,
								label: (
									<Link to={"/homeadmin/transferuser/0"}>Transfer User</Link>
								),
								// hidden: data?.transfer_user == "Y" ? false : true,
							},
							{
								key: "sub7-5",
								icon: <FastForwardOutlined />,
								label: (
									<Link to={"/homeadmin/audit_report"}>Audit Trail</Link>
								),
								// hidden: data?.transfer_user == "Y" ? false : true,
							},
							{
								key: "sub7-4",
								icon: <TableOutlined />,
								label: <Link to={"/homeadmin/monthend"}>Month End</Link>,
								// hidden: data?.transfer_user == "Y" ? false : true,
							},
						],
					},
					{
						label: "Reports",
						key: "sub6",
						icon: <BarsOutlined />,
						// hidden: data?.reports == "Y" ? false : true,
						children: [
							// {
							//  key: "sub6-1",
							//  icon: <BarChartOutlined />,
							//  label: (
							//    <Link to={"/homebm/memberwiserecoveryreport"}>
							//      Memberwise Recovery
							//    </Link>
							//  ),
							// },
							// {
							//  key: "sub6-2",
							//  icon: <BarChartOutlined />,
							//  label: (
							//    <Link to={"/homebm/groupwiserecoveryreport"}>
							//      Groupwise Recovery
							//    </Link>
							//  ),
							// },
							// {
							//  key: "sub6-3",
							//  icon: <BarChartOutlined />,
							//  label: <Link to={"/homebm/demandreport"}>Demand</Link>,
							// },
							{
								key: "sub6-14",
								icon: <BarChartOutlined />,
								label: (
									<Link to={"/homebm/previous-loantxns"}>Previous Loan Transactions</Link>
								),
								
							},
							{
								key: "sub6-5",
								icon: <BarChartOutlined />,
								label: <Link to={"/homebm/loantxns"}>Loan Transactions</Link>,
								// hidden: data?.loan_transactions == "Y" ? false : true,
							},
							{
								key: "sub6-6",
								icon: <BarChartOutlined />,
								label: <Link to={"/homebm/demandreport"}>Demand Report</Link>,
								// hidden: data?.demand_report == "Y" ? false : true,
							},
							{
								key: "sub6-7",
								icon: <BarChartOutlined />,
								label: (
									<Link to={"/homebm/outstasndingreport"}>
										Outstanding Report
									</Link>
								),
								// hidden: data?.outstanding_report == "Y" ? false : true,
							},
							{
								key: "sub6-4",
								icon: <BarChartOutlined />,
								label: (
									<Link to={"/homebm/loanstatements"}>Loan Statements</Link>
								),
								// hidden: data?.loan_statement == "Y" ? false : true,
							},

							// {
							//  key: "sub6-8",
							//  icon: <BarChartOutlined />,
							//  label: <Link to={"/homebm/summaryreports"}>Summary Reports</Link>,
							//  children: [
							//    {
							//      key: "sub6-8-1",
							//      icon: <BarChartOutlined />,
							//      label: (
							//        <Link to={"/homebm/summaryreports/fundwise"}>
							//          Fundwise Report
							//        </Link>
							//      ),
							//    },
							//    {
							//      key: "sub6-8-2",
							//      icon: <BarChartOutlined />,
							//      label: (
							//        <Link to={"/homebm/summaryreports/schemewise"}>
							//          Schemewise Report
							//        </Link>
							//      ),
							//    },
							//  ],
							// },
							// {
							// 	key: "sub6-8",
							// 	icon: <BarChartOutlined />,
							// 	label: (
							// 		<Link to={"/homebm/fundwisesummary"}>Fundwise Report</Link>
							// 	),
							// },
							// {
							// 	key: "sub6-9",
							// 	icon: <BarChartOutlined />,
							// 	label: (
							// 		<Link to={"/homebm/schemewisesummary"}>
							// 			Schemewise Report
							// 		</Link>
							// 	),
							// },
							{
								key: "sub6-11",
								icon: <BarChartOutlined />,
								label: <Link to={"/homebm/overduereport"}>Overdue Report</Link>,
								// hidden: data?.demand_vs_collection == "Y" ? false : true,
							},
							{
								key: "sub6-10",
								icon: <BarChartOutlined />,
								label: (
									<Link to={"/homebm/demandvscollectionreport"}>
										Demand vs. Collection
									</Link>
								),
								// hidden: data?.demand_vs_collection == "Y" ? false : true,
							},
							{
								key: "sub6-12",
								icon: <BarChartOutlined />,
								label: (
									<Link to={"/homebm/portfolioreport"}>Portfolio Report</Link>
								),
								// hidden: data?.demand_vs_collection == "Y" ? false : true,
							},
							{
								key: "sub6-13",
								icon: <BarChartOutlined />,
								label: (
									<Link to={"/homebm/groupreport"}>Group Report</Link>
								),
								// hidden: data?.demand_vs_collection == "Y" ? false : true,
							},
							
							// {
							//   key: "sub6-10",
							//   icon: <BarChartOutlined />,
							//   label: (
							//     <Link to={"/homebm/groupclosereport"}>Group Close</Link>
							//   ),
							// },
						],
					},
				]
				var data = res?.data?.msg
				var userMenuData = []
				for (let dt of data) {
					var tempMenuData = items_all_user1.filter(
						(item) => item.key == dt.key
					)
					if (dt.has_child != "N" && dt.children) {
						if (dt.children.length > 0) {
							var tempChildren = []
							for (let child of dt.children) {
								var tempChild = tempMenuData[0].children.filter(
									(item) => item.key == child.key
								)
								tempChildren.push(tempChild[0])
							}
							tempMenuData[0].children = tempChildren
						}
					}
					userMenuData.push(tempMenuData[0])
				}
				setPermissions(userMenuData)
			})
	}, [])
	const showDrawer = () => {
		setOpen(true)
	}

	const onClose = () => {
		setOpen(false)
	}
	const drawerWidth = 257

	return (
		<div className="bg-slate-200 dark:bg-gray-800">
			<button
				onClick={showDrawer}
				data-drawer-target="sidebar-multi-level-sidebar"
				data-drawer-toggle="sidebar-multi-level-sidebar"
				aria-controls="sidebar-multi-level-sidebar"
				type="button"
				className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
			>
				<span className="sr-only">Open sidebar</span>
				<svg
					className="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						clipRule="evenodd"
						fillRule="evenodd"
						d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
					></path>
				</svg>
			</button>
			<Drawer
				className="md:hidden w-72 p-0"
				placement={"left"}
				closable={true}
				onClose={onClose}
				open={open}
				key={"left"}
			>
				<Divider />
				<MenusBr mode={"vertical"} theme={"light"} />

				<Divider />
			</Drawer>
			<aside
				id="sidebar-multi-level-sidebar"
				className={
					"fixed top-0 z-20 left-0 w-full h-auto transition-transform -translate-x-full sm:translate-x-0 p-4 justify-center bg-slate-800 shadow-lg"
				}
				aria-label="Sidebar"
			>
				<div className="flex items-center w-full justify-center">
					{/* <div className="flex items-center justify-center p-3 rounded-full">
						<motion.img
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5, type: "spring" }}
							src={LOGO}
							className="h-14 mb-5"
							alt="Flowbite Logo"
						/>
					</div> */}
					<MenusBr data={permissions} reportProgress={reportProgress} /> 
					{/* <img className='absolute bottom-0 h-40 blur-1' src={sidebar2} alt="Flowbite Logo" /> */}
				</div>
				{/* <motion.img initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5, type:'spring'
              }} src={sidebar1} className="h-14" alt="Flowbite Logo" /> */}
			</aside>

			<div
				className={`w-full h-7 p-0.5 py-1 bg-slate-600 text-white justify-center align-middle items-center text-left
				 font-thin text-sm fixed left-0 top-20 shadow-sm z-10`}
			>
				<div className="flex items-center justify-between">
					<div className="italic ml-10">
						⇨{" "}
						{/* {userDetails?.id == 1
							? `Credit Officer - ${userDetails?.emp_name} `
							: userDetails?.id == 2
							? `Branch Manager - ${userDetails?.emp_name} `
							: userDetails?.id == 3
							? `MIS Assistant - ${userDetails?.emp_name} `
							: userDetails?.id == 4
							? `Administrator - ${userDetails?.emp_name} `
							: userDetails?.id == 5
							? `General User - ${userDetails?.emp_name}`
							: userDetails?.id == 11
							? `Admin 2 - ${userDetails?.emp_name}`
							: `HO User - ${userDetails?.emp_name} `} */}
							{`${userDetails?.user_type} - ${userDetails?.emp_name}`}
						({userDetails?.branch_name})
					</div>
					{/* <div className="italic mr-10">
						⇨ Date of Operation : {new Date().toLocaleDateString("en-GB")}
					</div> */}
				</div>
			</div>
		</div>
	)
}

export default Sidebar

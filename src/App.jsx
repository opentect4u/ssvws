import "./App.css"
import { Outlet } from "react-router-dom"
import { PrimeReactProvider } from "primereact/api"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { ConfigProvider } from "antd"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { routePaths } from "./Assets/Data/Routes"
import useIdleTimer from "./Hooks/useIdleTimer"
import { url } from "./Address/BaseUrl"
import { Message } from "./Components/Message"
import axios from "axios"
import { SocketProvider, useSocket } from "./Context/SocketContext"

function AppContent() {
	const navigate = useNavigate()
	const location = useLocation()
	const sessionId = localStorage.getItem("session_id")
	const { socket, disconnectSocket } = useSocket()
	const [machineIP, setMachineIP] = useState("")

	useIdleTimer()

	// useEffect(() => {
	// 	if (location.pathname === "/") {
	// 		navigate("/login")
	// 	}
	// }, [location, navigate])

	useEffect(() => {
	const user_details = JSON.parse(localStorage.getItem("user_details"));

	
	

	if (!user_details) {
		// navigation.replace("Login"); // redirect to login
		console.log(user_details, 'user_detailsuser_detailsuser_details');
		navigate("/")
	}

	}, []);

	const getPublicIP = async () => {
	try {
	const res = await axios.get("https://api.ipify.org?format=json");
	setMachineIP(res?.data?.ip)
	// console.log("Public IP: ", res.data.ip);
	} catch (err) {
	console.error(err);
	}
	};


	useEffect(() => {
		getPublicIP()
		// Handle logout cleanup
		const handleLogout = async () => {
			const userDetails = JSON.parse(localStorage.getItem("user_details") || "{}")
			if (userDetails?.emp_id) {
				try {
					await axios.post(`${url}/logout`, {
						emp_id: userDetails.emp_id,
						session_id: sessionId,
						branch_code: userDetails.brn_code,
						modified_by: userDetails.emp_id,
						myIP: machineIP,
						in_out_flag: "O",
						flag: "W",
					})
					disconnectSocket() // Disconnect socket on logout
				} catch (error) {
					console.error("Logout error:", error)
				}
			}
			localStorage.clear()
			navigate("/login")
		}

		// Attach logout handler
		window.handleLogout = handleLogout

		return () => {
			window.handleLogout = undefined
		}
	}, [navigate, sessionId, disconnectSocket])

	return <Outlet />
}

function App() {
	return (
		<ConfigProvider
			theme={{
				components: {
					Steps: { colorPrimary: "#22543d" },
					Button: {
						colorPrimary: "#da4167",
						colorPrimaryHover: "#da4167cc",
					},
					Timeline: {},
					Select: {
						colorPrimary: "#9CA3AF",
						colorPrimaryHover: "#9CA3AF",
						optionActiveBg: "#9CA3AF",
						optionSelectedColor: "#000000",
						optionSelectedFontWeight: "700",
						colorBorder: "#9CA3AF",
						colorTextPlaceholder: "#4B5563",
					},
					DatePicker: {
						activeBorderColor: "#22543d",
						hoverBorderColor: "#22543d",
						colorPrimary: "#22543d",
					},
					Input: { activeBorderColor: "gray" },
					Breadcrumb: {
						separatorColor: "#052d27",
						itemColor: "#052d27",
						lastItemColor: "#052d27",
						fontSize: 15,
					},
					Menu: {
						itemBg: "#A31E21",
						subMenuItemBg: "#292524",
						popupBg: "#1e293b",
						itemColor: "#D1D5DB",
						itemSelectedBg: "#DA4167",
						itemMarginInline: 4,
						itemHoverBg: "#DA4167",
						itemSelectedColor: "#FBEC21",
						itemHoverColor: "#FFFFFF",
						colorPrimaryBorder: "#A31E21",
						horizontalItemSelectedColor: "#FBEC21",
					},
					Segmented: {
						itemActiveBg: "#A31E21",
						itemColor: "#A31E21",
						itemSelectedColor: "white",
						itemSelectedBg: "#A31E21",
					},
					FloatButton: {
						borderRadiusLG: 20,
						borderRadiusSM: 20,
						colorPrimary: "#eb8d00",
						colorPrimaryHover: "#eb8d00",
						margin: 30,
					},
					Switch: {
						colorPrimary: "#A31E21",
						colorPrimaryHover: "#A31E21",
					},
					Descriptions: {
						titleColor: "#A31E21",
						colorTextLabel: "#A31E21",
						colorText: "#A31E21",
						colorSplit: "#A31E21",
						labelBg: "#F1F5F9",
					},
					Tabs: {
						inkBarColor: "#DA4167",
						itemColor: "#DA4167",
						itemSelectedColor: "#DA4167",
						itemHoverColor: "#DA4167",
						itemActiveColor: "#DA4167",
					},
					Dropdown: {
						colorBgElevated: "white",
						colorText: "#A31E21",
						controlItemBgHover: "#D1D5DB",
					},
					Radio: {
						colorPrimary: "#DA4167",
						buttonColor: "#A31E21",
						colorBorder: "#A31E21",
					},
					Popconfirm: {
						colorWarning: "#A31E21",
					},
					Modal: {
						titleFontSize: 25,
						titleColor: "#eb8d00",
					},
				},
			}}
		>
			<PrimeReactProvider>
				<SocketProvider>
					<AppContent />
				</SocketProvider>
			</PrimeReactProvider>
		</ConfigProvider>
	)
}

export default App

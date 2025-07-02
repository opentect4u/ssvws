import "./App.css"
import { Outlet } from "react-router-dom"
import { PrimeReactProvider } from "primereact/api"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { ConfigProvider } from "antd"
import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { routePaths } from "./Assets/Data/Routes"
import useIdleTimer from "./Hooks/useIdleTimer"
import { url } from "./Address/BaseUrl"
import { Message } from "./Components/Message"
import axios from "axios"

function App() {
	const navigate = useNavigate()
	const location = useLocation()
	const sessionId = localStorage.getItem("session_id")

	useIdleTimer()

	const publicPaths = new Set([
		routePaths.LANDING, // "/"
		routePaths.LANDING_LOAN,
		"/loan",
		"/loan/",

		"/payroll",
		"/payroll/",

		"/ssvws_fin",
		"/ssvws_fin/",
	])

	// Only check session‐validity when you *do* have one and you're on a protected route:
	const checkSessionId = async () => {
		try {
			const userDetails = JSON.parse(localStorage.getItem("user_details")) || {}
			const { data } = await axios.post(`${url}/check_session_id`, {
				emp_id: userDetails.emp_id,
				session_id: sessionId,
			})
			if (!data.match) {
				Message("error", "Session expired. Please login again.")
				localStorage.clear()
				navigate(routePaths.LANDING, { replace: true })
			}
		} catch (err) {
			console.error("Session-check error:", err)
		}
	}

	useEffect(() => {
		// if we have a session and we land on a non-public path, validate it
		if (sessionId && !publicPaths.has(location.pathname)) {
			checkSessionId()
		}
	}, [location.pathname])

	useEffect(() => {
		const path = location.pathname

		if (!sessionId) {
			// no session: if we're NOT on a public path → force into loan-login
			if (!publicPaths.has(path)) {
				navigate(routePaths.LANDING_LOAN, { replace: true })
			}
		} else {
			// we *do* have a session: if we're on ANY public path → send to home
			if (publicPaths.has(path)) {
				navigate(routePaths.BM_HOME, { replace: true })
			}
		}
	}, [location.pathname, sessionId, navigate])

	return (
		<PrimeReactProvider>
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
				<Outlet />
			</ConfigProvider>
		</PrimeReactProvider>
	)
}

export default App

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
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""

	useIdleTimer()

	const checkSessionId = async () => {
		const creds = {
			emp_id: userDetails?.emp_id,
			session_id: localStorage.getItem("session_id"),
		}
		await axios
			.post(`${url}/check_session_id`, creds)
			.then(async (res) => {
				console.log("Session ID STATUS:", res?.data)
				if (!res?.data?.match) {
					Message("error", "Session expired. Please login again.")
					navigate(routePaths.LANDING)
					localStorage.clear()
				} else {
					console.log("Session ID is valid", res?.data)
				}
			})
			.catch((err) => {
				console.log("ERRRR STAT CHECK SESSION ID", err)
			})
	}

	useEffect(() => {
		checkSessionId()
	}, [location.pathname])

	useEffect(() => {
		if (localStorage.length > 0 && localStorage.getItem("session_id")) {
			navigate(routePaths.BM_HOME)
		} else {
			localStorage.clear()
			navigate(routePaths.LANDING_LOAN)
		}
	}, [navigate])

	console.log("app")
	return (
		<PrimeReactProvider>
			<ConfigProvider
				theme={{
					components: {
						Steps: {
							colorPrimary: "#22543d",
						},
						Button: {
							colorPrimary: "#da4167",
							colorPrimaryHover: "#da4167cc",
						},
						Timeline: {
							// dotBg: "#22543d",
							// tailColor: "#22543d",
							// colorPrimary: "#22543d",
						},
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
							// subMenuItemBorderRadius: 50,
							popupBg: "#1e293b",
							itemColor: "#D1D5DB",
							itemSelectedBg: "#DA4167",
							// itemBorderRadius: 50,
							itemMarginInline: 15,
							itemHoverBg: "#DA4167",
							// itemHoverBg: "#1B98E0",
							itemSelectedColor: "#FBEC21",
							itemHoverColor: "#FFFFFF",
							// lineWidth: 0,
							// lineWidthFocus: 0,
							colorPrimaryBorder: "#A31E21",
							horizontalItemSelectedColor: "#FBEC21",
							// padding: 2,
							itemMarginInline: 4,
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
							// colorPrimary:'#025129',
							// colorPrimaryHover:'#025129'

							colorPrimary: "#A31E21",
							colorPrimaryHover: "#A31E21",
						},
						// Checkbox: {
						// 	colorPrimary: "#A31E21",
						// 	colorText: "#A31E21",
						// 	colorPrimaryHover: "#A31E21",
						// },
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
						// Badge: {
						// 	statusSize: 20,
						// },
						Modal: {
							titleFontSize: 25,
							titleColor: "#eb8d00",
						},
						DatePicker: {
							colorPrimary: "#0694a2",
							cellActiveWithRangeBg: "#CCFBF177",
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

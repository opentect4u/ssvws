import React, { useEffect, useState } from "react"
import IMG from "../Assets/Images/purdcs.png"
import IMGINV from "../Assets/Images/purdcs.png"
import { Link, useLocation } from "react-router-dom"
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import DialogBox from "./DialogBox"
import { routePaths } from "../Assets/Data/Routes"
import Divider from "@mui/material/Divider"
import MenuList from "@mui/material/MenuList"
import ListItemText from "@mui/material/ListItemText"
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications"
import Typography from "@mui/material/Typography"
import { motion } from "framer-motion"
import { Avatar, Button } from "antd"
import "../Styles/styles.css"
import { Badge } from "antd"
import { useNavigate } from "react-router-dom"
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp"
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp"
import { DownOutlined } from "@ant-design/icons"

function Header() {
	const navigate = useNavigate()
	const [visible, setVisible] = useState(false)
	const [dark, setDark] = React.useState(false)
	const location = useLocation()
	const paths = location.pathname.split("/")
	const [flag, setFlag] = useState()
	const [anchorElProfile, setAnchorElProfile] = React.useState(null)
	const openProfile = Boolean(anchorElProfile)
	const [anchorElnoti, setAnchorElnoti] = React.useState(null)
	const openNoti = Boolean(anchorElnoti)

	// let theme='#C2EFB3'
	const handleClickProfile = (event) => {
		console.log(event)
		setAnchorElProfile(event.currentTarget)
	}
	const handleClickNotification = (event) => {
		console.log(event)
		setAnchorElnoti(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorElnoti(null)
	}
	const handleViewAll = () => {
		handleClose()
		navigate(routePaths.NOTIFICATIONS)
	}

	const darkModeHandler = () => {
		setDark(!dark)
		document.body.classList.toggle("dark")
	}
	useEffect(() => {
		console.log(paths)
		console.log(localStorage.getItem("first_login"))
		// axios.post
		if (localStorage.getItem("first_login") == "Y") {
			handleCloseProfile("", 3)
		}
	}, [])
	const items = [
		{
			key: "1",
			label: (
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.antgroup.com"
				>
					1st Notification
				</a>
			),
		},
		{
			key: "2",
			label: (
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.aliyun.com"
				>
					2nd Notification
				</a>
			),
		},
		{
			key: "3",
			label: (
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.luohanacademy.com"
				>
					3rd Notification
				</a>
			),
		},
		{
			key: "4",
			label: (
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.luohanacademy.com"
				>
					4th Notification
				</a>
			),
		},
	]
	const itemView = [
		{
			key: "1",
			label: (
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.antgroup.com"
				>
					1st Notification
				</a>
			),
		},
		{
			key: "2",
			label: (
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.aliyun.com"
				>
					2nd Notification
				</a>
			),
		},
		{
			key: "3",
			label: (
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.luohanacademy.com"
				>
					3rd Notification
				</a>
			),
		},
	]
	const itemProfile = [
		{
			key: "1",
			label: (
				<div
					className="text-green-900 hover:text-yellow-300"
					// onClick={() => handleCloseProfile("", 2)}
				>
					Profile
				</div>
			),
		},
		{
			key: "2",
			label: (
				<div
					className="text-green-900 hover:text-yellow-300"
					// onClick={() => handleCloseProfile("/", 1)}
				>
					Sign Out
				</div>
			),
		},
	]

	const handleCloseProfile = (routeTo, flag) => {
		setAnchorElProfile(null)
		if (flag) {
			setFlag(flag)
			setVisible(true)
		}
	}
	var col = "#C2EFB3"
	return (
		// <div className="sticky top-0">
		<div className="sticky top-0">
			{/* <nav className={`bg-[#DDEAE0] px-5 pb-2 dark:bg-gray-800`}> */}
			<div className="flex justify-between items-center mx-auto min-w-screen-xl p-4 z-50">
				<div className="flex justify-between items-center space-x-3 w-4/5">
					<img
						src={!dark ? IMG : IMGINV}
						className="sm:h-9 h-9"
						alt="Flowbite Logo"
					/>
					<div className="h-5 w-12 rounded-full ml-72"></div>
				</div>
				<div className="flex items-center space-x-6 rtl:space-x-reverse mr-2">
					<span className="relative inline-flex items-center">
						<Badge count={5} color="orange">
							<NotificationsActiveIcon
								className="text-yellow-300 dark:text-gray-400 cursor-pointer"
								onClick={handleClickNotification}
							/>
						</Badge>
					</span>
					{/* </Dropdown> */}
					<Menu
						sx={{
							"& .MuiPaper-root": {
								width: "320px", // Adjust the width as needed
								maxWidth: "100%",
							},
						}}
						anchorEl={anchorElnoti}
						open={openNoti}
						onClose={handleClose}
					>
						<MenuList>
							<MenuItem>
								<CircleNotificationsIcon />
								<ListItemText className="px-1 text-yellow-300">
									{" "}
									Notification
								</ListItemText>
							</MenuItem>
							<Divider />
							<MenuItem>
								<ListItemText>Notification 1</ListItemText>
								<Typography variant="body2" color="text.secondary">
									{/* ⌘X */}
									07 May 2024
								</Typography>
							</MenuItem>
							<MenuItem>
								{/* <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon> */}
								<ListItemText>Notification 2</ListItemText>
								<Typography variant="body2" color="text.secondary">
									{/* ⌘C */}
									05 May 2024
								</Typography>
							</MenuItem>
							<MenuItem>
								<ListItemText>Notification 3</ListItemText>
								<Typography variant="body2" color="text.secondary">
									02 May 2024
								</Typography>
							</MenuItem>
							<Divider />
							<MenuItem onClick={handleViewAll}>
								<ListItemText className="text-yellow-300">
									View All
								</ListItemText>
							</MenuItem>
						</MenuList>
					</Menu>
					{/* <Avatar className="cursor-pointer " onClick={handleClickProfile} style={{ backgroundColor: '#eb8d00', verticalAlign: 'middle' }} size="large"> */}
					<motion.div
						initial={{ opacity: 0, width: 0 }}
						animate={{ opacity: 1, width: "95%" }}
						transition={{ delay: 1.1, type: "just" }}
						className="w-auto cursor-pointer text-nowrap p-1 rounded-full bg-white flex shadow-lg justify-start items-center gap-2 text-yellow-300 hover:bg-[#C4F1BE] border-white border-2 hover:border-2 hover:border-white hover:duration-300"
						onClick={handleClickProfile}
					>
						<Avatar
							className="cursor-pointer "
							style={{ backgroundColor: "#014737", verticalAlign: "middle" }}
							size="small"
						>
							{/* {localStorage.getItem("user_name").indexOf(" ") > 0
								? localStorage.getItem("user_name").split(" ")[0] +
								  localStorage.getItem("user_name").split(" ")[1]
								: localStorage.getItem("user_name").charAt(0)} */}
						</Avatar>
						<span className="text-sm text-nowrap text-yellow-300 font-bold">
							Hi, {localStorage.getItem("user_name")}
						</span>
						<DownOutlined className="text-sm text-nowrap text-gray-500 font-bold" />
					</motion.div>

					<Menu
						id="basic-menu"
						sx={{
							"& .MuiPaper-root": {
								width: "200px", // Adjust the width as needed
								maxWidth: "100%",
								marginRight: "200px",
							},
						}}
						anchorEl={anchorElProfile}
						open={openProfile}
						onClose={() => handleCloseProfile("")}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
					>
						<MenuItem
							className="text-yellow-300 hover:text-yellow-300 p-2"
							onClick={() => handleCloseProfile("", 2)}
						>
							<AccountCircleSharpIcon className="text-yellow-300 mr-2" />{" "}
							Profile
						</MenuItem>
						<Divider />
						<MenuItem
							className="text-yellow-300 hover:text-yellow-300"
							onClick={() => handleCloseProfile("/", 1)}
						>
							<LogoutSharpIcon className="text-yellow-300 mr-2" /> Logout
						</MenuItem>
					</Menu>
					{/* </div> */}
				</div>
			</div>
			{/* <nav className="bg-white rounded-full dark:bg-[#001529] px-5 shadow-lg  hidden sm:block">
          <Menus theme={dark ? "dark" : "light"} mode={"horizontal"} />
          {!(paths.length == 2 && paths[1] == "home") && <Backbtn/>}
        </nav> */}
			{/* </nav> */}
			{/* </div> */}
			<DialogBox
				visible={visible}
				flag={flag}
				onPress={() => setVisible(false)}
			/>
		</div>
	)
}

export default Header

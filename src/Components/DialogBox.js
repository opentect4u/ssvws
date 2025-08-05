import { useContext, useEffect, useState } from "react"
import { Dialog } from "primereact/dialog"
import { useNavigate } from "react-router-dom"
import { Spin, Tabs } from "antd"
import PasswordComp from "./PasswordComp"
import "../Styles/styles.css"
import UserProfileUpdateForm from "../Screens/Forms/UserProfileUpdateForm"
import {  loadingContext } from "../Context/Democontext"
import { routePaths } from "../Assets/Data/Routes"
import { LoadingOutlined } from "@ant-design/icons"

const DialogBox = ({
	visible,
	flag,
	onPress,
	data,
	onPressNo,
	onPressYes,
	onEditPress,
	loading=false
}) => {
	const { handleLogOut } = useContext(loadingContext)
	const navigate = useNavigate()
	const [po_no, setPoNo] = useState("")
	useEffect(() => {
		setPoNo("")
	}, [])
	const onChange = (key) => {
		console.log(key, "onChange")
	}
	const itemsComp = [
		{
			key: "1",
			label: "User profile",
			children: (
				<>
					{/* <ProfileInfo flag={flag} /> */}

					<UserProfileUpdateForm />

					{/* <Button
						className="rounded-full bg-blue-800 text-white mt-10 float-right"
						onClick={() => onEditPress()}
						icon={<EditOutlined />}
					></Button> */}
				</>
			),
		},
		{
			key: "2",
			label: "Change password",
			children: <PasswordComp mode={2} onPress={onPress} />,
		},
	]

	return (
		<Dialog
			closable={flag != 3 ? true : false}
			header={
				<div
					className={
						flag != 1
							? "text-slate-800  font-bold"
							: "text-slate-800  font-bold w-20"
					}
				>
					{flag != 2 &&
						flag != 5 &&
						flag != 6 &&
						flag != 7 &&
						flag != 8 &&
						flag != 9 &&
						flag != 10 &&
						flag != 11
						? "Warning!"
						: flag != 10
							? "Information"
							: "Preview"}
				</div>
			}
			visible={visible}
			maximizable
			style={{
				width: "50vw",
				background: "black",
			}}
			onHide={() => {
				if (!visible) return
				onPress()
			}}
		>
			{flag == 1 && (
				<p className="m-0">
					Do you want to logout?
					<div className="flex justify-center">
						<button
							type="reset"
							onClick={onPress}
							className="inline-flex mr-3 bg-slate-800 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white border border-slate-800 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
						>
							No
						</button>
						<button
							type="submit"
							onClick={async () => {
								await handleLogOut().then(() => {
									navigate(routePaths.LANDING)
								})
							}}
							className="inline-flex bg-[#DA4167] items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
						>
							Yes
						</button>
					</div>
				</p>
			)}
			{flag == 2 && (
				<Tabs
					defaultActiveKey="1"
					size={"large"}
					animated
					centered
					items={itemsComp}
					onChange={onChange}
				/>
			)}
			{flag == 3 && <PasswordComp mode={3} onPress={onPress} />}
			{flag == 4 && (
				<Spin
					indicator={<LoadingOutlined spin={true} />}
					size="large"
					className="text-blue-800 dark:text-gray-400"
					spinning={loading}
				>
				<p className="m-0">
					Are you sure? This action cannot be undone.
					<div className="flex justify-center">
						<button
							type="button"
							onClick={onPressNo}
							className="inline-flex mr-3 bg-slate-800 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white border border-slate-800 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
						>
							No
						</button>
						<button
							type="button"
							onClick={onPressYes}
							className="inline-flex bg-[#DA4167] items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
						>
							Yes
						</button>
					</div>
				</p>
				</Spin>
			)}
			{flag == 5 && (
				<p className="m-0">
					Group with code:{data} is created!
					<div className="flex justify-center">
						<button
							type="button"
							onClick={onPressYes}
							className="inline-flex bg-[#DA4167] items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
						>
							OK
						</button>
					</div>
				</p>
			)}
			{flag == 6 && (
				<p className="m-0">
					An active session detected! This action will log you out from the
					active session. Do you want to log in anyways?
					<div className="flex justify-center">
						<button
							type="button"
							onClick={onPressNo}
							className="inline-flex mr-3 bg-slate-800 items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white border border-slate-800 bg-primary-700 rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
						>
							No
						</button>
						<button
							type="button"
							onClick={onPressYes}
							className="inline-flex bg-[#DA4167] items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
						>
							Yes
						</button>
					</div>
				</p>
			)}
		</Dialog>
	)
}

export default DialogBox

import React, { useEffect, useState } from "react"
import { routePaths } from "../Assets/Data/Routes"
import { useNavigate } from "react-router-dom"
import TDInputTemplateBr from "./TDInputTemplateBr"
import axios from "axios"
import { url } from "../Address/BaseUrl"
import { Message } from "./Message"

const PasswordComp = ({ mode }) => {
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""

	const [oldPassword, setOldPassword] = useState(() => "")
	const [newPassword, setNewPassword] = useState(() => "")
	const [confirmPassword, setConfirmPassword] = useState(() => "")
	const [machineIP, setMachineIP] = useState("")


		useEffect(() => {
		console.log(userDetails, 'userDetails');
		getPublicIP()
		}, []);


		const getPublicIP = async () => {
		try {
		const res = await axios.get("https://api.ipify.org?format=json");
		setMachineIP(res?.data?.ip)
		} catch (err) {
		console.error(err);
		}
		};

	const handlePasswordUpdate = async () => {
		const creds = {
			emp_id: userDetails?.emp_id,
			old_pwd: oldPassword,
			new_pwd: newPassword,
			modified_by: userDetails?.emp_id,
			branch_code: userDetails?.brn_code,
            in_out_flag: "P",
            flag : "W",
            myIP: machineIP
		}

		// console.log("credscreds ", creds);

		await axios
			.post(`${url}/change_password`, creds)
			.then((res) => {
				Message("success", "Password changed successfully")
				console.log("PASSWWWWWWWDDDDDDDDDD", res?.data)
				navigate("/")
				localStorage.clear()
			})
			.catch((err) => {
				Message("error", "Some error occurred while changing password")
			})
	}

	return (
		<div className="max-w-sm mx-auto">
			<div className="mb-5 relative">
				<TDInputTemplateBr
					placeholder="*****"
					type="password"
					label="Old password"
					name="password"
					formControlName={oldPassword}
					handleChange={(e) => setOldPassword(e.target.value)}
					// handleBlur={""}
					mode={1}
				/>
			</div>
			<div className="mb-5">
				<TDInputTemplateBr
					placeholder="*****"
					type="password"
					label="New password"
					name="password"
					formControlName={newPassword}
					handleChange={(e) => setNewPassword(e.target.value)}
					// handleBlur={""}
					mode={1}
				/>
			</div>
			<div className="mb-5">
				<TDInputTemplateBr
					placeholder="*****"
					type="password"
					label="Confirm password"
					name="password"
					formControlName={confirmPassword}
					handleChange={(e) => setConfirmPassword(e.target.value)}
					// handleChange={""}
					// handleBlur={""}
					mode={1}
				/>
			</div>
			<div className="flex items-start mb-5">
				{/* <div className="flex items-center h-5">
					<input
						id="remember"
						type="checkbox"
						value=""
						className="w-4 h-4 border border-green-900 rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
						required
					/>
				</div>
				<label
					for="remember"
					className="ms-2 text-sm font-medium text-blue-900 dark:text-gray-300"
				>
					Show Password
				</label> */}
			</div>
			<div className="flex justify-between">
				<button
					onClick={() => {
						if (newPassword !== confirmPassword) {
							Message("error", "New and Confirm password must be equal")
							return
						}
						handlePasswordUpdate()
					}}
					className="text-white bg-blue-900 hover:bg-
      blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-400"
				>
					Submit
				</button>
			</div>
		</div>
	)
}

export default PasswordComp

import React, { useState, createContext, useEffect } from "react"
import axios from "axios"
import { url } from "../Address/BaseUrl"

export const loadingContext = createContext()

const loaderProvider = {}

function Democontext({ children }) {
	const [loading, setLoading] = useState(false)
	loaderProvider.loading = loading
	loaderProvider.setLoading = setLoading
	const [machineIP, setMachineIP] = useState("")


	useEffect(()=>{
		getPublicIP();
	},[loading])

	const getPublicIP = async () => {
	try {
	const res = await axios.get("https://api.ipify.org?format=json");
	setMachineIP(res.data.ip)
	// console.log("Public IP: ", res.data.ip);
	} catch (err) {
	console.error(err);
	}
	};


	const handleLogOut = async () => {
		
		const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
		setLoading(true)
		const creds = {
			emp_id: userDetails?.emp_id,
			session_id: localStorage.getItem("session_id"),
			modified_by: userDetails?.emp_id,
			myIP: machineIP,
			in_out_flag:"O",
			flag:'W',
			branch_code:userDetails?.brn_code
		}
		console.log(creds, 'login____');
		// console.log(creds);
		await axios
			.post(`${url}/logout`, creds)
			.then((res) => {
				if (res.data.suc === 1) {
					localStorage.clear()
				} else {
					console.error("Logout failed:", res.data.msg)
				}
			})
			.catch((err) => {
				console.error(err)
			})
		setLoading(false)
	}

	return (
		<loadingContext.Provider value={{ loading, handleLogOut }}>
			{children}
		</loadingContext.Provider>
	)
}

export { Democontext, loaderProvider }

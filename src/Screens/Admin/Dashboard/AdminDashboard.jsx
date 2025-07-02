import React, { useEffect } from "react"
import Sidebar from "../../../Components/Sidebar"
import { url } from "../../../Address/BaseUrl"
import axios from "axios"

function AdminDashboard() {
	// const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""

	// useEffect(()=>{
	// 	axios.post(`${url}/user_menu/get_menu`,{user_type_id:userDetails.id}).then(res=>console.log(res.data))
	// },[])
	const userDetails = JSON.parse(localStorage.getItem("user_details"));
	const type = userDetails.id==5?"General User":userDetails.id==10?"HO User":"Admin"

	return (
		<div>
			<Sidebar mode={2} />
			<div className="text-3xl text-slate-800 p-10">
				Hi, I'm Dashboard of {type}! Coming soon...
			</div>
		</div>
	)
}

export default AdminDashboard

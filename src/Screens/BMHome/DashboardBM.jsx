import React from "react"
import Sidebar from "../../Components/Sidebar"

function DashboardBM() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const type = userDetails.id==2?"BM":"Admin 2"

	return (
		<div>
			<Sidebar mode={2} />
			<div className="text-3xl text-slate-800 p-10">
				Hi, I'm Dashboard of {type}! Coming soon...
			</div>
		</div>
	)
}

export default DashboardBM

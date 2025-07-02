import React from "react"
import Sidebar from "../../Components/Sidebar"

function DashboardMis() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""

	return (
		<div>
			<Sidebar mode={1} />
			<div className="text-3xl text-slate-800 p-10">
				Hi, I'm Dashboard of Mis Assistant! Coming soon...
			</div>
		</div>
	)
}

export default DashboardMis

import React, { useState } from "react"
import Sidebar from "../../Components/Sidebar"
import Payroll from "../Admin/Payroll/Payroll"

function AttendanceBM() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""

	return (
		<div>
			<Sidebar mode={2} />
			<Payroll branchCode={+userDetails?.brn_code} />
		</div>
	)
}

export default AttendanceBM

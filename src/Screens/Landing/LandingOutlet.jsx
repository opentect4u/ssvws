import React from "react"
import { Outlet } from "react-router-dom"

function LandingOutlet() {
	console.log("LandingOutlet")

	return (
		<div>
			<Outlet />
		</div>
	)
}

export default LandingOutlet

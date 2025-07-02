import React from "react"
import { Outlet } from "react-router-dom"

function AuthMis() {
	console.log("auth")

	return (
		<div>
			<Outlet />
		</div>
	)
}

export default AuthMis

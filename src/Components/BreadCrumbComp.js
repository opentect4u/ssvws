import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { pathMap, routes } from "../Assets/Data/Paths"
import { Segmented } from "antd"

function BreadCrumbComp() {
	let pathnames = []
	const navigate = useNavigate()
	const location = useLocation()
	const paths = location.pathname.split("/")
	console.log(paths[paths.length - 1])
	paths.forEach(
		(e) =>
			isNaN(e) &&
			e != "purchaseorderform" &&
			e != "purchaseorder" &&
			pathnames.push({ label: pathMap[e], value: e })
	)

	return (
		<>
			<div className="col-span-4 space-y-2 my-4">
				<Segmented
					itemActiveBg="#08453c"
					className="shadow-lg font-sans capitalize"
					value={
						isNaN(paths[paths.length - 1])
							? paths[paths.length - 1]
							: paths[paths.length - 2]
					}
					options={pathnames}
					onChange={(value) => {
						console.log(value) // string
						if (!value.includes("form") && !value.includes("Comp"))
							navigate(routes[value])
					}}
				/>
			</div>
		</>
	)
}

export default BreadCrumbComp

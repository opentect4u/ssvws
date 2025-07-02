import React from "react"
import { Button, Result } from "antd"
import { useNavigate } from "react-router-dom"

function Notfound() {
	console.log("notfound")
	const navigate = useNavigate()

	return (
		<Result
			status="404"
			title="404"
			subTitle="Sorry, the page you visited does not exist."
			extra={
				<Button className="bg-red-800 text-white" onClick={() => navigate(-1)}>
					Back
				</Button>
			}
		/>
	)
}

export default Notfound

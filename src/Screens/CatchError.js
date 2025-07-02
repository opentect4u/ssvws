import React from "react"
import { Button, Result } from "antd"
import { useNavigate, useParams } from "react-router-dom"

function CatchError() {
	const navigate = useNavigate()
	const params = useParams()

	return (
		<Result
			status="500"
			title={params.code}
			subTitle={"Sorry, " + params.message}
			extra={
				<Button className="bg-red-800 text-white" onClick={() => navigate(-1)}>
					Back{" "}
				</Button>
			}
		/>
	)
}

export default CatchError

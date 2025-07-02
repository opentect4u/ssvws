import axios from "axios"
import { url } from "../Address/BaseUrl"

export const refreshToken = async () => {
	try {
		const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
		const response = await axios.post(
			`${url}/refresh`,
			{
				emp_id: userDetails?.emp_id,
				session_id: localStorage.getItem("session_id"),
			},
			{
				headers: {
					Authorization: `${localStorage.getItem("server_token")}`,
				},
			}
		)
		console.log("VERIFY TOKEN RES === Called", response)
		return response
	} catch (error) {
		console.log("VERIFY TOKEN ERR === Called", error)
		return error
	}
}

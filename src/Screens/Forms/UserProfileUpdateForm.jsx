import React, { useEffect, useState } from "react"
import { routePaths } from "../../Assets/Data/Routes"
import { useNavigate } from "react-router-dom"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"

const UserProfileUpdateForm = ({ mode }) => {
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [branches, setBranches] = useState(() => [])
	const [userTypes, setUserTypes] = useState(() => [])

	const [formData, setFormData] = useState({
		emp_id: "",
		emp_name: "",
		branch_code: "",
		user_type: "",
	})

	const handleFormChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}))
	}

	const handleFetchBranches = async () => {
		await axios
			.get(`${url}/admin/fetch_branch`)
			.then((res) => {
				setBranches(res?.data?.msg)
			})
			.catch((err) => {
				console.log("Some error")
			})
	}

	const handleFetchUserTypes = async () => {
		await axios
			.get(`${url}/get_user_type`)
			.then((res) => {
				setUserTypes(res?.data?.msg)
			})
			.catch((err) => {
				console.log("Errrr", err)
			})
	}

	useEffect(() => {
		handleFetchBranches()
		handleFetchUserTypes()
	}, [])

	// const handleUpdateProfile = async () => {
	// 	const creds = {
	// 		emp_name: formData.u_name,
	// 		branch_id: formData.u_branch_code,
	// 		// phone_home: formData.u_phone,
	// 		phone_mobile: formData.u_phone,
	// 		email: formData.u_email,
	// 		gender: formData.u_gender,
	// 		emp_id: userDetails?.emp_id,
	// 	}
	// 	await axios
	// 		.post(`${url}/admin/save_profile_web`, creds)
	// 		.then((res) => {
	// 			console.log(res.data)
	// 			Message("success", "Profile updated successfully!")
	// 		})
	// 		.catch((err) => {
	// 			console.log("Errr occurred!!!", err)
	// 		})
	// }

	const fetchProfileDetails = async () => {
		const creds = {
			emp_id: userDetails?.emp_id || "",
			id: userDetails?.id || "",
		}

		await axios
			.post(`${url}/user_profile_details`, creds)
			.then((res) => {
				console.log(res?.data?.msg.filter(e=>+e.branch_assign_id==+userDetails.brn_code)[0])
				// setMasterData(res?.data?.msg)
				setFormData({
					emp_id: res?.data?.msg[0]?.emp_id,
					branch_code: res?.data?.msg.filter(e=>+e.branch_assign_id==+userDetails.brn_code)[0]?.branch_assign_id || +userDetails.brn_code,
					user_type: res?.data?.msg[0]?.user_type,
				})
			})
			.catch((err) => {
				console.log("Errr", err)
				Message("error", "Some error while fetching profile details...")
			})
	}

	useState(() => {
		fetchProfileDetails()
	}, [])

	return (
		<div className="max-w-sm mx-auto">
			<div className="grid grid-cols-2 gap-4 justify-between">
				<div className="sm:col-span-2">
					<TDInputTemplateBr
						placeholder="Employee ID..."
						type="text"
						label="Employee ID"
						name="emp_id"
						formControlName={formData.emp_id}
						handleChange={(e) => handleFormChange("emp_id", e.target.value)}
						mode={1}
						disabled
					/>
				</div>
				<div className="sm:col-span-2">
					<TDInputTemplateBr
						placeholder="Employee Name..."
						type="text"
						label="Employee Name"
						name="emp_name"
						formControlName={userDetails?.emp_name}
						handleChange={(e) => handleFormChange("emp_name", e.target.value)}
						mode={1}
						disabled
					/>
				</div>
				<div>
					{/* <TDInputTemplateBr
						placeholder="Branch Name"
						type="text"
						label="Branch Name"
						name="u_branch_name"
						formControlName={formData.u_branch_code || userDetails?.brn_code}
						handleChange={(e) =>
							handleFormChange("u_branch_code", e.target.value)
						}
						// handleBlur={""}
						mode={1}
					/> */}

					<TDInputTemplateBr
						placeholder="Branch..."
						type="text"
						label="Branch"
						name="branch_code"
						formControlName={formData.branch_code}
						handleChange={(e) =>
							handleFormChange("branch_code", e.target.value)
						}
						data={branches?.map((item, i) => ({
							code: item?.branch_code,
							name: item?.branch_name,
						}))}
						mode={2}
						disabled
					/>
				</div>
				<div>
					<TDInputTemplateBr
						placeholder="User Type..."
						type="text"
						label="User Type"
						name="user_type"
						formControlName={formData.user_type}
						handleChange={(e) => handleFormChange("user_type", e.target.value)}
						mode={2}
						data={userTypes?.map((item, i) => ({
							code: item?.type_code,
							name: item?.user_type,
						}))}
						disabled
					/>
				</div>
				{/* <div className="mb-5">
					<TDInputTemplateBr
						placeholder="Email ID"
						type="email"
						label="Email ID"
						name="u_email"
						formControlName={formData.u_email || userDetails?.email}
						handleChange={(e) => handleFormChange("u_email", e.target.value)}
						// handleBlur={""}
						mode={1}
					/>
				</div> */}

				{/* <div className="mb-5">
					<TDInputTemplateBr
						placeholder="Select Gender..."
						type="text"
						label="Gender"
						name="u_gender"
						formControlName={formData.u_gender || userDetails?.gender}
						handleChange={(e) => handleFormChange("u_gender", e.target.value)}
						// handleBlur={""}
						data={[
							{ code: "M", name: "Male" },
							{ code: "F", name: "Female" },
							{ code: "O", name: "Others" },
						]}
						mode={2}
					/>
				</div> */}
			</div>

			{/* <div className="flex justify-between">
				<button
					onClick={() => handleUpdateProfile()}
					className="text-white bg-blue-900 hover:bg-
      blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-full px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-400"
				>
					Update
				</button>
			</div> */}
		</div>
	)
}

export default UserProfileUpdateForm

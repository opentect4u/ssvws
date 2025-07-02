import React, { useState } from "react"
import "../../LoanForm/LoanForm.css"
import "../../BMHome/EditLoanFormBMStyles.css"
import { useParams } from "react-router"
import { useNavigate } from "react-router-dom"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import FormHeader from "../../../Components/FormHeader"
import { useLocation } from "react-router"
import Sidebar from "../../../Components/Sidebar"
import CreateUserForm from "../../Forms/Admin/CreateUserForm"

function CreateUser() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const { loanAppData } = location.state || {}
	const navigate = useNavigate()

	return (
		<>
			<Sidebar mode={2} />
			<section className="dark:bg-[#001529] flex justify-center align-middle p-5">
				<div className="px-1 py-5 w-4/5 min-h-screen rounded-3xl">
					<div className="w-auto mx-14 my-4">
						<FormHeader text="Add/Edit User" mode={2} />
					</div>
					<Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-blue-800 dark:text-gray-400"
						spinning={loading}
					>
						<div className="card shadow-lg bg-white border-2 p-5 px-10 py-10 mx-16  rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
							<CreateUserForm />
						</div>
					</Spin>
				</div>
			</section>
		</>
	)
}

export default CreateUser

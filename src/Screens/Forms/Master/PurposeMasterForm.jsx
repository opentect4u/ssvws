import React, { useEffect, useState } from "react"
import "../../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../../Components/BtnComp"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Message } from "../../../Components/Message"
import { url } from "../../../Address/BaseUrl"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import DialogBox from "../../../Components/DialogBox"

function PurposeMasterForm() {
	const params = useParams()

	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const masterDetails = location.state || {}

	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const [states, setStates] = useState(() => [])
	const [visible, setVisible] = useState(() => false)

	console.log(params, "params")
	console.log(location, "location")

	const [masterData, setMasterData] = useState({
		purpose_name: "",
		subpurpose_name: "",
	})

	const handleChangeMaster = (e) => {
		const { name, value } = e.target
		setMasterData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const fetchPurposeData = async () => {
		const creds = {
			purp_id: masterDetails?.purp_id,
		}
		await axios
			.post(`${url}/admin/fetch_purp_data`, creds)
			.then((res) => {
				console.log("resdsssadsdjkcfsduykfgvtdz uy", res?.data)
				if (res?.data?.suc == 1) {
					setMasterData({
						purpose_name: res?.data?.msg[0]?.purpose_id || "",
						subpurpose_name: res?.data?.msg[0]?.sub_purpose || "",
					})
				}
			})
			.catch((err) => {
				console.log("ERRR", err)
			})
	}

	useEffect(() => {
		fetchPurposeData()
	}, [])

	const handleSaveMaster = async () => {
		setLoading(true)
		// const creds_add = {
		// 	desig_type: masterData?.desig_name,
		// 	created_by: userDetails?.emp_id,
		// }

		// const creds_edit = {
		// 	desig_code: +params.id,
		// 	desig_type: masterData?.desig_name,
		// 	modified_by: userDetails?.emp_id,
		// }

		const creds = {
			purp_id: masterDetails?.purp_id,
			purpose_id: masterData.purpose_name,
			sub_purpose: masterData.subpurpose_name,
			created_by: userDetails?.emp_id,
			modified_by: userDetails?.emp_id,
		}
		// const creds = params.id > 0 ? creds_edit : creds_add
		await axios
			.post(`${url}/admin/save_purpose`, creds)
			.then((res) => {
				Message("success", "Purpose details saved.")
				navigate(-1)
			})
			.catch((err) => {
				Message("error", "Some error occurred.")
				console.log("ERR", err)
			})
		setLoading(false)
	}

	const onSubmit = (e) => {
		e.preventDefault()
		setVisible(true)
	}

	const onReset = () => {
		setMasterData({
			desig_name: "",
			state_id: "",
		})
	}

	return (
		<>
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<form onSubmit={onSubmit}>
					<div>
						<div>
							<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
								<div>
									<TDInputTemplateBr
										placeholder="Purpose..."
										type="text"
										label="Purpose"
										name="purpose_name"
										formControlName={masterData.purpose_name}
										handleChange={handleChangeMaster}
										mode={1}
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Subpurpose..."
										type="text"
										label="Subpurpose"
										name="subpurpose_name"
										formControlName={masterData.subpurpose_name}
										handleChange={handleChangeMaster}
										mode={1}
									/>
								</div>
							</div>
						</div>

						<div className="mt-10">
							<BtnComp mode="A" onReset={onReset} />
						</div>
					</div>
				</form>
			</Spin>

			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					if (!masterData.subpurpose_name || !masterData.purpose_name) {
						Message("warning", "Fill all the values properly!")
						setVisible(false)
						return
					}
					handleSaveMaster()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>
		</>
	)
}

export default PurposeMasterForm

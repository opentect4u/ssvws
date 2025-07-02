import React, { useEffect, useState } from "react"
import "../../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../../Components/BtnComp"
import VError from "../../../Components/VError"
import { useNavigate } from "react-router-dom"
// import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Message } from "../../../Components/Message"
import { url } from "../../../Address/BaseUrl"
import { Badge, Spin, Card } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"
import DialogBox from "../../../Components/DialogBox"
// import { disableInputArray } from "./disableInputArray"
import { disableCondition } from "../disableCondition"

function DesignationMasterForm() {
        const params = useParams()
    
    const [loading, setLoading] = useState(false)
	const location = useLocation()
	const bankMasterDetails = location.state || {}

	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const [visible, setVisible] = useState(() => false)

	// const formattedDob = formatDateToYYYYMMDD(memberDetails?.dob)

	console.log(params, "params")
	console.log(location, "location")
	// console.log(memberDetails, "memberDetails")

	const [masterBankData, setMasterBankData] = useState({
		desig_name: "",
		// branch_name: "",
		// ifsc: "",
		// branch_addr: "",
		// sol_id: "",
		// phone_no: "",
	})

	const handleChangeMasterBank = (e) => {
		const { name, value } = e.target
		setMasterBankData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	useEffect(() => {
		setMasterBankData({
			desig_name: bankMasterDetails?.desig_type || "",
			// branch_name: bankMasterDetails?.branch_name || "",
			// ifsc: bankMasterDetails?.ifsc || "",
			// branch_addr: bankMasterDetails?.branch_addr || "",
			// sol_id: bankMasterDetails?.sol_id || "",
			// phone_no: bankMasterDetails?.phone_no || "",
		})
	}, [])

	const handleSaveBankMaster = async () => {
		setLoading(true)
		const creds_add = {
			desig_type: masterBankData?.desig_name,
			created_by: userDetails?.emp_id,
		}

        const creds_edit={
            desig_code: +params.id,
			desig_type: masterBankData?.desig_name,
			modified_by: userDetails?.emp_id,
        }
        const creds = params.id>0?creds_edit:creds_add
		await axios
			.post(`${url}/admin/save_designation`, creds)
			.then((res) => {
				console.log("desig details saved.", res?.data)
				Message("success", "Designation details saved.")
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
		setMasterBankData({
			desig_name: "",
			// branch_name: "",
			// ifsc: "",
			// branch_addr: "",
			// sol_id: "",
			// phone_no: "",
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
							<div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
								<div className="sm:col-span-3">
									<TDInputTemplateBr
										placeholder="Designation..."
										type="text"
										label="Designation"
										name="desig_name"
										formControlName={masterBankData.desig_name}
										handleChange={handleChangeMasterBank}
										mode={1}
									/>
								</div>
								{/* <div>
									<TDInputTemplateBr
										placeholder="Bank Branch Name..."
										type="text"
										label="Bank Branch Name"
										name="branch_name"
										formControlName={masterBankData.branch_name}
										handleChange={handleChangeMasterBank}
										mode={1}
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="IFSC..."
										type="text"
										label="IFSC"
										name="ifsc"
										formControlName={masterBankData.ifsc}
										handleChange={handleChangeMasterBank}
										mode={1}
									/>
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Type SOL ID..."
										type="text"
										label="SOL. ID."
										name="sol_id"
										formControlName={masterBankData.sol_id}
										handleChange={handleChangeMasterBank}
										mode={1}
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Type Phone No..."
										type="text"
										label="Phone Number"
										name="phone_no"
										formControlName={masterBankData.phone_no}
										handleChange={handleChangeMasterBank}
										mode={1}
									/>
								</div>
								<div className="sm:col-span-3">
									<TDInputTemplateBr
										placeholder="Type Branch Address..."
										type="text"
										label="Branch Address"
										name="branch_addr"
										formControlName={masterBankData.branch_addr}
										handleChange={handleChangeMasterBank}
										mode={3}
									/>
								</div> */}
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
					if (
						!masterBankData.desig_name 
						
					) {
						Message("warning", "Fill all the values properly!")
						setVisible(false)
						return
					}
					handleSaveBankMaster()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>
		</>
	)
}

export default DesignationMasterForm

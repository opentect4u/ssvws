import React, { useEffect, useState } from "react"
import "../../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../../Components/BtnComp"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Message } from "../../../Components/Message"
import { url } from "../../../Address/BaseUrl"
import { Badge, Spin, Card, Popconfirm } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import DialogBox from "../../../Components/DialogBox"
import { MultiSelect } from "primereact/multiselect"
function CreateUserForm() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const [branches, setBranches] = useState(() => [])
	const [designations, setDesignations] = useState(() => [])
	const [designation, setDesignation] = useState(() => [])
	const location = useLocation()
	const userMasterDetails = location.state || {}

	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const [visible, setVisible] = useState(() => false)

	// const formattedDob = formatDateToYYYYMMDD(memberDetails?.dob)
	const [selectedBranches, setSelectedBranches] = useState([])
	const cities = [
		{ name: "New York", code: "NY" },
		{ name: "Rome", code: "RM" },
		{ name: "London", code: "LDN" },
		{ name: "Istanbul", code: "IST" },
		{ name: "Paris", code: "PRS" },
	]
	console.log(params, "params")
	console.log(location, "location")
	// console.log(memberDetails, "memberDetails")

	const [userTypes, setUserTypes] = useState(() => [])
	const [masterUserData, setMasterUserData] = useState({
		emp_id: "", // onBlur search to fetch
		emp_name: "",
		branch: "", // dropdown - prefetched id
		designation: "", // dropdown - prefetched id
		user_type: "", // dropdown - CO, BM, MIS Asst., Admin
		active_flag: "",
		remarks: "",
		finance_module: "N",
	})

	const handleChangeForm = (e) => {
		const { name, type, checked, value } = e.target
		if (type === "checkbox" && name === "finance_module") {
			setMasterUserData((prev) => ({
				...prev,
				finance_module: checked ? "Y" : "N",
			}))
		} else {
			setMasterUserData((prev) => ({
				...prev,
				[name]: value,
			}))
		}
	}

	const handleFetchBranches = async () => {
		setLoading(true)
		await axios
			.get(`${url}/fetch_all_branch_dt`)
			.then((res) => {
				console.log("QQQQQQQQQQQQQQQQ", res?.data)
				setBranches(
					res?.data?.msg.map((item) => {
						return { code: item.branch_code, name: item.branch_name }
					})
				)
			})
			.catch((err) => {
				console.log("?????????????????????", err)
			})

		setLoading(false)
	}
	useEffect(() => {
		axios
			.get(`${url}/admin/fetch_branch`)
			.then((res) => {
				setBranches(
					res?.data?.msg.map((item) => {
						return {
							code: item.branch_code,
							name: item.branch_name,
						}
					})
				)
			})
			.catch((err) => {
				console.log("Some error")
			})

		if (params.id > 0) {
			axios
				.post(`${url}/fetch_assign_branch`, {
					emp_id: userMasterDetails.emp_id,
				})
				.then((res) => {
					console.log(res)
					if (res?.data?.msg?.length) {
						setSelectedBranches(res?.data?.msg)
					}
				})
		}
	}, [])
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

	// const fetchParticularEmployeeDetails = async () => {
	// 	const creds = {
	// 		branch_code: userMasterDetails?.branch_id,
	// 		emp_id: params?.id,
	// 	}
	// 	await axios
	// 		.post(`${url}/fetch_emp`, creds)
	// 		.then((res) => {
	// 			console.log("+-----------------+", res?.data)
	// 			// setMasterEmployeeData()

	// 			setMasterUserData({
	// 				emp_id: res?.data?.msg[0]?.active_flag || "", // onBlur search to fetch
	// 				emp_name: res?.data?.msg[0]?.emp_name || "",
	// 				branch: res?.data?.msg[0]?.branch || "", // dropdown - prefetched id
	// 				user_type: res?.data?.msg[0]?.user_type || "", // dropdown - CO, BM, MIS Asst., Admin
	// 			})
	// 		})
	// 		.catch((err) => {
	// 			console.log("=======", err)
	// 		})
	// }

	// useEffect(() => {
	// 	if (params?.id > 0) {
	// 		fetchParticularEmployeeDetails()
	// 	}
	// }, [])

	useEffect(() => {
		if (+params?.id > 0) {
			setMasterUserData({
				finance_module: userMasterDetails?.finance_toggle || "N",
				emp_id: userMasterDetails?.emp_id || "",
				emp_name: userMasterDetails?.emp_name || "",
				branch: userMasterDetails?.brn_code || "",
				designation: userMasterDetails?.desig_code || "",
				user_type: userMasterDetails?.user_type || "",
				active_flag: userMasterDetails?.user_status || "A",
				remarks: userMasterDetails?.deactive_remarks || "",
			})
		}
	}, [userMasterDetails])

	const findEmployeeById = async () => {
		if (!masterUserData.emp_id) return
		setLoading(true)
		const creds = {
			emp_id: masterUserData.emp_id,
		}

		console.log("FIND ===", creds)
		await axios
			.post(`${url}/fetch_empl_dtls`, creds)
			.then((res) => {
				if (res?.data?.msg?.length === 0) {
					Message("warning", "No employee found!")
					setMasterUserData((prev) => ({
						...prev,
						emp_id: "",
						emp_name: "",
						designation: "",
						branch: "", // dropdown - prefetched id
						user_type: "", // dropdown - CO, BM, MIS Asst., Admin
						finance_module: "",
					}))
					return
				}

				if ("user_type" in res?.data?.msg[0]) {
					Message(
						"warning",
						res?.data?.details +
							" Name: " +
							res?.data?.msg[0]?.emp_name +
							" Branch: " +
							res?.data?.msg[0]?.branch_id
					)
					onReset()
					return
				}

				setMasterUserData((prev) => ({
					...prev,
					emp_name: res?.data?.msg[0]?.emp_name,
					branch: res?.data?.msg[0]?.branch_id,
					designation: res?.data?.msg[0]?.designation,
				}))
			})
			.catch((err) => {
				Message("error", "Some error while fetching user details.")
				console.log("Errr", err)
			})
		setLoading(false)
	}

	const handleSaveForm = async () => {
		setLoading(true)
		if (
			((masterUserData.user_type == 3 ||
				masterUserData.user_type == 10 ||
				masterUserData.user_type == 11) &&
				selectedBranches) ||
			(masterUserData.user_type != 3 &&
				masterUserData.user_type != 10 &&
				masterUserData.user_type != 11)
		) {
			const credsForSave = {
				finance_toggle: masterUserData.finance_module || "N",
				emp_id: masterUserData.emp_id || "",
				brn_code: masterUserData.branch || 0,
				user_type: masterUserData.user_type || "Y",
				designation: masterUserData.designation || "Y",
				created_by: userDetails?.emp_id || "",
				modified_by: userDetails?.emp_id || "",
				assigndtls:
					selectedBranches?.map((item) => {
						return { branch_assign_id: item.code }
					}) || [],
			}

			await axios
				.post(`${url}/save_user_dt`, credsForSave)
				.then((res) => {
					console.log("User details saved.", res?.data)
					Message("success", "User details saved.")
					// navigate(-1)
				})
				.catch((err) => {
					Message("error", "Some error occurred.")
					console.log("ERR", err)
				})
			setLoading(false)
		} else {
			setLoading(false)
			Message("warning", "Please assign branche(s) before saving!")
		}
	}

	const handleUpdateForm = async () => {
		setLoading(true)
		console.log(masterUserData)
		if (
			((masterUserData.user_type == 3 ||
				masterUserData.user_type == 10 ||
				masterUserData.user_type == 11) &&
				selectedBranches) ||
			(masterUserData.user_type != 3 &&
				masterUserData.user_type != 10 &&
				masterUserData.user_type != 11)
		) {
			const creds = {
				finance_toggle: masterUserData.finance_module || "N",
				emp_id: masterUserData.emp_id || "",
				branch_code: masterUserData.branch || 0,
				user_type: masterUserData.user_type || "Y",
				user_status: masterUserData.active_flag || "A",
				user_status: masterUserData.active_flag || "A",
				designation: masterUserData.designation || "",
				modified_by: userDetails?.emp_id || "",
				created_by: userDetails?.emp_id || "",
				remarks: masterUserData.remarks || "",
				deactivated_by: userDetails?.emp_id || "",
				assigndtls: selectedBranches.map((item) => {
					return { branch_assign_id: item.code }
				}),
			}

			await axios
				.post(`${url}/edit_user_dt`, creds)
				.then((res) => {
					console.log("User details updated.", res?.data)
					Message("success", "User details updated.")
					navigate(-1)
				})
				.catch((err) => {
					Message("error", "Some error occurred.")
					console.log("ERR", err)
				})
			setLoading(false)
		} else {
			setLoading(false)
			Message("warning", "Please assign branche(s) before saving!")
		}
	}

	const onSubmit = (e) => {
		e.preventDefault()
		setVisible(true)
	}
	useEffect(() => {
		axios.get(url + "/get_designation").then((res) => {
			console.log("Designation", res.data.msg)
			setDesignations(res.data.msg)
		})
	}, [])

	const onReset = () => {
		setMasterUserData({
			emp_id: "", // onBlur search to fetch
			emp_name: "",
			designation: "",
			branch: "", // dropdown - prefetched id
			user_type: "", // dropdown - CO, BM, MIS Asst., Admin
			finance_module: "N",
		})
	}

	const confirm = async (itemToDelete) => {
		setLoading(true)
		const creds = {
			emp_id: masterUserData.emp_id || "",
			branch_code: masterUserData.branch || 0,
			modified_by: userDetails?.emp_id || "",
		}
		axios
			.post(`${url}/reset_password`, creds)
			.then((res) => {
				Message("success", "Password reset done.")
				navigate(-1)
			})
			.catch((err) => {
				Message("error", "Some error occurred")
			})
		setLoading(false)
	}

	const cancel = (e) => {
		console.log(e)
		// message.error('Click on No');
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
							<div className="grid gap-4 sm:grid-cols-6 sm:gap-6">
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Employee ID..."
										type="text"
										label="Employee ID"
										name="emp_id"
										formControlName={masterUserData.emp_id}
										handleChange={handleChangeForm}
										handleBlur={findEmployeeById}
										mode={1}
										disabled={+params?.id > 0}
									/>
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Employee Name..."
										type="text"
										label="Employee Name"
										name="emp_name"
										formControlName={masterUserData.emp_name}
										handleChange={handleChangeForm}
										mode={1}
									/>
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Branch..."
										type="text"
										label="Branch"
										name="branch"
										formControlName={masterUserData.branch}
										handleChange={handleChangeForm}
										mode={2}
										// data={branches?.map((item, i) => ({
										// 	code: item?.branch_code,
										// 	name: item?.branch_name,
										// }))}
										data={branches}
										disabled={true}
									/>
								</div>
								<div className="sm:col-span-3">
									<TDInputTemplateBr
										placeholder="Designation"
										type="text"
										label="Designation"
										name="designation"
										formControlName={masterUserData.designation}
										handleChange={handleChangeForm}
										mode={2}
										data={designations?.map((item, i) => ({
											code: item?.desig_code,
											name: item?.desig_type,
										}))}
										// disabled={+params?.id > 0}
									/>
								</div>
								<div className={"sm:col-span-3"}>
									<TDInputTemplateBr
										placeholder="User Type..."
										type="text"
										label="User Type"
										name="user_type"
										formControlName={masterUserData.user_type}
										handleChange={handleChangeForm}
										mode={2}
										// data={[
										// 	{ code: "1", name: "Credit Officer" },
										// 	{ code: "2", name: "Branch Manager" },
										// 	{ code: "3", name: "MIS Assistant" },
										// 	{ code: "4", name: "Administrator" },
										// ]}
										data={userTypes?.map((item, i) => ({
											code: item?.type_code,
											name: item?.user_type,
										}))}
									/>
								</div>

								<div className={"sm:col-span-3"}>
									<label class="inline-flex items-center me-5 cursor-pointer">
										<input
											type="checkbox"
											value={masterUserData.finance_module}
											name="finance_module"
											class="sr-only peer"
											onChange={handleChangeForm}
											checked={masterUserData.finance_module === "Y"}
										/>
										<div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-500 dark:peer-checked:bg-teal-500"></div>
										<span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
											Assign to Finance Module as well?
										</span>
									</label>
								</div>

								{(masterUserData.user_type == 3 ||
									masterUserData.user_type == 10 ||
									masterUserData.user_type == 11) && (
									<div className="sm:col-span-6">
										<label className="text-gray-800 font-semibold text-sm my-2">
											Branches
										</label>
										<MultiSelect
											value={selectedBranches}
											onChange={(e) => setSelectedBranches(e.value)}
											options={branches?.filter((i) => i.code != 100)}
											optionLabel="name"
											placeholder="Select branch(es)"
											maxSelectedLabels={3}
											className="w-full md:w-20rem my-1.5"
										/>
									</div>
								)}
								{+params?.id > 0 && (
									<>
										<div className="sm:col-span-3">
											<TDInputTemplateBr
												placeholder="Active Flag..."
												type="text"
												label="Active Flag"
												name="active_flag"
												formControlName={masterUserData.active_flag}
												handleChange={handleChangeForm}
												mode={2}
												data={[
													{ code: "A", name: "Active" },
													{ code: "I", name: "Inactive" },
												]}
											/>
										</div>
										<div className="sm:col-span-6">
											<TDInputTemplateBr
												placeholder="Remarks..."
												type="text"
												label="Remarks"
												name="remarks"
												formControlName={masterUserData.remarks}
												handleChange={handleChangeForm}
												mode={3}
											/>
										</div>
									</>
								)}
							</div>
							{+params?.id > 0 && (
								<div className="float-right pt-4">
									<Popconfirm
										title={`Reset Passowrd`}
										description={
											<>
												<div>Are you sure you want to reset password?</div>
												<div>Password will be, "SSVWS@2025"</div>
											</>
										}
										onConfirm={() => confirm()}
										onCancel={cancel}
										okText="Reset"
										cancelText="No"
									>
										<div className="text-red-500 cursor-pointer underline">
											Reset Password?
										</div>
									</Popconfirm>
								</div>
							)}
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
					console.log(masterUserData)

					if (+params?.id > 0) {
						if (masterUserData.active_flag != "A")
							if (
								!masterUserData.emp_id ||
								!masterUserData.emp_name ||
								!masterUserData.branch ||
								!masterUserData.active_flag ||
								!masterUserData.user_type ||
								!masterUserData.remarks ||
								!masterUserData.designation
							) {
								Message("warning", "Fill the details correctly.")
								return
							} else {
								if (
									!masterUserData.emp_id ||
									!masterUserData.emp_name ||
									!masterUserData.branch ||
									!masterUserData.active_flag ||
									!masterUserData.user_type ||
									!masterUserData.designation
								) {
									Message("warning", "Fill the details correctly.")
									return
								}
							}
						handleUpdateForm()
					} else {
						if (
							!masterUserData.emp_id ||
							!masterUserData.emp_name ||
							!masterUserData.branch ||
							!masterUserData.user_type ||
							!masterUserData.designation
						) {
							Message("warning", "Fill the details correctly.")
							return
						}
						handleSaveForm()
					}
					// ;+params?.id > 0 ? handleUpdateForm() : handleSaveForm()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>
		</>
	)
}

export default CreateUserForm

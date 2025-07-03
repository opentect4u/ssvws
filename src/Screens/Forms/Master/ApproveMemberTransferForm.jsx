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
import { Badge, Spin, Card, Select, Tag } from "antd"
import { CheckOutlined, LoadingOutlined, SaveOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"
import DialogBox from "../../../Components/DialogBox"
// import { disableInputArray } from "./disableInputArray"
import { disableCondition } from "../disableCondition"
import { calculateRetirementDate } from "../../../Utils/calculateRetirementDate"
import moment from "moment/moment"

function ApproveMemberTransferForm({ state }) {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const [visible, setVisible] = useState(false)
	const [groups, setGroups] = useState([])
	const [groupsTo, setGroupsTo] = useState([])
	const [group, setGroup] = useState("")
	const [group_to, setGroup_to] = useState("")
	const userDetails = JSON.parse(localStorage.getItem("user_details"))
	const location = useLocation()
	const personalDetails = location.state[0] || {}
	const [co_branch, setCoBranch] = useState("")
	const [co_name, setCoName] = useState("")
	const [from_co_id, setFromCoId] = useState(0)
	const [to_co_id, setCoId] = useState(0)
	const [remarks, setRemarks] = useState("")
	const [to_branch_id, setBranchId] = useState(0)
	const [from_branch_id, setFromBranchId] = useState(0)
	const [co_branch_to, setCoBranch_to] = useState("")
	const [co_name_to, setCoName_to] = useState("")
	const [mem_dtls, setMemDtls] = useState([])
	const navigate = useNavigate()
	const [todayDate, setTodayDate] = useState(
		moment(new Date()).format("YYYY-MM-DD")
	)

	const getGroups = () => {
		setLoading(true)
		axios
			.post(`${url}/fetch_group_name_fr_mem_trans`, {
				branch_code: userDetails.brn_code,
				grp_mem: "",
			})
			.then((res) => {
				if (res?.data?.suc === 1) setGroups(res?.data?.msg)
				else {
					setGroups([])
				}
				setLoading(false)
			})
	}

	const getGroupsTo = (e) => {
		if (e) {
			setLoading(true)
			axios
				.post(`${url}/fetch_group_name_fr_mem_trans`, {
					branch_code: userDetails.brn_code,
					grp_mem: e,
				})
				.then((res) => {
					if (res?.data?.suc === 1) setGroupsTo(res?.data?.msg)
					else {
						setGroupsTo([])
					}
					setLoading(false)
				})
		}
	}
	const fetchGroupDtls = () => {
		setLoading(true)
		axios
			.post(`${url}/transfer_member_view_all_details`, {
				member_code: state.member_code,
				from_group: state.from_group_code,
				flag: "P",
				to_branch: state.to_branch,
			})
			.then((res) => {
				console.log(res?.data?.msg)
				setMemDtls(res?.data?.msg)
				setRemarks(res?.data?.msg[0]?.remarks)

				//   setCoBranch(res?.data?.msg[0]?.branch_name);
				//   setCoName(res?.data?.msg[0]?.co_name);
				//   setFromBranchId(res?.data?.msg[0]?.branch_id);
				//   setFromCoId(res?.data?.msg[0]?.co_id);
				//   axios
				//     .post(`${url}/fetch_group_member_dtls`, { group_code: group })
				//     .then((resMemb) => {
				//       console.log(resMemb?.data?.msg);
				//       for (let i of resMemb?.data?.msg) {
				//         setMemDtls((prev) => [
				//           ...prev,
				//           {
				//             check: false,
				//             client_name: i.client_name,
				//             member_code: i.member_code,
				//             outstanding: i.outstanding,
				//           },
				//         ]);
				//   }
				setLoading(false)
			})

		// }
		// });
	}
	const approveTransferGroup = () => {
		const cred = {
			to_group: state.to_group_code,
			to_co: state.to_co_id,
			to_branch: mem_dtls[0].to_branch_code,
			remarks: remarks,
			approved_by: userDetails.emp_id,
			member_code: state.member_code,
		}

		setLoading(true)
		// console.log(cred);
		axios.post(`${url}/approve_member_trans_dt`, cred).then((res) => {
			console.log(res)
			setLoading(false)
			if (res?.data?.suc) {
				Message("success", res?.data?.msg)
				//   navigate(-1)
			} else {
				Message("error", res?.data?.msg)
			}
		})
	}
	const fetchTransGroupDtls = () => {
		setLoading(true)
		axios
			.post(`${url}/fetch_grp_dtls`, {
				branch_code: userDetails.brn_code,
				group_code: group_to,
			})
			.then((res) => {
				console.log(res?.data?.msg)
				setCoBranch_to(res?.data?.msg[0]?.branch_name)
				setCoName_to(res?.data?.msg[0]?.co_name)
				setBranchId(res?.data?.msg[0]?.branch_id)
				setCoId(res?.data?.msg[0]?.co_id)

				setLoading(false)
				// axios
				//   .post(`${url}/fetch_group_member_dtls`, { group_code: group })
				//   .then((resMemb) => {
				//     console.log(resMemb?.data?.msg);
				//     setMemDtls(resMemb?.data?.msg);
				//     setLoading(false);
				//   });

				// }
			})
	}
	useEffect(() => {
		// fetchGroupDtls()
		getGroups()
		fetchGroupDtls()
		setGroup(state.from_group)
		console.log(state)
	}, [])
	// useEffect(() => {
	//   fetchGroupDtls();
	// }, [group]);
	// useEffect(() => {
	//   fetchTransGroupDtls();
	// }, [group_to]);

	const handleCheck = (index, event) => {
		let dt = [...mem_dtls]
		dt[index]["check"] = event.target.checked ? true : false

		setMemDtls(dt)

		console.log(dt)
	}
	return (
		<>
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<TDInputTemplateBr
							placeholder="Date"
							type="date"
							label="Date"
							name="todayDate"
							formControlName={todayDate}
							handleChange={(e) => setTodayDate(e.target.value)}
							min={"1900-12-31"}
							mode={1}
						/>
					</div>
					<div className="col-span-1">
						<TDInputTemplateBr
							placeholder="From Group"
							type="text"
							label="From Group"
							name="todayDate"
							formControlName={state.from_group}
							// handleChange={(e) => setTodayDate(e.target.value)}
							min={"1900-12-31"}
							disabled
							mode={1}
						/>
					</div>

					<div className="col-span-2">
						<table className="w-full border rounded-md">
							<thead>
								<tr className="bg-slate-700 text-white">
									<th className="px-4 py-2 ">CO Name</th>
									<th className="px-4 py-2 ">CO Branch Name</th>
								</tr>
							</thead>
							<tbody>
								<tr className="bg-slate-300 text-slate-700 text-center">
									<td className="px-4 py-2 text-sm">{state.from_co}</td>
									<td className="px-4 py-2 text-sm">
										{mem_dtls[0]?.from_branch}
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					{mem_dtls.length > 0 && (
						<div className="col-span-2">
							<table className="w-full border ">
								<thead>
									<tr className="bg-slate-700 text-white">
										<th className="px-4 py-2 ">Member Name</th>
										<th className="px-4 py-2 ">Member Code</th>
										{/* <th className="px-4 py-2 ">Outstanding Amount</th> */}
									</tr>
								</thead>
								<tbody>
									{mem_dtls.map((item, index) => (
										<tr className="bg-slate-200 text-center text-slate-700">
											<td className="px-4 py-2 text-sm">{item.client_name}</td>
											<td className="px-4 py-2 text-sm">{item.member_code}</td>
											{/* <td className="px-4 py-2 text-sm">{item.outstanding}</td> */}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
					<div>
						{mem_dtls.length > 0 &&
							mem_dtls.reduce(
								(accumulator, item) => accumulator + item.outstanding,
								0
							) > 0 && (
								<Tag color="red">
									Transfer isn't possible from this group as there is atleast
									one member with a non-zero outstanding amount!
								</Tag>
							)}
					</div>

					<div className="col-span-2">
						<label
							for="frm_co"
							className="block mb-2 text-sm capitalize font-bold text-slate-800
                   dark:text-gray-100"
						>
							Transfer To
						</label>

						<Select
							showSearch
							placeholder={"Group"}
							label="Group"
							name="groups"
							defaultValue={state.to_group}
							filterOption={false}
							onSearch={(e) => getGroupsTo(e)}
							notFoundContent={
								loading ? <Spin size="small" /> : "No results found"
							}
							formControlName={group_to}
							onChange={(value) => {
								console.log(value)
								setGroup_to(value)
							}}
							options={groupsTo?.map((item, _) => ({
								value: item?.group_code,
								label: `${item?.group_name} - ${item?.group_code} `,
							}))}
							mode={2}
						/>
					</div>

					<div className="col-span-2">
						<table className="w-full border rounded-md">
							<thead>
								<tr className="bg-slate-700 text-white">
									<th className="px-4 py-2 ">CO Name</th>
									<th className="px-4 py-2 ">CO Branch Name</th>
								</tr>
							</thead>
							<tbody>
								<tr className="bg-slate-300 text-slate-700 text-center">
									<td className="px-4 py-2 text-sm">{state.to_co}</td>
									<td className="px-4 py-2 text-sm">
										{mem_dtls[0]?.to_branch}
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<>
						<div className="col-span-2">
							<TDInputTemplateBr
								placeholder="Remarks"
								type="text"
								label="Remarks"
								name="remarks"
								formControlName={remarks}
								handleChange={(e) => setRemarks(e.target.value)}
								mode={3}
							/>
						</div>

						<div className="col-span-2 flex justify-center my-2">
							<button
								type="submit"
								className="inline-flex items-center px-5 py-2.5 mt-4 ml-2 sm:mt-6 text-sm font-medium text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900"
								onClick={() => approveTransferGroup()}
							>
								<CheckOutlined className="mr-2" />
								Approve
							</button>
						</div>
					</>
				</div>
			</Spin>

			<DialogBox
				flag={4}
				onPress={() => setVisible(!visible)}
				visible={visible}
				onPressYes={() => {
					if (
						// !masterEmployeeData.bank_name ||
						// !masterEmployeeData.branch_name ||
						// !masterEmployeeData.branch_addr ||
						// !masterEmployeeData.sol_id ||
						// !masterEmployeeData.ifsc
						false
					) {
						Message("warning", "Fill all the values properly!")
						setVisible(false)
						return
					}
					// handleSaveForm()
					setVisible(!visible)
				}}
				onPressNo={() => setVisible(!visible)}
			/>
		</>
	)
}
export default ApproveMemberTransferForm

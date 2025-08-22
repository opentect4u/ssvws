import React, { useEffect, useState } from "react"
import Sidebar from "../../Components/Sidebar"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { Button, Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import LoanApplicationsTableViewBr from "../../Components/LoanApplicationsTableViewBr"
import Radiobtn from "../../Components/Radiobtn"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import LoanRecovApplicationsTableViewBr from "../../Components/LoanRecovApplicationsTableViewBr"
import LoanApprovalApplicationsTableViewBr from "../../Components/LoanApprovalApplicationsTableViewBr"
import { Download } from "lucide-react"
import { grtHeader } from "../../Utils/Reports/headerMap"
import { exportToExcel } from "../../Utils/exportToExcel"
import moment from "moment";
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

const options1 = [
	{
		label: "Pending",
		value: "U",
	},
	{
		label: "Sent to MIS",
		value: "S",
	},
	{
		label: "Approved",
		value: "A",
	},
	{
		label: "Rejected",
		value: "R",
	},
]
const options2 = [
	{
		label: "Sent to MIS",
		value: "S",
	},
	{
		label: "Approved",
		value: "A",
	},
	{
		label: "Rejected",
		value: "R",
	},
]

function HomeScreenMis() {
	const today = dayjs();
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)
	const [loanApplications, setLoanApplications] = useState(() => [])
	const [copyLoanApplications, setCopyLoanApplications] = useState(() => [])
	const options = userDetails.id == 10 ? options2 : options1
	const  [isExcelPending,setExcelPending] =  useState(false);
	const [loanType, setLoanType] = useState(userDetails.id != 10 ? "U" : "S")
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [coListData, setCoListData] = useState(() => [])
	const [selectedEmployeeId, setSelectedEmployeeId] = useState(() => null)

	// const fetchLoanApplications = async () => {
	// 	setLoading(true)
	// 	// const creds = {
	// 	// 	// prov_grp_code: 0,
	// 	// 	// user_type: userDetails?.id,
	// 	// 	// branch_code: userDetails?.brn_code,
	// 	// 	approval_status: loanType,
	// 	// }

	// 	await axios
	// 		.get(
	// 			`${url}/admin/fetch_form_fwd_bm_web?approval_status=${loanType}&branch_code=${userDetails?.brn_code}`
	// 		)
	// 		.then((res) => {
	// 			if (res?.data?.suc === 1) {
	// 				setLoanApplications(res?.data?.msg)
	// 				setCopyLoanApplications(res?.data?.msg)

	// 				console.log("PPPPPPPPPPrrrrPPPPPPPPPP", res?.data)
	// 			} else {
	// 				Message("error", "No incoming loan applications found.")
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			Message("error", "Some error occurred while fetching loans!")
	// 			console.log("ERRR", err)
	// 		})
	// 	setLoading(false)
	// }

	const fetchCoList_ID = async () => {
		setLoading(true)
		await axios
			.post(`${url}/fetch_co_brnwise`, {
				brn_code: userDetails?.brn_code,
			})
			.then((res) => {
				if (res?.data?.suc === 1) {
					// console.log("fetchCoList", res?.data?.msg[0].emp_id)
					// fetchCoList_COList(res?.data?.msg[0].emp_id, loanType)
					setCoListData(res?.data?.msg)
				} else {
					Message("error", "No incoming loan applications found.")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching loans!")
				console.log("ERRR", err)
			})
		setLoading(false)
	}

	const fetchCoList_CO_Shorting = async (co_Id,date = []) => {
		console.log(co_Id);
		setLoanApplications([]);
		setCopyLoanApplications([]);
		console.log('asdadasd');
		console.log(
			{
				branch_code: userDetails?.brn_code,
				approval_status: loanType,
				co_id: co_Id,
			
			},
			"fetchCoList____",
			co_Id,
			loanType
		)

		setLoading(true)
		await axios
			.post(`${url}/admin/mis_fetch_dtls_cowise`, {
				branch_code: userDetails?.brn_code,
				approval_status: loanType,
				co_id: co_Id,
				from_dt:(loanType == 'A' && date.length > 0) ? date[0]?.format('YYYY-MM-DD') : '',
				to_dt:(loanType == 'A' && date.length > 0) ? date[1]?.format('YYYY-MM-DD') : '',

			})
			.then((res) => {
				if (res?.data?.suc === 1) {
					console.log("fetchCoList____yyyyyyyyyyyyyyyyyyyyy", res?.data?.msg)
					setLoanApplications(res?.data?.msg)
					setCopyLoanApplications(res?.data?.msg)
					// setCoListData(res?.data?.msg)
				} else {
					Message("error", "No incoming loan applications found.")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching loans!")
				console.log("ERRR", err)
			})
		setLoading(false)
	}

	const fetchLoanApplications_GroupWise = async (loanType,date = []) => {
		setLoading(true)
		// const creds = {
		// 	// prov_grp_code: 0,
		// 	// user_type: userDetails?.id,
		// 	// branch_code: userDetails?.brn_code,
		// 	approval_status: loanType,
		// }
		setLoanApplications([])
		setCopyLoanApplications([])
		await axios
			// .get(
			// 	`${url}/admin/fetch_form_fwd_bm_web?approval_status=${loanType}&branch_code=${userDetails?.brn_code}`
			// )
			.post(`${url}/admin/fetch_form_fwd_bm_to_mis_web`, {
				branch_code: userDetails?.brn_code,
				approval_status: loanType,
				from_dt:(loanType == 'A' && date.length > 0) ? date[0]?.format('YYYY-MM-DD') : '',
				to_dt:(loanType == 'A' && date.length > 0) ? date[1]?.format('YYYY-MM-DD') : '',
			})
			.then((res) => {
				setLoading(false)

				if (res?.data?.suc === 1) {
					setLoanApplications(res?.data?.msg)
					setCopyLoanApplications(res?.data?.msg)

					// console.log("PPPPPPPPPPPPPPPPPPPP", res?.data?.msg)
				} else {
					Message("error", "No incoming loan applications found.")
				}
			})
			.catch((err) => {
				setLoading(false)

				Message("error", "Some error occurred while fetching loans!")
				setLoanApplications([])
				setCopyLoanApplications([])
				console.log("ERRR", err)
			})
	}

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setLoanType(e)
	}

	useEffect(() => {
		// fetchLoanApplications()
		fetchCoList_ID()
	}, [])

	// useEffect(() => {
	// 	console.log("radio1 checked")
	// 	// fetchCoList_CO_Short()
	// }, [coListData])

	const handleEmployeeChange = (e) => {
		// Save the emp_id of the selected employee
		// console.log('sadasdasdasdasdasdasdasd')
		// setLoanApplications([]);
		// setCopyLoanApplications([]);
		// console.log(e.target.value, "oooooooooooooooo")
		const selectedId = e.target.value
		setSelectedEmployeeId(selectedId) // Save to state
		// 
		if(selectedId){
			fetchCoList_CO_Shorting(selectedId,dates)
		}
		else{
			fetchLoanApplications_GroupWise(loanType,dates)
		}
	}

	// useEffect(() => {
	// 	// fetchLoanApplications()
	// }, [selectedEmployeeId])

	const setSearch = (word) => {
		// if (loanType === "S") {
		setLoanApplications(
			copyLoanApplications?.filter(
				(e) =>
					e?.prov_grp_code
						?.toString()
						?.toLowerCase()
						.includes(word?.toLowerCase()) ||
					e?.group_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase()) ||
					e?.branch_name
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase())
			)
		)
		// }

		// if (loanType === "R") {
		// 	setLoanApplications(
		// 		copyLoanApplications?.filter(
		// 			(e) =>
		// 				e?.form_no
		// 					?.toString()
		// 					?.toLowerCase()
		// 					.includes(word?.toLowerCase()) ||
		// 				e?.branch_name
		// 					?.toString()
		// 					?.toLowerCase()
		// 					?.includes(word?.toLowerCase()) ||
		// 				e?.member_code
		// 					?.toString()
		// 					?.toLowerCase()
		// 					?.includes(word?.toLowerCase())
		// 		)
		// 	)
		// 	}
	}

	useEffect(() => {
		setCoListData(() => [])
		fetchCoList_ID()
	}, [loanType])

	useEffect(() => {
		// setLoanApplications([]);
		// setCopyLoanApplications([])
		console.log(loanType, ' loanType')
		if (loanType === "S") {
			fetchLoanApplications_GroupWise("S")
			setSelectedEmployeeId(() => "")
			console.log("fff", "SSSSSSSSSSSSSSS")
		} else if (loanType === "R") {
			fetchLoanApplications_GroupWise("R")
			setSelectedEmployeeId(() => "")

			console.log("fff", "RRRRRRRRRRRRRRR")
		} else if (loanType === "A") {
			fetchLoanApplications_GroupWise("A",dates)
			setSelectedEmployeeId(() => "")

			console.log("fff", "AAAAAAAAAAAAAAAAA")
		} else {
			fetchLoanApplications_GroupWise("U")
			setSelectedEmployeeId(() => "")

			console.log("fff", "AAAAAAAAAAAAAAAAA")
		}
	}, [loanType])

	const exportExcelDependOnRadioButton = async () =>{
		  try{
				console.log(grtHeader);
				// console.log(coListData.map(el => el.emp_id));
				// console.log(selectedEmployeeId)
				
				// const apiName = 
				const creds = {
					approval_status:loanType,
					branch_code:userDetails?.brn_code,
					co_id:!selectedEmployeeId ? coListData.map(el => el.emp_id) : [selectedEmployeeId],
					from_dt:(loanType == 'A' && dates.length > 0) ? dates[0]?.format('YYYY-MM-DD') : '',
					to_dt:(loanType == 'A' && dates.length > 0) ? dates[1]?.format('YYYY-MM-DD') : '',
				}
				console.log(creds);
				axios.post(`${url}/admin/excel_download_member_details`,creds)
				.then(res =>{
						setExcelPending(false);
						if(res?.data?.suc == 1 ){
							if(res?.data?.msg.length > 0){
								const fileName = options.find(el => el.value == loanType);
								let header_export = {};
								const allKeys = [...new Set(res?.data?.msg.flatMap(Object.keys))];
								allKeys.forEach(el =>{
									if(el in grtHeader){
										header_export = {
											...header_export,
											[el]:grtHeader[el]
										}
									}
									
								})
								const dt = res?.data?.msg.map(el =>{
										el.grt_date = el.grt_date ? moment(el.grt_date).format('DD/MM/YYYY') : '';
										el.dob = el.dob ? moment(el.dob).format('DD/MM/YYYY') : '';
										el.gender = el.gender ? (el.gender == 'O' ? 'Others' : (el.gender == 'F' ? 'Female' : 'Male')) : '';
										el.other_loan_flag = el.other_loan_flag ? (el.other_loan_flag == 'Y' ? 'Yes' : 'No') : '';
										el.poltical_flag  = el.poltical_flag ? (el.poltical_flag == 'Y' ? 'Yes' : 'No') : '';
										el.tv_flag = el.tv_flag ? (el.tv_flag == 'Y' ? 'Yes' : 'No') : '';
										el.bike_flag = el.bike_flag ? (el.bike_flag == 'Y' ? 'Yes' : 'No') : '';
										el.fridge_flag = el.fridge_flag ? (el.fridge_flag == 'Y' ? 'Yes' : 'No') : '';
										el.wm_flag = el.wm_flag ? (el.wm_flag == 'Y' ? 'Yes' : 'No') : '';
										return el;
								})
								exportToExcel(dt,header_export,`GRT ${fileName?.label} Report.xlsx`,[0])
							}
							else{
								Message('warning',"No Data Available");
							}
						}
						else{
							Message('error',res?.data?.msg);
						}
				}).catch(err =>{
					console.log(err.message);
					Message('error',err.message);
					setExcelPending(false);
				})
		  }
		  catch(err){
			console.log(err);
			Message('error',err.message);
			setExcelPending(false);
		  }
	}

	const onChangeDate = (values, formatString) => {
		console.log(values);
		setDates(values ? values : [dayjs(),dayjs()]);
		if(selectedEmployeeId){
			fetchCoList_CO_Shorting(selectedEmployeeId,values ? values : [dayjs(),dayjs()])
		}
		else{
			fetchLoanApplications_GroupWise(loanType,values ? values : [dayjs(),dayjs()])
		}
	};

	return (
		<div>
			<Sidebar mode={1} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-blue-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 h-auto my-10 mx-32">
				<div className="flex justify-between items-center flex-row">
					<Radiobtn
						data={options}
						val={loanType}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/>


					{loanType == 'A' && <RangePicker 
						defaultValue={[today, today]}
						onChange={onChangeDate}
						value={dates}
					/>}

					 {loanType != 'R' &&  <Button  loading={isExcelPending} type="dashed"
					 onClick={()=> {
						setExcelPending(true);	
						exportExcelDependOnRadioButton()
					}}	 
					  icon={<Download size={18}/>} iconPosition={'start'}>
						Export Excel
					</Button>}
				</div>
					
					{/* <LoanApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
					/> */}

					{loanType === "S" ? (
						<>
							<div className="grid grid-cols-3 gap-5 mt-5">
								<div>
									<TDInputTemplateBr
										placeholder="Select Collector Name..."
										type="text"
										label="Collectorwise"
										name="b_clientGender"
										// handleChange={(e) => console.log("Selected Employee:", e.target.value)}
										handleChange={handleEmployeeChange}
										// data={[
										// { code: "M", name: "Male" },
										// { code: "F", name: "Female" },
										// { code: "O", name: "Others" },
										// ]}
										data={coListData.map((emp) => ({
											code: emp.emp_id,
											name: `${emp.emp_name}`,
										}))}
										mode={2}
										disabled={false} // Static value to make it always disabled
									/>

									{/* {JSON.stringify(selectedEmployeeId, 2)} */}
								</div>
							</div>

							{/* {loanApplications.length > 0 && (
								<LoanRecovApplicationsTableViewBr
									flag="MIS"
									loanAppData={loanApplications}
									loanType={loanType}
									title="GRT Forms"
									setSearch={(data) => setSearch(data)}
									fetchLoanApplicationsDate={{
										selectedEmployeeId,
									}}
								/>
							)} */}
								<LoanRecovApplicationsTableViewBr
									flag="MIS"
									loanAppData={loanApplications}
									loanType={loanType}
									title="GRT Forms"
									setSearch={(data) => setSearch(data)}
									fetchLoanApplicationsDate={{
										selectedEmployeeId,
									}}
								/>
							
						</>
					) : loanType === "R" ? (
						<>
							<div className="grid grid-cols-3 gap-5 mt-5">
								<div>
									<TDInputTemplateBr
										placeholder="Select Collector Name..."
										type="text"
										label="Collectorwise"
										name="b_clientGender"
										// handleChange={(e) => console.log("Selected Employee:", e.target.value)}
										handleChange={handleEmployeeChange}
										// data={[
										// { code: "M", name: "Male" },
										// { code: "F", name: "Female" },
										// { code: "O", name: "Others" },
										// ]}
										data={coListData.map((emp) => ({
											code: emp.emp_id,
											name: `${emp.emp_name}`,
										}))}
										mode={2}
										disabled={false} // Static value to make it always disabled
									/>

									{/* {JSON.stringify(selectedEmployeeId, 2)} */}
								</div>
							</div>

							{/* {loanApplications.length > 0 && (
								<LoanApplicationsTableViewBr
									flag="MIS"
									loanAppData={loanApplications}
									loanType={loanType}
									title="GRT Forms"
									setSearch={(data) => setSearch(data)}
									fetchLoanApplicationsDate={{
										selectedEmployeeId,
									}}
								/>
							)} */}

								<LoanApplicationsTableViewBr
									flag="MIS"
									loanAppData={loanApplications}
									loanType={loanType}
									title="GRT Forms"
									setSearch={(data) => setSearch(data)}
									fetchLoanApplicationsDate={{
										selectedEmployeeId,
									}}
								/>

							{/* <LoanApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
						/> */}
						</>
					) : loanType === "A" ? (
						<>
							<div className="grid grid-cols-3 gap-5 mt-5">
								<div>
									<TDInputTemplateBr
										placeholder="Select Collector Name..."
										type="text"
										label="Collectorwise"
										name="b_clientGender"
										// handleChange={(e) => console.log("Selected Employee:", e.target.value)}
										handleChange={handleEmployeeChange}
										// data={[
										// { code: "M", name: "Male" },
										// { code: "F", name: "Female" },
										// { code: "O", name: "Others" },
										// ]}
										data={coListData.map((emp) => ({
											code: emp.emp_id,
											name: `${emp.emp_name}`,
										}))}
										mode={2}
										disabled={false} // Static value to make it always disabled
									/>

									{/* {JSON.stringify(selectedEmployeeId, 2)} */}
								</div>
							</div>

							{/* {loanApplications.length > 0 && (
								<LoanApprovalApplicationsTableViewBr
									flag="MIS"
									loanAppData={loanApplications}
									loanType={loanType}
									title="GRT Forms"
									setSearch={(data) => setSearch(data)}
									fetchLoanApplicationsDate={{
										selectedEmployeeId,
									}}
								/>
							)} */}

								<LoanApprovalApplicationsTableViewBr
									flag="MIS"
									loanAppData={loanApplications}
									loanType={loanType}
									title="GRT Forms"
									setSearch={(data) => setSearch(data)}
									fetchLoanApplicationsDate={{
										selectedEmployeeId,
									}}
								/>

							{/* <LoanApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
						/> */}
						</>
					) : (
						<>
							<div className="grid grid-cols-3 gap-5 mt-5">
								<div>
									<TDInputTemplateBr
										placeholder="Select Collector Name..."
										type="text"
										label="Collectorwise"
										name="b_clientGender"
										// handleChange={(e) => console.log("Selected Employee:", e.target.value)}
										handleChange={handleEmployeeChange}
										// data={[
										// { code: "M", name: "Male" },
										// { code: "F", name: "Female" },
										// { code: "O", name: "Others" },
										// ]}
										data={coListData.map((emp) => ({
											code: emp.emp_id,
											name: `${emp.emp_name}`,
										}))}
										mode={2}
										disabled={false} // Static value to make it always disabled
									/>

									{/* {JSON.stringify(selectedEmployeeId, 2)} */}
								</div>
							</div>

							{/* {loanApplications.length > 0 && (
								<LoanApplicationsTableViewBr
									flag="MIS"
									loanAppData={loanApplications}
									loanType={loanType}
									title="GRT Forms"
									setSearch={(data) => setSearch(data)}
									fetchLoanApplicationsDate={{
										selectedEmployeeId,
									}}
								/>
							)} */}

							<LoanApplicationsTableViewBr
									flag="MIS"
									loanAppData={loanApplications}
									loanType={loanType}
									title="GRT Forms"
									setSearch={(data) => setSearch(data)}
									fetchLoanApplicationsDate={{
										selectedEmployeeId,
									}}
								/>

							{/* <LoanApplicationsTableViewBr
						flag="MIS"
						loanAppData={loanApplications}
						title="GRT Forms"
						setSearch={(data) => setSearch(data)}
						/> */}
						</>
					)}

					{/* <DialogBox
					visible={visible}
					flag={flag}
					onPress={() => setVisible(false)}
				/> */}
				</main>
			</Spin>
		</div>
	)
}

export default HomeScreenMis

import React, { useEffect, useRef, useState } from "react"
import { routePaths } from "../Assets/Data/Routes"
import { Link } from "react-router-dom"
import Tooltip from "@mui/material/Tooltip"
import { Paginator } from "primereact/paginator"
import { motion } from "framer-motion"
import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	EditOutlined,
	FileTextOutlined,
	SyncOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { Tag } from "antd"
import { DataTable } from "primereact/datatable"
import Column from "antd/es/table/Column"
import { Toast } from "primereact/toast"
import { Message } from "@mui/icons-material"
import axios from "axios"
import { url } from "../Address/BaseUrl"

function LoanApplicationsTableViewBr({
	loanAppData,
	loanType,
	setSearch,
	title,
	flag,
	showSearch = true,
	isForwardLoan = false,
	isRejected = false,
	fetchLoanApplicationsDate,
}) {
	const navigate = useNavigate()

	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""

	const [first, setFirst] = useState(0)
	const [rows, setRows] = useState(10)
	const [expandedRows, setExpandedRows] = useState(null)
	const toast = useRef(null)
	const isMounted = useRef(false)
	const [selectedProducts, setSelectedProducts] = useState(null)
	const [currentPage, setCurrentPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)
	const [getloanAppData, setLoanAppData] = useState([])

	const [loading, setLoading] = useState(() => false)
	const [LoanGroupMember, setLoanGroupMember] = useState(() => [])



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

	// 				console.log("PPPPPPPPPPPPPPPPPPPP", res?.data)
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


	const fetchLoanGroupMember = async (group_code, loanType) => {
		// console.log(group_code, "res?.data?.msg", {
		// 	branch_code : userDetails?.brn_code,
		// 	approval_status : loanType,
		// 	prov_grp_code : group_code
		// })

		setLoading(true)
		await axios
			.post(`${url}/admin/form_fwd_bm_to_mis_mem_dtls`, {
				branch_code : userDetails?.brn_code,
				approval_status : loanType,
				prov_grp_code : group_code
			})
			.then((res) => {
				if (res?.data?.suc === 1) {
					setLoading(false)
					setLoanGroupMember(res?.data?.msg)
					// console.log(res?.data?.msg, "res?.data?.msg", 'sucsess')
				} else {
					Message("error", "No incoming loan applications found.")
				}
			})
			.catch((err) => {
				Message("error", "Some error occurred while fetching loans!")
				// console.log("ERRR", err)
			})
	}





	useEffect(() => {

		// alert(loanType)
		if (loanAppData.length > 0) {
			setLoanAppData(loanAppData)
		}
		// console.log(loanAppData, 'fffffffffffffffffffffffffffffffff');
		
	}, [loanAppData,])



	

	useEffect(() => {
		// setSetData(loanAppData)
		if (isMounted.current) {
			const summary =
				expandedRows !== null ? "All Rows Expanded" : "All Rows Collapsed"
			toast.current.show({
				severity: "success",
				summary: `${summary}`,
				life: 3000,
			})
		}
		// console.log(NewDataList, 'NewGroupList');
	}, [expandedRows])

	const onRowExpand = (event) => {
		console.log(event)
		// setExpandedRows(null)
		// console.log(event.data.group_code, "res?.data?.msg", event?.data)
		// console.log('itemitemitemitem', 'lll', event.data);
		// fetchLoanGroupMember(event?.data?.group_code, event?.data?.transaction_date)
		fetchLoanGroupMember(event?.data?.prov_grp_code, loanType)

		// toast.current.show({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
	}

	const onRowCollapse = (event) => {
		console.log(event.data, "event.data close")
		// toast.current.show({severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000});
	}

	const allowExpansion = (rowData) => {
		return getloanAppData.length > 0
	}

	useEffect(() => {
		// fetchLoanGroupMember([])
		setExpandedRows(null);
		console.log(loanAppData, 'fffffffffffffffffffffffffffffffff');
		
	// }, [fetchLoanApplicationsDate])
}, [])

	const onPageChange = (event) => {
		setFirst(event.first)
		setRows(event.rows)
	}

	const handleSelectionChange = (e) => {
		// Update the selected products setPaymentDate
		console.log(e.value, "kkkkkkkkkkkkkkkkkkkk")

		// Perform any additional logic here, such as enabling a button or triggering another action
		setSelectedProducts(e.value)
		if (e.value.length > 0) {
			const selectedRows = e.value

			// setDebitAmount(
			// 	selectedRows
			// 		.reduce((sum, item) => sum + parseFloat(item.debit_amt || 0), 0)
			// 		.toFixed(2)
			// )


			// const group_Data = selectedRows.map((item) => {
			// 	return {
			// 		payment_date: item?.transaction_date,
			// 		branch_code: item?.branch_code,
			// 		group_code: item?.group_code,
			// 	}
			// })


			// setCachedDateGcode(group_Data)
			// setRejectCachedPaymentId(reject_group_Data);
			// setShowApprov(true)
			// console.log("You selected  rows", cachedDateGcode, ">>>", group_Data)
		} else {
			// setShowApprov(false)
			// setDebitAmount(0)
			// setCachedDateGcode([])
			console.log("No rows selected")
		}
	}

	// const goTo = (item) => {
	// 	navigate(`${routePaths.EDIT_APPLICATION}`, {
	// 		state: { loanAppData: item },
	// 	})
	// }

	// useEffect(() => {
	// 	goTo()
	// })

	const rowExpansionTemplate = () => {
			return (
				<div className="orders-subtable">
					<DataTable
						value={LoanGroupMember}
						responsiveLayout="scroll"
						tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_2nd"
					>
						{/* <Column field="transaction_date" header="Payment Date" sortable></Column> */}
						<Column
							field="form_no"
							header="Form No."
							// body={(rowData) =>
							// 	new Date(rowData?.transaction_date).toLocaleDateString("en-GB")
							// }
						></Column>
						<Column field="member_code" header="Member Code"
						></Column>
						<Column field="client_name" header="Client Name"></Column>
						<Column field="grt_date" header="GRT Date"
						body={(rowData) =>
							new Date(rowData?.grt_date).toLocaleDateString("en-GB")
						}
						></Column>
						<Column
    field=""
    header="Action"
    body={(rowData) => (
        <button
            onClick={() => {
                console.log("Selected Item:", rowData);
                if (flag === "MIS") {
                    navigate(`/homemis/editgrtform/${rowData?.form_no}`, {
                        state: rowData,
                    });
                } else if (flag === "BM") {
                    navigate(`/homebm/editgrtform/${rowData?.form_no}`, {
                        state: rowData,
                    });
                } else {
                    navigate(`/homeco/editgrtform/${rowData?.form_no}`, {
                        state: rowData,
                    });
                }
            }}
        >
			{/* {JSON.stringify(flag, 2)}  */}
            <EditOutlined className="text-md text-[#DA4167]" />
        </button>
    )}
/>
						<Column headerStyle={{ width: '4rem'}}></Column>
					</DataTable>
				</div>
			)
		}


	return (
		<>
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
			>
				<div
					className={`flex flex-col bg-slate-800
					 rounded-lg my-3 dark:bg-slate-800
					 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-1.5`}
				>
					<div className="w-full">
						<div className="flex items-center justify-between">
							<motion.h2
								initial={{ opacity: 0, y: -50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1, type: "just" }}
								className="text-xl w-48 capitalize text-nowrap font-bold text-white dark:text-white sm:block hidden mx-4"
							>
								{title}
							</motion.h2>

							<label htmlFor="simple-search" className="sr-only">
								Search
							</label>
							{showSearch && (
								<div className="relative w-full -right-12 2xl:-right-12">
									<div className="absolute inset-y-0 left-0 flex items-center md:ml-4 pl-3 pointer-events-none">
										<svg
											aria-hidden="true"
											className="w-5 h-5 text-gray-500 dark:text-gray-400"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<motion.input
										type="text"
										id="simple-search"
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: "92%" }}
										transition={{ delay: 1.1, type: "just" }}
										className={`bg-white border rounded-lg border-slate-700
										 text-gray-800 block w-full h-12 pl-10 dark:bg-gray-800 md:ml-4 duration-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-lg `}
										placeholder="Search"
										required=""
										onChange={(text) => setSearch(text.target.value)}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</motion.section>

			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
			>
				<Toast ref={toast} />

				{/* {ShowApprov && (

				<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
				>
				<div className='grid-cols-2 gap-5 mb-3 items-center text-left'>
				<button 
				className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
				onClick={() => {

				setVisible(true)
				}}><CheckCircleOutlined className={`mr-2`} /> Approve  

				</button>

				<button 
				className={`inline-flex items-center px-4 py-2 mt-0 ml-4 sm:mt-0 text-sm font-medium text-center text-white border border-[#DA4167] bg-[#DA4167] transition ease-in-out hover:bg-[#ac3246] hover:border-[#ac3246] duration-300 rounded-full  dark:focus:ring-primary-900`}
				onClick={() => {
				setVisible_Reject(true)
				}}><CheckCircleOutlined className={`mr-2`} /> Reject  

				</button>		
				</div>
				</motion.section>

				)} */}

				{/* <>{JSON.stringify(getloanAppData, null, 2)}</> */}
				<DataTable
					value={getloanAppData?.map((item, i) => [{ ...item, id: i }]).flat()}
					expandedRows={expandedRows}
					onRowToggle={(e) => {
						// console.log(e, "expandedRows");
						// setExpandedRows(e.data);
						   const expanded = e.data;
						   const key = Object.keys(expanded)[0];
						   setExpandedRows({ [key]: expanded[key] });
					}}
					onRowExpand={onRowExpand}
					onRowCollapse={onRowCollapse}
					selectionMode="checkbox"
					selection={selectedProducts}
					// onSelectionChange={(e) => setSelectedProducts(e.value)}
					onSelectionChange={(e) => handleSelectionChange(e)}
					tableStyle={{ minWidth: "50rem" }}
					rowExpansionTemplate={rowExpansionTemplate}
					dataKey="id"
					paginator
					rows={rowsPerPage}
					first={currentPage}
					onPage={onPageChange}
					rowsPerPageOptions={[5, 10, 20]} // Add options for number of rows per page
					tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
				>
					<Column
						header="Sl No."
						body={(rowData) => (
							<span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>
						)}
					></Column>
					<Column expander={allowExpansion} style={{ width: "3em" }} />
					<Column
						field="group_name"
						header="Group Name"
					></Column>
					
					<Column
						field="prov_grp_code"
						header="Group Code"
					></Column>

					<Column
						field="branch_name"
						header="Branch Name"
					></Column>
					<Column
						field="co_name"
						header="CO Name"
					></Column>

					<Column
						field="created_by"
						header="Created By"
					></Column>



				</DataTable>

			</motion.section>

			
		</>
	)
}

export default LoanApplicationsTableViewBr

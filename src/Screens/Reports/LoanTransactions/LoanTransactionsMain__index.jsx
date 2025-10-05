import React, { useCallback, useEffect, useState } from "react"
import Sidebar from "../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../Address/BaseUrl"
import { Spin, Tooltip } from "antd"
import {
	LoadingOutlined,
	SearchOutlined,
	PrinterOutlined,
	FileExcelOutlined,
} from "@ant-design/icons"
import Radiobtn from "../../../Components/Radiobtn"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import {
	branchwiseTxnReportHeader,
	txnCoHeader,
	txnFundHeader,
	txnGrpHeader,
	txnMembHeader,
} from "../../../Utils/Reports/headerMap"
import Select from "react-select"
import { exportToExcel } from "../../../Utils/exportToExcel"
import { printTableReport } from "../../../Utils/printTableReport"
import { useCtrlP } from "../../../Hooks/useCtrlP"
import { MultiSelect } from "primereact/multiselect"
import { Message, MessageWithLink } from "../../../Components/Message"
import { useSocket } from "../../../Context/SocketContext"
import { getItem, removeItem, setItem } from "../../../Components/indexedDB";

const options = [
	{
		label: "Both",
		value: "B",
	},
	{
		label: "Disbursement",
		value: "D",
	},
	{
		label: "Recovery",
		value: "R",
	},
]

const options2 = [
	{
		label: "Groupwise",
		value: "G",
	},
	{
		label: "Fundwise",
		value: "F",
	},
	{
		label: "CO-wise",
		value: "C",
	},
	{
		label: "Memberwise",
		value: "M",
	},
	{
		label: "Branchwise",
		value: "B",
	},
]

function LoanTransactionsMain() {
	const [selectedColumns, setSelectedColumns] = useState(null);
	const [md_columns, setColumns] = useState([]);
	const { socket, connectSocket } = useSocket();
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	const [searchType, setSearchType] = useState(() => "B")
	const [searchType2, setSearchType2] = useState(() => "G")

	const [fromDate, setFromDate] = useState()
	const [toDate, setToDate] = useState()
	const [reportData, setReportData] = useState(() => [])
	const [reportRelated, setReportRelated] = useState(() => [])

	const [funds, setFunds] = useState([])
	const [selectedFund, setSelectedFund] = useState("")
	const [cos, setCOs] = useState([])
	const [selectedCO, setSelectedCO] = useState("")
	const [branches, setBranches] = useState([])
	const [selectedOptions, setSelectedOptions] = useState([])
	const [selectedCOs, setSelectedCOs] = useState([])
	const [metadataDtls, setMetadataDtls] = useState(() =>
		(userDetails?.id === 3 ||
			userDetails?.id === 4 ||
			userDetails?.id === 11) &&
		userDetails?.brn_code == 100
			? selectedOptions?.map((item, _) => `${item?.label}, `)
			: userDetails?.branch_name
	)

	const [selectedShoketBranch, setSelectedShoketBranch] = useState("")
	const [reportProgress, setReportProgress] = useState("")

	useEffect(() => {
  const loadData = async () => {
    const data = await getItem("reportData");
    const url = await getItem("reportData_Url");
    const progress = await getItem("reportDataProgress");

    console.log("IndexedDB values:", { data, url, progress });
  };
  loadData();
}, []);

// Add effect to ensure socket connection // OLD use LocalStorage
// useEffect(() => {

// 	if (!socket && userDetails?.emp_id) {
// 		connectSocket(userDetails.emp_id)

// 			const newSocket = connectSocket(userDetails?.emp_id)
// 			if (newSocket) {
// 			newSocket.on('loan_tns_repo_notification', (data) => {


// 			const msgData = data?.msg?.msg;
// 			const pageUrl = data?.req_data;

// 			localStorage.setItem("reportData", JSON.stringify(msgData))
// 			localStorage.setItem("reportData_Url", JSON.stringify(pageUrl))
// 			localStorage.setItem("reportDataProgress", 'done')
// 			setReportProgress('done')
// 			setLoading(false)

// 			setReportData(msgData)
// 			setReportRelated(pageUrl)
// 			populateColumns(
// 				msgData, 
// 				searchType2 === "G"
// 				? txnGrpHeader
// 				: searchType2 === "F"
// 				? txnFundHeader
// 				: searchType2 === "C"
// 				? txnCoHeader
// 				: searchType2 === "M"
// 				? txnMembHeader
// 				: branchwiseTxnReportHeader);

// 			Message("success", "Your Loan Transactions Reports process is complete")

// 			})


// 			} else {
// 			console.error("Failed to establish socket connection")
// 			}
// 	}

// }, [socket, userDetails, connectSocket])

// OLD use LocalStorage
// 	useEffect(() => {
//     const reportData_Url = localStorage.getItem("reportData_Url");

// 	if(reportData_Url != null){


// 	if(JSON.parse(reportData_Url)?.page_url === '/homebm/loantxns'){

// 		const storedData = localStorage.getItem("reportData");

// 		if (storedData) {
// 		  try {
// 			const parsedData = JSON.parse(storedData);
// 			console.log("Report Data loaded: ifffff", storedData);

// 			setReportData(parsedData)
// 			setReportRelated(JSON.parse(reportData_Url))

// 			populateColumns(
// 					parsedData, 
// 					searchType2 === "G"
// 					? txnGrpHeader
// 					: searchType2 === "F"
// 					? txnFundHeader
// 					: searchType2 === "C"
// 					? txnCoHeader
// 					: searchType2 === "M"
// 					? txnMembHeader
// 					: branchwiseTxnReportHeader);

// 			localStorage.removeItem("reportData");
// 			localStorage.removeItem("reportData_Url");

// 		  } catch {
// 			console.log("Report Data loaded: else", storedData);
// 		  }

// 		}
// 	}
// 	}
//   }, []); // Runs once on page load


useEffect(() => {
  if (!socket && userDetails?.emp_id) {
    const newSocket = connectSocket(userDetails.emp_id);

    if (newSocket) {
      newSocket.on("loan_tns_repo_notification", async (data) => {
        const msgData = data?.msg?.msg;
        const pageUrl = data?.req_data;

        try {
          // ✅ Save into IndexedDB instead of localStorage
          await setItem("reportData", msgData);
          await setItem("reportData_Url", pageUrl);
          await setItem("reportDataProgress", "done");

          setReportProgress("done");
          setLoading(false);

          // ✅ Also update state directly so UI refreshes immediately
          setReportData(msgData);
          setReportRelated(pageUrl);

          populateColumns(
            msgData,
            searchType2 === "G"
              ? txnGrpHeader
              : searchType2 === "F"
              ? txnFundHeader
              : searchType2 === "C"
              ? txnCoHeader
              : searchType2 === "M"
              ? txnMembHeader
              : branchwiseTxnReportHeader
          );

          Message("success", "Your Loan Transactions Reports process is complete");
        } catch (err) {
          console.error("Failed saving report data to IndexedDB", err);
        }
      });
    } else {
      console.error("Failed to establish socket connection");
    }
  }
}, [socket, userDetails, connectSocket]);


  useEffect(() => {
  const loadReportData = async () => {
    try {
      const reportData_Url = await getItem("reportData_Url");

      if (reportData_Url != null) {
        if (reportData_Url?.page_url === "/homebm/loantxns") {
          const storedData = await getItem("reportData");

          if (storedData) {
            try {
            //   console.log("Report Data loaded: ifffff", storedData);

              setReportData(storedData);
              setReportRelated(reportData_Url);

              populateColumns(
                storedData,
                searchType2 === "G"
                  ? txnGrpHeader
                  : searchType2 === "F"
                  ? txnFundHeader
                  : searchType2 === "C"
                  ? txnCoHeader
                  : searchType2 === "M"
                  ? txnMembHeader
                  : branchwiseTxnReportHeader
              );

              // cleanup after use
              await removeItem("reportData");
              await removeItem("reportData_Url");
              // await removeItem("reportDataProgress");
            } catch (err) {
              console.log("Error parsing stored data:", err);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error loading from IndexedDB", err);
    }
  };

  loadReportData();
}, []); // runs once on page load


	const onChange = (e) => {
		console.log("radio1 checked", e)
		setSearchType(e)
	}

	const onChange2 = (e) => {
		console.log("radio1 checked", e)
		setSearchType2(e)
	}

	const handleFetchTxnReportGroupwise = async () => {
		// setLoading(true)
		// console.log(searchType === "B" ? "Both" : searchType === "D" ? "Disbursement" : searchType === "R" ? "Recovery" : "Both", 'searchType');
		
		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			to_dt: formatDateToYYYYMMDD(toDate),
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			tr_type: searchType,
			page_url: '/homebm/loantxns',
			flag: 'G',
			searchFor: 'Groupwise',
			searchDataFilter: selectedShoketBranch,
			searchFilterSub: searchType === "B" ? "Both" : searchType === "D" ? "Disbursement" : searchType === "R" ? "Recovery" : "Both"
		}

		await axios
			.post(`${url}/transaction_report_groupwise`, creds)
			.then((res) => {
				
				// console.log(res?.data, 'testttttttttttttttt');
				// localStorage.setItem("reportData", res?.data?.transaction_group_data?.msg)
				// console.log(res?.data, 'testttttttttttttttt');
				// if(res?.data?.transaction_group_data?.suc == 1){
				if(res?.data?.suc == 1){

				// localStorage.setItem("reportDataProgress", 'loading')
				setReportProgress('loading')

				if (!socket) {
				console.warn("Socket not connected, attempting to reconnect...")
				const newSocket = connectSocket(userDetails?.emp_id)
				if (newSocket) {					
				newSocket.emit('loan_trns_repo_process', {
				data: res?.data?.req_data
				})
				localStorage.removeItem("reportData");
				localStorage.removeItem("reportData_Url");
				} else {
				console.error("Failed to establish socket connection")
				}
				} else {
				console.log(res?.data, 'RESSSSS======>>>>');
				socket.emit('loan_trns_repo_process', {
				data: res?.data?.req_data
				})
				}
				// Message("success", "Loan Transactions Reports updated successfully")
					
				
				
					// if(res?.data?.transaction_group_data?.msg.length > 0){
					// 	setReportData(res?.data?.transaction_group_data?.msg)
					// 	populateColumns(res?.data?.transaction_group_data?.msg,txnGrpHeader);	
					// }
					// else{
					// 	Message('warning','No Data Available')
					// }
				}
				else{
					Message('error','Something went wrong, Please try again later')
				}
				
				
				
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
				Message('error',err.message)
			})

		// setLoading(false)
	}

	const getFunds = () => {
		setLoading(true)
		axios
			.get(`${url}/get_fund`)
			.then((res) => {
				console.log("FUNDSSSS ======>", res?.data)
				setFunds(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
				setLoading(false)
			})
		setLoading(false)
	}

	const handleFundChange = (e) => {
		const selectedId = e.target.value
		setSelectedFund(selectedId)
	}

	const handleFetchTxnReportFundwise = async () => {
		// setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const selectedFunds = funds?.map((item, i) => item?.fund_id)

		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			to_dt: formatDateToYYYYMMDD(toDate),
			branch_code: branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			fund_id: selectedFund === "F" ? selectedFunds : [selectedFund],
			tr_type: searchType,
			page_url: '/homebm/loantxns',
			flag: 'F',
			searchFor: 'Fundwise',
			searchDataFilter: selectedShoketBranch,
			searchFilterSub: searchType === "B" ? "Both" : searchType === "D" ? "Disbursement" : searchType === "R" ? "Recovery" : "Both"
		}

		await axios
			.post(`${url}/transaction_report_fundwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				// if(res?.data?.transaction_fund_data?.suc == 1){
				if(res?.data?.suc == 1){
					// if(res?.data?.transaction_fund_data?.msg.length > 0){
						// setReportData(res?.data?.transaction_fund_data?.msg)
						// populateColumns(res?.data?.transaction_fund_data?.msg,txnFundHeader);	

						
					// }
					// else{
					// 	Message('warning','No Data Available')
					// }

					if (!socket) {
					console.warn("Socket not connected, attempting to reconnect...")
					const newSocket = connectSocket(userDetails?.emp_id)
					if (newSocket) {					
					newSocket.emit('loan_trns_repo_process', {
					data: res?.data?.req_data
					})
					localStorage.removeItem("reportData");
					localStorage.removeItem("reportData_Url");
					} else {
					console.error("Failed to establish socket connection")
					}
					} else {
					// console.log(res?.data, 'RESSSSS======>>>>');
					socket.emit('loan_trns_repo_process', {
					data: res?.data?.req_data
					})
					}

				} else{
					Message('error','Something went wrong, Please try again later')
				}
			

			})
			.catch((err) => {
				console.log("ERRRR>>>", err);
				Message('error',err.message)
			})

		// setLoading(false)
	}

	const getCOs = () => {
		setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
		}
		axios
			.post(`${url}/fetch_brn_co`, creds)
			.then((res) => {
				console.log("COs ======>", res?.data)
				setCOs(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
				setLoading(false)
			})
		setLoading(false)
	}

	const handleCOChange = (e) => {
		const selectedId = e.target.value
		setSelectedCO(selectedId)
	}

	const handleFetchTxnReportCOwise = async () => {
		// setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)
		const coCodes = selectedCOs?.map((item, i) => item?.value)
		const allCos = cos?.map((item, i) => item?.co_id)

		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			to_dt: formatDateToYYYYMMDD(toDate),
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			co_id:
				coCodes?.length === 0
					? selectedCO === "AC"
						? allCos
						: [selectedCO]
					: coCodes,
			tr_type: searchType,

			page_url: '/homebm/loantxns',
			flag: 'C',
			searchFor: 'CO-wise',
			searchDataFilter: selectedShoketBranch,
			searchFilterSub: searchType === "B" ? "Both" : searchType === "D" ? "Disbursement" : searchType === "R" ? "Recovery" : "Both"
		}

		console.log("CREDSS", creds)

		await axios
			.post(`${url}/transaction_report_cowise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				// if(res?.data?.transaction_co_data?.suc == 1){
				if(res?.data?.suc == 1){
					// if(res?.data?.transaction_co_data?.msg.length > 0){
						// setReportData(res?.data?.transaction_co_data?.msg)
						// populateColumns(res?.data?.transaction_co_data?.msg,txnCoHeader);	
					// }
					// else{
					// 	Message('warning','No Data Available')
					// }

					if (!socket) {
					console.warn("Socket not connected, attempting to reconnect...")
					const newSocket = connectSocket(userDetails?.emp_id)
					if (newSocket) {					
					newSocket.emit('loan_trns_repo_process', {
					data: res?.data?.req_data
					})
					localStorage.removeItem("reportData");
					localStorage.removeItem("reportData_Url");
					} else {
					console.error("Failed to establish socket connection")
					}
					} else {
					console.log(res?.data, 'RESSSSS======>>>>');
					socket.emit('loan_trns_repo_process', {
					data: res?.data?.req_data
					})
					}

				}
				else{
					Message('error','Something went wrong, Please try again later')
				}
				

			})
			.catch((err) => {
				console.log("ERRRR>>>", err);
				Message('error',err.message)
			})

		// setLoading(false)
	}

	const handleFetchTxnReportBranchwise = async () => {
		// setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			to_dt: formatDateToYYYYMMDD(toDate),
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			tr_type: searchType,

			page_url: '/homebm/loantxns',
			flag: 'B',
			searchFor: 'Branchwise',
			searchDataFilter: selectedShoketBranch,
			searchFilterSub: searchType === "B" ? "Both" : searchType === "D" ? "Disbursement" : searchType === "R" ? "Recovery" : "Both"
		}

		await axios
			.post(`${url}/transaction_report_branchwise`, creds)
			.then((res) => {
				console.log("RESSSSS======>>>>", res?.data)
				// if(res?.data?.transaction_branch_data?.suc == 1){
				if(res?.data?.suc == 1){
				// if(res?.data?.transaction_branch_data?.msg.length > 0){
				// 	setReportData(res?.data?.transaction_branch_data?.msg)
				// 	populateColumns(res?.data?.transaction_branch_data?.msg,branchwiseTxnReportHeader);	
				// }
				// else{
				// 	Message('warning','No Data Available')
				// }

				if (!socket) {
				console.warn("Socket not connected, attempting to reconnect...")
				const newSocket = connectSocket(userDetails?.emp_id)
				if (newSocket) {					
				newSocket.emit('loan_trns_repo_process', {
				data: res?.data?.req_data
				})
				localStorage.removeItem("reportData");
				localStorage.removeItem("reportData_Url");
				} else {
				console.error("Failed to establish socket connection")
				}
				} else {
				console.log(res?.data, 'RESSSSS======>>>>');
				socket.emit('loan_trns_repo_process', {
				data: res?.data?.req_data
				})
				}

				} else{
					Message('error','Something went wrong, Please try again later')
				}

			})
			.catch((err) => {
				console.log("ERRRR>>>", err);
				
				Message('warning',err.message)
			})

		// setLoading(false)
	}

	const handleFetchTxnReportMemberwise = async () => {
		// setLoading(true)

		const branchCodes = selectedOptions?.map((item, i) => item?.value)

		const creds = {
			from_dt: formatDateToYYYYMMDD(fromDate),
			to_dt: formatDateToYYYYMMDD(toDate),
			branch_code:
				branchCodes?.length === 0 ? [userDetails?.brn_code] : branchCodes,
			tr_type: searchType,

			page_url: '/homebm/loantxns',
			flag: 'M',
			searchFor: 'Memberwise',
			searchDataFilter: selectedShoketBranch,
			searchFilterSub: searchType === "B" ? "Both" : searchType === "D" ? "Disbursement" : searchType === "R" ? "Recovery" : "Both"
		}

		await axios
			.post(`${url}/transaction_report_memberwise`, creds)
			.then((res) => {
				// console.log("RESSSSS======>>>>", res?.data)
				// if(res?.data?.transaction_member_data?.suc == 1 ){
				if(res?.data?.suc == 1){
					// if(res?.data?.transaction_member_data?.msg.length > 0){
					// 	setReportData(res?.data?.transaction_member_data?.msg)
					// 	populateColumns(res?.data?.transaction_member_data?.msg,txnMembHeader);	
					// }
					// else{
					// 	Message('warning','No Data Available');
					// }

					if (!socket) {
					console.warn("Socket not connected, attempting to reconnect...")
					const newSocket = connectSocket(userDetails?.emp_id)
					if (newSocket) {					
					newSocket.emit('loan_trns_repo_process', {
					data: res?.data?.req_data
					})
					localStorage.removeItem("reportData");
					localStorage.removeItem("reportData_Url");
					} else {
					console.error("Failed to establish socket connection")
					}
					} else {
					console.log(res?.data, 'RESSSSS======>>>>');
					socket.emit('loan_trns_repo_process', {
					data: res?.data?.req_data
					})
					}

				}
				else{
						Message('error','Something went wrong, Please try again later');
				}
				

			})
			.catch((err) => {
				console.log("ERRRR>>>", err);
				Message('error',err.message);
			})

		// setLoading(false)
	}

	const getBranches = () => {
		setLoading(true)
		const creds = {
			emp_id: userDetails?.emp_id,
			user_type: userDetails?.id,
		}
		axios
			.post(`${url}/fetch_brnname_based_usertype`, creds)
			.then((res) => {
				console.log("Branches ======>", res?.data)
				setBranches(res?.data?.msg)
			})
			.catch((err) => {
				console.log("ERRRR>>>", err)
				setLoading(false)
			})
		setLoading(false)
	}

	useEffect(() => {
		getBranches()
	}, [])

	const searchData = async () => {
		if (searchType2 === "G" && fromDate && toDate) {
			await handleFetchTxnReportGroupwise()
		} else if (searchType2 === "F" && fromDate && toDate) {
			await handleFetchTxnReportFundwise()
		} else if (searchType2 === "C" && fromDate && toDate) {
			await handleFetchTxnReportCOwise()
		} else if (searchType2 === "M" && fromDate && toDate) {
			await handleFetchTxnReportMemberwise()
		} else if (searchType2 === "B" && fromDate && toDate) {
			await handleFetchTxnReportBranchwise()
		}
	}

	useEffect(() => {
		// setReportData([])
		// setSelectedOptions([])
		// setMetadataDtls(null)
		if (searchType2 === "F") {
			getFunds()
		}
		if (searchType2 === "C") {
			getCOs()
		}
	}, [searchType, searchType2])

	useEffect(() => {
		setSelectedCOs([])
		if (searchType2 === "C") {
			getCOs()
		}
	}, [selectedOptions])

	const fetchSearchTypeName = (searchType) => {
		if (searchType === "M") {
			return "Memberwise"
		} else if (searchType === "G") {
			return "Groupwise"
		} else if (searchType === "F") {
			return "Fundwise"
		} else if (searchType === "C") {
			return "CO-wise"
		} else if (searchType === "B") {
			return "Branchwise"
		} else if (searchType === "D") {
			return "Disbursement"
		} else if (searchType === "R") {
			return "Recovery"
		}
	}

	const dataToExport = reportData

	const headersToExport =
		searchType2 === "G"
			? txnGrpHeader
			: searchType2 === "F"
			? txnFundHeader
			: searchType2 === "C"
			? txnCoHeader
			: searchType2 === "M"
			? txnMembHeader
			: branchwiseTxnReportHeader

	const fileName = `Loan_Txn_${fetchSearchTypeName(
		searchType2
	)}_${new Date().toLocaleString("en-GB")}.xlsx`

	// const dateFormatInGB = (date) => {
	// 	return new Date(date).toLocaleDateString("en-GB")
	// }

	// const exportToExcel = (data) => {
	// 	const wb = XLSX.utils.book_new()
	// 	const ws = XLSX.utils.json_to_sheet(data)
	// 	XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
	// 	const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" })
	// 	const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" })
	// 	saveAs(
	// 		blob,
	// 		`Loan_Txn_Report_${fetchSearchTypeName(
	// 			searchType2
	// 		)}_${fetchSearchTypeName(
	// 			searchType
	// 		)}_${metadataDtls}_From_${dateFormatInGB(fromDate)}_To_${dateFormatInGB(
	// 			toDate
	// 		)}.xlsx`
	// 	)
	// }

	// const s2ab = (s) => {
	// 	const buf = new ArrayBuffer(s.length)
	// 	const view = new Uint8Array(buf)
	// 	for (let i = 0; i < s.length; i++) {
	// 		view[i] = s.charCodeAt(i) & 0xff
	// 	}
	// 	return buf
	// }

	const dropdownOptions = branches?.map((branch) => ({
		value: branch.branch_assign_id,
		label: `${branch.branch_name} - ${branch.branch_assign_id}`,
	}))

	const displayedOptions =
		selectedOptions.length === dropdownOptions.length
			? [{ value: "all", label: "All" }]
			: selectedOptions

	// const handleMultiSelectChange = (selected) => {
	// 	console.log(selected, 'selected', dropdownOptions);
		
	// 	if (selected.some((option) => option.value === "all")) {
	// 		setSelectedOptions(dropdownOptions)
	// 	} else {
	// 		setSelectedOptions(selected)
	// 	}
	// }

		const handleMultiSelectChange = (selected) => {
		let finalSelected = [];
		
		if (selected.some((option) => option.value === "all")) {
			// finalSelected = dropdownOptions;
			setSelectedOptions(dropdownOptions)
			// console.log('ALL', 'selected');
			setSelectedShoketBranch('All')
		} else {
			finalSelected = selected || [];
			setSelectedOptions(selected)

			const labelsString = finalSelected.map((item) => item.label).join(", ");
			// console.log(selected, 'Single', 'selected', labelsString);
			setSelectedShoketBranch(labelsString)
		}

		}

	const dropdownCOs = cos?.map((branch) => ({
		value: branch.co_id,
		label: `${branch.emp_name} - ${branch.co_id}`,
	}))

	const displayedCOs =
		selectedCOs.length === dropdownCOs.length
			? [{ value: "all", label: "All" }]
			: selectedCOs

	const handleMultiSelectChangeCOs = (selected) => {
		if (selected.some((option) => option.value === "all")) {
			setSelectedCOs(dropdownCOs)
		} else {
			setSelectedCOs(selected)
		}
	}

	const handlePrint = useCallback(() => {
		printTableReport(
			dataToExport,
			headersToExport,
			fileName?.split(",")[0],
			[0, 2]
		)
	}, [dataToExport, headersToExport, fileName, printTableReport])

	useCtrlP(handlePrint)
	const populateColumns = (main_dt,headerExport) =>{
		// console.log(main_dt, 'check__ooooooooooooooo');
				if (!main_dt || main_dt.length === 0) {
				// No data case
				setColumns([]);
				setSelectedColumns([]);
				return;
				}
		
				const columnToBeShown = Object.keys(main_dt[0]).map((key, index) => ({ header:headerExport[key], index }));
				setColumns(columnToBeShown);
				setSelectedColumns(columnToBeShown.map(el => el.index));
	}
	return (
		<div>
			<Sidebar mode={2} reportProgress={reportProgress} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-slate-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 pb-5 bg-slate-50 rounded-lg shadow-lg h-auto my-10 mx-32">
					<div className="flex flex-row gap-3 mt-20  py-3 rounded-xl">
						<div className="text-3xl text-slate-700 font-bold">
							LOAN TRANSACTIONS {reportRelated?.searchFor ? `(${reportRelated.searchFor} - ${reportRelated.searchFilterSub})` : ''}
						</div>
					</div>

					<div className="text-slate-800 italic">
						Branch:{" "} 
						{/* {(userDetails?.id === 3 ||
							userDetails?.id === 4 ||
							userDetails?.id === 11) &&
						userDetails?.brn_code == 100
							? displayedOptions?.map((item, _) => `${item?.label},`)
							: userDetails?.branch_name}{" "} */}
						{(userDetails?.id === 3 ||
						userDetails?.id === 4 ||
						userDetails?.id === 11) &&
						userDetails?.brn_code == 100 ? (
						displayedOptions?.length > 0
						? displayedOptions.map((item, _) => `${item?.label}, `)
						: reportRelated?.searchDataFilter 
						) : (
						userDetails?.branch_name
						)}
							
						{/* from {fromDate}  to {toDate}  */}
						{" "} from {fromDate ? fromDate : reportRelated?.from_dt} to {toDate ? toDate : reportRelated?.to_dt}
					</div>

					<div className="mb-2 flex justify-start gap-5 items-center">
						<div>
							<Radiobtn
								data={options2}
								val={searchType2}
								onChangeVal={(value) => {
									onChange2(value)
								}}
							/>
						</div>
						<div>
							<Radiobtn
								data={options}
								val={searchType}
								onChangeVal={(value) => {
									onChange(value)
								}}
							/>
						</div>
					</div>

					{(userDetails?.id === 3 ||
						userDetails?.id === 4 ||
						userDetails?.id === 11) &&
						userDetails?.brn_code == 100 && (
							<div className="w-[100%]">
								<Select
									options={[{ value: "all", label: "All" }, ...dropdownOptions]}
									isMulti
									value={displayedOptions}
									onChange={handleMultiSelectChange}
									placeholder="Select branches..."
									className="basic-multi-select"
									classNamePrefix="select"
									styles={{
										control: (provided) => ({
											...provided,
											borderRadius: "8px",
										}),
										valueContainer: (provided) => ({
											...provided,
											borderRadius: "8px",
										}),
										singleValue: (provided) => ({
											...provided,
											color: "black",
										}),
										multiValue: (provided) => ({
											...provided,
											padding: "0.1rem",
											backgroundColor: "#da4167",
											color: "white",
											borderRadius: "8px",
										}),
										multiValueLabel: (provided) => ({
											...provided,
											color: "white",
										}),
										multiValueRemove: (provided) => ({
											...provided,
											color: "white",
											"&:hover": {
												backgroundColor: "red",
												color: "white",
												borderRadius: "8px",
											},
										}),
										placeholder: (provided) => ({
											...provided,
											fontSize: "0.9rem",
										}),
									}}
								/>
							</div>
						)}

					{searchType2 === "C" &&
					(userDetails?.id === 3 ||
						userDetails?.id === 4 ||
						userDetails?.id === 11) &&
					userDetails?.brn_code == 100 ? (
						// <div>
						// 	<TDInputTemplateBr
						// 		placeholder="Select CO..."
						// 		type="text"
						// 		label="CO-wise"
						// 		name="co_id"
						// 		handleChange={handleCOChange}
						// 		data={cos.map((dat) => ({
						// 			code: dat.co_id,
						// 			name: `${dat.emp_name}`,
						// 		}))}
						// 		mode={2}
						// 		disabled={false}
						// 	/>
						// </div>
						<div className="col-span-3 mx-auto w-[100%] pt-5">
							<Select
								options={[{ value: "all", label: "All" }, ...dropdownCOs]}
								isMulti
								value={displayedCOs}
								onChange={handleMultiSelectChangeCOs}
								placeholder="Select COs'..."
								className="basic-multi-select"
								classNamePrefix="select"
								styles={{
									control: (provided) => ({
										...provided,
										borderRadius: "8px",
									}),
									valueContainer: (provided) => ({
										...provided,
										borderRadius: "8px",
									}),
									singleValue: (provided) => ({
										...provided,
										color: "black",
									}),
									multiValue: (provided) => ({
										...provided,
										padding: "0.1rem",
										backgroundColor: "#da4167",
										color: "white",
										borderRadius: "8px",
									}),
									multiValueLabel: (provided) => ({
										...provided,
										color: "white",
									}),
									multiValueRemove: (provided) => ({
										...provided,
										color: "white",
										"&:hover": {
											backgroundColor: "red",
											color: "white",
											borderRadius: "8px",
										},
									}),
									placeholder: (provided) => ({
										...provided,
										fontSize: "0.9rem",
									}),
								}}
							/>
						</div>
					) : (
						searchType2 === "C" && (
							<div>
								<TDInputTemplateBr
									placeholder="Select CO..."
									type="text"
									label="CO-wise"
									name="co_id"
									handleChange={handleCOChange}
									data={[
										{ code: "AC", name: "All COs" },
										...cos.map((dat) => ({
											code: dat.co_id,
											name: `${dat.emp_name}`,
										})),
									]}
									mode={2}
									disabled={false}
								/>
							</div>
						)
					)}

					<div className="grid grid-cols-2 gap-5 mt-5 items-end">
						<div>
							<TDInputTemplateBr
								placeholder="From Date"
								type="date"
								label="From Date"
								name="fromDate"
								formControlName={fromDate}
								handleChange={(e) => setFromDate(e.target.value)}
								min={"1900-12-31"}
								mode={1}
							/>
						</div>
						<div>
							<TDInputTemplateBr
								placeholder="To Date"
								type="date"
								label="To Date"
								name="toDate"
								formControlName={toDate}
								handleChange={(e) => setToDate(e.target.value)}
								min={"1900-12-31"}
								mode={1}
							/>
						</div>

						{searchType2 === "F" && (
							<div>
								<TDInputTemplateBr
									placeholder="Select Fund..."
									type="text"
									label="Fundwise"
									name="fund_id"
									handleChange={handleFundChange}
									data={[
										{ code: "F", name: "All funds" },
										...funds.map((dat) => ({
											code: dat.fund_id,
											name: `${dat.fund_name}`,
										})),
									]}
									mode={2}
									disabled={false}
								/>
							</div>
						)}
						<div>
							<button
								className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full dark:focus:ring-primary-900`}
								onClick={() => {
									searchData()
								}}
								// disabled={
								// 	(searchType2 === "F" &&
								// 		(!fromDate ||
								// 			!toDate ||
								// 			selectedFund == "Select Fund..." ||
								// 			selectedFund == "")) ||
								// 	(searchType2 === "C" &&
								// 		(!fromDate || !toDate || userDetails?.brn_code !== 100
								// 			? selectedCO == "Select CO..." || selectedCO == ""
								// 			: selectedCOs.length == 0))
								// }
							>
								<SearchOutlined /> <span className={`ml-2`}>Search</span>
							</button>
						</div>
						
					</div>

					
					{
						reportData.length > 0 && 	<MultiSelect value={selectedColumns} 
							onChange={(e) => {
								console.log(e.value)
								setSelectedColumns(e.value)
							}} options={md_columns} optionValue="index" optionLabel="header" 
							filter placeholder="Choose Columns" maxSelectedLabels={3} className="w-full md:w-20rem mt-5" />
					}			
					{searchType2 === "M" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[17, 18, 19,20,21]}
								// colRemove={[13, 14]}
								headersMap={txnMembHeader}
								dateTimeExceptionCols={[0]}
								colRemove={selectedColumns ? md_columns.map(el => {
									  if(!selectedColumns.includes(el.index)){
										return el.index
									  }
									  return false
								}) : []}
							/>
						</>
					)}

					{/* Groupwise Results with Pagination */}
					{/* {JSON.stringify(reportData, 2)}  */}
					{searchType2 === "G" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[12,13, 14, 15,16]}
								dateTimeExceptionCols={[0]}
								headersMap={txnGrpHeader}
								colRemove={selectedColumns ? md_columns.map(el => {
									  if(!selectedColumns.includes(el.index)){
										return el.index
									  }
									  return false
								}) : []}
							/>
						</>
					)}

					{/* Fundwise Results with Pagination */}
					{/* {JSON.stringify(reportData, 2)}  */}
					{searchType2 === "F" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[14,15, 16, 17, 18,19]}
								dateTimeExceptionCols={[0]}
								headersMap={txnFundHeader}
								colRemove={selectedColumns ? md_columns.map(el => {
									  if(!selectedColumns.includes(el.index)){
										return el.index
									  }
									  return false
								}) : []}
							/>
						</>
					)}

					{/* COwise Results with Pagination */}
					{searchType2 === "C" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[9,10, 11, 12,13,14]}
								dateTimeExceptionCols={[0]}
								headersMap={txnCoHeader}
								colRemove={selectedColumns ? md_columns.map(el => {
									  if(!selectedColumns.includes(el.index)){
										return el.index
									  }
									  return false
								}) : []}
							/>
						</>
					)}

					{/* Branchwise Results with Pagination */}
					{searchType2 === "B" && reportData.length > 0 && (
						<>
							<DynamicTailwindTable
								data={reportData}
								pageSize={50}
								columnTotal={[2,3, 4,5,6,7]}
								headersMap={branchwiseTxnReportHeader}
								colRemove={selectedColumns ? md_columns.map(el => {
									  if(!selectedColumns.includes(el.index)){
										return el.index
									  }
									  return false
								}) : []}
							/>
						</>
					)}

					{/* ///////////////////////////////////////////////////////////////// */}

					{reportData.length !== 0 && (
						<div className="flex gap-4">
							<Tooltip title="Export to Excel">
								<button
									onClick={() =>{
										console.log(dataToExport);
										// console.log(headersToExport);
										let exportedDT = [...dataToExport];
										const tot_debit =  exportedDT.reduce( ( sum , cur ) => sum + Number(cur.debit) , 0);
										const tot_credit= exportedDT.reduce((sum,cur) => sum + Number(cur.credit) ,0)
										const tot_prn_recov= exportedDT.reduce((sum,cur) => sum + Number(cur.prn_recov) ,0)
										const tot_intt_recov= exportedDT.reduce((sum,cur) => sum + Number(cur.intt_recov) ,0)
										const tot_curr_balance= exportedDT.reduce((sum,cur) => sum + Number(cur.curr_balance) ,0)
										exportedDT.push({
											branch_code:"TOTAL",
											debit: tot_debit,
											credit: tot_credit,
											prn_recov: tot_prn_recov,
											intt_recov: tot_intt_recov,
											curr_balance:tot_curr_balance
										})
										const dt = md_columns.filter(el => selectedColumns.includes(el.index));
										let header_export = {};
										Object.keys(headersToExport).forEach(key =>{
											if(dt.filter(ele => ele.header == headersToExport[key]).length > 0){
												header_export = {
													...header_export,
													[key]:headersToExport[key]
												}
											}
										});
										exportToExcel(
											exportedDT,
											header_export,
											fileName,
											[0, 2]
										)
										}}
									className="mt-5 justify-center items-center rounded-full text-green-900"
								>
									<FileExcelOutlined
										style={{
											fontSize: 30,
										}}
									/>
								</button>
							</Tooltip>
							<Tooltip title="Print">
								<button
									onClick={() =>{
										// printTableLoanTransactions(
										// 	reportData,
										// 	"Loan Transaction",
										// 	searchType,
										// 	searchType2,
										// 	metadataDtls,
										// 	fromDate,
										// 	toDate
										// )
										let exportedDT = [...dataToExport];
										const tot_debit =  exportedDT.reduce( ( sum , cur ) => sum + Number(cur.debit) , 0);
										const tot_credit= exportedDT.reduce((sum,cur) => sum + Number(cur.credit) ,0)
										const tot_prn_recov= exportedDT.reduce((sum,cur) => sum + Number(cur.prn_recov) ,0)
										const tot_intt_recov= exportedDT.reduce((sum,cur) => sum + Number(cur.intt_recov) ,0)
										const tot_curr_balance= exportedDT.reduce((sum,cur) => sum + Number(cur.curr_balance) ,0)
										exportedDT.push({
											debit: tot_debit,
											credit: tot_credit,
											prn_recov: tot_prn_recov,
											intt_recov: tot_intt_recov,
											curr_balance:tot_curr_balance
										})
										const dt = md_columns.filter(el => selectedColumns.includes(el.index));
										let header_export = {};
										Object.keys(headersToExport).forEach(key =>{
											if(dt.filter(ele => ele.header == headersToExport[key]).length > 0){
												header_export = {
													...header_export,
													[key]:headersToExport[key]
												}
											}
										});
										printTableReport(
											exportedDT,
											header_export,
											fileName?.split(",")[0],
											[0, 2]
										)
									}}
									className="mt-5 justify-center items-center rounded-full text-pink-600"
								>
									<PrinterOutlined
										style={{
											fontSize: 30,
										}}
									/>
								</button>
							</Tooltip>
						</div>
					)}
				</main>
			</Spin>
		</div>
	)
}

export default LoanTransactionsMain

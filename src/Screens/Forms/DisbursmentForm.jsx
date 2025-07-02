import React, { useEffect, useState } from "react"
import "../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import BtnComp from "../../Components/BtnComp"
import VError from "../../Components/VError"
import { useNavigate } from "react-router-dom"
// import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Message } from "../../Components/Message"
import { url } from "../../Address/BaseUrl"
import { Badge, Spin, Card, Tag, Select } from "antd"
import {
	CheckCircleOutlined,
	EyeInvisibleOutlined,
	EyeOutlined,
	LoadingOutlined,
} from "@ant-design/icons"
import { useLocation } from "react-router"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../Utils/formateDate"
import DialogBox from "../../Components/DialogBox"
// import { disableInputArray } from "./disableInputArray"
import { disableCondition } from "./disableCondition"
import { getOrdinalSuffix } from "../../Utils/ordinalSuffix"

const initialValues = {
	b_mode: "",
}

const validationSchema = Yup.object({
	b_mode: Yup.string().required("Please enter your Name"),
})

function DisbursmentForm() {
	const params = useParams()
	const [loading, setLoading] = useState(false)
	const location = useLocation()
	const personalDetails = location.state[0] || {}
	const loanType = location.state[1] || "D"
	const [checkTot, setCheckTot] = useState(0)
	const navigate = useNavigate()
	const userDetails = JSON.parse(localStorage.getItem("user_details"))

	const [visible, setVisible] = useState(() => false)
	const [visible2, setVisible2] = useState(() => false)
	const [visible3, setVisible3] = useState(() => false)
	const [visibleMember, setVisibleMember] = useState(() => false)

	const [AppliedDisbursLoan, setAppliedDisbursLoan] = useState(() => true)

	const [disburseOrNot, setDisburseOrNot] = useState(() => false)
	const [maxDisburseAmountForAScheme, setMaxDisburseAmountForAScheme] =
		useState(() => "")

	const [purposeOfLoan, setPurposeOfLoan] = useState(() => [])
	const [subPurposeOfLoan, setSubPurposeOfLoan] = useState(() => [])

	const [schemes, setSchemes] = useState(() => [])
	const [funds, setFunds] = useState(() => [])
	const [tnxTypes, setTnxTypes] = useState(() => [])
	const [tnxModes, setTnxModes] = useState(() => [])
	const [banks, setBanks] = useState(() => [])
	const [members, setMembers] = useState(() => [])
	const [membersForDisb, setMembersForDisb] = useState(() => [])
	const [fetchedLoanData, setFetchedLoanData] = useState(() => Object)
	const [fetchedTnxData, setFetchedTnxData] = useState(() => Object)
	const [totDisb, setTotDisb] = useState(() => 0)
	const [Period_mode_valid, setPeriod_mode_valid] = useState("")
	// const formattedDob = formatDateToYYYYMMDD(memberDetails?.dob)

	console.log(params, "params")
	console.log(location, "location")
	// console.log(memberDetails, "memberDetails")
	console.log("D/R", loanType)

	const [personalDetailsData, setPersonalDetailsData] = useState({
		b_groupcode: "",
		b_branchcode: "",
		b_branchname: "",
		b_bank_name: "",
		b_bank_branch: "",
		b_memCode: [],
		b_clientName: "",
		b_groupName: "",
		b_acc1: "",
		b_acc2: "",
		b_formNo: "",
		b_grtApproveDate: "",
		b_branch: "",
		b_purpose: "",
		b_purposeId: "",
		b_subPurpose: "",
		b_subPurposeId: "",
		b_applicationDate: "",
		b_appliedAmt: "",
	})

	const handleChangePersonalDetails = (e) => {
		const { name, value } = e.target
		setPersonalDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const [disbursementDetailsData, setDisbursementDetailsData] = useState({
		b_scheme: "",
		b_fund: "",
		b_period: "",
		b_roi: "",
		b_mode: "",
		b_disburseAmt: "",
		b_bankCharges: 0,
		b_processingCharges: 0,
		b_dayOfRecovery: "",
	})

	const handleChangeDisburseDetails = (e) => {
		const { name, value } = e.target
		setDisbursementDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const [transactionDetailsData, setTransactionDetailsData] = useState({
		b_tnxDate: formatDateToYYYYMMDD(new Date()),
		b_bankName: "",
		b_chequeOrRefNo: "",
		b_chequeOrRefDate: formatDateToYYYYMMDD(new Date()),
		b_tnxType: "D", // (D, R)
		b_tnxMode: "", // (C, B)
		b_remarks: "",
	})

	console.log("transactionDetailsData", transactionDetailsData)

	const handleChangeTnxDetailsDetails = (e) => {
		// console.log(e.target.value)
		// console.log(e.target.name, e.target.value)
		const { name, value } = e.target || e
		setTransactionDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const [installmentDetailsData, setInstallmentDetailsData] = useState({
		b_isntallmentStartDate: "",
		b_isntallmentEndDate: "",
		b_interestAmount: "",
		// b_isntallmentCalculatedAmount: "",
		b_interestEMIAmount: "",
		// b_principleAmount: "",
		b_principleDisbursedAmount: "",
		b_principleEMIAmount: "",
		b_totalEMIAmount: "",
		b_receivable: "",
	})

	const handleChangeInstallmentDetails = (e) => {
		const { name, value } = e.target
		setInstallmentDetailsData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const WEEKS = [
		{
			code: "1",
			name: "Sunday",
		},
		{
			code: "2",
			name: "Monday",
		},
		{
			code: "3",
			name: "Tuesday",
		},
		{
			code: "4",
			name: "Wednesday",
		},
		{
			code: "5",
			name: "Thursday",
		},
		{
			code: "6",
			name: "Friday",
		},
		{
			code: "7",
			name: "Saturday",
		},
	]

	const getBanks = async (input) => {
		console.log(input)
		// if(input){
		await axios
			.post(`${url}/get_bank`, {
				dist_code: userDetails.dist_code,
				bank: input,
			})
			.then((res) => {
				setBanks(res?.data?.msg)
			})
			.catch((err) => {
				Message("error", "Some error while fetching banks.")
				console.log("******", err)
			})
		// }
	}

	useEffect(() => {
		// handleChangePersonalDetails()
		// debugger;
		getBanks("")
	}, [])

	useEffect(() => {
		if (!disburseOrNot)
			setPersonalDetailsData({
				b_groupcode: personalDetails?.group_code || "",
				b_branchcode: personalDetails?.branch_code || "",
				b_branchname: personalDetails?.branch_name || "",
				// b_memCode: personalDetails?.member_code || "",
				// b_clientName: personalDetails?.client_name || "",
				b_groupName: personalDetails?.group_name || "",
				b_acc1: personalDetails?.acc_no1 || "",
				b_acc2: personalDetails?.acc_no2 || "",
				// b_formNo: personalDetails?.form_no || "",
				// b_grtApproveDate: personalDetails?.grt_approve_date || "",
				// b_branch: personalDetails?.branch_name || "",
				// b_purpose: personalDetails?.purpose_id || "",
				// b_subPurpose: personalDetails?.sub_pupose || "",
				// b_purposeId: personalDetails?.loan_purpose || "",
				// b_subPurposeId: personalDetails?.sub_pupose || "",
				// b_applicationDate: personalDetails?.application_date || "",
				// b_appliedAmt: personalDetails?.applied_amt || "",
			})

		console.log("?????????????????????", personalDetails)
	}, [])

	const getSchemes = async () => {
		setLoading(true)
		await axios
			.get(`${url}/get_scheme`)
			.then((res) => {
				console.log("==============", res?.data)
				setSchemes(res?.data?.msg)
			})
			.catch((err) => {
				console.log("err", err)
			})
		setLoading(false)
	}

	const getFunds = async () => {
		setLoading(true)
		await axios
			.get(`${url}/get_fund`)
			.then((res) => {
				console.log("--------------", res?.data)
				setFunds(res?.data?.msg)
			})
			.catch((err) => {
				console.log("err", err)
			})
		setLoading(false)
	}

	const getTnxTypes = async () => {
		await axios.get(`${url}/get_tr_type`).then((res) => {
			console.log("777 --- 777 --- 777", res?.data)
			setTnxTypes(res?.data)
		})
	}

	const getTnxModes = async () => {
		await axios.get(`${url}/get_tr_mode`).then((res) => {
			console.log("888 --- 888 --- 888", res?.data)
			setTnxModes(res?.data)
		})
	}

	useEffect(() => {
		getSchemes()
		getFunds()
		getTnxTypes()
		getTnxModes()
	}, [])
	const handleDisbursementChange = (index, event) => {
		// alert()
		let dt = [...membersForDisb]
		dt[index][event.target.name] = +event.target.value
		setMembersForDisb(dt)
		// console.log(dt, 'dttttttttttttt', personalDetailsData.b_appliedAmt);
		setTotDisb(
			membersForDisb.reduce((accumulator, e) => accumulator + e.prn_disb_amt, 0)
		)
		const creds = {
			member_code: dt.map((e) => {
				return { member_code: e.member_code }
			}),
			tot_disb_amt: membersForDisb.reduce(
				(accumulator, e) => accumulator + e.prn_disb_amt,
				0
			),
		}

		axios.post(`${url}/admin/verify_tot_dib_amt`, creds).then((res) => {
			membersForDisb.forEach((member) => {
				if (member.applied_amt < member.prn_disb_amt) {
					// alert(`Alert: Applied amount (${member.applied_amt}) is less than disbursed amount (${member.prn_disb_amt}) for ${member.client_name}`);
					setCheckTot(res?.data?.suc)
					Message("error", res?.data?.msg)
					setAppliedDisbursLoan(false)
				} else {
					setAppliedDisbursLoan(true)
				}
			})

			// if(res?.data?.suc==0){
			//   setCheckTot(res?.data?.suc)
			//   Message('error',res?.data?.msg)
			//   setAppliedDisbursLoan(false)
			// } else{
			//   setAppliedDisbursLoan(true)
			// }
		})
	}
	const getParticularScheme = async (schemeId) => {
		setLoading(true)
		const creds = {
			scheme_id: schemeId,
		}
		await axios
			.post(`${url}/admin/scheme_dtls`, creds)
			.then((res) => {
				console.log("PPP", res?.data)
				setDisbursementDetailsData((prevData) => ({
					...prevData,
					b_scheme: prevData.b_scheme,
					b_fund: prevData.b_fund,
					b_period:
						disbursementDetailsData.b_mode === "Monthly"
							? res?.data?.msg[0]?.max_period
							: disbursementDetailsData.b_mode === "Weekly"
							? res?.data?.msg[0]?.max_period_week
							: "",
					b_roi: res?.data?.msg[0]?.roi,
					// b_mode: res?.data?.msg[0]?.payment_mode,
					b_mode: disbursementDetailsData.b_mode || "",

					b_disburseAmt: prevData.b_disburseAmt || "",
					b_bankCharges: prevData.b_bankCharges || "",
					b_processingCharges: prevData.b_processingCharges || "",
				}))
				setMaxDisburseAmountForAScheme(res?.data?.msg[0]?.max_amt)
			})
			.catch((err) => {
				console.log("errrr", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		console.log(disburseOrNot)
		if (!disburseOrNot) {
			getParticularScheme(disbursementDetailsData.b_scheme)
		}
	}, [disbursementDetailsData.b_scheme, disbursementDetailsData.b_mode])

	const getPurposeOfLoan = async () => {
		setLoading(true)
		await axios
			.get(`${url}/get_purpose`)
			.then((res) => {
				console.log("------------", res?.data)
				setPurposeOfLoan(res?.data?.msg)
			})
			.catch((err) => {
				console.log("+==========+", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		getPurposeOfLoan()
	}, [])

	const getSubPurposeOfLoan = async (purpId) => {
		setLoading(true)
		await axios
			.get(`${url}/get_sub_purpose?purp_id=${purpId}`)
			.then((res) => {
				console.log("------------", res?.data)
				setSubPurposeOfLoan(res?.data?.msg)
			})
			.catch((err) => {
				console.log("+==========+", err)
			})
		setLoading(false)
	}

	useEffect(() => {
		getSubPurposeOfLoan(personalDetailsData?.b_purposeId)
	}, [personalDetailsData?.b_purposeId])

	const fetchSearchedApplication = async () => {
		setLoading(true)
		const creds = {
			// member_dtls: personalDetails?.member_code,
			branch_code: userDetails?.brn_code,
			grp_dt: personalDetails.group_code,
		}
		await axios
			// .post(`${url}/admin/fetch_loan_application_dtls`, creds)
			.post(`${url}/admin/fetch_appl_dtls_via_grp`, creds)
			.then((res) => {
				// console.log(
				// 	"KKKKKKKKkkkkk8888KKKKKkkkkKKKK",
				// 	res?.data?.msg[0]?.mem_dt_grp
				// )
				setMembers(res?.data?.msg[0]?.mem_dt_grp)
				membersForDisb.length = 0
				var count = 0
				for (let i of res?.data?.msg[0]?.mem_dt_grp) {
					count += i.applied_amt
					setTotDisb((prev) => prev + i.applied_amt)
					membersForDisb.push({
						applied_amt: i.applied_amt,
						grt_form_no: i.form_no,
						member_code: i.member_code,
						client_name: i.client_name,
						// prn_disb_amt:+i.applied_amt || 0,
						prn_disb_amt: i.prn_disb_amt > 0 ? +i.prn_disb_amt : +i.applied_amt,
					})
				}
				setTotDisb(count)
				count = 0
				setMembersForDisb(membersForDisb)
				console.log(members)
				console.log(
					"fetchSearchedApplication ===========>>>>>>>>>>>>>>>>>",
					res?.data
				)
				setPersonalDetailsData({
					// b_memCode: res?.data?.msg[0]?.member_code,
					b_clientName: res?.data?.msg[0]?.client_name,
					b_groupName: res?.data?.msg[0]?.group_name,
					b_branchcode: res?.data?.msg[0]?.branch_code,
					b_branchname: res?.data?.msg[0]?.brn_name,
					b_bank_name: res?.data?.msg[0]?.bank_name,
					b_bank_branch: res?.data?.msg[0]?.branch_name,
					b_acc1: res?.data?.msg[0]?.acc_no1,
					b_acc2: res?.data?.msg[0]?.acc_no2,
					b_memCode: res?.data?.msg[0]?.mem_dt_grp,
					// b_formNo: res?.data?.msg[0]?.form_no,
					// b_grtApproveDate: res?.data?.msg[0]?.grt_approve_date,
					// b_branch: res?.data?.msg[0]?.branch_name,
					b_purpose: res?.data?.msg[0]?.mem_dt_grp[0]?.purpose_id,
					b_purposeId: res?.data?.msg[0]?.mem_dt_grp[0]?.loan_purpose,
					b_subPurpose: res?.data?.msg[0]?.mem_dt_grp[0]?.sub_pupose,
					b_subPurposeId: res?.data?.msg[0]?.mem_dt_grp[0]?.sub_pupose,
					// b_applicationDate: res?.data?.msg[0]?.application_date,
					// b_appliedAmt: res?.data?.msg[0]?.applied_amt,
				})
			})
			.catch((err) => {
				// console.log("fetchSearchedApplication ERRRRR", err)
				Message("error", `Some error occurred while searching... ${err}`)
			})
		setLoading(false)
	}

	const checkDisbursedOrNot = async () => {
		setLoading(true)
		const creds = {
			// form_no: personalDetails?.form_no,
			group_code: personalDetails?.group_code,
			branch_code: userDetails?.brn_code,
		}
		await axios
			.post(`${url}/admin/fetch_existing_loan`, creds)
			.then((res) => {
				console.log("checkDisbursedOrNot --------+++++++", res?.data)

				// setDisburseOrNot(res?.data?.msg)
				setFetchedLoanData(res?.data?.msg[0])
				setFetchedTnxData(res?.data?.loan_trans)

				setDisbursementDetailsData({
					// b_scheme: res?.data?.loan_dt?.scheme_id || "",
					b_scheme: "",
					// b_fund: res?.data?.loan_dt?.fund_id || "",
					b_fund: "",
					// b_period: res?.data?.loan_dt?.period || "",
					b_period: "",
					// b_roi: res?.data?.loan_dt?.curr_roi || "",
					b_roi: "",
					b_mode: "",
					// b_disburseAmt: res?.data?.loan_dt?.prn_disb_amt || "",
					b_disburseAmt: "",
					// b_dayOfRecovery: res?.data?.loan_dt?.recovery_day || "",
					b_dayOfRecovery: "",
					b_bankCharges: res?.data?.loan_trans?.bank_charge || 0,
					b_processingCharges: res?.data?.loan_trans?.proc_charge || 0,
				})

				setTransactionDetailsData({
					b_tnxDate: res?.data?.loan_dt?.last_trn_dt
						? formatDateToYYYYMMDD(new Date(res?.data?.loan_dt?.last_trn_dt))
						: formatDateToYYYYMMDD(new Date()),
					// b_tnxDate: formatDateToYYYYMMDD(new Date()),
					b_bankName: res?.data?.loan_trans?.bank_name || "",
					b_chequeOrRefNo: res?.data?.loan_trans?.cheque_id || "",
					b_chequeOrRefDate: res?.data?.loan_trans?.chq_dt
						? formatDateToYYYYMMDD(new Date(res?.data?.loan_trans?.chq_dt))
						: formatDateToYYYYMMDD(new Date()),
					b_tnxType: res?.data?.loan_trans?.tr_type || "D",
					b_tnxMode: res?.data?.loan_trans?.tr_mode || "",
					// b_remarks: res?.data?.loan_trans?.particulars || "",
					b_remarks: "",
				})

				if (res?.data?.msg) {
					fetchSearchedApplication()
					setInstallmentDetailsData({
						b_isntallmentStartDate: res?.data?.loan_dt?.instl_start_dt || "",
						b_isntallmentEndDate: res?.data?.loan_dt?.instl_end_dt || "",
						b_interestAmount: res?.data?.loan_dt?.intt_amt || "",
						b_interestEMIAmount: res?.data?.loan_dt?.intt_emi || "",
						b_principleDisbursedAmount: res?.data?.loan_dt?.prn_disb_amt || "",
						b_principleEMIAmount: res?.data?.loan_dt?.prn_emi || "",
						b_totalEMIAmount: res?.data?.loan_dt?.tot_emi || "",
						// b_tnxDate: res?.data?.loan_dt?.last_trn_dt
						//   ? formatDateToYYYYMMDD(new Date(res?.data?.loan_dt?.last_trn_dt))
						//   : formatDateToYYYYMMDD(new Date()),
						b_receivable:
							Math.round(
								+res?.data?.loan_dt?.prn_disb_amt +
									+res?.data?.loan_dt?.intt_amt
							).toFixed(2) || "",
					})
				}
				axios
					.post(`${url}/admin/fetch_disb_trans_dtls`, creds)
					.then((resDisb) => {
						console.log("fetch_disb_trans_dtls", resDisb)

						setDisbursementDetailsData({
							b_scheme: resDisb?.data?.msg[0]?.scheme_id || "",
							b_fund: resDisb?.data?.msg[0]?.fund_id || "",
							b_period: resDisb?.data?.msg[0]?.period || "",
							b_roi: resDisb?.data?.msg[0]?.curr_roi || "",
							b_mode: resDisb?.data?.msg[0]?.period_mode || "",
							b_disburseAmt: resDisb?.data?.msg[0]?.prn_disb_amt || "",
							b_dayOfRecovery: resDisb?.data?.msg[0]?.recovery_day || "",
							b_bankCharges: resDisb?.data?.msg[0]?.bank_charge || 0,
							b_processingCharges: resDisb?.data?.msg[0]?.proc_charge || 0,
						})
						setTransactionDetailsData({
							b_bankName: +resDisb?.data?.msg[0]?.code || 0,
							b_remarks: resDisb?.data?.msg[0]?.particulars || "",
							b_tnxDate: res?.data?.msg[0]?.last_trn_dt
								? formatDateToYYYYMMDD(new Date(res?.data?.msg[0].last_trn_dt))
								: formatDateToYYYYMMDD(new Date()),
						})
					})
			})
			.catch((err) => {
				Message("error", "Some error during fetching the status of the form.")
			})
		setLoading(false)
	}

	useEffect(() => {
		checkDisbursedOrNot()
	}, [])

	// useEffect(() => {
	//   const totalAmount = membersForDisb?.reduce((sum, item) => sum + (parseFloat(item.applied_amt) || 0), 0);

	//   setTotDisb(totalAmount);
	//   alert(totalAmount)

	// }, [membersForDisb]);

	// useEffect(() => {
	// 	if (approvalStat === "A") {
	// 		fetchRecoveryDetails()
	// 	}
	// }, [])

	//////////////////////////////////////////////////
	//////////////////////////////////////////////////

	const showMember_Fn = () => {
		if (visibleMember) {
			setVisibleMember(false)
		}

		if (!visibleMember) {
			setVisibleMember(true)
		}
	}

	const onSubmit = (e) => {
		e.preventDefault()

		setVisible(true)
	}

	const onReset = async () => {
		console.log("onreset called")
		setDisbursementDetailsData({
			b_scheme: "",
			b_fund: "",
			b_period: "",
			b_roi: "",
			b_mode: "",
			b_disburseAmt: "",
			b_bankCharges: "",
			b_processingCharges: "",
		})
		setTransactionDetailsData({
			b_tnxDate: "",
			b_bankName: "",
			b_chequeOrRefNo: "",
			b_chequeOrRefDate: "",
			b_tnxType: "",
			b_tnxMode: "",
			b_remarks: "",
		})
	}

	useEffect(() => {
		setPeriod_mode_valid(disbursementDetailsData.b_mode)
	}, [disbursementDetailsData.b_mode])

	const handleSubmitDisbursementForm = async () => {
		setLoading(true)
		console.log(personalDetails)
		// debugger
		const creds = {
			group_code: personalDetails?.group_code,
			branch_code: personalDetails?.branch_code || "",
			purpose: personalDetailsData?.b_purposeId || "",
			sub_purpose: personalDetailsData?.b_subPurposeId || "",
			scheme_id: disbursementDetailsData?.b_scheme || "",
			fund_id: disbursementDetailsData?.b_fund || "",
			period: disbursementDetailsData?.b_period || "",
			curr_roi: disbursementDetailsData?.b_roi || "",
			od_roi: "0",
			old_prn_amt: "0",
			od_intt_amt: "0",
			recovery_date: disbursementDetailsData?.b_dayOfRecovery || "",
			period_mode: disbursementDetailsData?.b_mode || "",
			created_by: userDetails?.emp_id || "",
			loan_code: params?.id || "",
			bank_charge: disbursementDetailsData?.b_bankCharges || "",
			proc_charge: disbursementDetailsData?.b_processingCharges || "",
			bank_name: transactionDetailsData?.b_bankName || "",
			cheque_id: transactionDetailsData?.b_chequeOrRefNo || "",
			particulars: transactionDetailsData?.b_remarks || "",
			trans_date: transactionDetailsData?.b_tnxDate || "",

			disbdtls: membersForDisb,

			//   group_code: personalDetails?.prov_grp_code || "",
			//   member_code: personalDetails?.member_code || "",
			//   grt_form_no: personalDetails?.form_no || "",

			//   applied_amt: personalDetails?.applied_amt || "",

			// deposit_by: "",
			// bill_no: "",
			// trn_lat: "",
			// trn_long: "",

			///////////////////////////////////////////////////////
		}

		// period_mode_cus = creds.period_mode;
		// setPeriod_mode_valid(creds.period_mode)

		console.log(creds, "KKKKKKKKkkkkkKKKKKkkkkKKKK")

		if (disbursementDetailsData.b_mode.length > 0) {
			await axios
				.post(`${url}/admin/save_loan_transaction`, creds)
				.then((res) => {
					if (res?.data?.suc === 1) {
						console.log("Disbursement initiated successfully", res?.data)
						Message("success", "Submitted successfully.")
						navigate(-1)
					} else {
						console.log("Disbursement disrupted!", res?.data)
						Message("warning", "Change txn date.")
						// navigate(-1)
					}
				})
				.catch((err) => {
					Message(
						"error",
						"Some error occurred while submitting disbursement form!"
					)
					console.log("DDEEERRR", err)
				})
			setLoading(false)
		} else {
			setLoading(false)
		}
	}

	const handleApproveLoanDisbursement = async () => {
		setLoading(true)
		const creds = {
			approved_by: userDetails?.emp_id || "",
			loan_id: personalDetails?.loan_id || "",
		}
		await axios
			.post(`${url}/admin/approve_loan_disbursement`, creds)
			.then((res) => {
				console.log("&&&&&&&&&&&&", res?.data)
				Message("success", "Loan approved.")
				navigate(-1)
			})
			.catch((err) => {
				console.log("ERRR - APPROVE", err)
			})
		setLoading(false)
	}

	const handleRejectLoanDisbursement = async () => {
		setLoading(true)
		const creds = {
			loan_id: personalDetails?.loan_id || "",
		}
		await axios
			.post(`${url}/admin/delete_apply_loan`, creds)
			.then((res) => {
				console.log("@@@@@@@@@@@@", res?.data)
				Message("success", "Loan deleted successfullly.")
				navigate(-1)
			})
			.catch((err) => {
				console.log("ERRR - REJECT", err)
			})
		setLoading(false)
	}
	useEffect(() => {
		console.log(personalDetails)
	}, [])
	return (
		<>
			{disburseOrNot && (
				<Badge.Ribbon
					className="bg-slate-500 absolute top-10 z-5"
					text={"Disbursement Initiated"}
					style={{
						fontSize: 17,
						width: 200,
						height: 25,
						justifyContent: "start",
						alignItems: "center",
						textAlign: "center",
					}}
				></Badge.Ribbon>
			)}
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
								<div className="text-xl mb-2 text-[#DA4167] font-semibold underline">
									1. Group Details
								</div>
							</div>
							<div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
								<div className="sm:col-span-4 text-lime-900 p-5 rounded-2xl grid grid-cols-4 gap-5">
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Group code..."
											type="text"
											label="Group Code"
											name="b_groupcode"
											formControlName={personalDetailsData?.b_groupcode}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Group name..."
											type="text"
											label="Group Name"
											name="b_groupName"
											formControlName={personalDetailsData?.b_groupName}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Branch Code"
											type="text"
											label="Branch Code"
											name="b_branchcode"
											formControlName={personalDetailsData?.b_branchcode}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>

									{/* <div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Bank Branch"
											type="text"
											label="Bank Branch"
											name="b_bank_branch"
											formControlName={personalDetailsData?.b_bank_branch}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div> */}
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Branch Name"
											type="text"
											label="Branch Name"
											name="b_branchname"
											formControlName={personalDetailsData?.b_branchname}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Bank Name"
											type="text"
											label="Bank Name"
											name="b_bank_name"
											formControlName={personalDetailsData?.b_bank_name}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Bank Branch"
											type="text"
											label="Bank Branch"
											name="b_bank_branch"
											formControlName={personalDetailsData?.b_bank_branch}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>

									<div>
										<TDInputTemplateBr
											placeholder="SB Account"
											type="text"
											label="SB Account"
											name="b_acc1"
											formControlName={personalDetailsData?.b_acc1}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Loan Account"
											type="text"
											label="Loan Account"
											name="b_acc2"
											formControlName={personalDetailsData?.b_acc2}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
								</div>
								{/* <div>
									<TDInputTemplateBr
										placeholder="Member Code"
										type="text"
										label="Member Code"
										name="b_memCode"
										formControlName={personalDetailsData?.b_memCode}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Type member name..."
										type="text"
										label="Member Name"
										name="b_clientName"
										formControlName={personalDetailsData?.b_clientName}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Form Number"
										type="text"
										label="Form Number"
										name="b_formNo"
										formControlName={personalDetailsData?.b_formNo}
										mode={1}
										disabled
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="GRT Approve date..."
										type="text"
										label="GRT Approve Date"
										name="b_grtApproveDate"
										formControlName={personalDetailsData?.b_grtApproveDate}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Branch..."
										type="text"
										label="Branch"
										name="b_branch"
										formControlName={personalDetailsData?.b_branch}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>
								
								<div>
									<TDInputTemplateBr
										placeholder="Select Purpose"
										type="text"
										label="Purpose"
										name="b_purpose"
										formControlName={personalDetailsData?.b_purpose}
										handleChange={handleChangePersonalDetails}
										data={purposeOfLoan?.map((item, _) => ({
											code: item?.loan_purpose,
											name: item?.purpose_id,
										}))}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div>
								
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Select Sub Purpose"
										type="text"
										label="Sub Purpose"
										name="b_subPurpose"
										formControlName={personalDetailsData?.b_subPurpose}
										handleChange={handleChangePersonalDetails}
										data={subPurposeOfLoan?.map((item, _) => ({
											code: item?.sub_purp_id,
											name: item?.sub_purp_name,
										}))}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Application Date..."
										type="text"
										label="Application Date"
										name="b_applicationDate"
										formControlName={personalDetailsData?.b_applicationDate}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Applied Amount..."
										type="text"
										label="Applied Amount"
										name="b_appliedAmt"
										formControlName={personalDetailsData?.b_appliedAmt}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div> */}
							</div>
						</div>
						<div>
							<div className="grid gap-4 sm:grid-cols-2 sm:gap-6 my-3">
								<div className="text-xl mb-2 text-[#DA4167] font-semibold underline items-center">
									2. Member Details
									<button
										type="button"
										className={`inline-flex float-right items-center px-4 py-2 mt-0 ml-0 ml-auto sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
										onClick={() => {
											// setVisible(true)
											showMember_Fn()
										}}
									>
										{/* <CheckCircleOutlined />  */}
										{visibleMember === false ? (
											<EyeOutlined />
										) : (
											<EyeInvisibleOutlined />
										)}

										<span class={`ml-2`}>
											{visibleMember === false ? "Show Detail" : "Hide Detail"}
										</span>
									</button>
								</div>
							</div>

							{visibleMember && (
								<>
									{members?.map((item) => (
										<div className="grid gap-4  bg-slate-200 p-5 rounded-md shadow-md sm:grid-cols-4 my-4 sm:gap-6">
											{/* <div className="sm:col-span-4 bg-slate-200 border-slate-200 text-lime-900 p-5 rounded-2xl grid grid-cols-4 gap-5">
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Group name..."
											type="text"
											label="Group Name"
											name="b_groupName"
											formControlName={personalDetailsData?.b_groupName}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Account No. 1..."
											type="text"
											label="Account No. 1"
											name="b_acc1"
											formControlName={personalDetailsData?.b_acc1}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Account No. 2..."
											type="text"
											label="Account No. 2"
											name="b_acc2"
											formControlName={personalDetailsData?.b_acc2}
											handleChange={handleChangePersonalDetails}
											mode={1}
											disabled
										/>
									</div>
								</div> */}
											<div>
												<TDInputTemplateBr
													placeholder="Form Number"
													type="text"
													label="Form Number"
													name="form_no"
													formControlName={item?.form_no}
													mode={1}
													disabled
												/>
											</div>

											<div>
												<TDInputTemplateBr
													placeholder="GRT Approve date..."
													type="text"
													label="GRT Approve Date"
													name="grt_approve_date"
													formControlName={
														item?.grt_approve_date || "0000-00-00"
													}
													handleChange={handleChangePersonalDetails}
													mode={1}
													disabled
												/>
											</div>
											<div>
												<TDInputTemplateBr
													placeholder="Member Code"
													type="text"
													label="Member Code"
													name="member_code"
													formControlName={item?.member_code}
													handleChange={handleChangePersonalDetails}
													mode={1}
													disabled
												/>
											</div>

											<div>
												<TDInputTemplateBr
													placeholder="Type member name..."
													type="text"
													label="Member Name"
													name="client_name"
													formControlName={item?.client_name}
													handleChange={handleChangePersonalDetails}
													mode={1}
													disabled
												/>
											</div>

											{/* <div>
									<TDInputTemplateBr
										placeholder="Branch..."
										type="text"
										label="Branch"
										name="b_branch"
										formControlName={personalDetailsData?.b_branch}
										handleChange={handleChangePersonalDetails}
										mode={1}
										disabled
									/>
								</div> */}

											{/* <div>
									<TDInputTemplateBr
										placeholder="Select Purpose"
										type="text"
										label="Purpose"
										name="b_purpose"
										formControlName={personalDetailsData?.b_purpose}
										handleChange={handleChangePersonalDetails}
										data={purposeOfLoan?.map((item, _) => ({
											code: item?.loan_purpose,
											name: item?.purpose_id,
										}))}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div> */}

											{/* <div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Select Sub Purpose"
										type="text"
										label="Sub Purpose"
										name="b_subPurpose"
										formControlName={personalDetailsData?.b_subPurpose}
										handleChange={handleChangePersonalDetails}
										data={subPurposeOfLoan?.map((item, _) => ({
											code: item?.sub_purp_id,
											name: item?.sub_purp_name,
										}))}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div> */}
											<div className="sm:col-span-2">
												<TDInputTemplateBr
													placeholder="Application Date..."
													type="text"
													label="Application Date"
													name="application_date"
													formControlName={item?.application_date}
													handleChange={handleChangePersonalDetails}
													mode={1}
													disabled
												/>
											</div>
											<div className="sm:col-span-2">
												<TDInputTemplateBr
													placeholder="Applied Amount..."
													type="text"
													label="Applied Amount"
													name="applied_amt"
													formControlName={item?.applied_amt}
													handleChange={handleChangePersonalDetails}
													mode={1}
													disabled
												/>
											</div>
										</div>
									))}
								</>
							)}
						</div>

						{/* ///////////////////////// */}

						{/* ///////////////////////// */}

						<div>
							<div className="grid gap-4 sm:grid-cols-2 sm:gap-6 my-3">
								<div className="text-xl mb-2 mt-5 text-[#DA4167] font-semibold underline">
									3. Transaction Details
								</div>
							</div>
							<div className="grid gap-4 grid-cols-12 sm:gap-6">
								<div className="sm:col-span-4">
									{!personalDetailsData.b_purpose && (
										<span
											style={{ color: "red" }}
											className="left-20 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
										>
											Required!
										</span>
									)}
									<TDInputTemplateBr
										placeholder="Select Purpose"
										type="text"
										label="Purpose"
										name="b_purpose"
										formControlName={personalDetailsData?.b_purpose}
										handleChange={handleChangePersonalDetails}
										data={purposeOfLoan?.map((item, _) => ({
											code: item?.loan_purpose,
											name: item?.purpose_id,
										}))}
										mode={2}
										// disabled={disburseOrNot}
									/>
								</div>

								{/* <div>
                  <TDInputTemplateBr
                    placeholder="Select Sub Purpose"
                    type="text"
                    label="Sub Purpose"
                    name="b_subPurpose"
                    formControlName={personalDetailsData?.b_subPurpose}
                    handleChange={handleChangePersonalDetails}
                    data={subPurposeOfLoan?.map((item, _) => ({
                      code: item?.sub_purp_id,
                      name: item?.sub_purp_name,
                    }))}
                    mode={2}
                    // disabled={disburseOrNot}
                  />
                </div> */}
								<div className="sm:col-span-4">
									{!transactionDetailsData.b_tnxDate && (
										<span
											style={{ color: "red" }}
											className="left-20 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
										>
											Required!
										</span>
									)}
									<TDInputTemplateBr
										placeholder="Transaction date..."
										type="date"
										label="Transaction Date"
										name="b_tnxDate"
										formControlName={transactionDetailsData.b_tnxDate}
										handleChange={handleChangeTnxDetailsDetails}
										min={"1900-12-31"}
										max={formatDateToYYYYMMDD(new Date())}
										mode={1}
										// disabled={disburseOrNot}
									/>
								</div>
								<div className="sm:col-span-4">
									{!disbursementDetailsData.b_scheme && (
										<span
											style={{ color: "red" }}
											className="right-0 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
										>
											Required!
										</span>
									)}
									<TDInputTemplateBr
										placeholder="Select Scheme..."
										type="text"
										label="Scheme"
										name="b_scheme"
										formControlName={disbursementDetailsData.b_scheme}
										handleChange={handleChangeDisburseDetails}
										data={schemes?.map((item, _) => ({
											code: item?.scheme_id,
											name: item?.scheme_name,
										}))}
										// data={[
										// 	{ code: "S1", name: "Scheme 1" },
										// 	{ code: "S1", name: "Scheme 2" },
										// 	{ code: "S3", name: "Scheme 3" },
										// ]}
										mode={2}
										// disabled={disburseOrNot}
									/>
								</div>
								<div className="sm:col-span-4">
									<TDInputTemplateBr
										placeholder="R.O.I..."
										type="text"
										label="Rate of Interest"
										name="b_roi"
										formControlName={disbursementDetailsData.b_roi}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled
									/>
								</div>
								<div className="sm:col-span-4" style={{ position: "relative" }}>
									{Period_mode_valid == "Weekly" ||
									Period_mode_valid == "Monthly" ? (
										""
									) : (
										<span
											style={{ color: "red" }}
											className="right-0 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
										>
											Required!
										</span>
									)}

									<TDInputTemplateBr
										placeholder="Select Mode"
										type="text"
										label="Mode*"
										name="b_mode"
										formControlName={disbursementDetailsData?.b_mode}
										handleChange={handleChangeDisburseDetails}
										data={[
											{
												code: "Monthly",
												name: "Monthly",
											},
											{
												code: "Weekly",
												name: "Weekly",
											},
										]}
										mode={2}
										// disabled={
										// 	!disbursementDetailsData.b_scheme || disburseOrNot
										// }
									/>
									{/* {JSON.stringify(Period_mode_valid, 2)} */}
								</div>

								<div className="sm:col-span-4">
									{!disbursementDetailsData.b_period && (
										<span
											style={{ color: "red" }}
											className="right-0 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
										>
											Required!
										</span>
									)}
									<TDInputTemplateBr
										placeholder="Period..."
										type="text"
										label="Period"
										name="b_period"
										formControlName={disbursementDetailsData.b_period}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled
									/>
								</div>

								<div className="sm:col-span-6">
									{!disbursementDetailsData?.b_fund && (
										<span
											style={{ color: "red" }}
											className="left-20 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
										>
											Required!
										</span>
									)}
									<TDInputTemplateBr
										placeholder="Select Fund..."
										type="text"
										label="Fund"
										name="b_fund"
										formControlName={disbursementDetailsData.b_fund}
										handleChange={handleChangeDisburseDetails}
										data={funds?.map((item, _) => ({
											code: item?.fund_id,
											name: item?.fund_name,
										}))}
										mode={2}
										// disabled={
										// 	!disbursementDetailsData?.b_scheme || disburseOrNot
										// }
									/>
								</div>
								{disbursementDetailsData.b_mode === "Monthly" ? (
									<>
										<div className="sm:col-span-6">
											{!disbursementDetailsData?.b_dayOfRecovery && (
												<span
													style={{ color: "red" }}
													className="right-0 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
												>
													Required!
												</span>
											)}
											<TDInputTemplateBr
												placeholder="Day of Recovery..."
												type="number"
												label={`Day of Recovery ${
													disbursementDetailsData.b_dayOfRecovery
														? `(${getOrdinalSuffix(
																disbursementDetailsData.b_dayOfRecovery
														  )} of every month)`
														: ""
												}`}
												name="b_dayOfRecovery"
												formControlName={
													disbursementDetailsData.b_dayOfRecovery
												}
												handleChange={handleChangeDisburseDetails}
												mode={1}
												// disabled={
												// 	!disbursementDetailsData?.b_scheme || disburseOrNot
												// }
											/>
											{(disbursementDetailsData.b_dayOfRecovery < 1 ||
												disbursementDetailsData.b_dayOfRecovery > 31) && (
												<VError title={`Day should be between 1 to 31`} />
											)}
										</div>
									</>
								) : (
									<>
										<div className="sm:col-span-6">
											{!disbursementDetailsData?.b_dayOfRecovery && (
												<span
													style={{ color: "red" }}
													className="right-0 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
												>
													Required!
												</span>
											)}
											<TDInputTemplateBr
												placeholder="Select Weekday"
												type="text"
												label="Day of Recovery"
												name="b_dayOfRecovery"
												formControlName={
													disbursementDetailsData?.b_dayOfRecovery
												}
												handleChange={handleChangeDisburseDetails}
												data={WEEKS}
												mode={2}
												// disabled={
												// 	!disbursementDetailsData.b_scheme || disburseOrNot
												// }
											/>
										</div>
									</>
								)}
								{/* <div>
                  <TDInputTemplateBr
                    placeholder="Bank charges..."
                    type="number"
                    label="Bank Charges"
                    name="b_bankCharges"
                    formControlName={disbursementDetailsData.b_bankCharges}
                    handleChange={handleChangeDisburseDetails}
                    mode={1}
                    // disabled={
                    // 	!disbursementDetailsData?.b_scheme || disburseOrNot
                    // }
                  />
                </div> */}
								<div className="sm:col-span-6">
									<TDInputTemplateBr
										placeholder="Processing charges..."
										type="number"
										label="Processing Charges"
										name="b_processingCharges"
										formControlName={
											disbursementDetailsData.b_processingCharges
										}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										// disabled={
										// 	!disbursementDetailsData?.b_scheme || disburseOrNot
										// }
									/>
								</div>
								<div className="sm:col-span-6">
									<TDInputTemplateBr
										placeholder="Bank charges..."
										type="number"
										label="Bank Charges"
										name="b_bankCharges"
										formControlName={disbursementDetailsData.b_bankCharges}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										// disabled={
										// 	!disbursementDetailsData?.b_scheme || disburseOrNot
										// }
									/>
								</div>

								{/* need to uncomment */}
								{/* 
								
									<div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
								<div>
									<TDInputTemplateBr
										placeholder="Select Scheme..."
										type="text"
										label="Scheme"
										name="b_scheme"
										formControlName={disbursementDetailsData.b_scheme}
										handleChange={handleChangeDisburseDetails}
										data={schemes?.map((item, _) => ({
											code: item?.scheme_id,
											name: item?.scheme_name,
										}))}
										// data={[
										// 	{ code: "S1", name: "Scheme 1" },
										// 	{ code: "S1", name: "Scheme 2" },
										// 	{ code: "S3", name: "Scheme 3" },
										// ]}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Select Mode"
										type="text"
										label="Mode"
										name="b_mode"
										formControlName={disbursementDetailsData?.b_mode}
										handleChange={handleChangeDisburseDetails}
										data={[
											{
												code: "Monthly",
												name: "Monthly",
											},
											{
												code: "Weekly",
												name: "Weekly",
											},
										]}
										mode={2}
										disabled={
											!disbursementDetailsData.b_scheme || disburseOrNot
										}
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Period..."
										type="text"
										label="Period"
										name="b_period"
										formControlName={disbursementDetailsData.b_period}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="R.O.I..."
										type="text"
										label="Rate of Interest"
										name="b_roi"
										formControlName={disbursementDetailsData.b_roi}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Select Fund..."
										type="text"
										label="Fund"
										name="b_fund"
										formControlName={disbursementDetailsData.b_fund}
										handleChange={handleChangeDisburseDetails}
										data={funds?.map((item, _) => ({
											code: item?.fund_id,
											name: item?.fund_name,
										}))}
										mode={2}
										disabled={
											!disbursementDetailsData?.b_scheme || disburseOrNot
										}
									/>
								</div>

								<div>
									<TDInputTemplateBr
										placeholder="Disburse Amount..."
										type="number"
										label={`Disburse Amount`}
										name="b_disburseAmt"
										formControlName={disbursementDetailsData.b_disburseAmt}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled={
											!disbursementDetailsData?.b_scheme || disburseOrNot
										}
									/>
									{+disbursementDetailsData.b_disburseAmt >
									+maxDisburseAmountForAScheme ? (
										<VError
											title={`Disburse amount must be less than ${maxDisburseAmountForAScheme}`}
										/>
									) : null}
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Bank charges..."
										type="number"
										label="Bank Charges"
										name="b_bankCharges"
										formControlName={disbursementDetailsData.b_bankCharges}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled={
											!disbursementDetailsData?.b_scheme || disburseOrNot
										}
									/>
								</div>
								<div>
									<TDInputTemplateBr
										placeholder="Processing charges..."
										type="number"
										label="Processing Charges"
										name="b_processingCharges"
										formControlName={
											disbursementDetailsData.b_processingCharges
										}
										handleChange={handleChangeDisburseDetails}
										mode={1}
										disabled={
											!disbursementDetailsData?.b_scheme || disburseOrNot
										}
									/>
								</div>
								{disbursementDetailsData.b_mode === "Monthly" ? (
									<div>
										<TDInputTemplateBr
											placeholder="Day of Recovery..."
											type="number"
											label={`Day of Recovery ${
												disbursementDetailsData.b_dayOfRecovery
													? `(${getOrdinalSuffix(
															disbursementDetailsData.b_dayOfRecovery
													  )} of every month)`
													: ""
											}`}
											name="b_dayOfRecovery"
											formControlName={disbursementDetailsData.b_dayOfRecovery}
											handleChange={handleChangeDisburseDetails}
											mode={1}
											disabled={
												!disbursementDetailsData?.b_scheme || disburseOrNot
											}
										/>
										{(disbursementDetailsData.b_dayOfRecovery < 1 ||
											disbursementDetailsData.b_dayOfRecovery > 31) && (
											<VError title={`Day should be between 1 to 31`} />
										)}
									</div>
								) : (
									<div>
										<TDInputTemplateBr
											placeholder="Select Weekday"
											type="text"
											label="Day of Recovery"
											name="b_dayOfRecovery"
											formControlName={disbursementDetailsData?.b_dayOfRecovery}
											handleChange={handleChangeDisburseDetails}
											data={WEEKS}
											mode={2}
											disabled={
												!disbursementDetailsData.b_scheme || disburseOrNot
											}
										/>
									</div>
								)}
							</div>
								
								
								
								
								
								
								*/}
								{/* <div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Bank Name..."
										type="text"
										label="Bank Name"
										name="b_bankName"
										formControlName={transactionDetailsData.b_bankName}
										handleChange={handleChangeTnxDetailsDetails}
										mode={1}
										disabled={disburseOrNot}
									/>
								</div> */}
								<div className="sm:col-span-12">
									{/* <TDInputTemplateBr
                    placeholder="Select Bank..."
                    type="text"
                    label="Bank"
                    name="b_bankName"
                    formControlName={transactionDetailsData.b_bankName}
                    handleChange={handleChangeTnxDetailsDetails}
                    data={banks?.map((item, _) => ({
                      code: item?.bank_code,
                      name: `${item?.bank_name} - ${item?.branch_name} - ${item?.ifsc}`,
                    }))}
                    mode={2}
                    disabled={disburseOrNot}
                  /> */}

									<>
										{!transactionDetailsData.b_bankName && (
											<span
												style={{ color: "red" }}
												className="right-0 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
											>
												Required!
											</span>
										)}
										<label
											for="frm_co"
											class="block mb-2 text-sm capitalize font-bold text-slate-800
				 dark:text-gray-100"
										>
											Bank
										</label>
										<Select
											showSearch
											placeholder={"Banks"}
											label="Banks"
											name="b_bankName"
											filterOption={false} // Disable default filtering to use API search
											onSearch={(e) => getBanks(e)} // Call API on typing
											notFoundContent={
												loading ? <Spin size="small" /> : "No results found"
											}
											formControlName={transactionDetailsData.b_bankName}
											// formControlName={formValues.Grp_wit_Co ? formValues.Grp_wit_Co : COPickup}
											//   handleChange={(e) => {
											// 	// setCOPickup(e.target.value)
											// 	// formik.handleChange(e)
											// 	console.log(e.target.value,'valuevaluevaluevaluevalue')
											// }}
											// value={formValues.Grp_wit_Co ? formValues.Grp_wit_Co : COPickup} // Controlled value
											onChange={(value) => {
												console.log(value)
												handleChangeTnxDetailsDetails(value)
												// formik.setFieldValue("Grp_wit_Co", value);
											}}
											options={banks?.map((item, _) => ({
												value: item?.bank_code,
												label: `${item?.bank_name} - ${item?.branch_name} - ${item?.ifsc}`,
											}))}
											//   style={{ width: 250 }}
											mode={2}
											// disabled={location?.state.approval_status == "A" ? true : false} //location?.state.approval_status == null ? '': location?.state.approval_status
										/>
									</>
								</div>

								{transactionDetailsData.b_tnxMode === "B" && (
									<>
										{/* <div>
											<TDInputTemplateBr
												placeholder="Cheque/Ref. no..."
												type="text"
												label="Cheque/Ref. No."
												name="b_chequeOrRefNo"
												formControlName={transactionDetailsData.b_chequeOrRefNo}
												handleChange={handleChangeTnxDetailsDetails}
												mode={1}
												disabled={disburseOrNot}
											/>
										</div>

										<div>
											<TDInputTemplateBr
												placeholder="Cheque/Ref. Date..."
												type="date"
												label="Cheque/Ref. Date"
												name="b_chequeOrRefDate"
												formControlName={
													transactionDetailsData.b_chequeOrRefDate
												}
												handleChange={handleChangeTnxDetailsDetails}
												min={"1900-12-31"}
												max={formatDateToYYYYMMDD(new Date())}
												mode={1}
												disabled={disburseOrNot}
											/>
										</div> */}
									</>
								)}

								{/* <div>
									<TDInputTemplateBr
										placeholder="Select Transaction Type..."
										type="text"
										label="Transaction Type"
										name="b_tnxType"
										formControlName={transactionDetailsData.b_tnxType}
										handleChange={handleChangeTnxDetailsDetails}
										data={tnxTypes?.map((item, _) => ({
											code: item?.id,
											name: item?.name,
										}))}
										mode={2}
										disabled
									/>
								</div>
								<div className="sm:col-span-2">
									<TDInputTemplateBr
										placeholder="Select Transaction Mode..."
										type="text"
										label="Transaction Mode"
										name="b_tnxMode"
										formControlName={transactionDetailsData.b_tnxMode}
										handleChange={handleChangeTnxDetailsDetails}
										data={tnxModes?.map((item, _) => ({
											code: item?.id,
											name: item?.name,
										}))}
										mode={2}
										disabled={disburseOrNot}
									/>
								</div> */}

								<div className="sm:col-span-12">
									{!transactionDetailsData.b_remarks && (
										<span
											style={{ color: "red" }}
											className="right-0 ant-tag ant-tag-error ant-tag-borderless text-[12.6px] my-0 css-dev-only-do-not-override-1tse2sn absolute"
										>
											Required!
										</span>
									)}
									<TDInputTemplateBr
										placeholder="Type Remarks..."
										type="text"
										label="Remarks"
										name="b_remarks"
										formControlName={transactionDetailsData.b_remarks}
										handleChange={handleChangeTnxDetailsDetails}
										mode={3}
										disabled={disburseOrNot}
									/>
								</div>
							</div>
						</div>
						<div>
							<div className="grid gap-4 sm:grid-cols-2 sm:gap-6 my-3">
								<div className="text-xl mb-2 mt-5 text-[#DA4167] font-semibold underline">
									4. Disbursement Details
								</div>
							</div>

							{membersForDisb?.map((item, index) => (
								<div className="grid gap-4 p-5 my-4 sm:grid-cols-3 bg-slate-200 rounded-md shadow-md sm:gap-6">
									<div>
										<TDInputTemplateBr
											placeholder="Member Code"
											type="text"
											label="Member Code"
											name="member_code"
											formControlName={item.member_code}
											// handleChange={handleChangeDisburseDetails}
											// data={schemes?.map((item, _) => ({
											// 	code: item?.scheme_id,
											// 	name: item?.scheme_name,
											// }))}
											// data={[
											// 	{ code: "S1", name: "Scheme 1" },
											// 	{ code: "S1", name: "Scheme 2" },
											// 	{ code: "S3", name: "Scheme 3" },
											// ]}
											mode={1}
											disabled={disburseOrNot}
										/>
									</div>

									<div>
										<TDInputTemplateBr
											placeholder="Member Name"
											type="text"
											label="Member Name"
											name="client_name"
											formControlName={item?.client_name}
											// handleChange={handleChangeDisburseDetails}
											// data={[
											// 	{
											// 		code: "Monthly",
											// 		name: "Monthly",
											// 	},
											// 	{
											// 		code: "Weekly",
											// 		name: "Weekly",
											// 	},
											// ]}
											mode={1}
											disabled={
												!disbursementDetailsData.b_scheme || disburseOrNot
											}
										/>
									</div>

									<div>
										<TDInputTemplateBr
											placeholder="Amount..."
											type="text"
											label="Amount"
											name="prn_disb_amt"
											// value= {item.prn_disb_amt}
											// formControlName={item.prn_disb_amt}
											formControlName={item.prn_disb_amt}
											handleChange={(e) => handleDisbursementChange(index, e)}
											mode={1}
											// disabled
										/>
									</div>
									{/* {JSON.stringify(AppliedDisbursLoan, 2)} */}
								</div>
							))}
							<div className="flex justify-end">
								<Tag className="bg-teal-500 text-white text-lg">
									Tot. Disbursement Amt. : {totDisb}
								</Tag>
							</div>
						</div>

						{!disburseOrNot && (
							<>
								{AppliedDisbursLoan && (
									<div className="mt-10">
										{/* {Period_mode_valid ==  'Weekly' || Period_mode_valid ==  'Monthly' ? "" : ""}  */}
										{
											// Period_mode_valid === "Weekly" ||
											// Period_mode_valid === "Monthly" ||
											!disbursementDetailsData.b_fund ||
											!disbursementDetailsData.b_mode ||
											!disbursementDetailsData.b_period ||
											!disbursementDetailsData.b_dayOfRecovery ||
											!transactionDetailsData.b_bankName ||
											!transactionDetailsData.b_remarks ||
											!personalDetailsData.b_purpose ||
											!transactionDetailsData.b_tnxDate ||
											!disbursementDetailsData.b_period ||
											!disbursementDetailsData.b_scheme ? (
												<BtnComp mode="A" onReset={onReset} />
											) : (
												<BtnComp mode="B" onReset={onReset} disabled />
											)
										}
									</div>
								)}
							</>
						)}

						{disburseOrNot && params?.id > 0 && (
							<div>
								<div className="w-full my-10 border-t-4 border-gray-500 border-dashed"></div>
								<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
									<div className="text-xl mb-2 text-[#DA4167] font-semibold underline">
										4. Installment Details
									</div>
								</div>
								<div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Installment Start Date..."
											type="text"
											label="Installment Start Date"
											name="b_isntallmentStartDate"
											formControlName={
												installmentDetailsData?.b_isntallmentStartDate
													? new Date(
															installmentDetailsData?.b_isntallmentStartDate
													  ).toLocaleDateString("en-GB")
													: ""
											}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Installment End Date..."
											type="text"
											label="Installment End Date"
											name="b_isntallmentEndDate"
											formControlName={
												installmentDetailsData?.b_isntallmentEndDate
													? new Date(
															installmentDetailsData?.b_isntallmentEndDate
													  ).toLocaleDateString("en-GB")
													: ""
											}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Principle Amount..."
											type="text"
											label="Principle Amount"
											name="b_principleDisbursedAmount"
											formControlName={
												installmentDetailsData?.b_principleDisbursedAmount
											}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Interest Amount..."
											type="text"
											label="Interest Amount"
											name="b_interestAmount"
											formControlName={installmentDetailsData?.b_interestAmount}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Receivable..."
											type="text"
											label="Receivable"
											name="b_receivable"
											formControlName={installmentDetailsData?.b_receivable}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Principle EMI Amount..."
											type="text"
											label="Principle EMI Amount"
											name="b_principleEMIAmount"
											formControlName={
												installmentDetailsData?.b_principleEMIAmount
											}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div>
										<TDInputTemplateBr
											placeholder="Interest EMI..."
											type="text"
											label="Interest EMI"
											name="b_interestEMIAmount"
											formControlName={
												installmentDetailsData?.b_interestEMIAmount
											}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
									<div className="sm:col-span-2">
										<TDInputTemplateBr
											placeholder="Total EMI Amount..."
											type="text"
											label="Total EMI Amount"
											name="b_totalEMIAmount"
											formControlName={installmentDetailsData?.b_totalEMIAmount}
											handleChange={handleChangeInstallmentDetails}
											mode={1}
											disabled
										/>
									</div>
								</div>
								{loanType === "D" && (
									<div className="mt-10">
										<BtnComp
											mode="N"
											showUpdateAndReset={false}
											showReject={true}
											onRejectApplication={() => setVisible3(true)}
											showForward={true}
											onForwardApplication={() => setVisible2(true)}
										/>
									</div>
								)}
							</div>
						)}
					</div>
				</form>
			</Spin>

			{disbursementDetailsData?.b_mode.length > 0 && (
				<>
					<DialogBox
						flag={4}
						onPress={() => setVisible(!visible)}
						visible={visible}
						onPressYes={() => {
							//   if (personalDetails.acc_no2>0) {
							//     Message(
							//       "warning",
							//       "Fill all the values properly OR Update the Account Numbers from Group!"
							//     );
							//     setVisible(false);
							//   }
							// // if(checkTot==1)
							// else{

							handleSubmitDisbursementForm()
							setVisible(!visible)
							// }
						}}
						onPressNo={() => setVisible(!visible)}
					/>
				</>
			)}

			{/* For Approve */}
			<DialogBox
				flag={4}
				onPress={() => setVisible2(!visible2)}
				visible={visible2}
				onPressYes={() => {
					handleApproveLoanDisbursement()
					setVisible2(!visible2)
				}}
				onPressNo={() => setVisible2(!visible2)}
			/>

			{/* For Reject */}
			<DialogBox
				flag={4}
				onPress={() => setVisible3(!visible3)}
				visible={visible3}
				onPressYes={() => {
					handleRejectLoanDisbursement()
					setVisible3(!visible3)
				}}
				onPressNo={() => setVisible3(!visible3)}
			/>
		</>
	)
}

export default DisbursmentForm

import { useCallback, useMemo, useState, useEffect } from "react"
import { Select, Button } from "antd"
import { useFormik } from "formik"
import * as Yup from "yup"
import { debounce } from "@mui/material"
import TDInputTemplateBr from "../../Components/TDInputTemplateBr"
import {
	defaultTransferCOGenericFormProps,
	TRANSFER_CO_PARAMS,
	fetchBranches,
	fetchCONamesBranchWise,
} from "./TranceferCOGenericUtil"
import DialogBox from "../../Components/DialogBox"
import BtnComp from "../../Components/BtnComp"
import axios from "axios"
import { url } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { useNavigate } from "react-router-dom"
import { DataTable } from "primereact/datatable"
import Column from "antd/es/table/Column"
const mcClass = "px-4 pb-5 bg-slate-50 rounded-lg shadow-lg h-auto my-10 mx-32"
const labelClass = "block mb-2 text-sm capitalize font-bold text-slate-800"

// const {
//     FROM_BRANCH,
//     FROM_CO,
//     TO_BRANCH,
//     TO_CO,
//     GROUP_NAME_CODE,
//     REMARKS, CREATED_BY, CREATED_DATE } = TRANSFER_CO_PARAMS;

const { FROM_BRANCH, FROM_CO, TO_BRANCH, TO_CO, GROUP_NAME_CODE, REMARKS } =
	TRANSFER_CO_PARAMS

const TranceferCOGenericForm = (props) => {
	const [toBranchOptions, setToBranchOptions] = useState([])
	const [toCOOptions, setToCOOptions] = useState([])
	const [visible3, setVisible3] = useState(() => false)
	const userDetails = JSON.parse(localStorage.getItem("user_details"))
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [MemberListView, setMemberListView] = useState(() => [])

	const {
		inactiveSearchGroup,
		inactiveFromCO,
		inactiveFromBranch,
		inactiveToCO,
		inactiveToBranch,
		inactiveRemarks,
		allowEditMode,
		receivedData,
		onEditModeUpdateRequest,
		action,
		actionLabel,
	} = { ...defaultTransferCOGenericFormProps, ...props }

	const transferCOFormManager = useFormik({
		enableReinitialize: true,
		initialValues: {
			// [FROM_BRANCH.name]: receivedData.from_brn ?? "",
			// [FROM_CO.name]: receivedData.from_co ?? "",
			[TO_BRANCH.name]: receivedData.to_brn ?? "",
			[TO_CO.name]: receivedData.to_co ?? "",
			[GROUP_NAME_CODE.name]: receivedData.group_code ?? "",
			[REMARKS.name]: receivedData.remarks ?? "",
			approved_by: userDetails?.emp_id,
			modified_by: userDetails?.emp_id,
		},
		validationSchema: Yup.object({
			// [TO_BRANCH.name]: Yup.string().required("Required"),
			// [TO_CO.name]: Yup.string().required("Required"),
			[REMARKS.name]: Yup.string().required("Remarks is Required"),
		}),
		validateOnChange: true,
	})

	const getActualFormFiled = useCallback(
		(fieldName) => (
			<input
				value={transferCOFormManager.values[fieldName]}
				type="hidden"
				name={fieldName}
			/>
		),
		[transferCOFormManager.values]
	)

	const getEditBox = useCallback(
		(fieldName) => {
			if (
				allowEditMode &&
				Array.isArray(allowEditMode) &&
				allowEditMode.length &&
				allowEditMode.some((fName) => fName === fieldName)
			) {
				return (
					<span
						onClick={() => {
							onEditModeUpdateRequest(fieldName)
						}}
						style={{ cursor: "pointer", color: "#888" }}
					>
						{" "}
						Edit
					</span>
				)
			}

			return <></>
		},
		[allowEditMode, onEditModeUpdateRequest]
	)

	const SearchGroupName = useMemo(() => {
		const { group_name } = receivedData
		if (inactiveSearchGroup && group_name) {
			return (
				<div>
					<label className={labelClass}>Search Group Name or Code </label>
					<span>{group_name}</span>
				</div>
			)
		}

		return (
			<div>
				<label for={GROUP_NAME_CODE.name} className={labelClass}>
					{GROUP_NAME_CODE.label}
					{userDetails.id != 3 && getEditBox(GROUP_NAME_CODE.name)}
				</label>
				{getActualFormFiled(GROUP_NAME_CODE.name)}
				<Select
					placeholder="Search Name Code or Group"
					label={GROUP_NAME_CODE.label}
				/>
			</div>
		)
	}, [inactiveSearchGroup, receivedData, getEditBox, getActualFormFiled])

	const SearchCreatedName = useMemo(() => {
		const { created_by } = receivedData
		if (inactiveSearchGroup && created_by) {
			return (
				<div>
					<label className={labelClass}>Created By</label>
					<span>{created_by}</span>
				</div>
			)
		}
	}, [inactiveSearchGroup, receivedData, getEditBox, getActualFormFiled])

	const SearchCreatedDate = useMemo(() => {
		const { created_at } = receivedData
		const formattedDate = created_at
			? new Date(created_at).toLocaleString("en-GB", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: false, // 24-hour format
			  })
			: ""
		if (inactiveSearchGroup && created_at) {
			return (
				<div>
					<label className={labelClass}>Created Date</label>
					<span>{formattedDate}</span>
				</div>
			)
		}
	}, [inactiveSearchGroup, receivedData, getEditBox, getActualFormFiled])

	const FromCO = useMemo(() => {
		const { from_co_name, from_co } = receivedData
		if (inactiveFromCO) {
			return (
				<div title={from_co}>
					<label className={labelClass}>
						{FROM_CO.label}
						{userDetails.id != 3 && getEditBox(FROM_CO.name)}
					</label>
					<span>{from_co_name}</span>
				</div>
			)
		} else {
			return (
				<div>
					<TDInputTemplateBr
						placeholder="From CO"
						type="text"
						label={FROM_CO.label}
						name={FROM_CO.name}
						mode={1}
					/>
				</div>
			)
		}
	}, [inactiveFromCO, receivedData, getEditBox])

	const FromBranch = useMemo(() => {
		const { from_brn_name, from_brn } = receivedData
		if (inactiveFromBranch) {
			return (
				<div title={from_brn}>
					<label className={labelClass}>
						{FROM_BRANCH.label}
						{userDetails.id != 3 && getEditBox(FROM_BRANCH.name)}
					</label>
					<span>{from_brn_name}</span>
				</div>
			)
		} else {
			return (
				<div>
					<TDInputTemplateBr
						placeholder={FROM_BRANCH.label}
						type="text"
						label={FROM_BRANCH.label}
						name={FROM_BRANCH.name}
						mode={1}
					/>
				</div>
			)
		}
	}, [inactiveFromBranch, receivedData, getEditBox])

	const ToBranch = useMemo(() => {
		const { to_brn_name, to_brn } = receivedData
		if (inactiveToBranch) {
			return (
				<div title={to_brn}>
					<label className={labelClass}>
						{TO_BRANCH.label}
						{userDetails.id != 3 && getEditBox(TO_BRANCH.name)}
					</label>
					<span
						style={{
							backgroundColor: "#d5e6fb",
							padding: "5px 8px",
							borderRadius: 5,
							fontSize: 14,
						}}
					>
						{to_brn_name}
					</span>
				</div>
			)
		} else {
			return (
				<div>
					<label for={TO_BRANCH.name} className={labelClass}>
						Search Branch Name or Code
					</label>
					{getActualFormFiled(TO_BRANCH.name)}
					<Select
						value={to_brn_name}
						showSearch
						placeholder="Search Branch Name Or Code"
						label="Search Branch Name Or Code"
						filterOption={false}
						onSearch={debounce(async (branch) => {
							const branchList = await fetchBranches({ branch })
							setToBranchOptions(branchList)
						})}
						onChange={(val) => {
							transferCOFormManager.setFieldValue(TO_BRANCH.name, val)
							transferCOFormManager.setFieldValue(TO_CO.name, "")
						}}
						options={toBranchOptions}
					/>
				</div>
			)
		}
	}, [
		inactiveToBranch,
		receivedData,
		getEditBox,
		getActualFormFiled,
		toBranchOptions,
		transferCOFormManager,
	])

	const ToCO = useMemo(() => {
		const { to_co_name, to_co } = receivedData
		if (inactiveToCO) {
			return (
				<div title={to_co}>
					<label className={labelClass}>
						{TO_CO.label}
						{userDetails.id != 3 && getEditBox(TO_CO.name)}
					</label>
					<span
						style={{
							backgroundColor: "#d5e6fb",
							padding: "5px 8px",
							borderRadius: 5,
							fontSize: 14,
						}}
					>
						{to_co_name}
					</span>
				</div>
			)
		} else {
			return (
				<div>
					<label for={TO_CO.name} className={labelClass}>
						Set To CO
					</label>
					{getActualFormFiled(TO_CO.name)}
					<Select
						placeholder="Search CO"
						label="Search CO"
						filterOption={true}
						onChange={(val) => {
							transferCOFormManager.setFieldValue(TO_CO.name, val)
						}}
						options={toCOOptions}
					/>
				</div>
			)
		}
	}, [
		inactiveToCO,
		receivedData,
		getEditBox,
		transferCOFormManager,
		getActualFormFiled,
		toCOOptions,
	])

	const Remarks = useMemo(() => {
		const { remarks } = receivedData
		if (inactiveRemarks) {
			return (
				<div>
					<label className={labelClass}>
						{REMARKS.label}
						{userDetails.id != 3 && getEditBox(REMARKS.name)}
					</label>
					<span>{remarks}</span>
				</div>
			)
		} else {
			return (
				<div>
					<label className="block mb-2 text-sm capitalize font-bold text-slate-800">
						Remarks{" "}
					</label>
					<textarea
						style={{ width: "100%", borderRadius: 5 }}
						placeholder={REMARKS.label}
						type="text"
						// label={REMARKS.label}
						name={REMARKS.name}
						value={transferCOFormManager.values[REMARKS.name]}
						onChange={transferCOFormManager.handleChange}
					/>
				</div>
			)
		}
	}, [
		inactiveRemarks,
		receivedData,
		getEditBox,
		transferCOFormManager.values,
		transferCOFormManager.handleChange,
	])

	useEffect(() => {
		const loadCO = async () => {
			const colist = await fetchCONamesBranchWise({
				branch_code: transferCOFormManager.values[TO_BRANCH.name],
			})
			setToCOOptions(colist)
		}
		loadCO()
	}, [transferCOFormManager.values])

	// const transferCOSubmit = useCallback((e) => {
	//     setVisible3(false)
	//     e.preventDefault();

	//     transferCOFormManager.validateForm().then(() => {
	//         action(transferCOFormManager.values);
	//     }).catch((error) => {
	//         console.error('Error', error)
	//     })
	// }, [transferCOFormManager, action])

	const transferCOSubmit = useCallback(
		async (e) => {
			e.preventDefault() // Prevent default form submission
			setVisible3(false) // Hide modal or UI component

			setLoading(true) // Optional: Show loading state

			console.log("transfer_co_view_all_details", transferCOFormManager.values)
			try {
				await transferCOFormManager.validateForm() // Validate form first
				const creds = transferCOFormManager.values // Extract form values

				const res = await axios.post(`${url}/approve_co_trans_dt`, creds)

				// console.log("transfer_co_view_all_details", res?.data?.msg);
				Message("success", "Updated successfully.")

				// Navigate back to the previous page
				// navigate(-1);
				navigate(`/homebm/trancefercofromapprove-unic/`)
			} catch (err) {
				console.error("Error while updating", err)
				Message("error", "Some error occurred while updating.")
			} finally {
				setLoading(false) // Reset loading state
			}
		},
		[transferCOFormManager, url, navigate]
	)

	const handleFetchMemberListView = async () => {
		setLoading(true)
		const creds = {
			group_code: receivedData.group_code,
		}
		await axios
			.post(`${url}/groupwise_mem_details`, creds)
			.then((res) => {
				console.log("groupwise_mem_details", res?.data?.msg)
				setMemberListView(res?.data?.msg)
			})
			.catch((err) => {
				console.log("?????????????????????", err)
			})

		setLoading(false)
	}

	useEffect(() => {
		handleFetchMemberListView()
	}, [])

	return (
		<div className="card bg-white border-2 p-5 mx-16 shadow-lg rounded-3xl surface-border border-round surface-ground flex-auto font-medium">
			{/* // <main className={mcClass}></main> */}
			{/* <div className="flex flex-row gap-3 mt-0  py-3 rounded-xl">
            <div className="text-3xl text-slate-700 font-bold">
                Approve Transfer CO
            </div>
        </div> */}
			<form>
				<div className="grid grid-cols-3 gap-5 mt-5">
					{SearchCreatedName}
					{SearchCreatedDate}
				</div>

				<div className="grid grid-cols-3 gap-5 mt-5">
					{SearchGroupName}
					{FromCO}
					{FromBranch}
				</div>
				<div className="grid grid-cols-3 gap-5 mt-5">
					{ToBranch}
					{ToCO}
				</div>
				<div className="grid grid-cols-1 gap-0 mt-5">
					{Remarks}
					{transferCOFormManager.errors[REMARKS.name] && (
						<div style={{ color: "red", fontSize: 12 }}>
							{transferCOFormManager.errors[REMARKS.name]}
						</div>
					)}
				</div>

				{MemberListView?.length > 0 && (
					<div className="sm:col-span-2 mt-5">
						<div>
							<label
								className="block mb-2 text-sm capitalize font-bold text-slate-800
					dark:text-gray-100"
							>
								{" "}
								Member List
								{/* <span style={{color:'red'}} className="ant-tag ml-2 ant-tag-error ant-tag-borderless text-[12.6px] my-2">
					(You can Select Maxmimum 4 Member)</span> */}
							</label>

							{/* <Toast ref={toast} /> */}

							<DataTable
								value={MemberListView?.map((item, i) => [
									{ ...item, id: i },
								]).flat()}
								// expandedRows={expandedRows}
								// onRowToggle={(e) => setExpandedRows(e.data)}
								// onRowExpand={onRowExpand}
								// onRowCollapse={onRowCollapse}
								selectionMode="checkbox"
								// selection={COMemList_select}
								// onSelectionChange={(e) => setSelectedProducts(e.value)}
								// onSelectionChange={(e) => handleSelectionChange(e)}
								tableStyle={{ minWidth: "50rem" }}
								// rowExpansionTemplate={rowExpansionTemplate}
								dataKey="id"
								// paginator
								// rows={rowsPerPage}
								// first={currentPage}
								// onPage={onPageChange}
								// rowsPerPageOptions={[5, 10, 20]} // Add options for number of rows per page
								tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
							>
								<Column
									header="Sl No."
									body={(rowData) => (
										<span style={{ fontWeight: "bold" }}>
											{rowData?.id + 1}
										</span>
									)}
								></Column>

								<Column field="member_code" header="Member Code"></Column>

								<Column field="client_name" header="Member Name"></Column>
								<Column field="outstanding" header="Outstanding"></Column>
							</DataTable>
						</div>
					</div>
				)}
				<div className="mt-0">
					{/* <Button onClick={transferCOSubmit}>{actionLabel ?? 'Submit'}</Button> */}
					{/* <BtnComp
								mode="B"
								showUpdateAndReset={false}
								showForward={true}
								onForwardApplication={() => setVisible3(true)}
							/> */}

					{userDetails?.id != 3 && <BtnComp
						mode="B"
						showUpdateAndReset={false}
						showForward={true}
						onForwardApplication={() => {
							if (transferCOFormManager.errors[REMARKS.name]) {
								// Show validation error before opening dialog
								transferCOFormManager.setTouched({ [REMARKS.name]: true })
							} else {
								setVisible3(true) // Open dialog only if no error
							}
						}}
					/>}

					<DialogBox
						flag={4}
						visible={visible3}
						onPress={() => setVisible3(!visible3)} // Close on clicking the background
						onPressYes={(e) => {
							transferCOSubmit(e) // Call function when "Yes" is clicked
							setVisible3(false) // Close dialog
						}}
						onPressNo={() => setVisible3(false)} // Close on No
					/>
				</div>
			</form>
		</div>
	)
}
export default TranceferCOGenericForm

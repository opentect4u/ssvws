import axios from "axios"
import { url } from "../../Address/BaseUrl"

export const fetchCONamesBranchWise = async (payload) => {
	const { data } = await axios.post(`${url}/fetch_co_name_branchwise`, payload)
	return (
		data.msg.map((el) => ({ label: el.to_co_name, value: el.to_co_id })) ?? []
	)
}

export const fetchCompletePendingRequestDetails = async (payload) => {
	const { data } = await axios.post(
		`${url}/transfer_co_view_all_details`,
		payload
	)
	return Array.isArray(data.msg) ? data.msg[0] : null
}

export const getUserDetails = () => {
	const userDetailsData = localStorage.getItem("user_details")
	return userDetailsData ? JSON.parse(userDetailsData) : null
}

export const fetchBranches = async (payload) => {
	const { data } = await axios.post(`${url}/fetch_branch_name`, payload)
	return Array.isArray(data.msg)
		? data.msg.map((el) => ({ label: el.branch_name, value: el.branch_code }))
		: []
}

export const TRANSFER_CO_ERROR_MSG = {
	NotFromPendingList:
		"Sorry system didn't receive any records from pending list. Please go back to the pending list and select one.",
}

export const TRANSFER_CO_PARAMS = {
	REMARKS: {
		name: "remarks",
		label: "Remarks",
	},
	GROUP_NAME_CODE: {
		name: "group_code",
		label: "Group Code With Name",
	},
	FROM_CO: {
		name: "frm_co",
		label: "From CO",
	},
	TO_CO: {
		name: "to_co",
		label: "To CO",
	},
	FROM_BRANCH: {
		name: "frm_branch",
		label: "From Branch",
	},
	TO_BRANCH: {
		name: "to_brn",
		label: "To Branch",
	},
	CREATED_BY: {
		name: "created_by",
		label: "Created By",
	},
	CREATED_DATE: {
		name: "created_at",
		label: "Created Date",
	},
}

export const defaultTransferCOGenericFormProps = {
	onEditModeUpdateRequest: () => {},
	inactiveSearchGroup: false,
	inactiveFromCO: false,
	inactiveFromBranch: false,
	inactiveToCO: false,
	inactiveToBranch: false,
	inactiveRemarks: false,
	receivedData: null,
}

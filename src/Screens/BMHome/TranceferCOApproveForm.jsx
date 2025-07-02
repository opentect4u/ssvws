import React, { useCallback, useEffect, useState } from "react"
import "../LoanForm/LoanForm.css"
import { useParams } from "react-router"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { useLocation } from "react-router"
import TranceferCOGenericForm from "./TranceferCOGenericForm"
import {
	fetchCompletePendingRequestDetails,
	getUserDetails,
	TRANSFER_CO_ERROR_MSG,
	TRANSFER_CO_PARAMS,
} from "./TranceferCOGenericUtil"
import FormHeader from "../../Components/FormHeader"
// import { useParams } from "react-router"

const { TO_BRANCH, REMARKS, TO_CO, FROM_BRANCH } = TRANSFER_CO_PARAMS

function TranceferCOApproveForm() {
	const location = useLocation()
	const userDetails = getUserDetails()
	const { id: group_code } = useParams()
	const [loading, setLoading] = useState(false)
	const [recentEntries, setRecentEntries] = useState({})
	const [editModes, setEditModes] = useState({
		inactiveRemarks: true,
		inactiveToCO: true,
		inactiveToBranch: true,
	})
	const params = useParams()

	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", location.state)

	useEffect(() => {
		const populateDetails = async () => {
			if (userDetails?.brn_code) {
				setLoading(true)
				try {
					const { approval_status, from_co } = location.state ?? {}
					const recentData = await fetchCompletePendingRequestDetails({
						group_code,
						flag: approval_status,
						from_co,
						from_brn: userDetails?.brn_code,
					})

					setRecentEntries((previousData) => {
						return {
							...previousData,
							...recentData,
						}
					})
				} catch {
					console.log("Loading group details are failing")
				}
				setLoading(false)
			}
		}
		populateDetails()
	}, [group_code, location.state, userDetails?.brn_code])

	const onEditModeUpdateRequest = useCallback((fieldName) => {
		console.log("start", fieldName)
		setEditModes((existingModes) => {
			const m = { ...existingModes }
			switch (fieldName) {
				case TO_BRANCH.name:
					m.inactiveToBranch = !m.inactiveToBranch
					if (!m.inactiveToBranch) {
						m.inactiveToCO = false
					}
					break

				case TO_CO.name:
					m.inactiveToCO = !m.inactiveToCO
					break

				case REMARKS.name:
					m.inactiveRemarks = !m.inactiveRemarks
					break

				default:
			}
			return m
		})
	}, [])

	const approveAction = (formData) => {
		alert(JSON.stringify(formData, undefined, 4))
	}

	return (
		<>
			<section className="dark:bg-[#001529] flex justify-center align-middle p-5">
				<div className=" p-5 w-4/5 min-h-screen rounded-3xl">
					<div className="w-auto mx-14 my-4">
						<FormHeader text={`Approve Transfer CO`} mode={2} />
					</div>
					<Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-blue-800 dark:text-gray-400"
						spinning={loading}
					>
						{Object.entries(recentEntries).length === 0 ? (
							<span>{TRANSFER_CO_ERROR_MSG.NotFromPendingList}</span>
						) : (
							<>
								<TranceferCOGenericForm
									onEditModeUpdateRequest={onEditModeUpdateRequest}
									inactiveSearchGroup={true}
									inactiveFromCO={true}
									inactiveFromBranch={true}
									inactiveToBranch={editModes.inactiveToBranch}
									inactiveToCO={editModes.inactiveToCO}
									inactiveRemarks={editModes.inactiveRemarks}
									receivedData={recentEntries}
									allowEditMode={[TO_BRANCH.name, TO_CO.name, REMARKS.name]}
									action={approveAction}
									actionLabel="Approve"
								/>
							</>
						)}
					</Spin>
				</div>
			</section>
		</>
	)
}

export default TranceferCOApproveForm

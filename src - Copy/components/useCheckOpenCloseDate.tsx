import { useCallback, useState } from "react"
import axios from "axios"
// import { ADDRESSES } from "../Address/Addresses"
// import { loginStorage } from "../Utils/loginStorage"
import { ADDRESSES } from "../config/api_list"
import { loginStorage } from "../storage/appStorage"

/* -------------------- Types -------------------- */

interface LoginStore {
	brn_code?: string | number
	token?: string
}

interface ApiResponse {
	end_flag?: "C" | "O" | string
}

/* -------------------- Hook -------------------- */

const useCheckOpenCloseDate = (loginStore?: LoginStore) => {
	const [openDtCloseDt, setOpenDtCloseDt] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const checkOpenCloseDate = useCallback(async (): Promise<void> => {
		if (!loginStore?.brn_code || !loginStore?.token) return

		setLoading(true)

		const creds = {
			branch_code: loginStore.brn_code,
		}

		try {
			const res = await axios.post<ApiResponse>(
				ADDRESSES.CHECK_BRN_OPEN_CLOSE,
				creds,
				{
					headers: {
						Authorization: loginStore.token,
						"Content-Type": "application/json",
					},
				}
			)

			console.log(creds, "CHECK OPEN CLOSE RESPONSE", res?.data)

			if (res?.data?.end_flag === "C") {
				loginStorage.set("pendingApprove", JSON.stringify("yes"))
				setOpenDtCloseDt(res.data.end_flag)
			} else {
                loginStorage.set("pendingApprove", JSON.stringify("no"))
                setOpenDtCloseDt(res.data.end_flag)
            }
		} catch (err) {
			console.error("CHECK OPEN CLOSE ERROR", err)
		} finally {
			setLoading(false)
		}
	}, [loginStore?.brn_code, loginStore?.token])

	return {
		checkOpenCloseDate,
		openDtCloseDt,
		loading,
	}
}

export default useCheckOpenCloseDate

export const disableCondition = (userType, approvalStatus) => {
	const disableInputArray = ["S", "A", "R","U"]
	// const approvalStatus = memberDetails?.approval_status
	// const userType = formik.values.userType // Assuming userType is stored in formik
  

	if (userType == 10 && approvalStatus === "S") {
		return false
	}

	if (userType == 1 && approvalStatus === "A") {
		return true
	}

	if (userType == 10 && approvalStatus === "R") {
		return true
	}
	if (userType == 2 && approvalStatus === "U") {
		return true
	}

	// if (userType == 13 && approvalStatus === "U") {
	// 	return true
	// }
	// if (userType == 10) {
	// 	return true
	// }

	if (userType === 10 && approvalStatus === "A") {
		// No one can edit if approval status is "A"
		return true
	}

	if (userType === 2 && approvalStatus === "A") {
		// No one can edit if approval status is "A"
		return true
	}

	// if (userType == 3 && approvalStatus === "R") {
	// 	return true
	// }

	if (userType === 2 && approvalStatus === "R") {
		// Disable for user type 2 when approval status is "S"
		return true
	}

	if (userType === 2 && approvalStatus === "S") {
		// Disable for user type 2 when approval status is "S"
		return true
	}
	// if (approvalStatus === "S" && userType === 2) {
	// 	// Disable for user type 2 when approval status is "S"
	// 	return true
	// }

	// if (approvalStatus === "R") {
	// 	if (userType === 3) {
	// 		// Disable for user type 3 when status is "R" (3 rejects)
	// 		return true
	// 	} else if (userType === 2) {
	// 		// Enable for user type 2 when status is "R"
	// 		return false
	// 	}
	// }

	// For other cases, keep it disabled based on the default array
	return false
}

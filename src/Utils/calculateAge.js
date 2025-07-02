export function calculateAge(dob) {
	const dobDate = new Date(dob)
	const currentDate = new Date()

	let age = currentDate.getFullYear() - dobDate.getFullYear()

	// Check if the birthday has occurred this year
	const monthDiff = currentDate.getMonth() - dobDate.getMonth()
	const dayDiff = currentDate.getDate() - dobDate.getDate()

	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age-- // Birthday hasn't happened yet this year
	}

	return age
}

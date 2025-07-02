export function formatDateToYYYYMMDD(dob) {
	// Create a Date object from the string
	const date = new Date(dob)

	// Extract the year, month, and day
	const yyyy = date.getFullYear()
	const mm = String(date.getMonth() + 1).padStart(2, "0") // Months are zero-indexed
	const dd = String(date.getDate()).padStart(2, "0")

	// Format the result as yyyy-mm-dd
	return `${yyyy}-${mm}-${dd}`
}

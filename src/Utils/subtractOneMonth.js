export function subtractOneMonth(monthYearStr) {
	const [monthStr, yearStr] = monthYearStr.split(" ")
	const date = new Date(`${monthStr} 1, ${yearStr}`)

	date.setMonth(date.getMonth() - 1)

	const formatted = new Intl.DateTimeFormat("en-US", {
		month: "long",
		year: "numeric",
	}).format(date)

	return formatted
}

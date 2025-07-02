export function getOrdinalSuffix(num) {
	const suffixes = ["th", "st", "nd", "rd"]
	const remainder = num % 100

	if (remainder >= 11 && remainder <= 13) {
		return `${num}${suffixes[0]}`
	}

	switch (num % 10) {
		case 1:
			return `${num}${suffixes[1]}`
		case 2:
			return `${num}${suffixes[2]}`
		case 3:
			return `${num}${suffixes[3]}`
		default:
			return `${num}${suffixes[0]}`
	}
}

const units = [
	"",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
]
const teens = [
	"",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen",
]
const tens = [
	"",
	"ten",
	"twenty",
	"thirty",
	"forty",
	"fifty",
	"sixty",
	"seventy",
	"eighty",
	"ninety",
]
const thousands = ["", "thousand", "million", "billion"]

function helper(num) {
	if (num === 0) return ""
	else if (num < 10) return units[num] + " "
	else if (num < 20) return teens[num - 10] + " "
	else if (num < 100) return tens[Math.floor(num / 10)] + " " + helper(num % 10)
	else return units[Math.floor(num / 100)] + " hundred " + helper(num % 100)
}

export function numberToWords(num) {
	if (num === 0) return "ZERO"

	let word = ""

	let i = 0
	while (num > 0) {
		if (num % 1000 !== 0) {
			word = helper(num % 1000) + thousands[i] + " " + word
		}
		num = Math.floor(num / 1000)
		i++
	}

	return word.trim().toUpperCase()
}

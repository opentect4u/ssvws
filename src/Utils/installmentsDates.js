/**
 * The function `getMonthlyInstallmentDates` generates an array of monthly installment dates based on a
 * specified day of the month and loan period in months.
 * @param dayOfMonth - The `dayOfMonth` parameter in the `getMonthlyInstallmentDates` function
 * represents the day of the month on which the installment is due. This parameter specifies the day of
 * the month for each installment date in the loan period.
 * @param [loanPeriodMonths=24] - The `loanPeriodMonths` parameter in the `getMonthlyInstallmentDates`
 * function represents the total number of months for which the loan installment dates need to be
 * calculated. By default, it is set to 24 months if no value is provided when calling the function.
 * This parameter determines how many monthly
 * @returns The function `getMonthlyInstallmentDates` returns an array of strings representing the
 * installment dates for a loan, based on the provided `dayOfMonth` and `loanPeriodMonths` parameters.
 */
function getMonthlyInstallmentDates(dayOfMonth, loanPeriodMonths = 24) {
	if (dayOfMonth < 1 || dayOfMonth > 31) {
		throw new Error("Day must be between 1 and 31")
	}

	const installmentDates = []
	const currentDate = new Date()

	for (let i = 0; i < loanPeriodMonths; i++) {
		const installmentDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + i,
			dayOfMonth
		)

		if (installmentDate.getDate() !== dayOfMonth) {
			installmentDate.setDate(0)
		}

		installmentDates.push(installmentDate.toISOString().split("T")[0])
	}

	return installmentDates
}

// const dayOfMonth = 15 // For instance, collecting on the 15th of each month
// const installmentDates = getMonthlyInstallmentDates(dayOfMonth)
// console.log(installmentDates)

/**
 * The function `getWeeklyInstallmentDates` calculates and returns a list of weekly installment dates
 * based on a specified day of the week and loan period in weeks.
 * @param dayOfWeek - The `dayOfWeek` parameter represents the day of the week for which you want to
 * calculate the installment dates. It should be a number between 1 (Sunday) and 7 (Saturday), where 1
 * represents Sunday, 2 represents Monday, and so on.
 * @param [loanPeriodWeeks=48] - The `loanPeriodWeeks` parameter in the `getWeeklyInstallmentDates`
 * function represents the total number of weeks for which installment dates need to be calculated. By
 * default, it is set to 48 weeks if no value is provided when calling the function. This parameter
 * determines how many weekly installment
 * @returns The function `getWeeklyInstallmentDates` returns an array of installment dates for a loan,
 * starting from the next occurrence of the specified day of the week (e.g., Sunday to Saturday) and
 * continuing for the specified number of weeks (default is 48 weeks).
 */
function getWeeklyInstallmentDates(dayOfWeek, loanPeriodWeeks = 48) {
	if (dayOfWeek < 1 || dayOfWeek > 7) {
		throw new Error(
			"Day of the week must be between 1 (Sunday) and 7 (Saturday)"
		)
	}

	const installmentDates = []

	let currentDate = new Date()
	let currentDay = currentDate.getDay() + 1

	let dayDifference = (dayOfWeek - currentDay + 7) % 7
	if (dayDifference === 0) dayDifference = 7

	currentDate.setDate(currentDate.getDate() + dayDifference)

	for (let i = 0; i < loanPeriodWeeks; i++) {
		installmentDates.push(currentDate.toISOString().split("T")[0])

		currentDate.setDate(currentDate.getDate() + 7)
	}

	return installmentDates
}

// const dayOfWeek = 3; // For instance, collecting on Tuesday (1 = Sunday, 2 = Monday, ..., 7 = Saturday)
// const installmentDates = getWeeklyInstallmentDates(dayOfWeek);
// console.log(installmentDates);

export { getMonthlyInstallmentDates, getWeeklyInstallmentDates }

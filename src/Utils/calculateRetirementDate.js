export const calculateRetirementDate = (dateOfBirth, retirementAge) => {
	const birthDate = new Date(dateOfBirth)
	const retirementYear = birthDate.getFullYear() + retirementAge
	const retirementDate = new Date(birthDate.setFullYear(retirementYear))
	return retirementDate
}

// // Example usage
// const dateOfBirth = '1980-01-15';
// const retirementAge = 65;
// const retirementDate = calculateRetirementDate(dateOfBirth, retirementAge);
// console.log(retirementDate); // Output: Mon Jan 15 2045

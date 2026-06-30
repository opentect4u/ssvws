export function calculateAge(dob: Date): number {
    const now = new Date();
    const yearDiff = now.getFullYear() - dob.getFullYear();

    // Check if the birthday has occurred this year
    const isBirthdayPassed =
        now.getMonth() > dob.getMonth() ||
        (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());

    // Subtract one year if the birthday hasn't passed yet
    return isBirthdayPassed ? yearDiff : yearDiff - 1;
}
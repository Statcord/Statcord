export const isNanOrInfinity = number => {
	if (isNaN(number) || number === Infinity) return 0
	return number
}
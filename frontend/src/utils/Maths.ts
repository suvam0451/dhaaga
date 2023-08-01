/**
 * Used by intersection observer,
 * to determine which post to snap next to
 * @param st
 * @returns index of element, or -1 if not possibel
 */
export function SecondSmallestInSet(st: Set<number>, total: number) {
	let arr = Array.from(st);
  console.log("evaluating", arr)
	if (total < 2) {
		return -1;
	}

	if (arr.length === 1 && total - 1 > arr[0]) {
		return arr[0] + 1;
	}
	var max = Math.min.apply(null, arr), // get the max of the array
	maxi = arr.indexOf(max);
	arr[maxi] = Infinity; // replace max in the array with -infinity
	var secondMax = Math.min.apply(null, arr); // get the new max
	arr[maxi] = max;

  console.log("returning", secondMax)
	return secondMax;
}

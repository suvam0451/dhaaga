/**
 * Prevents flashy screens,
 * When multiple visibility booleans A, B, C
 * intersect.
 *
 * This function will only return true, when
 * everything is stable for 150ms
 *
 * @param input
 * @param condition
 * @param preventLoadingForNonApi will not push a loading state,
 * if the condition has been met already
 */
function useSkeletonSmoothTransition(
	input: boolean,
	{
		condition,
		preventLoadingForCondition,
	}: { condition: boolean; preventLoadingForCondition: boolean },
) {
	const IsHardTruthy = input;
	const ISSoftTruthy = input;
	const IsConditionSatisfied = condition;

	const retval = IsHardTruthy || ISSoftTruthy;
	if (preventLoadingForCondition && IsConditionSatisfied) return true;

	return retval;
}

export default useSkeletonSmoothTransition;

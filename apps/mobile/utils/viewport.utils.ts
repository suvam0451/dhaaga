export type ViewMeasurement = {
	x: number;
	y: number;
	width: number;
	height: number;
};

/**
 * Helps with viewport measurements
 * and popover alignment
 */
export class ViewportUtils {
	/**
	 * Which direction the popover should be expanded in
	 * @param deviceHeight
	 * @param measurement
	 */
	static getPopoverDirection(
		deviceHeight: number,
		measurement: ViewMeasurement,
	): 'top' | 'bottom' {
		return 'top';
	}
}

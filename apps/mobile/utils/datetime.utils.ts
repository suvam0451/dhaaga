export class DatetimeUtil {
	static getOneWeekAgo() {
		const now = new Date();
		const oneWeekAgo = new Date(now);
		oneWeekAgo.setDate(now.getDate() - 7);
		return oneWeekAgo;
	}

	/**
	 * relative time formatting in human-readable
	 * format
	 *
	 * e.g. - 1m, 1y etc.
	 * @param dt
	 */
	static timeAgo(dt: Date | string) {
		try {
			const curr = Date.now();
			const prev = new Date(dt).getTime();

			const diff = curr - prev; // Difference in milliseconds

			// Convert to seconds, minutes, hours, etc.
			const seconds = Math.floor(diff / 1000);
			const minutes = Math.floor(seconds / 60);
			const hours = Math.floor(minutes / 60);
			const days = Math.floor(hours / 24);
			const weeks = Math.floor(days / 7);
			const months = Math.floor(days / 30);
			const years = Math.floor(days / 365);

			if (years > 0) {
				return `${years}y`; // Years
			} else if (months > 0) {
				return `${months}mo`; // Months
			} else if (weeks > 0) {
				return `${weeks}w`; // Weeks
			} else if (days > 0) {
				return `${days}d`; // Days
			} else if (hours > 0) {
				return `${hours}h`; // Hours
			} else if (minutes > 0) {
				return `${minutes}m`; // Minutes
			} else {
				return `${seconds}s`; // Seconds
			}
		} catch (e) {
			console.log('[WARN]: datetime conversion failed for input', dt);
		}
	}
}

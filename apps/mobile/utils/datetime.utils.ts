export class DatetimeUtil {
	static getOneWeekAgo() {
		const now = new Date();
		const oneWeekAgo = new Date(now);
		oneWeekAgo.setDate(now.getDate() - 7);
		return oneWeekAgo;
	}
}

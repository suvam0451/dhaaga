class AppService {
	/**
	 * Lite edition disabled NonFreeNet
	 * features like server lookup, tenor
	 * and giphy
	 *
	 * It is also used to handle notifications
	 * differently from firebase
	 */
	static isLiteEdition() {
		return process.env.IS_LITE_EDITION || false;
	}
}

export { AppService };

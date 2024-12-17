class CryptoService {
	/**
	 * Sorts a list of user ids and
	 * generates a hash string
	 * @param input
	 */
	static async hashUserList(input: string[]) {
		return '';
		// return await Crypto.digestStringAsync(
		//     Crypto.CryptoDigestAlgorithm.MD5,
		//     input.sort((a, b) => a.localeCompare(b)).join(",")
		// );
	}
}

export default CryptoService;

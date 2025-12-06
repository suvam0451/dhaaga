export const urlAlphabet =
	'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

class Util {
	/**
	 * the original code is taken from
	 * the "nanoid" library
	 *
	 * This is the cryptographically
	 * non-secure version using pure js
	 * @param size
	 */
	static nanoId(size = 21): string {
		let id = '';
		// A compact alternative for `for (var i = 0; i < step; i++)`.
		let i = size | 0;
		while (i--) {
			// `| 0` is more compact and faster than `Math.floor()`.
			id += urlAlphabet[(Math.random() * 64) | 0];
		}
		return id;
	}
}

export { Util as RandomUtil };

import * as Clipboard from 'expo-clipboard';

export class ClipboardUtils {
	static async read() {
		return await Clipboard.getStringAsync();
	}

	static async write(value: string) {
		return await Clipboard.setStringAsync(value);
	}

	static async compare(value: string) {
		return value === (await ClipboardUtils.read());
	}
}

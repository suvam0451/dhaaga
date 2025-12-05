export function getHumanReadableError(e: any): string | any {
	if (e?.response?.data?.error?.code) {
		return e.response.data.error.code;
	} else if (e?.code) {
		return e.code;
	} else {
		console.log(
			'[WARN]: error could not be formatted in a human readable format',
			e,
		);
		return e;
	}
}

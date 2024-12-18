export class OpenGraphUtil {
	static parseOgObject(og: any) {
		if (!og) return null;

		const title: string = og?.title;
		// page desc
		const desc: string = og?.description;
		// website logo
		const favicon: string = og?.favicons?.length > 0 ? og?.favicons[0] : null;
		const image: string = og?.images?.length > 0 ? og?.images[0] : null;
		const images: string[] = og?.images;
		const videos: string[] = og?.videos;

		return {
			title,
			desc,
			favicon,
			image,
			images,
			videos,
		};
	}
}

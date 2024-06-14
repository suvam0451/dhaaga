import type { mastodon } from "masto";
import { RestClient } from "../../native-client";
import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

export type TimelineQuery = {
	maxId?: string;
	minId?: string;
};
export default class TimelinesService {
	static getHomeTimeline = async (
		client: RestClient,
		query?: TimelineQuery
	): Promise<mastodon.v1.Status[]> => {
		const queryUrl = `https://${client.url}/api/v1/timelines/home`;
		if (query?.maxId) {
			queryUrl.concat(`max_id=${query?.maxId}&`);
		}
		if (query?.minId) {
			queryUrl.concat(`min_id=${query?.minId}&`);
		}

		const axiosClient = applyCaseMiddleware(axios.create());
		try {
			const res = await axiosClient.get<mastodon.v1.Status[]>(queryUrl, {
				headers: {
					Authorization: `Bearer ${client.accessToken}`,
				},
			});
			return res.data;
		} catch (e) {
			console.log(e);
			return [];
		}
	};

	static getTimelineByHashtag = async (
		client: RestClient,
		q: string,
		query?: TimelineQuery
	): Promise<mastodon.v1.Status[]> => {
		const queryUrl = `https://${client.url}/api/v1/timelines/tag/${q}`;
		if (query?.maxId) {
			queryUrl.concat(`max_id=${query?.maxId}&`);
		}
		if (query?.minId) {
			queryUrl.concat(`min_id=${query?.minId}&`);
		}

		const axiosClient = applyCaseMiddleware(axios.create());
		try {
			const res = await axiosClient.get<mastodon.v1.Status[]>(queryUrl, {
				headers: {
					Authorization: `Bearer ${client.accessToken}`,
				},
			});

			return res.data;
		} catch (e) {
			console.log(e);
			return [];
		}
	};
}

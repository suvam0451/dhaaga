import { TagTargetInterface } from '@dhaaga/bridge';

class InstanceService {
	static async getTagInfoCrossDomain(
		tag: TagTargetInterface,
		ourDomain: string,
		theirDomain?: string,
	) {
		const defaultRetval = {
			common: {
				users: 0,
				posts: 0,
			},
			remote: null,
		};

		let totalAccounts = 0;
		let totalPosts = 0;
		const history = tag.getHistory();
		if (!history) return defaultRetval;

		for (let i = 0; i < history.length; i++) {
			const historyItem = history[i];
			totalAccounts += parseInt(historyItem.accounts);
			totalPosts += parseInt(historyItem.uses);
		}

		if (!theirDomain || ourDomain === theirDomain) {
			return {
				common: {
					users: totalAccounts,
					posts: totalPosts,
				},
				remote: null,
			};
		}

		try {
			const res = await fetch(`${theirDomain}/api/hashtags/show`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					tag: tag.getName(),
				}),
			});

			if (!res.ok) {
				throw new Error(`Request failed: ${res.status} ${res.statusText}`);
			}

			const data = await res.json();
			// return data;
		} catch (e) {}

		return {
			common: {
				users: totalAccounts,
				posts: totalPosts,
			},
			remote: null,
		};
	}
}

export default InstanceService;

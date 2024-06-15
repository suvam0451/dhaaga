import { useActivityPubRestClientContext } from './useActivityPubRestClient';
import { useEffect, useState } from 'react';
import { mastodon } from '@dhaaga/shared-provider-mastodon/src';

/**
 * Fetch and show relationship with user
 *
 * //FIXME: known bug. follow status is not replicated immediately by mastodon
 * @param id is the user's id
 * @constructor
 */
function useRelationshipWith(id: string) {
	const { primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const { client } = useActivityPubRestClientContext();
	const [ApiResponse, setApiResponse] = useState(null);
	const [IsLoading, setIsLoading] = useState(false);
	const [Data, setData] = useState({
		blockedBy: false,
		blocking: false,
		domainBlocking: false,
		endorsed: false,
		followedBy: false,
		following: false,
		id: '',
		languages: null,
		muting: false,
		mutingNotifications: false,
		note: '',
		notifying: false,
		requested: false,
		requestedBy: false,
		showingReblogs: false,
	});

	async function fn() {
		return await client.getRelationshipWith([id]);
	}

	useEffect(() => {
		refetch();
	}, []);

	function refetch() {
		setIsLoading(true);
		fn()
			.then((res) => {
				setApiResponse(res);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	function setter(res: any) {
		setApiResponse(res);
	}

	useEffect(() => {
		const retval = {
			blockedBy: false,
			blocking: false,
			domainBlocking: false,
			endorsed: false,
			followedBy: false,
			following: false,
			id: '',
			languages: null,
			muting: false,
			mutingNotifications: false,
			note: '',
			notifying: false,
			requested: false,
			requestedBy: false,
			showingReblogs: false,
		};
		if (!ApiResponse || ApiResponse.length === 0) return;

		let _data = null;
		if (Array.isArray(ApiResponse)) {
			_data = ApiResponse[0];
		} else {
			_data = ApiResponse;
		}
		switch (domain) {
			case 'mastodon': {
				const __data = _data as mastodon.v1.Relationship;
				retval.following = __data.following;
			}
		}
		setData(retval);
	}, [ApiResponse]);

	return {
		relationship: Data,
		setter,
		relationshipLoading: IsLoading,
	};
}

export default useRelationshipWith;

import { Dispatch, SetStateAction } from 'react';
import { ActivityPubClient } from '@dhaaga/bridge';

class ActivitypubRelationService {
	blockedBy: boolean;
	blocking: boolean;
	domainBlocking: boolean;
	endorsed: boolean;
	followedBy: boolean;
	following: boolean;
	id: '';
	languages: null;
	muting: boolean;
	mutingNotifications: boolean;
	note: '';
	notifying: boolean;
	requested: boolean;
	requestedBy: boolean;
	showingReblogs: boolean;
	error: boolean;

	client: ActivityPubClient;
	userId: string;
	setLoading: Dispatch<SetStateAction<boolean>>;

	constructor(
		client: ActivityPubClient,
		userId: string,
		setLoading: Dispatch<SetStateAction<boolean>>,
	) {
		this.client = client;
		this.userId = userId;
		this.setLoading = setLoading;
	}

	async follow() {
		this.setLoading(true);
		try {
			const { data, error } = await this.client.accounts.follow(this.userId, {
				reblogs: true,
				notify: false,
			});
			if (error) {
				console.log('failed to follow', error);
				return false;
			}
			return true;
		} catch (e) {
			console.log('failed to follow', e);
			return false;
		} finally {
			this.setLoading(false);
		}
	}

	async unFollow(did?: string) {
		try {
			const { data, error } = await this.client.accounts.unfollow(
				did || this.userId,
			);
			if (error) {
				console.log('failed to unfollow', error);
				return false;
			}
			return true;
		} catch (e) {
			console.log('failed to unfollow', e);
			return false;
		} finally {
			this.setLoading(false);
		}
	}
}

export default ActivitypubRelationService;

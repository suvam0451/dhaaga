import { Dispatch, SetStateAction } from 'react';
import { ApiTargetInterface } from '@dhaaga/bridge';

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

	client: ApiTargetInterface;
	userId: string;
	setLoading: Dispatch<SetStateAction<boolean>>;

	constructor(
		client: ApiTargetInterface,
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
			await this.client.users.follow(this.userId, {
				reblogs: true,
				notify: false,
			});
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
			await this.client.users.unfollow(did || this.userId);
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

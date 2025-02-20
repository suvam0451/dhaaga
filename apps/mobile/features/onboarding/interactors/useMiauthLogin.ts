import { useEffect, useState } from 'react';
import { verifyMisskeyToken } from '@dhaaga/bridge';
import { AccountCreationPreviewProps } from '../presenters/MiauthSignIn';
import { router, useLocalSearchParams } from 'expo-router';
import { RandomUtil } from '@dhaaga/core';
import { AccountService } from '../../../database/entities/account';
import { ACCOUNT_METADATA_KEY } from '../../../database/entities/account-metadata';
import { Alert } from 'react-native';
import { APP_EVENT_ENUM } from '../../../services/publishers/app.publisher';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import {
	useAppDb,
	useAppPublishers,
	useHub,
} from '../../../hooks/utility/global-state-extractors';

function useMiauthLogin() {
	const [Session, setSession] = useState<string>('');
	const [PreviewCard, setPreviewCard] =
		useState<AccountCreationPreviewProps | null>(null);
	const [Token, setToken] = useState<string | null>(null);
	const [MisskeyId, setMisskeyId] = useState<string | null>(null);
	const [SessionConfirmed, setSessionConfirmed] = useState(false);
	const { db } = useAppDb();
	const { loadAccounts } = useHub();
	const { appSub } = useAppPublishers();

	const params = useLocalSearchParams();
	const _signInUrl: string = params['signInUrl'] as string;
	const _subdomain: string = params['subdomain'] as string;
	const _domain: string = params['domain'] as string;

	async function autoVerifyFromSession() {
		const res = await verifyMisskeyToken(`https://${_subdomain}`, Session);
		if (res.ok) {
			setPreviewCard({
				displayName: res?.user?.name,
				username: res?.user?.username,
				avatar: res?.user?.avatarUrl,
			});
			setToken(res.token);
			setMisskeyId(res.user.id);
		}
	}

	// Misskey has no use for the callback token
	function webviewCallback(state: any) {
		const regex = /^https:\/\/suvam.io\/\?session=(.*?)/;
		if (regex.test(state.url)) {
			setSessionConfirmed(true);
			autoVerifyFromSession();
		}
	}

	useEffect(() => {
		try {
			const regex = /^https:\/\/(.*?)\/miauth\/(.*?)\?.*?/;
			if (regex.test(_signInUrl)) {
				const session = regex.exec(_signInUrl)[2];
				setSession(session);
			}
		} catch (e) {
			setSession(RandomUtil.nanoId());
		}
	}, []);

	async function confirm() {
		const upsertResult = AccountService.upsert(
			db,
			{
				identifier: MisskeyId,
				server: _subdomain,
				driver: _domain,
				username: PreviewCard.username,
				avatarUrl: PreviewCard.avatar,
				displayName: PreviewCard.displayName,
			},
			[
				{
					key: ACCOUNT_METADATA_KEY.DISPLAY_NAME,
					value: PreviewCard.displayName,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.AVATAR_URL,
					value: PreviewCard.avatar,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.USER_IDENTIFIER,
					value: MisskeyId,
					type: 'string',
				},
				{
					key: ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
					value: Token,
					type: 'string',
				},
			],
		);
		if (upsertResult.type === 'success') {
			Alert.alert('Account Added. Refresh if any screen feels outdated.');
			appSub.publish(APP_EVENT_ENUM.ACCOUNT_LIST_CHANGED);
			loadAccounts();
			``;
			router.replace(APP_ROUTING_ENUM.SETTINGS_TAB_ACCOUNTS);
		} else {
			console.log(upsertResult);
		}
	}

	return {
		callback: webviewCallback,
		confirm,
		sessionConfirmed: SessionConfirmed,
		loginUri: _signInUrl,
		previewCard: PreviewCard,
	};
}

export default useMiauthLogin;

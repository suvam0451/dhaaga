import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import { useState } from 'react';
import { APP_FONT } from '../../../../../../styles/AppTheme';
import ActivityPubService from '../../../../../../services/activitypub.service';
import { router } from 'expo-router';
import HideOnKeyboardVisibleContainer from '../../../../../containers/HideOnKeyboardVisibleContainer';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../../shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../../../states/useScrollMoreOnPageEnd';
import PopularServers from '../fragments/PopularServers';
import {
	POPULAR_AKKOMA_SERVERS,
	POPULAR_MASTODON_SERVERS,
	POPULAR_PLEROMA_SERVERS,
} from '../data/server-meta';
import EnterYourServer from '../fragments/EnterYourServer';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function AccountsScreen() {
	const { appManager } = useGlobalState(
		useShallow((o) => ({
			appManager: o.appSession,
		})),
	);
	const [Subdomain, setSubdomain] = useState('mastodon.social');

	async function onPressNext() {
		const signInStrategy = await ActivityPubService.signInUrl(
			Subdomain,
			appManager,
		);
		if (signInStrategy?.clientId && signInStrategy?.clientSecret) {
			appManager.cache.setAtprotoServerClientTokens(
				Subdomain,
				signInStrategy?.clientId,
				signInStrategy?.clientSecret,
			);
		}
		router.push({
			pathname: 'profile/onboard/signin-md',
			params: {
				signInUrl: signInStrategy?.loginUrl,
				subdomain: Subdomain,
				domain: signInStrategy?.software,
				clientId: signInStrategy?.clientId,
				clientSecret: signInStrategy?.clientSecret,
			},
		});
	}

	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar
			title={`Select Instance`}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<ScrollView
				contentContainerStyle={{
					marginTop: 54,
				}}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{
						display: 'flex',
						paddingHorizontal: 12,
						marginBottom: 54,
						marginTop: 16,
					}}
				>
					<EnterYourServer
						ServerText={Subdomain}
						setServerText={setSubdomain}
						buttonColor={'rgb(99, 100, 255)'}
						onPressLogin={onPressNext}
					/>

					<HideOnKeyboardVisibleContainer>
						<PopularServers
							label={'Popular Mastodon Servers'}
							items={POPULAR_MASTODON_SERVERS}
							onSelect={setSubdomain}
						/>
						<PopularServers
							label={'Popular Pleroma Servers'}
							items={POPULAR_PLEROMA_SERVERS}
							onSelect={setSubdomain}
						/>
						<PopularServers
							label={'Popular Akkoma Servers'}
							items={POPULAR_AKKOMA_SERVERS}
							onSelect={setSubdomain}
						/>
					</HideOnKeyboardVisibleContainer>
				</KeyboardAvoidingView>
				<View style={{ height: 16 }} />
			</ScrollView>
		</AppTopNavbar>
	);
}

export default AccountsScreen;

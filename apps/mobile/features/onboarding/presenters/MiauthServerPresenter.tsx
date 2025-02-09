import { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	ScrollView,
} from 'react-native';
import { Button } from '@rneui/base';
import { APP_FONT } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import HideOnKeyboardVisibleContainer from '../../../components/containers/HideOnKeyboardVisibleContainer';
import { router } from 'expo-router';
import ActivityPubService from '../../../services/activitypub.service';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import Feather from '@expo/vector-icons/Feather';
import PopularServers from '../components/PopularServers';
import {
	POPULAR_FIREFISH_SERVERS,
	POPULAR_MISSKEY_SERVERS,
	POPULAR_SHARKEY_SERVERS,
} from '../data/server-meta';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import {
	useAppManager,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { Loader } from '../../../components/lib/Loader';

function MiauthServerPresenter() {
	const [InputText, setInputText] = useState('misskey.io');
	const { appManager } = useAppManager();
	const { theme } = useAppTheme();

	const [IsLoading, setIsLoading] = useState(false);
	async function onPressNext() {
		setIsLoading(true);
		try {
			const signInStrategy = await ActivityPubService.signInUrl(
				InputText,
				appManager,
			);
			const subdomain = InputText;
			router.push({
				pathname: APP_ROUTING_ENUM.MISSKEY_SIGNIN,
				params: {
					signInUrl: signInStrategy?.loginUrl,
					subdomain,
					domain: signInStrategy?.software,
				},
			});
		} finally {
			setIsLoading(false);
		}
	}

	const { translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

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
						marginTop: 16,
						marginBottom: 54,
						paddingHorizontal: 12,
					}}
				>
					<View>
						<Text
							style={{
								textAlign: 'center',
								color: theme.textColor.medium,
								marginBottom: 24,
								fontSize: 24,
								fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							}}
						>
							Enter your server
						</Text>
						<View style={styles.inputContainerRoot}>
							<View style={styles.inputContainer}>
								<Feather
									name="server"
									size={24}
									color={theme.textColor.medium}
								/>
							</View>
							<TextInput
								style={{
									fontSize: 16,
									color: APP_FONT.MONTSERRAT_HEADER,
									textDecorationLine: 'none',
									fontFamily: APP_FONTS.INTER_500_MEDIUM,
									flex: 1,
									marginLeft: 4,
								}}
								autoCapitalize={'none'}
								placeholderTextColor={theme.textColor.medium}
								placeholder="Your server url"
								onChangeText={setInputText}
								value={InputText}
							/>
						</View>

						<View style={{ alignItems: 'center', marginTop: 16 }}>
							{IsLoading ? (
								<View style={{ paddingVertical: 16 }}>
									<Loader />
								</View>
							) : (
								<Button
									disabled={false}
									color={
										'linear-gradient(90deg, rgb(0, 179, 50), rgb(170, 203, 0))'
									}
									onPress={onPressNext}
									buttonStyle={{ width: 128, borderRadius: 8 }}
								>
									Log In
								</Button>
							)}
						</View>
					</View>

					<View style={{ height: 32 }} />
					<HideOnKeyboardVisibleContainer>
						<PopularServers
							label={'Popular Misskey Servers'}
							items={POPULAR_MISSKEY_SERVERS}
							onSelect={setInputText}
						/>
						<PopularServers
							label={'Popular Sharkey Servers'}
							items={POPULAR_SHARKEY_SERVERS}
							onSelect={setInputText}
						/>
						<PopularServers
							label={'Popular Firefish Servers'}
							items={POPULAR_FIREFISH_SERVERS}
							onSelect={setInputText}
						/>
					</HideOnKeyboardVisibleContainer>
				</KeyboardAvoidingView>
				<View style={{ height: 16 }} />
			</ScrollView>
		</AppTopNavbar>
	);
}

const styles = StyleSheet.create({
	inputContainerRoot: {
		flexDirection: 'row',
		borderWidth: 2,
		borderColor: 'rgba(136,136,136,0.4)',
		borderRadius: 8,
		marginBottom: 12,
	},
	inputContainer: { width: 24 + 8 * 2, padding: 8 },
});

export default MiauthServerPresenter;

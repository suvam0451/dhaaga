import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import { Button } from '@rneui/themed';
import { APP_FONT, APP_THEME } from '../../../../styles/AppTheme';
import TitleOnlyStackHeaderContainer from '../../../containers/TitleOnlyStackHeaderContainer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { router } from 'expo-router';
import SoftwareHeader from '../../../../screens/accounts/fragments/SoftwareHeader';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';

function SelectProviderStack() {
	const route = useRoute();
	const navigation = useNavigation<any>();

	return (
		<TitleOnlyStackHeaderContainer
			route={route}
			navigation={navigation}
			headerTitle={`Select Platform`}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: APP_THEME.BACKGROUND,
					height: '100%',
				}}
			>
				<View style={{ marginHorizontal: 12 }}>
					<View style={styles.selectSignInPlatformSection}>
						<View style={styles.selectSignInPlatformCenter}>
							<SoftwareHeader
								software={KNOWN_SOFTWARE.MASTODON}
								mb={0}
								mt={0}
							/>
						</View>
						<Text style={styles.platformDescription}>
							Use this for Pleroma, Akkoma and Mastodon
						</Text>
						<View style={{ marginTop: 4 }}>
							<Button
								onPress={() => {
									router.navigate('/settings/onboard/add-mastodon');
								}}
								color={'rgb(99, 100, 255)'}
								size={'md'}
								containerStyle={{ borderRadius: 8 }}
								buttonStyle={{ borderRadius: 8 }}
							>
								<Text style={styles.buttonText}>Login</Text>
							</Button>
						</View>
					</View>

					<View style={styles.selectSignInPlatformSection}>
						<View style={styles.selectSignInPlatformCenter}>
							<SoftwareHeader software={KNOWN_SOFTWARE.MISSKEY} mb={0} mt={0} />
							<Text style={styles.platformDescription}>
								Use this for Misskey, Firefish, Sharkey, Iceshrimp (Untested)
							</Text>
						</View>

						<View style={{ paddingTop: 16 }}>
							<Button
								size={'md'}
								color={
									'linear-gradient(90deg, rgb(0, 179, 50), rgb(170, 203, 0))'
								}
								onPress={() => {
									router.navigate('/settings/onboard/add-misskey');
								}}
								containerStyle={{ borderRadius: 8 }}
								buttonStyle={{ borderRadius: 8 }}
							>
								<Text style={styles.buttonText}>Login</Text>
							</Button>
						</View>
					</View>

					<View style={styles.selectSignInPlatformSection}>
						<View style={styles.selectSignInPlatformCenter}>
							<SoftwareHeader software={KNOWN_SOFTWARE.BLUESKY} mb={0} mt={0} />
							<Text style={styles.platformDescription}>
								Use this for Bluesky
							</Text>
						</View>

						<View style={{ paddingTop: 16 }}>
							<Button
								size={'md'}
								color={'#0285ff'}
								onPress={() => {
									router.navigate('/settings/onboard/signin-bsky');
								}}
								containerStyle={{ borderRadius: 8 }}
								buttonStyle={{ borderRadius: 8 }}
							>
								<Text style={styles.buttonText}>Login</Text>
							</Button>
						</View>
					</View>
				</View>
			</View>
		</TitleOnlyStackHeaderContainer>
	);
}

const styles = StyleSheet.create({
	selectSignInPlatformSection: {
		width: '100%',
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 8,
		backgroundColor: '#242424',
		marginVertical: 16,
	},
	selectSignInPlatformCenter: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	platformDescription: {
		fontSize: 16,
		marginVertical: 4,
		textAlign: 'center',
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
	buttonText: {
		color: APP_FONT.MONTSERRAT_HEADER,
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
});

export default SelectProviderStack;

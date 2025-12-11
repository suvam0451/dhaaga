import { Fragment, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { APP_FONT } from '#/styles/AppTheme';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityPubService } from '@dhaaga/bridge';
import { useAppApiClient } from '#/states/global/hooks';

/**
 * These will be shown for Misskey accounts
 */
const MyMisskeyAccountFeatures = memo(() => {
	const { driver } = useAppApiClient();

	if (!ActivityPubService.misskeyLike(driver)) return <View />;

	return (
		<Fragment>
			<View style={{ marginLeft: 8, marginBottom: 8, marginTop: 8 }}>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_800_EXTRABOLD,
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					Misskey
				</Text>
			</View>
			<View style={styles.moduleRow}>
				<View style={styles.moduleButton}>
					<Feather name="cloud" size={24} color={APP_FONT.MONTSERRAT_BODY} />
					<Text style={styles.moduleButtonText}>Drive</Text>
				</View>
				<View style={styles.moduleButton}>
					<Feather
						name="paperclip"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text style={styles.moduleButtonText}>Clips</Text>
				</View>
				<View style={styles.moduleButton}>
					<MaterialCommunityIcons
						name="antenna"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
					<Text style={styles.moduleButtonText}>Antennas</Text>
				</View>
			</View>
		</Fragment>
	);
});

const styles = StyleSheet.create({
	moduleButton: {
		padding: 8,
		paddingLeft: 12,
		backgroundColor: '#242424',
		borderRadius: 8,
		flex: 1,
		marginHorizontal: 4,
	},
	moduleButtonText: {
		color: APP_FONT.MONTSERRAT_BODY,
		marginTop: 6,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		fontSize: 16,
	},
	moduleRow: {
		width: '100%',
		flexDirection: 'row',
		marginBottom: 16,
	},
	text: {
		fontFamily: APP_FONTS.INTER_700_BOLD,
		color: APP_FONT.MONTSERRAT_BODY,
		textAlign: 'center',
		marginBottom: 16,
	},
});

export default MyMisskeyAccountFeatures;

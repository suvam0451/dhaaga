import { memo } from 'react';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { View, Text, StyleSheet } from 'react-native';
import TitleOnlyScrollContainer from '../../../../containers/TitleOnlyScrollContainer';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { Ionicons } from '@expo/vector-icons';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ICON_SIZE = 24;
const AccountDashboardStack = memo(() => {
	const {} = useActivityPubRestClientContext();

	return (
		<TitleOnlyScrollContainer
			title={'Account Dashboard'}
			contentContainerStyle={{ paddingHorizontal: 8 }}
		>
			<View style={{ height: 32 }} />
			<View style={styles.moduleRow}>
				<View style={styles.moduleButton}>
					<AntDesign
						name="profile"
						size={ICON_SIZE}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
					<Text style={styles.moduleButtonText}>My Profile</Text>
				</View>

				<View style={styles.moduleButton}>
					<Ionicons
						name="create"
						size={ICON_SIZE}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
					<Text style={styles.moduleButtonText}>My Posts</Text>
				</View>
			</View>

			<View style={{ marginLeft: 8, marginBottom: 8, marginTop: 8 }}>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_800_EXTRABOLD,
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					Saved by Me
				</Text>
			</View>

			<View style={styles.moduleRow}>
				<View style={styles.moduleButton}>
					<Ionicons
						color={APP_FONT.MONTSERRAT_HEADER}
						name={'bookmark'}
						size={ICON_SIZE}
					/>
					<Text style={styles.moduleButtonText}>Likes</Text>
				</View>

				<View style={styles.moduleButton}>
					<Ionicons
						color={APP_FONT.MONTSERRAT_HEADER}
						name={'bookmark'}
						size={ICON_SIZE}
					/>
					<Text style={styles.moduleButtonText}>Bookmarks</Text>
				</View>
			</View>

			<View style={{ marginLeft: 8, marginBottom: 8, marginTop: 8 }}>
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_800_EXTRABOLD,
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					My Social Network
				</Text>
			</View>

			<View style={styles.moduleRow}>
				<View style={styles.moduleButton}>
					<Feather name="users" size={24} color={APP_FONT.MONTSERRAT_HEADER} />
					<Text style={styles.moduleButtonText}>Followers</Text>
				</View>
				<View style={styles.moduleButton}>
					<Feather
						name="user-check"
						size={24}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
					<Text style={styles.moduleButtonText}>Following</Text>
				</View>
				<View style={styles.moduleButton}>
					<Feather
						name="user-plus"
						size={24}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
					<Text style={styles.moduleButtonText}>Requests</Text>
				</View>
			</View>

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
					<Feather name="cloud" size={24} color={APP_FONT.MONTSERRAT_HEADER} />
					<Text style={styles.moduleButtonText}>Drive</Text>
				</View>
				<View style={styles.moduleButton}>
					<Feather
						name="paperclip"
						size={24}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>
					<Text style={styles.moduleButtonText}>Clips</Text>
				</View>
				<View style={styles.moduleButton}>
					<MaterialCommunityIcons
						name="antenna"
						size={24}
						color={APP_FONT.MONTSERRAT_HEADER}
					/>

					<Text style={styles.moduleButtonText}>Antennas</Text>
				</View>
			</View>
			<View style={{ marginHorizontal: 16, alignItems: 'center' }}>
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						color: APP_FONT.MONTSERRAT_BODY,
						textAlign: 'center',
						marginBottom: 8,
					}}
				>
					These are your instance features.
				</Text>
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_500_MEDIUM,
						color: APP_FONT.MONTSERRAT_BODY,
						textAlign: 'center',
						marginBottom: 16,
					}}
				>
					Looking to unleash the full potential of Dhaaga? Visit the Apps
					section!
				</Text>

				<View
					style={{
						backgroundColor: '#242424',
						alignItems: 'center',
						padding: 12,
						borderRadius: 8,
					}}
				>
					<Text
						style={{
							color: APP_FONT.MONTSERRAT_BODY,
							fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						}}
					>
						To the Apps page
					</Text>
				</View>
			</View>
		</TitleOnlyScrollContainer>
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
		color: APP_FONT.MONTSERRAT_HEADER,
		marginTop: 6,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		fontSize: 16,
	},

	moduleRow: {
		width: '100%',
		flexDirection: 'row',
		marginBottom: 16,
	},
});

export default AccountDashboardStack;

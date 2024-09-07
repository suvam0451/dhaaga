import { memo, useMemo } from 'react';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Animated,
} from 'react-native';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../../states/useScrollMoreOnPageEnd';
import { router } from 'expo-router';

type MyAccountModuleProps = {
	label: string;
	Icon: any;
	to: string;
	disabled?: boolean;
};
const MyAccountModule = memo(
	({ to, Icon, label, disabled }: MyAccountModuleProps) => {
		if (disabled) {
			return (
				<TouchableOpacity style={[styles.moduleButton]}>
					{Icon}
					<Text
						style={[
							styles.moduleButtonText,
							{
								color: APP_FONT.DISABLED,
							},
						]}
					>
						{label}
					</Text>
				</TouchableOpacity>
			);
		}

		return (
			<TouchableOpacity
				style={styles.moduleButton}
				onPress={() => {
					router.navigate(to);
				}}
			>
				{Icon}
				<Text style={styles.moduleButtonText}>{label}</Text>
			</TouchableOpacity>
		);
	},
);

const SelectedAccount = memo(() => {
	const { me } = useActivityPubRestClientContext();

	return (
		<View>
			<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>Logged in as</Text>
			<View>
				<Text>Change</Text>
				<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
					{me.getDisplayName()}
				</Text>
			</View>
		</View>
	);
});

const ICON_SIZE = 24;
const AccountLanding = memo(() => {
	const { translateY, onScroll } = useScrollMoreOnPageEnd();

	return (
		<AppTopNavbar
			title={'Account'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.LANDING_GENERIC}
		>
			<Animated.ScrollView onScroll={onScroll} style={{ paddingHorizontal: 6 }}>
				<View style={{ height: 54 }} />
				<SelectedAccount />
				<View style={styles.moduleRow}>
					<MyAccountModule
						label={'My Profile'}
						Icon={
							<AntDesign
								name="profile"
								size={ICON_SIZE}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						}
						to={'/accounts/my-profile'}
					/>
					<MyAccountModule
						label={'All Posts'}
						Icon={
							<Ionicons
								name="create"
								size={ICON_SIZE}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						}
						to={'/accounts/my-posts'}
					/>
				</View>

				<View style={{ marginLeft: 8, marginBottom: 8, marginTop: 8 }}>
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_800_EXTRABOLD,
							color: APP_FONT.DISABLED,
						}}
					>
						My Post History
					</Text>
				</View>
				<View style={styles.moduleRow}>
					<MyAccountModule
						label={'Originals'}
						Icon={
							<Ionicons
								name="create"
								size={ICON_SIZE}
								color={APP_FONT.DISABLED}
							/>
						}
						to={''}
						disabled
					/>
					<MyAccountModule
						label={'Replies'}
						Icon={
							<FontAwesome name="comment" size={24} color={APP_FONT.DISABLED} />
						}
						to={''}
						disabled
					/>
					<MyAccountModule
						label={'Boosts'}
						Icon={
							<Ionicons
								color={APP_FONT.DISABLED}
								name={'rocket'}
								size={ICON_SIZE}
							/>
						}
						to={''}
						disabled
					/>
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
					<MyAccountModule
						label={'Likes'}
						Icon={
							<AntDesign name="like1" size={ICON_SIZE} color={APP_THEME.LINK} />
						}
						to={'/accounts/my-likes'}
					/>
					{/*<MyAccountModule*/}
					{/*	label={'Lists'}*/}
					{/*	Icon={*/}
					{/*		<AntDesign name="like1" size={ICON_SIZE} color={APP_THEME.LINK} />*/}
					{/*	}*/}
					{/*	to={'/accounts/my-likes'}*/}
					{/*/>*/}
					<MyAccountModule
						label={'Bookmarks'}
						Icon={
							<Ionicons
								color={APP_THEME.INVALID_ITEM}
								name={'bookmark'}
								size={ICON_SIZE}
							/>
						}
						to={'/accounts/my-bookmarks'}
					/>
				</View>

				<View style={{ marginLeft: 8, marginBottom: 8, marginTop: 8 }}>
					<Text
						style={{
							fontFamily: APP_FONTS.MONTSERRAT_800_EXTRABOLD,
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						My Friend Network
					</Text>
				</View>

				<View style={styles.moduleRow}>
					<MyAccountModule
						label={'Followers'}
						Icon={
							<Feather
								name="users"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						}
						to={'/accounts/my-followers'}
					/>
					<MyAccountModule
						label={'Following'}
						Icon={
							<Feather
								name="user-check"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						}
						to={'/accounts/my-followings'}
					/>
					<MyAccountModule
						label={'Requests'}
						Icon={
							<Feather name="user-plus" size={24} color={APP_FONT.DISABLED} />
						}
						to={'/accounts/my-follow-requests'}
						disabled
					/>
				</View>

				{/*<MyMisskeyAccountFeatures />*/}

				<View style={{ marginTop: 16, marginHorizontal: 16 }}>
					<Text style={styles.text}>This entire page was recently added.</Text>
					<Text style={styles.text}>
						Many expected features (such as interacting with your own profile or
						editing/deleting posts) are not implemented.
					</Text>
					<Text style={styles.text}>Feedbacks are welcome 🙏</Text>
				</View>
			</Animated.ScrollView>
		</AppTopNavbar>
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
		// color: APP_THEME.LINK,
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

export default AccountLanding;

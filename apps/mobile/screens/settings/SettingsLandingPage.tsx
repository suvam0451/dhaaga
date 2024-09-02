import { Fragment } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Divider, Text } from '@rneui/themed';
import Animated from 'react-native-reanimated';
import { Link } from 'expo-router';
import useScrollMoreOnPageEnd from '../../states/useScrollMoreOnPageEnd';
import WithAutoHideTopNavBar from '../../components/containers/WithAutoHideTopNavBar';
import { APP_FONT } from '../../styles/AppTheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import VersionCode from '../../components/static/sponsorship/VersionCode';
import { router } from 'expo-router';
import { APP_FONTS } from '../../styles/AppFonts';
import Octicons from '@expo/vector-icons/Octicons';

function SettingPageFooter() {
	return <VersionCode />;
}

type AppFeatureSmallGridItemProps = {
	Icon: JSX.Element;
	disabled?: boolean;
	alignment: 'left' | 'right';
	iconSize: number;
};

function AppFeatureSmallGridItem({
	Icon,
	disabled,
	alignment,
	iconSize,
}: AppFeatureSmallGridItemProps) {
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: '#1e1e1e',
				padding: 8,
				borderRadius: 8,
				marginLeft: alignment === 'right' ? 4 : 0,
				marginRight: alignment === 'left' ? 4 : 0,
				alignItems: 'center',
				flexDirection: 'row',
				display: 'flex',
				justifyContent: 'center',
				opacity: disabled ? 0.5 : 1,
			}}
		>
			<View style={{ width: iconSize, height: iconSize }}>{Icon}</View>
		</View>
	);
}

type AppFeatureExtraLargeGridItemProps = {
	label: string;
	link: string;
	Icon: JSX.Element;
	disabled?: boolean;
	alignment: 'left' | 'right';
};

function AppFeatureExtraLargeGridItem({
	label,
	link,
	Icon,
	disabled,
	alignment,
}: AppFeatureExtraLargeGridItemProps) {
	return (
		<Link disabled={disabled} href={link}>
			<View
				style={{
					backgroundColor: '#1e1e1e',
					padding: 8,
					borderRadius: 8,
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					marginLeft: alignment === 'right' ? 8 : 0,
					marginRight: alignment === 'left' ? 8 : 0,
					height: (36 + 8 * 2) * 2 + 8,
					opacity: disabled ? 0.25 : 1,
				}}
			>
				<View style={{ width: 24 }}>{Icon}</View>
				<Text
					style={{
						fontFamily: 'Montserrat-Bold',
						marginLeft: 8,
						color: disabled
							? APP_FONT.MONTSERRAT_BODY
							: APP_FONT.MONTSERRAT_HEADER,
					}}
				>
					{label}
				</Text>
			</View>
		</Link>
	);
}

type AppFeatureLargeGridItemProps = {
	label: string;
	link: string;
	Icon: JSX.Element;
	disabled?: boolean;
	alignment: 'left' | 'right';
};

function AppFeatureLargeGridItem({
	label,
	link,
	Icon,
	disabled,
	alignment,
}: AppFeatureLargeGridItemProps) {
	return (
		<Link disabled={disabled} href={link}>
			<View
				style={{
					backgroundColor: '#1e1e1e',
					padding: 8,
					borderRadius: 8,
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					marginLeft: alignment === 'right' ? 8 : 0,
					marginRight: alignment === 'left' ? 8 : 0,
					height: 36 + 8 * 2,
				}}
			>
				<View style={{ width: 24 }}>{Icon}</View>
				<Text
					style={{
						fontFamily: 'Montserrat-Bold',
						marginLeft: 8,
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					{label}
				</Text>
			</View>
		</Link>
	);
}

function SettingsScreenTopSection() {
	return (
		<Fragment>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					fontSize: 24,
					color: APP_FONT.MONTSERRAT_BODY,
					marginHorizontal: 8,
					marginVertical: 16,
				}}
			>
				Dhaaga Features
			</Text>
			<View style={styles.appFeaturesGridRow}>
				<View style={{ flex: 1, marginRight: 8 }}>
					<AppFeatureLargeGridItem
						label={'Known Servers'}
						link={'/settings/server-debugger'}
						Icon={
							<FontAwesome6
								name="server"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						}
						alignment={'left'}
					/>
				</View>
				<View style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
					<AppFeatureSmallGridItem
						Icon={
							<FontAwesome5
								name="download"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
								disabled
								style={{
									opacity: 0.36,
								}}
							/>
						}
						alignment={'left'}
						iconSize={24}
						disabled={true}
					/>
					<AppFeatureSmallGridItem
						Icon={
							<FontAwesome5
								name="download"
								size={24}
								color={APP_FONT.MONTSERRAT_HEADER}
								disabled
								style={{
									opacity: 0.36,
								}}
							/>
						}
						alignment={'right'}
						iconSize={24}
						disabled={true}
					/>
				</View>
			</View>
			<View style={styles.appFeaturesGridRow}>
				<View style={{ flex: 1, flexDirection: 'column' }}>
					<View
						style={{ display: 'flex', flexDirection: 'row', marginBottom: 8 }}
					>
						<AppFeatureSmallGridItem
							Icon={
								<MaterialCommunityIcons
									name="progress-question"
									size={36}
									color={APP_FONT.MONTSERRAT_BODY}
									disabled
									style={{
										opacity: 0.36,
									}}
								/>
							}
							alignment={'left'}
							iconSize={36}
							disabled={true}
						/>
						<AppFeatureSmallGridItem
							Icon={
								<MaterialCommunityIcons
									name="progress-question"
									size={36}
									color={APP_FONT.MONTSERRAT_BODY}
									disabled
									style={{
										opacity: 0.36,
									}}
								/>
							}
							alignment={'right'}
							iconSize={36}
							disabled={true}
						/>
					</View>
					<View style={{ display: 'flex', flexDirection: 'row' }}>
						<AppFeatureSmallGridItem
							Icon={
								<MaterialCommunityIcons
									name="progress-question"
									size={36}
									color={APP_FONT.MONTSERRAT_BODY}
									disabled
									style={{
										opacity: 0.36,
									}}
								/>
							}
							alignment={'left'}
							iconSize={36}
							disabled={true}
						/>
						<AppFeatureSmallGridItem
							Icon={
								<MaterialCommunityIcons
									name="progress-question"
									size={36}
									color={APP_FONT.MONTSERRAT_BODY}
									disabled
									style={{
										opacity: 0.36,
									}}
								/>
							}
							alignment={'right'}
							iconSize={36}
							disabled={true}
						/>
					</View>
				</View>

				<View style={{ flex: 1, marginLeft: 8 }}>
					<AppFeatureExtraLargeGridItem
						label={'Block Lists'}
						link={'/settings/server-debugger'}
						Icon={
							<MaterialIcons
								name="block-flipped"
								size={24}
								color={APP_FONT.MONTSERRAT_HEADER}
							/>
						}
						disabled
						alignment={'right'}
					/>
				</View>
			</View>
		</Fragment>
	);
}

function SettingsScreenBottomSection() {
	return (
		<Fragment>
			<View style={styles.collapsibleSettingsSection}>
				<View style={{ width: 24, height: 24 }}>
					<FontAwesome6
						name="palette"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
				<View style={{ flexGrow: 1 }}>
					<Text style={styles.collapsibleSettingsLabel}>Appearance</Text>
				</View>
				<View>
					<FontAwesome
						name="chevron-down"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
			</View>
			<Divider
				style={{
					backgroundColor: 'rgba(18,18,18,0.87)',
					width: '100%',
				}}
			/>
			<TouchableOpacity
				style={styles.collapsibleSettingsSection}
				onPress={() => {
					router.navigate('/settings/privacy');
				}}
			>
				<View style={{ width: 24, height: 24 }}>
					<FontAwesome6
						name="user-secret"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>

				<Text style={styles.collapsibleSettingsLabel}>Privacy</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.collapsibleSettingsSection}
				onPress={() => {
					router.navigate('/settings/user-preferences');
				}}
			>
				<View style={{ width: 24, height: 24 }}>
					<Octicons
						name="checklist"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>

				<Text style={styles.collapsibleSettingsLabel}>User Preferences</Text>
			</TouchableOpacity>

			<Divider
				style={{
					backgroundColor: 'rgba(18,18,18,0.87)',
					width: '100%',
				}}
			/>
			<View style={styles.collapsibleSettingsSection}>
				<View style={{ width: 24, height: 24 }}>
					<Ionicons
						name="cloud-offline"
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
				<Text style={styles.collapsibleSettingsLabel}>Offline Features</Text>
			</View>
		</Fragment>
	);
}

function SettingsLandingPage() {
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<WithAutoHideTopNavBar title={'App Settings'} translateY={translateY}>
			<Animated.ScrollView
				contentContainerStyle={{ paddingTop: 54, height: '100%' }}
			>
				<View style={{ flexGrow: 1 }}>
					<SettingsScreenTopSection />
				</View>

				<View style={{ marginBottom: 8 }}>
					<SettingsScreenBottomSection />
					<SettingPageFooter />
				</View>
			</Animated.ScrollView>
		</WithAutoHideTopNavBar>
	);
}

const styles = StyleSheet.create({
	collapsibleSettingsSection: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 12,
		marginHorizontal: 8,
	},
	collapsibleSettingsLabel: {
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
		fontSize: 20,
		marginLeft: 12,
		color: APP_FONT.MONTSERRAT_BODY,
	},
	appFeaturesGridRow: {
		marginHorizontal: 8,
		marginBottom: 8,
		display: 'flex',
		flexDirection: 'row',
	},
});

export default SettingsLandingPage;

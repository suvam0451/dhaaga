import {
	Dimensions,
	Pressable,
	ScrollView,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from 'react-native';
import { Fragment, useEffect, useState } from 'react';
import { APP_KNOWN_MODAL } from '../../states/_global';
import {
	useAppManager,
	useAppModalState,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import useGetProfile from '../../hooks/api/accounts/useGetProfile';
import { Image } from 'expo-image';
import { AppText } from '../lib/Text';
import { appDimensions } from '../../styles/dimensions';
import UserRelationPresenter from '../../features/user-profiles/presenters/UserRelationPresenter';
import useAppNavigator from '../../states/useAppNavigator';

const DEFAULT_POSITION = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	ready: false,
	popoverDirection: 'top' as 'top' | 'bottom',
};

const TaperedArrow = ({ direction }: { direction: 'top' | 'bottom' }) => {
	const containerStyle: StyleProp<ViewStyle> = {
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	};
	const arrowStyle: StyleProp<ViewStyle> =
		direction === 'top'
			? {
					width: 0,
					height: 0,
					left: 8,
					borderLeftWidth: 12, // Left side of the triangle
					borderRightWidth: 12, // Right side of the triangle
					borderTopWidth: 10, // Height of the triangle
					borderLeftColor: 'transparent', // No color for left side
					borderRightColor: 'transparent', // No color for right side
					borderTopColor: '#282828', // Color of the arrow (bottom)
				}
			: {
					width: 0,
					height: 0,
					left: 8,
					borderLeftWidth: 12, // Left side of the triangle
					borderRightWidth: 12, // Right side of the triangle
					borderBottomWidth: 10, // Height of the triangle
					borderLeftColor: 'transparent', // No color for left side
					borderRightColor: 'transparent', // No color for right side
					borderBottomColor: '#282828', // Color of the arrow (bottom)
				};

	return (
		<View style={containerStyle}>
			<View style={arrowStyle} />
		</View>
	);
};

function util(o: number): string {
	const formatter = new Intl.NumberFormat('en-US', {
		notation: 'compact',
		compactDisplay: 'short',
	});
	return formatter.format(o);
}

function UserPeekModalContent({ userId }: { userId: string }) {
	const { toProfile } = useAppNavigator();
	const { data, error, fetchStatus } = useGetProfile({ userId });
	const { hide } = useAppModalState(APP_KNOWN_MODAL.USER_PEEK);
	const { theme } = useAppTheme();
	if (error) return <View />;
	if (fetchStatus === 'fetching') return <View />;

	function onProfilePressed() {
		hide();
		toProfile(userId);
	}

	return (
		<ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
			<View style={{ flexDirection: 'row', marginBottom: 16 }}>
				<View style={{ flexGrow: 1, flex: 1 }}>
					<View
						style={{
							marginBottom: appDimensions.timelines.sectionBottomMargin,
						}}
					>
						<AppText.SemiBoldAlt
							style={{
								fontSize: 16,
							}}
							numberOfLines={1}
						>
							{data.displayName}
						</AppText.SemiBoldAlt>
						<AppText.Medium
							style={{
								color: theme.secondary.a30,
								fontSize: 12,
							}}
							numberOfLines={1}
						>
							{data.handle}
						</AppText.Medium>
					</View>

					<View
						style={{
							marginBottom: appDimensions.timelines.sectionBottomMargin,
							width: '100%',
						}}
					>
						<AppText.Normal
							style={{
								color: theme.secondary.a30,
							}}
							numberOfLines={4}
						>
							{data.description}
						</AppText.Normal>
					</View>
				</View>
				<View
					style={{
						borderRadius: '100%',
						overflow: 'hidden',
						width: 72,
						height: 72,
					}}
				>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{ uri: data.avatarUrl }}
						style={{
							width: 72,
							height: 72,
							borderRadius: '100%',
						}}
					/>
				</View>
			</View>
			<View
				style={{
					flexDirection: 'row',
					marginBottom: appDimensions.timelines.sectionBottomMargin,
				}}
			>
				<Text>
					<AppText.SemiBold
						style={{ color: theme.complementary.a0, fontSize: 16 }}
					>
						{util(data.stats.followers)}
					</AppText.SemiBold>
					<AppText.Medium
						style={{ color: theme.complementary.a0, fontSize: 14 }}
					>
						{' '}
						Followers
					</AppText.Medium>
				</Text>
			</View>
			<View
				style={{
					flexDirection: 'row',
					width: '100%',
					marginTop: 8,
				}}
			>
				<View style={{ flex: 1 }}>
					<UserRelationPresenter userId={userId} />
				</View>
				<Pressable
					style={{
						paddingHorizontal: 4,
						flex: 1,
						alignItems: 'center',
					}}
					onPress={onProfilePressed}
				>
					<AppText.SemiBold
						style={{
							textAlign: 'center',
							alignSelf: 'center',
							margin: 'auto',
							fontSize: 16,
						}}
						color={theme.primary.a0}
					>
						Show Profile
					</AppText.SemiBold>
				</Pressable>
			</View>
		</ScrollView>
	);
}

/**
 * Shows
 *
 * NOTE: it is a full screen transparent
 * modal that consumes one click to close
 * @constructor
 */
function UserPeekModal() {
	const [Position, setPosition] = useState(DEFAULT_POSITION);
	const [UserIdTarget, setUserIdTarget] = useState(null);
	const { height, width } = Dimensions.get('window');

	const { stateId, hide, visible } = useAppModalState(
		APP_KNOWN_MODAL.USER_PEEK,
	);
	const { appManager } = useAppManager();

	useEffect(() => {
		if (!appManager) {
			setPosition(DEFAULT_POSITION);
			setUserIdTarget(null);
			return;
		}

		const data = appManager.storage.getUserPeekModalData();
		if (!data) return;
		if (data.measurement.y >= height / 2) {
			setPosition({
				x: data.measurement.x,
				y: data.measurement.y,
				width: data.measurement.width,
				height: data.measurement.height,
				ready: true,
				popoverDirection: 'top',
			});
			setUserIdTarget(data.userId);
		} else {
			setPosition({
				x: data.measurement.x,
				y: data.measurement.y,
				width: data.measurement.width,
				height: data.measurement.height,
				ready: true,
				popoverDirection: 'bottom',
			});
			setUserIdTarget(data.userId);
		}
	}, [appManager, stateId]);

	if (!visible || !Position.ready) return <View />;

	const IS_TOP_ORIENTED = Position.popoverDirection === 'top';

	const modalContentStyle: StyleProp<ViewStyle> = {
		width: width - 48,
		backgroundColor: '#282828',
		left: Position.x,
		top: IS_TOP_ORIENTED
			? Position.y - 12
			: Position.y + Position.height + 12 - 2,
		transform: IS_TOP_ORIENTED
			? [{ translateY: '-100%' }]
			: [{ translateY: '0%' }],
	};

	const arrowStyle: StyleProp<ViewStyle> = {
		position: 'absolute',
		left: Position.x,
		top: IS_TOP_ORIENTED ? Position.y - 12 : Position.y + Position.height,
	};

	return (
		<Fragment>
			<View
				style={{
					height,
					width,
					position: 'absolute',
					zIndex: 90,
				}}
			>
				<Pressable
					style={{
						height,
						width,
						backgroundColor: 'transparent',
						zIndex: 100,
					}}
					onPress={(e: any) => {
						e.stopPropagation();
						hide();
					}}
				/>
			</View>
			<View style={[styles.contentContainer, modalContentStyle]}>
				<UserPeekModalContent userId={UserIdTarget} />
			</View>
			<View style={arrowStyle}>
				<TaperedArrow direction={Position.popoverDirection} />
			</View>
		</Fragment>
	);
}

export default UserPeekModal;

const styles = StyleSheet.create({
	contentContainer: {
		position: 'absolute',
		maxHeight: 256,
		maxWidth: 396,
		backgroundColor: '#484848',
		zIndex: 99,
		borderRadius: 12,
		transform: [{ translateY: '-100%' }],
	},
	arrowContainer: {
		position: 'absolute',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
	},
	arrow: {
		width: 0,
		height: 0,
		left: 8,
		borderLeftWidth: 12, // Left side of the triangle
		borderRightWidth: 12, // Right side of the triangle
		borderTopWidth: 10, // Height of the triangle
		borderLeftColor: 'transparent', // No color for left side
		borderRightColor: 'transparent', // No color for right side
		borderTopColor: 'red', // Color of the arrow (bottom)
	},
});

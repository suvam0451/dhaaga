import { Button, Text } from '@rneui/themed';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { APP_FONT, APP_THEME } from '../../styles/AppTheme';
import * as Haptics from 'expo-haptics';
import { memo, useMemo } from 'react';
import { AppRelationship } from '../../types/ap.types';
import { APP_FONTS } from '../../styles/AppFonts';

type AppButtonFollowIndicatorProps = {
	onClick: () => void;
	label: AppRelationship;
	loading: boolean;
};

function AppButtonFollowIndicator({
	onClick,
	label,
	loading,
}: AppButtonFollowIndicatorProps) {
	function onButtonClick() {
		if (!loading) {
			onClick();
		}
	}

	return useMemo(() => {
		switch (label) {
			case AppRelationship.UNRELATED: {
				return (
					<Button
						size={'sm'}
						onPress={onButtonClick}
						buttonStyle={styles.passiveButtonStyle}
						containerStyle={{ borderRadius: 4 }}
					>
						{loading ? (
							<ActivityIndicator
								size={20}
								color={APP_THEME.COLOR_SCHEME_D_NORMAL}
							/>
						) : (
							<Text style={styles.passiveTextStyle}>
								{AppRelationship.UNRELATED}
							</Text>
						)}
					</Button>
				);
			}
			case AppRelationship.FOLLOWING: {
				return (
					<Button
						size={'sm'}
						onPress={onButtonClick}
						buttonStyle={styles.activeButtonStyle}
						containerStyle={{ borderRadius: 4 }}
					>
						{loading ? (
							<ActivityIndicator
								size={20}
								color={APP_THEME.COLOR_SCHEME_D_NORMAL}
							/>
						) : (
							<Text style={styles.activeTextStyle}>
								{AppRelationship.FOLLOWING}
							</Text>
						)}
					</Button>
				);
			}
			default: {
				return (
					<Button
						size={'sm'}
						onPress={onButtonClick}
						buttonStyle={styles.passiveButtonStyle}
						containerStyle={{ borderRadius: 4 }}
					>
						{loading ? (
							<ActivityIndicator
								size={20}
								color={APP_THEME.COLOR_SCHEME_D_NORMAL}
							/>
						) : (
							<Text style={styles.passiveTextStyle}>
								{AppRelationship.UNKNOWN}
							</Text>
						)}
					</Button>
				);
			}
		}
	}, [label, loading]);
}

type AppButtonVariantAProps = {
	label: string;
	loading: boolean;
	onClick: () => void;
	onLongClick?: () => void;
	opts?: {
		useHaptics?: boolean;
	};
	customLoadingState?: JSX.Element;
};

export function AppButtonVariantA({
	label,
	loading,
	onClick,
	onLongClick,
	opts,
	customLoadingState,
}: AppButtonVariantAProps) {
	function onPress() {
		if (onClick) {
			if (opts?.useHaptics) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			}
			onClick();
		}
	}

	function onLongPress() {
		if (onLongClick && !loading) {
			onLongClick();
		}
	}

	return (
		<Button
			size={'md'}
			buttonStyle={{ backgroundColor: '#333333', borderRadius: 8 }}
			containerStyle={{ borderRadius: 8 }}
			onPress={onPress}
			onLongPress={onLongPress}
		>
			{loading ? (
				customLoadingState ? (
					customLoadingState
				) : (
					<ActivityIndicator size={20} color={'white'} />
				)
			) : (
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						opacity: 1,
						fontFamily: 'Inter-Bold',
					}}
				>
					{label}
				</Text>
			)}
		</Button>
	);
}

export function AppButtonVariantDestructive({
	label,
	loading,
	onClick,
	onLongClick,
	opts,
	customLoadingState,
}: AppButtonVariantAProps) {
	function onPress() {
		if (onClick) {
			if (opts?.useHaptics) {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			}
			onClick();
		}
	}

	function onLongPress() {
		if (onLongClick && !loading) {
			onLongClick();
		}
	}

	return (
		<Button
			size={'md'}
			buttonStyle={{
				backgroundColor: 'red',
				borderRadius: 8,
			}}
			containerStyle={{ borderRadius: 8 }}
			onPress={onPress}
			onLongPress={onLongPress}
		>
			{loading ? (
				customLoadingState ? (
					customLoadingState
				) : (
					<ActivityIndicator size={20} color={'rgba(255, 255, 255, 0.6)'} />
				)
			) : (
				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
						opacity: 1,
						fontFamily: 'Inter-Bold',
					}}
				>
					{label}
				</Text>
			)}
		</Button>
	);
}

const styles = StyleSheet.create({
	passiveButtonStyle: {
		borderColor: 'red',
		backgroundColor: '#2e6945', // '#cb6483',
		maxWidth: 128,
	},

	passiveTextStyle: {
		fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
		color: APP_FONT.MONTSERRAT_HEADER,
	},
	activeButtonStyle: {
		borderColor: '#cb6483',
		// backgroundColor: 'rgba(39, 39, 39, 1)',
		backgroundColor: '#363636',
		maxWidth: 128,
		borderRadius: 4,
	},
	activeTextStyle: {
		fontFamily: 'Montserrat-Bold',
		// color: '#cb6483',
		color: APP_FONT.MONTSERRAT_BODY,
		opacity: 0.87,
	},
});

type AppButtonClassicInvertedProps = {
	label: string;
	onClick: () => void;
};

export const AppButtonClassicInverted = memo(function Foo({
	label,
	onClick,
}: AppButtonClassicInvertedProps) {
	return (
		<View
			style={{
				borderRadius: 4,
				backgroundColor: 'rgba(170, 170, 170, 0.87)',
				padding: 8,
				marginRight: 8,
			}}
			onTouchEnd={onClick}
		>
			<Text
				style={{
					color: 'rgba(0, 0, 0, 1)',
					fontFamily: 'Montserrat-Bold',
					textAlign: 'center',
				}}
			>
				{label}
			</Text>
		</View>
	);
});

const ICON_SIZE = 18;

type AppTimelineActionProps = {
	label: string;
	Icon: JSX.Element;
};

export const AppTimelineAction = memo(function Foo({
	Icon,
	label,
}: AppTimelineActionProps) {
	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				marginRight: 8,
				paddingVertical: 8,
				paddingHorizontal: 4,
			}}
		>
			{Icon}
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
					marginLeft: 4,
					fontFamily: 'Montserrat-Bold',
				}}
			>
				{label}
			</Text>
		</View>
	);
});

export default AppButtonFollowIndicator;

import {
	Animated,
	Easing,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	useAppDialog,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';
import { APP_FONTS } from '../../styles/AppFonts';
import { modalStyles } from '../common/relationship/dialogs/_common';
import { Fragment, useEffect, useRef, useState } from 'react';

type DialogOptionsProps = {
	label: string;
	onPress: () => Promise<void>;
	variant?: 'default' | 'dismiss';
};

const CURVE = Easing.bezier(0.41, -0.15, 0.56, 1.21);
const AMPLITUDE = 4;

function Loader() {
	const Animations = Array.from({ length: 3 }).map(() => new Animated.Value(0));

	const [Direction, setDirection] = useState(false);
	const { theme } = useAppTheme();
	const opacity = useRef(new Animated.Value(0)).current;
	const colors = [
		theme.complementaryA.a0,
		theme.complementary.a0,
		theme.complementaryB.a0,
	];

	function wave(idx: number, reverseY: boolean) {
		return Animated.sequence([
			Animated.timing(Animations[idx], {
				toValue: reverseY ? AMPLITUDE : -AMPLITUDE,
				easing: CURVE,
				delay: idx * 100,
				useNativeDriver: true,
			}),
			Animated.timing(Animations[idx], {
				toValue: reverseY ? -AMPLITUDE : AMPLITUDE,
				easing: CURVE,
				delay: idx * 100,
				useNativeDriver: true,
			}),
			Animated.timing(Animations[idx], {
				toValue: 0,
				delay: idx * 100,
				useNativeDriver: true,
			}),
		]);
	}

	function appear() {
		Animated.timing(opacity, {
			toValue: 1,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start();
	}

	useEffect(() => {
		Animated.parallel(
			Animations.map((_, index) => wave(index, Direction)),
		).start(() => {
			setDirection(!Direction);
		});
		appear();
	}, [Direction, Animations]);

	return (
		<Animated.View
			style={[
				{
					opacity,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				},
			]}
		>
			{Animations.map((animation, i) => (
				<Animated.View
					key={i}
					style={[
						styles.animDotItem,
						{
							backgroundColor: colors[i],
							transform: [{ translateY: animation }],
						},
					]}
				/>
			))}
		</Animated.View>
	);
}

function DialogOption({ label, onPress, variant }: DialogOptionsProps) {
	const [IsLoading, setIsLoading] = useState(false);
	const { theme } = useAppTheme();

	function _onPress() {
		if (IsLoading) return;
		setIsLoading(true);
		try {
			// FIXME: unable to access finally of undefined
			onPress().finally(() => {
				setIsLoading(false);
			});
		} catch (e) {
			//
			// setIsLoading(false);
		}
	}

	const color =
		variant && variant === 'dismiss' ? '#fd413b' : theme.textColor.medium;

	return (
		<View>
			<View style={{ height: 1, backgroundColor: '#333' }} />

			{IsLoading ? (
				<View style={{ paddingVertical: 19 }}>
					<Loader />
				</View>
			) : (
				<Pressable style={{ paddingVertical: 10 }} onPress={_onPress}>
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_500_MEDIUM,
							color: color,
							fontSize: 18,
							textAlign: 'center',
						}}
					>
						{label}
					</Text>
				</Pressable>
			)}
		</View>
	);
}

/**
 * A common dialog component that can
 * be invoked from anywhere and provided
 * with single-select action buttons
 * @constructor
 */
export function AppDialog() {
	const { visible, hide, state } = useAppDialog();
	const { theme } = useAppTheme();

	if (!visible) return <View />;
	return (
		<Fragment>
			<Pressable
				style={{
					position: 'absolute',
					backgroundColor: 'black',
					height: '100%',
					width: '100%',
					opacity: 0.64,
				}}
				onPress={hide}
			/>
			<View
				style={{
					maxWidth: 256,
					borderRadius: 8,
					backgroundColor: theme.palette.menubar,
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
				}}
			>
				<View>
					<View style={{ paddingHorizontal: 24 }}>
						<Text style={[styles.modalTitle, { color: theme.textColor.high }]}>
							{state.title}
						</Text>
						{state.description.map((text, i) => (
							<Text
								key={i}
								style={[
									modalStyles.modalDescription,
									{
										color: theme.textColor.medium,
									},
								]}
							>
								{text}
							</Text>
						))}
					</View>
					<View style={{ marginTop: 32, marginBottom: 4 }}>
						{state.actions.map((action, i) => (
							<DialogOption
								key={i}
								label={action.label}
								onPress={action.onPress}
							/>
						))}
						<DialogOption
							label={'Dismiss'}
							onPress={async () => {
								hide();
							}}
							variant={'dismiss'}
						/>
					</View>
				</View>
			</View>
		</Fragment>
	);
}

const styles = StyleSheet.create({
	modalTitle: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		textAlign: 'center',
		fontSize: 22,
		marginBottom: 16,
		paddingTop: 32,
	},
	modalDescription: {
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		textAlign: 'center',
		fontSize: 14,
	},
	actionButtonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 16,
	},
	animDotContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	animDotItem: {
		width: 8,
		height: 8,
		marginRight: 4,
		borderRadius: '100%',
	},
});
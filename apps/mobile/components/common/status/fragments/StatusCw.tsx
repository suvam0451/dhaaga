import { Dispatch, memo, SetStateAction } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from '@rneui/base';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppIcon } from '../../../lib/Icon';

type WithCwTextProps = {
	cw?: string;
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
};

const ControllerWithSpoilerText = memo(
	({ cw, show, setShow }: WithCwTextProps) => {
		const { theme } = useGlobalState(
			useShallow((o) => ({
				theme: o.colorScheme,
			})),
		);

		return (
			<Pressable
				style={[
					styles.root,
					{
						backgroundColor: theme.complementaryA.a50,
					},
				]}
				onPress={() => {
					setShow((o) => !o);
				}}
			>
				<View
					style={{
						width: 8,
						height: '100%',
						backgroundColor: theme.complementary.a0,
						borderTopStartRadius: 6,
						borderBottomLeftRadius: 6,
					}}
				/>
				<View
					style={{
						paddingVertical: 12,
						paddingHorizontal: 8,
						flexGrow: 1,
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					{show ? (
						<AppIcon id="eye-filled" size={24} color={'black'} />
					) : (
						<AppIcon id="eye-off-filled" size={24} color={'black'} />
					)}
					<Text
						style={{
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							color: 'black',
							marginLeft: 4,
						}}
					>
						{cw}
					</Text>
				</View>

				<View
					style={{
						width: 8,
						height: '100%',
						backgroundColor: theme.complementary.a0,
						borderTopEndRadius: 6,
						borderBottomEndRadius: 6,
					}}
				/>
			</Pressable>
		);
	},
);

const ControllerWithoutSpoilerText = memo(
	({ show, setShow }: WithCwTextProps) => {
		return (
			<View style={styles.root}>
				<Pressable
					style={{
						flexShrink: 1,
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						paddingHorizontal: 8,
						paddingVertical: 8,
					}}
					onPress={() => {
						setShow((o) => !o);
					}}
				>
					<View style={{ width: 24 }}>
						<FontAwesome
							name="warning"
							size={24}
							color="yellow"
							style={{ opacity: 0.6 }}
						/>
					</View>
					<View style={{ marginLeft: 4 }}>
						<Text style={styles.toggleHideText}>
							{show ? 'Hide Sensitive' : 'Show' + ' Sensitive'}
						</Text>
					</View>
					<View style={{ width: 24, marginLeft: 4 }}>
						<FontAwesome5
							name="eye-slash"
							size={18}
							color={APP_FONT.MEDIUM_EMPHASIS}
						/>
					</View>
				</Pressable>
				<View style={{ flex: 1 }} />
			</View>
		);
	},
);

/**
 * Will hide the media
 * and text content
 */
const StatusCw = memo(({ show, setShow, cw }: WithCwTextProps) => {
	return cw ? (
		<ControllerWithSpoilerText cw={cw} setShow={setShow} show={show} />
	) : (
		<ControllerWithoutSpoilerText cw={cw} setShow={setShow} show={show} />
	);
});

const styles = StyleSheet.create({
	root: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 6,
		marginVertical: 8,
	},
	toggleHideContainer: {
		marginHorizontal: 'auto',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
		marginBottom: 8,
	},
	toggleHideText: {
		color: APP_FONT.MEDIUM_EMPHASIS,
		flexShrink: 1,
		textAlign: 'center',
		fontSize: 16,
		fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
	},
	toggleHidePressableAreaContainer: {
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 8,
	},
});

export default StatusCw;

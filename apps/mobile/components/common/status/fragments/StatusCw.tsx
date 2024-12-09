import { Dispatch, Fragment, memo, SetStateAction } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from '@rneui/themed';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

type WithCwTextProps = {
	cw?: string;
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
};

const ControllerWithSpoilerText = memo(
	({ cw, show, setShow }: WithCwTextProps) => {
		return (
			<Fragment>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<View style={{ width: 24 }}>
						<FontAwesome
							name="warning"
							size={18}
							color="yellow"
							style={{ opacity: 0.6 }}
						/>
					</View>
					<View style={{ marginLeft: 0, maxWidth: '90%' }}>
						<Text
							style={{
								fontFamily: 'Inter-Bold',
								color: 'yellow',
								opacity: 0.6,
							}}
						>
							{cw}
						</Text>
					</View>
				</View>
				<View style={styles.toggleHideContainer}>
					<View style={{ flex: 1 }} />
					<Pressable
						style={styles.toggleHidePressableAreaContainer}
						onPress={() => {
							setShow((o) => !o);
						}}
					>
						<Text style={styles.toggleHideText}>
							{show ? 'Hide Sensitive' : 'Show' + ' Sensitive'}
						</Text>
						<View style={{ width: 24, marginLeft: 4 }}>
							<FontAwesome5
								name="eye-slash"
								size={18}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</View>
					</Pressable>
					<View style={{ flex: 1 }} />
				</View>
			</Fragment>
		);
	},
);

const ControllerWithoutSpoilerText = memo(
	({ show, setShow }: WithCwTextProps) => {
		return (
			<View
				style={{
					marginHorizontal: 'auto',
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					width: '100%',
					marginBottom: 8,
				}}
			>
				<View style={{ flex: 1 }} />
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

import { Dispatch, memo, SetStateAction } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { AppIcon } from '../../../lib/Icon';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../styles/dimensions';

type WithCwTextProps = {
	cw?: string;
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
};

/**
 * Will hide the media
 * and text content
 */
const StatusCw = memo(({ show, setShow, cw }: WithCwTextProps) => {
	const { theme } = useAppTheme();

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
						marginLeft: 8,
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
});

const styles = StyleSheet.create({
	root: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 6,
		marginBottom: appDimensions.timelines.sectionBottomMargin,
	},
});

export default StatusCw;

import { Dispatch, SetStateAction } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { NativeTextBold } from '#/ui/NativeText';

type WithCwTextProps = {
	cw?: string;
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
};

/**
 * Will hide the media
 * and text content
 */
function PostContentWarning({ show, setShow, cw }: WithCwTextProps) {
	const { theme } = useAppTheme();
	return (
		<Pressable
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a50,
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
					backgroundColor: theme.primary,
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
					<AppIcon id="eye-filled" size={24} color={theme.secondary.a40} />
				) : (
					<AppIcon id="eye-off-filled" size={24} color={theme.secondary.a40} />
				)}
				<NativeTextBold
					style={{
						color: theme.secondary.a20,
						marginLeft: 8,
					}}
				>
					{cw}
				</NativeTextBold>
			</View>

			<View
				style={{
					width: 8,
					height: '100%',
					backgroundColor: theme.primary,
					borderTopEndRadius: 6,
					borderBottomEndRadius: 6,
				}}
			/>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	root: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 6,
		marginTop: 8,
		marginBottom: appDimensions.timelines.sectionBottomMargin,
	},
});

export default PostContentWarning;

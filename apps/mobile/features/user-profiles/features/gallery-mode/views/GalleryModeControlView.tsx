import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';

type Props = {
	canLike: boolean;
	isLiked: boolean;
	onPressLike: () => Promise<void>;
	isDownloaded: boolean;
	onPressDownload: () => Promise<void>;
	isShared: boolean;
	onPressShare: () => Promise<void>;
};

function GalleryModeControlView({}: Props) {
	const { theme } = useAppTheme();
	return (
		<View
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a40,
				},
			]}
		>
			<View style={styles.container}></View>
		</View>
	);
}

export default GalleryModeControlView;

const styles = StyleSheet.create({
	root: {
		height: 48,
		width: 256,
		zIndex: 99,
		opacity: 0.75,
		borderRadius: 16,
		marginVertical: 16,
		alignSelf: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

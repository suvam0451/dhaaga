import { TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { appDimensions } from '#/styles/dimensions';
import useSheetNavigation from '#/states/navigation/useSheetNavigation';

type Props = {
	userId: string;
	avatarUrl: string;
};

/**
 * This is the author indicator for
 * the bottom-most post-item
 */
function PostCreatedByIconOnly({ userId, avatarUrl }: Props) {
	const { openUserProfileSheet } = useSheetNavigation();

	function onPress() {
		openUserProfileSheet(userId);
	}

	return (
		<TouchableOpacity onPress={onPress} style={styles.avatarContainer}>
			<Image style={styles.avatar} source={{ uri: avatarUrl }} />
		</TouchableOpacity>
	);
}

export default PostCreatedByIconOnly;

const TIMELINE_PFP_SIZE = appDimensions.timelines.avatarIconSize;

const styles = StyleSheet.create({
	root: {},
	avatarContainer: {
		width: TIMELINE_PFP_SIZE,
		height: TIMELINE_PFP_SIZE,
		borderColor: 'rgba(200, 200, 200, 0.3)',
		borderWidth: 1,
		borderRadius: TIMELINE_PFP_SIZE / 2,
		marginTop: 2,
		flexShrink: 1,
		alignItems: 'center',
		flexDirection: 'row',
	},
	avatar: {
		flex: 1,
		backgroundColor: '#0553',
		padding: 2,
		borderRadius: TIMELINE_PFP_SIZE / 2,
		overflow: 'hidden',
	},
});

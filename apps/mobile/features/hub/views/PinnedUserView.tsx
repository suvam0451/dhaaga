import { ProfilePinnedUser } from '@dhaaga/db';
import { Pressable, StyleSheet, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useAppTheme } from '#/states/global/hooks';

type Props = {
	item: ProfilePinnedUser;
	onPress: (item: ProfilePinnedUser) => void;
	onLongPress: (item: ProfilePinnedUser) => void;
};

function PinnedUserView({ item, onPress, onLongPress }: Props) {
	const { theme } = useAppTheme();
	return (
		<Pressable
			style={styles.root}
			onPress={() => {
				onPress(item);
			}}
			onLongPress={() => {
				onLongPress(item);
			}}
		>
			<MaskedView
				maskElement={<View pointerEvents="none" style={styles.maskedArea} />}
				style={[StyleSheet.absoluteFill]}
			>
				<LinearGradient
					colors={[theme.complementary, theme.primary]}
					pointerEvents="none"
					style={styles.gradientArea}
				/>
			</MaskedView>
			<View style={styles.avatarArea}>
				<Image
					source={{
						uri: item.avatarUrl,
					}}
					style={styles.image}
				/>
			</View>
		</Pressable>
	);
}

export default PinnedUserView;

const styles = StyleSheet.create({
	root: {
		flex: 1,
		marginBottom: 8,
		maxWidth: '25%',
		width: 72,
		height: 72,
	},
	maskedArea: {
		borderWidth: 1.75,
		borderRadius: '100%',
		height: 72,
		width: 72,
		margin: 'auto',
	},
	gradientArea: {
		height: 92,
		width: 92,
	},
	avatarArea: {
		width: 62,
		height: 62,
		margin: 'auto',
		justifyContent: 'center',
	},
	image: {
		borderRadius: 62 / 2,
		width: 62,
		height: 62,
	},
});

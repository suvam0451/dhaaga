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
			style={{
				flex: 1,
				marginBottom: 8,
				maxWidth: '25%',
				width: 72,
				height: 72,
			}}
			onPress={() => {
				onPress(item);
			}}
			onLongPress={() => {
				onLongPress(item);
			}}
		>
			<MaskedView
				maskElement={
					<View
						pointerEvents="none"
						style={[
							{
								borderWidth: 1.75,
								borderRadius: '100%',
								height: 72,
								width: 72,
								margin: 'auto',
							},
						]}
					/>
				}
				style={[StyleSheet.absoluteFill]}
			>
				<LinearGradient
					colors={['red', 'orange']}
					pointerEvents="none"
					style={{ height: 92, width: 92 }}
				/>
			</MaskedView>
			<View
				style={{
					width: 62,
					height: 62,
					margin: 'auto', // alignSelf: 'center',
					justifyContent: 'center',
				}}
			>
				<View
					style={{
						borderRadius: '100%',
						overflow: 'hidden',
						borderColor: theme.complementary,
						opacity: 0.78,
					}}
				>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{
							uri: item.avatarUrl,
						}}
						style={{
							borderRadius: 62 / 2,
							width: 62,
							height: 62,
						}}
					/>
				</View>
			</View>
		</Pressable>
	);
}

export default PinnedUserView;

import { View } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
	userId: string;
	onScroll: any;
	animatedStyle: any;
};

function UserProfileMiscellaneous({ userId, onScroll, animatedStyle }: Props) {
	return (
		<Animated.FlatList
			data={[]}
			renderItem={({ item }) => <View />}
			ListEmptyComponent={<View></View>}
			onScroll={onScroll}
		/>
	);
}

export default UserProfileMiscellaneous;

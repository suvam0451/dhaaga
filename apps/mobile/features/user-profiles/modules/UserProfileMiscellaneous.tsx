import { View } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
	forwardedRef: any;
	userId: string;
	onScroll: any;
};

function UserProfileMiscellaneous({ forwardedRef, onScroll }: Props) {
	return (
		<Animated.FlatList
			ref={forwardedRef}
			data={[]}
			renderItem={({ item }) => <View />}
			ListEmptyComponent={<View></View>}
			onScroll={onScroll}
		/>
	);
}

export default UserProfileMiscellaneous;

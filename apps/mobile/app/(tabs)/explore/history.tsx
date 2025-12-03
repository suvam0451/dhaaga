import { View } from 'react-native';
import { AnimatedFlashList } from '@shopify/flash-list';
import TopNavbarGeneric from '#/components/shared/topnavbar/fragments/TopNavbarGeneric';

function Page() {
	const history = [];
	return (
		<View>
			<AnimatedFlashList
				data={history}
				renderItem={({ item }) => <div>{item}</div>}
			/>
		</View>
	);
}

export default Page;

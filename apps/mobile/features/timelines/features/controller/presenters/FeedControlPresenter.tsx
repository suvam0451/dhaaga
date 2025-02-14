import useApiGetFeedDetails from '../interactors/useApiGetFeedDetails';
import { View, Text } from 'react-native';

type Props = {
	uri: string;
};

function FeedControlPresenter({ uri }: Props) {
	const { data, isFetched, error, toggleSubscription, toggleLike, togglePin } =
		useApiGetFeedDetails(uri);

	if (!isFetched || error) return <View />;
	return (
		<View>
			{data.subscribed ? (
				<View>
					<Text>Subscribed</Text>
				</View>
			) : (
				<View>
					<Text>Subscribe</Text>
				</View>
			)}
		</View>
	);
}

export default FeedControlPresenter;

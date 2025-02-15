import useApiGetFeedDetails from '../interactors/useApiGetFeedDetails';
import { View } from 'react-native';
import { CurrentRelationView } from '../../../../../components/lib/Buttons';
import { appDimensions } from '../../../../../styles/dimensions';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../../types/app.types';

type Props = {
	uri: string;
};

function FeedControlPresenter({ uri }: Props) {
	const [SubscriptionLoading, setSubscriptionLoading] = useState(false);
	const [PinStatusLoading, setPinStatusLoading] = useState(false);
	const { data, isFetched, error, toggleSubscription, togglePin } =
		useApiGetFeedDetails(uri);
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	function toggleFeedSubscription() {
		setSubscriptionLoading(true);
		toggleSubscription().finally(() => {
			setSubscriptionLoading(false);
		});
	}

	function toggleFeedPin() {
		setPinStatusLoading(true);
		togglePin().finally(() => {
			setPinStatusLoading(false);
		});
	}

	if (!isFetched || error) return <View />;
	return (
		<View
			style={{
				flexDirection: 'row',
				marginTop: appDimensions.timelines.sectionBottomMargin * 2,
			}}
		>
			<CurrentRelationView
				loading={!isFetched || SubscriptionLoading}
				onPress={toggleFeedSubscription}
				variant={data.subscribed ? 'info' : 'cta'}
				label={
					data.subscribed
						? t(`feed.unsubscribeOption`)
						: t(`feed.subscribeOption`)
				}
				style={{ flex: 1, marginRight: 4 }}
			/>
			<CurrentRelationView
				loading={!isFetched || PinStatusLoading}
				onPress={toggleFeedPin}
				variant={data.subscribed ? (data.pinned ? 'info' : 'cta') : 'blank'}
				label={data.pinned ? t(`feed.unpinOption`) : t(`feed.pinOption`)}
				style={{ flex: 1, marginLeft: 4 }}
			/>
		</View>
	);
}

export default FeedControlPresenter;

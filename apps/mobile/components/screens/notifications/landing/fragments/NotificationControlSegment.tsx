import { memo, useRef } from 'react';
import { DhaagaJsNotificationType } from '@dhaaga/bridge';
import ControlSegment from '../../../../widgets/feed-controller/components/ControlSegment';
import { View } from 'react-native';
import useHookLoadingState from '../../../../../states/useHookLoadingState';

/**
 * Set which notifications you would
 * like to be notified of
 */
const NotificationControlSegment = memo(() => {
	const { State } = useHookLoadingState();
	const NotificationFilters = useRef(new Set(['all']));

	return (
		<View>
			<ControlSegment
				hash={State}
				selection={NotificationFilters.current}
				// label={'User Interactions'}
				buttons={[
					{
						label: 'All',
						lookupId: 'all',
						onClick: () => {},
					},
					{
						label: 'Mentions',
						lookupId: DhaagaJsNotificationType.MENTION,
						onClick: () => {},
					},
					{
						label: 'Boosts',
						lookupId: DhaagaJsNotificationType.REBLOG,
						onClick: () => {},
					},
					{
						label: 'Reactions',
						lookupId: DhaagaJsNotificationType.FAVOURITE,
						onClick: () => {},
					},
					{
						label: 'Social',
						lookupId: DhaagaJsNotificationType.FAVOURITE,
						onClick: () => {},
					},
					{
						label: 'Misc',
						lookupId: DhaagaJsNotificationType.FAVOURITE,
						onClick: () => {},
					},
				]}
			/>
		</View>
	);
});

export default NotificationControlSegment;

import { memo, useEffect } from 'react';
import { View } from 'react-native';
import usePinnedPosts from '../../../../../common/user/api/usePinnedPosts';
import WithAppTimelineDataContext, {
	useAppTimelinePosts,
} from '../../../../../../hooks/app/timelines/useAppTimelinePosts';
import FlashListPosts from '../../../../../shared/flash-lists/FlashListPosts';
import { useActivityPubRestClientContext } from '../../../../../../states/useActivityPubRestClient';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import ProfileModuleFactory from './ProfileModuleFactory';

type Props = {
	userId: string;
};

function Core({ userId }: Props) {
	const { Data } = usePinnedPosts(userId);
	const { addPosts, listItems, clear } = useAppTimelinePosts();

	useEffect(() => {
		clear();
	}, [userId]);

	useEffect(() => {
		addPosts(Data);
	}, [Data]);

	return (
		<ProfileModuleFactory
			style={{
				paddingHorizontal: 8,
			}}
			label={'Pinned Posts'}
			subtext={`${Data.length}`}
		>
			<FlashListPosts data={listItems} paddingTop={0} />
		</ProfileModuleFactory>
	);
}

const ProfilePinnedPosts = memo(({ userId }: Props) => {
	const { domain } = useActivityPubRestClientContext();

	if (domain === KNOWN_SOFTWARE.BLUESKY) return <View />;
	return (
		<WithAppTimelineDataContext>
			<Core userId={userId} />
		</WithAppTimelineDataContext>
	);
});

export default ProfilePinnedPosts;

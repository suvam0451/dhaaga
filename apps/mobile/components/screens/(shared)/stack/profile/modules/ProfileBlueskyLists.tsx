import { memo } from 'react';
import { useActivityPubRestClientContext } from '../../../../../../states/useActivityPubRestClient';
import ProfileModuleFactory from './ProfileModuleFactory';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { View, Text } from 'react-native';

type Props = {
	userId: string;
};

const Core = memo(({ userId }: Props) => {
	return (
		<ProfileModuleFactory
			style={{
				paddingHorizontal: 8,
			}}
			label={'Lists'}
			subtext={`${0}`}
		>
			<View>
				<Text></Text>
			</View>
		</ProfileModuleFactory>
	);
});

const ProfileBlueskyLists = memo(({ userId }: Props) => {
	const { domain } = useActivityPubRestClientContext();

	if (domain !== KNOWN_SOFTWARE.BLUESKY) return <View />;
	return <Core userId={userId} />;
});

export default ProfileBlueskyLists;

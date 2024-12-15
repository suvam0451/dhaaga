import { memo } from 'react';
import ProfileModuleFactory from './ProfileModuleFactory';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { View, Text } from 'react-native';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

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
	const { driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
		})),
	);

	if (driver !== KNOWN_SOFTWARE.BLUESKY) return <View />;
	return <Core userId={userId} />;
});

export default ProfileBlueskyLists;

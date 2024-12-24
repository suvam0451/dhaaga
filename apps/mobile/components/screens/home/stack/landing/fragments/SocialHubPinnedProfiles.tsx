import { StyleProp, ViewStyle } from 'react-native';
import { SocialHubPinSectionContainer } from './_factory';
import { ProfilePinnedUser } from '../../../../../../database/_schema';
import { Dispatch } from 'react';
import { socialHubTabReducerAction } from '../../../../../../states/reducers/social-hub-tab.reducer';
import { AppFlashList } from '../../../../../lib/AppFlashList';

type SocialHubPinnedTimelinesProps = {
	items: ProfilePinnedUser[];
	refresh: () => void;
	isRefreshing: boolean;
	dispatch: Dispatch<socialHubTabReducerAction>;
	style: StyleProp<ViewStyle>;
};

function SocialHubPinnedProfiles({
	items,
	refresh,
	isRefreshing,
	dispatch,
	style,
}: SocialHubPinnedTimelinesProps) {
	return (
		<SocialHubPinSectionContainer label={'Profiles'} style={style}>
			<AppFlashList.PinnedProfiles data={items} />
		</SocialHubPinSectionContainer>
	);
}

export default SocialHubPinnedProfiles;

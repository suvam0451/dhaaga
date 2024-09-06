import { memo } from 'react';
import useMyProfile from '../api/useMyProfile';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithActivitypubUserContext from '../../../../states/useProfile';
import { ProfileContextWrapped } from '../../../common/user/Profile';

// const MyProfileTag = memo(() => {});

const MyProfile = memo(() => {
	const { Data } = useMyProfile();
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<WithActivitypubUserContext userI={Data}>
			<ProfileContextWrapped />
		</WithActivitypubUserContext>
	);
});

export default MyProfile;

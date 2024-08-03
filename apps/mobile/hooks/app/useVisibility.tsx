import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Octicons from '@expo/vector-icons/Octicons';

export enum APP_POST_VISIBILITY {
	PUBLIC = 'Public', // same in misskey
	UNLISTED = 'Home', // Home/Unlisted
	DIRECT = 'Direct', // same as "specified" in misskey
	PRIVATE = 'Followers', // Private/Followers
}

function useAppVisibility(visibility: APP_POST_VISIBILITY) {
	return useMemo(() => {
		switch (visibility) {
			case APP_POST_VISIBILITY.PUBLIC: {
				return {
					text: APP_POST_VISIBILITY.PUBLIC,
					icon: <FontAwesome6 name="globe" size={16} color={'#888'} />,
					desc: 'Visible to all users',
				};
			}

			case APP_POST_VISIBILITY.UNLISTED: {
				return {
					text: APP_POST_VISIBILITY.UNLISTED,
					icon: <FontAwesome5 name="home" size={16} color={'#888'} />,
					desc: 'Home timeline only',
				};
			}
			case APP_POST_VISIBILITY.PRIVATE: {
				return {
					text: APP_POST_VISIBILITY.PRIVATE,
					icon: <FontAwesome5 name="lock" size={16} color={'#888'} />,
					desc: 'Followers only',
				};
			}
			case APP_POST_VISIBILITY.DIRECT: {
				return {
					text: APP_POST_VISIBILITY.DIRECT,
					icon: <Octicons name="mention" size={16} color={'#888'} />,
					desc: 'Mentioned users only',
				};
			}
			default:
				return {
					icon: (
						<Ionicons
							name="earth-outline"
							size={16}
							color={'#888'}
							style={{
								opacity: 0.6,
							}}
						/>
					),
				};
		}
	}, [visibility]);
}

export default useAppVisibility;

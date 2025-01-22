import { AppUserObject } from '../../../types/app-user.types';
import { View } from 'react-native';
import { TextContentView } from '../../../components/common/status/TextContentView';
import { Image, useImage } from 'expo-image';
import { AppText } from '../../../components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';

type Props = {
	user: AppUserObject;
};

function UserPinSearchResultView({ user }: Props) {
	const img = useImage(user.avatarUrl);

	if (!img) return <View />;
	return (
		<View
			style={{
				paddingHorizontal: 10,
				flex: 1,
				overflow: 'hidden',
				marginRight: 8,
			}}
		>
			<View style={{ flexDirection: 'row' }}>
				<View>
					{/*@ts-ignore-next-line*/}
					<Image
						source={img}
						style={{ width: 42, height: 42, borderRadius: 42 / 2 }}
					/>
				</View>
				<View style={{ marginLeft: 8 }}>
					<TextContentView
						tree={user.parsedDisplayName}
						variant={'displayName'}
						mentions={[]}
						emojiMap={user.calculated.emojis}
					/>
					<AppText.Medium
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
						style={{ fontSize: 13 }}
					>
						{user.handle}
					</AppText.Medium>
				</View>
			</View>
		</View>
	);
}

export default UserPinSearchResultView;

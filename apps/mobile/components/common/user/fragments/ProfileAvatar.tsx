import { memo } from 'react';
import { Image } from 'expo-image';
import { StyleProp, View, ViewStyle } from 'react-native';

type ProfileAvatarProps = {
	containerStyle: StyleProp<ViewStyle>;
	imageStyle: any;
	uri: string;
};
const ProfileAvatar = memo(
	({ containerStyle, imageStyle, uri }: ProfileAvatarProps) => {
		return (
			<View style={containerStyle}>
				<Image source={{ uri }} style={imageStyle} />
			</View>
		);
	},
);

export default ProfileAvatar;

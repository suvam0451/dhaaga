import { memo } from 'react';
import { useAppTheme } from '../../../../../../hooks/app/useAppThemePack';
import { View } from 'react-native';
import { Image } from 'expo-image';

const SocialHubAssistant = memo(() => {
	const { activePack } = useAppTheme();

	if (activePack.valid && activePack.homeAssistant) {
		return (
			<View style={{ position: 'absolute', bottom: 0, right: 0 }}>
				<View style={{ marginRight: 16, marginBottom: -4 }}>
					{/*@ts-ignore-next-line*/}
					<Image
						source={{ uri: activePack.homeAssistant.localUri }}
						style={{ height: 96, width: 96 }}
					/>
				</View>
			</View>
		);
	}
	return <View />;
});

export default SocialHubAssistant;

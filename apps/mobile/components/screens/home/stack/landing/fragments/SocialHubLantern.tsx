import { memo } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

const LANTERN_SIZE = 96;
/**
 * The lantern appears on top-right
 * of the social hub landing page
 */
const SocialHubLantern = memo(() => {
	return <View />;

	// if (activePack.valid && activePack.homeLantern) {
	// 	return (
	// 		<View
	// 			style={{
	// 				position: 'absolute',
	// 				width: '100%',
	// 			}}
	// 		>
	// 			<View style={{ marginLeft: 'auto', zIndex: 99 }}>
	// 				{/*@ts-ignore-next-line*/}
	// 				<Image
	// 					source={{ uri: activePack.homeLantern.localUri }}
	// 					style={{ height: LANTERN_SIZE, width: LANTERN_SIZE }}
	// 				/>
	// 			</View>
	// 		</View>
	// 	);
	// }
});

export default SocialHubLantern;

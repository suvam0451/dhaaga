import ChristmasSantaHat from '#/skins/christmas/decorators/ChristmasSantaHat';
import { View } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { useMemo } from 'react';
import Avatar from '#/ui/Avatar';

const TIMELINE_PFP_SIZE = 40; // appDimensions.timelines.avatarIconSize;

function ThemedMainAuthor({
	uri,
	onPress,
}: {
	uri: string;
	onPress: () => void;
}) {
	const { theme } = useAppTheme();
	const Decoration = useMemo(() => {
		switch (theme.id) {
			case 'winter':
			case 'white_album':
			case 'christmas': {
				return (
					<View
						style={{
							position: 'absolute',
							width: 48,
							height: 48,
							zIndex: 1,
							top: -TIMELINE_PFP_SIZE + 12,
							left: -12,
							transform: [{ scaleX: -1 }],
						}}
					>
						<ChristmasSantaHat />
					</View>
				);
			}
			default:
				return <View />;
		}
	}, [theme.id]);

	return (
		<View style={{ position: 'relative' }}>
			{Decoration}
			<Avatar uri={uri} onPressed={onPress} />
		</View>
	);
}

export default ThemedMainAuthor;

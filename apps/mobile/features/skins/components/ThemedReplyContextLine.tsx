import { useAppTheme } from '#/states/global/hooks';
import { View, StyleSheet } from 'react-native';
import CandyCaneLine from '#/skins/christmas/decorators/ChristmasCandyCane';
import { useState } from 'react';

function ThemedReplyContextLine() {
	const { theme } = useAppTheme();
	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	switch (theme.id) {
		case 'christmas':
		case 'winter':
		case 'white_album':
		case 'white_album_2':
			return (
				<View style={styles.root}>
					<View onLayout={onLayout} style={styles.christmasCane}>
						<CandyCaneLine height={ContainerHeight} />
					</View>
				</View>
			);
		default:
			return (
				<View style={styles.root}>
					<View
						style={[
							styles.defaultLine,
							{
								backgroundColor: theme.background.a50,
							},
						]}
					/>
				</View>
			);
	}
}

export default ThemedReplyContextLine;

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		height: '100%',
		left: 18,
	},
	christmasCane: {
		flex: 1,
		marginTop: 52,
		marginBottom: 8,
		width: 4,
		overflow: 'hidden',
		borderRadius: 64,
		opacity: 0.67,
	},
	defaultLine: {
		flex: 1,
		marginTop: 52,
		marginBottom: 8,
		width: 1.5,
	},
});

import { useState } from 'react';
import { MARGIN_TOP } from '../common/media/_common';
import { Pressable, View } from 'react-native';
import AltText from '../dialogs/AltText';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../styles/AppTheme';

type Props = {
	altText?: string;
	children: any;
};

function MediaContainerWithAltText({ altText, children }: Props) {
	const [IsWidgetVisible, setIsWidgetVisible] = useState(false);

	function onAltTextClicked() {
		setIsWidgetVisible(true);
	}

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				position: 'relative',
				marginTop: MARGIN_TOP,
			}}
		>
			<View
				style={{
					width: '100%',
				}}
			>
				{children}
			</View>
			<AltText
				text={altText}
				IsVisible={IsWidgetVisible}
				setIsVisible={setIsWidgetVisible}
			/>
			{altText && (
				<View
					style={{
						position: 'absolute',
						top: '100%',
						left: '0%',
						zIndex: 99,
					}}
				>
					<View style={{ position: 'relative' }}>
						<Pressable
							style={{
								position: 'absolute',
								top: -40,
								left: 8,
								backgroundColor: 'rgba(100, 100, 100, 0.87)',
								padding: 4,
								borderRadius: 8,
							}}
							onPress={onAltTextClicked}
						>
							{/*<Text>ALT</Text>*/}
							<FontAwesome5
								name="info-circle"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</Pressable>
					</View>
				</View>
			)}
		</View>
	);
}

export default MediaContainerWithAltText;

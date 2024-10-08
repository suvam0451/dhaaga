import { ScrollView, View } from 'react-native';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../styles/AppFonts';

type Props = {
	label?: string;
	buttons: {
		lookupId: string;
		label: string;
		onClick: () => void;
	}[];
	selection: Set<string>;
	hash: string;
};

function ControlSegment({ label, buttons, selection }: Props) {
	return (
		<View style={{ marginTop: 16, overflow: 'scroll' }}>
			{label && (
				<Text
					style={{
						fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
						color: APP_FONT.MONTSERRAT_BODY,
						marginBottom: 4,
					}}
				>
					{label}
				</Text>
			)}
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					{buttons.map((o, i) => (
						<View
							key={i}
							style={{
								borderRadius: 8,
								backgroundColor: selection.has(o.lookupId)
									? 'rgba(170, 170, 170, 0.87)'
									: '#1e1e1e',
								padding: 8,
								marginRight: 8,
							}}
							onTouchEnd={o.onClick}
						>
							<Text
								style={{
									color: selection.has(o.lookupId)
										? 'rgba(0, 0, 0, 1)'
										: APP_FONT.MONTSERRAT_BODY,
									fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
								}}
							>
								{o.label}
							</Text>
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
}

export default ControlSegment;
